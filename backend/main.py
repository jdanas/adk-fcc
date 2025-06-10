# Copyright 2025 Financial Crime Monitoring
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""FastAPI backend for Financial Crime Monitoring with Google ADK agents."""

import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Import the main agent
from agents import root_agent

# Import synthetic data generator
from data_generator import generate_transactions, generate_ai_analysis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple in-memory store for demo purposes
# In production, this would be a database
transaction_store = {}
analysis_store = {}

app = FastAPI(
    title="Financial Crime Monitoring API",
    description="AI-powered financial crime detection using Google ADK agents",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class TransactionData(BaseModel):
    id: str
    customerId: str
    amount: float
    currency: str
    country: str
    transactionType: str
    riskIndicator: str
    timestamp: str
    description: str
    merchantInfo: Dict[str, Any] = Field(default_factory=dict)
    customerInfo: Dict[str, Any] = Field(default_factory=dict)

class AnalysisRequest(BaseModel):
    transaction: TransactionData
    context: Dict[str, Any] = Field(default_factory=dict)
    options: Dict[str, Any] = Field(default_factory=dict)

class AnalysisResponse(BaseModel):
    transactionId: str
    riskScore: float
    riskAssessment: str
    recommendedAction: str
    confidence: float
    factors: List[str]
    reasoning: str
    generatedAt: str
    agentAnalysis: Dict[str, Any]

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_transaction(request: AnalysisRequest) -> AnalysisResponse:
    """
    Analyze a transaction using the financial crime monitoring agents.
    
    Args:
        request: Transaction data and analysis options
        
    Returns:
        Comprehensive analysis with risk assessment and recommendations
    """
    try:
        logger.info(f"Analyzing transaction {request.transaction.id}")
        
        # Prepare the transaction data for agent analysis
        transaction_context = {
            "transaction": request.transaction.dict(),
            "context": request.context,
            "options": request.options
        }
        
        # Format the input for the agent
        analysis_prompt = f"""
        Analyze the following financial transaction for potential money laundering, 
        compliance violations, and suspicious activities:
        
        Transaction Details:
        - ID: {request.transaction.id}
        - Customer ID: {request.transaction.customerId}
        - Amount: {request.transaction.amount} {request.transaction.currency}
        - Country: {request.transaction.country}
        - Type: {request.transaction.transactionType}
        - Current Risk Indicator: {request.transaction.riskIndicator}
        - Timestamp: {request.transaction.timestamp}
        - Description: {request.transaction.description}
        
        Customer Information:
        {request.transaction.customerInfo}
        
        Merchant Information:
        {request.transaction.merchantInfo}
        
        Additional Context:
        {request.context}
        
        Please provide a comprehensive analysis including risk scoring, 
        recommended actions, and detailed reasoning.
        """
        
        # Execute the agent analysis
        # Note: This is a simplified version - in practice you'd use the ADK execution engine
        result = await run_agent_analysis(root_agent, analysis_prompt, transaction_context)
        
        # Parse and structure the response
        analysis_response = AnalysisResponse(
            transactionId=request.transaction.id,
            riskScore=result.get("risk_score", 0.0),
            riskAssessment=result.get("risk_assessment", "Unknown"),
            recommendedAction=result.get("recommended_action", "Monitor"),
            confidence=result.get("confidence", 0.0),
            factors=result.get("risk_factors", []),
            reasoning=result.get("reasoning", ""),
            generatedAt=datetime.now().isoformat(),
            agentAnalysis=result.get("detailed_analysis", {})
        )
        
        logger.info(f"Analysis completed for transaction {request.transaction.id}")
        return analysis_response
        
    except Exception as e:
        logger.error(f"Error analyzing transaction {request.transaction.id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

async def run_agent_analysis(agent, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Execute the agent analysis.
    
    Note: This is a simplified implementation. In a full ADK setup, you would use:
    - The ADK execution engine
    - Proper agent orchestration
    - Tool integration
    - Error handling and retries
    """
    try:
        # For now, return a mock response structure
        # In production, this would execute the actual agent workflow
        
        # This is where you would integrate with the ADK execution engine:
        # from google.adk.engine import Engine
        # engine = Engine()
        # result = await engine.run(agent, prompt, context)
        
        # Mock response for demonstration
        mock_result = {
            "risk_score": 75.0,
            "risk_assessment": "High",
            "recommended_action": "Escalate",
            "confidence": 0.85,
            "risk_factors": [
                "Large transaction amount",
                "Cross-border transfer",
                "High-risk jurisdiction",
                "Unusual timing pattern"
            ],
            "reasoning": "This transaction exhibits multiple high-risk characteristics including a large amount ($25,000), cross-border nature, and timing outside normal business hours. The destination country has elevated money laundering risk, and the transaction pattern deviates from the customer's historical behavior.",
            "detailed_analysis": {
                "transaction_analysis": {
                    "amount_risk": "High - amount exceeds normal thresholds",
                    "timing_risk": "Medium - outside business hours",
                    "frequency_risk": "Low - within normal patterns"
                },
                "risk_assessment": {
                    "customer_risk": "Medium - established customer with good history",
                    "geographic_risk": "High - destination country on watch list",
                    "behavioral_risk": "Medium - slight deviation from normal patterns"
                },
                "compliance_check": {
                    "sanctions_screening": "Clear - no matches found",
                    "aml_requirements": "Requires SAR filing",
                    "regulatory_status": "Compliant with current regulations"
                },
                "pattern_detection": {
                    "structuring_indicators": "None detected",
                    "layering_patterns": "None detected",
                    "velocity_concerns": "Moderate - increased transaction frequency"
                }
            }
        }
        
        return mock_result
        
    except Exception as e:
        logger.error(f"Agent execution failed: {str(e)}")
        raise

