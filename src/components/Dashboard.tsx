import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Upload,
  TrendingUp,
  Clock,
  Star,
  Download,
  Plus,
  ArrowRight
} from 'lucide-react';

interface QuickStats {
  totalFiles: number;
  totalDiscussions: number;
  totalGroups: number;
  recentActivity: number;
}

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<QuickStats>({
    totalFiles: 0,
    totalDiscussions: 0,
    totalGroups: 0,
    recentActivity: 0
  });

  // Placeholder data for demonstration
  const recentFiles = [
    { name: 'Computer Networks - Chapter 5.pdf', uploader: 'Sarah Johnson', time: '2 hours ago', downloads: 24 },
    { name: 'Linear Algebra Solutions.pdf', uploader: 'Mike Chen', time: '5 hours ago', downloads: 18 },
    { name: 'Database Design Slides.pptx', uploader: 'Alex Rodriguez', time: '1 day ago', downloads: 31 }
  ];

  const recentDiscussions = [
    { title: 'Help with Algorithm complexity', author: 'Emma Wilson', replies: 7, solved: false, time: '30 min ago' },
    { title: 'Study group for finals?', author: 'David Kim', replies: 12, solved: false, time: '1 hour ago' },
    { title: 'Explanation of Heap Sort', author: 'Lisa Zhang', replies: 5, solved: true, time: '3 hours ago' }
  ];

  const activeGroups = [
    { name: 'CS 301 Study Group', members: 8, activity: 'high' },
    { name: 'Math Tutoring Circle', members: 12, activity: 'medium' },
    { name: 'Final Exam Prep', members: 15, activity: 'high' }
  ];

  const quickActions = [
    { 
      title: 'Upload Notes', 
      description: 'Share your lecture materials', 
      icon: Upload, 
      to: '/upload',
      color: 'bg-gradient-primary'
    },
    { 
      title: 'Ask Question', 
      description: 'Get help from peers', 
      icon: MessageSquare, 
      to: '/discussions',
      color: 'bg-gradient-accent'
    },
    { 
      title: 'Join Group', 
      description: 'Find study partners', 
      icon: Users, 
      to: '/groups',
      color: 'bg-gradient-success'
    },
    { 
      title: 'Browse Library', 
      description: 'Explore resources', 
      icon: BookOpen, 
      to: '/library',
      color: 'bg-primary'
    }
  ];

  useEffect(() => {
    // Load basic stats (placeholder implementation)
    setStats({
      totalFiles: 156,
      totalDiscussions: 89,
      totalGroups: 23,
      recentActivity: 47
    });
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getActivityBadge = (activity: string) => {
    const variants = {
      high: 'bg-success text-success-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return variants[activity as keyof typeof variants] || variants.low;
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-background rounded-lg p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {profile?.full_name || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to learn and collaborate? Here's what's happening in your academic community.
            </p>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="h-16 w-16 text-primary/20" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-sm text-muted-foreground">Files Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{stats.totalDiscussions}</p>
                <p className="text-sm text-muted-foreground">Discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.totalGroups}</p>
                <p className="text-sm text-muted-foreground">Study Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.recentActivity}</p>
                <p className="text-sm text-muted-foreground">Today's Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.to}>
                <Card className="shadow-soft hover:shadow-medium transition-all hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`${action.color} p-3 rounded-full w-fit mx-auto mb-3 shadow-soft`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Files */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Files</span>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Latest materials shared by students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    by {file.uploader} • {file.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <Badge variant="secondary" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    {file.downloads}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/library">
                View All Files <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Discussions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Discussions</span>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Latest questions and conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDiscussions.map((discussion, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{discussion.title}</h4>
                  {discussion.solved && (
                    <Badge className="bg-success text-success-foreground ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      Solved
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>by {discussion.author}</span>
                  <span>{discussion.replies} replies • {discussion.time}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/discussions">
                View All Discussions <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Active Study Groups */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Study Groups</span>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Collaborative learning communities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeGroups.map((group, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(group.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.members} members</p>
                  </div>
                </div>
                <Badge className={getActivityBadge(group.activity)}>
                  {group.activity}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/groups">
                <Plus className="h-4 w-4 mr-2" />
                Join More Groups
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;