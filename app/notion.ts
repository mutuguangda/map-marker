'use server'

import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function listPoint() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not set');
  }
  const result = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'UpdatedTime',
        direction: 'ascending',
      },
    ],
  });
  // 对 result 做数据处理，返回正常的数据格式
  return result
}
