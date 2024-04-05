/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/_AMapService/v4/map/styles2/:path*',
        destination: `https://webapi.amap.com/v4/map/styles2/:path*?jscode=${process.env.BMAP_SECRET_KEY}`
      },
      {
        source: '/_AMapService/v3/vectormap/:path*',
        destination: `https://fmap01.amap.com/v3/vectormap/:path*?jscode=${process.env.BMAP_SECRET_KEY}`
      },
      {
        source: '/_AMapService/:path*',
        destination: `https://restapi.amap.com/:path*?jscode=${process.env.BMAP_SECRET_KEY}`
      },
    ] 
  },
};

export default nextConfig;
