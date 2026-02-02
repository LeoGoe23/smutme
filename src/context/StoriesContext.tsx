import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Story, initialStories } from '../lib/mockData';

interface StoriesContextType {
  stories: Story[];
  selectedStory: Story | null;
  addStory: (story: Story) => void;
  removeStory: (id: string) => void;
  selectStory: (story: Story | null) => void;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};

interface StoriesProviderProps {
  children: ReactNode;
}

export const StoriesProvider: React.FC<StoriesProviderProps> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const addStory = useCallback((story: Story) => {
    setStories((prev) => [story, ...prev]);
  }, []);

  const removeStory = useCallback((id: string) => {
    setStories((prev) => prev.filter((story) => story.id !== id));
    if (selectedStory?.id === id) {
      setSelectedStory(null);
    }
  }, [selectedStory]);

  const selectStory = useCallback((story: Story | null) => {
    setSelectedStory(story);
  }, []);

  return (
    <StoriesContext.Provider value={{ stories, selectedStory, addStory, removeStory, selectStory }}>
      {children}
    </StoriesContext.Provider>
  );
};
