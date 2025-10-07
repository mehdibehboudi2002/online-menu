'use client';

import React, { useRef, useEffect, useState } from 'react';
import MenuItem from '@/lib/features/home/components/CategorizedMenu/MenuItem';
import { useTranslation } from 'react-i18next';
import { searchMenuItems } from '@/api/menu';
import { MenuItem as MenuItemType } from '@/types/api';
import ItemModal from '@/lib/features/home/components/CategorizedMenu/ItemModal/ItemModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  dark: boolean;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch, dark }) => {
  const { t, i18n } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // New states for search functionality
  const [searchResults, setSearchResults] = useState<MenuItemType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);

  // Track if we applied scroll lock to avoid conflicts
  const hasAppliedScrollLock = useRef(false);

  // Ensure component is hydrated before any animations
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to handle background scroll lock
  useEffect(() => {
    if (!hasMounted) return;

    // Only manage scroll lock when SearchModal is open AND ItemModal is not open
    const shouldManageScrollLock = isOpen && !selectedItem;

    if (shouldManageScrollLock && !hasAppliedScrollLock.current) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.setProperty('--scroll-y', `${scrollY}px`);

      // Add CSS class to hide scrollbar and prevent scrolling
      document.body.classList.add('modal-scroll-lock');
      document.body.style.top = `-${scrollY}px`;
      hasAppliedScrollLock.current = true;
    } else if (!isOpen && hasAppliedScrollLock.current) {
      // Only restore scroll when SearchModal is completely closed
      const scrollY = document.body.style.getPropertyValue('--scroll-y');

      // Remove the scroll lock class and styles
      document.body.classList.remove('modal-scroll-lock');
      document.body.style.top = '';

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY) || 0);
      }
      hasAppliedScrollLock.current = false;
    }

    // Cleanup function to ensure class is removed if component unmounts
    return () => {
      if (hasAppliedScrollLock.current) {
        const scrollY = document.body.style.getPropertyValue('--scroll-y');
        document.body.classList.remove('modal-scroll-lock');
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY) || 0);
        }
        hasAppliedScrollLock.current = false;
      }
    };
  }, [isOpen, selectedItem, hasMounted]); // Add selectedItem as dependency

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
  const handleImageError = (itemId: string) => {
    setFailedImages(prev => new Set([...prev, itemId]));
  };

  const getCategoryDisplayName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
    // Re-focus the search input when ItemModal closes
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Don't render if component shouldn't be shown or hasn't mounted
  if (!shouldRender || !hasMounted) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] flex items-start justify-center p-4 transition-opacity duration-150 overflow-y-auto ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{
          backgroundColor: dark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
        onClick={handleBackdropClick}
      >
        <div
          className={`relative transition-all duration-150 ease-out w-full sm:w-[90%] mt-10 md:mt-20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Section */}
          <div className={`flex items-center space-x-2 border-b-2 ${dark ? "border-white" : "border-black"} pb-4`}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('search.placeholder') || 'Search...'}
              className={`
                flex-grow outline-none bg-transparent border-none text-sm sm:text-base font-farsi-chalkboard text-center
                ${i18n.language === 'fa' ? 'sm:text-right' : 'sm:text-left'}
                ${dark ? 'text-white placeholder-gray-400/70' : 'text-green-50 placeholder-green-50/70'}
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
                className={`w-[24px] h-[24px] p-0 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${dark ? 'hover:bg-slate-900/50' : 'hover:bg-green-950/20'
                  }`}
                aria-label="Clear search"
                type="button"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={dark ? "#fff" : "#f0fdf4"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Search Results Section */}
          {hasSearched && (
            <div className="mt-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${dark ? 'border-current' : 'border-green-50'}`}></div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <h3 className={`text-sm sm:text-base font-bold mb-4 ${dark ? 'text-white' : 'text-green-50'}`}>
                    {t('search.results') || 'Search Results'} ({searchResults.length})
                  </h3>

                  {/* Desktop Grid Layout */}
                  <div className={`hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2 custom_scrollbar ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'}`}>
                    {searchResults.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onImageError={handleImageError}
                        failedImages={failedImages}
                        getCategoryDisplayName={getCategoryDisplayName}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </div>

                  {/* Mobile List Layout */}
                  <div className={`md:hidden max-h-[400px] overflow-y-auto custom_scrollbar overflow-x-hidden ${dark ? 'dark_mode_scrollbar' : 'light_mode_scrollbar'}`}>
                    {searchResults.map((item) => (
                      <MenuItem
                        key={item.id}
                        item={item}
                        onImageError={handleImageError}
                        failedImages={failedImages}
                        getCategoryDisplayName={getCategoryDisplayName}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className={`text-4xl mb-4 ${dark ? 'text-gray-400' : 'text-green-50'}`}>
                    🔍
                  </div>
                  <p className={`text-sm sm:text-base ${dark ? 'text-gray-300' : 'text-green-50'}`}>
                    {t('search.no_results') || 'No results found'}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2 ${dark ? 'text-gray-400' : 'text-green-50'}`}>
                    {t('search.try_different') || 'Try searching with different keywords'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Initial State - Show when no search has been performed */}
          {!hasSearched && (
            <div className="text-center py-8">
              <div className={`text-4xl mb-4 ${dark ? 'text-gray-400' : 'text-green-50'}`}>
                🍽️
              </div>
              <p className={`text-sm sm:text-base ${dark ? 'text-gray-400' : 'text-green-50'}`}>
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