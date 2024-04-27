"use client"

import * as React from 'react'
import { Render } from '@9gustin/react-notion-render'
import { PointType } from '../types'
import { getPointDetailFromNotion } from '../api'
import '@9gustin/react-notion-render/dist/index.css'

type PropsType = {
  point: PointType
}

export default function PointDetail({ point }: PropsType) {
  const [blocks, setBlocks] = React.useState<any[]>([])

  React.useEffect(() => {
    getPointDetailFromNotion(point).then(res => {
      setBlocks(res.results)
    })
  }, [point])

  return <Render blocks={blocks} />
}
