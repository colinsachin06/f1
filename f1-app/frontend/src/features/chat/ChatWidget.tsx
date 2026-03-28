import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../../services/apiService';
import { X, Send, Bot, User, Trash2, Loader } from 'lucide-react';
import clsx from 'clsx';
import type { ChatMessage } from '../../types';

interface ChatWidgetProps {
  sessionKey?: number;
  onClose: () => void;
}

export default function ChatWidget({ sessionKey, onClose }: ChatWidgetProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: chatApi.getHistory,
    enabled: true,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => chatApi.sendMessage(message, sessionKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: chatApi.clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(input.trim());
    setInput('');
  };

  const messages: ChatMessage[] = history || [];

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-f1-red" />
          <h3 className="font-f1 font-semibold">Pit Wall Engineer</h3>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => clearHistoryMutation.mutate()}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 mb-1">Ask me about F1 strategy!</p>
            <p className="text-xs text-gray-500">
              I can help with pit stop timing, overtaking analysis, and race strategy.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={clsx(
                  'flex gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user' ? 'bg-f1-red' : 'bg-gray-700'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={clsx(
                    'flex-1 p-3 rounded-lg text-sm',
                    message.role === 'user'
                      ? 'bg-f1-red/20 text-gray-100'
                      : 'bg-gray-800 text-gray-200'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 p-3 rounded-lg bg-gray-800">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about race strategy..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-f1-red"
            disabled={sendMessageMutation.isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="p-2 bg-f1-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {sessionKey && (
          <p className="text-xs text-gray-500 mt-2">
            Context: Session {sessionKey}
          </p>
        )}
      </form>
    </div>
  );
}
