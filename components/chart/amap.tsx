"use client"
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import '@amap/amap-jsapi-types';
import { InputSearch } from "../ui/input-search";
import { ScrollArea } from '../ui/scroll-area'
import { utoa } from "@/app/utils";
import { Textarea } from "../ui/textarea";

interface PropsType {
  className?: string
  option: BMapOptionType
  preview?: boolean
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

export default function MapContainer({ className, option, preview = false }: PropsType) {
  const el = useRef<HTMLDivElement | null>(null)
  const map = useRef<AMap.Map | null>(null);
  const infoWindow = useRef<AMap.InfoWindow | null>(null)
  const inputSearch = useRef<HTMLInputElement | null>(null)
  const scrollContainer = useRef<HTMLDivElement | null>(null)

  const mapStyle = option.mapStyle || 'amap://styles/a927524f8e540e512b9bdea1cad3d6fb'; // 使用灰色风格

  const GMap = useRef<typeof AMap | null>(null)

  const [positions, setPositions] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    // @ts-ignore
    window._AMapSecurityConfig = { serviceHost: `${location.origin}/_AMapService` }
    import('@amap/amap-jsapi-loader').then(AMapLoader => {
      AMapLoader.load({
        key: "dafe1244843ac4a6721a014970c63558",
        version: "2.0",
        plugins: ["AMap.AutoComplete"],
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
            setPoint(points[key], true)
          })

          // @ts-ignore
          const autoComplete = new _AMap.AutoComplete({
            input: inputSearch.current,
            output: scrollContainer.current
          })
          autoComplete.on('select', (e: any) => {
            const { name, location } = e.poi
            setPoint({ title: name, position: location, description: '' })
          })
          map.current.addControl(autoComplete)
        })
        .catch((e) => {
          console.log(e);
        });
    })

    return () => {
      map.current?.destroy();
    };
  });

  useEffect(() => {
    if (preview) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputSearch.current?.focus()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  function setPoint(point: BMapOptionType['points'][string], force: boolean = false) {
    if (!force) {
      const points = option.points
      const key = point.position.join()
      if (points[key]) {
        infoWindow.current?.open(map.current!, point.position)
        return
      }
      points[key] = point
    }

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
        {
          !preview 
            ? 
              <Textarea
                defaultValue={point.description}
                onChange={(e) => {
                  point.description = e.target.value
                  replaceUrl()
                }}
              />
            :
              <div className="text-xs">{point.description}</div>
        }
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

    replaceUrl()
  }

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== 'Enter') {
      return
    }

    const input = (e.target as unknown as any).value
    if (!input) {
      return
    }
    fetch(`https://restapi.amap.com/v3/geocode/geo?address=${input}&output=JSON&key=9e916cb1a5436f165a8317d249c99e39`).then(res => res.json()).then(data => {
      setPositions(data.geocodes)
    })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const point: PointType = {
      title: position['formatted_address'],
      position: position.location.split(',').map(parseFloat) as any,
      description: ''
    }
    setPoint(point)
  }

  const replaceUrl = () => {
    const hash = utoa(JSON.stringify(option))
    window.history.replaceState({}, '', `${location.origin}#${hash}`);
  }

  const Control = () => {
    if (preview) return
    return (
      <div className="bg-background w-96 p-3 absolute left-5 top-5 z-50 border rounded-md">
        <InputSearch ref={inputSearch} onKeyUp={handleKeyUp} />
        <ScrollArea className="mt-2">
          <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
            {positions.map((position, index) => {
              return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
            })}
          </div>
          <div ref={scrollContainer}></div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Control />
      <div
        ref={el}
        className={className}
      />
    </div>
  );
}
