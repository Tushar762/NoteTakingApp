import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { 
  BookOpen, Hash, Archive, Search, PlusCircle, 
  Settings, LogOut, ChevronRight, X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { 
    tags, search, setSearch, 
    selectedTag, setSelectedTag,
    showArchived, setShowArchived,
    createTag, deleteTag
  } = useNotes();
  
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6c63ff');
  const [showTagForm, setShowTagForm] = useState(false);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    try {
      await createTag({ name: newTagName, color: newTagColor });
      setNewTagName('');
      setShowTagForm(false);
    } catch (error) {
      alert("Failed to create tag. Name must be unique.");
    }
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <BookOpen className="logo-icon" size={28} />
        <h2>NoteFlow</h2>
      </div>

      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <nav className="nav-menu">
        <div className="nav-section">
          <ul>
            <li>
              <button 
                className={`nav-btn ${!selectedTag && !showArchived ? 'active' : ''}`}
                onClick={() => { setSelectedTag(null); setShowArchived(false); }}
              >
                <BookOpen size={18} /> All Notes
              </button>
            </li>
            <li>
              <button 
                className={`nav-btn ${showArchived ? 'active' : ''}`}
                onClick={() => { setShowArchived(true); setSelectedTag(null); }}
              >
                <Archive size={18} /> Archived
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-section tags-section">
          <div className="section-header">
            <h3>TAGS</h3>
            <button className="icon-btn-small" onClick={() => setShowTagForm(!showTagForm)}>
              <PlusCircle size={16} />
            </button>
          </div>

          {showTagForm && (
            <form onSubmit={handleCreateTag} className="tag-form">
              <input 
                type="color" 
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="color-picker-small"
              />
              <input 
                type="text" 
                placeholder="New tag..." 
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                autoFocus
              />
              <button type="submit" className="icon-btn-small primary"><ChevronRight size={16}/></button>
            </form>
          )}

          <ul className="tags-list">
            {tags.map(tag => (
              <li key={tag.id} className="tag-item">
                <button 
                  className={`nav-btn tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                  onClick={() => { setSelectedTag(tag.id); setShowArchived(false); }}
                >
                  <Hash size={16} color={tag.color} />
                  <span className="truncate">{tag.name}</span>
                </button>
                <button className="delete-tag-btn" onClick={() => deleteTag(tag.id)}>
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <span className="username truncate">{user?.username}</span>
        </div>
        <button className="icon-btn logout-btn tooltip-container" onClick={logout}>
          <LogOut size={20} />
          <span className="tooltip tooltip-right">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
