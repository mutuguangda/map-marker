"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { useToast } from "@/components/ui/use-toast";
import MapContainer, { BMapOptionType, closeInfoWindow, createMarker, getMarker, isPointExsit, markers, setZoomAndCenter, updateMarker } from "./amap";
import { Panel } from "./panel";
import Display from "./display";
import { PointType } from "./types";
import { removeMarker } from "./amap";
import { atou, utoa } from "./utils";
import { createPointToNotion, listPointFromNotion, removePointFromNotion, updatePointToNotion } from "./api";
import { useImmer } from "use-immer";
import { cloneDeep } from "lodash-es";

export default function Home() {
  // const hash = useRef(
  //   typeof window !== "undefined" ? window.location.hash : ""
  // );
  // const baseOption = useRef<BMapOptionType>({
  //   mapStyle: process.env.BMAP_STYLE_ID,
  //   points: {},
  // });
  // if (hash.current) {
  //   try {
  //     baseOption.current = JSON.parse(atou(hash.current.slice(1)));
  //   } catch {
  //     console.log("无效的 hash", hash.current);
  //   }
  // }

  // 会触发视图更新
  // const [_, copyToClipboard] = useCopyToClipboard();
  // const { toast } = useToast();

  const [mapOption, setMapOption] = useImmer<BMapOptionType>({
    mapStyle: process.env.BMAP_STYLE_ID,
    points: [],
  })
  // const [currentPoint, setCurrentPoint] = useState<PointType | null>(null);
  // const [isDetail, setIsDetail] = useState<boolean>(false);

  useEffect(() => {
    listPointFromNotion().then((res) => {
      setMapOption((draft) => {
        draft.points = res;
      })
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       const hash = utoa(JSON.stringify(baseOption.current));
  //       const url = `${location.origin}/preview#${hash}`;
  //       copyToClipboard(url);
  //       toast({
  //         title: "已导出到剪贴板",
  //         description: (
  //           <div className="whitespace-preline truncate">
  //             <a href={url} target="_blank">
  //               {url}
  //             </a>
  //           </div>
  //         ),
  //       });
  //     }
  //   };
  //   document.addEventListener("keydown", down);
  //   return () => document.removeEventListener("keydown", down);
  // });

  const onMarkerClick = ({ point }: { point: PointType }) => {
    // setCurrentPoint(point);
  };

  const onMarkerChange = (point: PointType) => {
    return new Promise(() => {
      return point.id ? updatePointToNotion(point, localStorage.getItem('password') || '') : createPointToNotion(point, localStorage.getItem('password') || '');
    }).then(() => {
      updateMarker(point);
    })
  };

  const onMarkerRemove = async (point: PointType) => {
    await removePointFromNotion(point, localStorage.getItem('password') || '')
    removeMarker(point);
  };

  const onMarkerOk = async (point: PointType) => {
    point.id ? await updatePointToNotion(point, localStorage.getItem('password') || '') : await createPointToNotion(point, localStorage.getItem('password') || '');
    updateMarker(point);
  };

  const onMarkerCancel = () => {
    closeInfoWindow()
  };

  const onClickSearchItem = (point: PointType) => {
    console.log('point',point)
    const marker = getMarker(point);
    if (marker) {
      setZoomAndCenter(point)
      return
    }
    createMarker({
      preview: false,
      point,
      onMarkerClick,
      // onMarkerChange,
      onMarkerRemove,
      onMarkerOk,
      onMarkerCancel,
      display: true
    });
  };

  return (
    <>
      <Panel onClickSearchItem={onClickSearchItem} pointList={mapOption.points} />
      <MapContainer
        className="w-screen h-screen"
        option={mapOption}
        onMarkerClick={onMarkerClick}
        // onMarkerChange={onMarkerChange}
        onMarkerRemove={onMarkerRemove}
        onMarkerOk={onMarkerOk}
        onMarkerCancel={onMarkerCancel}
      />
    </>
  );
}
