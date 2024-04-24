import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Aside from "./aside";
import { Search } from "./search";
import { PointType } from "../types";
import { setZoomAndCenter } from '../amap'

type PropsType = {
  onClickSearchItem: (point: PointType) => void;
  pointList: PointType[];
}

export function Panel({
  onClickSearchItem,
  pointList
}: PropsType) {
  const [activeKey, setActiveKey] = useState<"search" | "point" | "setting">(
    "search"
  );
  const handleNavItemClick = (key: "search" | "point" | "setting") => {
    setActiveKey(key);
  };

  return (
    <div className="h-[588px] fixed z-10 left-5 top-5 flex border rounded-md bg-background">
      <Aside activeKey={activeKey} onNavItemClick={handleNavItemClick} />
      <div className="w-80 p-3 h-full">
        <div className={activeKey === "search" ? "block" : "hidden"}>
          <div className="bg-background rounded-md">
            <Search onClickSearchItem={onClickSearchItem} />
          </div>
        </div>
        <div className={activeKey === "point" ? "block" : "hidden"}>
          <h3 className="text-lg font-bold mb-2">标点</h3>
          <ScrollArea>
            {pointList.map((item) => {
              return (
                <div className="p-2 rounded-md border" key={item.id} onClick={() => setZoomAndCenter(8, item.location)}>
                  <div className="text-sm">{item.title}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </div>
        <div className={activeKey === "setting" ? "block" : "hidden"}>
          <h3 className="text-lg font-bold mb-2">设置</h3>
          <div className="flex flex-col gap-2">
            <div>
              <Label>访问密码</Label>
              <Input className="mt-2" type="password" />
            </div>
            <div>
              <Label>默认标点</Label>
              <Input className="mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
