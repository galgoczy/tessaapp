import React, { useState, useMemo } from 'react';
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
  compose: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  send: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  trash: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  sparkle: (color) => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757L6.636 6.636" />
    </svg>
  ),
};

// Demo emails with full content
const DEMO_EMAILS = [
  {
    id: '1',
    from: 'Peter Smith',
    email: 'peter.smith@company.com',
    subject: 'Urgent: Project deadline update',
    preview: 'Hi, I wanted to let you know that the deadline has been moved up by a week...',
    body: `Hi there,

I wanted to let you know that the deadline for Project Phoenix has been moved up by a week. The client requested we deliver the initial prototype by January 20th instead of the 27th.

This means we need to prioritize the core features and postpone some of the nice-to-haves. Can we schedule a quick call tomorrow to discuss the revised timeline?

Let me know your availability.

Best,
Peter Smith
Project Manager`,
    time: '10:30 AM',
    date: new Date().toISOString(),
    isRead: false,
    isStarred: true,
    isUrgent: true,
    isArchived: false,
  },
  {
    id: '2',
    from: 'Sarah Johnson',
    email: 'sarah.j@team.com',
    subject: 'Meeting notes from yesterday',
    preview: 'Here are the key points we discussed in our meeting...',
    body: `Hi team,

Here are the key points we discussed in our meeting yesterday:

1. Q1 roadmap finalized - focus on mobile app improvements
2. New hire starting next Monday - please help with onboarding
3. Budget approved for cloud infrastructure upgrade
4. Next sprint planning on Friday at 2 PM

Action items:
- Update Jira tickets with new priorities
- Prepare demo for stakeholders next week
- Review pull requests before Friday

Let me know if I missed anything!

Sarah`,
    time: '9:15 AM',
    date: new Date().toISOString(),
    isRead: false,
    isStarred: false,
    isUrgent: false,
    isArchived: false,
  },
  {
    id: '3',
    from: 'Marketing Team',
    email: 'marketing@company.com',
    subject: 'Q1 Campaign Results',
    preview: 'The Q1 campaign exceeded our expectations with a 25% increase in...',
    body: `Hello everyone,

Exciting news! The Q1 campaign exceeded our expectations with a 25% increase in engagement and a 15% boost in conversions.

Key highlights:
• Social media reach: 2.5M impressions
• Email open rate: 32% (up from 28%)
• Website traffic: +40% month-over-month
• New leads generated: 1,200+

Thank you all for your contributions to making this campaign a success. We'll be sharing a detailed report in the all-hands meeting next week.

Best regards,
The Marketing Team`,
    time: 'Yesterday',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isStarred: false,
    isUrgent: false,
    isArchived: false,
  },
  {
    id: '4',
    from: 'HR Department',
    email: 'hr@company.com',
    subject: 'Action Required: Benefits enrollment',
    preview: 'This is a reminder that the benefits enrollment deadline is...',
    body: `Dear Employee,

This is a reminder that the benefits enrollment deadline is approaching.

IMPORTANT: You must complete your enrollment by January 31st.

What you need to do:
1. Log in to the HR portal
2. Review your current benefits selections
3. Make any changes for the new year
4. Submit your enrollment

If you have questions about your options, please schedule a call with our benefits advisor.

Thank you,
Human Resources Department`,
    time: 'Yesterday',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isStarred: true,
    isUrgent: true,
    isArchived: false,
  },
  {
    id: '5',
    from: 'Client - Acme Corp',
    email: 'contact@acme.com',
    subject: 'Follow-up on proposal',
    preview: 'Thank you for sending over the proposal. We have reviewed it and...',
    body: `Hi,

Thank you for sending over the proposal. We have reviewed it internally and have a few questions:

1. Can you provide more details on the implementation timeline?
2. What's included in the maintenance package?
3. Are there any additional costs we should be aware of?

We're very interested in moving forward and would like to schedule a call to discuss these points.

Please let us know your availability for next week.

Best regards,
John from Acme Corp`,
    time: 'Jan 15',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    isRead: true,
    isStarred: false,
    isUrgent: false,
    isArchived: false,
  },
];

