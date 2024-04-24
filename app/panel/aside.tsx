import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Aside({ activeKey, onNavItemClick }: { activeKey: 'search' | 'point' | 'setting', onNavItemClick: (key: 'search' | 'point' | 'setting') => void}) {

  // 如何更优雅的进行事件委托？DOM 结构？
  // const handleNacClick: MouseEventHandler<HTMLElement> = (e) => {
  //   console.log('e',e)
  // }
  return (
    <aside className="hidden w-12 flex-col bg-background sm:flex border-r">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                  activeKey === 'search' && 'text-foreground'
                )}
                onClick={() => onNavItemClick('search')}
              >
                <span className="icon-[heroicons--magnifying-glass-solid] h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">搜索</TooltipContent>
          </Tooltip>
          <Tooltip data-key="">
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                  activeKey === 'point' && 'text-foreground'
                )}
                onClick={() => onNavItemClick('point')}
              >
                <span className="icon-[heroicons--map-pin] h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">标点</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                  activeKey === 'setting' && 'text-foreground'
                )}
                onClick={() => onNavItemClick('setting')}
              >
                <span className="icon-[heroicons--cog-6-tooth] h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">设置</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}
