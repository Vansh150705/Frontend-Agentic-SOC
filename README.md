# 🛡️ Cyber SOC Dashboard

A real-time Security Operations Center (SOC) dashboard built with React, powered by live data from Google Sheets via n8n automation workflows.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

---

## 🌐 Live Demo

**[https://frontend-agentic-soc.vercel.app](https://frontend-agentic-soc.vercel.app)**

---

## 📌 Overview

This project is a full-stack SOC dashboard that monitors security alerts, threats, incidents, and logs in real time — without a traditional backend. Instead of a server and database, it uses:

- **n8n** as the automation engine and data pipeline
- **Google Sheets** as a live database
- **Google Sheets API** for direct, cache-free data fetching
- **React** for the frontend UI

Data flows automatically from security events → n8n → Google Sheets → Dashboard, with updates visible within **10 seconds**.

---

## 🏗️ System Architecture

```
Security Events
      ↓
   n8n Workflow
(Automation Engine)
      ↓
 Google Sheets
 (Live Database)
      ↓
Google Sheets API
 (Direct, No Cache)
      ↓
  React Hooks
 (Every 10 sec)
      ↓
SOC Dashboard UI
```

---

## ✨ Features

### Dashboard (Overview)
- 4 live stat cards — Total Alerts, HIGH Severity, Open Alerts, No Action Taken
- Area chart — Threat activity by date (Critical / High / Medium)
- Donut chart — Severity distribution
- Recent Alerts table with live data
- Export to PDF

### Threat Monitor
- Full threat history from user activity sheet
- Search by user or threat type
- Filter by severity (HIGH / MEDIUM / LOW)
- Export to PDF

### Incident Management
- Card-based incident list
- Detail panel with full incident info
- Filter by status (All / open / no action)
- Export to PDF

### Security Logs
- Paginated log table (12 per page)
- Filter by log level (CRITICAL / ERROR / WARN / INFO)
- Search by user or event
- Export to PDF

### Admin Panel
- Users tab — team members with roles and MFA status
- Configuration tab — SIEM, Firewall, IDS/IPS, Alerting settings
- Activity tab — live activity feed from Google Sheets

### Notification System
- Bell icon with unread badge count
- Auto-detects new rows in Google Sheets
- Pushes notification for every new alert
- Alert sound plays on new incoming alerts

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Recharts | Area chart & donut chart |
| Lucide React | Icons |
| Google Sheets | Live database |
| Google Sheets API v4 | Direct data fetching |
| n8n | Automation & data pipeline |
| Vercel | Deployment & hosting |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Badges.jsx          # Severity, Status, LogLevel badges
│   ├── ChartTooltip.jsx    # Custom chart tooltip
│   ├── NotifPanel.jsx      # Notification dropdown panel
│   ├── SectionHeader.jsx   # Section header component
│   ├── Sidebar.jsx         # Left navigation
│   ├── StatCard.jsx        # Dashboard stat cards
│   ├── Table.jsx           # Reusable table wrapper
│   └── Topbar.jsx          # Top bar with bell & user info
├── hooks/
│   ├── useAlertsData.js    # Fetches Sheet1 + user history, computes stats
│   ├── useAlertSound.js    # Web Audio API alert sound
│   ├── useIncidentsData.js # Fetches incidents from Sheet1
│   ├── useLogsData.js      # Fetches logs from Sheet1
│   └── useThreatsData.js   # Fetches threats from user history
├── pages/
│   ├── Admin.jsx           # Admin panel (Users / Config / Activity)
│   ├── Dashboard.jsx       # Overview with charts and alerts
│   ├── Incidents.jsx       # Incident management
│   ├── Login.jsx           # Login page
│   ├── Logs.jsx            # Security logs
│   └── Threats.jsx         # Threat monitor
├── utils/
│   └── exportPDF.js        # PDF export utility
├── data/                   # Static fallback data
├── App.jsx                 # Root component, global state
└── main.jsx                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Cloud account with Sheets API enabled
- Google Sheets (public viewer access)

### Installation

```bash
# Clone the repository
git clone https://github.com/Vansh150705/Frontend-Agentic-SOC.git

# Navigate to project directory
cd Frontend-Agentic-SOC

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_API_KEY=your_google_sheets_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📊 Google Sheets Structure

### Sheet 1 — `alert record`
| AlertID | Date | Event | User | Role | Severity | Status | Summary | LastUpdated |

### Sheet 2 — `user history`
| AlertID | User | Role | Event | Date | Severity |

---

## 🔄 How Live Data Works

```javascript
// Every hook follows this pattern
useEffect(() => {
  fetchData();                              // fetch on mount
  const timer = setInterval(fetchData, 10_000); // re-fetch every 10 sec
  return () => clearInterval(timer);        // cleanup on unmount
}, []);
```

Data refreshes automatically every **10 seconds** directly from Google Sheets API with no caching delay.

---

## 🔔 Notification System

1. On page load, all existing sheet rows are registered as "seen"
2. Every 10 seconds, new rows are detected by comparing against seen IDs
3. New rows trigger a notification pushed to the bell panel
4. An alert sound plays via Web Audio API

---

## 📄 PDF Export

Each page has an **Export PDF** button that:
1. Opens a new browser tab with a formatted report
2. Automatically triggers the print dialog
3. Select "Save as PDF" to download

No external libraries — uses browser's built-in print API.

---

## 🔐 Security

- API key stored in `.env` file — never exposed in source code
- `.env` added to `.gitignore`
- Google Sheets API key restricted to Sheets API only
- Google Sheet set to public viewer (read-only)

---

## 🚢 Deployment

This project is deployed on **Vercel** with automatic deployments on every push to the `main` branch.

To deploy your own instance:
1. Fork this repository
2. Import to [Vercel](https://vercel.com)
3. Add `VITE_GOOGLE_API_KEY` environment variable
4. Deploy

---

## 👨‍💻 Author

**Vansh** — [GitHub](https://github.com/Vansh150705)

---

## 📝 License

This project is for educational purposes — Internal Use Only.

---

*Agentic SOC Platform · Built with React + n8n + Google Sheets*
