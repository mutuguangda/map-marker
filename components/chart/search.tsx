"use client"
import { useRef } from "react"
import { InputSearch } from "../ui/input-search"
import { ScrollArea } from "../ui/scroll-area"

interface PropsType {
  preview?: boolean
}

export function Search({ preview = false }: PropsType) {
  const inputSearch = useRef<HTMLInputElement | null>(null)
  const scrollContainer = useRef<HTMLDivElement | null>(null)

  return (
    <div className="bg-background w-96 absolute left-5 top-5 z-50 rounded-md shadow">
      <InputSearch ref={inputSearch} placeholder="搜索地点" />
      <ScrollArea className="mt-2">
      {/* <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
        {positions.map((position, index) => {
          return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
        })}
      </div> */}
      <div className="!left-0 !top-0 !min-w-full" ref={scrollContainer}></div>
    </ScrollArea>
  </div>
  )
}
