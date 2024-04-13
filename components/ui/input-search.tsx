import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const InputSearch = ({ className, type, ...props }: InputProps) => {
    const ref = React.useRef<HTMLInputElement>(null)
    const [ifCommand, setIfCommand] = React.useState(true)

    React.useEffect(() => {
      if (ifCommand) {
        document.addEventListener("keydown", (e) => {
          if (e.ctrlKey && e.key === "f") {
            e.preventDefault()
            e.stopPropagation()
            ref.current?.focus()
          }
        })
      }
    })

    return (
      <div className="relative">
        <span className="icon-[heroicons--magnifying-glass] absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"></span>
        {ifCommand ? <div className="absolute right-4 top-2.5 h-4 text-xs text-muted-foreground">CTRL + F</div>
          : undefined}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8 rounded-md",
            className
          )}
          ref={ref}
          {...props}
          onFocus={(e) => {
            props?.onFocus && props.onFocus(e)
            setIfCommand(false)
          }}
          onBlur={(e) => {
            props?.onBlur && props.onBlur(e)
            setIfCommand(true)
          }}
        />
      </div>
    )
}

export { InputSearch }
