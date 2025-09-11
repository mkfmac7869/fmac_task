
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Lock, User, Globe, Moon, Sun, Upload } from 'lucide-react';
import AdminUtils from '@/components/AdminUtils';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    statusUpdates: true,
    dueReminders: true,
    mentions: true,
    emailNotifications: false
  });
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'english'
  });
  const [isUploading, setIsUploading] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAppearanceChange = (name: string, value: string) => {
    setAppearance(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would call updateProfile here
    updateProfile(profileData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated."
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API to update the password
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully."
    });
    setPassword({ current: '', new: '', confirm: '' });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, you would upload the file to a server
      // and then update the avatar URL in the user's profile
      
      // For now, we'll use a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const avatar = event.target?.result as string;
        setProfileData(prev => ({ ...prev, avatar }));
        
        // Update the user's profile
        updateProfile({ ...profileData, avatar });
        
        setIsUploading(false);
        toast({
          title: "Photo Updated",
          description: "Your profile picture has been updated."
        });
      };
      reader.readAsDataURL(file);
    }, 1500);
  };
  
  const saveNotificationSettings = () => {
    // In a real app, you would call an API to update the notification settings
    
    toast({
      title: "Notifications Updated",
      description: "Your notification settings have been updated."
    });
  };
  
  const saveAppearanceSettings = () => {
    // In a real app, you would call an API to update the appearance settings
    
    toast({
      title: "Appearance Updated",
      description: "Your appearance settings have been updated."
    });
  };
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-5 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information and photo</CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-1/3">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profileData.avatar || 'https://ui-avatars.com/api/?name=User&background=ea384c&color=fff'} />
                        <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Change Photo
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Profile Picture</DialogTitle>
                            <DialogDescription>
                              Upload a new profile picture. JPG, PNG and GIF formats are supported.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Input
                              id="picture"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              disabled={isUploading}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" disabled={isUploading}>
                              Cancel
                            </Button>
                            <Button type="button" disabled={isUploading}>
                              {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="space-y-4 w-full md:w-2/3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          placeholder="your@email.com"
                          type="email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-fmac-red hover:bg-fmac-red/90">
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Update your password and security settings</CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input 
                      id="current"
                      name="current"
                      type="password"
                      value={password.current}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input 
                      id="new"
                      name="new"
                      type="password"
                      value={password.new}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input 
                      id="confirm"
                      name="confirm"
                      type="password"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Setup 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-fmac-red hover:bg-fmac-red/90">
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taskAssignments">Task Assignments</Label>
                      <p className="text-sm text-gray-500">Get notified when you are assigned a task</p>
                    </div>
                    <Switch 
                      id="taskAssignments"
                      checked={notifications.taskAssignments}
                      onCheckedChange={(checked) => handleNotificationChange('taskAssignments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="statusUpdates">Status Updates</Label>
                      <p className="text-sm text-gray-500">Get notified when task status changes</p>
                    </div>
                    <Switch 
                      id="statusUpdates"
                      checked={notifications.statusUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('statusUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dueReminders">Due Date Reminders</Label>
                      <p className="text-sm text-gray-500">Get notified about upcoming task deadlines</p>
                    </div>
                    <Switch 
                      id="dueReminders"
                      checked={notifications.dueReminders}
                      onCheckedChange={(checked) => handleNotificationChange('dueReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mentions">Mentions</Label>
                      <p className="text-sm text-gray-500">Get notified when you are mentioned in comments</p>
                    </div>
                    <Switch 
                      id="mentions"
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => handleNotificationChange('mentions', checked)}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveNotificationSettings} className="bg-fmac-red hover:bg-fmac-red/90">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your visual preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Theme</Label>
                    <div className="flex flex-wrap gap-3">
                      <div 
                        className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${appearance.theme === 'light' ? 'ring-2 ring-fmac-red' : ''}`}
                        onClick={() => handleAppearanceChange('theme', 'light')}
                      >
                        <Sun className="h-5 w-5 mr-2" />
                        <span>Light</span>
                      </div>
                      <div 
                        className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${appearance.theme === 'dark' ? 'ring-2 ring-fmac-red' : ''}`}
                        onClick={() => handleAppearanceChange('theme', 'dark')}
                      >
                        <Moon className="h-5 w-5 mr-2" />
                        <span>Dark</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label className="mb-2 block">Language</Label>
                    <div className="flex flex-wrap gap-3">
                      <div 
                        className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${appearance.language === 'english' ? 'ring-2 ring-fmac-red' : ''}`}
                        onClick={() => handleAppearanceChange('language', 'english')}
                      >
                        <Globe className="h-5 w-5 mr-2" />
                        <span>English</span>
                      </div>
                      <div 
                        className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${appearance.language === 'spanish' ? 'ring-2 ring-fmac-red' : ''}`}
                        onClick={() => handleAppearanceChange('language', 'spanish')}
                      >
                        <Globe className="h-5 w-5 mr-2" />
                        <span>Spanish</span>
                      </div>
                      <div 
                        className={`flex items-center justify-center border rounded-md p-3 cursor-pointer ${appearance.language === 'french' ? 'ring-2 ring-fmac-red' : ''}`}
                        onClick={() => handleAppearanceChange('language', 'french')}
                      >
                        <Globe className="h-5 w-5 mr-2" />
                        <span>French</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveAppearanceSettings} className="bg-fmac-red hover:bg-fmac-red/90">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Admin Tab */}
          <TabsContent value="admin">
            <div className="space-y-6">
              <AdminUtils />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
