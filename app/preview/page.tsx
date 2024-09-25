"use client"
import * as React from 'react'
import MapContainer, { BMapOptionType } from '@/app/amap'
import { listPointFromNotion } from '../api'
import { useImmer } from 'use-immer'

export default function Page() {
  const [mapOption, setMapOption] = useImmer<BMapOptionType>({
    mapStyle: process.env.BMAP_STYLE_ID,
    points: [],
  })

  React.useEffect(() => {
    listPointFromNotion().then((res) => {
      setMapOption((draft) => {
        draft.points = res;
      })
    });
  }, [setMapOption])

  return (
    <MapContainer className="w-screen h-screen" option={mapOption} preview={true} />
  )
}
