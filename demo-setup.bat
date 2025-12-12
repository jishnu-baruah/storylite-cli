@echo off
REM 🎬 StoryLite CLI Demo Setup Script (Windows)
REM Run this before recording your demo video

echo 🎬 Setting up StoryLite CLI demo environment...

REM Create demo directory
if not exist demo-files mkdir demo-files
cd demo-files

REM Create demo code file
(
echo // Revolutionary Trading Algorithm
echo // Copyright 2024 - All Rights Reserved
echo.
echo class TradingBot {
echo   constructor^(apiKey^) {
echo     this.apiKey = apiKey;
echo     this.isActive = false;
echo   }
echo.
echo   async analyzeMarket^(^) {
echo     // Advanced ML analysis
echo     const signals = await this.getMarketSignals^(^);
echo     return this.processSignals^(signals^);
echo   }
echo.
echo   async executeTrade^(signal^) {
echo     if ^(signal.confidence ^> 0.85^) {
echo       return await this.placeTrade^(signal^);
echo     }
echo   }
echo }
echo.
echo console.log^('🚀 Trading Bot initialized'^);
) > demo-code.js

REM Create markdown documentation
(
echo # Revolutionary Algorithm Documentation
echo.
echo ## Overview
echo This algorithm represents a breakthrough in automated trading technology.
echo.
echo ## Key Features
echo - ⚡ Lightning-fast execution ^(^< 10ms^)
echo - 🎯 95%% accuracy rate
echo - 🔒 Military-grade security
echo - 📊 Real-time market analysis
echo.
echo ## Usage Example
echo ```javascript
echo const bot = new TradingBot^(process.env.API_KEY^);
echo await bot.analyzeMarket^(^);
echo ```
echo.
echo ## Performance Metrics
echo - **Backtested Returns:** 347%% annually
echo - **Max Drawdown:** 2.1%%
echo - **Sharpe Ratio:** 4.2
echo - **Win Rate:** 89%%
echo.
echo ## License
echo Patent-pending technology. All rights reserved.
) > algorithm-docs.md

REM Create API specification
(
echo {
echo   "name": "StoryLite API",
echo   "version": "2.0.0",
echo   "description": "Revolutionary IP minting API",
echo   "endpoints": {
echo     "/mint": {
echo       "method": "POST",
echo       "description": "Mint any file as IP asset",
echo       "parameters": {
echo         "file": "File to mint",
echo         "title": "Asset title",
echo         "description": "Asset description"
echo       }
echo     }
echo   }
echo }
) > api-spec.json

REM Create business document
(
echo CONFIDENTIAL BUSINESS PLAN
echo StoryLite Technologies Inc.
echo.
echo EXECUTIVE SUMMARY
echo StoryLite is revolutionizing intellectual property protection through 
echo blockchain technology and developer-friendly tools.
echo.
echo MARKET OPPORTUNITY
echo - $50B IP protection market
echo - 2M+ developers need IP tools
echo - 500K+ creators seeking protection
echo.
echo COMPETITIVE ADVANTAGE
echo - First CLI tool for IP minting
echo - 10x faster than competitors
echo - Developer-first approach
echo.
echo This document contains proprietary information.
echo All rights reserved.
) > business-plan.txt

echo ✅ Demo files created successfully!
echo.
echo 📁 Files ready for demo:
dir /b
echo.
echo 🎬 You're ready to record! Use these commands in your demo:
echo.
echo # Basic minting:
echo storylite mint demo-code.js
echo storylite mint algorithm-docs.md --title "Algorithm Documentation"
echo storylite mint api-spec.json --title "API Specification v2.0"
echo.
echo # Advanced examples:
echo storylite mint business-plan.txt --title "Confidential Business Plan"
echo.
echo # With verbose mode:
echo storylite mint demo-code.js --verbose
echo.
echo 🎯 Pro tip: Practice the commands a few times before recording!

pause