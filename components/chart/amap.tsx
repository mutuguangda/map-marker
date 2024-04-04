"use client"
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import AMapLoader from "@amap/amap-jsapi-loader";
import '@amap/amap-jsapi-types';
import { Input } from "../ui/input";
import { InputSearch } from "../ui/input-search";
import { Button } from "../ui/button";
import { ScrollArea } from '../ui/scroll-area'
import { cloneDeep } from "lodash-es";
import { useCopyToClipboard } from "react-use";
import { useToast } from "../ui/use-toast";
import data from './data.json' 
import { utoa } from "@/app/utils";
import { Textarea } from "../ui/textarea";

interface PropsType {
  className?: string
  option: BMapOptionType
}

export interface BMapOptionType {
  points: {
    [key: string]: PointType
  }
  mapStyle: string
}

export interface PointType {
  description: string,
  title: string,
  position: [number, number]
}

export default function MapContainer({ className, option }: PropsType) {
  const el = useRef<HTMLDivElement | null>(null) 
  const map = useRef<AMap.Map | null>(null);
  const infoWindow = useRef<AMap.InfoWindow | null>(null)
  const inputSearch = useRef<HTMLInputElement | null>(null)
  const scrollContainer = useRef<HTMLDivElement | null>(null)

  const mapStyle = option.mapStyle || 'amap://styles/a927524f8e540e512b9bdea1cad3d6fb'; // 使用灰色风格

  const GMap = useRef<typeof AMap | null>(null) 

  const [positions, setPositions] = useState(data.geocodes)

  const [_, copyToClipboard] = useCopyToClipboard();

  const { toast } = useToast()

  useEffect(() => {
    // @ts-ignore
    window._AMapSecurityConfig = { securityJsCode: '4ebbc57caa8127e6c4fc6288a5782a4c' };
    AMapLoader.load({
      key: "dafe1244843ac4a6721a014970c63558",
      version: "2.0",
      plugins: ["AMap.AutoComplete"], //需要使用的的插件列表
    })
      .then((_AMap: typeof AMap) => {
        GMap.current = _AMap

        map.current = new _AMap.Map(el.current!, {
          viewMode: "2D",
          zoom: 4,
          mapStyle
        });

        infoWindow.current = new _AMap.InfoWindow({ offset: new _AMap.Pixel(0, -30) });  

        const points = option.points
        Object.keys(points).forEach((key) => {
          setPoint(points[key])
        })

        // @ts-ignore
        const autoComplete = new _AMap.AutoComplete({
          input: inputSearch.current,
          output: scrollContainer.current
        })
        autoComplete.on('select', (e: any) => {
          const { name, location } = e.poi
          const key = location.pos.join()
          if (points[key]) return
          const point = { title: name, position: location, description: '' }
          points[key] = point
          setPoint({ title: name, position: location, description: '' })
        })
        map.current.addControl(autoComplete)
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map.current?.destroy();
    };
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputSearch.current?.focus()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  function setPoint(point: BMapOptionType['points'][string]) {
    const marker = new GMap.current!.Marker({
      position: point.position,    
      map: map.current!
    })
    const element = document.createElement('div')
    // @ts-ignore
    marker.content = element
    const elementChildren = (
      <div className="flex flex-col gap-2">
        <h6 className="text-xs">{point.title}</h6>
        <Textarea
          defaultValue={point.description}
          onChange={(e) => {
            point.description = e.target.value
          }}
        />
      </div>
    )
    const root = createRoot(element)
    root.render(elementChildren)
    marker.on('click', (e) => {
      infoWindow.current?.setContent(e.target.content)
      const position = e.target.getPosition()
      setTimeout(() => {
        infoWindow.current?.open(map.current!, position);
      }, 50)
    })
    marker.emit('click', { target: marker })
  }

  return (
    <div className="w-full h-full relative">
      <div className="bg-background w-96 p-3 absolute left-5 top-5 z-50 border rounded-md">
        {/* <Button onClick={handleExport}>导出</Button> */}
        <InputSearch ref={inputSearch} />
        <ScrollArea className="mt-2">
          <div ref={scrollContainer}></div>
        </ScrollArea>
      </div>
      <div
        ref={el}
        className={className}
      />
    </div>
  );
}
