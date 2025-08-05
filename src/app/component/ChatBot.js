import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Home, MapPin, Phone, Mail } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hello! Welcome to home assist. I'm here to help you with any questions about our properties, services, or general inquiries. How can I assist you today?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickReplies = [
        "View available properties",
        "Property prices",
        "Schedule a viewing",
        "Contact information",
        "Mortgage assistance"
    ];

    const getBotResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Thanks for reaching out to home assist. How can I help you find your perfect property today?";
        }

        if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
            return "Our properties range from £150,000 to £2,500,000. I can help you find options within your budget. What's your preferred price range?";
        }

        if (message.includes('property') || message.includes('house') || message.includes('apartment') || message.includes('flat')) {
            return "We have a wide selection of properties including apartments, houses, and commercial spaces across the UK. Are you looking for something specific - buy or rent?";
        }

        if (message.includes('viewing') || message.includes('visit') || message.includes('schedule')) {
            return "I'd be happy to schedule a property viewing for you! Please provide your preferred dates and the property you're interested in. You can also call us at +353 89 428 7326.";
        }

        if (message.includes('location') || message.includes('area') || message.includes('where')) {
            return "We cover properties across London, Manchester, Birmingham, Liverpool, and other major UK cities. Which area interests you most?";
        }

        if (message.includes('mortgage') || message.includes('finance') || message.includes('loan')) {
            return "We work with trusted mortgage advisors who can help you secure the best rates. Would you like me to connect you with one of our financial partners?";
        }

        if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
            return "You can reach us at:\n📞 +353 89 428 7326\n📧 gursimranbasra7.gs@gmail.com\n📍 Maynooth, Ireland\nOffice hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM";
        }

        if (message.includes('thank')) {
            return "You're very welcome! Is there anything else I can help you with regarding our properties or services?";
        }

        return "Thanks for your message! For detailed information about specific properties or to speak with one of our property experts, please call +353 89 428 7326 or email gursimranbasra7.gs@gmail.com. Is there anything else I can help you with?";
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botResponse = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(inputValue),
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleQuickReply = (reply) => {
        setInputValue(reply);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
                    aria-label="Open chat"
                >
                    <MessageCircle size={24} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        1
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <Home size={16} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">home assist</h3>
                                <p className="text-xs opacity-90">Online now</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                            aria-label="Close chat"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${message.isUser
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="whitespace-pre-line">{message.text}</p>
                                    <span className={`text-xs mt-1 block ${message.isUser ? 'text-blue-100' : 'text-gray-500'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-3 py-2 text-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies (show only for first interaction) */}
                    {messages.length <= 1 && (
                        <div className="px-4 py-2 border-t border-gray-200 bg-white">
                            <p className="text-xs text-gray-600 mb-2">Quick options:</p>
                            <div className="flex flex-wrap gap-1">
                                {quickReplies.slice(0, 3).map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickReply(reply)}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
                                aria-label="Send message"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;