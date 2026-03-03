# NextMove — Career Intelligence Engine

> "Choose what fits you. Not what others chose for you."

**Live Product:** [next-move-wheat.vercel.app](https://next-move-wheat.vercel.app)

---

## What Is This

NextMove is a structured career intelligence engine built for Indian students in Class 9–10 — the most critical decision window before stream selection.

It is not a quiz. It is not a motivational tool. It is a rule-based advisory system that measures 22 psychological and academic traits, maps them against 8 career clusters, evaluates readiness for 4 major competitive exams, recommends a Class 11 stream, and delivers a full advisory report — in two modes: Supportive and Hard Truth.

Built for Tier 2, 3, and 4 city students who have no access to structured career counseling and make one of the most consequential decisions of their life based on parental pressure, peer influence, or social status of a course.

---

## The Problem

In India, over 250 million students make career decisions every year with almost no structured guidance.

- Professional career counseling costs ₹5,000–₹50,000 — inaccessible to most middle-class families
- Students choose streams based on what parents want, what friends are doing, or what sounds prestigious
- No one tells them whether their actual traits match their declared interest
- No one checks if they are realistically prepared for JEE, NEET, or UPSC
- No one accounts for financial feasibility when recommending a path

The result: wrong degree selection, dropouts, late career switching, wasted years, and financial strain on families that cannot afford mistakes.

**NextMove is the structured reality check that should exist before every stream selection.**

---

## What It Does

### Input
A 5-step assessment collecting 22 traits across cognitive ability, personality, behavioral tendencies, financial context, and declared interest.

### Processing
A rule-based scoring engine (CIE V6) that:
- Normalizes all 22 traits to a 0–100 scale
- Calculates weighted scores for 8 career clusters
- Applies weakness penalty logic to prevent unrealistic compensation
- Generates a stream recommendation (Science / Commerce / Arts / Vocational)
- Scores readiness for JEE, NEET, UPSC, and GATE/Banking
- Detects alignment or misalignment between declared interest and measured strengths
- Identifies the single most limiting trait for a declared career path
- Applies financial feasibility warnings where relevant

### Output
A full 4-tab report:
1. **Overview** — Primary cluster, stream recommendation, advisory statement, financial note
2. **Clusters** — All 8 clusters ranked with scores
3. **Exams** — JEE, NEET, UPSC, GATE readiness scores with status
4. **Plan** — 3 concrete actions to take starting now, gap diagnosis

---

## The Engine — CIE V6

### 22 Traits Measured

| Category | Traits |
|---|---|
| Cognitive | Logical Reasoning, Math, Physics, Biology, Commerce, Verbal, Memory, Attention to Detail |
| Personality | Creativity, Helping Others, Practical Thinking, Leadership, Empathy, Social Confidence, Writing, Stamina |
| Behavioral | Risk Tolerance, Resilience, Consistency, Seriousness |
| Interest | Tech Interest, Business Interest |

### 8 Career Clusters

| Cluster | Critical Traits |
|---|---|
| Analytical & Data | Math, Logical Reasoning |
| Technology Engineering | Math, Tech Interest |
| Core Engineering | Physics, Math |
| Life Sciences & Healthcare | Biology, Memory |
| Business & Management | Risk Tolerance, Leadership |
| Creative & Design | Creativity, Writing |
| Government & Public Services | Consistency, Memory |
| Defense & Armed Forces | Risk, Resilience, Stamina |

### Penalty Logic
If a critical trait for a cluster falls below threshold, the cluster score is penalized — not boosted by other traits. This prevents a student with very low Physics from scoring high in Core Engineering just because their Math is strong.

- Trait < 25 → Score × 0.45 (severe penalty)
- Trait < 40 → Score × 0.72 (moderate penalty)
- Trait ≥ 40 → No penalty

### Confidence System
The gap between the top-ranked and second-ranked cluster determines confidence:
- Gap < 5 → Low Clarity
- Gap 5–15 → Moderate Clarity
- Gap > 15 → High Clarity

### Alignment Detection
Compares the student's declared interest against their measured primary cluster. Outputs: Strong Alignment / Moderate Alignment / Significant Misalignment.

### Exam Readiness Scoring

| Exam | Key Traits Weighted |
|---|---|
| JEE | Math (35%), Physics (25%), Consistency, Resilience, Seriousness |
| NEET | Biology (35%), Memory (20%), Consistency, Stamina, Attention |
| UPSC | Verbal (25%), Memory (20%), Consistency, Resilience, Logical, Writing |
| GATE / Banking | Logical (30%), Math (25%), Consistency, Memory, Attention |

### Advisory Modes
- **Normal** — Honest, constructive, supportive tone
- **Hard Truth** — Direct, no hedging, no sugar coating. States misalignment bluntly. Names the specific gap. Gives exam readiness as a reality check.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | UI framework |
| Build Tool | Vite 4 | Fast dev and build |
| Styling | Inline styles (CSS-in-JS) | Zero dependency, full control |
| Logic | Vanilla JavaScript | Full CIE V6 engine ported from Python |
| Hosting | Vercel (free tier) | Auto-deploy from GitHub |
| Database (planned) | Supabase (PostgreSQL) | Anonymous response storage |
| Language (original engine) | Python 3 | CIE engine prototyped in Colab |

### Design System
- **Typography:** Palatino (serif, display) + Helvetica Neue (sans, UI)
- **Color palette:** #0A0A0A (black), #F8F7F4 (off-white), #E8E8E8 (borders)
- **Design language:** Apple-minimal — generous whitespace, no decorative elements, high contrast, typography-led
- **Mobile-first:** All layouts responsive, safe-area insets for iPhone notch, 48px minimum tap targets, WebKit optimizations

---

## Project Structure

```
nextmove/
├── index.html              # HTML shell + mobile meta tags + CSS reset
├── package.json            # Dependencies (React, Vite)
├── vite.config.js          # Vite + React plugin config
└── src/
    ├── main.jsx            # React DOM mount
    └── App.jsx             # Full application — engine + UI (single file)
```

---

## Roadmap

### ✅ Phase 1 — Engine (Complete)
- [x] CIE V6 engine with 22 traits
- [x] 8 career cluster scoring with penalty logic
- [x] 4 exam readiness scores
- [x] Stream recommendation
- [x] Alignment detection
- [x] Hard Truth advisory mode
- [x] Action plan generator
- [x] Financial feasibility warning
- [x] Mobile-optimized UI
- [x] Deployed on Vercel

### 🔧 Phase 2 — Data Layer (In Progress)
- [ ] Supabase integration — anonymous response storage
- [ ] Admin dashboard — view response patterns
- [ ] Export to CSV/Excel for analysis
- [ ] Optional email capture for follow-up

### 📊 Phase 3 — Intelligence
- [ ] Analyze first 100–300 responses
- [ ] Identify cluster distribution patterns
- [ ] Recalibrate weights based on real data
- [ ] Add probability modeling — convert readiness scores to estimated effort required

### 🌐 Phase 4 — Product
- [ ] PDF report download
- [ ] Shareable result link
- [ ] Hindi language support
- [ ] School / counselor dashboard
- [ ] Bulk assessment mode for classrooms

### 🏫 Phase 5 — Institutional
- [ ] Free school pilot program
- [ ] Teacher/counselor interface
- [ ] Batch reporting for schools
- [ ] API for third-party integrations

---

## Why This Is Different

| Feature | Random Quiz Apps | NextMove |
|---|---|---|
| Trait depth | 5–10 generic questions | 22 structured traits |
| Penalty for weak traits | No | Yes — prevents false positives |
| Exam readiness | No | JEE, NEET, UPSC, GATE |
| Financial reality | No | Soft warning integrated |
| Hard Truth mode | No | Yes — direct, no hedging |
| Stream recommendation | No | Science / Commerce / Arts / Vocational |
| Indian context | Partial | Fully Indian — exams, income bands, Tier 2–4 reality |
| Action plan | No | 3 concrete steps per cluster |

---

## Target User

**Primary:** Indian students in Class 9–10, age 14–16, filling the form alone on a mobile phone, from Tier 2, 3, or 4 cities, facing stream selection without professional guidance.

**Secondary:** Teachers and school counselors who want a structured tool to guide students before stream selection.

**Not for:** Students who have already made their decision and want validation. This tool is designed to challenge assumptions, not confirm them.

---

## Vision

**Short term:** Give every Class 9–10 student in India access to the kind of structured, honest career analysis that only wealthy urban families currently receive.

**Long term:** Become the default pre-stream assessment layer for schools across Tier 2–4 India — low cost, high trust, data-driven over time.

---

## Built By

Solo founder project. Engine designed from scratch, not a template. All scoring logic, weights, penalty system, advisory modes, and product decisions made independently.

Started as a Python prototype in Google Colab. Now a live deployed web product.

---

## License

MIT — open to use, fork, and build on. If you use this engine in your product, a mention would be appreciated.
