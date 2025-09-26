'use client';

import { ChatSession } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Plus,
  Trash2,
  Calendar,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession
}: ChatHistoryProps) {

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getSessionPreview = (session: ChatSession) => {
    const userMessages = session.messages.filter(m => m.role === 'user');
    return userMessages.length > 0
      ? userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? '...' : '')
      : 'New conversation';
  };

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const groups: { [key: string]: ChatSession[] } = {};

    sessions.forEach(session => {
      const date = new Date(session.updatedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        groupKey = 'This Week';
      } else {
        groupKey = 'Older';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(session);
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(sessions);
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Older'];

  return (
    <div className="flex flex-col h-full bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Chat History</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewSession}
            className="gap-2"
          >
            <Plus className="h-3 w-3" />
            New
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Session List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start a new chat to begin</p>
            </div>
          ) : (
            groupOrder.map(groupKey => {
              const groupSessions = sessionGroups[groupKey];
              if (!groupSessions?.length) return null;

              return (
                <div key={groupKey}>
                  <div className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {groupKey}
                  </div>
                  {groupSessions
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((session) => (
                    <div
                      key={session.id}
                      className={cn(
                        "group flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                        currentSessionId === session.id && "bg-muted border"
                      )}
                      onClick={() => onSelectSession(session.id)}
                    >
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate">
                            {session.title}
                          </h3>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSession(session.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground truncate mb-2">
                          {getSessionPreview(session)}
                        </p>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            <Bot className="h-2 w-2 mr-1" />
                            {session.model.replace('-latest', '').replace('mistral-', '')}
                          </Badge>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-2 w-2" />
                            {formatDate(new Date(session.updatedAt))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {groupKey !== 'Older' && <Separator className="my-2" />}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
