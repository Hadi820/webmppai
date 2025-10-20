
import React from 'react';

interface QuerySuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({ suggestions, onSuggestionClick, isLoading }) => {
  if (suggestions.length === 0) {
    return (
      <div className="text-center text-xs sm:text-sm text-gray-500 py-1.5 sm:py-2 px-3 sm:px-4 bg-gray-50 rounded-full border border-gray-200 animate-fade-in">
        💡 Tidak ada layanan yang cocok. Coba kata kunci lain.
      </div>
    );
  }

  return (
    <>
      {suggestions.slice(0, 5).map((suggestion, idx) => ( // Show max 5 suggestions
        <button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          disabled={isLoading}
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-500 hover:to-purple-500 hover:text-white border-2 border-blue-200 hover:border-blue-400 rounded-full transition-all duration-300 disabled:opacity-50 shadow-sm hover:shadow-md transform hover:scale-105 animate-scale-in"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          {suggestion}
        </button>
      ))}
    </>
  );
};
