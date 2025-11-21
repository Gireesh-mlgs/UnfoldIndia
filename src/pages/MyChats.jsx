import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getChatHistory } from '@/lib/supabaseChat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const chatsPerPage = 10;
  const scrollRef = useRef(null);

  const fetchChats = async (page = 1) => {
    setLoading(true);
    const result = await getChatHistory({ page, limit: chatsPerPage });
    
    if (result.error) {
      console.error('Error fetching chats:', result.error);
    } else {
      setChats(result.data || []);
      setTotalCount(result.count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChats(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Auto-scroll to bottom when chats update
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chats]);

  const totalPages = Math.ceil(totalCount / chatsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your chat history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass glass-hover p-6 m-4 rounded-2xl text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Chat History
          </h1>
        </div>
        <p className="text-muted-foreground">
          {totalCount > 0 
            ? `${totalCount} conversation${totalCount !== 1 ? 's' : ''} with your AI travel companion`
            : 'No conversations yet'
          }
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass glass-hover p-8 rounded-2xl text-center"
          >
            <Bot className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start chatting with your AI travel companion to see your history here!
            </p>
          </motion.div>
        ) : (
          <>
            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl mb-6 overflow-hidden"
            >
              <ScrollArea className="h-[80vh]" ref={scrollRef}>
                <div className="p-6 space-y-6">
                  {chats.map((chat, chatIndex) => (
                    <div key={chat.id} className="space-y-4">
                      {/* User Message (Question) */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: chatIndex * 0.1 }}
                        className="flex justify-end"
                      >
                        <div className="max-w-[80%] flex items-end space-x-2">
                          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm p-4 shadow-lg">
                            <p className="text-sm leading-relaxed">{chat.question}</p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      </motion.div>

                      {/* AI Message (Answer) */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: chatIndex * 0.1 + 0.2 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] flex items-end space-x-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent glow-primary flex items-center justify-center">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm p-4 shadow-lg">
                            <p className="text-sm leading-relaxed">{chat.answer}</p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Timestamp */}
                      <div className="flex justify-center">
                        <span className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
                          {formatDate(chat.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass glass-hover p-4 rounded-2xl flex items-center justify-between"
              >
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 backdrop-blur-[20px] bg-white/20 border border-white/30 hover:bg-white/30 hover:backdrop-blur-[25px] transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 backdrop-blur-[20px] bg-white/20 border border-white/30 hover:bg-white/30 hover:backdrop-blur-[25px] transition-all duration-300"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyChats;