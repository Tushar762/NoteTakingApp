import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const COLORS = [
  '#1e1e2e', '#ff5555', '#50fa7b', '#f1fa8c', 
  '#bd93f9', '#ff79c6', '#8be9fd', '#ffb86c'
];

const NoteModal = ({ isOpen, onClose, note = null }) => {
  const { createNote, updateNote, tags } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title);
        setContent(note.content || '');
        setColor(note.color);
        setSelectedTagIds(note.tags.map(t => t.id));
      } else {
        setTitle('');
        setContent('');
        setColor(COLORS[0]);
        setSelectedTagIds([]);
      }
    }
  }, [isOpen, note]);

  const toggleTag = (id) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(prev => prev.filter(tId => tId !== id));
    } else {
      setSelectedTagIds(prev => [...prev, id]);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim() || 'Untitled',
        content,
        color,
        tag_ids: selectedTagIds
      };

      if (note) {
        await updateNote(note.id, payload);
      } else {
        await createNote(payload);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ borderTop: `6px solid ${color}` }}
      >
        <div className="modal-header">
          <input 
            className="modal-title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            disabled={isSubmitting}
            autoFocus
          />
          <button className="icon-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <textarea
            className="modal-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Take a note..."
            disabled={isSubmitting}
            rows={10}
          />
        </div>

        <div className="modal-footer">
          <div className="color-picker">
            {COLORS.map(c => (
              <button
                key={c}
                className={`color-btn ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                type="button"
              />
            ))}
          </div>

          {tags.length > 0 && (
            <div className="tag-selector">
              <span className="tag-selector-label">Tags:</span>
              <div className="tag-chips">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-chip ${selectedTagIds.includes(tag.id) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                    style={selectedTagIds.includes(tag.id) ? {
                      backgroundColor: tag.color + '40',
                      border: `1px solid ${tag.color}`
                    } : {}}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
