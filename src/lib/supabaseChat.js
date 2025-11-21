import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Save a chat interaction to the database
 * @param {string} question - User's question
 * @param {string} answer - AI's response
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const saveChat = async (question, answer) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        question,
        answer
      });

    if (error) {
      console.error('Error saving chat:', error);
      toast({
        title: "Error",
        description: "Failed to save chat history",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving chat:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch user's chat history with pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of chats per page
 * @returns {Promise<{data?: Array, count?: number, error?: string}>}
 */
export const getChatHistory = async ({ page = 1, limit = 10 }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('chat_history')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
      return { error: error.message };
    }

    return { data, count };
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { error: error.message };
  }
};