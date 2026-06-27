# Marketing Analytics Dashboard

A frontend demo of a **B2B Digital Marketing Analytics Platform** built to monitor, visualize, and analyze the full prospect journey — from first digital touchpoint to loyal advocacy. Designed around a **6-stage marketing funnel** grounded in Gartner's research on B2B buyer behavior.

> ⚠️ **All data in this app is simulated.** Company names, PIC names, project values, DA/PA metrics, and activity logs are fictional and created solely for demonstration purposes. No relation to any real business entity. All CRUD operations run in-memory and reset on page refresh.

---

## Table of Contents

- [Overview](#overview)
- [The Marketing Funnel](#the-marketing-funnel)
- [Why Only Website & Internal Referral?](#why-only-website--internal-referral)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Notes](#demo-notes)

---

## Overview

This platform is built for marketing and sales teams in **B2B professional services** (consulting, agency, etc.) to:

- Track how prospects move through each funnel stage
- Identify dropout bottlenecks with automatic anomaly detection
- Monitor the effectiveness of digital channels (primarily website & internal referral)
- Correlate website SEO health (DA/PA) with incoming inquiry volume
- Manage leads and inquiries with full CRUD and follow-up tracking

The system is opinionated by design: it deliberately focuses on the two channels that Gartner research identifies as dominant in B2B services — **organic website search** and **internal referral (word-of-mouth)** — rather than spreading attention across social media channels that are less effective for this segment.

---

## The Marketing Funnel

This platform implements a **6-stage marketing funnel** adapted for the B2B professional services context:

```
┌─────────────────────────────────────────────────────────────┐
│                        AWARENESS                            │
│   Digital reach & impressions — website traffic, organic    │
│   search, branded search volume                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                         INTEREST                            │
│   Prospect actively contacts via website form or is         │
│   referred directly by an internal contact                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      CONSIDERATION                          │
│   Formal proposal sent and currently under evaluation       │
│   by the prospect's decision-making unit                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        PURCHASE                             │
│   Deal closed — contract signed and project initiated       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        RETENTION                            │
│   Client returns for repeat orders or service renewals      │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        ADVOCACY                             │
│   Client actively recommends the service to their network   │
│   — becomes an organic referral source                      │
└─────────────────────────────────────────────────────────────┘
```

Each stage transition is tracked per inquiry record. The funnel visualization shows:
- **Volume at each stage** — how many prospects are currently at each step
- **Dropout rate** — the percentage of prospects who did not advance to the next stage
- **Anomaly flags** — stages where dropout exceeds a configurable threshold, signaling a bottleneck

Funnel dropout thresholds are **fully configurable** per stage in the Settings page, allowing teams to set realistic targets based on industry benchmarks or historical data.

---

## Why Only Website & Internal Referral?

Most analytics dashboards track every channel indiscriminately. This platform takes a more focused approach, based on what the research actually says about **how B2B buyers make decisions**.

### The Gartner Finding

Gartner's research on B2B buyer behavior consistently shows that **B2B buyers spend the majority of their purchase journey doing independent research online** — before ever contacting a vendor. Key findings:

- B2B buyers are **57–70% through their decision process** before they first engage a sales rep (Gartner, CEB)
- The primary touchpoint for this self-directed research is the **vendor's website** — buyers use it to evaluate credibility, expertise, and fit
- **Word-of-mouth and peer referrals** (internal networks, professional communities) are the second dominant influence — especially for high-stakes consulting engagements
- Social media advertising, while effective in B2C, has significantly lower purchase influence in **professional services B2B** — decisions are made by committees, not impulse

### What This Means for the Platform

For a B2B professional services firm, obsessing over Instagram reach or TikTok impressions is a distraction. The real levers are:

1. **Website quality and SEO authority** — if buyers are doing independent research, the website must be discoverable and credible. This is why the platform tracks **Domain Authority (DA)** and **Page Authority (PA)** via Moz Link Explorer API weekly, and correlates it with inquiry volume.

2. **Internal referral network** — satisfied clients and professional contacts are the highest-converting channel. These are tracked as `Internal` source in the inquiry system.

Channels like Instagram, Facebook, TikTok, and WhatsApp are included in the Channel Performance report for completeness (they do generate some leads), but the platform's analytical focus — DA/PA monitoring, SEO-inquiry correlation — is built around the website channel because that is where B2B conversion leverage actually lives.

---

## Features

### 📊 Marketing Funnel Visualization
Interactive bar and funnel charts showing prospect volume per stage, dropout rates between stages, and automatic visual flagging of stages that exceed dropout thresholds.

### 📋 Inquiry Management
Full CRUD for prospect and client records. Each inquiry tracks:
- Company name, PIC, contact info, and project value
- Current funnel stage and days spent at that stage
- Inquiry source (Website, Internal Referral, or other channels)
- Follow-up notes and stage advancement history
- Drop and restore functionality with audit trail

### 📡 Website DA/PA Monitoring
Weekly tracking of Domain Authority and Page Authority sourced from **Moz Link Explorer API**. Includes a correlation chart overlaying DA/PA trends against weekly inquiry volume — making it possible to see whether SEO improvements are translating into lead generation.

### 🌐 Channel Performance Report
Breakdown of inquiry volume and conversion by acquisition channel. Channels tracked: Website, Internal Referral, Instagram, Facebook, TikTok, WhatsApp.

### ⚙️ Funnel Threshold Configuration
Each stage-to-stage dropout rate has a configurable "acceptable dropout" threshold. When actual dropout exceeds the threshold, the funnel visualization flags it automatically. Teams can tune these thresholds in Settings to match their business targets.

### 👥 User Management & Audit Log
Role-based access system with three roles: `super_admin`, `admin`, and `viewer`. Includes a user approval flow, role assignment, and a full audit log of all system actions (inquiry changes, user approvals, settings updates).

---

## Tech Stack

| Technology | Role |
|---|---|
| React 18 | Frontend framework |
| React Router v6 | Client-side routing |
| Recharts | D3-based charting library |
| Tailwind CSS v3 | Utility-first styling |
| Moz Link Explorer API | Weekly DA/PA data fetch (simulated in demo) |
| JSON (local) | Simulated data store for demo mode |

---

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   └── FunnelChart.jsx         # Reusable funnel visualization
│   ├── layout/
│   │   ├── Sidebar.jsx             # Navigation + developer profile
│   │   └── PageLayout.jsx          # Page wrapper with header
│   └── ui/
│       ├── StatCard.jsx            # KPI summary cards
│       ├── Badge.jsx               # Stage/status badges
│       ├── Button.jsx              # Button component
│       └── InquiryFormModal.jsx    # Add/edit inquiry modal
├── pages/
│   ├── Dashboard.jsx               # Main KPI overview
│   ├── FunnelAnalysis.jsx          # 6-stage funnel deep dive
│   ├── InquiryList.jsx             # Inquiry CRUD table
│   ├── ChannelReport.jsx           # Channel performance analytics
│   ├── WebsiteMetrics.jsx          # DA/PA monitoring & correlation
│   ├── Settings.jsx                # Funnel threshold configuration
│   ├── AdminDashboard.jsx          # User management & audit log
│   └── About.jsx                   # Platform & context documentation
├── data/
│   ├── inquiries.json              # Simulated inquiry records
│   ├── websiteMetrics.json         # Simulated DA/PA history
│   ├── users.json                  # Simulated user accounts
│   ├── settings.json               # Default funnel thresholds
│   └── auditLogs.json              # Simulated audit trail
├── hooks/
│   └── useAppData.js               # Central state management hook
├── constants/
│   ├── stages.js                   # Funnel stage definitions
│   ├── channels.js                 # Channel definitions
│   └── sumber.js                   # Inquiry source definitions
└── utils/
    ├── formatters.js               # Number/date formatting
    ├── funnelUtils.js              # Funnel calculation logic
    ├── stageAge.js                 # Days-in-stage calculations
    └── timeSeries.js               # Time series data helpers
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/AffanAts/MarketingAnalyticsDashboard_Demo.git
cd MarketingAnalyticsDashboard_Demo

# Install dependencies
npm install

# Start dev server
npm start
```

App runs at `http://localhost:3000`.

No environment variables, no backend, no login required. The app launches directly as `super_admin` with full access to all features.

---

## Demo Notes

- **All data is fictional** — company names, PIC names, project values, DA/PA figures, and audit logs are randomly generated for demonstration
- **CRUD is in-memory only** — adding, editing, or deleting records works during the session but resets on page refresh
- **No real API calls** — DA/PA data from Moz is simulated; in a production version this would be fetched weekly via the Moz Link Explorer API
- **No authentication** — the demo bypasses login and starts as `super_admin`; a production version would include proper auth flow

---

## Author

**Affan Haidar Atstsabit** — Digital Marketing Researcher

- [LinkedIn](https://www.linkedin.com/in/affanhaidar/)
- [Portfolio](https://affanh.vercel.app/)
- [GitHub](https://github.com/AffanAts)
