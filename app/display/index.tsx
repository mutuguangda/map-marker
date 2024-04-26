import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { PointType } from "../types";
import { useImmer } from "use-immer";
import { Button } from "@/components/ui/button";

type PropsType = {
  isDetail: boolean
  point: PointType
  onRemove: (point: PointType) => void
  onOk: (point: PointType) => void
  onCancel: (point?: PointType) => void
}

export default function Display({ isDetail, point, onRemove, onOk, onCancel }: PropsType) {
  const [form, setForm] = useImmer(point)

  return (
    <div className="bg-background w-96 p-3 absolute right-5 top-5 z-50 border rounded-md shadow">
      <Popover>
        <PopoverTrigger>
          <div className="text-2xl p-1 hover:bg-[#E0F0FF] rounded-md mb-2">{ form.icon  || '🚩'  }</div>
        </PopoverTrigger>
        <PopoverContent>
          <EmojiPicker emojiStyle={EmojiStyle.NATIVE} onEmojiClick={(emojiData) => {
            setForm((draft) => {
              draft.icon = emojiData.emoji
            })
          }} />
        </PopoverContent>
      </Popover>
      <div className="flex gap-2 items-center">
        <Input className="px-2" value={form.title} onChange={(e) => {
          setForm((draft) => {
            draft.title = e.target.value
          })
        }} />
        <div className="flex-shrink-0 cursor-pointer h-9 flex justify-center items-center w-9 text-white rounded-md bg-red-500 hover:text-red-100 hover:bg-red-400" onClick={() => onRemove(point)}>
          <span className="icon-[heroicons--trash]"></span>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div>地址</div>
        <div>{ form.address || '--' }</div>
      </div>
      <div className="flex flex-col gap-2 mt-3">
        <div>简介</div>
        <Textarea className="px-2" value={form.description} onChange={(e) => {
          setForm((draft) => {
            draft.description = e.target.value
          })
        }} />
      </div>
      <div className="flex mt-5 justify-end gap-2">
        <Button onClick={() => onOk(form)}>确认</Button>
        <Button onClick={() => onCancel(form)} variant={'outline'}>取消</Button>
      </div>
    </div>
  )
}
