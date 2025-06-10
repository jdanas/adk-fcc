# Synthetic Transaction Data Implementation

## Overview

We have successfully implemented a comprehensive synthetic transaction data generator using Python's Faker library to replace the static mock data in both the frontend and backend of the Financial Crime Monitoring application.

## What's Been Implemented

### Backend Changes

1. **New Data Generator Module** (`backend/data_generator.py`):
   - Generates realistic synthetic transactions with proper risk indicators
   - Creates diverse customer profiles and merchant information
   - Simulates real-world financial transaction patterns
   - Supports filtering by risk level, transaction type, and other criteria
   - Generates corresponding AI analysis with risk scores and recommendations

2. **Enhanced API Endpoints**:
   - `GET /api/transactions/flagged` - Returns synthetic transactions with filtering
   - `GET /api/transactions/{id}` - Returns specific transaction data
   - `GET /api/analysis/{id}` - Returns AI analysis for a transaction
   - `PATCH /api/transactions/{id}/status` - Updates transaction status

3. **Realistic Data Features**:
   - **Risk-based Generation**: 30% high-risk, 70% normal transactions by default
   - **Geographic Diversity**: Transactions from 32+ countries with realistic risk profiles
   - **Currency Mapping**: Proper currency assignment based on transaction country
   - **Amount Scaling**: Realistic amounts based on transaction type and risk level
   - **Temporal Distribution**: Transactions spread across the last 30 days
   - **Customer Profiles**: Varied account types and risk profiles
   - **Merchant Categories**: 15+ merchant categories for payment transactions

### Frontend Changes

1. **Updated API Service** (`src/services/api.ts`):
   - Now calls the new backend endpoints for synthetic data
   - Maintains fallback mock data for offline development
   - Improved error handling and logging
   - Enhanced timeout settings for data generation

2. **Dynamic Data Loading**:
   - Frontend now loads fresh synthetic data on each request
   - Supports filtering and search functionality
   - Real-time transaction status updates

## Data Quality Features

### Transaction Generation
- **Realistic Amounts**: Scaled appropriately by transaction type and risk level
- **Proper Risk Indicators**: High-risk transactions exhibit multiple risk factors
- **Geographic Risk Mapping**: Countries categorized by financial crime risk levels
- **Temporal Patterns**: Realistic timestamp distribution

### AI Analysis Generation
- **Multi-factor Risk Scoring**: Considers amount, geography, customer profile, patterns
- **Detailed Risk Factors**: Specific, actionable risk indicators
- **Compliance Mapping**: AML/sanctions screening results
- **Pattern Detection**: Structuring, layering, and velocity analysis

## Usage

### Starting the System

1. **Backend** (from `/backend` directory):
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Frontend** (from project root):
   ```bash
   pnpm dev
   ```

### API Examples

```bash
# Get 20 synthetic transactions with 40% high-risk
curl "http://localhost:8000/api/transactions/flagged?count=20"

# Get transactions filtered by risk level
curl "http://localhost:8000/api/transactions/flagged?risk_indicator=High"

# Get AI analysis for a transaction
curl "http://localhost:8000/api/analysis/TXN-12345678"
```

### Frontend Features

- **Dynamic Transaction List**: Loads synthetic data from backend
- **Search and Filtering**: Filter by transaction ID, risk level, status
- **Transaction Details**: View complete transaction and customer information
- **AI Analysis**: Display risk scores, factors, and recommendations
- **Status Management**: Update transaction status (flagged/reviewed/dismissed)

## Benefits Over Static Mock Data

1. **Variety**: Each request generates different, realistic transactions
2. **Volume**: Can generate large datasets for testing scalability
3. **Realism**: Data patterns match real-world financial transactions
4. **Testing**: Better validation of agent logic with diverse scenarios
5. **Development**: More realistic development and demo experience

## Next Steps

1. **Database Integration**: Store generated transactions for persistence
2. **Historical Patterns**: Generate customer transaction history
3. **Advanced Scenarios**: Specific money laundering patterns (structuring, smurfing)
4. **Bulk Generation**: API endpoints for generating large datasets
5. **Export Functionality**: CSV/JSON export of synthetic data for analysis

## Technical Notes

- Uses Python Faker library for realistic data generation
- Weighted random selections for realistic distribution
- Proper TypeScript types maintained in frontend
- Error handling and fallback mechanisms in place
- CORS configured for frontend-backend communication
- RESTful API design following best practices

The synthetic data generator provides a robust foundation for testing and demonstrating the financial crime monitoring system with realistic, diverse transaction data.
