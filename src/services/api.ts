import axios from "axios";
import { Transaction, AIAnalysis, SearchFilters } from "@/types/transaction";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for synthetic data generation
  headers: {
    "Content-Type": "application/json",
  },
});

// Fallback mock data for development when backend is not available
const fallbackTransactions: Transaction[] = [
  {
    id: "TXN-FALLBACK-001",
    customerId: "CUST-12345",
    amount: 25000,
    currency: "USD",
    country: "USA",
    transactionType: "transfer",
    riskIndicator: "High",
    timestamp: "2025-01-15T10:30:00Z",
    status: "flagged",
    description: "Large international wire transfer (fallback data)",
    merchantInfo: {
      name: "Global Finance Corp",
      category: "Financial Services",
    },
    customerInfo: {
      name: "John Smith",
      accountType: "Business",
      riskProfile: "Medium",
    },
  },
];

const fallbackAnalyses: AIAnalysis[] = [
  {
    transactionId: "TXN-FALLBACK-001",
    riskScore: 85,
    riskAssessment: "High risk transaction (fallback analysis)",
    recommendedAction: "Escalate",
    confidence: 92,
    factors: ["Fallback analysis - backend unavailable"],
    reasoning:
      "This is fallback analysis data. Please ensure the backend is running.",
    generatedAt: "2025-01-15T10:35:00Z",
  },
];

export const transactionApi = {
  async getFlaggedTransactions(
    filters?: SearchFilters
  ): Promise<Transaction[]> {
    try {
      // Build query parameters
      const params: Record<string, string | number> = {
        count: 20,
        high_risk_percentage: 0.4, // 40% high-risk for demo
      };

      if (filters?.transactionId) {
        params.transaction_id = filters.transactionId;
      }

      if (filters?.riskIndicator && filters.riskIndicator !== "All") {
        params.risk_indicator = filters.riskIndicator;
      }

      if (filters?.status && filters.status !== "All") {
        params.status = filters.status;
      }

      const response = await api.get("/transactions/flagged", { params });
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using fallback data:", error);
      // Use fallback data when backend is not available
      let filteredTransactions = fallbackTransactions;

      if (filters?.transactionId) {
        filteredTransactions = filteredTransactions.filter((t: Transaction) =>
          t.id.toLowerCase().includes(filters.transactionId!.toLowerCase())
        );
      }

      if (filters?.riskIndicator && filters.riskIndicator !== "All") {
        filteredTransactions = filteredTransactions.filter(
          (t: Transaction) => t.riskIndicator === filters.riskIndicator
        );
      }

      if (filters?.status && filters.status !== "All") {
        filteredTransactions = filteredTransactions.filter(
          (t: Transaction) => t.status === filters.status
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
      console.warn("Backend not available, using fallback data:", error);
      return fallbackTransactions.find((t: Transaction) => t.id === id) || null;
    }
  },

  async getAIAnalysis(transactionId: string): Promise<AIAnalysis | null> {
    try {
      const response = await api.get(`/analysis/${transactionId}`);
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using fallback data:", error);
      return (
        fallbackAnalyses.find(
          (a: AIAnalysis) => a.transactionId === transactionId
        ) || null
      );
    }
  },

  async updateTransactionStatus(
    id: string,
    status: Transaction["status"]
  ): Promise<void> {
    try {
      await api.patch(`/transactions/${id}/status`, { status });
    } catch (error) {
      console.warn("Backend not available, status update skipped:", error);
      // In fallback mode, we can't persist the status update
      const transaction = fallbackTransactions.find(
        (t: Transaction) => t.id === id
      );
      if (transaction) {
        transaction.status = status;
      }
    }
  },
};
