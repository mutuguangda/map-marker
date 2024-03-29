import * as React from 'react'

type Props = {}

export default function Ifrme({}: Props) {
  return (
    <iframe src='http://localhost:3000' className='w-screen h-screen'></iframe>
  )
}
