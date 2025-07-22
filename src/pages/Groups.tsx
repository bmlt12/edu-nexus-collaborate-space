import { useAuth } from '@/hooks/useAuth';
import { useGroups } from '@/hooks/useGroups';
import Navigation from '@/components/Navigation';
import { Users, Plus, Search, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Groups = () => {
  const { user } = useAuth();
  const { groups, loading, createGroup, joinGroup } = useGroups();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredGroups = groups?.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateGroup = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      await createGroup({
        name: "New Study Group",
        description: "A new study group for collaborative learning"
      });
      toast({
        title: "Group created",
        description: "Your study group has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      await joinGroup(groupId);
      toast({
        title: "Joined group",
        description: "You have successfully joined the study group."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join group.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Study Groups</h1>
          </div>
          <Button onClick={handleCreateGroup} disabled={isCreating} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search study groups..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg leading-tight">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {group.description || "No description available."}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((member) => (
                          <Avatar key={member} className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-background">
                            <AvatarFallback className="text-xs">U{member}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{group.member_count} members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleJoinGroup(group.id)}
                        className="text-xs sm:text-sm"
                      >
                        Join Group
                      </Button>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm ? 'No study groups found matching your search.' : 'No study groups yet. Create the first one!'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;