import { Message } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3 p-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-500 text-white">
            <Bot size={16} />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        'max-w-[80%] space-y-2',
        isUser ? 'order-1' : 'order-2'
      )}>
        <div className={cn(
          'rounded-lg px-4 py-2 text-sm',
          isUser
            ? 'bg-blue-500 text-white ml-auto'
            : 'bg-muted text-foreground'
        )}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        <div className={cn(
          'flex items-center gap-2 text-xs text-muted-foreground',
          isUser ? 'justify-end' : 'justify-start'
        )}>
          <Badge variant="secondary" className="text-xs">
            {isUser ? 'You' : 'Assistant'}
          </Badge>
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 order-2">
          <AvatarFallback className="bg-green-500 text-white">
            <User size={16} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
