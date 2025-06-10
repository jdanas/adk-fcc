export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  country: string;
  transactionType: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  riskIndicator: 'High' | 'Normal';
  timestamp: string;
  status: 'flagged' | 'reviewed' | 'dismissed';
  description: string;
  merchantInfo?: {
    name: string;
    category: string;
  };
  customerInfo?: {
    name: string;
    accountType: string;
    riskProfile: string;
  };
}

export interface AIAnalysis {
  transactionId: string;
  riskScore: number;
  riskAssessment: string;
  recommendedAction: 'Monitor' | 'Escalate' | 'Dismiss';
  confidence: number;
  factors: string[];
  reasoning: string;
  generatedAt: string;
}

export interface SearchFilters {
  transactionId?: string;
  riskIndicator?: 'High' | 'Normal' | 'All';
  status?: 'flagged' | 'reviewed' | 'dismissed' | 'All';
  dateRange?: {
    from: string;
    to: string;
  };
}