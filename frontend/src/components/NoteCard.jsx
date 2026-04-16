import { format } from 'date-fns';
import { Pin, PinOff, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const NoteCard = ({ note, onClick }) => {
  const { togglePin, toggleArchive, deleteNote } = useNotes();

  const handleTogglePin = (e) => {
    e.stopPropagation();
    togglePin(note.id);
  };

  const handleToggleArchive = (e) => {
    e.stopPropagation();
    toggleArchive(note.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    // simple confirmation before delete
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
    }
  };

  return (
    <div 
      className="note-card glass-panel" 
      style={{ borderTop: `4px solid ${note.color}` }}
      onClick={() => onClick(note)}
    >
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          {!note.is_archived && (
            <button className="icon-btn tooltip-container" onClick={handleTogglePin}>
              {note.is_pinned ? <PinOff size={16} /> : <Pin size={16} />}
              <span className="tooltip">{note.is_pinned ? "Unpin" : "Pin Note"}</span>
            </button>
          )}
          
          <button className="icon-btn tooltip-container" onClick={handleToggleArchive}>
            {note.is_archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            <span className="tooltip">{note.is_archived ? "Unarchive" : "Archive Note"}</span>
          </button>
          
          <button className="icon-btn danger tooltip-container" onClick={handleDelete}>
            <Trash2 size={16} />
            <span className="tooltip">Delete Note</span>
          </button>
        </div>
      </div>
      
      <div className="note-content">
        {note.content ? note.content : <span className="empty-content">Empty note...</span>}
      </div>
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag.id} className="tag" style={{ backgroundColor: tag.color + '40', color: tag.color, border: `1px solid ${tag.color}80` }}>
              {tag.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="note-footer">
        {format(new Date(note.updated_at), 'MMM d, yyyy')}
      </div>
    </div>
  );
};

export default NoteCard;
