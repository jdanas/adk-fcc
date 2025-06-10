# Financial Crime Monitoring with Google ADK

This project implements a sophisticated financial crime monitoring system using Google's Agent Development Kit (ADK) with a multi-agent architecture for comprehensive transaction analysis.

## 🏗️ Architecture Overview

The system follows the Google ADK pattern with a coordinator agent managing specialized sub-agents:

### Coordinator Agent
- **Financial Crime Coordinator**: Main orchestrator that synthesizes findings from all sub-agents

### Specialized Sub-Agents
1. **Transaction Analyzer**: Examines transaction patterns, amounts, timing, and frequency
2. **Risk Assessor**: Evaluates risk factors based on customer profiles, geography, and behavior  
3. **Compliance Checker**: Validates against regulatory requirements and sanctions lists
4. **Pattern Detector**: Identifies suspicious patterns and money laundering typologies

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- Google Cloud account with Gemini API access
- Google API key with appropriate permissions

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Run the startup script:**
   ```bash
   ./start.sh
   ```

3. **Configure your environment:**
   - Edit the `.env` file with your Google API key and configuration
   - Set up your Google Cloud project settings

4. **Start the development server:**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

### Manual Installation

If you prefer manual setup:

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your configuration

# Start the server
python main.py
```

## 📚 API Documentation

### Analyze Transaction
```
POST /api/analyze
```

Analyzes a financial transaction for suspicious activities, compliance violations, and money laundering patterns.

**Request Body:**
```json
{
  "transaction": {
    "id": "TXN-001",
    "customerId": "CUST-12345", 
    "amount": 25000,
    "currency": "USD",
    "country": "USA",
    "transactionType": "transfer",
    "riskIndicator": "High",
    "timestamp": "2025-01-15T10:30:00Z",
    "description": "Large international wire transfer",
    "merchantInfo": {
      "name": "Global Finance Corp",
      "category": "Financial Services"
    },
    "customerInfo": {
      "name": "John Smith", 
      "accountType": "Business",
      "riskProfile": "Medium"
    }
  },
  "context": {},
  "options": {}
}
```

**Response:**
```json
{
  "transactionId": "TXN-001",
  "riskScore": 75.0,
  "riskAssessment": "High", 
  "recommendedAction": "Escalate",
  "confidence": 0.85,
  "factors": [
    "Large transaction amount",
    "Cross-border transfer", 
    "High-risk jurisdiction"
  ],
  "reasoning": "Detailed analysis explanation...",
  "generatedAt": "2025-06-10T10:30:00Z",
  "agentAnalysis": {
    "transaction_analysis": {},
    "risk_assessment": {},
    "compliance_check": {},
    "pattern_detection": {}
  }
}
```

### Check Agent Status
```
GET /api/agents/status
```

Returns the status of all agents in the system.

### Health Check
```
GET /health
```

Basic health check endpoint.

## 🤖 Agent Architecture

The system implements the ADK multi-agent pattern:

```python
# Main coordinator with sub-agents
financial_crime_coordinator = LlmAgent(
    name="financial_crime_coordinator",
    model="gemini-2.0-flash",
    description="Comprehensive financial crime monitoring coordinator",
    instruction=COORDINATOR_PROMPT,
    tools=[
        AgentTool(agent=transaction_analyzer_agent),
        AgentTool(agent=risk_assessor_agent), 
        AgentTool(agent=compliance_checker_agent),
        AgentTool(agent=pattern_detector_agent),
    ],
)
```

Each sub-agent specializes in specific aspects of financial crime detection:

- **Structured analysis** of different risk dimensions
- **Specialized prompts** for domain expertise
- **Coordinated execution** through the main agent
- **Comprehensive reporting** with detailed findings

## 🔧 Configuration

Key configuration options in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google API key | Required |
| `GOOGLE_PROJECT_ID` | Google Cloud project ID | Optional |
| `ADK_MODEL` | Gemini model to use | gemini-2.0-flash |
| `RISK_THRESHOLD_HIGH` | High risk score threshold | 70 |
| `SAR_FILING_THRESHOLD` | SAR filing amount threshold | $10,000 |

## 🧪 Testing

Run the test suite:

```bash
pytest tests/
```

Test individual agents:

```bash
python -m pytest tests/test_agents.py
```

## 🔍 Financial Crime Detection Features

### Risk Assessment
- Customer risk profiling
- Geographic risk analysis
- Industry and business model risk
- Behavioral pattern analysis
- Aggregate risk scoring

### Compliance Monitoring
- AML/BSA requirement checking
- Sanctions screening (OFAC, UN, EU)
- CTR/SAR reporting requirements
- KYC compliance verification
- Cross-border reporting rules

### Pattern Detection
- Structuring/smurfing detection
- Layering pattern recognition
- Rapid movement analysis
- Circular transfer detection
- Trade-based laundering indicators

### Transaction Analysis
- Amount-based risk assessment
- Timing and frequency analysis
- Geographic movement tracking
- Account behavior monitoring
- Historical pattern comparison

## 🔒 Security Considerations

- API keys and credentials stored in environment variables
- CORS configuration for frontend integration
- Input validation and sanitization
- Audit logging of all analyses
- Compliance with financial data protection requirements

## 📊 Integration with Frontend

The backend is designed to integrate seamlessly with the React frontend:

```typescript
// Frontend API call example
const analyzeTransaction = async (transaction: Transaction) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction })
  });
  return response.json();
};
```

## 🚀 Deployment

### Local Development
```bash
python main.py
```

### Production Deployment
The system can be deployed on:
- Google Cloud Run
- Vertex AI Agent Engine  
- Docker containers
- Kubernetes clusters

Example Docker deployment:
```dockerfile
FROM python:3.9-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## 📈 Monitoring and Observability

The system includes:
- Structured logging
- Performance metrics
- Agent execution tracking
- Error monitoring and alerts
- Compliance audit trails

## 🤝 Contributing

1. Follow the Google ADK patterns and conventions
2. Ensure comprehensive test coverage
3. Update documentation for new features
4. Follow financial compliance best practices

## 📄 License

Copyright 2025 Financial Crime Monitoring - Licensed under Apache 2.0
