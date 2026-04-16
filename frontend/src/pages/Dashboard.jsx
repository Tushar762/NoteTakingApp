import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { Plus, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

const Dashboard = () => {
  const { notes, loading, selectedTag, tags, showArchived, search } = useNotes();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);

  const handleEditNote = (note) => {
    setActiveNote(note);
    setModalOpen(true);
  };

  const handleCreateNote = () => {
    setActiveNote(null);
    setModalOpen(true);
  };

  // Group notes if viewing "All Notes" (unarchived)
  const pinnedNotes = notes.filter(n => n.is_pinned && !n.is_archived);
  const regularNotes = notes.filter(n => !n.is_pinned && !n.is_archived);

  // Determine current view title
  const getViewTitle = () => {
    if (search) return `Search Results: "${search}"`;
    if (showArchived) return 'Archived Notes';
    if (selectedTag) {
      const tag = tags.find(t => t.id === selectedTag);
      return tag ? `Tag: ${tag.name}` : 'Tag Notes';
    }
    return 'All Notes';
  };

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="main-content">
        <header className="main-header">
          <h1>{getViewTitle()}</h1>
        </header>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={48} />
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state glass-panel">
            <h3>No notes found</h3>
            <p>Create a new note to get started.</p>
          </div>
        ) : (
          <div className="notes-container">
            {showArchived || search || selectedTag ? (
              <div className="notes-grid">
                {notes.map(note => (
                  <NoteCard key={note.id} note={note} onClick={handleEditNote} />
                ))}
              </div>
            ) : (
              // All Notes View (Separated into Pinned and Regular)
              <>
                {pinnedNotes.length > 0 && (
                  <div className="pin-section">
                    <h3 className="section-title">PINNED</h3>
                    <div className="notes-grid">
                      {pinnedNotes.map(note => (
                        <NoteCard key={note.id} note={note} onClick={handleEditNote} />
                      ))}
                    </div>
                  </div>
                )}
                
                {regularNotes.length > 0 && (
                  <div className="regular-section">
                    {pinnedNotes.length > 0 && <h3 className="section-title">OTHERS</h3>}
                    <div className="notes-grid">
                      {regularNotes.map(note => (
                        <NoteCard key={note.id} note={note} onClick={handleEditNote} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <button className="fab tooltip-container" onClick={handleCreateNote}>
          <Plus size={28} />
          <span className="tooltip tooltip-left">New Note</span>
        </button>
      </main>

      <NoteModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        note={activeNote} 
      />
    </div>
  );
};

export default Dashboard;
