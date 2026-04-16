import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTags();
      fetchNotes();
    } else {
      setNotes([]);
      setTags([]);
    }
  }, [user, search, selectedTag, showArchived]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let url = `/notes?archived=${showArchived}`;
      if (search) url += `&search=${search}`;
      if (selectedTag) url += `&tag_id=${selectedTag}`;
      
      const res = await api.get(url);
      setNotes(res.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await api.get('/tags');
      setTags(res.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const createNote = async (noteData) => {
    try {
      const res = await api.post('/notes', noteData);
      setNotes(prev => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const res = await api.put(`/notes/${id}`, noteData);
      setNotes(prev => prev.map(note => note.id === id ? res.data : note));
      return res.data;
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await api.patch(`/notes/${id}/pin`);
      // Re-sort notes by pin status dynamically
      fetchNotes(); 
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const toggleArchive = async (id) => {
    try {
      const res = await api.patch(`/notes/${id}/archive`);
      // Re-fetch to apply the archived filter correctly
      fetchNotes();
    } catch (error) {
      console.error("Failed to toggle archive:", error);
    }
  };

  const createTag = async (tagData) => {
    try {
      const res = await api.post('/tags', tagData);
      setTags(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("Failed to create tag:", error);
      throw error;
    }
  };

  const deleteTag = async (id) => {
    try {
      await api.delete(`/tags/${id}`);
      setTags(prev => prev.filter(tag => tag.id !== id));
      if (selectedTag === id) setSelectedTag(null);
    } catch (error) {
      console.error("Failed to delete tag:", error);
      throw error;
    }
  };

  return (
    <NotesContext.Provider value={{
      notes, tags, loading,
      search, setSearch,
      selectedTag, setSelectedTag,
      showArchived, setShowArchived,
      createNote, updateNote, deleteNote,
      togglePin, toggleArchive,
      createTag, deleteTag,
      refreshNotes: fetchNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};
