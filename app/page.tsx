"use client";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { useToast } from "@/components/ui/use-toast";
import MapContainer, { BMapOptionType, createMarker, getMarker, isPointExsit, markers, setZoomAndCenter, updateMarker } from "./amap";
import { Panel } from "./panel";
import Display from "./display";
import { PointType } from "./types";
import { removeMarker } from "./amap";
import { atou, utoa } from "./utils";
import { createPointToNotion, listPointFromNotion, updatePointToNotion } from "./api";
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
  const [currentPoint, setCurrentPoint] = useState<PointType | null>(null);
  const [isDetail, setIsDetail] = useState<boolean>(false);

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

  const onClickMarker = ({ point }: { point: PointType }) => {
    setCurrentPoint(point);
  };

  const onClickSearchItem = (point: PointType) => {
    const marker = getMarker(point);
    if (marker) {
      setZoomAndCenter(point)
      // @ts-ignore
      setCurrentPoint(marker.point)
      return
    }
    setCurrentPoint(point);
    createMarker({
      preview: false,
      point,
      onClickMarker,
    });
  };

  const onRemoveMarker = (point: PointType) => {
    setCurrentPoint(null);
    removeMarker(point);
  }

  const onOk = (point: PointType) => {
    updateMarker(point);
    return new Promise((resolve) => {
      return point.id ? updatePointToNotion(point) : createPointToNotion(point);
    }).then(res => {
      console.log('res',res)
    })
  }

  const onCancel = () => {
    setCurrentPoint(null);
  }

  return (
    <>
      <Panel onClickSearchItem={onClickSearchItem} pointList={mapOption.points} />
      <MapContainer
        className="w-screen h-screen"
        option={mapOption}
        onClickMarker={onClickMarker}
      />
      {currentPoint ? <Display point={currentPoint} isDetail={isDetail} onRemove={onRemoveMarker} onOk={onOk} onCancel={onCancel} /> : null}
    </>
  );
}
