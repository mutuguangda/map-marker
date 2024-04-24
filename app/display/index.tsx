import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { GetProp, UploadFile, UploadProps } from "antd";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PointType } from "../types";
import { useImmer } from "use-immer";
import { Button } from "@/components/ui/button";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type PropsType = {
  isDetail: boolean
  point: PointType
  onRemove: (point: PointType) => void
  onOk: (point: PointType) => void
  onCancel: (point?: PointType) => void
}

export default function Display({ isDetail, point, onRemove, onOk, onCancel }: PropsType) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [form, setForm] = useImmer(point)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // option.points[pointKey].images = await asyncMap(newFileList, async (item) => {
    //   const url = await getBase64(item.originFileObj as FileType)
    //   return {
    //     uid: item.uid,
    //     name: item.name,
    //     url: url,
    //     type: item.type
    //   }
    // })
  }
    
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <span className="icon-[heroicons--plus]"></span>
    </button>
  );

  const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

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
        <div>简介</div>
        <Textarea className="px-2" value={form.description} onChange={(e) => {
          setForm((draft) => {
            draft.description = e.target.value
          })
        }} />
      </div>
      {/* <div className="mt-3 flex flex-col gap-2">
        <div>图片上传</div>
        <div className="flex flex-wrap -m-1 flex-shrink-0">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible: any) => setPreviewOpen(visible),
                afterOpenChange: (visible: any) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
              alt="picture"
            />
          )}
        </div>
      </div> */}
      <div className="flex mt-5 justify-end gap-2">
        <Button onClick={() => onOk(form)}>确认</Button>
        <Button onClick={() => onCancel(form)} variant={'outline'}>取消</Button>
      </div>
    </div>
  )
}
