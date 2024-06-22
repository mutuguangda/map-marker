import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Aside from "./aside";
import { Search } from "./search";
import { PointType } from "../types";
import { setZoomAndCenter } from "../amap";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PropsType = {
  onClickSearchItem: (point: PointType) => void;
  pointList: PointType[];
};

export function Panel({ onClickSearchItem, pointList }: PropsType) {
  const [activeKey, setActiveKey] = useState<"search" | "point" | "setting">(
    "search"
  );
  const handleNavItemClick = (key: "search" | "point" | "setting") => {
    setActiveKey(key);
  };

  const [defaultIcon, setDefaultIcon] = useState(typeof window !== 'undefined' ? localStorage.getItem('defaultPoint') || '🚩': '🚩');

  return (
    <div className="h-[50vh] fixed z-10 left-5 top-5 flex border rounded-md bg-background">
      <Aside activeKey={activeKey} onNavItemClick={handleNavItemClick} />
      <div className="w-80 p-3 h-full">
        <div className={activeKey === "search" ? "block h-full" : "hidden"}>
          <div className="bg-background rounded-md h-full flex flex-col gap-2">
            <Search onClickSearchItem={onClickSearchItem} />
          </div>
        </div>
        <div className={activeKey === "point" ? "block" : "hidden"}>
          <h3 className="text-lg font-bold mb-2">标点</h3>
          <ScrollArea>
            <div className="flex flex-col gap-2">
              {pointList.map((item) => {
                return (
                  <div
                    className="p-2 rounded-md border"
                    key={item.id}
                    onClick={() => setZoomAndCenter(item)}
                  >
                    <div className="text-sm">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <div className={activeKey === "setting" ? "block" : "hidden"}>
          <h3 className="text-lg font-bold mb-2">设置</h3>
          <div className="flex flex-col gap-2">
            <div>
              <Label>访问密码</Label>
              <Input
                className="mt-2"
                type="password"
                onChange={(e) => {
                  typeof window !== 'undefined' && localStorage.setItem("password", e.target.value);
                }}
                defaultValue={typeof window !== 'undefined' ? localStorage.getItem("password") || '': ''}
              />
            </div>
            <div>
              <Label>默认标点</Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger>
                    <div className="text-2xl p-1 hover:bg-[#E0F0FF] rounded-md">
                      {defaultIcon}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <EmojiPicker
                      emojiStyle={EmojiStyle.NATIVE}
                      onEmojiClick={(emojiData) => {
                        setDefaultIcon(emojiData.emoji)
                        typeof window !== 'undefined' && localStorage.setItem("defaultPoint", emojiData.emoji);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
