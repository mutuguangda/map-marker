/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef, useState } from "react"
import { InputSearch } from "../ui/input-search"
import { ScrollArea } from "../ui/scroll-area"
import { PointType } from "./types"

interface PropsType {
  preview?: boolean,
  AMap: typeof AMap | null
}

export function Search({ preview = false }: PropsType) {
  if (preview) return

  const inputSearch = useRef<HTMLInputElement | null>(null)
  const scrollContainer = useRef<HTMLDivElement | null>(null)
  
  const [positions, setPositions] = useState<Recordable[]>([])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputSearch.current?.focus()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  useEffect(() => {
    
  })

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const point: PointType = {
      title: position['formatted_address'],
      position: position.location.split(',').map(parseFloat) as any,
      description: ''
    }
    // setPoint(point)
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

  return (
    <div className="w-96 absolute left-5 top-5 z-50 ">
      <div className="bg-background rounded-md">
        <InputSearch ref={inputSearch} placeholder="搜索地点" />
      </div>
      <ScrollArea className="mt-2">
      <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
        {positions.map((position, index) => {
          return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
        })}
      </div>
      <div className="!left-0 !top-0 !min-w-full" ref={scrollContainer}></div>
    </ScrollArea>
  </div>
  )
}
