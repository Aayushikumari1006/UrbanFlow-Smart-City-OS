'use client'

import TopNav from '@/components/TopNav'
import { useSimulationStore } from '@/store/simulation'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

const SUGGESTED = [
  'What is the current urban health score for Delhi?',
  'Which zones have the highest AQI risk?',
  'What should be the top 3 budget priorities this quarter?',
  'How can we improve the women safety score by 10 points?',
  'What are the biggest traffic bottlenecks and how to fix them?',
]

const STATIC_RESPONSES: Record<string, string> = {
  default: "Based on the current city data, I can see several areas requiring attention. The traffic congestion index is elevated at 72%, air quality remains a concern with AQI at 178, and citizen satisfaction stands at 58/100. I recommend prioritizing the Scenario Lab to model interventions and assess their projected impact before implementation.",
}

interface Message { role: 'user' | 'assistant'; text: string }

export default function CopilotPage() {
  const { cityName } = useSimulationStore()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: `Hello! I'm the UrbanFlow AI Copilot for **${cityName}**. I can help you analyze urban metrics, interpret simulation results, and recommend governance actions. What would you like to explore?` },
  ])
  const [input, setInput] = useState('')

  function send(text?: string) {
    const msg = text || input
    if (!msg.trim()) return
    setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'assistant', text: STATIC_RESPONSES.default }])
    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <TopNav title="AI Copilot" />
      <div className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
        <div className="flex items-center gap-3">
          <Bot className="w-5 h-5 text-violet-400" />
          <div>
            <h2 className="text-white font-semibold text-lg">AI Copilot — {cityName}</h2>
            <p className="text-gray-500 text-sm">Your urban intelligence assistant — ask anything about the city</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-violet-400" />
                </div>
              )}
              <div className={`max-w-lg rounded-xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-blue-600/20 border border-blue-600/30 text-gray-200' : 'bg-[#111827] border border-gray-800 text-gray-300'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-400 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-violet-400" />
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about city metrics, simulations, or recommendations..."
              className="flex-1 bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={() => send()}
              className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
