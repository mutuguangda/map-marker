"use client";
import { CSSProperties, KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import china from "./map.json";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader} from "@/components/ui/card"
import data from './data.json'
import { useClickAway } from "react-use";

export default function Home() {
  let chart = useRef<echarts.ECharts | null>(null)
  const baseOption = useRef<echarts.EChartsOption>({
    series: [
      {
        type: "map",
        map: "china",
        scaleLimit: {
          min: 1,
          max: 10,
        },
        label: {
          fontSize: 12,
          fontFamily: "'Inter', 'LXGW WenKai Screen'",
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
          data: [{
            name: '具体地址',
            coord: [116.482086,39.990496]
          }],
          itemStyle: {
            color: 'rgba(100, 0, 0)'
          }
        },
      },
    ],
  });
  const [points, setPoints] = useState<Recordable[]>([])

  const map = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<Recordable[]>(data.geocodes)
  const popup = useRef(null)
  useClickAway(popup, () => {
    if (popupStyle.display === 'none') {
      return
    }
    setPopupStyle({ display: 'none' })
    setOption({ series: [{ roam: true }] })
  })
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({ display: 'none' })
  const memoizedSetPopupStyle = useCallback((style: CSSProperties) => {
    setPopupStyle(style);
  }, [setPopupStyle]);

  // @ts-ignore
  echarts.registerMap("china", china);

  useEffect(() => {
    chart.current = echarts.init(map?.current);
    setOption(baseOption.current);
    console.log('重新渲染')
  
    chart.current.on('click', (params) => {
      const { event} = params
      memoizedSetPopupStyle({ left: `${event?.offsetX}px`, top: `${event?.offsetY}px` })
      setOption({ series: [{ roam: false, }] })
    })
  }, [baseOption, memoizedSetPopupStyle]);

  const handleKeyDown : KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== 'Enter') {
      return
    }

    const input = (e.target as unknown as any).value
    if (!input) {
      return
    }
    fetch(`https://restapi.amap.com/v3/geocode/geo?address=${input}&output=JSON&key=9e916cb1a5436f165a8317d249c99e39	`).then(res => res.json()).then(data => {
      console.log('data',data)
      setPositions(data.geocodes)
    })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const _point = { name: position['formatted_address'], coord: position.location.split(',') }
    setPoints([...points, _point])
    setOption({ series: [{ markPoint: { data: [_point] } }] })
  }

  const setOption = (option: echarts.EChartsOption) => {
    chart.current?.setOption(option)
  }

  return (
    <div className="flex">
      <div className="panel w-64">
        <Input onKeyDown={handleKeyDown} />
        <div className="flex flex-col gap-2" onClick={handleClick}>
          {positions.map((position, index) => {
            return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
          })}
        </div>
      </div>
      <div className="relative">
        <div ref={map} className="main"></div>
        {/* 地图标点浮窗，点击后展示 */}
        <Card ref={popup} className="absolute left-0 top-0" style={popupStyle}>
          <CardHeader>Hello World</CardHeader>
          <CardContent>I am Card Content</CardContent>
        </Card>
      </div>
    </div>
  );
}
