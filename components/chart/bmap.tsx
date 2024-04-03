"use client"
import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import '@amap/amap-jsapi-types';

export default function MapContainer() {
  const el = useRef<HTMLDivElement | null>(null) 
  const map = useRef<AMap.Map | null>(null);

  useEffect(() => {
    AMapLoader.load({
      key: "dafe1244843ac4a6721a014970c63558", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((_AMap: typeof AMap) => {
        map.current = new _AMap.Map(el.current!, {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: [116.397428, 39.90923], // 初始化地图中心点位置
        });
        const mapStyle = 'amap://styles/grey'; // 使用灰色风格
        map.current?.setMapStyle(mapStyle);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map.current?.destroy();
    };
  }, []);

  return (
    <div
      className="main"
      ref={el}
    ></div>
  );
}
