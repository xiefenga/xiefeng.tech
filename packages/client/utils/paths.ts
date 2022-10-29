/* eslint-disable @typescript-eslint/no-explicit-any */
import { initShared } from '@/utils/shared'
import { queryNoteList } from '@/api/notes'

export const NOTE_LIST = initShared('NOTE_LIST')

export const PATH_TREE = initShared('PATH_TREE')

export const PATH_END = '__PATH_END__'


export type PathTree = {
    [path: string]: PathTree | '__PATH_END__'
}

export function PathArrayList2PathTree(pathArrayList: string[][]) {
  // const pathArrayList = pathList.map(path => path.split('/'))
  const pathTree = pathArrayList.reduce((tree, path) => (getPathTree(tree, path), tree), {} as PathTree)
  return pathTree
}

function getPathTree(map: any, path: string[]) {
  if (path.length === 1) {
    map[path[0]] = PATH_END
  } else {
    map[path[0]] ??= {} as any
    if (map[path[0]] === PATH_END) {
      throw new Error('')
    }
    getPathTree(map[path[0]], path.slice(1))
  }
}

export function pathTree2PathArrays(pathTree: PathTree) {
  const paths: string[][] = []
  paths.push([]) // for /
  getPathArrays(pathTree, [], paths)
  return paths
}

function getPathArrays(pathTree: PathTree, prefix: string[], paths: string[][]) {
  Object.entries(pathTree).forEach(([path, next]) => {
    const currentPath = prefix.concat(path)
    paths.push(currentPath)
    if(next !== PATH_END) {
      getPathArrays(next, currentPath, paths)
    }
  })
}

export async function initNotePathTree() {
  const list = await queryNoteList()

  NOTE_LIST.set(list)

  const pathArrayList = list.map(item => item.path.slice(1).split('/'))

  const pathTree = PathArrayList2PathTree(pathArrayList)

  PATH_TREE.set(pathTree)

  return pathTree
}