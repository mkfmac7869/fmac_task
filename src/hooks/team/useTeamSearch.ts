
import { useState } from 'react';

export const useTeamSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return {
    searchQuery,
    setSearchQuery
  };
};
