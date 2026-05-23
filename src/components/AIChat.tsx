 
 
 
 
"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
// Removed unused useChat import
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatBody = useMemo(() => ({
    data: {
      cartItems: cartItems.map((item: { name: string; price: number; quantity: number }) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }
  }), [cartItems]);

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  content: string;
}

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: { role: string, content: string }) => {
    const newMessages = [...messages, { id: Date.now().toString(), ...message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, data: chatBody.data })
      });

      if (!res.ok) throw new Error('API xatosi');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ role: 'user', content: inputValue });
    setInputValue('');
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-semibold text-lg">AI Maslahatchi</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-slate-50 dark:bg-slate-950 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
                <Bot size={48} className="mx-auto mb-4 opacity-50" />
                <p>Assalomu alaykum! Men UzMarket maslahatchisiman. Sizga qanday yordam bera olaman?</p>
              </div>
            ) : (
              messages.map((m: { id: string; role: string; content: string }) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none flex items-center gap-2 text-sm">
                  <Loader2 size={16} className="animate-spin" /> Yozmoqda...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={onSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group relative"
        >
          <MessageCircle size={24} />
          <span className="font-medium">AI Maslahatchi</span>
          {cartItems.length > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                AI
             </span>
          )}
        </button>
      )}
    </div>
  );
}
