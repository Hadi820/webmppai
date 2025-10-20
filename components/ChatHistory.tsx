import React, { useEffect, useRef } from 'react';
import { ChatMessage, ServiceDetails } from '../types';
import { PlainTextResponse } from './PlainTextResponse';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

// Fungsi untuk memproses teks dan menambahkan bold pada judul paragraf
const processText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Ganti **teks** dengan <strong>teks</strong>
    .replace(/^\* /gm, '');  // Hapus * di awal baris jika ada
};

const UserMessage: React.FC<{ content: string }> = ({ content }) => (
  <div className="flex justify-end animate-slide-in-right">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-2xl sm:rounded-3xl rounded-br-md max-w-lg shadow-lg">
      <p className="leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base break-words">{content}</p>
    </div>
  </div>
);

const ModelMessage: React.FC<{ content: string | ServiceDetails; isStreaming?: boolean }> = ({ content, isStreaming }) => (
  <div className="flex justify-start animate-slide-in-left">
    <div className="glass-effect text-gray-800 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 rounded-2xl sm:rounded-3xl rounded-bl-md max-w-4xl w-full shadow-lg border border-blue-100">
      {typeof content === 'string' ? (
        <div
          className="leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processText(content) }}
        />
      ) : (
        <PlainTextResponse data={content} />
      )}
      {isStreaming && <span className="inline-block w-1.5 h-4 sm:h-5 bg-blue-500 ml-1 animate-pulse"></span>}
    </div>
  </div>
);

const ErrorMessage: React.FC<{ content: string }> = ({ content }) => (
  <div className="flex justify-start animate-slide-in-left">
    <div className="bg-gradient-to-br from-red-50 to-red-100 text-red-700 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-2xl sm:rounded-3xl rounded-bl-md max-w-lg shadow-lg border-2 border-red-200">
      <div className="flex items-center">
        <span className="text-base sm:text-lg md:text-xl mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0">⚠️</span>
        <p className="leading-snug sm:leading-relaxed text-xs sm:text-sm md:text-base break-words">{content}</p>
        </div>
      </div>
    </div>
  );


export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      // Tambahkan delay kecil untuk memastikan respons selesai di-render sebelum scroll
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [messages, isLoading]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pt-4">
      {messages.map((msg, index) => {
        const isFirstMessage = index === 0 && msg.role === 'model';
        const animationClasses = isFirstMessage ? 'animate-fade-in-up [animation-delay:300ms]' : '';
        const isLastMessage = index === messages.length - 1;
        const isStreamingMessage = isLastMessage && isLoading && msg.role === 'model';

        switch (msg.role) {
          case 'user':
            return <UserMessage key={index} content={msg.content as string} />;
          case 'model':
            return (
              <div key={index} className={`${animationClasses} ${isLastMessage && !isLoading ? 'animate-pulse-once' : ''}`}>
                 <ModelMessage content={msg.content} isStreaming={isStreamingMessage} />
              </div>
            );
          case 'error':
             return <ErrorMessage key={index} content={msg.content as string} />;
          default:
            return null;
        }
      })}
      {isLoading && messages[messages.length - 1]?.role !== 'model' && (
        <div className="flex justify-start animate-fade-in">
          <div className="glass-effect px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-4 rounded-2xl sm:rounded-3xl rounded-bl-md shadow-lg border border-blue-100">
             <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 bg-blue-300 rounded-full animate-bounce"></div>
             </div>
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};