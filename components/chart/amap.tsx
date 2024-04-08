/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { KeyboardEventHandler, MouseEventHandler, memo, useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import '@amap/amap-jsapi-types';
import { InputSearch } from "../ui/input-search";
import { ScrollArea } from '../ui/scroll-area'
import { utoa } from "@/app/utils";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { PointType } from "./types";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useDropArea } from "react-use";
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { cloneDeep } from "lodash-es";
import { map as asyncMap } from 'radash'

interface PropsType {
  className?: string
  option?: BMapOptionType
  preview?: boolean
}

export interface BMapOptionType {
  points: {
    [key: string]: PointType
  }
  mapStyle: string
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default memo(function MapContainer({ className, option = {
  points: {},
  mapStyle: ''
}, preview = false }: PropsType) {
  const el = useRef<HTMLDivElement | null>(null)
  const map = useRef<AMap.Map | null>(null);
  const infoWindow = useRef<AMap.InfoWindow | null>(null)
  const inputSearch = useRef<HTMLInputElement | null>(null)
  const scrollContainer = useRef<HTMLDivElement | null>(null)

  const mapStyle = option.mapStyle || 'amap://styles/a927524f8e540e512b9bdea1cad3d6fb';
  const GMap = useRef<typeof AMap | null>(null)
  const [positions, setPositions] = useState<Recordable[]>([])
  const [pointKey, setPointKey] = useState<string>('')

  const [bond, state] = useDropArea({
    onFiles: files => console.log('files', files),
    onUri: uri => console.log('uri', uri),
    onText: text => console.log('text', text),
  });

  useEffect(() => {
    if (typeof window === 'undefined') return
    // @ts-ignore
    window._AMapSecurityConfig = { serviceHost: `${location.origin}/_AMapService` }
    import('@amap/amap-jsapi-loader').then(AMapLoader => {
      AMapLoader.load({
        key: "dafe1244843ac4a6721a014970c63558",
        version: "2.0",
        plugins: ["AMap.AutoComplete"],
      })
        .then((_AMap: typeof AMap) => {
          GMap.current = _AMap

          map.current = new _AMap.Map(el.current!, {
            viewMode: "3D",
            zoom: 4,
            mapStyle,
            showLabel: false
          });

          infoWindow.current = new _AMap.InfoWindow({ offset: new _AMap.Pixel(0, -30) });

          const points = option.points
          Object.keys(points).forEach((key) => {
            setPoint(points[key], true)
          })

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
        })
        .catch((e) => {
          console.log(e);
        });
    })

    return () => {
      map.current?.destroy();
    };
  });

  useEffect(() => {
    if (preview) return
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputSearch.current?.focus()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  })

  function setPoint(point: BMapOptionType['points'][string], force: boolean = false) {
    const key = point.position.join()
    if (!force) {
      const points = option.points
      if (points[key]) {
        infoWindow.current?.open(map.current!, point.position)
        return
      }
      points[key] = point
    }

    const marker = new GMap.current!.Text({
      position: point.position,
      map: map.current!,
      text: '🚩',
      style: {
        background: 'transparent',
        border: 'none'
      }
    })
    marker.setLabel({
      direction: 'top',
      offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
      content: point.title, //设置文本标注内容
    });

    const element = document.createElement('div')
    const elementChildren = (
      <div className="flex flex-col gap-2">
        <h6 className="text-xs">{point.title}</h6>
        {
          !preview
            ?
            <Textarea
              defaultValue={point.description}
              onChange={(e) => {
                point.description = e.target.value
                replaceUrl()
              }}
            />
            :
            <div className="text-xs">{point.description}</div>
        }
      </div>
    )
    const root = createRoot(element)
    root.render(elementChildren)
    // @ts-ignore
    marker.element = element
    // @ts-ignore
    marker.content = point
    marker.on('click', (e) => {
      if (preview) {
        infoWindow.current?.setContent(e.target.element)
        const position = e.target.getPosition()
        setTimeout(() => {
          infoWindow.current?.open(map.current!, position);
        }, 50)
        return
      }
      setPointKey(key)
    })
    !force && marker.emit('click', { target: marker })

    !force && replaceUrl()
  }

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code !== 'Enter') {
      return
    }

    const input = (e.target as unknown as any).value
    if (!input) {
      return
    }
    fetch(`https://restapi.amap.com/v3/geocode/geo?address=${input}&output=JSON&key=9e916cb1a5436f165a8317d249c99e39`).then(res => res.json()).then(data => {
      console.log('data', data)
      setPositions(data.geocodes)
    })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const position = positions[(e.target as unknown as any).getAttribute('data-index')]
    const point: PointType = {
      title: position['formatted_address'],
      position: position.location.split(',').map(parseFloat) as any,
      description: '',
      images: [],
      icon: '🚩'
    }
    setPoint(point)
  }

  const replaceUrl = () => {
    const hash = utoa(JSON.stringify(option))
    window.history.replaceState({}, '', `${location.origin}#${hash}`);
  }

  const Search = () => {
    if (preview) return
    return (
      <div className="w-96 absolute left-5 top-5 z-50 ">
        <div className="bg-background rounded-md">
          <InputSearch ref={inputSearch} placeholder="搜索地点" onKeyUp={handleKeyUp} />
        </div>
        <ScrollArea className="mt-3 bg-background rounded-md shadow-md">
          <div className="flex flex-col gap-2" onClick={handleClick}>
            {positions.map((position, index) => {
              return <div className="p-2 border" key={position.location} data-index={index}>{position.formatted_address}</div>
            })}
          </div>
          <div className="!left-0 !top-0 !min-w-full" ref={scrollContainer}></div>
        </ScrollArea>
      </div>
    )
  }

  const Display = () => {
    if (!pointKey) return
    console.log('option.points[pointKey]',option.points[pointKey])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(option.points[pointKey].images || []);

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
      setFileList(newFileList);
      option.points[pointKey].images = await asyncMap(newFileList, async (item) => {
        const url = await getBase64(item.originFileObj as FileType)
        return {
          uid: item.uid,
          name: item.name,
          url: url,
          type: item.type
        }
      })
      replaceUrl()
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
            <div className="text-2xl p-1 hover:bg-[#E0F0FF] rounded-md mb-2">{option.points[pointKey].icon || '🚩'}</div>
          </PopoverTrigger>
          <PopoverContent>
            <EmojiPicker emojiStyle={EmojiStyle.NATIVE} onEmojiClick={(emojiData) => {
              console.log('emojiData', emojiData)
              option.points[pointKey].icon = emojiData.emoji
              replaceUrl()
            }} />
          </PopoverContent>
        </Popover>
        <div className="flex gap-2 items-center">
          <Input defaultValue={option.points[pointKey].title} className="px-2" />
          <div className="flex-shrink-0 cursor-pointer h-9 flex justify-center items-center w-9 text-white rounded-md bg-red-500 hover:text-red-100 hover:bg-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <div>简介</div>
          <Textarea defaultValue={option.points[pointKey].description} className="px-2" onChange={(e) => {
            option.points[pointKey].description = e.target.value
            replaceUrl()
          }} />
        </div>
        <div className="mt-3 flex flex-col gap-2">
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
            {/* {option.points[pointKey].images?.map((item, index) => {
              return (
                <div key={index} className="p-1 w-1/4 h-[91.6px] flex-shrink-0">
                  <div className="w-full h-full border border-gray-500 rounded-md border-dashed">
                    <Image src={item} alt="图片" />
                  </div>
                </div>
              )
            })}
            <div className="p-1 w-1/4 h-[91.6px] flex-shrink-0" {...bond}>
              <div className="w-full h-full flex items-center justify-center border border-gray-500 rounded-md border-dashed">
                <div className="text-3xl">+</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Search />
      <Display />
      <div
        ref={el}
        className={className}
      />
    </div>
  );
})
