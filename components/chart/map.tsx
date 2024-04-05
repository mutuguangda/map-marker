"use client";
import * as React from "react";
import * as echarts from 'echarts/core';
import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption
} from 'echarts/charts';
import {
  TooltipComponent,
  TitleComponentOption
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  install as AMapComponent,
  AMapComponentOption
} from 'echarts-extension-amap/export';
import { useClickAway } from "react-use";
import { Card, CardContent, CardHeader } from "../ui/card";
import china from './geo/china.json'
// 引入高德地图官方提供的 2.0 类型定义文件
import '@amap/amap-jsapi-types';

// 组装所需的 option type
type ECOption = echarts.ComposeOption<
  | ScatterSeriesOption
  | EffectScatterSeriesOption
  | TitleComponentOption
  // 合并高德地图的地图初始配置项 AMap.MapOptions 到 AMapComponentOption
> & AMapComponentOption<AMap.MapOptions>;

interface PointType {
  name: string,
  coord: [number, number],
  description?: string
}

type PopupType = {
  style: React.CSSProperties,
} & Partial<PointType>

interface Props {
  option: ECOption,
  className: string,
}

// 注册渲染器、组件和图表
echarts.use([
  CanvasRenderer,
  TooltipComponent,
  AMapComponent,
  ScatterChart,
  EffectScatterChart
]);

const _baseOption: ECOption = {
  // 加载 amap 组件
  amap: {
    // 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
    viewMode: '3D',
    // 高德地图支持的初始化地图配置
    // 高德地图初始中心经纬度
    center: [108.39, 39.9],
    // 高德地图初始缩放级别
    zoom: 4,
    // 是否开启resize
    // resizeEnable: true,
    // 自定义地图样式主题
    mapStyle: 'amap://styles/dark',
    // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
    renderOnMoving: true,
    // ECharts 图层的 zIndex 默认 2000
    // 从 v1.9.0 起 此配置项已被弃用 请使用 `echartsLayerInteractive` 代替
    echartsLayerZIndex: 2019,
    // 设置 ECharts 图层是否可交互 默认为 true
    // 设置为 false 可实现高德地图自身图层交互
    // 此配置项从 v1.9.0 起开始支持
    echartsLayerInteractive: true,
    // 是否启用大数据模式 默认为 false
    // 此配置项从 v1.9.0 起开始支持
    largeMode: false
    // 说明：如果想要添加卫星、路网等图层
    // 暂时先不要使用layers配置，因为存在Bug
    // 建议使用amap.add的方式，使用方式参见最下方代码
  },
  series: [
    {
      type: 'scatter',
      // 使用高德地图坐标系
      coordinateSystem: 'amap',
      // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
      data: [[120, 30, 8], [120.1, 30.2, 20]],
      encode: {
        value: 2
      }
    }
  ]
}

const Map = React.forwardRef<HTMLDivElement, Props>(({ className, option: baseOption = _baseOption }, _ref) => {
  let chart = React.useRef<echarts.ECharts | null>(null)
  const map = React.useRef<HTMLDivElement | null>(null);
  const popupRef = React.useRef(null)

  const [popup, setPopup] = React.useState<PopupType>({ style: { display: 'none' } })
  const memoizedSetPopupStyle = React.useCallback((_popup: PopupType) => {
    setPopup(_popup);
  }, [setPopup]);

  const setOption = React.useCallback((option: ECOption) => {
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
      // setOption({ series: [{ roam: false, }] })
    })
  });

  useClickAway(popupRef, () => {
    if (popup.style.display === 'none') {
      return
    }
    setPopup({ style: { display: 'none' } })
    // setOption({ series: [{ roam: true }] })
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
