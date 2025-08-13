import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Home, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface PaymentData {
  studentName: string;
  collegeName: string;
  tuitionFee: number;
  busFee: number;
  hostelFee: number;
  totalAmount: number;
  transactionHash: string;
  timestamp: string;
  walletAddress: string;
}

const PaymentSuccess = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const data = localStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleDownloadReceipt = () => {
    if (!paymentData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Payment Receipt', 20, 30);
    doc.setFontSize(12);
    doc.text('Student Payment Tracker', 20, 40);
    
    // Transaction details
    doc.text(`Date: ${new Date(paymentData.timestamp).toLocaleDateString()}`, 20, 60);
    doc.text(`Transaction Hash: ${paymentData.transactionHash}`, 20, 70);
    
    // Student info
    doc.text(`Student Name: ${paymentData.studentName}`, 20, 90);
    doc.text(`College: ${paymentData.collegeName}`, 20, 100);
    doc.text(`Wallet: ${paymentData.walletAddress}`, 20, 110);
    
    // Fee breakdown
    doc.text('Fee Breakdown:', 20, 130);
    doc.text(`Tuition Fee: ${paymentData.tuitionFee} APT`, 30, 140);
    doc.text(`Bus Fee: ${paymentData.busFee} APT`, 30, 150);
    doc.text(`Hostel Fee: ${paymentData.hostelFee} APT`, 30, 160);
    doc.text(`Total Amount: ${paymentData.totalAmount} APT`, 30, 170);
    
    doc.save(`payment-receipt-${paymentData.transactionHash.slice(0, 8)}.pdf`);
    
    toast({
      title: "Receipt Downloaded",
      description: "Your payment receipt has been downloaded successfully.",
    });
  };

  const copyTransactionHash = () => {
    if (paymentData?.transactionHash) {
      navigator.clipboard.writeText(paymentData.transactionHash);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard.",
      });
    }
  };

  const goHome = () => {
    localStorage.removeItem('paymentData');
    navigate('/home');
  };

  if (!paymentData) {
    return <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary">Payment Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Your payment has been processed successfully on the Aptos blockchain.
          </p>
        </div>

        {/* Transaction Details */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            <div className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
              Confirmed
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{paymentData.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">College</p>
                <p className="font-medium">{paymentData.collegeName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{new Date(paymentData.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Address</p>
                <p className="font-medium font-mono text-xs">
                  {paymentData.walletAddress?.slice(0, 6)}...{paymentData.walletAddress?.slice(-4)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Transaction Hash</p>
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <code className="flex-1 text-xs font-mono break-all">
                  {paymentData.transactionHash}
                </code>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={copyTransactionHash}
                >
                  <Copy className="w-4 h-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${paymentData.transactionHash}?network=testnet`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </EnhancedButton>
              </div>
            </div>
          </div>
        </Card>

        {/* Fee Breakdown */}
        <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Fee Breakdown</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Tuition Fee</span>
              <span className="font-medium">{paymentData.tuitionFee} APT</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Bus Fee</span>
              <span className="font-medium">{paymentData.busFee} APT</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Hostel Fee</span>
              <span className="font-medium">{paymentData.hostelFee} APT</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-secondary">{paymentData.totalAmount} APT</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <EnhancedButton
            variant="success"
            size="lg"
            onClick={handleDownloadReceipt}
            className="flex-1"
          >
            <Download className="w-5 h-5" />
            Download Receipt
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

export default PaymentSuccess;