# Darshak Desai CRM — Demo README

**Built by Oltaflock AI**
**Client:** Darshak Desai Financial Services
**Demo Version:** 1.0
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion

---

## What This Is

This is a fully interactive frontend demo of the Darshak Desai CRM — a custom-built client relationship management system for Darshak Desai Financial Services. The demo uses hardcoded mock data to simulate the complete final product experience. No backend, no database, no API calls — everything runs in the browser.

The purpose of this demo is to show Darshak Desai exactly what the final product will look like and how every feature will work — before the full build begins.

---

## How to Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

For mobile view: open Chrome DevTools → Toggle Device Toolbar → select iPhone 14 Pro (390px).

---

## What the Demo Shows

The demo covers every feature of the final production build. Every screen, every interaction, every workflow is present. The only difference between the demo and the final product is that the demo uses hardcoded data instead of a live database and WhatsApp API.

---

## Pages & Features

### 1. Dashboard (`/`)

The home screen Darshak sees every morning when he opens the CRM.

**KPI Cards**
- Total Clients — 1,200 across all product lines
- Renewals This Month — count of policies/folios due for renewal this month
- Birthdays This Week — clients with birthdays in the next 7 days
- Pending Tasks — open tasks not yet marked done

**Upcoming Renewals**
- Lists all clients with a renewal due in the next 30 days
- Each card shows: client name, product tag (LIC / GIC / MF), renewal date, days remaining pill
- Days remaining pill is color coded: red (under 7 days) = urgent, amber (8–30 days) = upcoming, green = comfortable
- "View All" link goes to full renewals list
- Clicking any client card navigates to their profile

**Birthdays This Week**
- Horizontally scrollable cards
- Each card shows client name, birthday date, and a "Send WhatsApp Wish" button
- In the final build, this button fires an automated WhatsApp message via the Meta API
- In the demo, clicking it shows a success toast: "WhatsApp wish sent to [Name]"

**Today's Tasks**
- Checklist of all tasks due today
- Clicking the checkbox marks the task as done — it strikes through and grays out in real time
- Overdue tasks show a red "Due Today" badge

**FAB Button (+)**
- Floating action button bottom right
- Opens the Add New Client form

---

### 2. Clients List (`/clients`)

The full database of all 1,200 clients in one place.

**Search**
- Search bar at the top filters the client list in real time as you type
- Searches across client name and phone number

**Filter Chips**
- All / LIC / GIC / MF / Forex / Stocks / Champion / Prime
- Selecting a filter instantly filters the list to matching clients
- Multiple filters can be active at once
- When Champion filter is active, a Champions Leaderboard card appears at the top of the list (see below)

**Client Cards**
- Initials avatar with color based on name
- Champion ⭐ badge or Prime 🔘 badge where applicable
- Product tag pills — each product has its own color:
  - LIC = blue
  - GIC = green
  - MF = amber
  - Forex = purple
  - Stocks = gray
- Last contacted date
- Phone icon — tapping opens a call intent
- Tapping the card navigates to the Client Profile

**Champions Leaderboard**
- Appears at the top of the list when the Champion filter is selected
- Shows top 3 clients by referral count with rank, name, and referral count
- Rank 1: Rajesh Sharma — 5 referrals
- Rank 2: Vikram Desai — 3 referrals
- Rank 3: Anita Joshi — 2 referrals

**FAB Button (+)**
- Opens Add New Client form

---

### 3. Client Profile (`/clients/[id]`)

The single most important screen. Everything about one client in one place.

**Header**
- Back button
- Initials avatar
- Champion ⭐ or Prime 🔘 badge
- Full name, city, age, gender

**Quick Action Buttons**
- WhatsApp — opens `https://wa.me/[phone]` in a new tab (works in demo with real phone numbers)
- Add Task — opens a task creation modal pre-filled with this client's name
- Log Call — records a call in the activity log with today's date and time (updates UI state)

**Contact Details**
- Phone number
- Date of birth

**Active Products**
- One card per product the client currently has
- Each card shows: product type tag, renewal date, policy/folio reference number
- Renewal date color coded same as dashboard (red/amber/green)
- In the final build, clicking a renewal date lets you edit it

