import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  CreditCard, 
  MapPin, 
  Calendar, 
  Building, 
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionDetailsProps {
  transaction: Transaction;
  onStatusUpdate?: (status: Transaction['status']) => void;
}

export function TransactionDetails({ transaction, onStatusUpdate }: TransactionDetailsProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'High') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          High Risk
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Shield className="h-3 w-3" />
        Normal Risk
      </Badge>
    );
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'flagged':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'reviewed':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'dismissed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Transaction Details
            </CardTitle>
            {getRiskBadge(transaction.riskIndicator)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="font-mono font-semibold">{transaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAmount(transaction.amount, transaction.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Transaction Type</label>
                <p className="capitalize font-medium">{transaction.transactionType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <span className="capitalize font-medium">{transaction.status}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Customer ID</label>
                <p className="font-mono font-semibold">{transaction.customerId}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <p className="font-medium">{transaction.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <p className="font-medium">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="mt-1">{transaction.description}</p>
          </div>

          {transaction.merchantInfo && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Building className="h-4 w-4" />
                  Merchant Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Merchant Name</label>
                    <p className="font-medium">{transaction.merchantInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="font-medium">{transaction.merchantInfo.category}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {transaction.customerInfo && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <User className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                    <p className="font-medium">{transaction.customerInfo.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Type</label>
                    <p className="font-medium">{transaction.customerInfo.accountType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Risk Profile</label>
                    <Badge variant={transaction.customerInfo.riskProfile === 'High' ? 'destructive' : 
                      transaction.customerInfo.riskProfile === 'Medium' ? 'default' : 'secondary'}>
                      {transaction.customerInfo.riskProfile}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}

          {onStatusUpdate && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-3">Actions</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate('reviewed')}
                    disabled={transaction.status === 'reviewed'}
                  >
                    Mark as Reviewed
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate('dismissed')}
                    disabled={transaction.status === 'dismissed'}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Dismiss
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate('flagged')}
                    disabled={transaction.status === 'flagged'}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Re-flag
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}