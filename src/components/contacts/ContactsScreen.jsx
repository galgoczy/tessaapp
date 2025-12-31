import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  plus: (color) => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M12 4v16M4 12h16" />
    </svg>
  ),
  search: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  user: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mail: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  phone: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  gift: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
  calendar: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  heart: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  note: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8" />
    </svg>
  ),
  x: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  trash: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

// Relationship types
const RELATIONSHIPS = [
  { id: 'family', label: 'Family', color: '#EC4899' },
  { id: 'friend', label: 'Friend', color: '#8B5CF6' },
  { id: 'colleague', label: 'Colleague', color: '#3B82F6' },
  { id: 'client', label: 'Client', color: '#10B981' },
  { id: 'other', label: 'Other', color: '#6B7280' },
];

/**
 * ContactsScreen Component
 *
 * Manage contacts with:
 * - Contact list with search
 * - Contact details (email, phone, birthday, preferences)
 * - Related notes view
 * - Add/edit contacts
 */
const ContactsScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const { contacts, notes, addContact, updateContact } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [relationshipFilter, setRelationshipFilter] = useState('all');

  // New contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: 'friend',
    birthday: '',
    preferences: '',
    notes: '',
  });

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!contact.name.toLowerCase().includes(q) &&
          !contact.email?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (relationshipFilter !== 'all' && contact.relationship !== relationshipFilter) {
      return false;
    }
    return true;
  });

  // Sort alphabetically
  const sortedContacts = [...filteredContacts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Get related notes for a contact
  const getRelatedNotes = (contactName) => {
    return notes.filter(note =>
      note.relatedPerson?.toLowerCase() === contactName.toLowerCase()
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      relationship: 'friend',
      birthday: '',
      preferences: '',
      notes: '',
    });
    setShowAddForm(false);
  };

  const handleSaveContact = () => {
    if (!formData.name.trim()) return;

    addContact({
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      relationship: formData.relationship,
      birthday: formData.birthday || null,
      preferences: formData.preferences.trim() || null,
      notes: formData.notes.trim() || null,
    });

    resetForm();
  };

  const getRelationshipInfo = (id) =>
    RELATIONSHIPS.find(r => r.id === id) || RELATIONSHIPS[4];

  const formatBirthday = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  // Contact detail view
  if (selectedContact) {
    const relatedNotes = getRelatedNotes(selectedContact.name);
    const relInfo = getRelationshipInfo(selectedContact.relationship);

    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
        {/* Header */}
        <div style={{
          padding: '50px 20px 20px',
          background: `${theme.bg}ee`,
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSelectedContact(null)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: theme.surfaceGlass,
                border: `1px solid ${theme.borderGlass}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {Icons.back(theme.text)}
            </button>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0, flex: 1 }}>
              Contact
            </h1>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Contact card */}
          <GlassCard theme={theme} style={{ padding: 24, marginBottom: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `${relInfo.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <span style={{ fontSize: 32, color: relInfo.color }}>
                {selectedContact.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <h2 style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: 700,
              margin: '0 0 8px',
              textAlign: 'center',
            }}>
              {selectedContact.name}
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20,
            }}>
              <span style={{
                background: `${relInfo.color}20`,
                color: relInfo.color,
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
              }}>
                {relInfo.label}
              </span>
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {selectedContact.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {Icons.mail(theme.accent)}
                  <span style={{ color: theme.text, fontSize: 14 }}>{selectedContact.email}</span>
                </div>
              )}
              {selectedContact.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {Icons.phone(theme.accent)}
                  <span style={{ color: theme.text, fontSize: 14 }}>{selectedContact.phone}</span>
                </div>
              )}
              {selectedContact.birthday && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {Icons.gift(theme.accent)}
                  <span style={{ color: theme.text, fontSize: 14 }}>
                    Birthday: {formatBirthday(selectedContact.birthday)}
                  </span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Preferences */}
          {selectedContact.preferences && (
            <div style={{ marginBottom: 20 }}>
              <p style={{
                color: theme.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Preferences & Interests
              </p>
              <GlassCard theme={theme} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {Icons.heart(theme.accent)}
                  <p style={{ color: theme.text, fontSize: 14, margin: 0 }}>
                    {selectedContact.preferences}
                  </p>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Related notes */}
          <div style={{ marginBottom: 20 }}>
            <p style={{
              color: theme.textSecondary,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}>
              Related Notes ({relatedNotes.length})
            </p>

            {relatedNotes.length === 0 ? (
              <GlassCard theme={theme} style={{ padding: 24, textAlign: 'center' }}>
                <p style={{ color: theme.textMuted, fontSize: 14 }}>
                  No notes linked to this contact
                </p>
              </GlassCard>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {relatedNotes.map(note => (
                  <GlassCard key={note.id} theme={theme} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      {Icons.note(theme.accent)}
                      <p style={{
                        color: theme.text,
                        fontSize: 14,
                        margin: 0,
                        flex: 1,
                      }}>
                        {note.content.length > 100
                          ? note.content.substring(0, 100) + '...'
                          : note.content}
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 16px',
        background: `${theme.bg}ee`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.surfaceGlass,
              border: `1px solid ${theme.borderGlass}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.back(theme.text)}
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
              Contacts
            </h1>
            <p style={{ color: theme.textMuted, fontSize: 13, margin: '4px 0 0' }}>
              {contacts.length} people
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          background: theme.surfaceGlass,
          borderRadius: 14,
          padding: '12px 16px',
          border: `1px solid ${theme.borderGlass}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
        }}>
          {Icons.search(theme.textMuted)}
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: theme.text,
              fontSize: 15,
            }}
          />
        </div>

        {/* Relationship filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          <button
            onClick={() => setRelationshipFilter('all')}
            style={{
              padding: '8px 14px',
              background: relationshipFilter === 'all' ? theme.accent : theme.surfaceGlass,
              border: `1px solid ${relationshipFilter === 'all' ? theme.accent : theme.borderGlass}`,
              borderRadius: 20,
              color: relationshipFilter === 'all' ? 'white' : theme.textMuted,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            All
          </button>
          {RELATIONSHIPS.map(rel => (
            <button
              key={rel.id}
              onClick={() => setRelationshipFilter(rel.id)}
              style={{
                padding: '8px 14px',
                background: relationshipFilter === rel.id ? `${rel.color}20` : theme.surfaceGlass,
                border: `1px solid ${relationshipFilter === rel.id ? rel.color : theme.borderGlass}`,
                borderRadius: 20,
                color: relationshipFilter === rel.id ? rel.color : theme.textMuted,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {rel.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add contact form */}
      {showAddForm && (
        <div style={{ padding: '0 20px 16px' }}>
          <GlassCard theme={theme} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
                New Contact
              </h3>
              <button
                onClick={resetForm}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                {Icons.x(theme.textMuted)}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                placeholder="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                }}
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                }}
              />

              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                }}
              />

              {/* Relationship selector */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {RELATIONSHIPS.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => setFormData({ ...formData, relationship: rel.id })}
                    style={{
                      padding: '8px 12px',
                      background: formData.relationship === rel.id ? `${rel.color}20` : 'transparent',
                      border: `1px solid ${formData.relationship === rel.id ? rel.color : theme.border}`,
                      borderRadius: 8,
                      color: rel.color,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {rel.label}
                  </button>
                ))}
              </div>

              <input
                type="date"
                placeholder="Birthday"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                style={{
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                }}
              />

              <textarea
                placeholder="Preferences, interests, gift ideas..."
                value={formData.preferences}
                onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                rows={2}
                style={{
                  padding: '12px 14px',
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 10,
                  color: theme.text,
                  fontSize: 15,
                  outline: 'none',
                  resize: 'none',
                }}
              />

              <button
                onClick={handleSaveContact}
                disabled={!formData.name.trim()}
                style={{
                  padding: '14px 20px',
                  background: formData.name.trim() ? theme.gradient : theme.surface,
                  border: 'none',
                  borderRadius: 12,
                  color: formData.name.trim() ? 'white' : theme.textMuted,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: formData.name.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save Contact
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Contacts list */}
      <div style={{ padding: '0 20px' }}>
        {sortedContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: theme.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {Icons.user(theme.textMuted)}
            </div>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </p>
            <p style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8 }}>
              Tap + to add your first contact
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedContacts.map(contact => {
              const relInfo = getRelationshipInfo(contact.relationship);
              const notesCount = getRelatedNotes(contact.name).length;

              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <GlassCard theme={theme} style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Avatar */}
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `${relInfo.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 20, color: relInfo.color, fontWeight: 600 }}>
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: theme.text,
                          fontSize: 16,
                          fontWeight: 600,
                          margin: 0,
                        }}>
                          {contact.name}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginTop: 4,
                        }}>
                          <span style={{
                            fontSize: 11,
                            color: relInfo.color,
                            background: `${relInfo.color}15`,
                            padding: '2px 8px',
                            borderRadius: 6,
                          }}>
                            {relInfo.label}
                          </span>
                          {notesCount > 0 && (
                            <span style={{
                              fontSize: 11,
                              color: theme.textMuted,
                            }}>
                              {notesCount} note{notesCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div style={{ color: theme.textMuted }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9,18 15,12 9,6" />
                        </svg>
                      </div>
                    </div>
                  </GlassCard>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setShowAddForm(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: theme.gradient,
          border: 'none',
          boxShadow: `0 4px 20px ${theme.glowColor}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
      >
        {Icons.plus('white')}
      </button>
    </div>
  );
};

export default ContactsScreen;