**Opportunities (Cross-Sell)**
- Shows all products the client does NOT yet have, grayed out
- Labels: "Not yet sold"
- This is the cross-sell gap view — Darshak can instantly see which products to pitch next
- Products shown here: LIC, GIC, MF, Forex, Stocks — minus whatever the client already has

**Recent Activity**
- Timeline of everything that has happened with this client
- Entries: WhatsApp messages sent, calls logged, tasks created, reminders triggered
- Most recent activity at the top

**Network (Referral)**
- Referred By: name of the client who referred this person (if any)
- Has Referred: count of clients this person has referred
- Clicking "Has Referred X Clients" shows a list of those clients

**Edit Button**
- Top right of the screen
- Navigates to the Edit Client form, pre-filled with all existing data

---

### 4. Add / Edit Client (`/clients/new` and `/clients/[id]/edit`)

The form for adding a new client or editing an existing one.

**Basic Information**
- Full Name (required)
- Phone Number (required) — validated as Indian mobile format
- Date of Birth — date picker
- Gender — dropdown (Male / Female / Other)
- City — text input

**Product Portfolio**
- Toggle switches for each product: Life Insurance (LIC), Mutual Funds (MF), General Insurance (GIC), Forex, Stock Broking
- When a toggle is switched ON, the row expands to reveal:
  - Renewal Date — date picker (not shown for Forex and Stocks as they don't have fixed renewals)
  - Policy / Folio Reference Number — text input
- When a toggle is switched OFF, the expanded fields collapse and clear

**Additional Details**
- Referred By — searchable dropdown of all existing clients. Type to search. Select one to link this client to their referrer.
- Client Notes — free text area for any additional context

**Save Client Profile**
- Validates required fields before saving
- On save: shows success toast, navigates to the new/updated client profile
- In the demo: updates the in-memory client list for the rest of the session

---

### 5. CSV Import (`/clients/import`)

This is one of the most important features for the actual deployment. Darshak has data locked in 3 separate software systems — this is how we get it all into one place.

**How It Works**
- Upload page accepts CSV or Excel files from any of the 3 source systems:
  - WealthMagic (Mutual Funds)
  - i-Magic (Life Insurance / LIC)
  - eSoft GIC (General Insurance)
- Each software exports its own CSV format — the import engine handles all three formats and normalizes them automatically

**Import Flow (Demo)**

Step 1 — Upload
- Drag and drop zone or file picker
- Select which software the file is from (WealthMagic / i-Magic / eSoft GIC / Other)
- Upload the CSV

Step 2 — Preview & Mapping
- System parses the CSV and shows a preview table of detected columns
- Auto-maps known column headers to CRM fields (Name, Phone, DOB, Policy Ref, Renewal Date etc.)
- Any unmapped columns are flagged for manual mapping via a dropdown
- Shows total rows detected and any rows with errors (missing phone number, invalid date format etc.)

Step 3 — Deduplication
- System checks each row against existing clients by phone number
- Shows three categories:
  - New clients — will be added fresh
  - Existing clients — same phone number found, their product record will be updated/merged
  - Conflicts — same phone number but different name, flagged for manual review
- Darshak can review conflicts and choose to merge or skip each one

Step 4 — Confirm & Import
- Summary: X new clients, Y updated, Z skipped
- Confirm Import button
- Progress bar as records are written
- On completion: success screen with totals and a link to view imported clients

**In the Demo**
- A sample CSV file is bundled in `/public/sample-import.csv` — Darshak can download it, then re-upload it to see the import flow
- The demo shows Steps 1, 2, and 3 fully with the sample data
- On Step 4 confirm, it shows the success screen and adds the imported clients to the in-memory list

**Expected CSV Columns by Source**

WealthMagic (MF):
```
Client Name, Mobile, Date of Birth, Folio Number, SIP Amount, SIP Date, Fund Name
```

i-Magic (LIC):
```
Policy Holder Name, Contact Number, DOB, Policy Number, Premium Amount, Premium Due Date, Plan Name
```

eSoft GIC (General Insurance):
```
Insured Name, Phone, DOB, Policy No, Vehicle/Asset, Premium, Renewal Date, Insurance Type
```

---

### 6. Broadcasts (`/broadcasts`)

Send WhatsApp messages to filtered groups of clients without touching your phone.

**Compose New Broadcast**

Send To dropdown — filter options:
- All Clients (1,200)
- LIC Clients only (430)
- GIC Clients only (280)
- Mutual Fund Clients only (510)
- Forex Clients only (120)
- Stock Broking Clients only (65)
- Champions only (34)
- Prime Customers only (67)

Selecting a filter updates the recipient count preview in real time below the compose box.

Message field — free text area. Type the message exactly as it will be sent on WhatsApp.

Recipient preview — "This message will be sent to ~[X] clients"

Send Broadcast button — in the demo, shows a success toast and adds the broadcast to the Recent Broadcasts list with status DELIVERED.

**Important compliance note shown in the UI:** A reminder label reads "Do not include guaranteed returns or percentage commitments in messages — SEBI/IRDA compliance." This mirrors the real regulatory restriction Darshak operates under.

**Recent Broadcasts**
- List of all previously sent broadcasts
- Each entry shows: message preview (first 80 characters), recipient count, date sent, delivery status pill (DELIVERED / SENT / FAILED)
- Tapping a broadcast expands it to show the full message

---

### 7. Tasks (`/tasks`)

A simple but powerful follow-up system so nothing falls through the cracks.

**Filter Tabs**
- Today — tasks due today only
- This Week — tasks due in the next 7 days
- All — every open task

**Task Cards**
- Client name (tappable — navigates to that client's profile)
- Task note / description
- Due date pill: Due Today (red), Tomorrow (amber), In X days (gray), Overdue (dark red)
- Checkbox — clicking marks the task as done, strikes it through, moves it to bottom of list

**Add Task (FAB + modal)**
- Client name — searchable dropdown of all clients
- Task note — text input
- Due date — date picker
- Save button adds to the task list immediately

**In the final build:**
- Tasks that are due today will send Darshak a WhatsApp notification at 8 AM
- Overdue tasks will send a follow-up notification at 10 AM

---

### 8. Settings (`/settings`)

**Profile**
- Darshak Desai
- Darshak Desai Financial Services
- +91 98765 43210
- Edit profile button

**Integrations**
- WhatsApp API — shows Connected status with green dot
- In the demo this is a static display
- In the final build this is where the Meta WhatsApp Cloud API credentials are configured

**Automated Reminders**
Toggle switches for each automated message type:

Policy Renewal Reminders:
- 60 Days Prior — toggle on/off
- 30 Days Prior — toggle on/off
- 7 Days Prior — toggle on/off

Birthday Greetings:
- Auto-send WhatsApp wish on client's birthday — toggle on/off

All toggles update UI state in real time in the demo. In the final build these control the cron scheduler behavior.

**Team Management**
- Lists current users: Darshak Desai (Admin) and Staff Member (Limited Access)
- Add User button — opens a modal to invite a new team member by phone number
- Each user has a 3-dot menu: Edit, Remove

**Logout**
- Shows a confirmation toast in the demo
- In the final build, clears the session and redirects to login

---

## Mock Data

All demo data lives in `/lib/mockData.ts`. The 5 sample clients are:

| Name | Products | Tag | Referred By | Referrals Given |
|---|---|---|---|---|
| Rajesh Sharma | LIC, MF | Champion ⭐ | Sunil Patel | 5 |
| Priya Mehta | GIC, MF | — | — | 0 |
| Sunil Patel | LIC | Prime 🔘 | — | 1 |
| Anita Joshi | MF, Forex | Prime 🔘 | Vikram Desai | 2 |
| Vikram Desai | LIC, GIC, MF, Forex | Champion ⭐ | — | 3 |

Upcoming renewal: Rajesh Sharma — LIC — June 10 — 8 days remaining

Birthday this week: Priya Mehta — June 4

Task due today: Call Vikram Desai re: MF renewal

---

## Navigation

**Mobile (bottom tab bar)**
- Home · Clients · Broadcasts · Tasks · Settings

**Desktop (left sidebar)**
- Same 5 sections
- Content area max-width 480px centered so it doesn't stretch on large screens
- Both views are fully functional — demo can be shown on laptop in either mobile DevTools view or desktop sidebar view

---

## Demo Script for Client Meeting

Walk Darshak through in this order:

1. **Dashboard** — show him the morning view. Point out his 1,200 clients, the upcoming Rajesh Sharma renewal in 8 days, Priya Mehta's birthday, and Vikram Desai's task.

2. **Upcoming Renewal** — click Rajesh Sharma's renewal card. Show his full profile. Point out Active Products (LIC + MF), Opportunities (GIC, Forex, Stocks — not yet sold), and the Network section (referred by Sunil Patel, has referred 5 clients — Champion).

3. **Cross-sell** — on Rajesh's profile, show the Opportunities section. Explain: "When you open any client, you instantly see what else you can sell them. No more guessing."

4. **Clients List** — go back, show the search. Type "Priya" — filters instantly. Show the Champion filter — leaderboard appears. Show Vikram Desai's profile — all 4 products, Champion badge.

5. **CSV Import** — go to the import page. Upload the sample CSV. Walk through the 4 steps. Show the deduplication screen. This is the answer to his 3-siloed-software problem.

6. **Broadcasts** — show the compose screen. Select "LIC Clients only" — count changes to 430. Type a sample renewal reminder. Point out the compliance note. Show recent broadcasts history.

7. **Tasks** — show today's task for Vikram Desai. Check it off — it marks done. Show the Add Task flow.

8. **Settings** — show WhatsApp API connected. Show the reminder toggles (60/30/7 days). Show team: Darshak + Staff Member.

9. **Mobile view** — if on laptop, switch browser to mobile view. Show the same screens on 390px. Explain: "This is a PWA — you add it to your phone's home screen, it opens like an app, no App Store needed."

---

## What Is NOT in the Demo (But Will Be in Final Build)

- Live database (Supabase PostgreSQL) — all client data persists
- WhatsApp messages actually send via Meta Cloud API
- Automated renewal reminder cron job runs daily at 8 AM
- Automated birthday messages send on the morning of each birthday
- Real user authentication (login with phone OTP)
- Real-time data sync — changes made on mobile appear on desktop instantly
- Champion threshold configuration — Darshak sets the referral count that triggers Champion tag
- Export to CSV from the CRM
- Broadcast delivery receipts from WhatsApp

---

## File Structure

```
/app
  /page.tsx                    → Dashboard
  /clients
    /page.tsx                  → Clients List
    /new/page.tsx              → Add Client
    /import/page.tsx           → CSV Import
    /[id]/page.tsx             → Client Profile
    /[id]/edit/page.tsx        → Edit Client
  /broadcasts/page.tsx         → Broadcasts
  /tasks/page.tsx              → Tasks
  /settings/page.tsx           → Settings

/lib
  /mockData.ts                 → All hardcoded demo data

/components
  /layout
    /BottomNav.tsx             → Mobile tab bar
    /Sidebar.tsx               → Desktop sidebar
    /Header.tsx                → Top header bar
  /dashboard
    /KPICard.tsx
    /RenewalCard.tsx
    /BirthdayCard.tsx
    /TaskItem.tsx
  /clients
    /ClientCard.tsx
    /ProductTag.tsx
    /ChampionBadge.tsx
    /LeaderboardCard.tsx
  /profile
    /ProductCard.tsx
    /OpportunityPill.tsx
    /ActivityTimeline.tsx
    /NetworkCard.tsx
  /import
    /UploadZone.tsx
    /ColumnMapper.tsx
    /DedupReview.tsx
  /ui
    /Toast.tsx
    /Modal.tsx
    /FAB.tsx
    /Toggle.tsx
    /Badge.tsx

/public
  /sample-import.csv           → Sample CSV for import demo
```

---

*Demo built by Oltaflock AI for Darshak Desai Financial Services.*
*For questions contact Amaan — Oltaflock AI.*