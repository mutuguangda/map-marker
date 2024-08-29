"use client"

import * as React from 'react'
import { PointType } from '../types'
import { getPointDetailFromNotion } from '../api'

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

  return (
    <div>WIP</div>
  )
}
