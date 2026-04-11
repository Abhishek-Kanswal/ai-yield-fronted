'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BotIcon, UserIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { ChatInput } from '@/components/chat-input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { sendChatMessage } from '@/lib/api'

type ChatMessage = {
  role: string
  content: string
  data?: {
    vaults?: any[]
    tx?: any
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Yield Sentinel AI. I can help you discover the best yields, analyze portfolio risk, and automate DeFi strategies across chains. How can I assist you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const address = undefined
  const sessionId = React.useMemo(() => Math.random().toString(36).substring(7), [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (userMessage: string) => {
    if (isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await sendChatMessage(userMessage, sessionId, address)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          data: {
            vaults: response.vault_data?.vaults,
            tx: response.transaction,
          },
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ Sorry, there was an error communicating with the backend. Please ensure the API server is running.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex h-[calc(100dvh-6.5rem)] flex-1 overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 overflow-hidden p-4">
            <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm">
              <div className="flex-1 space-y-4 overflow-y-auto p-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BotIcon className="size-3.5 text-primary" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'rounded-br-sm bg-primary text-primary-foreground'
                          : 'rounded-bl-sm border border-border/40 bg-muted/50 text-foreground'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <div className="max-w-none text-[15px] leading-7 text-foreground [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_code]:rounded [&_code]:bg-muted/70 [&_code]:px-1 [&_code]:py-0.5 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                      )}

                      {msg.data?.vaults && msg.data.vaults.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 gap-3">
                          {msg.data.vaults.map((vault: any) => (
                            <div key={vault.address} className="rounded-lg border p-3 text-sm">
                              {vault.name}
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.data?.tx && (
                        <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4">
                          <h4 className="mb-2 text-sm font-semibold text-emerald-400">
                            Transaction Ready
                          </h4>
                          <p className="mb-3 break-all font-mono text-xs text-muted-foreground">
                            To: {msg.data.tx.transactionRequest.to}
                          </p>
                          <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-500">
                            Review & Sign
                          </Button>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <UserIcon className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BotIcon className="size-3.5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-border/40 bg-muted/50 px-4 py-3">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0.15s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-border/50 bg-card/80 p-3 backdrop-blur-sm">
                <ChatInput
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                  placeholder="E.g., Find me the safest USDC yield on Arbitrum above 5%..."
                />
              </div>
            </div>
          </div>
        </section>

        <Separator orientation="vertical" className="h-full bg-border" />

        <aside className="w-72 shrink-0 overflow-hidden p-4">
          <p className="text-sm font-medium text-foreground">Activity</p>
        </aside>
      </div>
    </main>
  )
}
