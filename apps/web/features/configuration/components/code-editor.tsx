"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  minLines?: number
}

export function CodeEditor({ value, onChange, className, minLines = 6 }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)

  const lines = value ? value.split("\n") : [""]
  const lineCount = Math.max(lines.length, minLines)

  // sync scroll between line numbers and textarea
  const handleScroll = () => {
    if (scrollRef.current && textareaRef.current) {
      scrollRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget
      const { selectionStart, selectionEnd } = el

      // Tab → insert 2 spaces
      if (e.key === "Tab") {
        e.preventDefault()
        const next = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd)
        onChange(next)
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = selectionStart + 2
        })
      }

      // Enter → auto-indent
      if (e.key === "Enter") {
        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1
        const currentLine = value.slice(lineStart, selectionStart)
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? ""
        if (indent) {
          e.preventDefault()
          const next = value.slice(0, selectionStart) + "\n" + indent + value.slice(selectionEnd)
          onChange(next)
          requestAnimationFrame(() => {
            el.selectionStart = el.selectionEnd = selectionStart + 1 + indent.length
          })
        }
      }
    },
    [value, onChange]
  )

  return (
    <div
      className={cn(
        "relative flex rounded-md border text-sm font-mono overflow-hidden transition-colors",
        focused ? "border-ring ring-ring/50 ring-[3px]" : "border-input",
        "bg-[#1e1e1e] text-[#d4d4d4]",
        className
      )}
    >
      {/* line numbers */}
      <div
        ref={scrollRef}
        className="select-none overflow-hidden shrink-0 py-2 text-right pr-3 pl-3 text-[#858585] bg-[#1e1e1e] border-r border-[#333]"
        style={{ minWidth: `${String(lineCount).length * 0.6 + 1.8}rem` }}
        aria-hidden
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="leading-6 text-xs">
            {i + 1}
          </div>
        ))}
      </div>

      {/* textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        className={cn(
          "flex-1 resize-none bg-transparent outline-none py-2 px-3 leading-6 text-xs",
          "caret-white"
        )}
        style={{ minHeight: `${lineCount * 1.5 + 1}rem` }}
      />
    </div>
  )
}
