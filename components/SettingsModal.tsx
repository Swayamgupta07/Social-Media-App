
'use client';

import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    mentions: true
  });
  const [chatSettings, setChatSettings] = useState({
    readReceipts: true,
    onlineStatus: true,
    messagePreview: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = localStorage.getItem('notifications');
    const savedChatSettings = localStorage.getItem('chatSettings');

    setDarkMode(savedDarkMode);
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedChatSettings) {
      setChatSettings(JSON.parse(savedChatSettings));
    }

    // Apply dark mode to document
    document.documentElement.classList.toggle('dark', savedDarkMode);
    document.body.style.backgroundColor = savedDarkMode ? '#000000' : '#f9fafb';
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));

    // Apply dark mode changes immediately
    document.documentElement.classList.toggle('dark', newDarkMode);
    document.body.style.backgroundColor = newDarkMode ? '#000000' : '#f9fafb';
  };

  const updateNotifications = (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

  const updateChatSettings = (key: string, value: boolean) => {
    const newChatSettings = { ...chatSettings, [key]: value };
    setChatSettings(newChatSettings);
    localStorage.setItem('chatSettings', JSON.stringify(newChatSettings));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black rounded-t-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="ri-close-line text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Appearance */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Appearance</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  <i className="ri-moon-line text-blue-500 dark:text-blue-400"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch to dark theme</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Notifications</h4>
            <div className="space-y-4">
              {[
                { key: 'likes', icon: 'ri-heart-line', label: 'Likes', desc: 'When someone likes your posts' },
                { key: 'comments', icon: 'ri-chat-3-line', label: 'Comments', desc: 'When someone comments on your posts' },
                { key: 'follows', icon: 'ri-user-add-line', label: 'Follows', desc: 'When someone follows you' },
                { key: 'mentions', icon: 'ri-at-line', label: 'Mentions', desc: 'When someone mentions you' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                      <i className={`${item.icon} text-gray-600 dark:text-gray-300 text-sm`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateNotifications(item.key, !notifications[item.key as keyof typeof notifications])}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Settings */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Chat Settings</h4>
            <div className="space-y-4">
              {[
                { key: 'readReceipts', icon: 'ri-check-double-line', label: 'Read Receipts', desc: 'Let others see when you read messages' },
                { key: 'onlineStatus', icon: 'ri-circle-fill', label: 'Online Status', desc: 'Show when you\'re online' },
                { key: 'messagePreview', icon: 'ri-eye-line', label: 'Message Preview', desc: 'Show message previews in notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-50 dark:bg-green-900/30 rounded-full">
                      <i className={`${item.icon} text-green-500 dark:text-green-400 text-sm`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateChatSettings(item.key, !chatSettings[item.key as keyof typeof chatSettings])}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      chatSettings[item.key as keyof typeof chatSettings] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        chatSettings[item.key as keyof typeof chatSettings] ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stories */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stories</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-50 dark:bg-purple-900/30 rounded-full">
                  <i className="ri-add-line text-purple-500 dark:text-purple-400"></i>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Create Story</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share a moment</p>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 rounded-full">
                  <i className="ri-archive-line text-orange-500 dark:text-orange-400"></i>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Story Archive</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View past stories</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}