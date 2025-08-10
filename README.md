# 🚀 HireMe – AI-Powered Developer Screening Platform

HireMe is an **AI-driven recruitment tool** that automates resume analysis, generates personalized coding challenges, and evaluates submissions to create a **dynamic DevScore**—helping recruiters hire faster, smarter, and more fairly.

---

## 📌 Problem

Recruiters and hiring managers often rely on resumes and generic coding tests to assess candidates.  
This process is:
- **Slow** – manual review and scheduling takes days.
- **Biased** – credentials may not reflect real skills.
- **Inefficient** – generic tests fail to validate role-specific capabilities.

---

## 💡 Solution

HireMe uses AI to:
1. **Parse resumes** and extract skills with confidence levels.
2. **Generate personalized challenges** tailored to each candidate’s skills and level.
3. **Evaluate submissions** automatically and adjust skill ratings.
4. Combine resume credibility + live challenge results into a **DevScore** for objective ranking.

---

## ✨ Core Features

- **Resume Parsing & Skill Extraction** – AI identifies relevant skills, levels, and gaps.
- **Tailored Challenge Generation** – Powered by **Groq LLM** for speed and contextual accuracy.
- **Automated Scoring** – Instant evaluation of submissions with AI feedback.
- **Dynamic Skill Profile** – Candidate profiles update as they complete challenges.
- **Recruiter Dashboard** – Search, filter, and view best-fit candidates quickly.

---

## 🛠 Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN/UI](https://ui.shadcn.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) + [Prism.js](https://prismjs.com/) for coding experience

**Backend**
- [Django](https://www.djangoproject.com/) + DRF
- [PostgreSQL](https://www.postgresql.org/)

**AI**
- [Groq LLM](https://groq.com/) for skill extraction, challenge generation, and scoring

---

## 📂 Project Code

Frontend: https://github.com/bugsnbytecoder/TalentAI-Frontend
Backend: https://github.com/bugsnbytecoder/TalentAI-Backend

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/bugsnbytecoder/TalentAI-Frontend.git
cd TalentAI-Frontend

yarn install
yarn dev
```

### 2️⃣ Backend Setup
```bash
git clone https://github.com/bugsnbytecoder/TalentAI-Backend.git
cd TalentAI-Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3️⃣ How It Works
- **Recruiter creates a project** → Defines required skills & roles.

- **AI analyzes candidates** → Resume parsing + skill mapping.

- **AI generates tailored challenges** → Based on skill & difficulty.

- **Candidate submits solution** → AI evaluates & updates DevScore.

- **Recruiter dashboard updates** → Ranked candidates ready for outreach.

### 4️⃣ Demo Video
🎥 Coming soon – 60-sec product walkthrough (Under Development)

### 5️⃣ License
This project is for Global AI Hackathon and is open-sourced under the MIT License. 
This code is owned by Nirman Khadka (EchoMindLabs.AI) and is used for the purpose of the Global AI Hackathon.

👤 Author
- Nirman Khadka
- Founder & CTO – EchoMindLabs.AI
- LinkedIn | Twitter

If you want, I can also add an **architecture diagram** inside the README so the judges instantly understand the flow from **resume → AI analysis → challenge → scoring → recruiter dashboard**.  
Do you want me to add that visual?