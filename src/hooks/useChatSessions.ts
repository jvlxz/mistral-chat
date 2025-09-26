'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatResponse, ChatSession } from '@/types/chat';

const STORAGE_KEY = 'mistral-chat-sessions';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        interface StoredSession {
          id: string;
          title: string;
          model: string;
          createdAt: string;
          updatedAt: string;
          messages: Array<{
            id: string;
            role: 'user' | 'assistant' | 'system';
            content: string;
            timestamp: string;
          }>;
        }

        const parsedSessions = (JSON.parse(stored) as StoredSession[]).map((session) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setSessions(parsedSessions);

        // Set the most recent session as current
        if (parsedSessions.length > 0) {
          const mostRecent = parsedSessions.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentSessionId(mostRecent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save chat sessions:', error);
      }
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const generateSessionTitle = (firstMessage: string): string => {
    // Extract first few words for title
    const words = firstMessage.trim().split(' ').slice(0, 6);
    let title = words.join(' ');
    if (firstMessage.length > title.length) {
      title += '...';
    }
    return title || 'New conversation';
  };

  const createNewSession = useCallback((model: string = 'mistral-large-latest') => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      model,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setError(null);

    return newSession.id;
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setError(null);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);

      // If we deleted the current session, select another one
      if (sessionId === currentSessionId) {
        if (filtered.length > 0) {
          const mostRecent = filtered.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          setCurrentSessionId(mostRecent.id);
        } else {
          setCurrentSessionId(null);
        }
      }

      return filtered;
    });
  }, [currentSessionId]);

  const updateSessionModel = useCallback((sessionId: string, model: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, model, updatedAt: new Date() }
          : session
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let sessionId = currentSessionId;

    // Create a new session if none exists
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const currentSessionData = sessions.find(s => s.id === sessionId);
    if (!currentSessionData) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message and update session
    setSessions(prev =>
      prev.map(session => {
        if (session.id === sessionId) {
          const updatedMessages = [...session.messages, userMessage];
          return {
            ...session,
            messages: updatedMessages,
            title: session.messages.length === 0 ? generateSessionTitle(content) : session.title,
            updatedAt: new Date(),
          };
        }
        return session;
      })
    );

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...currentSessionData.messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          model: currentSessionData.model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      // Add assistant message
      setSessions(prev =>
        prev.map(session => {
          if (session.id === sessionId) {
            return {
              ...session,
              messages: [...session.messages, assistantMessage],
              updatedAt: new Date(),
            };
          }
          return session;
        })
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);

      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setSessions(prev =>
        prev.map(session => {
          if (session.id === sessionId) {
            return {
              ...session,
              messages: [...session.messages, errorChatMessage],
              updatedAt: new Date(),
            };
          }
          return session;
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, sessions, createNewSession]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    sessions,
    currentSession,
    currentSessionId,
    isLoading,
    error,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    updateSessionModel,
    clearSessions,
  };
}
