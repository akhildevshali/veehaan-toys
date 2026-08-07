import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader as Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ChatMessage {
  id?: string
  sender: 'customer' | 'bot'
  message: string
  is_inquiry?: boolean
  created_at?: string
}

interface QuickQuestion {
  label: string
  keywords: string[]
  answer: string
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    label: 'Shipping',
    keywords: ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'when will', 'arrive'],
    answer: 'We offer free shipping on orders over ₹999! Standard delivery takes 3-5 business days within India. Express delivery (1-2 days) is available for an extra ₹99.',
  },
  {
    label: 'Returns',
    keywords: ['return', 'refund', 'exchange', 'money back', 'cancel'],
    answer: 'We have a 7-day return policy. If you\'re not happy with your purchase, you can return it within 7 days for a full refund or exchange. Items must be unused and in original packaging.',
  },
  {
    label: 'Payment',
    keywords: ['payment', 'pay', 'cod', 'upi', 'card', 'cash', 'method'],
    answer: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and all major credit/debit cards. Your payment information is always secure.',
  },
  {
    label: 'Product Safety',
    keywords: ['safe', 'safety', 'age', 'material', 'quality', 'toxic', 'bpa'],
    answer: 'All our toys are made from non-toxic, child-safe materials and meet strict safety standards. Each product page shows the recommended age range.',
  },
  {
    label: 'Track Order',
    keywords: ['track', 'order status', 'where is my order', 'tracking'],
    answer: 'Once your order is shipped, you\'ll receive a tracking link via email and SMS. You can also contact us at +91 99004 85693 for order updates.',
  },
  {
    label: 'Contact',
    keywords: ['contact', 'phone', 'email', 'reach', 'talk', 'human', 'agent', 'help'],
    answer: 'You can reach us at +91 99004 85693 or email soyal@veehaandigitech.com. Our team is available Monday to Saturday, 9am to 8pm IST.',
  },
  {
    label: 'Bulk Orders',
    keywords: ['bulk', 'wholesale', 'large order', 'discount', 'party', 'gift'],
    answer: 'For bulk orders and party gifting, we offer special discounts! Please contact us at soyal@veehaandigitech.com or +91 99004 85693 for a custom quote.',
  },
]

const GREETING: ChatMessage = {
  sender: 'bot',
  message: 'Hi there! Welcome to VeehaanToys! How can I help you today? You can ask about shipping, returns, payments, or any product questions.',
}

function getBotResponse(text: string): { reply: string; isInquiry: boolean } {
  const lower = text.toLowerCase().trim()

  if (!lower) return { reply: 'Please type your question and I\'ll do my best to help!', isInquiry: false }

  for (const q of QUICK_QUESTIONS) {
    if (q.keywords.some((kw) => lower.includes(kw))) {
      return { reply: q.answer, isInquiry: false }
    }
  }

  if (lower.match(/\b(hi|hello|hey|greetings|good morning|good evening)\b/)) {
    return { reply: 'Hello! How can I help you today? You can ask me about shipping, returns, payments, product safety, or anything else!', isInquiry: false }
  }

  if (lower.match(/\b(thanks|thank you|thx|great|awesome|perfect)\b/)) {
    return { reply: 'You\'re welcome! Is there anything else I can help you with? Happy shopping! 🧸', isInquiry: false }
  }

  if (lower.match(/\b(price|cost|how much|rate)\b/)) {
    return { reply: 'You can find the price of each product on its product page. We show prices in both Rupees (₹) and Dollars ($). Would you like to browse our shop?', isInquiry: false }
  }

  if (lower.match(/\b(stock|available|in stock|out of stock)\b/)) {
    return { reply: 'Each product page shows the current stock status and quantity available. If an item is out of stock, check back soon — we restock regularly!', isInquiry: false }
  }

  return {
    reply: 'That\'s a great question! I\'ve noted your inquiry and our team will get back to you. For urgent matters, you can also reach us at +91 99004 85693 or soyal@veehaandigitech.com.',
    isInquiry: true,
  }
}

function getSessionId(): string {
  let id = localStorage.getItem('veehaantoys_chat_session')
  if (!id) {
    id = `chat-${crypto.randomUUID()}`
    localStorage.setItem('veehaantoys_chat_session', id)
  }
  return id
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const loadMessages = async () => {
    const sessionId = getSessionId()
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (data && data.length > 0) {
      setMessages(data as ChatMessage[])
    } else {
      setMessages([GREETING])
    }
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setSending(true)
    const sessionId = getSessionId()

    const customerMsg: ChatMessage = { sender: 'customer', message: trimmed }
    setMessages((prev) => [...prev, customerMsg])
    setInput('')

    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'customer',
        message: trimmed,
        is_inquiry: false,
      })

      await new Promise((r) => setTimeout(r, 600))

      const { reply, isInquiry } = getBotResponse(trimmed)
      const botMsg: ChatMessage = { sender: 'bot', message: reply, is_inquiry: isInquiry }
      setMessages((prev) => [...prev, botMsg])

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'bot',
        message: reply,
        is_inquiry: isInquiry,
      })

      if (!isOpen) setUnread(true)
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', message: 'Sorry, I had trouble sending that. Please try again!' }])
    }

    setSending(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setUnread(false)
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle size={26} />
          {unread && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white" />}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={22} />
              </div>
              <div>
                <p className="font-semibold leading-tight">VeehaanToys Assistant</p>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full inline-block" /> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={msg.id || i} className={`flex items-end gap-2 ${msg.sender === 'customer' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'bot' ? 'bg-orange-100' : 'bg-red-100'}`}>
                  {msg.sender === 'bot' ? <Bot size={16} className="text-orange-500" /> : <User size={16} className="text-red-500" />}
                </div>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'bot' ? 'bg-white text-gray-700 rounded-bl-sm border border-gray-100' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-br-sm'}`}>
                  {msg.message}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-orange-100">
                  <Bot size={16} className="text-orange-500" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white border border-gray-100">
                  <Loader2 size={16} className="text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                <button
                  key={q.label}
                  onClick={() => sendMessage(q.label)}
                  className="text-xs px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors border border-orange-200"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input) }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none text-sm"
                disabled={sending}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={sending || !input.trim()}
                className="p-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
