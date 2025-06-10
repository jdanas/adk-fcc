import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from './SearchBar';
import { TransactionTable } from './TransactionTable';
import { TransactionDetails } from './TransactionDetails';
import { AIAnalysis } from './AIAnalysis';
import { Transaction, AIAnalysis as AIAnalysisType, SearchFilters } from '@/types/transaction';
import { transactionApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisType | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (filters?: SearchFilters) => {
    setIsLoadingTransactions(true);
    try {
      const data = await transactionApi.getFlaggedTransactions(filters);
      setTransactions(data);
      
      // If we had a selected transaction, try to find it in the new data
      if (selectedTransaction) {
        const updatedTransaction = data.find(t => t.id === selectedTransaction.id);
        if (updatedTransaction) {
          setSelectedTransaction(updatedTransaction);
        } else {
          setSelectedTransaction(null);
          setAiAnalysis(null);
        }
      }
    } catch (error) {
      toast({
        title: "Error Loading Transactions",
        description: "Failed to load transaction data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleTransactionSelect = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsLoadingAnalysis(true);
    
    try {
      const analysis = await transactionApi.getAIAnalysis(transaction.id);
      setAiAnalysis(analysis);
    } catch (error) {
      toast({
        title: "Error Loading Analysis",
        description: "Failed to load AI analysis for this transaction.",
        variant: "destructive",
      });
      setAiAnalysis(null);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleStatusUpdate = async (status: Transaction['status']) => {
    if (!selectedTransaction) return;

    try {
      await transactionApi.updateTransactionStatus(selectedTransaction.id, status);
      
      // Update the transaction in our local state
      const updatedTransactions = transactions.map(t => 
        t.id === selectedTransaction.id ? { ...t, status } : t
      );
      setTransactions(updatedTransactions);
      setSelectedTransaction({ ...selectedTransaction, status });
      
      toast({
        title: "Status Updated",
        description: `Transaction ${selectedTransaction.id} has been marked as ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "Failed to update transaction status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    loadTransactions(filters);
  };

  // Calculate summary statistics
  const totalTransactions = transactions.length;
  const highRiskCount = transactions.filter(t => t.riskIndicator === 'High').length;
  const flaggedCount = transactions.filter(t => t.status === 'flagged').length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Financial Crime Monitoring
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Real-time Transaction Analysis
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Active monitoring
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{flaggedCount}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Under monitoring
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoadingTransactions} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Table */}
          <div className="lg:col-span-2">
            <TransactionTable
              transactions={transactions}
              selectedTransaction={selectedTransaction}
              onTransactionSelect={handleTransactionSelect}
              isLoading={isLoadingTransactions}
            />
          </div>

          {/* Details Panel */}
          <div className="space-y-6">
            {selectedTransaction ? (
              <>
                <TransactionDetails
                  transaction={selectedTransaction}
                  onStatusUpdate={handleStatusUpdate}
                />
                {aiAnalysis ? (
                  <AIAnalysis analysis={aiAnalysis} isLoading={isLoadingAnalysis} />
                ) : (
                  <AIAnalysis 
                    analysis={{} as AIAnalysisType} 
                    isLoading={isLoadingAnalysis} 
                  />
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Transaction
                </h3>
                <p className="text-gray-500">
                  Click on any transaction in the table to view detailed information and AI analysis.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}