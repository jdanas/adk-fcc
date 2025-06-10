#!/bin/bash

# Financial Crime Monitoring Backend Startup Script
# Copyright 2025 Financial Crime Monitoring

echo "🏦 Starting Financial Crime Monitoring Backend..."

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check for environment variables
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration before proceeding."
    echo "🔑 You'll need to set your GOOGLE_API_KEY at minimum."
    exit 1
fi

# Start the FastAPI server
echo "🚀 Starting FastAPI server..."
python main.py
