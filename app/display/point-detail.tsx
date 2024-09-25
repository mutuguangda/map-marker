"use client";

import { NotionPage } from "@/components/notion";
import { useEffect, useState } from "react";
import { getRecordMap } from "../api";

export default function PointDetail({ point }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!point.id) return
    getRecordMap(point).then((res) => {
      console.log('res',res)
      setData(res);
    });
  }, [point]);

  return !data ? (
    <div>Loading...</div>
  ) : (
    <NotionPage recordMap={data} rootPageId={point.id!} />
  );
}
