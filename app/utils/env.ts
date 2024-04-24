"use server";
export async function getEnvConfig() {
  return {
    BMAP_API_KEY: process.env.BMAP_API_KEY,
    BMAP_SECRET_KEY: process.env.BMAP_SECRET_KEY,
    BMAP_STYLE_ID: process.env.BMAP_STYLE_ID,
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  };
}
