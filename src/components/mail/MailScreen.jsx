import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../ui/GlassCard';

// SVG Icons
const Icons = {
  back: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  star: (color, filled) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  archive: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="5" rx="2" />
      <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
      <path d="M10 13h4" />
    </svg>
  ),
  reply: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  urgent: (color) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" stroke="white" />
    </svg>
  ),
};

/**
 * MailScreen Component
 *
 * Email inbox with:
 * - Urgent indicators
 * - Unread styling
 * - Quick actions
 * - Star/archive
 */
const MailScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const [activeTab, setActiveTab] = useState('inbox');
  const [emails, setEmails] = useState([
    {
      id: '1',
      from: 'Peter Smith',
      email: 'peter.smith@company.com',
      subject: 'Urgent: Project deadline update',
      preview: 'Hi, I wanted to let you know that the deadline has been moved up by a week...',
      time: '10:30 AM',
      isRead: false,
      isStarred: true,
      isUrgent: true,
    },
    {
      id: '2',
      from: 'Sarah Johnson',
      email: 'sarah.j@team.com',
      subject: 'Meeting notes from yesterday',
      preview: 'Here are the key points we discussed in our meeting...',
      time: '9:15 AM',
      isRead: false,
      isStarred: false,
      isUrgent: false,
    },
    {
      id: '3',
      from: 'Marketing Team',
      email: 'marketing@company.com',
      subject: 'Q1 Campaign Results',
      preview: 'The Q1 campaign exceeded our expectations with a 25% increase in...',
      time: 'Yesterday',
      isRead: true,
      isStarred: false,
      isUrgent: false,
    },
    {
      id: '4',
      from: 'HR Department',
      email: 'hr@company.com',
      subject: 'Action Required: Benefits enrollment',
      preview: 'This is a reminder that the benefits enrollment deadline is...',
      time: 'Yesterday',
      isRead: true,
      isStarred: true,
      isUrgent: true,
    },
    {
      id: '5',
      from: 'Client - Acme Corp',
      email: 'contact@acme.com',
      subject: 'Follow-up on proposal',
      preview: 'Thank you for sending over the proposal. We have reviewed it and...',
      time: 'Jan 15',
      isRead: true,
      isStarred: false,
      isUrgent: false,
    },
  ]);

  const tabs = [
    { id: 'inbox', label: 'Inbox', count: emails.filter(e => !e.isRead).length },
    { id: 'starred', label: 'Starred', count: emails.filter(e => e.isStarred).length },
    { id: 'urgent', label: 'Urgent', count: emails.filter(e => e.isUrgent).length },
  ];

  const filteredEmails = emails.filter(email => {
    if (activeTab === 'starred') return email.isStarred;
    if (activeTab === 'urgent') return email.isUrgent;
    return true;
  });

  const toggleStar = (emailId, e) => {
    e.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const markAsRead = (emailId) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        padding: '50px 20px 0',
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
              backdropFilter: 'blur(10px)',
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
              Mail
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 4,
          background: theme.surface,
          borderRadius: 14,
          padding: 4,
          marginBottom: 16,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: activeTab === tab.id
                  ? (isFilledStyle ? theme.accent : 'white')
                  : 'transparent',
                border: activeTab === tab.id
                  ? `1px solid ${theme.accent}`
                  : 'none',
                borderRadius: 10,
                color: activeTab === tab.id
                  ? (isFilledStyle ? 'white' : theme.accent)
                  : theme.textMuted,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.id
                    ? (isFilledStyle ? 'rgba(255,255,255,0.3)' : `${theme.accent}20`)
                    : theme.border,
                  padding: '2px 6px',
                  borderRadius: 8,
                  fontSize: 11,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email list */}
      <div style={{ padding: '0 20px' }}>
        {filteredEmails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📧</p>
            <p style={{ color: theme.textMuted, fontSize: 16 }}>No emails</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => markAsRead(email.id)}
                style={{
                  padding: 16,
                  background: email.isRead ? 'transparent' : theme.surfaceGlass,
                  borderRadius: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderLeft: email.isUrgent ? `3px solid ${theme.error}` : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: getAvatarColor(email.from),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    flexShrink: 0,
                  }}>
                    {getInitials(email.from)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{
                          color: theme.text,
                          fontSize: 15,
                          fontWeight: email.isRead ? 500 : 700,
                          margin: 0,
                        }}>
                          {email.from}
                        </p>
                        {email.isUrgent && Icons.urgent(theme.error)}
                      </div>
                      <span style={{
                        color: theme.textMuted,
                        fontSize: 12,
                        flexShrink: 0,
                      }}>
                        {email.time}
                      </span>
                    </div>

                    <p style={{
                      color: theme.text,
                      fontSize: 14,
                      fontWeight: email.isRead ? 400 : 600,
                      margin: '0 0 4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {email.subject}
                    </p>

                    <p style={{
                      color: theme.textMuted,
                      fontSize: 13,
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {email.preview}
                    </p>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: 16,
                      marginTop: 10,
                    }}>
                      <button
                        onClick={(e) => toggleStar(email.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: email.isStarred ? '#FFB84D' : theme.textMuted,
                          fontSize: 12,
                        }}
                      >
                        {Icons.star('#FFB84D', email.isStarred)}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: theme.textMuted,
                          fontSize: 12,
                        }}
                      >
                        {Icons.archive(theme.textMuted)}
                        <span>Archive</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: theme.accent,
                          fontSize: 12,
                        }}
                      >
                        {Icons.reply(theme.accent)}
                        <span>Reply with Tessa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailScreen;
