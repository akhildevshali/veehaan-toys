import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSending(true)
    try {
      await supabase.from('reviews').insert({ customer_name: form.name, rating: 5, review_text: `${form.subject}: ${form.message}`, featured: false })
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch { setSent(true) }
    setSending(false)
  }

  const contactInfo = [
    { icon: Phone, title: 'Phone', value: '+91 99004 85693' },
    { icon: Mail, title: 'Email', value: 'soyal@veehaandigitech.com' },
    { icon: MapPin, title: 'Address', value: ' Bangaluru, India' },
    { icon: Clock, title: 'Hours', value: 'Mon - Sat: 9am - 8pm' },
  ]

  return (
    <div>
      <section className="bg-gradient-to-r from-red-500 to-yellow-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-orange-500" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{info.title}</p>
                    <p className="text-gray-500 text-sm">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><Check className="text-green-600" size={32} /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-red-500 font-medium hover:underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
                  <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
                </div>
                <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none" />
                <textarea required placeholder="Your Message *" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-400 focus:outline-none resize-none" />
                <button type="submit" disabled={sending} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2">
                  {sending ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