@app.get("/api/agents/status")
async def get_agents_status():
    """Get the status of all financial crime monitoring agents."""
    return {
        "coordinator": {
            "name": "financial_crime_coordinator",
            "status": "active",
            "model": "gemini-2.0-flash"
        },
        "sub_agents": [
            {
                "name": "transaction_analyzer",
                "status": "active",
                "specialization": "Transaction pattern analysis"
            },
            {
                "name": "risk_assessor", 
                "status": "active",
                "specialization": "Risk factor evaluation"
            },
            {
                "name": "compliance_checker",
                "status": "active", 
                "specialization": "Regulatory compliance verification"
            },
            {
                "name": "pattern_detector",
                "status": "active",
                "specialization": "Suspicious pattern detection"
            }
        ]
    }

@app.post("/api/generate/synthetic-data")
async def generate_synthetic_data(
    count: int = Query(1, ge=1, le=100),
    include_analysis: bool = Query(False)
):
    """
    Generate synthetic transaction data for testing.
    
    Args:
        count: Number of transactions to generate
        include_analysis: Whether to include AI-generated analysis for each transaction
        
    Returns:
        List of synthetic transactions (and analysis if requested)
    """
    try:
        logger.info(f"Generating {count} synthetic transactions")
        transactions = generate_transactions(count)
        
        if include_analysis:
            logger.info("Generating AI analysis for synthetic transactions")
            analysis = generate_ai_analysis(transactions)
            return {"transactions": transactions, "analysis": analysis}
        
        return {"transactions": transactions}
    
    except Exception as e:
        logger.error(f"Error generating synthetic data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Data generation failed: {str(e)}")

@app.get("/api/transactions/flagged")
async def get_flagged_transactions(
    count: int = 20,
    risk_indicator: str = None,
    status: str = None,
    transaction_id: str = None
):
    """
    Get synthetic flagged transactions using the data generator.
    
    Args:
        count: Number of transactions to generate (default 20)
        risk_indicator: Filter by risk indicator ('High', 'Normal', or None for all)
        status: Filter by status ('flagged', 'reviewed', 'dismissed', or None for all)
        transaction_id: Filter by transaction ID (partial match)
    
    Returns:
        List of synthetic transactions
    """
    try:
        # Generate synthetic transactions with higher proportion of high-risk
        transactions = generate_transactions(count=count, high_risk_percentage=0.4)
        
        # Store transactions in memory for consistent retrieval
        for transaction in transactions:
            transaction_store[transaction['id']] = transaction
        
        # Apply filters
        if risk_indicator and risk_indicator != 'All':
            transactions = [t for t in transactions if t['riskIndicator'] == risk_indicator]
        
        if status and status != 'All':
            transactions = [t for t in transactions if t['status'] == status]
        
        if transaction_id:
            transactions = [t for t in transactions if transaction_id.lower() in t['id'].lower()]
        
        logger.info(f"Generated and stored {len(transactions)} synthetic transactions")
        return transactions
        
    except Exception as e:
        logger.error(f"Error generating transactions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate transactions: {str(e)}")

