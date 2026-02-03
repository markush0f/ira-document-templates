import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, Maximize2, Minimize2, Sparkles } from 'lucide-react';

// --- Types ---

interface Message {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

// --- Hook: useChat ---
export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'bot',
            content: 'Hello! I am your documentation assistant. How can I help you regarding the project?',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async (content: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate network delay logic
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                content: generateResponse(content),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500 + Math.random() * 1000);
    };

    const generateResponse = (input: string): string => {
        const lower = input.toLowerCase();
        if (lower.includes('astro')) return 'Astro is an all-in-one web framework for building fast, content-focused websites.';
        if (lower.includes('react')) return 'React is the library for web and native user interfaces.';
        if (lower.includes('tailwind')) return 'Tailwind CSS is a utility-first CSS framework packed with classes.';
        if (lower.includes('hello') || lower.includes('hi')) return 'Hi there! Ready to build something amazing?';
        return "That's interesting! I can help you find more information about that in the docs.";
    };

    const clearChat = () => {
        setMessages([
            {
                id: Date.now().toString(),
                role: 'bot',
                content: 'Chat cleared. How can I help you now?',
                timestamp: new Date(),
            }
        ]);
    };

    return { messages, isTyping, sendMessage, clearChat };
}

// --- Components ---

const ChatMessageItem = ({ message }: { message: Message }) => {
    const isBot = message.role === 'bot';
    return (
        <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${isBot
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}>
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble */}
                <div className={`relative p-3.5 rounded-2xl text-sm leading-relaxed ${isBot
                    ? 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/50'
                    : 'bg-blue-600 dark:bg-blue-600 text-white rounded-tr-none shadow-sm'
                    }`}>
                    {message.content}
                </div>
            </div>
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex w-full justify-start animate-fade-in-up">
        <div className="flex max-w-[80%] gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bot size={14} />
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-2xl rounded-tl-none border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-1 h-[42px]">
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

// --- Main Chatbot Component ---

// --- Main Chatbot Component ---

interface ChatbotProps {
    fullPage?: boolean;
}

export default function Chatbot({ fullPage = false }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(fullPage); // Always open if fullPage
    const [isExpanded, setIsExpanded] = useState(fullPage); // Always expanded if fullPage
    const { messages, isTyping, sendMessage, clearChat } = useChat();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping, isOpen, isExpanded]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    const toggleOpen = () => {
        if (fullPage) return;
        setIsOpen(!isOpen);
        if (isOpen) setIsExpanded(false);
    };

    // Container styles based on mode
    const containerClasses = fullPage
        ? "flex flex-col w-full h-full min-h-[600px] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[#0a0a0a]"
        : `
            transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden
            bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800
            ${isExpanded
            ? 'w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl scale-100 opacity-100'
            : `w-[360px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-100px)] rounded-2xl shadow-xl origin-bottom-right
                 ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'}`
        }
          `;

    const wrapperClasses = fullPage
        ? "w-full h-full p-4 md:p-8"
        : `fixed z-50 flex flex-col items-end gap-4 font-sans antialiased
            ${isExpanded
            ? 'inset-0 items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-sm p-4'
            : 'bottom-6 right-6'
        }`;

    return (
        <div className={wrapperClasses}>
            {/* Chat Window */}
            <div className={containerClasses}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-100 dark:border-zinc-800/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                            <Bot size={16} strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-tight">Assistant</h3>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Documentation Helper</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                        <button
                            onClick={clearChat}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md transition-colors"
                            title="Clear Chat"
                        >
                            <RefreshCw size={16} />
                        </button>

                        {!fullPage && (
                            <>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md transition-colors hidden sm:flex"
                                    title={isExpanded ? "Collapse" : "Expand"}
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-md transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar">
                    {messages.map((msg) => (
                        <ChatMessageItem key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message..."
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 rounded-xl py-2.5 pl-4 pr-10 outline-none transition-all placeholder:text-zinc-400 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-1.5 p-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 flex items-center justify-center"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Toggle Button (Only visible when not fullPage, not expanded, and NOT OPEN) */}
            {!fullPage && !isExpanded && !isOpen && (
                <button
                    onClick={toggleOpen}
                    className={`
              flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 border border-zinc-200 dark:border-zinc-700
              ${isOpen
                            ? 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rotate-90'
                            : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }
            `}
                >
                    {isOpen ? <X size={20} /> : <MessageCircle size={20} strokeWidth={2} />}
                </button>
            )}
        </div>
    );
}
