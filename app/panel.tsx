import Aside from "./aside";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InputSearch } from "@/components/ui/input-search";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listPoint } from "./notion";

export function Panel() {
  const [activeKey, setActiveKey] = useState<"search" | "point" | "setting">(
    "search"
  );
  const handleNavItemClick = (key: "search" | "point" | "setting") => {
    setActiveKey(key);
  };

  const notionList = [
    {
      id: 1,
      title: "长湴",
      description:
        "长湴是位于中国广东省广州市天河区的一个大型商业区，由广州市长湴置业有限公司投资建设。",
    },
  ];

  useEffect(() => {
    // 获取默认标点
    listPoint().then((res) => {
      console.log(res);
    });
  })

  return (
    <div className="h-[588px] fixed z-10 left-5 top-5 flex border rounded-md">
      <Aside activeKey={activeKey} onNavItemClick={handleNavItemClick} />
      <div className="w-80 p-3 h-full">
        <div className={activeKey === "search" ? "block" : "hidden"}>
          <div className="bg-background rounded-md">
            <InputSearch placeholder="搜索地点" />
          </div>
          <ScrollArea className="mt-2">
            <span className="text-sm">暂无数据</span>
          </ScrollArea>
        </div>
        <div className={activeKey === "point" ? "block" : "hidden"}>
          <h3 className="text-lg font-bold mb-2">标点</h3>
          <ScrollArea>
            {notionList.map((item) => {
              return (
                <div className="p-2 rounded-md border" key={item.id}>
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