@app.get("/api/transactions/{transaction_id}")
async def get_transaction_by_id(transaction_id: str):
    """
    Get a specific transaction by ID from the in-memory store.
    
    Args:
        transaction_id: The transaction ID to retrieve
    
    Returns:
        Transaction data or 404 if not found
    """
    try:
        # First try to get from store
        if transaction_id in transaction_store:
            logger.info(f"Retrieved transaction {transaction_id} from store")
            return transaction_store[transaction_id]
        
        # If not found, generate a new one (for demo purposes)
        transaction = generate_transactions(count=1)[0]
        transaction['id'] = transaction_id
        
        # Store it for future use
        transaction_store[transaction_id] = transaction
        
        logger.info(f"Generated and stored new transaction {transaction_id}")
        return transaction
        
    except Exception as e:
        logger.error(f"Error retrieving transaction {transaction_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Transaction not found")

@app.get("/api/analysis/{transaction_id}")
async def get_ai_analysis_by_id(transaction_id: str):
    """
    Get AI analysis for a specific transaction using the stored transaction data.
    
    Args:
        transaction_id: The transaction ID to analyze
    
    Returns:
        AI analysis data that matches the stored transaction
    """
    try:
        # Check if we already have analysis cached
        if transaction_id in analysis_store:
            logger.info(f"Retrieved cached analysis for transaction {transaction_id}")
            return analysis_store[transaction_id]
        
        # Get the transaction data (either from store or generate new)
        if transaction_id in transaction_store:
            transaction = transaction_store[transaction_id]
            logger.info(f"Using stored transaction data for analysis {transaction_id}")
        else:
            # If transaction not in store, get it first (this will store it)
            transaction = await get_transaction_by_id(transaction_id)
        
        # Generate AI analysis based on the actual transaction data
        analysis = generate_ai_analysis(transaction)
        
        # Cache the analysis
        analysis_store[transaction_id] = analysis
        
        logger.info(f"Generated and cached AI analysis for transaction {transaction_id}")
        return analysis
        
    except Exception as e:
        logger.error(f"Error generating analysis for transaction {transaction_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate analysis: {str(e)}")

@app.patch("/api/transactions/{transaction_id}/status")
async def update_transaction_status(transaction_id: str, status_update: dict):
    """
    Update the status of a transaction.
    
    Args:
        transaction_id: The transaction ID to update
        status_update: Dictionary containing the new status
    
    Returns:
        Success message
    """
    try:
        new_status = status_update.get("status")
        if new_status not in ["flagged", "reviewed", "dismissed"]:
            raise HTTPException(status_code=400, detail="Invalid status value")
        
        # In a real system, this would update the database
        logger.info(f"Updated transaction {transaction_id} status to {new_status}")
        return {"message": f"Transaction {transaction_id} status updated to {new_status}"}
        
    except Exception as e:
        logger.error(f"Error updating transaction {transaction_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update transaction: {str(e)}")

@app.delete("/api/cache/clear")
async def clear_cache():
    """
    Clear the transaction and analysis cache (for testing purposes).
    
    Returns:
        Success message with cache statistics
    """
    try:
        transaction_count = len(transaction_store)
        analysis_count = len(analysis_store)
        
        transaction_store.clear()
        analysis_store.clear()
        
        logger.info(f"Cleared cache: {transaction_count} transactions, {analysis_count} analyses")
        return {
            "message": "Cache cleared successfully",
            "cleared": {
                "transactions": transaction_count,
                "analyses": analysis_count
            }
        }
        
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
