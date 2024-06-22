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

  // const [positions, setPositions] = useState<Recordable[]>([]);
  const [positions, setPositions] = useState<Recordable[]>([
    {
        "parent": "B00141I5PI",
        "address": "天丰路3启明大厦F1层",
        "distance": "",
        "pcode": "440000",
        "adcode": "440112",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "黄埔区",
        "citycode": "020",
        "name": "广州南北电子科技有限公司",
        "location": "113.461318,23.160511",
        "id": "B0FFG8I3HT"
    },
    {
        "parent": "",
        "address": "邵白路与环村路交叉口东180米",
        "distance": "",
        "pcode": "440000",
        "adcode": "440118",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;网络科技",
        "typecode": "170206",
        "adname": "增城区",
        "citycode": "020",
        "name": "广州南北科技实业有限公司",
        "location": "113.644086,23.155173",
        "id": "B0J21RIWPO"
    },
    {
        "parent": "",
        "address": "江城东路与沿江南路交叉口西180米",
        "distance": "",
        "pcode": "440000",
        "adcode": "441900",
        "pname": "广东省",
        "cityname": "东莞市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "东莞市",
        "citycode": "0769",
        "name": "东莞南北电子科技有限公司",
        "location": "113.746409,23.068990",
        "id": "B0JGH6RC1D"
    },
    {
        "parent": "B0FFICSPO3",
        "address": "天河北路183大都会广场写字楼F3层",
        "distance": "",
        "pcode": "440000",
        "adcode": "440106",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "购物服务;家电电子卖场;数码电子",
        "typecode": "060306",
        "adname": "天河区",
        "citycode": "020",
        "name": "南北科技(大都会广场写字楼店)",
        "location": "113.322497,23.141658",
        "id": "B0J3R5TA0J"
    },
    {
        "parent": "",
        "address": "南北大道91号",
        "distance": "",
        "pcode": "440000",
        "adcode": "440607",
        "pname": "广东省",
        "cityname": "佛山市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "三水区",
        "citycode": "0757",
        "name": "广东铝纪建材科技有限公司",
        "location": "112.926603,23.268332",
        "id": "B0JG4HC5AW"
    },
    {
        "parent": "",
        "address": "沙头建安路689号冠城信息产业园3号楼",
        "distance": "",
        "pcode": "440000",
        "adcode": "441900",
        "pname": "广东省",
        "cityname": "东莞市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "东莞市",
        "citycode": "0769",
        "name": "东莞南北峰技术服务有限公司",
        "location": "113.760333,22.769432",
        "id": "B0JAAHJ98L"
    },
    {
        "parent": "",
        "address": "粤溪北路98号财汇信息科技产业园A栋602",
        "distance": "",
        "pcode": "440000",
        "adcode": "440111",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "白云区",
        "citycode": "020",
        "name": "广州优优服装科技有限公司",
        "location": "113.241339,23.165177",
        "id": "B0J2793RZW"
    },
    {
        "parent": "",
        "address": "石基镇凌边村北约大街22巷5横巷11号4层",
        "distance": "",
        "pcode": "440000",
        "adcode": "440113",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "番禺区",
        "citycode": "020",
        "name": "广州市中程电子科技有限公司",
        "location": "113.436962,22.985066",
        "id": "B0FFMAZJLT"
    },
    {
        "parent": "",
        "address": "水南北街与北四巷交叉口200米",
        "distance": "",
        "pcode": "440000",
        "adcode": "440118",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;公司",
        "typecode": "170200",
        "adname": "增城区",
        "citycode": "020",
        "name": "广州政业科技有限公司",
        "location": "113.561350,23.109725",
        "id": "B0IG3D3D7B"
    },
    {
        "parent": "",
        "address": "石基镇凌边村北约大街二十二巷五横巷11号一二楼",
        "distance": "",
        "pcode": "440000",
        "adcode": "440113",
        "pname": "广东省",
        "cityname": "广州市",
        "type": "公司企业;公司;商业贸易",
        "typecode": "170207",
        "adname": "番禺区",
        "citycode": "020",
        "name": "广州市顺晟兴电子科技有限公司",
        "location": "113.436794,22.984784",
        "id": "B0J1ZCORGL"
    }
]);

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position =
      positions[(e.target as unknown as any).getAttribute("data-index")];
    const point: PointType = {
      title: position["name"],
      address: `${position['pname']}${position['cityname']}${position['adname']}${position["address"]}`,
      location: position.location.split(",").map(parseFloat) as any,
      description: "",
    };
    onClickSearchItem(point);
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== "Enter") {
      return;
    }

    const input = (e.target as unknown as any).value;
    if (!input) {
      return;
    }
    // 地理编码
    // fetch(`/_AmapService/v3/geocode/geo?address=${input}&output=JSON`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setPositions(data.geocodes);
    //   });
    // POI 搜索
    fetch(`/_AmapService/v5/place/text?keywords=${input}`)
      .then((res) => res.json())
      .then((data) => {
        setPositions(data.pois);
      });
  };

  return (
    <>
      <div className="bg-background rounded-md">
        <InputSearch placeholder="搜索地点" onKeyUp={handleKeyUp} />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-2" onClick={handleClick}>
          {positions.map((position, index) => {
            return (
              <div
                className="p-2 border"
                key={position.location}
                data-index={index}
              >
                {position.name}
              </div>
            );
          })}
        </div>
        <div className="!left-0 !top-0 !min-w-full" ref={scrollContainer}></div>
      </ScrollArea>
    </>
  );
}
