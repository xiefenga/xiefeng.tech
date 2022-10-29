import React from 'react'
import { useRouter } from 'next/router'
import styles from './index.module.css'

interface DirViewProp {
  dirname: string
  path: string
}

const DirView: React.FC<DirViewProp> = (prop) => {
  const { dirname, path } = prop
  const router = useRouter()
  const onClick = () => {
    router.push(`/notes/${path.slice(1)}`)
  }
  return (
    <div className={styles.panel} onClick={onClick}>
      <div className={styles.icon}>
        <svg viewBox="0 0 1024 1024" fill="currentColor" aria-label="project icon">
          <path d="M987.456 425.152H864V295.296a36.48 36.48 0 0 0-36.544-36.544h-360l-134.08-128.256A9.344 9.344 0 0 0 327.04 128H36.48A36.48 36.48 0 0 0 0 164.544v676.608a36.48 36.48 0 0 0 36.544 36.544h797.76a36.672 36.672 0 0 0 33.92-22.848L1021.44 475.52a36.48 36.48 0 0 0-33.92-50.304zM82.304 210.304h215.424l136.64 130.752h347.328v84.096H198.848A36.672 36.672 0 0 0 164.928 448L82.304 652.8V210.304zM808.32 795.456H108.544l118.08-292.608h699.904L808.32 795.52z">
          </path>
        </svg>
      </div>
      <div className={styles.title}>
        {dirname}
      </div>
    </div>
  )
}

export default DirView