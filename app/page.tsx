"use client";
import { KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
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

  // 会触发视图更新
  const [_, _copyToClipboard] = useCopyToClipboard();
  const copyToClipboard = useCallback((s: string) => {
    _copyToClipboard(s)
  }, [_copyToClipboard]);
  const { toast } = useToast()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        const hash = utoa(JSON.stringify(currentOption))
        const url = `${window.location.origin}/m/#${hash}`
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
    <MapContainer className="main" option={currentOption} />
  );
}
