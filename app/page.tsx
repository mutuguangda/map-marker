"use client";
import { KeyboardEventHandler, MouseEventHandler, useRef, useState } from "react";
import * as echarts from "echarts";
import { Input } from "@/components/ui/input"
import { useCopyToClipboard } from "react-use";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cloneDeep, merge } from 'lodash-es'
import { atou, utoa } from "./utils";
import { Map } from '@/components/chart/map'
import data from './data.json'
import MapContainer from "@/components/chart/bmap";

export default function Home() {
  const baseOption = useRef<echarts.EChartsOption>({
    series:
    {
      type: "map",
      map: "china",
      scaleLimit: {
        min: 1,
        max: 10,
      },
      label: {
        fontSize: 12,
        fontFamily: "Noto Serif SC",
      },
      itemStyle: {
        areaColor: "transparent",
      },
      emphasis: {
        itemStyle: {
          areaColor: "transparent",
          borderColor: "#800",
        },
      },
      roam: true,
      zoom: 1.25,
      markPoint: {
        symbol: 'circle',
        symbolSize: 5,
        data: [],
        itemStyle: {
          color: 'rgba(100, 0, 0)'
        }
      },
    },
  });
  const hash = window.location.hash
  if (hash) {
    baseOption.current = JSON.parse(atou(hash.slice(1)))
  }

  const [positions, setPositions] = useState(data.geocodes)
  const [currentOption, setCurrentOption] = useState<echarts.EChartsOption>(baseOption.current)

  const [_, copyToClipboard] = useCopyToClipboard();

  const { toast } = useToast()

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== 'Enter') {
      return
    }

    const input = (e.target as unknown as any).value
    if (!input) {
      return
    }
    fetch(`https://restapi.amap.com/v3/geocode/geo?address=${input}&output=JSON&key=9e916cb1a5436f165a8317d249c99e39	`).then(res => res.json()).then(data => {
      console.log('data', data)
      setPositions(data.geocodes)
    })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const _point = { name: position['formatted_address'], coord: position.location.split(',') }
    console.log('currentOption',currentOption)
    // @ts-ignore
    const originPoints = currentOption.series!.markPoint.data
    setOption({ series: { markPoint: { data: [...originPoints, _point] } } })
  }

  const setOption = (option: echarts.EChartsOption) => {
    const currentOption = merge(baseOption.current, option)
    // 有没有更优雅的办法
    setCurrentOption(() => cloneDeep(currentOption))
  }

  const handleExport: MouseEventHandler<HTMLButtonElement> = (e) => {
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
        {/* <Button onClick={handleExport}>导出</Button> */}
        <Input onKeyDown={handleKeyDown} />
        <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
          {positions.map((position, index) => {
            return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
          })}
        </div>
      </div>
      <MapContainer className="w-full h-full" />
    </div>
  );
}
