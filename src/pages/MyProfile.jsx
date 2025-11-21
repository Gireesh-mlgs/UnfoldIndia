import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Camera, Save, Trash2, Key, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const MyProfile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    gender: '',
    email: '',
    phone: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if it doesn't exist
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      toast({
        title: "Success",
        description: "Avatar uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete user profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      await signOut();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background/60 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lovable-gradient flex flex-col items-center justify-center px-4 py-20">
      {/* Hero Background Elements */}
      <div className="absolute inset-0 hero-gradient opacity-30" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="space-y-12">
          {/* Enhanced Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                My Profile
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your journey through India with personalized settings
            </p>
          </div>

          {/* Profile Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Avatar & Quick Info Card */}
            <div className="lg:col-span-1">
              <Card className="glass glass-hover rounded-3xl overflow-hidden glow-primary animate-scale-in">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Enhanced Avatar Section */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
                    <Avatar className="relative w-32 h-32 mx-auto border-4 border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-2xl">
                      <AvatarImage src={profile.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-3xl font-bold">
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Floating Camera Button */}
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full backdrop-blur-[20px] bg-primary/25 border border-primary/30 hover:bg-primary/35 hover:backdrop-blur-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transform hover:scale-110 transition-all duration-300"
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  {/* Profile Preview */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      {profile.full_name || user?.email?.split('@')[0] || 'Traveler'}
                    </h2>
                    <p className="text-muted-foreground">@{profile.username || 'username'}</p>
                    <div className="flex justify-center">
                      <span className="px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full text-sm font-medium border border-primary/30">
                        Explorer
                      </span>
                    </div>
                  </div>

                  {/* Upload Status */}
                  {uploading && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm">Uploading avatar...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Form Card */}
            <div className="lg:col-span-2">
              <Card className="glass glass-hover rounded-3xl overflow-hidden glow-secondary animate-fade-in-left">
                <CardHeader className="border-b border-white/10 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  
                  {/* Profile Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label htmlFor="full_name" className="text-foreground font-medium">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="glass border-glass-border/50 focus:border-primary/50 transition-all duration-300 group-hover:border-primary/30"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-3 group">
                      <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="glass border-glass-border/50 focus:border-primary/50 transition-all duration-300 group-hover:border-primary/30"
                        placeholder="Choose a unique username"
                      />
                    </div>
                    
                    <div className="space-y-3 group">
                      <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="glass border-glass-border/50 focus:border-primary/50 transition-all duration-300 group-hover:border-primary/30"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div className="space-y-3 group">
                      <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="glass border-glass-border/50 focus:border-primary/50 transition-all duration-300 group-hover:border-primary/30"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="gender" className="text-foreground font-medium">Gender</Label>
                      <Select value={profile.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                        <SelectTrigger className="glass border-glass-border/50 focus:border-primary/50 transition-all duration-300">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent className="glass border-glass-border backdrop-blur-xl">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Enhanced Save Button */}
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={saving}
                    className="w-full h-14 text-lg font-semibold backdrop-blur-[20px] bg-primary/25 border border-primary/30 hover:bg-primary/35 hover:backdrop-blur-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transform hover:scale-105 transition-all duration-300 rounded-2xl"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving Profile...
                      </div>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Settings Card */}
          <Card className="glass glass-hover rounded-3xl overflow-hidden glow-primary animate-fade-in-up">
            <CardHeader className="border-b border-white/10 bg-gradient-to-r from-accent/5 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-primary">
                  <Key className="w-6 h-6 text-white" />
                </div>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              
              {/* Password Change Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h3 className="text-xl font-bold text-foreground">Change Password</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <Label htmlFor="new_password" className="text-foreground font-medium">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="glass border-glass-border/50 focus:border-accent/50 transition-all duration-300 group-hover:border-accent/30"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label htmlFor="confirm_password" className="text-foreground font-medium">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass border-glass-border/50 focus:border-accent/50 transition-all duration-300 group-hover:border-accent/30"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={!newPassword || !confirmPassword}
                    className="px-8 py-3 h-12 text-base font-semibold backdrop-blur-[20px] bg-secondary/25 border border-secondary/30 hover:bg-secondary/35 hover:backdrop-blur-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transform hover:scale-105 transition-all duration-300 rounded-xl"
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-glass-border to-transparent" />

              {/* Danger Zone */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-destructive to-red-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-destructive">Danger Zone</h3>
                </div>
                
                <div className="glass border-destructive/20 rounded-2xl p-8 space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-center">
                    Once you delete your account, there is no going back. This action will permanently remove 
                    all your travel data, chat history, and preferences from our servers.
                  </p>
                  
                  <div className="flex justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="px-8 py-3 h-12 text-base font-semibold backdrop-blur-[20px] bg-destructive/15 border border-destructive/30 hover:bg-destructive/25 hover:backdrop-blur-[25px] text-destructive hover:text-destructive transition-all duration-300 rounded-xl"
                        >
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                    <AlertDialogContent className="glass border-white/20 backdrop-blur-2xl rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold text-foreground">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers, including your travel history,
                          preferences, and chat conversations.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="glass hover:bg-background/80">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount} 
                          className="bg-destructive hover:bg-destructive/80 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-float opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float opacity-50" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-accent/30 to-secondary/30 rounded-full blur-2xl animate-float opacity-40" style={{animationDelay: '4s'}}></div>
    </div>
  );
};

export default MyProfile;