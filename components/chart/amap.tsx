"use client"
import { useEffect, useRef } from "react";
import { createRoot } from 'react-dom/client';
import AMapLoader from "@amap/amap-jsapi-loader";
import '@amap/amap-jsapi-types';
import { Input } from "../ui/input";

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
  const mapStyle = option.mapStyle || 'amap://styles/a927524f8e540e512b9bdea1cad3d6fb'; // 使用灰色风格

  const GMap = useRef<typeof AMap | null>(null) 

  useEffect(() => {
    // @ts-ignore
    window._AMapSecurityConfig = { securityJsCode: '4ebbc57caa8127e6c4fc6288a5782a4c' };
    AMapLoader.load({
      key: "dafe1244843ac4a6721a014970c63558",
      version: "2.0",
      plugins: [],
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
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map.current?.destroy();
    };
  });

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
        <h3>{point.title}</h3>
        <Input 
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
      infoWindow.current?.open(map.current!, e.target.getPosition());
    })
    marker.emit('click', { target: marker })
  }

  return (
    <div
      ref={el}
      className={className}
    />
  );
}
