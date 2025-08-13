import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, User, CreditCard } from 'lucide-react';

const SignIn = () => {
  const [studentName, setStudentName] = useState('');
  const { connected, connect, disconnect, account } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      if (!connected) {
        await connect("Petra");
        toast({
          title: "Wallet Connected!",
          description: "Successfully connected to your Aptos wallet.",
        });
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Please install Petra wallet or try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleProceed = () => {
    if (!studentName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your student name.",
        variant: "destructive",
      });
      return;
    }

    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    // Store user info for later use
    localStorage.setItem('studentName', studentName);
    
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Payment Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Secure APT payments for education
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 space-y-6">
          <div className="space-y-4">
            <EnhancedInput
              label="Student Name"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          {/* Wallet Connection */}
          <div className="space-y-4">
            <div className="border border-border rounded-xl p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Wallet Status</p>
                    {connected ? (
                      <p className="text-sm text-secondary">
                        Connected: {account?.address?.toString().slice(0, 6)}...{account?.address?.toString().slice(-4)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    )}
                  </div>
                </div>
                {connected ? (
                  <EnhancedButton
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </EnhancedButton>
                ) : (
                  <EnhancedButton
                    variant="wallet"
                    size="sm"
                    onClick={handleConnect}
                  >
                    Connect Wallet
                  </EnhancedButton>
                )}
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <EnhancedButton
            variant="fintech"
            size="xl"
            className="w-full"
            onClick={handleProceed}
            disabled={!connected || !studentName.trim()}
          >
            Continue to Payment
          </EnhancedButton>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Powered by Aptos Blockchain • Secure • Transparent
        </div>
      </div>
    </div>
  );
};

export default SignIn;