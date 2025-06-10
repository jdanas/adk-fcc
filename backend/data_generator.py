"""Synthetic transaction data generator for financial crime monitoring."""

import random
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from faker import Faker

# Initialize Faker
fake = Faker()

# Transaction types with weighted probabilities
TRANSACTION_TYPES = ['transfer', 'deposit', 'withdrawal', 'payment']
TRANSACTION_WEIGHTS = [0.35, 0.30, 0.20, 0.15]  # More transfers and deposits

# Risk indicators with weighted probabilities
RISK_INDICATORS = ['Normal', 'High']
RISK_WEIGHTS = [0.7, 0.3]  # 70% normal, 30% high-risk

# Country risk categories
LOW_RISK_COUNTRIES = [
    'USA', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 
    'New Zealand', 'Sweden', 'Norway', 'Denmark', 'Finland'
]

MEDIUM_RISK_COUNTRIES = [
    'Mexico', 'Brazil', 'India', 'China', 'South Africa', 'Turkey', 
    'Saudi Arabia', 'UAE', 'Thailand', 'Malaysia'
]

HIGH_RISK_COUNTRIES = [
    'Russia', 'Belarus', 'North Korea', 'Iran', 'Afghanistan', 'Syria', 
    'Venezuela', 'Cayman Islands', 'Panama', 'Cyprus'
]

# For Bank of Singapore prototype - using SGD as single currency
DEFAULT_CURRENCY = 'SGD'

# Status options with weighted probabilities
STATUS_OPTIONS = ['flagged', 'reviewed', 'dismissed']
STATUS_WEIGHTS = [0.6, 0.3, 0.1]  # 60% flagged, 30% reviewed, 10% dismissed

# Account types with weighted probabilities
ACCOUNT_TYPES = ['Personal', 'Business', 'Private Banking', 'Corporate']
ACCOUNT_WEIGHTS = [0.6, 0.25, 0.1, 0.05]

# Risk profiles with weighted probabilities
RISK_PROFILES = ['Low', 'Medium', 'High']
RISK_PROFILE_WEIGHTS = [0.5, 0.3, 0.2]

# Merchant categories
MERCHANT_CATEGORIES = [
    'Retail', 'Technology', 'Financial Services', 'Healthcare', 'Travel',
    'Entertainment', 'Manufacturing', 'Energy', 'Construction', 'Telecommunications',
    'Real Estate', 'Hospitality', 'Mining', 'Logistics', 'Gambling'
]


