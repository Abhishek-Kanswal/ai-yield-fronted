'use client'

import * as React from 'react'
import {
  ArrowUp,
  BrainCog,
  FolderCode,
  Globe,
  Mic,
  Paperclip,
  Square,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'

type ChatInputProps = {
  onSend?: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Type your message here...',
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState('')
  const [mode, setMode] = React.useState<'search' | 'think' | 'canvas' | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`
  }, [value])

  const hasContent = value.trim().length > 0

  const sendMessage = React.useCallback(() => {
    if (!hasContent || isLoading) return
    const prefixed = mode ? `[${mode}] ${value.trim()}` : value.trim()
    onSend?.(prefixed)
    setValue('')
  }, [hasContent, isLoading, mode, onSend, value])

  return (
    <div
      className={cn(
        'rounded-2xl border border-input bg-background p-2 shadow-sm',
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
          }
        }}
        placeholder={placeholder}
        className="max-h-55 min-h-11 resize-none border-none bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Attach file">
            <Paperclip className="size-4" />
          </Button>

          <Toggle
            size="sm"
            variant="outline"
            pressed={mode === 'search'}
            onPressedChange={(pressed) => setMode(pressed ? 'search' : null)}
            aria-label="Search mode"
          >
            <Globe className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={mode === 'think'}
            onPressedChange={(pressed) => setMode(pressed ? 'think' : null)}
            aria-label="Think mode"
          >
            <BrainCog className="size-4" />
          </Toggle>
          <Toggle
            size="sm"
            variant="outline"
            pressed={mode === 'canvas'}
            onPressedChange={(pressed) => setMode(pressed ? 'canvas' : null)}
            aria-label="Canvas mode"
          >
            <FolderCode className="size-4" />
          </Toggle>
        </div>

        <Button
          type="button"
          size="icon-sm"
          onClick={sendMessage}
          disabled={isLoading || !hasContent}
          aria-label={isLoading ? 'Stop' : hasContent ? 'Send message' : 'Voice message'}
        >
          {isLoading ? (
            <Square className="size-3.5" />
          ) : hasContent ? (
            <ArrowUp className="size-4" />
          ) : (
            <Mic className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
