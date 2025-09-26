'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ChatHistory } from '@/components/ChatHistory';
import { ModelSelector } from '@/components/ModelSelector';
import { useChatSessions } from '@/hooks/useChatSessions';
import {
  MessageSquare,
  Plus,
  Trash2,
  Menu
} from 'lucide-react';

export function ChatInterface() {
  const {
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
  } = useChatSessions();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentSession?.messages]);

  const handleModelChange = (model: string) => {
    if (currentSessionId) {
      updateSessionModel(currentSessionId, model);
    }
  };

  const handleNewSession = () => {
    const model = currentSession?.model || 'mistral-large-latest';
    createNewSession(model);
    setShowHistory(false);
  };

  const currentMessages = currentSession?.messages || [];
  const currentModel = currentSession?.model || 'mistral-large-latest';

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:bg-muted/10">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Mistral AI Chat</h1>
          </div>

          <ModelSelector
            selectedModel={currentModel}
            onModelChange={handleModelChange}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatHistory
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={selectSession}
            onNewSession={handleNewSession}
            onDeleteSession={deleteSession}
          />
        </div>

        {sessions.length > 0 && (
          <div className="p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSessions}
              className="w-full gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Sessions
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <Sheet open={showHistory} onOpenChange={setShowHistory}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-6 w-6 text-blue-500" />
                      <h1 className="text-xl font-semibold">Mistral AI Chat</h1>
                    </div>

                    <ModelSelector
                      selectedModel={currentModel}
                      onModelChange={handleModelChange}
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <ChatHistory
                      sessions={sessions}
                      currentSessionId={currentSessionId}
                      onSelectSession={(id) => {
                        selectSession(id);
                        setShowHistory(false);
                      }}
                      onNewSession={handleNewSession}
                      onDeleteSession={deleteSession}
                    />
                  </div>

                  {sessions.length > 0 && (
                    <div className="p-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSessions}
                        className="w-full gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All Sessions
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <MessageSquare className="h-6 w-6 text-blue-500" />
            <h1 className="text-lg font-semibold">
              {currentSession?.title || 'Mistral AI Chat'}
            </h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNewSession}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* Desktop Header for Model Selection */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">
              {currentSession?.title || 'New conversation'}
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNewSession}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col m-4 overflow-hidden">
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            {currentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start a new conversation</h3>
                <p className="text-sm max-w-md">
                  Ask me anything! I&apos;m powered by {currentModel.replace('-latest', '').replace('mistral-', 'Mistral ')} and ready to help you with any questions or tasks.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {currentMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={!!error}
          />
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
