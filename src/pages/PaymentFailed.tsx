import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { XCircle, RefreshCw, Home, AlertTriangle } from 'lucide-react';

const PaymentFailed = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const goHome = () => {
    navigate('/home');
  };

  const retryPayment = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Error Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-destructive to-warning rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-destructive">Payment Failed</h1>
          <p className="text-muted-foreground text-lg">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">What happened?</h2>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Transaction was rejected by the network</p>
            <p>• Insufficient balance or network congestion</p>
            <p>• Wallet connection was interrupted</p>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <p className="text-sm font-medium text-warning-foreground">
              Don't worry! No funds have been deducted from your wallet.
            </p>
          </div>
        </Card>

        {/* Auto Redirect Notice */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Automatically redirecting to home in{' '}
              <span className="font-bold text-primary">{countdown}</span> seconds
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <EnhancedButton
            variant="fintech"
            size="lg"
            onClick={retryPayment}
            className="flex-1"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </EnhancedButton>
          
          <EnhancedButton
            variant="outline"
            size="lg"
            onClick={goHome}
            className="flex-1"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;