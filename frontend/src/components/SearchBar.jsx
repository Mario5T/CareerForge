import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

const SearchBar = React.memo(({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "",
  icon = true 
}) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        className={icon ? "pl-10 w-full" : "w-full"}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