def generate_transaction(
    country: Optional[str] = None, 
    risk_level: Optional[str] = None,
    transaction_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generate a synthetic transaction with realistic attributes.
    
    Args:
        country: Optional specification of transaction country
        risk_level: Optional specification of risk level ('Normal' or 'High')
        transaction_type: Optional specification of transaction type
    
    Returns:
        A dictionary containing transaction data
    """
    # Determine the risk level if not specified
    if not risk_level:
        risk_level = random.choices(RISK_INDICATORS, RISK_WEIGHTS)[0]
    
    # Select country based on risk level if not specified
    if not country:
        if risk_level == 'High':
            # High-risk transactions more likely to involve high-risk countries
            country_list = random.choices([
                HIGH_RISK_COUNTRIES,
                MEDIUM_RISK_COUNTRIES,
                LOW_RISK_COUNTRIES
            ], [0.6, 0.3, 0.1])[0]
        else:
            # Normal-risk transactions more likely to involve low-risk countries
            country_list = random.choices([
                LOW_RISK_COUNTRIES,
                MEDIUM_RISK_COUNTRIES,
                HIGH_RISK_COUNTRIES
            ], [0.7, 0.25, 0.05])[0]
        
        country = random.choice(country_list)
    
    # Use SGD as the single currency for Bank of Singapore prototype
    currency = DEFAULT_CURRENCY
    
    # Determine transaction type if not specified
    if not transaction_type:
        transaction_type = random.choices(TRANSACTION_TYPES, TRANSACTION_WEIGHTS)[0]
    
    # Generate realistic transaction amounts in SGD based on type and risk
    if transaction_type == 'transfer':
        if risk_level == 'High':
            # Large transfers for high-risk (SGD 50,000 - 2,000,000)
            amount = round(random.uniform(50000, 2000000), 2)
        else:
            # Normal transfers (SGD 500 - 50,000)
            amount = round(random.uniform(500, 50000), 2)
    elif transaction_type == 'deposit':
        if risk_level == 'High':
            # Large deposits for high-risk (SGD 25,000 - 800,000)
            amount = round(random.uniform(25000, 800000), 2)
        else:
            # Normal deposits (SGD 200 - 25,000)
            amount = round(random.uniform(200, 25000), 2)
    elif transaction_type == 'withdrawal':
        if risk_level == 'High':
            # Large withdrawals for high-risk (SGD 15,000 - 200,000)
            amount = round(random.uniform(15000, 200000), 2)
        else:
            # Normal withdrawals (SGD 100 - 15,000)
            amount = round(random.uniform(100, 15000), 2)
    else:  # payment
        if risk_level == 'High':
            # High-risk payments (SGD 5,000 - 150,000)
            amount = round(random.uniform(5000, 150000), 2)
        else:
            # Normal payments (SGD 50 - 5,000)
            amount = round(random.uniform(50, 5000), 2)
    
    # Transaction ID
    transaction_id = f"TXN-{str(uuid.uuid4())[:8].upper()}"
    
    # Customer ID
    customer_id = f"CUST-{str(uuid.uuid4())[:8].upper()}"
    
    # Generate timestamp within the last 30 days
    days_ago = random.randint(0, 30)
    hours_ago = random.randint(0, 23)
    minutes_ago = random.randint(0, 59)
    seconds_ago = random.randint(0, 59)
    
    timestamp = (datetime.now() - timedelta(
        days=days_ago,
        hours=hours_ago,
        minutes=minutes_ago,
        seconds=seconds_ago
    )).isoformat() + "Z"
    
    # Status (biased towards "flagged" for high-risk)
    if risk_level == 'High':
        status = random.choices(STATUS_OPTIONS, [0.8, 0.15, 0.05])[0]
    else:
        status = random.choices(STATUS_OPTIONS, [0.3, 0.5, 0.2])[0]
    
    # Customer info
    customer_name = fake.name()
    account_type = random.choices(ACCOUNT_TYPES, ACCOUNT_WEIGHTS)[0]
    
    # Risk profile (correlated with transaction risk level)
    if risk_level == 'High':
        risk_profile = random.choices(RISK_PROFILES, [0.1, 0.3, 0.6])[0]
    else:
        risk_profile = random.choices(RISK_PROFILES, [0.6, 0.3, 0.1])[0]
    
    customer_info = {
        "name": customer_name,
        "accountType": account_type,
        "riskProfile": risk_profile
    }
    
    # Merchant info (only for payments and some transfers)
    merchant_info = None
    if transaction_type == 'payment' or (transaction_type == 'transfer' and random.random() < 0.3):
        merchant_category = random.choice(MERCHANT_CATEGORIES)
        merchant_name = (
            fake.company() if merchant_category != 'Financial Services'
            else fake.company() + " " + random.choice(["Bank", "Financial", "Capital", "Investments", "Trust"])
        )
        
        merchant_info = {
            "name": merchant_name,
            "category": merchant_category
        }
    
    # Description
    description_components = []
    if transaction_type == 'transfer':
        description_components.append(random.choice([
            "Wire transfer", "ACH transfer", "International transfer", 
            "Fund transfer", "Cross-border transfer"
        ]))
        if risk_level == 'High' and random.random() < 0.3:
            description_components.append(random.choice([
                "to high-risk jurisdiction",
                "- unusual amount",
                "with incomplete documentation",
                "flagged by monitoring system"
            ]))
    elif transaction_type == 'deposit':
        description_components.append(random.choice([
            "Cash deposit", "Check deposit", "Mobile deposit", 
            "ATM deposit", "Batch deposit"
        ]))
        if risk_level == 'High' and random.random() < 0.3:
            description_components.append(random.choice([
                "- multiple small amounts",
                "- structured transaction",
                "with currency exchange",
                "from unverified source"
            ]))
    elif transaction_type == 'withdrawal':
        description_components.append(random.choice([
            "ATM withdrawal", "Bank withdrawal", "Cash withdrawal", 
            "Teller withdrawal", "International withdrawal"
        ]))
        if risk_level == 'High' and random.random() < 0.3:
            description_components.append(random.choice([
                "- above limit",
                "- multiple locations",
                "in high-risk location",
                "- unusual pattern"
            ]))
    else:  # payment
        description_components.append(random.choice([
            "Online payment", "Direct payment", "Recurring payment", 
            "Bill payment", "Retail payment", "International payment"
        ]))
        if merchant_info:
            description_components.append(f"to {merchant_info['name']}")
        if risk_level == 'High' and random.random() < 0.3:
            description_components.append(random.choice([
                "- unusual merchant",
                "- high-risk vendor",
                "- suspicious pattern",
                "flagged for review"
            ]))
    
    description = " ".join(description_components)
    
    # Create the transaction
    transaction = {
        "id": transaction_id,
        "customerId": customer_id,
        "amount": amount,
        "currency": currency,
        "country": country,
        "transactionType": transaction_type,
        "riskIndicator": risk_level,
        "timestamp": timestamp,
        "status": status,
        "description": description,
        "customerInfo": customer_info
    }
    
    # Add merchant info if available
    if merchant_info:
        transaction["merchantInfo"] = merchant_info
    
    return transaction


def generate_transactions(count: int = 20, high_risk_percentage: float = 0.3) -> List[Dict[str, Any]]:
    """
    Generate a batch of synthetic transactions.
    
    Args:
        count: Number of transactions to generate
        high_risk_percentage: Percentage of transactions that should be high-risk
    
    Returns:
        List of transaction dictionaries
    """
    transactions = []
    high_risk_count = int(count * high_risk_percentage)
    normal_count = count - high_risk_count
    
    # Generate high-risk transactions
    for _ in range(high_risk_count):
        transactions.append(generate_transaction(risk_level="High"))
    
    # Generate normal transactions
    for _ in range(normal_count):
        transactions.append(generate_transaction(risk_level="Normal"))
    
    # Sort by timestamp (most recent first)
    transactions.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return transactions


def generate_ai_analysis(transaction: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate synthetic AI analysis for a transaction.
    
    Args:
        transaction: The transaction to analyze
    
    Returns:
        Dictionary containing AI analysis
    """
    risk_level = transaction["riskIndicator"]
    transaction_type = transaction["transactionType"]
    amount = transaction["amount"]
    country = transaction["country"]
    currency = transaction["currency"]
    customer_profile = transaction.get("customerInfo", {}).get("riskProfile", "Medium")
    
    # Determine risk score based on multiple factors
    base_score = 50
    
    # Risk indicator contribution
    if risk_level == "High":
        base_score += random.randint(20, 35)
    else:
        base_score += random.randint(-20, 5)
    
    # Country risk contribution
    if country in HIGH_RISK_COUNTRIES:
        base_score += random.randint(10, 20)
    elif country in MEDIUM_RISK_COUNTRIES:
        base_score += random.randint(5, 10)
    else:
        base_score += random.randint(-10, 5)
    
    # Amount contribution (relative to transaction type) - SGD thresholds
    amount_thresholds = {
        "transfer": 50000,    # SGD 50,000
        "deposit": 25000,     # SGD 25,000
        "withdrawal": 15000,  # SGD 15,000
        "payment": 5000       # SGD 5,000
    }
    
    if amount > amount_thresholds[transaction_type] * 5:
        base_score += random.randint(15, 25)
    elif amount > amount_thresholds[transaction_type]:
        base_score += random.randint(5, 15)
    
    # Customer profile contribution
    if customer_profile == "High":
        base_score += random.randint(5, 15)
    elif customer_profile == "Low":
        base_score -= random.randint(5, 15)
    
    # Cap the score between 5 and 95
    risk_score = max(5, min(95, base_score))
    
    # Determine risk assessment text
    if risk_score >= 80:
        risk_assessment = f"Very high risk - {transaction_type} in {country}"
        recommended_action = "Escalate"
        if risk_level == "High":
            risk_assessment += " from high-risk entity"
    elif risk_score >= 60:
        risk_assessment = f"High risk {transaction_type}"
        recommended_action = "Escalate"
    elif risk_score >= 40:
        risk_assessment = f"Medium risk {transaction_type} requiring review"
        recommended_action = "Monitor"
    elif risk_score >= 20:
        risk_assessment = f"Low risk transaction within normal parameters"
        recommended_action = "Monitor"
    else:
        risk_assessment = f"Very low risk {transaction_type}"
        recommended_action = "Dismiss"
    
    # Generate risk factors
    factors = []
    
    # Amount factor
    amount_str = f"SGD {amount:,.2f}"
    if amount > amount_thresholds[transaction_type] * 5:
        factors.append(f"Very large {transaction_type} amount ({amount_str})")
    elif amount > amount_thresholds[transaction_type]:
        factors.append(f"Large {transaction_type} amount ({amount_str})")
    else:
        factors.append(f"Standard {transaction_type} amount ({amount_str})")
    
    # Country factor
    if country in HIGH_RISK_COUNTRIES:
        factors.append(f"High-risk jurisdiction ({country})")
    elif country in MEDIUM_RISK_COUNTRIES:
        factors.append(f"Medium-risk jurisdiction ({country})")
    
    # Customer profile factor
    if customer_profile == "High":
        factors.append("Customer has high risk profile")
    elif customer_profile == "Medium":
        factors.append("Customer has medium risk profile")
    
    # Transaction pattern factor (random)
    if risk_score > 60:
        factors.append(random.choice([
            "Transaction outside normal pattern",
            "Unusual timing or frequency",
            "Suspicious transaction structure",
            "Potential structuring behavior"
        ]))
    else:
        factors.append(random.choice([
            "Transaction matches customer pattern",
            "Normal transaction frequency",
            "Expected transaction behavior"
        ]))
    
    # Add merchant factor if present
    if "merchantInfo" in transaction:
        merchant_name = transaction["merchantInfo"]["name"]
        if risk_score > 60:
            factors.append(f"Unusual merchant ({merchant_name})")
        else:
            factors.append(f"Established merchant ({merchant_name})")
    
    # Add AML-specific factor for high risk
    if risk_score > 70:
        factors.append(random.choice([
            "Multiple money laundering indicators",
            "Potential sanctions evasion pattern",
            "Transaction layering indicators",
            "Placement phase red flags"
        ]))
    
    # Generate detailed reasoning
    reasoning_parts = []
    
    # Amount reasoning
    if risk_score > 60:
        reasoning_parts.append(
            f"This {transaction_type} of {amount_str} is significantly larger than typical for this transaction type."
        )
    else:
        reasoning_parts.append(
            f"The {transaction_type} amount of {amount_str} is within expected parameters."
        )
    
    # Country reasoning
    if country in HIGH_RISK_COUNTRIES:
        reasoning_parts.append(
            f"The transaction involves {country}, which is classified as a high-risk jurisdiction with elevated financial crime concerns."
        )
    elif country in MEDIUM_RISK_COUNTRIES:
        reasoning_parts.append(
            f"The transaction involves {country}, which has moderate financial crime risk factors."
        )
    else:
        reasoning_parts.append(
            f"The transaction occurs in {country}, which is a lower-risk jurisdiction."
        )
    
    # Pattern reasoning
    if risk_score > 60:
        reasoning_parts.append(
            "The transaction exhibits unusual characteristics that deviate from the customer's established patterns."
        )
        if risk_score > 80:
            reasoning_parts.append(
                "Multiple red flags indicate potential layering or structuring activity that warrants immediate investigation."
            )
    else:
        reasoning_parts.append(
            "The transaction is consistent with the customer's historical activity patterns."
        )
    
    # Customer profile reasoning
    if customer_profile == "High":
        reasoning_parts.append(
            "The customer's existing high-risk profile elevates the overall transaction risk."
        )
    
    # Combine reasoning
    reasoning = " ".join(reasoning_parts)
    
    # Generate detailed analysis with subsections
    # This would be used in a real system but is simplified here
    detailed_analysis = {
        "transaction_analysis": {
            "amount_risk": f"{'High' if amount > amount_thresholds[transaction_type] else 'Normal'} - {amount_str}",
            "timing_risk": random.choice(["Low", "Medium", "High"]),
            "frequency_risk": random.choice(["Low", "Medium", "High"])
        },
        "risk_assessment": {
            "customer_risk": customer_profile,
            "geographic_risk": "High" if country in HIGH_RISK_COUNTRIES else "Medium" if country in MEDIUM_RISK_COUNTRIES else "Low",
            "behavioral_risk": random.choice(["Low", "Medium", "High"])
        },
        "compliance_check": {
            "sanctions_screening": "Match found" if risk_score > 85 and random.random() < 0.3 else "Clear",
            "aml_requirements": "Requires SAR filing" if risk_score > 70 else "Standard monitoring",
            "regulatory_status": random.choice([
                "Compliant with current regulations", 
                "Requires additional documentation",
                "Under review"
            ])
        },
        "pattern_detection": {
            "structuring_indicators": "Detected" if risk_score > 80 and random.random() < 0.4 else "None detected",
            "layering_patterns": "Detected" if risk_score > 85 and random.random() < 0.3 else "None detected",
            "velocity_concerns": random.choice([
                "Low - normal transaction velocity",
                "Moderate - increased transaction frequency",
                "High - unusual transaction velocity"
            ])
        }
    }
    
    # Generate timestamp a few minutes after the transaction
    transaction_timestamp = datetime.fromisoformat(transaction["timestamp"].replace("Z", "+00:00"))
    analysis_delay = timedelta(minutes=random.randint(1, 5))
    generated_at = (transaction_timestamp + analysis_delay).isoformat() + "Z"
    
    # Calculate confidence (higher for more extreme risk scores)
    if risk_score > 80 or risk_score < 20:
        confidence = random.randint(85, 98)
    else:
        confidence = random.randint(70, 90)
    
    return {
        "transactionId": transaction["id"],
        "riskScore": risk_score,
        "riskAssessment": risk_assessment,
        "recommendedAction": recommended_action,
        "confidence": confidence,
        "factors": factors,
        "reasoning": reasoning,
        "generatedAt": generated_at,
        "agentAnalysis": detailed_analysis
    }


if __name__ == "__main__":
    # Test the generator
    transactions = generate_transactions(5)
    for tx in transactions:
        print(f"Transaction: {tx['id']}, Risk: {tx['riskIndicator']}, Amount: {tx['amount']} {tx['currency']}")
        analysis = generate_ai_analysis(tx)
        print(f"Risk Score: {analysis['riskScore']}, Action: {analysis['recommendedAction']}")
        print("---")