// Tessa AI reply suggestions
const generateTessaReplies = (email) => {
  const replies = {
    urgent: [
      {
        id: 'acknowledge',
        label: 'Acknowledge',
        preview: 'Thanks for the heads up. I\'ll adjust my schedule...',
        full: `Hi ${email.from.split(' ')[0]},

Thanks for the heads up. I understand the deadline has been moved up and I'll adjust my schedule accordingly.

I'm available tomorrow anytime between 10 AM and 4 PM for a quick call to discuss the revised timeline.

Looking forward to it.

Best regards`,
      },
      {
        id: 'concern',
        label: 'Raise concern',
        preview: 'Thanks for letting me know. I have some concerns...',
        full: `Hi ${email.from.split(' ')[0]},

Thanks for letting me know about the deadline change. I appreciate the heads up.

I do have some concerns about delivering quality work in this compressed timeline. Could we discuss which features are absolutely critical for the initial delivery?

I'm available for a call tomorrow. Let me know what time works for you.

Best regards`,
      },
    ],
    meeting: [
      {
        id: 'confirm',
        label: 'Confirm',
        preview: 'Thanks for sharing the notes. I\'ll review the action items...',
        full: `Hi Sarah,

Thanks for sharing the meeting notes! I've reviewed the action items and will:
- Update the Jira tickets today
- Prepare the demo materials by Thursday
- Review the PRs before Friday

Let me know if there's anything else you need from me.

Best`,
      },
      {
        id: 'question',
        label: 'Ask question',
        preview: 'Thanks for the summary. Quick question about...',
        full: `Hi Sarah,

Thanks for the detailed summary! Quick question - for the demo next week, should we focus on the new features only or include a complete product walkthrough?

Also, do we have the presentation template from last quarter?

Thanks!`,
      },
    ],
    general: [
      {
        id: 'professional',
        label: 'Professional',
        preview: 'Thank you for your email. I\'ll review this and get back to you...',
        full: `Hi ${email.from.split(' ')[0]},

Thank you for your email. I've noted the information you've shared and will review it thoroughly.

I'll get back to you with a detailed response within 24 hours.

Best regards`,
      },
      {
        id: 'casual',
        label: 'Casual',
        preview: 'Thanks! Got it, I\'ll take a look and follow up...',
        full: `Hey ${email.from.split(' ')[0]},

Thanks for this! I'll take a look and follow up with you soon.

Talk soon!`,
      },
    ],
  };

  if (email.isUrgent) return replies.urgent;
  if (email.subject.toLowerCase().includes('meeting')) return replies.meeting;
  return replies.general;
};

/**
 * MailScreen Component
 *
 * Email inbox with:
 * - Urgent indicators
 * - Unread styling
 * - Quick actions
 * - Star/archive
 * - Email detail view
 * - Compose with Tessa AI
 */
const MailScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const { settings } = useData();
  const [activeTab, setActiveTab] = useState('inbox');
  const [emails, setEmails] = useState(DEMO_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [showTessaReply, setShowTessaReply] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [replyingTo, setReplyingTo] = useState(null);

  const tabs = useMemo(() => [
    { id: 'inbox', label: 'Inbox', count: emails.filter(e => !e.isRead && !e.isArchived).length },
    { id: 'starred', label: 'Starred', count: emails.filter(e => e.isStarred && !e.isArchived).length },
    { id: 'archived', label: 'Archived', count: emails.filter(e => e.isArchived).length },
  ], [emails]);

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      if (activeTab === 'starred') return email.isStarred && !email.isArchived;
      if (activeTab === 'archived') return email.isArchived;
      return !email.isArchived;
    });
  }, [emails, activeTab]);

  const toggleStar = (emailId, e) => {
    e?.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const archiveEmail = (emailId, e) => {
    e?.stopPropagation();
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isArchived: true } : email
    ));
    if (selectedEmail?.id === emailId) setSelectedEmail(null);
  };

  const deleteEmail = (emailId) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
    if (selectedEmail?.id === emailId) setSelectedEmail(null);
  };

  const markAsRead = (emailId) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const openEmail = (email) => {
    markAsRead(email.id);
    setSelectedEmail(email);
  };

  const handleReplyWithTessa = (email) => {
    setReplyingTo(email);
    setShowTessaReply(true);
  };

  const selectTessaReply = (reply) => {
    setComposeData({
      to: replyingTo.email,
      subject: `Re: ${replyingTo.subject}`,
      body: reply.full,
    });
    setShowTessaReply(false);
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const sendEmail = () => {
    // Simulate sending
    const newEmail = {
      id: Date.now().toString(),
      from: settings?.userName || 'Me',
      email: 'me@example.com',
      subject: composeData.subject,
      preview: composeData.body.slice(0, 80) + '...',
      body: composeData.body,
      time: 'Just now',
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isUrgent: false,
      isArchived: false,
      isSent: true,
    };
    setEmails(prev => [newEmail, ...prev]);
    setComposeData({ to: '', subject: '', body: '' });
    setShowCompose(false);
    setReplyingTo(null);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Email Detail View
  if (selectedEmail) {
    const tessaReplies = generateTessaReplies(selectedEmail);

    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          padding: '50px 20px 16px',
          background: `${theme.bg}ee`,
          backdropFilter: 'blur(16px)',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setSelectedEmail(null)}
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
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => archiveEmail(selectedEmail.id)}
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
                {Icons.archive(theme.textMuted)}
              </button>
              <button
                onClick={() => deleteEmail(selectedEmail.id)}
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
                {Icons.trash(theme.error)}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Email header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: getAvatarColor(selectedEmail.from),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: 16,
                flexShrink: 0,
              }}>
                {getInitials(selectedEmail.from)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>
                    {selectedEmail.from}
                  </p>
                  {selectedEmail.isUrgent && Icons.urgent(theme.error)}
                </div>
                <p style={{ color: theme.textMuted, fontSize: 13, margin: '2px 0' }}>
                  {selectedEmail.email}
                </p>
                <p style={{ color: theme.textMuted, fontSize: 12, margin: 0 }}>
                  {selectedEmail.time}
                </p>
              </div>
              <button
                onClick={() => toggleStar(selectedEmail.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {Icons.star('#FFB84D', selectedEmail.isStarred)}
              </button>
            </div>

            <h2 style={{ color: theme.text, fontSize: 20, fontWeight: 600, margin: '16px 0' }}>
              {selectedEmail.subject}
            </h2>
          </div>

          {/* Email body */}
          <GlassCard theme={theme} style={{ marginBottom: 20 }}>
            <p style={{
              color: theme.text,
              fontSize: 14,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              margin: 0,
            }}>
              {selectedEmail.body}
            </p>
          </GlassCard>

          {/* Reply with Tessa */}
          <GlassCard theme={theme} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: theme.gradient,
                boxShadow: `0 2px 8px ${theme.glowColor}`,
              }} />
              <div>
                <p style={{ color: theme.text, fontSize: 14, fontWeight: 600, margin: 0 }}>
                  Reply with Tessa
                </p>
                <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
                  Choose a suggested response
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tessaReplies.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => selectTessaReply(reply)}
                  style={{
                    padding: 14,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {Icons.sparkle(theme.accent)}
                    <span style={{ color: theme.accent, fontSize: 13, fontWeight: 600 }}>
                      {reply.label}
                    </span>
                  </div>
                  <p style={{ color: theme.textSecondary, fontSize: 13, margin: 0 }}>
                    "{reply.preview}"
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Manual reply button */}
          <button
            onClick={() => {
              setComposeData({
                to: selectedEmail.email,
                subject: `Re: ${selectedEmail.subject}`,
                body: '',
              });
              setShowCompose(true);
              setSelectedEmail(null);
            }}
            style={{
              width: '100%',
              padding: 14,
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              color: theme.textMuted,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {Icons.reply(theme.textMuted)}
            Write your own reply
          </button>
        </div>
      </div>
    );
  }

  // Compose Modal
  if (showCompose) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          padding: '50px 20px 16px',
          background: `${theme.bg}ee`,
          backdropFilter: 'blur(16px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => {
              setShowCompose(false);
              setComposeData({ to: '', subject: '', body: '' });
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <h1 style={{ color: theme.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
            {replyingTo ? 'Reply' : 'New Email'}
          </h1>
          <button
            onClick={sendEmail}
            disabled={!composeData.to || !composeData.subject}
            style={{
              background: composeData.to && composeData.subject ? theme.accent : theme.border,
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: composeData.to && composeData.subject ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {Icons.send('white')}
            Send
          </button>
        </div>

        <div style={{ padding: '0 20px' }}>
          <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
            {/* To */}
            <div style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ color: theme.textMuted, fontSize: 14, width: 60 }}>To:</span>
              <input
                type="email"
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                placeholder="recipient@email.com"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: theme.text,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            {/* Subject */}
            <div style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ color: theme.textMuted, fontSize: 14, width: 60 }}>Subject:</span>
              <input
                type="text"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: theme.text,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>

            {/* Body */}
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your message..."
              style={{
                width: '100%',
                minHeight: 300,
                padding: 16,
                background: 'none',
                border: 'none',
                color: theme.text,
                fontSize: 14,
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none',
              }}
            />
          </GlassCard>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => setShowCompose(true)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: theme.accent,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Icons.compose('white')}
          </button>
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
            <p style={{ color: theme.textMuted, fontSize: 16 }}>
              {activeTab === 'archived' ? 'No archived emails' : 'No emails'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => openEmail(email)}
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
                        onClick={(e) => archiveEmail(email.id, e)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplyWithTessa(email);
                        }}
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
                        {Icons.sparkle(theme.accent)}
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

      {/* Tessa Reply Modal */}
      {showTessaReply && replyingTo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }} onClick={() => setShowTessaReply(false)}>
          <GlassCard
            theme={theme}
            style={{ width: '100%', maxWidth: 360, padding: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: theme.gradient,
                boxShadow: `0 2px 8px ${theme.glowColor}`,
              }} />
              <div>
                <p style={{ color: theme.text, fontSize: 16, fontWeight: 600, margin: 0 }}>
                  Reply with Tessa
                </p>
                <p style={{ color: theme.textSecondary, fontSize: 12, margin: 0 }}>
                  To: {replyingTo.from}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {generateTessaReplies(replyingTo).map(reply => (
                <button
                  key={reply.id}
                  onClick={() => selectTessaReply(reply)}
                  style={{
                    padding: 14,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {Icons.sparkle(theme.accent)}
                    <span style={{ color: theme.accent, fontSize: 13, fontWeight: 600 }}>
                      {reply.label}
                    </span>
                  </div>
                  <p style={{ color: theme.textSecondary, fontSize: 13, margin: 0 }}>
                    "{reply.preview}"
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTessaReply(false)}
              style={{
                width: '100%',
                marginTop: 12,
                padding: 12,
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: 10,
                color: theme.textMuted,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default MailScreen;
