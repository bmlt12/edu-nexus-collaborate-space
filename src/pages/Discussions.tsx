import { useAuth } from '@/hooks/useAuth';
import { useDiscussions } from '@/hooks/useDiscussions';
import Navigation from '@/components/Navigation';
import { MessageSquare, Plus, Search, TrendingUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Discussions = () => {
  const { user } = useAuth();
  const { discussions, loading, createDiscussion } = useDiscussions();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredDiscussions = discussions?.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateDiscussion = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      await createDiscussion({
        title: "New Discussion",
        content: "Start a new discussion here..."
      });
      toast({
        title: "Discussion created",
        description: "Your discussion has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create discussion.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Discussions</h1>
          </div>
          <Button onClick={handleCreateDiscussion} disabled={isCreating} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Creating..." : "New Question"}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base sm:text-lg leading-tight">{discussion.title}</CardTitle>
                      <Badge variant={discussion.is_solved ? "default" : "secondary"} className="shrink-0">
                        {discussion.is_solved ? "Solved" : "Open"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="truncate">{discussion.author?.full_name || 'Anonymous'}</span>
                        </div>
                        <span className="text-xs">{new Date(discussion.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{discussion.vote_count} votes</span>
                        <span>•</span>
                        <span>{discussion.reply_count} replies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No discussions found matching your search.' : 'No discussions yet. Start the conversation!'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussions;