import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your AI assistant for ThyroLab. How can I help you understand your thyroid diagnostics today?", sender: "bot" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { id: Date.now(), text: inputText, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        try {
            if (!apiKey) {
                throw new Error("Gemini API key is not configured in the .env file. Please add VITE_GEMINI_API_KEY.");
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // Provide a tailored system prompt essentially by prepping the model with context
            const prompt = `You are a helpful healthcare AI assistant for a clinical SaaS application named ThyroLab. 
Your goal is to answer questions about thyroid conditions, general clinical platform features, and medical diagnostics concisely and professionally.
User's Question: ${inputText}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const botMessage = { id: Date.now() + 1, text, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage = { 
                id: Date.now() + 1, 
                text: "I'm sorry, I'm having trouble connecting right now. Make sure your API key is correctly configured in the .env file.", 
                sender: "bot", 
                isError: true 
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([{ id: 1, text: "Hello! I am your AI assistant for ThyroLab. How can I help you understand your thyroid diagnostics today?", sender: "bot" }]);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-colors ${isOpen ? 'bg-slate-800 text-white dark:bg-dark-card border dark:border-dark-border' : 'bg-brand-600 text-white dark:bg-violet-600'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-full max-w-[360px] h-[500px] bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-brand-600 dark:bg-violet-600 p-4 flex items-center justify-between shadow-md z-10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white leading-tight">ThyroBot Assistant</h3>
                                    <p className="text-brand-100 dark:text-violet-200 text-xs">Powered by Gemini</p>
                                </div>
                            </div>
                            <button onClick={handleClearChat} className="text-white/80 hover:text-white transition-colors p-1" title="Clear Chat">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Message Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-dark-surface min-h-0">
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`flex w-full ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex max-w-[85%] gap-2 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${message.sender === "user" ? "bg-brand-100 text-brand-600 dark:bg-violet-900/50 dark:text-violet-300" : "bg-white dark:bg-dark-card shadow-sm text-slate-600 dark:text-gray-300"}`}>
                                            {message.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div 
                                            className={`p-3 rounded-2xl text-sm ${
                                                message.sender === "user" 
                                                ? "bg-brand-600 text-white dark:bg-violet-600 rounded-tr-none shadow-sm" 
                                                : message.isError 
                                                    ? "bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400 rounded-tl-none shadow-sm" 
                                                    : "bg-white border border-slate-200 text-slate-700 dark:bg-dark-card dark:border-dark-border dark:text-gray-300 rounded-tl-none shadow-sm"
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex w-full justify-start">
                                    <div className="flex gap-2 max-w-[85%]">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 bg-white dark:bg-dark-card shadow-sm text-slate-600 dark:text-gray-300">
                                            <Bot size={14} />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:bg-dark-card dark:border-dark-border rounded-tl-none shadow-sm flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full bg-slate-100 dark:bg-dark-surface border border-transparent focus:border-brand-500 focus:bg-white dark:focus:border-violet-500 dark:focus:bg-dark-card text-slate-900 dark:text-white text-sm rounded-full pl-4 pr-12 py-2.5 outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isLoading}
                                    className="absolute right-1 w-8 h-8 rounded-full bg-brand-600 hover:bg-brand-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={14} className="ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
