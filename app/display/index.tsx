"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { PointType } from "../types";
import { useImmer } from "use-immer";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button, Drawer } from "antd";
import Notion from "./point-detail";
import PointDetail from "./point-detail";

type PropsType = {
  preview?: boolean;
  point: PointType;
  onRemove?: (point: PointType) => void;
  onChange?: (point: PointType) => void;
  onClickAway?: () => void;
  onOk?: (point: PointType) => Promise<any>;
  onCancel?: (point: PointType) => void;
};

export default function Display({
  point,
  preview = false,
  onRemove,
  onChange,
  onClickAway,
  onOk,
  onCancel,
}: PropsType) {
  point = point.icon ? point : { ...point, icon: localStorage?.getItem('defaultIcon') || "🚩" };
  const [form, _setForm] = useImmer(point);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [open, setOpen] = useState(false);

  const setForm = (fn: (draft: PointType) => void) => {
    _setForm((draft) => {
      fn(draft);
    });
    setDisabled(false);
  };

  const ref = useRef(null);
  useClickAway(ref, () => {
    onClickAway && onClickAway();
  });

  const handleOk = async () => {
    setLoading(true);
    onOk && (await onOk(form));
    setLoading(false);
    setDisabled(true);
  };

  const Preview = (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-baseline">
        <div className="text-xl">
          {form.icon}
        </div>
        <span>{form.title}</span>
        </div>
        <span className="text-xs text-gray-400">{form.description}</span>
      </div>
      <div
        className="text-2xl leading-6 p-1 hover:bg-[#E0F0FF] rounded-md cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="icon-[heroicons--chevron-right-16-solid]"></span>
      </div>
    </div>
  );

  const Form = (
    <>
      <div className="mb-2 flex justify-between items-center">
        <Popover>
          <PopoverTrigger>
            <div className="text-2xl p-1 hover:bg-[#E0F0FF] rounded-md">
              {form.icon || "🚩"}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <EmojiPicker
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={(emojiData) => {
                setForm((draft) => {
                  draft.icon = emojiData.emoji;
                });
              }}
            />
          </PopoverContent>
        </Popover>
        <div
          className="text-2xl leading-6 p-1 hover:bg-[#E0F0FF] rounded-md cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="icon-[heroicons--chevron-right-16-solid]"></span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          className="px-2"
          value={form.title}
          onChange={(e) => {
            setForm((draft) => {
              draft.title = e.target.value;
            });
          }}
        />
        <div
          className="flex-shrink-0 cursor-pointer h-9 flex justify-center items-center w-9 text-white rounded-md bg-red-500 hover:text-red-100 hover:bg-red-400"
          onClick={() => onRemove && onRemove(point)}
        >
          <span className="icon-[heroicons--trash]"></span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div>地址</div>
        <div>{form.address || "--"}</div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div>简介</div>
        <Textarea
          className="px-2 resize-none"
          value={form.description}
          onChange={(e) => {
            setForm((draft) => {
              draft.description = e.target.value;
            });
          }}
        />
      </div>
      <div className="flex mt-5 justify-end gap-2">
        <Button
          onClick={handleOk}
          type="primary"
          loading={loading}
          disabled={disabled}
        >
          确认
        </Button>
        <Button onClick={() => onCancel && onCancel(form)}>取消</Button>
      </div>
    </>
  );

  return (
    <>
      <div
        ref={ref}
        className="bg-background w-96 p-3 border rounded-md shadow"
      >
        {preview ? Preview : Form}
      </div>
      <Drawer
        title={point.title}
        open={open}
        size="large"
        onClose={() => setOpen(false)}
      >
        <PointDetail point={point} />
      </Drawer>
    </>
  );
}
