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
    <main className="relative flex h-[calc(100vh-72px)] w-full flex-col overflow-hidden bg-[#F3F3F3] px-6 pb-6 pt-0 font-sans">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[10px] border border-[#C7D2FE]/50 bg-[#E0E7FF]/40 p-5">
        
        {/* CHANGED: Replaced h-[100%] with h-full flex-1 to guarantee full vertical stretching */}
        <div className="mx-auto flex h-full flex-1 w-[78%] overflow-hidden rounded-2xl border border-[#C7D2FE]/70 bg-[linear-gradient(135deg,#EEF2FF_0%,#FFFFFF_45%,#EEF2FF_100%)] shadow-sm">
          <section className="flex flex-1 min-w-0  flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 overflow-hidden p-4">
              <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[980px] flex-col overflow-hidden">
                <div className="flex-1 space-y-4 overflow-y-auto p-4 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#312E81]/10">
                          <BotIcon className="size-3.5 text-[#312E81]" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'rounded-br-sm bg-[#312E81] text-white'
                            : 'rounded-bl-sm border border-[#C7D2FE]/70 bg-[#EEF2FF]/70 text-[#1F1D4D]'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="max-w-none text-[15px] leading-7 text-[#1F1D4D] [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-[#E0E7FF]/80 [&_pre]:p-3 [&_code]:rounded [&_code]:bg-[#E0E7FF]/80 [&_code]:px-1 [&_code]:py-0.5 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C7D2FE] [&_blockquote]:pl-3">
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
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E0E7FF]">
                          <UserIcon className="size-3.5 text-[#312E81]" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#312E81]/10">
                        <BotIcon className="size-3.5 text-[#312E81]" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-[#C7D2FE]/70 bg-[#EEF2FF]/70 px-4 py-3">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#312E81]/65" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#312E81]/65 [animation-delay:0.15s]" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#312E81]/65 [animation-delay:0.3s]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="shrink-0 border-t border-[#C7D2FE]/70 bg-white/80 p-3 backdrop-blur-sm">
                  <ChatInput
                    onSend={handleSendMessage}
                    isLoading={isLoading}
                    placeholder="E.g., Find me the safest USDC yield on Arbitrum above 5%..."
                  />
                </div>
              </div>
            </div>
          </section>

          <Separator orientation="vertical" className="h-full bg-[#C7D2FE]/70" />

          <aside className="w-64 shrink-0 overflow-hidden border-l border-[#C7D2FE]/60 bg-white p-4">
            <p className="text-sm font-semibold text-[#312E81]">Activity</p>
          </aside>
          
        </div>
      </div>
    </main>
  )
}