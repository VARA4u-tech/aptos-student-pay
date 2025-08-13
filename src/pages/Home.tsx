import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calculator, School, Bus, Home as HomeIcon, CreditCard } from 'lucide-react';

const Home = () => {
  const [studentName, setStudentName] = useState(localStorage.getItem('studentName') || '');
  const [collegeName, setCollegeName] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [busFee, setBusFee] = useState('');
  const [hostelFee, setHostelFee] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { connected, account } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalAmount = (
    parseFloat(tuitionFee || '0') + 
    parseFloat(busFee || '0') + 
    parseFloat(hostelFee || '0')
  ).toFixed(2);

  const handlePayment = async () => {
    // Validation
    if (!studentName.trim() || !collegeName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(totalAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter valid fee amounts.",
        variant: "destructive",
      });
      return;
    }

    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store payment details for success page
      const paymentData = {
        studentName,
        collegeName,
        tuitionFee: parseFloat(tuitionFee || '0'),
        busFee: parseFloat(busFee || '0'),
        hostelFee: parseFloat(hostelFee || '0'),
        totalAmount: parseFloat(totalAmount),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp: new Date().toISOString(),
        walletAddress: account?.address?.toString(),
      };
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Simulate 90% success rate
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        navigate('/payment-success');
      } else {
        navigate('/payment-failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      navigate('/payment-failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </EnhancedButton>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">Payment Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Connected: {account?.address?.toString().slice(0, 6)}...{account?.address?.toString().slice(-4)}
            </p>
          </div>
          
          <div className="w-16"></div>
        </div>

        {/* Student Information */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <School className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Student Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedInput
              label="Student Name"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            
            <EnhancedInput
              label="College Name"
              placeholder="Enter your college name"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
          </div>
        </Card>

        {/* Fee Breakdown */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Fee Breakdown</h2>
          </div>
          
          <div className="space-y-4">
            <EnhancedInput
              label="Tuition Fee (APT)"
              type="number"
              placeholder="0.00"
              value={tuitionFee}
              onChange={(e) => setTuitionFee(e.target.value)}
              icon={<School className="w-4 h-4" />}
            />
            
            <EnhancedInput
              label="Bus Fee (APT)"
              type="number"
              placeholder="0.00"
              value={busFee}
              onChange={(e) => setBusFee(e.target.value)}
              icon={<Bus className="w-4 h-4" />}
            />
            
            <EnhancedInput
              label="Hostel Fee (APT)"
              type="number"
              placeholder="0.00"
              value={hostelFee}
              onChange={(e) => setHostelFee(e.target.value)}
              icon={<HomeIcon className="w-4 h-4" />}
            />
          </div>
          
          <Separator />
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">{totalAmount} APT</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All fees inclusive • Secure blockchain payment
            </p>
          </div>
        </Card>

        {/* Payment Button */}
        <EnhancedButton
          variant="payment"
          size="xl"
          className="w-full"
          onClick={handlePayment}
          disabled={!connected || parseFloat(totalAmount) <= 0 || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Pay {totalAmount} APT Now</span>
            </div>
          )}
        </EnhancedButton>
      </div>
    </div>
  );
};

export default Home;