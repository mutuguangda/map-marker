"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { useToast } from "@/components/ui/use-toast";
import { atou, utoa } from "./utils";
import MapContainer, { BMapOptionType } from "@/components/chart/amap";

export default function Home() {
  const hash = useRef(typeof window !== 'undefined' ? window.location.hash : '')
  const baseOption = useRef<BMapOptionType>({
    mapStyle: process.env.BMAP_STYLE_ID,
    points: {}
  })
  if (hash.current) {
    try {
      baseOption.current = JSON.parse(atou(hash.current.slice(1)))
    } catch {
      console.log('无效的 hash', hash.current)
    }
  }

  // 会触发视图更新
  const [_, copyToClipboard] = useCopyToClipboard();
  const { toast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const hash = utoa(JSON.stringify(baseOption.current))
        const url = `${location.origin}/preview#${hash}`
        copyToClipboard(url)
        toast({
          title: '已导出到剪贴板',
          description: (
            <div className="whitespace-preline truncate">
              <a href={url} target="_blank">{url}</a>
            </div>
          )
        })
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  return (
    <MapContainer className="w-screen h-screen" option={baseOption.current} />
  );
}
