"use client"
import * as React from 'react'
// import { atou } from '../utils'
import MapContainer, { BMapOptionType } from '@/app/amap'
import { listPointFromNotion } from '../api'
import { useImmer } from 'use-immer'

export default function Page() {
  // const hash = typeof window !== 'undefined' ? window.location.hash: ''

  // let baseOption
  // try {
  //   baseOption = JSON.parse(atou(hash.slice(1)))
  // } catch (error) {
  //   baseOption = {}
  // }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MapContainer className="w-screen h-screen" option={mapOption} preview={true} />
  )
}
