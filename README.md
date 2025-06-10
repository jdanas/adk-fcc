# Financial Crime Monitoring System - Bank of Singapore Prototype

A comprehensive AI-powered financial crime detection and monitoring system built with Google ADK agents, featuring synthetic transaction data generation and real-time risk assessment for Singapore banking operations.

## 🏦 Overview

This system is specifically designed as a prototype for **Bank of Singapore**, providing intelligent financial crime monitoring with:

- **AI-Powered Analysis**: Multi-agent system using Google ADK for sophisticated transaction analysis
- **Synthetic Data Generation**: Realistic SGD transaction data using Python Faker
- **Real-time Monitoring**: Live transaction risk assessment and flagging
- **Singapore Context**: All amounts in SGD, calibrated for Singapore banking market
- **Modern Web Interface**: React + TypeScript frontend with shadcn/ui components

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│  React Frontend │ ◄─────────────────► │  FastAPI Backend │
│  (TypeScript)   │                     │   (Python)       │
│                 │                     │                  │
│ • Dashboard     │                     │ • ADK Agents     │
│ • Search/Filter │                     │ • Data Generator │
│ • Transaction   │                     │ • Risk Analysis  │
│   Details       │                     │ • API Endpoints  │
│ • AI Analysis   │                     │                  │
└─────────────────┘                     └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+) with **pnpm**
- **Python** (v3.11+) 
- **uv** (Python package manager)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd adk-fcc
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
uv pip install -r requirements.txt

# Start the FastAPI server
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate back to project root
cd ..

# Install frontend dependencies
pnpm install

# Start the development server
pnpm dev
```

The frontend will be available at: `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use)

### 4. Access the Application

Open your browser and navigate to the frontend URL. The system will automatically connect to the backend and start displaying synthetic transaction data.

## 📁 Project Structure

```
adk-fcc/
├── backend/                    # Python FastAPI backend
│   ├── agents/                # Google ADK agents
│   │   ├── __init__.py
│   │   ├── financial_crime_coordinator.py
│   │   ├── prompts.py
│   │   └── sub_agents/        # Specialized sub-agents
│   │       ├── compliance_checker.py
│   │       ├── pattern_detector.py
│   │       ├── risk_assessor.py
│   │       └── transaction_analyzer.py
│   ├── data_generator.py      # Synthetic data generation
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── start.sh             # Startup script
├── src/                      # React frontend
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── TransactionTable.tsx
│   │   ├── TransactionDetails.tsx
│   │   ├── AIAnalysis.tsx
│   │   └── SearchBar.tsx
│   ├── services/           
│   │   └── api.ts          # API service layer
│   ├── types/
│   │   └── transaction.ts  # TypeScript interfaces
│   └── hooks/              # Custom React hooks
├── package.json            # Frontend dependencies
└── README.md              # This file
```

## 🎯 Key Features

### Backend Features

- **🤖 Multi-Agent AI System**: Coordinated agents for comprehensive analysis
  - Transaction Analyzer
  - Risk Assessor  
  - Compliance Checker
  - Pattern Detector

- **🎲 Synthetic Data Generation**: Realistic SGD transactions with:
  - Risk-based distribution (30% high-risk, 70% normal)
  - Geographic diversity (32+ countries)
  - Realistic amount ranges for Singapore market
  - Customer profiles and merchant information

- **🔍 Risk Analysis**: AI-generated analysis including:
  - Multi-factor risk scoring
  - Detailed risk factors and reasoning
  - Compliance screening results
  - Pattern detection indicators

### Frontend Features

- **📊 Interactive Dashboard**: Real-time transaction monitoring
- **🔍 Advanced Search & Filtering**: Filter by risk level, status, transaction ID
- **📋 Transaction Details**: Comprehensive transaction information
- **🧠 AI Analysis Viewer**: Detailed risk assessment results
- **⚡ Real-time Updates**: Live data refresh and status updates

## 🏃‍♂️ Usage

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/transactions/flagged` | GET | Get synthetic transactions |
| `/api/transactions/{id}` | GET | Get specific transaction |
| `/api/analysis/{id}` | GET | Get AI analysis for transaction |
| `/api/transactions/{id}/status` | PATCH | Update transaction status |
| `/api/agents/status` | GET | Get agent status |

### Example API Calls

```bash
# Get 10 synthetic transactions
curl "http://localhost:8000/api/transactions/flagged?count=10"

# Get high-risk transactions only
curl "http://localhost:8000/api/transactions/flagged?risk_indicator=High"

# Get AI analysis for a transaction
curl "http://localhost:8000/api/analysis/TXN-12345678"

# Update transaction status
curl -X PATCH "http://localhost:8000/api/transactions/TXN-12345678/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```

### SGD Amount Ranges

The system generates realistic SGD amounts appropriate for Singapore banking:

| Transaction Type | Normal Range | High-Risk Range |
|-----------------|--------------|-----------------|
| **Transfers** | SGD 500 - 50,000 | SGD 50,000 - 2,000,000 |
| **Deposits** | SGD 200 - 25,000 | SGD 25,000 - 800,000 |
| **Withdrawals** | SGD 100 - 15,000 | SGD 15,000 - 200,000 |
| **Payments** | SGD 50 - 5,000 | SGD 5,000 - 150,000 |

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run data generator test
uv run python data_generator.py

# Start with auto-reload for development
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
# Start with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build
```

### Environment Configuration

Create a `.env` file in the `backend/` directory based on `.env.example`:

```bash
cp backend/.env.example backend/.env
```

## 🧪 Testing

### Test Backend

```bash
cd backend

# Test data generation
uv run python data_generator.py

# Test API endpoints
curl http://localhost:8000/health
curl "http://localhost:8000/api/transactions/flagged?count=5"
```

### Test Frontend

```bash
# Install dependencies and start
pnpm install
pnpm dev

# Open browser to http://localhost:5173
```

## 🚢 Deployment

### Backend Deployment

```bash
cd backend

# Install production dependencies
uv pip install -r requirements.txt

# Start production server
uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy dist/ folder to your hosting service
```

## 🔧 Configuration

### Backend Configuration

- **Port**: Default 8000 (configurable in `main.py`)
- **CORS**: Configured for localhost:5173, localhost:3000
- **Data Generation**: Configurable transaction counts and risk percentages

### Frontend Configuration

- **API Base URL**: `http://localhost:8000/api` (configurable in `src/services/api.ts`)
- **Timeout**: 15 seconds for API calls
- **Fallback Data**: Available when backend is unreachable

## 📚 Additional Documentation

- **[Synthetic Data Implementation](SYNTHETIC_DATA_IMPLEMENTATION.md)**: Detailed guide on data generation
- **Backend API Documentation**: Available at `http://localhost:8000/docs` when running
- **Component Documentation**: See individual component files in `src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🏦 Bank of Singapore Context

This prototype is specifically designed for Bank of Singapore with:

- **SGD Currency**: All transactions in Singapore Dollar
- **Local Market Calibration**: Amount ranges appropriate for Singapore banking
- **Regulatory Alignment**: Risk factors aligned with MAS (Monetary Authority of Singapore) guidelines
- **Regional Risk Assessment**: Geographic risk categories relevant to Singapore's position

---

**Built with ❤️ for Bank of Singapore**

For support or questions, please contact the development team.
