import axios from 'axios';
import { Transaction, AIAnalysis, SearchFilters } from '@/types/transaction';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development when backend is not available
const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    customerId: 'CUST-12345',
    amount: 25000,
    currency: 'USD',
    country: 'USA',
    transactionType: 'transfer',
    riskIndicator: 'High',
    timestamp: '2025-01-15T10:30:00Z',
    status: 'flagged',
    description: 'Large international wire transfer',
    merchantInfo: {
      name: 'Global Finance Corp',
      category: 'Financial Services'
    },
    customerInfo: {
      name: 'John Smith',
      accountType: 'Business',
      riskProfile: 'Medium'
    }
  },
  {
    id: 'TXN-002',
    customerId: 'CUST-67890',
    amount: 5000,
    currency: 'EUR',
    country: 'Germany',
    transactionType: 'payment',
    riskIndicator: 'Normal',
    timestamp: '2025-01-15T09:15:00Z',
    status: 'reviewed',
    description: 'Online payment transaction',
    merchantInfo: {
      name: 'Tech Solutions GmbH',
      category: 'Technology'
    },
    customerInfo: {
      name: 'Maria Garcia',
      accountType: 'Personal',
      riskProfile: 'Low'
    }
  },
  {
    id: 'TXN-003',
    customerId: 'CUST-11111',
    amount: 75000,
    currency: 'USD',
    country: 'Cayman Islands',
    transactionType: 'deposit',
    riskIndicator: 'High',
    timestamp: '2025-01-15T08:45:00Z',
    status: 'flagged',
    description: 'Large cash deposit from high-risk jurisdiction',
    customerInfo: {
      name: 'Robert Johnson',
      accountType: 'Private Banking',
      riskProfile: 'High'
    }
  },
  {
    id: 'TXN-004',
    customerId: 'CUST-22222',
    amount: 1200,
    currency: 'GBP',
    country: 'United Kingdom',
    transactionType: 'withdrawal',
    riskIndicator: 'Normal',
    timestamp: '2025-01-15T07:20:00Z',
    status: 'reviewed',
    description: 'ATM withdrawal',
    customerInfo: {
      name: 'Sarah Wilson',
      accountType: 'Personal',
      riskProfile: 'Low'
    }
  }
];

const mockAnalyses: AIAnalysis[] = [
  {
    transactionId: 'TXN-001',
    riskScore: 85,
    riskAssessment: 'High risk transaction due to large amount and international nature',
    recommendedAction: 'Escalate',
    confidence: 92,
    factors: [
      'Large transaction amount ($25,000)',
      'International wire transfer',
      'Customer has medium risk profile',
      'Transaction outside normal pattern'
    ],
    reasoning: 'This transaction exhibits multiple risk factors including the large amount and international nature. The customer\'s transaction history shows no similar large transfers, making this an anomaly worth investigating.',
    generatedAt: '2025-01-15T10:35:00Z'
  },
  {
    transactionId: 'TXN-002',
    riskScore: 25,
    riskAssessment: 'Low risk transaction within normal parameters',
    recommendedAction: 'Monitor',
    confidence: 88,
    factors: [
      'Moderate transaction amount',
      'Established merchant',
      'Customer has low risk profile',
      'Transaction matches customer pattern'
    ],
    reasoning: 'This transaction appears to be within normal parameters for this customer. The amount is reasonable and the merchant is well-established.',
    generatedAt: '2025-01-15T09:20:00Z'
  },
  {
    transactionId: 'TXN-003',
    riskScore: 95,
    riskAssessment: 'Very high risk - large cash deposit from high-risk jurisdiction',
    recommendedAction: 'Escalate',
    confidence: 96,
    factors: [
      'Very large cash deposit ($75,000)',
      'High-risk jurisdiction (Cayman Islands)',
      'Customer has high risk profile',
      'Unusual deposit pattern',
      'Potential money laundering indicators'
    ],
    reasoning: 'This transaction presents significant money laundering risks. The large cash amount combined with the high-risk jurisdiction and customer profile requires immediate escalation and investigation.',
    generatedAt: '2025-01-15T08:50:00Z'
  },
  {
    transactionId: 'TXN-004',
    riskScore: 15,
    riskAssessment: 'Very low risk - routine ATM withdrawal',
    recommendedAction: 'Dismiss',
    confidence: 94,
    factors: [
      'Small withdrawal amount',
      'ATM transaction',
      'Customer has low risk profile',
      'Regular transaction pattern'
    ],
    reasoning: 'This is a routine ATM withdrawal within normal limits for this customer. No risk indicators present.',
    generatedAt: '2025-01-15T07:25:00Z'
  }
];

export const transactionApi = {
  async getFlaggedTransactions(filters?: SearchFilters): Promise<Transaction[]> {
    try {
      const response = await api.get('/transactions/flagged', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data - backend not available');
      let filteredTransactions = mockTransactions;
      
      if (filters?.transactionId) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.id.toLowerCase().includes(filters.transactionId!.toLowerCase())
        );
      }
      
      if (filters?.riskIndicator && filters.riskIndicator !== 'All') {
        filteredTransactions = filteredTransactions.filter(t => 
          t.riskIndicator === filters.riskIndicator
        );
      }
      
      if (filters?.status && filters.status !== 'All') {
        filteredTransactions = filteredTransactions.filter(t => 
          t.status === filters.status
        );
      }
      
      return filteredTransactions;
    }
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock data - backend not available');
      return mockTransactions.find(t => t.id === id) || null;
    }
  },

  async getAIAnalysis(transactionId: string): Promise<AIAnalysis | null> {
    try {
      const response = await api.get(`/analysis/${transactionId}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock data - backend not available');
      return mockAnalyses.find(a => a.transactionId === transactionId) || null;
    }
  },

  async updateTransactionStatus(id: string, status: Transaction['status']): Promise<void> {
    try {
      await api.patch(`/transactions/${id}/status`, { status });
    } catch (error) {
      console.warn('Mock update - backend not available');
      // In real implementation, this would update the backend
      const transaction = mockTransactions.find(t => t.id === id);
      if (transaction) {
        transaction.status = status;
      }
    }
  }
};