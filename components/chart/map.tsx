"use client";
import { merge } from "lodash-es";
import * as React from "react";
import * as echarts from 'echarts'
import { useClickAway } from "react-use";
import { Card, CardContent, CardHeader } from "../ui/card";
import china from './geo/china.json'

interface PointType {
  name: string,
  coord: [number, number],
  description?: string
}

type PopupType = {
  style: React.CSSProperties,
} & Partial<PointType>

interface Props {
  option: echarts.EChartsOption,
  className: string,
}

const Map = React.forwardRef<HTMLDivElement, Props>(({ className, option: baseOption = {} }, _ref) => {
  let chart = React.useRef<echarts.ECharts | null>(null)
  const map = React.useRef<HTMLDivElement | null>(null);
  const popupRef = React.useRef(null)

  const [popup, setPopup] = React.useState<PopupType>({ style: { display: 'none' } })
  const memoizedSetPopupStyle = React.useCallback((_popup: PopupType) => {
    setPopup(_popup);
  }, [setPopup]);

  const setOption = React.useCallback((option: echarts.EChartsOption) => {
    chart.current?.setOption(option)
  }, [])

  // @ts-ignore
  echarts.registerMap("china", china);

  React.useEffect(() => {
    if (!chart.current) return
    setOption(baseOption)
  }, [baseOption, setOption])

  React.useEffect(() => {
    if (chart.current) return
    chart.current = echarts.init(map?.current);
    setOption(baseOption);

    chart.current.on('click', (params) => {
      const { event, componentType, data = {} } = params
      if (componentType !== 'markPoint') return
      memoizedSetPopupStyle({ ...(data as PopupType), style: { left: `${event?.offsetX}px`, top: `${event?.offsetY}px` } })
      setOption({ series: [{ roam: false, }] })
    })
  });

  useClickAway(popupRef, () => {
    if (popup.style.display === 'none') {
      return
    }
    setPopup({ style: { display: 'none' } })
    setOption({ series: [{ roam: true }] })
  })

  return (
    <div className="relative">
      <div className={className} ref={map}></div>
      {/* 地图标点浮窗，点击后展示 */}
      <Card ref={popupRef} className="absolute left-0 top-0" style={popup.style}>
        <CardHeader>{popup.name}</CardHeader>
        <CardContent>{popup.description}</CardContent>
      </Card>
    </div>
  )
}
)

Map.displayName = 'Map'

export { Map }
