import { UploadFile } from "antd"

export interface BMapOptionType {
  points: {
    [key: string]: PointType
  }
  mapStyle: string
}

export interface PointType {
  id?: string,
  icon?: string,
  description: string,
  title: string,
  location: [number, number],
  images?: UploadFile[],
  createdTime?: string,
  updatedTime?: string
  address: string
}
