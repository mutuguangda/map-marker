"use client";
import { KeyboardEventHandler, useEffect, useRef, useState, forwardRef, memo } from "react";
import { createRoot } from "react-dom/client";
import "@amap/amap-jsapi-types";
import { utoa } from "../utils";
import { PointType } from "../types";
import { getEnvConfig } from "../utils/env";
import Display from "../display";

interface PropsType {
  className?: string;
  option: BMapOptionType;
  preview?: boolean;
  onMarkerClick?: ({ e, point }: { e: any; point: PointType }) => void;
  onMarkerChange?: (point: PointType) => void;
  onMarkerRemove?: (point: PointType) => void;
  onMarkerOk?: (point: PointType) => Promise<any>;
  onMarkerCancel?: (point: PointType) => void;
}

export interface BMapOptionType {
  points: PointType[]
  mapStyle: string;
}

export let AMap: AMapType | null = null;
export let AMapInstance: AMap.Map | null = null;
export let infoWindow: AMap.InfoWindow | null = null;
export let isShowInfoWindow: boolean = false;
export let markers: { [k: string]: AMap.Marker | null } = {};

export default memo(MapContainer)

function MapContainer({
  className,
  option = {
    mapStyle: '',
    points: [],
  },
  preview = false,
  onMarkerClick,
  onMarkerChange,
  onMarkerRemove,
  onMarkerOk,
  onMarkerCancel,
}: PropsType) {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || AMapInstance) return;
    // @ts-ignore
    window._AMapSecurityConfig = {
      serviceHost: `${location.origin}/_AMapService`,
    };
    getEnvConfig().then(({ BMAP_STYLE_ID }: any) => { 
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
              viewMode: "2D",
              zoom: 4,
              mapStyle,
              showLabel: false,
            });
  
            AMapInstance.on("click", () => {
              if (preview && isShowInfoWindow) {
                infoWindow?.close();
                isShowInfoWindow = false;
              }
            })

            infoWindow = new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -4),
              isCustom: true
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
  }, [option.mapStyle, preview]);

  useEffect(() => {
    if (!AMapInstance) return
    option.points.forEach((point) => {
      createMarker({
        point,
        preview,
        onMarkerClick,
        onMarkerRemove,
        onMarkerOk,
        onMarkerCancel,
        display: false,
      });
    });
    return () => {
      AMapInstance && removeAllMarker()
    };
  }, [onMarkerCancel, onMarkerClick, onMarkerOk, onMarkerRemove, option.points, preview])

  return (
    <div className="w-full h-full relative">
      <div ref={el} className={className} />
    </div>
  );
}

export type CreateMarkerPropsType = Omit<PropsType, 'className' | 'option'> & { display?: boolean, point: PointType }

export function createMarker({
  point,
  preview = false,
  onMarkerClick,
  onMarkerChange,
  onMarkerRemove,
  onMarkerOk,
  onMarkerCancel,
  display = false,
}: CreateMarkerPropsType) {
  if (!AMap || !AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  if (markers[point.location.toString()]) {
    setZoomAndCenter(point)
    return
  }

  const marker = new AMap.Marker({
    position: point.location,
    map: AMapInstance,
    content: point.icon || '🚩'
  });
  console.log('**Create Marker**', point)
  markers[point.location.toString()] = marker;
  display && setZoomAndCenter(point)
  marker.setLabel({
    direction: 'top-center',
    offset: [0, -4],
    content: point.title,
  });
  const element = document.createElement("div");
  const elementChildren = (
    <Display 
      point={point} 
      preview={preview} 
      onRemove={(point) => {
        infoWindow?.close();
        onMarkerRemove && onMarkerRemove(point)
      }} 
      onOk={onMarkerOk}
      onCancel={onMarkerCancel}
    />
  )
  const root = createRoot(element);
  root.render(elementChildren);
  // @ts-ignore
  marker.element = element;
  // @ts-ignore
  marker.event = {
    onMarkerCancel,
    onMarkerClick,
    onMarkerOk,
    onMarkerRemove
  } 
  marker.on("click", (e) => {
    setZoomAndCenter(point)
    infoWindow?.setContent(e.target.element);
    const position = e.target.getPosition();
    setTimeout(() => {
      infoWindow?.open(AMapInstance!, position);
      isShowInfoWindow = true;
    });
    onMarkerClick && onMarkerClick({ e, point });
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
  markers[point.location.toString()] = null
}

export function removeAllMarker() {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  markers = {}
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
  markers[point.location.toString()] = null
  createMarker({
    point,
    // @ts-ignore
    ...preMarker.event
  })
}

export function setZoomAndCenter(point: PointType, zoom: number = 10) {
  if (!AMapInstance) {
    throw new Error("AMap is not loaded");
  }
  AMapInstance.setZoomAndCenter(zoom, point.location);
}

export function isPointExsit(point: PointType) {
  return !markers[point.location.toString()]
}

export function getMarker(point: PointType) {
  return markers[point.location.toString()]
}

export function closeInfoWindow() {
  infoWindow?.close();
}
