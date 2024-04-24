/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { InputSearch } from "@/components/ui/input-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PointType } from "../types";
import { createMarker } from "../amap";

interface PropsType {
  onClickSearchItem: (point: PointType) => void;
}

export function Search({ onClickSearchItem }: PropsType) {
  useEffect(() => {
    // @ts-ignore
    // const autoComplete = new _AMap.AutoComplete({
    //   input: inputSearch.current,
    //   output: scrollContainer.current
    // })
    // autoComplete.on('select', (e: any) => {
    //   const { name, location } = e.poi
    //   console.log(e.poi)
    //   const position = location.toString().split(',').map(parseFloat) as any
    //   setPoint({ title: name, position, description: '' })
    // })
    // map.current.addControl(autoComplete)
  }, []);

  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const [positions, setPositions] = useState<Recordable[]>([]);

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position =
      positions[(e.target as unknown as any).getAttribute("data-index")];
    const point: PointType = {
      title: position["formatted_address"],
      location: position.location.split(",").map(parseFloat) as any,
      description: "",
    };
    onClickSearchItem(point)
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== "Enter") {
      return;
    }

    const input = (e.target as unknown as any).value;
    if (!input) {
      return;
    }
    fetch(`/_AmapService/v3/geocode/geo?address=${input}&output=JSON`)
      .then((res) => res.json())
      .then((data) => {
        setPositions(data.geocodes);
      });
  };

  return (
    <>
      <div className="bg-background rounded-md">
        <InputSearch placeholder="搜索地点" onKeyUp={handleKeyUp} />
      </div>
      <ScrollArea className="mt-2">
        <div className="mt-2 flex flex-col gap-2" onClick={handleClick}>
          {positions.map((position, index) => {
            return (
              <div
                className="p-2 border"
                key={position.location}
                data-index={index}
              >
                {position.formatted_address}
              </div>
            );
          })}
        </div>
        <div className="!left-0 !top-0 !min-w-full" ref={scrollContainer}></div>
      </ScrollArea>
    </>
  );
}
