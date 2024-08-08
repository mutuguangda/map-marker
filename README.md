# Map Marker 

基于 Next.js + Notion + 高德 API 的地图标点工具

## 开始

如果你选择 clone 或者 fork 本仓库，需要在 `.env.local` 文件中配置以下环境变量：

```
# 高德地图 Key
BMAP_API_KEY=
# 高德地图安全密钥
BMAP_SECRET_KEY=
# 高德地图自定义样式 ID
BMAP_STYLE_ID=
# Notion API Key
NOTION_API_KEY=
# Notion Database ID
NOTION_DATABASE_ID=
# 访问密码
PASSWORD=
```

有条件的，高德地图的 Key 和安全密钥可以自个申请使用。当然，你也可以直接使用我的 Key，不过我建议你申请自己的 Key，毕竟我自己的 Key 每天有访问限制。

```
BMAP_API_KEY=9e916cb1a5436f165a8317d249c99e39
BMAP_SECRET_KEY=4ebbc57caa8127e6c4fc6288a5782a4c
BMAP_STYLE_ID=a927524f8e540e512b9bdea1cad3d6fb
```

`NOTION_API_KEY` 和 `NOTION_DATABASE_ID` 可以查看该文章 [Build your first integration](https://developers.notion.com/docs/create-a-notion-integration) 了解如何获取。

`PASSWORD` 是访问密码，你可以自行设置。

随后，在控制台输入：

```shell
pnpm install
pnpm dev
```

即可启动项目，访问 `http://localhost:3000` 即可看到效果。

当然，你可以选择一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmutuguangda%2Fmap-marker&env=NOTION_API_KEY,NOTION_DATABASE_ID,PASSWORD)
