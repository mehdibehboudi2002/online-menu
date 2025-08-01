'use client';

import React, { useRef, useEffect, useState } from 'react';
import MenuItem from '@/lib/features/home/components/CategorizedMenu/MenuItem';
import { useTranslation } from 'react-i18next';
import { searchMenuItems } from '@/api/menu';
import { MenuItem as MenuItemType } from '@/types/api';
// Import the ItemModal component
import ItemModal from '@/lib/features/home/components/CategorizedMenu/ItemModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  dark: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch, dark }) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // New states for search functionality
  const [searchResults, setSearchResults] = useState<MenuItemType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  // State to hold the item that was clicked to be displayed in the modal
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  // Ensure component is hydrated before any animations
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return; // Don't run animations until hydrated

    if (isOpen) {
      // When opening: first render the component, then start the animation
      setShouldRender(true);
      // Use a slightly longer timeout to ensure proper rendering
      setTimeout(() => {
        setIsVisible(true);
      }, 20);
      // Auto-focus after animation starts
      setTimeout(() => inputRef.current?.focus(), 120);
    } else {
      // When closing: start the closing animation first
      setIsVisible(false);
      // Then remove from DOM after animation completes
      setTimeout(() => {
        setShouldRender(false);
      }, 150); // This should match your transition duration
    }
  }, [isOpen, hasMounted]);

  // Auto-search effect - triggers search when user types
  useEffect(() => {
    if (!hasMounted) return;
    
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }
      
      // Only auto-search if the query has changed and is not empty
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, hasMounted]);

  // Function to perform search
  const performSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await searchMenuItems(query.trim());
      setSearchResults(results);
      // Also call the original onSearch prop if needed
      onSearch(query.trim());
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle key press for Escape key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    onClose();
  };

  // Handle image errors for search results
  const handleImageError = (itemId: number) => {
    setFailedImages(prev => new Set([...prev, itemId]));
  };

  // Category display name function (you might need to adjust this based on your actual implementation)
  const getCategoryDisplayName = (category: string) => {
    // This should match your existing category display logic
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Updated handleItemClick function to set the selected item
  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };
  
  // New function to close the item modal by resetting the state
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Don't render if component shouldn't be shown or hasn't mounted
  if (!shouldRender || !hasMounted) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[999] flex items-start justify-center p-4 transition-opacity duration-150 overflow-y-auto ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
        onClick={handleBackdropClick}
      >
        <div
          className={`relative transition-all duration-150 ease-out w-full md:w-[90%] mt-10 md:mt-20 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Section */}
          <div className={`flex items-center space-x-2 border-b-2 ${dark ? "border-white" : "border-black"} pb-4 mb-6`}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('search.placeholder') || 'Search...'}
              className={`
                flex-grow outline-none bg-transparent border-none text-xl font-farsi-chalkboard
                ${dark ? 'text-white placeholder-gray-400' : 'text-green-950 placeholder-gray-300'}
              `}
            />
            
            {/* Erase button - only show when there's text */}
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setHasSearched(false);
                  setFailedImages(new Set());
                }}
                className={`w-[24px] h-[24px] p-0 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
                  dark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
                aria-label="Clear search"
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dark ? "#fff" : "#374151"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Loading indicator - only show when searching */}
            {isSearching && (
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <div className={`animate-spin rounded-full h-4 w-4 border-2 border-transparent ${
                  dark ? 'border-t-white' : 'border-t-green-950'
                }`}></div>
              </div>
            )}
          </div>

          {/* Search Results Section */}
          {hasSearched && (
            <div className="mt-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                  <span className={`ml-3 ${dark ? 'text-white' : 'text-green-950'}`}>
                    {t('search.searching') || 'Searching...'}
                  </span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-green-950'}`}>
                    {t('search.results') || 'Search Results'} ({searchResults.length})
                  </h3>
                  
                  {/* Desktop Grid Layout */}
                  <div className={`hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto overflow-x-hidden pr-2 custom_scrollbar ${dark? 'dark_mode_scrollbar' : 'light_mode_scrollbar'}`}>
                    {searchResults.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onImageError={handleImageError}
                        failedImages={failedImages}
                        getCategoryDisplayName={getCategoryDisplayName}
                        onItemClick={handleItemClick} // Pass the updated handler
                      />
                    ))}
                  </div>

                  {/* Mobile List Layout */}
                  <div className={`md:hidden max-h-96 overflow-y-auto custom_scrollbar overflow-x-hidden ${dark? 'dark_mode_scrollbar' : 'light_mode_scrollbar'}`}>
                    {searchResults.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onImageError={handleImageError}
                        failedImages={failedImages}
                        getCategoryDisplayName={getCategoryDisplayName}
                        onItemClick={handleItemClick} // Pass the updated handler
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className={`text-4xl mb-4 ${dark ? 'text-gray-400' : 'text-gray-300'}`}>
                    🔍
                  </div>
                  <p className={`text-lg ${dark ? 'text-gray-300' : 'text-gray-300'}`}>
                    {t('search.no_results') || 'No results found'}
                  </p>
                  <p className={`text-sm mt-2 ${dark ? 'text-gray-400' : 'text-gray-300'}`}>
                    {t('search.try_different') || 'Try searching with different keywords'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Initial State - Show when no search has been performed */}
          {!hasSearched && (
            <div className="text-center py-8">
              <div className={`text-4xl mb-4 ${dark ? 'text-gray-400' : 'text-gray-300'}`}>
                🍽️
              </div>
              <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-300'}`}>
                {t('search.start_typing') || 'Start typing to search menu items'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Conditionally render the ItemModal when an item is selected */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={closeModal}
          onImageError={handleImageError}
          failedImages={failedImages}
          getCategoryDisplayName={getCategoryDisplayName}
        />
      )}
    </>
  );
};

export default SearchModal;