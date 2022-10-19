import { join } from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { fetch } from 'undici'

const dir = '/Users/xiefeng/blogs'

const filenames = await readdir(dir)

for (const filename of filenames) {
  try {
    const { id } = (await (await fetch(`http://localhost:8080/blogs?title=${filename.split('.')[0]}`)).json()).data
    const path = join(dir, filename)
    const { data: { date } } = matter(await readFile(path, 'utf-8'))
    console.log(date);
   await fetch(`http://localhost:8080/blogs`, {
      method: 'put',
      headers: {
        'content-type':'application/json',
      },
      body: JSON.stringify({
        id,
        createTime: date
      })
    })
  } catch (error) {

  }
}

// filenames.forEach(async filename => {

  
// })


