"use server";

import { Client } from "@notionhq/client";
import { PointType } from "../types";
import { NotionAPI } from "notion-client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const reactNotionXClient = new NotionAPI();

export async function listPointFromNotion() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "UpdatedTime",
        direction: "ascending",
      },
    ],
  });
  const result = response.results.map((page) => {
    // @ts-ignore
    const { id, properties, icon } = page;
    return {
      id,
      icon: icon.emoji,
      title: properties.Name.title[0].text.content,
      description: properties.Description.rich_text[0].text.content,
      updatedTime: properties.UpdatedTime.last_edited_time,
      location: properties.Location.rich_text?.[0]?.text.content.split(',').map(parseFloat),
      address: properties.Address.rich_text?.[0]?.text.content
    };
  });
  return result;
}

export async function createPointToNotion(point: PointType, password: string) {
  if (process.env.PASSWORD !== password) {
    throw new Error("Invalid password")
  }
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }
  const response = await notion.pages.create({
    icon: {
      type: "emoji",
      emoji: point.icon as any,
    },
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: point.title,
            }
          }
        ]
      },
      Address: {
        rich_text: [
          {
            text: {
              content: point.address,
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            text: {
              content: point.description,
            },
          },
        ],
      },
      Location: {
        rich_text: [
          {
            text: {
              content: point.location.join(','),
            },
          },
        ],
      }
    },
  });
  return response
}

export async function updatePointToNotion(point: PointType, password: string) {
  if (process.env.PASSWORD !== password) {
    throw new Error("Invalid password")
  }
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }
  if (!point.id) {
    throw new Error("Point id is not set");
  }
  const response = await notion.pages.update({
    page_id: point.id,
    icon: {
      type: "emoji",
      emoji: point.icon as any,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: point.title,
            }
          }
        ]
      },
      Description: {
        rich_text: [
          {
            text: {
              content: point.description,
            },
          },
        ],
      },
      Address: {
        rich_text: [
          {
            text: {
              content: point.address,
            },
          },
        ],
      },
      Location: {
        rich_text: [
          {
            text: {
              content: point.location.join(','),
            },
          },
        ],
      }
    },
  });
  return response
}

export async function removePointFromNotion(point: PointType, password: string) {
  if (process.env.PASSWORD !== password) {
    throw new Error("Invalid password")
  }
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }
  if (!point.id) {
    throw new Error("Point id is not set");
  }
  const response = await notion.pages.update({
    page_id: point.id,
    in_trash: true
  });
  return response
}

export async function getPointDetailFromNotion(point: PointType) {
  if (!point.id) {
    throw new Error("Point id is not set")
  } 
  return notion.blocks.children.list({
    block_id: point.id,
  });
}

export async function getRecordMap(point: PointType) {
  if (!point.id) return null
  console.log('getRecordMap')
  return reactNotionXClient.getPage(point.id)
}
