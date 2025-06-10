import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  selectedTransaction?: Transaction;
  onTransactionSelect: (transaction: Transaction) => void;
  isLoading?: boolean;
}

export function TransactionTable({ 
  transactions, 
  selectedTransaction, 
  onTransactionSelect, 
  isLoading 
}: TransactionTableProps) {
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
        Normal
      </Badge>
    );
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'flagged':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-orange-600 border-orange-200">
            <AlertTriangle className="h-3 w-3" />
            Flagged
          </Badge>
        );
      case 'reviewed':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
            <Clock className="h-3 w-3" />
            Reviewed
          </Badge>
        );
      case 'dismissed':
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3" />
            Dismissed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Transaction ID</TableHead>
            <TableHead className="font-semibold">Customer ID</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Country</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Risk Level</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedTransaction?.id === transaction.id 
                  ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                  : ''
              }`}
              onClick={() => onTransactionSelect(transaction)}
            >
              <TableCell className="font-mono text-sm font-medium">
                {transaction.id}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {transaction.customerId}
              </TableCell>
              <TableCell className="font-semibold">
                {formatAmount(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>{transaction.country}</TableCell>
              <TableCell>{formatTransactionType(transaction.transactionType)}</TableCell>
              <TableCell>{getRiskBadge(transaction.riskIndicator)}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}