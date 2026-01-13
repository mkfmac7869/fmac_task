
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://taskfmac.dev/login',
        handleCodeInApp: false,
      });
      
      setIsEmailSent(true);
      toast({
        title: "Email sent!",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsEmailSent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/2e5ea70a-889d-46e0-8149-e69a1deee5f3.png" 
              alt="FMAC Logo" 
              className="h-24" 
            />
          </div>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              {isEmailSent 
                ? "Check your email for reset instructions" 
                : "Enter your email address and we'll send you a link to reset your password"
              }
            </CardDescription>
          </CardHeader>
          
          {isEmailSent ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-sm font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-md">
                  {email}
                </p>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>Didn't receive the email?</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure the email address is correct</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          ) : (
            <>
              {error && (
                <div className="px-6">
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-fmac-red hover:bg-fmac-red/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
          
          <CardFooter className="flex flex-col pt-0">
            {isEmailSent && (
              <Button 
                variant="outline"
                onClick={handleResendEmail}
                className="w-full mb-4"
              >
                Try a different email
              </Button>
            )}
            
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-fmac-red transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
