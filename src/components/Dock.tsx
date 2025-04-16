import { Clock, FileText, Cloud, Calculator, ListTodo, Search, Image, Quote, Bell, Grid, X, ArrowRight, Globe, Brain, ChevronDown, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotificationContext } from '@/contexts/notification-context';
import { useState, useRef, useEffect } from 'react';
import WidgetExplorer from './widgets/WidgetExplorer';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DockProps {
  onAddWidget: (type: string) => void;
  onToggleWallpaper: () => void;
  onToggleNotifications: () => void;
}

// Search engine options
const searchEngines = [
  { id: 'google', name: 'Google', icon: '/icons/google.svg', url: 'https://www.google.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: '/icons/duckduckgo.svg', url: 'https://duckduckgo.com/?q=' },
  { id: 'bing', name: 'Bing', icon: '/icons/bing.svg', url: 'https://www.bing.com/search?q=' },
  { id: 'brave', name: 'Brave', icon: '/icons/brave.svg', url: 'https://search.brave.com/search?q=' },
  { id: 'firefox', name: 'Firefox', icon: '/icons/firefox.svg', url: 'https://www.mozilla.org/en-US/firefox/new/?q=' },
];

const Dock: React.FC<DockProps> = ({ onAddWidget, onToggleWallpaper, onToggleNotifications }) => {
  const { unreadCount } = useNotificationContext();
  const [showExplorer, setShowExplorer] = useState(false);
  const [explorerPosition, setExplorerPosition] = useState({ x: 0, y: 0 });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedEngine, setSelectedEngine] = useState(searchEngines[0]);
  const [showEngineOptions, setShowEngineOptions] = useState(false);
  const [useAISearch, setUseAISearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const explorerButtonRef = useRef<HTMLButtonElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const engineOptionsRef = useRef<HTMLDivElement>(null);

  const handleExplorerClick = () => {
    if (explorerButtonRef.current) {
      const buttonRect = explorerButtonRef.current.getBoundingClientRect();
      const x = Math.max(20, Math.min(window.innerWidth - 620, buttonRect.left - 300));
      const y = Math.max(20, buttonRect.top - 500);
      setExplorerPosition({ x, y });
      setShowExplorer(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to search history
      const newHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5);
      setSearchHistory(newHistory);
      
      // Save to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Open search in the same window
      if (useAISearch) {
        // AI search - using ChatGPT as an example
        window.location.href = `https://chat.openai.com/?q=${encodeURIComponent(searchTerm)}`;
      } else {
        window.location.href = `${selectedEngine.url}${encodeURIComponent(searchTerm)}`;
      }
      
      setSearchTerm('');
      setIsSearchExpanded(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchExpanded(false);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const useSearchHistoryItem = (term: string) => {
    setSearchTerm(term);
    searchInputRef.current?.focus();
  };

  const toggleAISearch = () => {
    setUseAISearch(!useAISearch);
  };

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse search history');
      }
    }
  }, []);

  // Focus input when search is expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchExpanded && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
      
      if (
        showEngineOptions && 
        engineOptionsRef.current && 
        !engineOptionsRef.current.contains(event.target as Node)
      ) {
        setShowEngineOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded, showEngineOptions]);

  return (
    <>
      <div className="dock animate-fade-in">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={() => onAddWidget('clock')}>
                <Clock size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Clock Widget</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={() => onAddWidget('notes')}>
                <FileText size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Notes Widget</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={() => onAddWidget('weather')}>
                <Cloud size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Weather Widget</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={() => onAddWidget('calculator')}>
                <Calculator size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Calculator Widget</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={() => onAddWidget('todo')}>
                <ListTodo size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>To-Do List Widget</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative search-container" ref={searchContainerRef}>
                <button 
                  className={cn(
                    "dock-item",
                    isSearchExpanded && "bg-white/20"
                  )}
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                  <Search size={20} />
                </button>
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-96 glass rounded-xl p-4 shadow-xl"
                    >
                      <form onSubmit={handleSearchSubmit}>
                        <div className="relative search-input-container">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Discover knowledge, explore ideas, find answers..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          />
                          {searchTerm && (
                            <button 
                              type="button"
                              onClick={() => setSearchTerm('')}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors search-clear-button"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        
                        {/* Search engine selector */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="relative" ref={engineOptionsRef}>
                            <button
                              type="button"
                              onClick={() => setShowEngineOptions(!showEngineOptions)}
                              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                              <img 
                                src={selectedEngine.icon} 
                                alt={selectedEngine.name} 
                                className="w-5 h-5 rounded-sm"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/icons/globe.svg';
                                }}
                              />
                              <span>{selectedEngine.name}</span>
                              <ChevronDown size={14} />
                            </button>
                            
                            <AnimatePresence>
                              {showEngineOptions && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 5 }}
                                  className="absolute left-0 top-full mt-1 w-48 glass rounded-lg p-1 z-10"
                                >
                                  {searchEngines.map((engine) => (
                                    <button
                                      key={engine.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedEngine(engine);
                                        setShowEngineOptions(false);
                                      }}
                                      className={cn(
                                        "w-full flex items-center space-x-2 p-2 rounded-md text-sm text-white",
                                        selectedEngine.id === engine.id ? "bg-white/20" : "hover:bg-white/10"
                                      )}
                                    >
                                      <img 
                                        src={engine.icon} 
                                        alt={engine.name} 
                                        className="w-5 h-5 rounded-sm"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/icons/globe.svg';
                                        }}
                                      />
                                      <span>{engine.name}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          {/* AI Search Toggle */}
                          <button
                            type="button"
                            onClick={toggleAISearch}
                            className={cn(
                              "flex items-center space-x-2 text-sm px-3 py-1.5 rounded-md transition-colors",
                              useAISearch 
                                ? "bg-blue-500/30 text-blue-300" 
                                : "text-gray-400 hover:text-white"
                            )}
                          >
                            <Brain size={14} />
                            <span>AI Search</span>
                            {useAISearch && <Sparkles size={14} className="ml-1" />}
                          </button>
                        </div>
                        
                        {searchHistory.length > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">Recent searches</span>
                              <button 
                                type="button"
                                onClick={clearSearchHistory}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="space-y-1.5">
                              {searchHistory.map((term, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  type="button"
                                  onClick={() => useSearchHistoryItem(term)}
                                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white search-history-item"
                                >
                                  <span className="truncate">{term}</span>
                                  <ArrowRight size={16} className="text-gray-400" />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-end">
                          <button 
                            type="submit"
                            className="glass-button flex items-center space-x-2 text-sm search-submit-button py-2 px-4"
                          >
                            <span>Search</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Search</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                ref={explorerButtonRef}
                className="dock-item" 
                onClick={handleExplorerClick}
              >
                <Grid size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Widget Explorer</p>
            </TooltipContent>
          </Tooltip>

          

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item relative" onClick={onToggleNotifications}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="dock-item" onClick={onToggleWallpaper}>
                <Image size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Change Wallpaper</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {showExplorer && (
        <WidgetExplorer
          id="widget-explorer"
          onClose={() => setShowExplorer(false)}
          onAddWidget={onAddWidget}
          initialPosition={explorerPosition}
        />
      )}
    </>
  );
};

export default Dock;
