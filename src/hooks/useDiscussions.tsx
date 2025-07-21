import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface DiscussionData {
  id: string;
  title: string;
  content: string;
  course?: string;
  tags?: string[];
  is_solved: boolean;
  vote_count: number;
  reply_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
  };
}

export interface DiscussionReply {
  id: string;
  content: string;
  is_solution: boolean;
  vote_count: number;
  user_id: string;
  discussion_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
  };
}

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState<DiscussionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          *,
          author:profiles!discussions_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (discussionData: {
    title: string;
    content: string;
    course?: string;
    tags?: string[];
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          title: discussionData.title,
          content: discussionData.content,
          course: discussionData.course,
          tags: discussionData.tags,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discussion created successfully"
      });

      await fetchDiscussions();
      return { success: true };
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: "Error",
        description: "Failed to create discussion",
        variant: "destructive"
      });
      return { error: 'Creation failed' };
    }
  };

  const fetchReplies = async (discussionId: string): Promise<DiscussionReply[]> => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select(`
          *,
          author:profiles!discussion_replies_user_id_fkey(full_name)
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  };

  const createReply = async (discussionId: string, content: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          content,
          discussion_id: discussionId,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply posted successfully"
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      });
      return { error: 'Reply failed' };
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return {
    discussions,
    loading,
    createDiscussion,
    fetchReplies,
    createReply,
    refetch: fetchDiscussions
  };
};