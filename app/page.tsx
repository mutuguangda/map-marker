"use client";
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
// import * as echarts from "echarts";
import { InputSearch } from "@/components/ui/input-search"
import { useCopyToClipboard } from "react-use";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cloneDeep, merge } from 'lodash-es'
import { atou, utoa } from "./utils";
import data from './data.json'
import MapContainer, { BMapOptionType, PointType } from "@/components/chart/amap";

export default function Home() {
  const baseOption = useRef<BMapOptionType>({
    mapStyle: process.env.BMAP_STYLE_ID,
    points: {}
  });
  const hash = window.location.hash
  if (hash) {
    baseOption.current = JSON.parse(atou(hash.slice(1)))
  }

  const [positions, setPositions] = useState(data.geocodes)
  const [currentOption, setCurrentOption] = useState(baseOption.current)

  const [_, copyToClipboard] = useCopyToClipboard();

  const { toast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleExport()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== 'Enter') {
      return
    }

    const input = (e.target as unknown as any).value
    if (!input) {
      return
    }
    fetch(`https://restapi.amap.com/v3/geocode/geo?address=${input}&output=JSON&key=9e916cb1a5436f165a8317d249c99e39	`).then(res => res.json()).then(data => {
      setPositions(data.geocodes)
    })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const point: PointType = { 
      title: position['formatted_address'], 
      position: position.location.split(',').map(parseFloat) as unknown as any,
      description: ''
    }
    setCurrentOption(() => {
      currentOption.points[position.location] = point
      return cloneDeep(currentOption)
    })
  }

  const handleExport = () => {
    const hash = utoa(JSON.stringify(currentOption))
    const url = `${window.location.origin}/m/#${hash}`
    copyToClipboard(url)
    toast({
      title: '已导出到剪贴板',
      description: (
        <div className="whitespace-preline">
          <a href={url} target="_blank">{url}</a>
        </div>
      )
    })
  }

  return (
    <div className="main relative">
      <div className="bg-background w-96 p-3 absolute left-5 top-5 z-50 border rounded-md">
        <Button onClick={handleExport}>导出</Button>
        <InputSearch onKeyDown={handleKeyDown} />
        <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
          {positions.map((position, index) => {
            return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
          })}
        </div>
      </div>
      <MapContainer className="w-full h-full" option={currentOption} />
    </div>
  );
}
