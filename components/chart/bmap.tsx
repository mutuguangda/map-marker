"use client"
import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import '@amap/amap-jsapi-types';

interface Props {
  className?: string
  option: Recordable
}

export default function MapContainer({ className, option }: Props) {
  const el = useRef<HTMLDivElement | null>(null) 
  const map = useRef<AMap.Map | null>(null);
  const mapStyle = 'amap://styles/a927524f8e540e512b9bdea1cad3d6fb'; // 使用灰色风格

  useEffect(() => {
    // @ts-ignore
    window._AMapSecurityConfig = { securityJsCode: '4ebbc57caa8127e6c4fc6288a5782a4c' };
    AMapLoader.load({
      key: "dafe1244843ac4a6721a014970c63558",
      version: "2.0",
      plugins: [],
    })
      .then((_AMap: typeof AMap) => {
        map.current = new _AMap.Map(el.current!, {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 4, // 初始化地图级别
        });
        map.current?.setMapStyle(mapStyle);

        const marker = new _AMap.Marker({
          position: [116.406315, 39.908775],        
        })
        marker.setMap(map.current)

        // 构建信息窗体中显示的内容
        const info = [];
        info.push("<div class='input-card content-window-card'><div><img style=\"float:left;width:67px;height:16px;\" src=\" https://webapi.amap.com/images/autonavi.png \"/></div> ");
        info.push("<div style=\"padding:7px 0px 0px 0px;\"><h4>高德软件</h4>");
        info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
        info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");

        const infoWindow = new AMap.InfoWindow({
          content: info.join("")  //使用默认信息窗体框样式，显示信息内容
        });
        const center = map.current?.getCenter() as unknown as any
        infoWindow.open(map.current, center);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map.current?.destroy();
    };
  });

  return (
    <div
      ref={el}
      className={className}
    ></div>
  );
}
