import { Client } from "@notionhq/client";
import { writeFileSync } from "fs";
import dayjs from "dayjs";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

(async () => {
  const pageId = process.env.NOTION_PAGE_ID;
  if (!pageId) {
    throw new Error("Missing NOTION_PAGE_ID environment variable");
  }
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });
  const syncCalloutBlock: Record<string, any> =
    blocks.results.find((block: any) => block.type === "callout") || {};
  const syncCalloutBlockId = syncCalloutBlock?.id;
  const syncTime = syncCalloutBlock.callout.rich_text[0].plain_text.replace(
    "Last sync time: ",
    ""
  ) || dayjs(0);
  const databaseId = blocks.results.find(
    (block: any) => block.type === "child_database"
  )?.id;
  if (!databaseId) {
    throw new Error("Missing database, please check your notion page");
  }
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "UpdatedTime",
      date: {
        on_or_after: syncTime,
      },
    },
    sorts: [
      {
        property: "UpdatedTime",
        direction: "descending",
      },
    ],
  });
  const data = response.results.map((page: any) => {
    return {
      id: page.id,
      title: page.properties.Name.title[0].plain_text,
      address: page.properties.Address.rich_text[0].plain_text,
      location: page.properties.Location.rich_text[0].plain_text,
      description: page.properties.Description.rich_text[0].plain_text,
      updatedTime: page.properties.UpdatedTime.last_edited_time,
      createdTime: page.properties.CreatedTime.created_time,
    }
  });
  writeFileSync("data.json", JSON.stringify(data, null, 2));
})();
