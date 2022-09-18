import { readdir, stat } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

function genFileJson(fullpath, filename, sourceDir, stats) {
  const path = relative(sourceDir, fullpath)

  const dir = resolve('/', path, '..')

  const {
    birthtimeMs: birthtime,
    ctimeMs: updateTime,
    size
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
    meta
  }
}


function genDirJson(fullpath, dirname, sourceDir, _stats) {
  const path = relative(sourceDir, fullpath)
  const dir = resolve('/', path, '..')
  return {
    dir,
    path,
    dirname,
    fullpath,
  }
}

async function traverseDir(sourceDir, files, dirs, dir = sourceDir) {
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


export default async function gen(sourceDir) {

  const files = [], dirs = []

  await traverseDir(sourceDir, files, dirs)

  return {
    dirs,
    files,
  }
}






