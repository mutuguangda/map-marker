export interface BMapOptionType {
  points: {
    [key: string]: PointType
  }
  mapStyle: string
}

export interface PointType {
  icon?: string,
  description: string,
  title: string,
  position: [number, number],
  images?: string[],
  createdTime?: string,
  updatedTime?: string
}
