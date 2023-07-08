import React from 'react'
import dynamic from 'next/dynamic'

const NoSSRRender: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export const NoSSRComponent = dynamic(() => Promise.resolve(NoSSRRender), { ssr: false })

export const NoSSRHOC = <T, >(Component: React.ComponentType<T>) => {
  return dynamic(() => Promise.resolve(Component), { ssr: false })
}