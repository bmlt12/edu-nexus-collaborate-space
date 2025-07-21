import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface FileData {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  file_type: 'document' | 'image' | 'video' | 'audio' | 'other';
  course?: string;
  tags?: string[];
  download_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  uploader?: {
    full_name?: string;
  };
}

export const useFiles = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('files')
        .select(`
          *,
          uploader:profiles!files_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (fileData: {
    title: string;
    description?: string;
    course?: string;
    tags?: string[];
    file: File;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Upload file to storage
      const fileExt = fileData.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `lecture-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lecture-files')
        .upload(filePath, fileData.file);

      if (uploadError) throw uploadError;

      // Get file type
      const getFileType = (file: File): 'document' | 'image' | 'video' | 'audio' | 'other' => {
        const type = file.type;
        if (type.startsWith('image/')) return 'image';
        if (type.startsWith('video/')) return 'video';
        if (type.startsWith('audio/')) return 'audio';
        if (type.includes('pdf') || type.includes('document') || type.includes('presentation')) return 'document';
        return 'other';
      };

      // Insert file record
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          title: fileData.title,
          description: fileData.description,
          file_name: fileData.file.name,
          file_path: filePath,
          file_size: fileData.file.size,
          file_type: getFileType(fileData.file),
          course: fileData.course,
          tags: fileData.tags,
          user_id: user.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully"
      });

      await fetchFiles(); // Refresh files list
      return { success: true };
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
      return { error: 'Upload failed' };
    }
  };

  const incrementDownloadCount = async (fileId: string) => {
    try {
      // Fetch current count and increment
      const { data: currentFile } = await supabase
        .from('files')
        .select('download_count')
        .eq('id', fileId)
        .single();
      
      if (currentFile) {
        const { error } = await supabase
          .from('files')
          .update({ download_count: (currentFile.download_count || 0) + 1 })
          .eq('id', fileId);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    loading,
    uploadFile,
    incrementDownloadCount,
    refetch: fetchFiles
  };
};