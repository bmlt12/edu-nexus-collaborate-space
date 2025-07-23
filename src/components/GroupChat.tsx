import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGroupChat } from '@/hooks/useGroupChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Image, FileText, Mic, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GroupData } from '@/hooks/useGroups';

interface GroupChatProps {
  group: GroupData;
  onBack: () => void;
}

const GroupChat = ({ group, onBack }: GroupChatProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, members } = useGroupChat(group.id);
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const result = await sendMessage(newMessage.trim());
      if (result?.success) {
        setNewMessage('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload
    toast({
      title: "Coming soon",
      description: "File sharing will be available soon."
    });
  };

  const handleVoiceCall = () => {
    // TODO: Implement voice call
    toast({
      title: "Coming soon",
      description: "Voice calls will be available soon."
    });
  };

  const handleVideoCall = () => {
    // TODO: Implement video call
    toast({
      title: "Coming soon",
      description: "Video calls will be available soon."
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Chat Header */}
      <CardHeader className="flex-row items-center space-y-0 pb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {members.length} members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleVoiceCall}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleVideoCall}>
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                  {!isOwnMessage && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.author?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {message.author?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`${isOwnMessage ? 'mr-2' : 'ml-2'}`}>
                    {!isOwnMessage && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {message.author?.full_name || 'Unknown'}
                      </p>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.message_type === 'text' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : message.message_type === 'image' ? (
                        <div className="space-y-2">
                          <img
                            src={message.file_url}
                            alt="Shared image"
                            className="max-w-full rounded"
                          />
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      ) : message.message_type === 'document' ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline"
                          >
                            View Document
                          </a>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="shrink-0"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            className="shrink-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || sending}
            className="shrink-0"
          >
            {sending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;