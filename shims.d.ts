import '@amap/amap-jsapi-types';

export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BMAP_API_KEY: string
      BMAP_SECRET_KEY: string
      BMAP_STYLE_ID: string
    }
  }

  type Recordable<T = any> = Record<string, T>

  type AMapType = typeof AMap
}
