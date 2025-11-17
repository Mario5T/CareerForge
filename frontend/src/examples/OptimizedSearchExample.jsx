import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Search } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

// ✅ BEST PRACTICE: Memoized search results item
const SearchResultItem = React.memo(({ item, onSelect }) => {
  return (
    <Card className="mb-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(item)}>
      <CardContent className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.company}</p>
        <p className="text-xs text-gray-500">{item.location}</p>
      </CardContent>
    </Card>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const OptimizedSearchExample = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ BEST PRACTICE: Separate immediate input and final query states
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(inputValue, 300);
  
  // ✅ BEST PRACTICE: Use useCallback for event handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  }, [inputValue, setSearchParams]);

  const handleItemSelect = useCallback((item) => {
    console.log('Selected item:', item);
    // Handle item selection
  }, []);

  // ✅ BEST PRACTICE: Use useMemo for expensive filtering operations
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return allItems;
    
    console.log('Filtering items for query:', debouncedQuery);
    return allItems.filter(item => 
      item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [allItems, debouncedQuery]);

  // ✅ BEST PRACTICE: Memoize pagination calculations
  const paginationData = useMemo(() => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    return { itemsPerPage, totalPages };
  }, [filteredItems]);

  // Simulate data fetching
  useEffect(() => {
    const mockData = [
      { id: 1, title: 'Senior React Developer', company: 'TechCorp', location: 'San Francisco' },
      { id: 2, title: 'Frontend Engineer', company: 'StartupXYZ', location: 'New York' },
      { id: 3, title: 'Full Stack Developer', company: 'MegaCorp', location: 'Remote' },
      { id: 4, title: 'React Native Developer', company: 'MobileFirst', location: 'Austin' },
      { id: 5, title: 'JavaScript Developer', company: 'WebSolutions', location: 'Seattle' },
      { id: 6, title: 'Vue.js Developer', company: 'FrontendHub', location: 'Boston' },
      { id: 7, title: 'Angular Developer', company: 'EnterpriseTech', location: 'Chicago' },
      { id: 8, title: 'Node.js Developer', company: 'BackendPro', location: 'Denver' },
      { id: 9, title: 'Python Developer', company: 'DataScience', location: 'Portland' },
      { id: 10, title: 'DevOps Engineer', company: 'CloudTech', location: 'Miami' },
    ];
    
    setTimeout(() => {
      setAllItems(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Optimized Search Example</h1>
        <p className="text-gray-600">
          This example demonstrates best practices for preventing unnecessary re-renders during search.
        </p>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Optimizations Applied:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>useCallback</strong> for event handlers</li>
            <li>• <strong>useDebounce</strong> for search input (300ms delay)</li>
            <li>• <strong>useMemo</strong> for expensive filtering operations</li>
            <li>• <strong>React.memo</strong> for search result items</li>
            <li>• <strong>Separate states</strong> for immediate input vs final query</li>
            <li>• <strong>Stable component</strong> with memoized SearchBar</li>
          </ul>
        </div>
      </div>

      {/* ✅ BEST PRACTICE: Using memoized SearchBar component */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit}>
            <SearchBar
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search jobs, companies, or locations..."
              className="w-full"
            />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {inputValue !== debouncedQuery ? (
                  <span className="text-orange-600">Typing... (debounced)</span>
                ) : (
                  <span>Ready to search</span>
                )}
              </p>
              <Button type="submit" disabled={!inputValue.trim()}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Search Results ({filteredItems.length} items)
        </h2>
        {debouncedQuery && (
          <p className="text-sm text-gray-600 mb-4">
            Searching for: <strong>"{debouncedQuery}"</strong>
          </p>
        )}
      </div>

      {filteredItems.length > 0 ? (
        <div>
          {filteredItems.slice(0, paginationData.itemsPerPage).map((item) => (
            <SearchResultItem
              key={item.id}
              item={item}
              onSelect={handleItemSelect}
            />
          ))}
          {paginationData.totalPages > 1 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing {Math.min(paginationData.itemsPerPage, filteredItems.length)} of {filteredItems.length} results
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {debouncedQuery ? 'No results found for your search.' : 'Enter a search term to see results.'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Performance Tips:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Type quickly in the search bar - notice it waits 300ms before filtering</li>
          <li>• Check the console - filtering only runs when debounced query changes</li>
          <li>• Each result item is memoized and won't re-render unless its data changes</li>
          <li>• Event handlers are stable across renders</li>
        </ul>
      </div>
    </div>
  );
};

export default OptimizedSearchExample;
