/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Stats } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { readdir, stat, writeFile, mkdir, access } from 'node:fs/promises'

function genFileJson(
  fullpath: string,
  filename: string,
  sourceDir: string,
  stats: Stats
) {
  const path = relative(sourceDir, fullpath)

  const dir = resolve('/', path, '..')

  const {
    birthtimeMs: birthtime,
    ctimeMs: updateTime,
    size,
  } = stats

  const meta = {
    size,
    birthtime,
    updateTime,
  }
  return {
    dir,
    path,
    filename,
    fullpath,
    meta,
  }
}


function genDirJson(
  fullpath: string,
  dirname: string,
  sourceDir: string,
  _stats: Stats
) {
  const path = relative(sourceDir, fullpath)
  const dir = resolve('/', path, '..')
  return {
    dir,
    path,
    dirname,
    fullpath,
  }
}

async function traverseDir(
  sourceDir: string,
  files: FileJson[],
  dirs: DirJson[],
  dir: string = sourceDir
) {
  const allFiles = await readdir(dir)
  // filter ignore
  const filenames = allFiles.filter(file => !file.startsWith('.'))
  for (const filename of filenames) {
    const path = join(dir, filename)
    const meta = await stat(path)
    if (meta.isFile()) {
      files.push(genFileJson(path, filename, sourceDir, meta))
    } else {
      dirs.push(genDirJson(path, filename, sourceDir, meta))
      await traverseDir(sourceDir, files, dirs, path)
    }
  }
}

export type FileJson = {
  dir: string
  path: string
  filename: string
  fullpath: string
  meta: {
    size: number,
    birthtime: number,
    updateTime: number,
  }
}

export type DirJson = {
  dir: string
  path: string
  dirname: string
  fullpath: string
}

let gen = false

export async function getFiles(sourceDir: string) {

  // console.log(process.cwd())

  // if (!gen) {
  //   return await init(sourceDir)
  // }

  // const jsons = await Promise.all([
  //   readFile('./files.json', 'utf-8'),
  //   readFile('./dirs.json', 'utf-8')
  // ])

  // const [files, dirs] = jsons.map(json => JSON.parse(json)) as [FileJson[], DirJson[]]

  const files: FileJson[] = [], dirs: DirJson[] = []

  await traverseDir(sourceDir, files, dirs)

  return {
    dirs,
    files,
  }
}

export async function init(sourceDir: string) {

  const files: FileJson[] = [], dirs: DirJson[] = []

  await traverseDir(sourceDir, files, dirs)

  try {
    await access('./.next/__custom_temp__/')
  } catch (error) {
    console.log(error)
    await mkdir('./.next/__custom_temp__/')
  }

  await Promise.all([
    writeFile('./.next/__custom_temp__/files.json', JSON.stringify(files, null, 2)),
    writeFile('./.next/__custom_temp__/dirs.json', JSON.stringify(dirs, null, 2)),
  ])

  gen = true

  return {
    dirs,
    files,
  }
}





