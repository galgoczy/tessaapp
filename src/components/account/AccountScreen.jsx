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
  camera: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  star: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  shield: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  download: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  trash: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  chevron: (color) => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  help: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  mail: (color) => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

/**
 * AccountScreen Component
 *
 * Account management with:
 * - Avatar upload
 * - Profile info
 * - PRO subscription status
 * - Privacy settings
 * - Data export
 * - Delete account
 */
const AccountScreen = ({ onBack }) => {
  const { theme, isFilledStyle } = useTheme();
  const [isPro] = useState(false);

  const user = {
    name: 'Geri',
    email: 'geri@example.com',
    avatar: null,
    memberSince: 'January 2024',
  };

  const menuItems = [
    {
      id: 'subscription',
      icon: Icons.star,
      label: isPro ? 'Tessa PRO' : 'Upgrade to PRO',
      description: isPro ? 'Manage your subscription' : 'Unlock all features',
      highlight: !isPro,
    },
    {
      id: 'privacy',
      icon: Icons.shield,
      label: 'Privacy & Security',
      description: 'Manage your data and permissions',
    },
    {
      id: 'export',
      icon: Icons.download,
      label: 'Export Data',
      description: 'Download all your information',
    },
    {
      id: 'help',
      icon: Icons.help,
      label: 'Help & Support',
      description: 'FAQs and contact support',
    },
    {
      id: 'contact',
      icon: Icons.mail,
      label: 'Contact Us',
      description: 'Send feedback or report issues',
    },
  ];

  const proFeatures = [
    'Unlimited voice interactions',
    '"Hey Tessa" wake word',
    'Continuous conversation',
    'Web search & research',
    'Home screen widgets',
    'Priority support',
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 40 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: 0 }}>
            Account
          </h1>
        </div>
      </div>

      {/* Profile section */}
      <div style={{ padding: '0 20px 24px' }}>
        <GlassCard theme={theme} style={{ padding: 24, textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B7355 0%, #E8D5B7 50%, #4A90A4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: 'white',
              border: `4px solid ${theme.bg}`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
            }}>
              {user.name[0]}
            </div>
            <button style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: theme.accent,
              border: `2px solid ${theme.bg}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {Icons.camera('white')}
            </button>
          </div>

          <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
            {user.name}
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>
            {user.email}
          </p>

          {isPro && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: theme.gradient,
              padding: '6px 14px',
              borderRadius: 20,
              marginTop: 12,
            }}>
              {Icons.star('white')}
              <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>PRO Member</span>
            </div>
          )}

          <p style={{ color: theme.textSecondary, fontSize: 12, marginTop: 16 }}>
            Member since {user.memberSince}
          </p>
        </GlassCard>
      </div>

      {/* PRO upgrade banner */}
      {!isPro && (
        <div style={{ padding: '0 20px 24px' }}>
          <div style={{
            background: theme.gradient,
            borderRadius: 20,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Shine overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {Icons.star('white')}
                <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, margin: 0 }}>
                  Upgrade to Tessa PRO
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginBottom: 16,
              }}>
                {proFeatures.map(feature => (
                  <div key={feature} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <span style={{ color: 'white' }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button style={{
                width: '100%',
                padding: '14px 20px',
                background: 'white',
                border: 'none',
                borderRadius: 12,
                color: theme.accent,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}>
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu items */}
      <div style={{ padding: '0 20px 24px' }}>
        <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: 'none',
                border: 'none',
                borderBottom: i < menuItems.length - 1 ? `1px solid ${theme.border}` : 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: item.highlight ? theme.gradient : theme.surface,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon(item.highlight ? 'white' : theme.accent)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  color: item.highlight ? theme.accent : theme.text,
                  fontSize: 15,
                  fontWeight: 500,
                  margin: 0,
                }}>
                  {item.label}
                </p>
                <p style={{
                  color: theme.textMuted,
                  fontSize: 13,
                  margin: '2px 0 0',
                }}>
                  {item.description}
                </p>
              </div>
              {Icons.chevron(theme.textMuted)}
            </button>
          ))}
        </GlassCard>
      </div>

      {/* Danger zone */}
      <div style={{ padding: '0 20px' }}>
        <p style={{
          color: theme.textSecondary,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Danger Zone
        </p>
        <GlassCard theme={theme} style={{ padding: 0, overflow: 'hidden' }}>
          <button style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${theme.error}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {Icons.trash(theme.error)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: theme.error, fontSize: 15, fontWeight: 500, margin: 0 }}>
                Delete Account
              </p>
              <p style={{ color: theme.textMuted, fontSize: 13, margin: '2px 0 0' }}>
                Permanently remove all your data
              </p>
            </div>
            {Icons.chevron(theme.textMuted)}
          </button>
        </GlassCard>
      </div>

      {/* Version */}
      <p style={{
        color: theme.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
        padding: '0 20px',
      }}>
        Tessa v1.0.0
      </p>
    </div>
  );
};

export default AccountScreen;
