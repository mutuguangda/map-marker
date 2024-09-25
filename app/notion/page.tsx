import { NotionPage } from '@/components/notion'
import { notion } from '@/lib/notion'

export default async function Detail() {
  const data = await notion.getPage('10cf4eca8c2b81c690d9e7112b7d1452');

  return (
    <NotionPage recordMap={data} rootPageId='10cf4eca8c2b81c690d9e7112b7d1452' />
  )
}
