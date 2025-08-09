import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import Navigation from '@/components/Navigation';
import CreateConversation from '@/components/CreateConversation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Plus, Phone, Video, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { user } = useAuth();
  const { conversations, messages, sendMessage, fetchMessages } = useChat();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const result = await sendMessage(selectedConversation, messageInput);
    if (result.success) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationCreated = (conversationId: string) => {
    setIsCreatingChat(false);
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const getConversationName = (conversation: any) => {
    if (conversation.is_group) {
      return conversation.name || 'Group Chat';
    }
    
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    );
    return otherParticipant?.user?.full_name || 'Unknown User';
  };

  const getConversationAvatar = (conversation: any) => {
    if (conversation.is_group) {
      return null;
    }
    
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.user_id !== user?.id
    );
    return otherParticipant?.user?.avatar_url;
  };

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  if (isCreatingChat) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <CreateConversation
              onConversationCreated={handleConversationCreated}
              onCancel={() => setIsCreatingChat(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)]">
          {/* Mobile: Hide conversations list when chat is selected */}
          <div className={`w-full lg:w-1/3 xl:w-1/4 ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3 px-3 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5" />
                    <span className="hidden sm:inline">Chats</span>
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setIsCreatingChat(true)}
                    className="h-8 w-8 p-0 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  {conversations.length > 0 ? (
                    <div className="space-y-1 p-2 sm:p-3">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors hover-scale ${
                            selectedConversation === conversation.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                              <AvatarImage src={getConversationAvatar(conversation)} />
                              <AvatarFallback>
                                {conversation.is_group ? 'G' : getConversationName(conversation)[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm sm:text-base">
                                {getConversationName(conversation)}
                              </p>
                              <p className="text-xs sm:text-sm opacity-70 truncate">
                                {conversation.last_message?.content || 'No messages yet'}
                              </p>
                            </div>
                            {conversation.is_group && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {conversation.participants?.length || 0}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
                      <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm sm:text-base">No conversations yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsCreatingChat(true)}
                      >
                        Start a chat
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window - Show on mobile when conversation is selected */}
          <div className={`flex-1 ${!selectedConversation ? 'hidden lg:block' : 'block'}`}>
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-3 border-b px-3 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        {/* Mobile back button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedConversation('')}
                          className="lg:hidden h-8 w-8 p-0 shrink-0"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                          <AvatarImage 
                            src={getConversationAvatar(
                              conversations.find(c => c.id === selectedConversation)
                            )}
                          />
                          <AvatarFallback>
                            {getConversationName(
                              conversations.find(c => c.id === selectedConversation) || {}
                            )[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {getConversationName(
                              conversations.find(c => c.id === selectedConversation) || {}
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Info</DropdownMenuItem>
                            <DropdownMenuItem>Mute</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-2 sm:p-4">
                      {currentMessages.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {currentMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.user_id === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 animate-fade-in ${
                                  message.user_id === user?.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                {message.user_id !== user?.id && (
                                  <p className="text-xs font-medium mb-1">
                                    {message.author?.full_name || 'Unknown'}
                                  </p>
                                )}
                                <p className="text-sm break-words">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.user_id === user?.id ? 'opacity-70' : 'text-muted-foreground'
                                }`}>
                                  {new Date(message.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center p-4">
                          <p className="text-muted-foreground text-sm sm:text-base">No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-2 sm:p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 text-sm"
                      />
                      <Button onClick={handleSendMessage} size="sm" className="h-8 w-8 p-0 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div>
                    <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm sm:text-base">Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;