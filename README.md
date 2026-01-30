# S3 Security Scanner & Misconfiguration Analysis System

🔍 **A comprehensive security scanner that analyzes AWS S3 bucket configurations for security misconfigurations with a beautiful web dashboard.**

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/Yossi-xD/Misconfiguration_Analysis_System.git
cd Misconfiguration_Analysis_System

# 2. Install dependencies
npm install

# 3. Start the application
npm start

# 4. Access the Dashboard
Open your browser and navigate to:
http://localhost:3000
```

## 📋 What This System Does
This system scans AWS S3 bucket configurations and identifies security misconfigurations through a complete pipeline:

## 🔄 Pipeline Flow
S3 Bucket Configs → Scan → Normalize → Analyze → Score → Alert → Dashboard

## 🔍 Security Checks Performed
Public Access Detection - Finds buckets with public ACLs or policies

Encryption Status - Checks for server-side encryption

Public Access Block - Verifies block public access settings

Policy Risk Analysis - Identifies dangerous IAM policies

Risk Scoring - Calculates severity scores (LOW → CRITICAL)

## 🏗️ Architecture

Misconfiguration_Analysis_System/
├── src/                           # Core scanner engine
│   ├── scanner/s3Scanner.js       # Data collection from samples
│   ├── normalizer/normalizeS3.js  # Data normalization
│   ├── analysis/rules/            # Security rule engine (4+ rules)
│   ├── scoring/score.js           # Risk scoring system
│   ├── alerts/                    # Alert creation & storage
│   └── main.js                    # Pipeline coordinator
├── frontend/                      # Web dashboard
│   ├── index.html                 # Dashboard UI
│   ├── style.css                  # Styling
│   └── app.js                     # Frontend logic
├── samples/                       # Sample S3 configurations
├── server.js                      # Express web server
├── package.json                   # Dependencies
└── README.md                      # This file

## 🎯 Features
### Backend Scanner
✅ Modular Rule Engine - Easy to add new security rules
✅ Risk Scoring - Calculates severity (LOW, MEDIUM, HIGH, CRITICAL)
✅ Alert Generation - Structured JSON alerts with findings
✅ Sample Data - Includes test configurations
✅ Extensible - Add custom rules for specific compliance needs

### Frontend Dashboard
✅ Real-time Stats - Visual severity breakdown
✅ Interactive Table - Click to view detailed findings
✅ Export Functionality - Download results as CSV
✅ Responsive Design - Works on desktop & mobile
✅ Local Storage - Saves results between sessions
✅ Mock Data - Demo mode for testing

## 📊 Sample Output
Terminal Output

[*] Starting S3 security scan pipeline...
[+] Scanned 3 bucket(s)
[+] Found 7 issue(s) in my-public-bucket
[+] Risk score: 100 (CRITICAL)
[✓] Saved 3 alerts to: alerts_output.json

## 📊 ALERT SUMMARY
================
Total alerts: 3
By severity: CRITICAL: 1, HIGH: 1, LOW: 1
By bucket: my-public-bucket: 1, my-private-bucket: 1, s3-private-encrypted: 1

### Dashboard Preview

┌─────────────────────────────────────────────────────┐
│                S3 SECURITY DASHBOARD                │
├─────────────────────────────────────────────────────┤
│  🔴 CRITICAL: 1    🟡 HIGH: 1    🟢 LOW: 1          │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Bucket            Severity  Score  Findings  │  │
│  │ my-public-bucket  🔴 CRITICAL  100   7       │  │
│  │ my-private-bucket 🟡 HIGH       80   1       │  │
│  │ s3-encrypted      🟢 LOW        20   1       │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

## 📁 Project Structure Details
### Core Modules
src/scanner/s3Scanner.js - Reads JSON configurations from samples folder

src/normalizer/normalizeS3.js - Standardizes different S3 config formats

src/analysis/analyzer.js - Orchestrates all security rule checks

src/scoring/score.js - Calculates risk scores based on findings

src/alerts/alertService.js - Creates structured alert objects

src/alerts/alertRepo.js - Handles alert storage and retrieval

### Web Interface
frontend/index.html - Dashboard layout with stats cards and tables

frontend/style.css - Modern, responsive styling with gradient design

frontend/app.js - Interactive JavaScript with local storage support

### Server
server.js - Express.js server with REST API endpoints

/api/scan - POST endpoint to trigger scans

/api/alerts - GET endpoint to retrieve alerts

/api/export/csv - CSV export functionality

## 🧪 Testing with Sample Data
The system includes three sample configurations:

s3_public.json - Public bucket with multiple security issues (CRITICAL)

s3_private_encrypted.json - Well-secured private bucket (LOW risk)

s3_private_unencrypted.json - Private but unencrypted bucket (HIGH risk)

## 🚨 Security Rules Implemented
Rule	Severity	Description
PUBLIC_ACL_ACCESS	HIGH	Bucket has public ACL grants
PUBLIC_POLICY_ACCESS	CRITICAL	Bucket policy allows public access
NO_ENCRYPTION	HIGH	No server-side encryption configured
PUBLIC_ACCESS_BLOCK_DISABLED	HIGH	Block public access settings are disabled
WILDCARD_ACTION	CRITICAL	IAM policy uses wildcard actions (*)
WILDCARD_RESOURCE	HIGH	IAM policy uses wildcard resources (*)

## 📈 Scoring System
CRITICAL (90-100): Multiple high-risk issues or public exposure

HIGH (70-89): Serious security gaps like no encryption

MEDIUM (40-69): Security improvements recommended

LOW (10-39): Minor issues or well-secured


## 🔮 Future Enhancements
Real AWS Integration - Scan actual S3 buckets

Authentication - User login for multiple teams

Scheduled Scans - Automatic periodic scanning

Notifications - Email/Slack alerts for critical findings

Compliance Reports - HIPAA, GDPR, PCI-DSS templates

Graph Visualizations - D3.js charts for trends

Multi-cloud Support - Azure Blob, Google Cloud Storage

## 🙏 Acknowledgments
Built with Node.js & Express

Dashboard uses Font Awesome icons

Inspired by AWS Well-Architected Framework

Sample data based on common S3 misconfigurations

```bash
Developed by Yossi-xD
Making cloud security accessible and visual 🛡️
```
