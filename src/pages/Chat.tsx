
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, ArrowLeft, Circle, Smile } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [partnerUsername, setPartnerUsername] = useState('Parceiro');
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('chatUsername');
    if (!storedUsername) {
      navigate('/login');
      return;
    }
    
    setUsername(storedUsername);
    
    // Simulate messages for demo purposes
    const demoMessages = [
      {
        id: '1',
        sender: 'Parceiro',
        content: 'Olá, como vai?',
        timestamp: new Date(Date.now() - 600000) // 10 minutes ago
      },
      {
        id: '2',
        sender: storedUsername,
        content: 'Estou bem, e você?',
        timestamp: new Date(Date.now() - 540000) // 9 minutes ago
      },
      {
        id: '3',
        sender: 'Parceiro',
        content: 'Tudo ótimo! O que está fazendo?',
        timestamp: new Date(Date.now() - 480000) // 8 minutes ago
      }
    ];
    
    setMessages(demoMessages);
    
    // Clean up
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [navigate]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: username,
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
    
    // Simulate partner response
    setTimeout(() => {
      const partnerResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'Parceiro',
        content: 'Entendi! Vamos continuar conversando.',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, partnerResponse]);
      toast("Nova mensagem recebida");
    }, 3000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to hide typing indicator after 2 seconds
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('chatUsername');
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4 h-screen max-w-lg">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b px-4 py-3 flex flex-row items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={handleLogout}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Button>
          
          <div className="flex-1">
            <CardTitle className="text-center text-lg">{partnerUsername}</CardTitle>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Circle className={`h-2 w-2 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          
          <div className="w-8"></div> {/* Spacer for alignment */}
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === username 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className={`text-xs mt-1 ${
                      msg.sender === username ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {isTyping && (
            <div className="px-4 py-1 text-xs text-gray-500 italic">
              Você está digitando...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2 items-end">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem"
                className="pr-10 py-3 min-h-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 bottom-1/2 transform translate-y-1/2 text-gray-400"
              >
                <Smile className="h-5 w-5" />
                <span className="sr-only">Emojis</span>
              </Button>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600"
              disabled={!message.trim()}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Enviar mensagem</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
