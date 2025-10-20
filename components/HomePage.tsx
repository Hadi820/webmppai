import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToChat, startChatSession } from '../services/geminiService';
import { QUICK_CATEGORIES } from '../constants';
import { Agency, ServiceDetails, ChatMessage } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ChatHistory } from './ChatHistory';
import { ServiceGrid } from './ServiceGrid';
import { ServiceModal } from './ServiceModal';
import { Footer } from './Footer';
import { QuerySuggestions } from './QuerySuggestions';
import AnimatedText from './AnimatedText';
// import { logChatInteraction } from '../services/supabaseService';
import { getFollowUpSuggestions } from '../utils/followUpSuggestions';

interface HomePageProps {
  agencies: Agency[];
}

export const HomePage: React.FC<HomePageProps> = ({ agencies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Halo warga Pandeglang! Saya asisten virtual MPP Pandeglang yang siap membantu Anda dengan informasi layanan. Anda bisa bertanya tentang syarat, alur, atau biaya layanan. "
    }
  ]);

  const [selectedService, setSelectedService] = useState<ServiceDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    startChatSession();
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [query]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerCaseQuery = query.toLowerCase();
    const suggestions: string[] = [];

    agencies.forEach(agency => {
      agency.services.forEach(service => {
        if (service.namaLayanan.toLowerCase().includes(lowerCaseQuery)) {
          suggestions.push(service.namaLayanan);
        }
      });
    });

    return suggestions;
  }, [query, agencies]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;

    const newQuery: ChatMessage = { role: 'user', content: searchQuery };
    setChatHistory(prev => [...prev, newQuery]);
    setQuery('');
    setIsLoading(true);

    const startTime = Date.now();
    
    // Add placeholder for streaming response
    const streamingMessageIndex = chatHistory.length + 1;
    setChatHistory(prev => [...prev, { role: 'model', content: '' }]);

    try {
      let streamedText = '';
      
      const result = await sendMessageToChat(searchQuery, (chunk: string) => {
        streamedText += chunk;
        setChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[streamingMessageIndex] = { role: 'model', content: streamedText };
          return newHistory;
        });
      });
      
      const responseTime = Date.now() - startTime;
      
      // Update with final result
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[streamingMessageIndex] = { role: 'model', content: result };
        return newHistory;
      });

      const suggestions = getFollowUpSuggestions(searchQuery);
      setFollowUpSuggestions(suggestions);

      // Scroll ke respons terbaru setelah selesai
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 150);

      // const serviceInquired = typeof result === 'object' ? result.namaLayanan : 'Umum';
      // logChatInteraction(searchQuery, serviceInquired, responseTime, true);

    } catch (err) {
      const responseTime = Date.now() - startTime;
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[streamingMessageIndex] = { role: 'error', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.' };
        return newHistory;
      });
      console.error(err);

      // logChatInteraction(searchQuery, 'Error', responseTime, false);
    } finally {
      setIsLoading(false);
      // Jangan fokuskan textarea secara otomatis setelah respons selesai
      // Biarkan pengguna membaca respons dengan tenang
    }
  }, [isLoading, chatHistory.length]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch(query);
    }
  };

  const handleQuickCategoryClick = (category: string) => {
    handleSearch(category);
  };

  const handleServiceCardClick = (service: ServiceDetails) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-800 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Tombol Login di atas kiri */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      </div>

      <main className="relative z-10 flex-grow flex flex-col">
        <div className="w-full text-center pt-6 sm:pt-10 md:pt-16 px-4">
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 md:mb-4 animate-fade-in-up shadow-lg">
            🏛️ Mal Pelayanan Publik
          </div>

          <div className="mb-2 sm:mb-3 md:mb-4 animate-fade-in-up [animation-delay:100ms]">
            <AnimatedText />
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 animate-fade-in-up [animation-delay:200ms] mb-2">
            💬 Contoh pertanyaan yang bisa kamu ajukan:
          </p>
        </div>

        <div ref={chatContainerRef} className="flex-grow flex flex-col overflow-y-auto px-4">
          <ChatHistory messages={chatHistory} isLoading={isLoading} />
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-3 sm:pt-4 pb-4 sm:pb-6 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-3 sm:px-4">
            <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 min-h-[28px] sm:min-h-[34px]">
              {query.trim() === '' ? (
                chatHistory.length <= 1 ? (
                  QUICK_CATEGORIES.map((cat, index) => (
                    <button
                      key={cat}
                      onClick={() => handleQuickCategoryClick(cat)}
                      disabled={isLoading}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-white hover:bg-blue-500 hover:text-white border-2 border-blue-200 hover:border-blue-500 rounded-full transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md transform hover:scale-105 animate-fade-in-up"
                      style={{ animationDelay: `${450 + index * 80}ms` }}
                    >
                      {cat}
                    </button>
                  ))
                ) : (
                  followUpSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleQuickCategoryClick(suggestion)}
                      disabled={isLoading}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-500 hover:to-blue-500 hover:text-white border-2 border-purple-200 hover:border-purple-400 rounded-full transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md transform hover:scale-105 animate-fade-in-up"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      💡 {suggestion}
                    </button>
                  ))
                )
              ) : (
                <QuerySuggestions
                  suggestions={filteredSuggestions}
                  onSuggestionClick={handleSearch}
                  isLoading={isLoading}
                />
              )}
            </div>
            <form onSubmit={handleSubmit} className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-blue-300 flex items-end p-2 sm:p-2.5 md:p-3 gap-2 sm:gap-2.5 md:gap-3 hover:border-blue-400 transition-all duration-300">
              <div className="absolute -top-1 -left-1 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <textarea
                ref={textareaRef}
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="🗨️ Ketik pertanyaan kamu di sini..."
                className="relative z-10 w-full text-sm sm:text-base md:text-lg bg-transparent focus:outline-none resize-none px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 self-center max-h-48 text-gray-800 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="relative z-10 h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex-shrink-0 shadow-lg hover:shadow-xl btn-ripple"
                disabled={isLoading || !query.trim()}
              >
                <ArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </div>
        </div>

        {chatHistory.length <= 1 && (
          <ServiceGrid agencies={agencies} onServiceClick={handleServiceCardClick} />
        )}
      </main>

      <Footer />

      {isModalOpen && selectedService && (
        <ServiceModal service={selectedService} onClose={closeModal} />
      )}
    </div>
  );
};
