/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "@amap/amap-jsapi-types";
import { utoa } from "../utils";
import { Textarea } from "../../components/ui/textarea";
import { PointType } from "../types";
import { getEnvConfig } from "../utils/env";

interface PropsType {
  className?: string;
  option?: BMapOptionType;
  preview?: boolean;
  onClickMarker: ({ e, point }: { e: any; point: PointType }) => void;
}

export interface BMapOptionType {
  points: PointType[]
  mapStyle: string;
}

export let AMap: AMapType | null = null;
export let AMapInstance: AMap.Map | null = null;
export let infoWindow: AMap.InfoWindow | null = null;
export const markers: { [k: string]: AMap.Marker } = {};

// const { BMAP_STYLE_ID } = getEnvConfig()

export default function MapContainer({
  className,
  option = {
    mapStyle: '',
    points: [],
  },
  preview = false,
  onClickMarker,
}: PropsType) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || AMapInstance) return;
    // @ts-ignore
    window._AMapSecurityConfig = {
      serviceHost: `${location.origin}/_AMapService`,
    };
    getEnvConfig().then(({ BMAP_STYLE_ID }: any) => {
      // const mapStyle = option.mapStyle || `amap://styles/${process.env.BMAP_STYLE_ID}`;      
      const mapStyle = option.mapStyle || `amap://styles/${BMAP_STYLE_ID}`;      
      import("@amap/amap-jsapi-loader").then((AMapLoader) => {
        AMapLoader.load({
          key: "dafe1244843ac4a6721a014970c63558",
          version: "2.0",
          plugins: ["AMap.AutoComplete"],
        })
          .then((res: AMapType) => {
            AMap = res;
  
            AMapInstance = new AMap.Map(el.current!, {
              viewMode: "3D",
              zoom: 4,
              mapStyle,
              showLabel: false,
            });
  
            infoWindow = new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -30),
            });
          })
          .catch((e) => {
            console.log(e);
          });
      });
    });

    return () => {
      AMapInstance?.destroy();
    };
  }, [option.mapStyle]);

  useEffect(() => {
    option.points.forEach((point) => {
      const marker = createMarker({
        point,
        preview,
        onClickMarker,
        display: false,
      });
      markers[point.location.toString()] = marker;
    });
  }, [onClickMarker, option.points, preview])

  const replaceUrl = () => {
    const hash = utoa(JSON.stringify(option));
    window.history.replaceState({}, "", `${location.origin}#${hash}`);
  };

  return (
    <div className="w-full h-full relative">
      <div ref={el} className={className} />
    </div>
  );
}

export function createMarker({
  point,
  preview = false,
  onClickMarker,
  display = false,
}: {
  point: PointType;
  preview?: boolean;
  onClickMarker?: (e: any) => void;
  display?: boolean;
}) {
  if (!AMap || !AMapInstance) {
    throw new Error("AMap is not loaded");
  }

  const marker = new AMap.Marker({
    position: point.location,
    map: AMapInstance,
    // text: ,
    // content: point.icon
    // style: {
    //   background: "transparent",
    //   border: "none",
    // },
  });
  marker.setLabel({
    direction: 'top-center',
    offset: [0, -10], //设置文本标注偏移量
    content: point.title, //设置文本标注内容
  });
  const element = document.createElement("div");
  const elementChildren = (
    <div className="flex flex-col gap-2">
      <h6 className="text-xs">{point.title}</h6>
      {!preview ? (
        <Textarea
          defaultValue={point.description}
          onChange={(e) => {
            point.description = e.target.value;
          }}
        />
      ) : (
        <div className="text-xs">{point.description}</div>
      )}
    </div>
  );
  const root = createRoot(element);
  root.render(elementChildren);
  // @ts-ignore
  marker.element = element;
  // @ts-ignore
  marker.onClickMarker = onClickMarker;
  marker.on("click", (e) => {
    if (preview) {
      infoWindow?.setContent(e.target.element);
      const position = e.target.getPosition();
      setTimeout(() => {
        infoWindow?.open(AMapInstance!, position);
      });
    }
    onClickMarker && onClickMarker({ e, point });
  });
  display && marker.emit("click", { target: marker });
  return marker;
}

export function removeMarker(point: PointType) {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  const marker = markers[point.location.toString()];
  if (!marker) return
  AMapInstance.remove(marker);
}

export function removeAllMarker() {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  AMapInstance.clearMap();
}

export function updateMarker(point: PointType) {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  const preMarker = markers[point.location.toString()];
  if (!preMarker) {
    throw new Error("Marker not found");
  }
  AMapInstance.remove(preMarker);
  const marker = createMarker({
    point,
    // @ts-ignore
    onClickMarker: preMarker.onClickMarker
  })
  markers[point.location.toString()] = marker
}

export function setZoomAndCenter(zoom: number, center: [number, number]) {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  AMapInstance.setZoomAndCenter(zoom, center);
}
