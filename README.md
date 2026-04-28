# Fair.Lens — AI Bias Detection for Automated Decisions

> Built for **Google Solution Challenge 2026** · Track: Unbiased AI Decision  
> Powered by **Gemini 2.5 Flash** · No code required · Works in any browser

---

## 🔗 Live Demo

**[https://basutkarsony.github.io/Fair-Lens/](https://basutkarsony.github.io/Fair-Lens/)**

---

## The Problem

Computer programs now decide who gets a job, a bank loan, or medical care.  
When these systems learn from flawed historical data, they silently repeat and amplify discrimination — affecting real lives every day.

**The gap no one is solving:**  
Every existing bias detection tool requires coding expertise:

| Tool | Requires |
|---|---|
| IBM AI Fairness 360 | Python |
| Google What-If Tool | TensorFlow + Jupyter |
| Fairlearn | Python |

The HR managers, loan officers, and hospital administrators who are closest to these decisions have no accessible way to audit their own data today.

---

## The Solution

FairLens is a simple web tool where any non-technical user can:

1. Paste a CSV dataset — hiring, loan, medical, or education data
2. Click **Analyse for Bias**
3. Get a plain-language bias report in seconds — bias score, findings, and specific fixes

No installation. No code. No data science degree needed.

---

## How It Works

```
User pastes CSV dataset
        ↓
JavaScript pre-calculates outcome rates per demographic group
        ↓
Structured prompt + summary sent to Gemini 2.5 Flash API
        ↓
Gemini returns structured JSON (bias_score, verdict, findings, fixes)
        ↓
Plain-language Bias Report rendered in the browser
```

**Privacy first:** Raw personal data never leaves your device.  
Only the pre-calculated summary is sent to the Gemini API.

---

## Real Output — Live Demo Result

Input: 8 applicants. All female candidates rejected despite higher interview scores.

```json
{
  "bias_score": 95,
  "verdict": "SEVERE",
  "findings": [
    {
      "column": "gender",
      "severity": "HIGH",
      "what_data_shows": "Male hire rate 100% (4/4). Female hire rate 0% (0/4). Gap: 100 percentage points. Female avg score 87.5 vs Male 76.5.",
      "who_is_affected": "Female applicants are severely disadvantaged.",
      "fix": "Implement blind resume reviews and structured interviews. Train hiring managers on unconscious bias."
    }
  ],
  "summary": "Severe bias detected against female applicants despite higher qualifications.",
  "data_quality_flags": "Small sample size (4 per group) — low statistical confidence, but disparity is extreme."
}
```

---

## Domains Covered

| Domain | Bias detected |
|---|---|
| 💼 Hiring | Gender disparity in hire rates despite equal or better qualifications |
| 🏦 Loan approvals | Racial disparity in approval rates despite higher credit scores |
| 🏥 Medical triage | Elderly female patients deprioritized vs males with identical symptoms |
| 🎓 Education | Low-income students rejected despite higher GPA |

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Model | Gemini 2.5 Flash — Google AI Studio API |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Deployment | GitHub Pages |
| Output | Structured JSON via Gemini responseSchema |

---

## Project Structure

```
Fair-Lens/
├── index.html       ← Main UI 
├── config.js        ← API key configuration
├── css/
│   └── style.css    ← All styles and design tokens
└── js/
    ├── app.js       ← Main logic: API call, UI states, report rendering
    ├── prompt.js    ← Gemini system prompt and JSON response schema
    └── samples.js   ← 4 built-in sample datasets
```

---

## Run Locally

```bash
git clone https://github.com/basutkarsony/Fair-Lens.git
cd Fair-Lens
```

Open `config.js` and set your Gemini API key:
```js
GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",
```

Run via local server (required — do not open index.html directly):
```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Open `http://localhost:8080`

---

## Get a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create new key
3. Paste into the app UI or into `config.js`

---

## Built By

**Team:FairLens**  
Google Solution Challenge 2026 · Unbiased AI Decision Track

---

## Disclaimer

FairLens is an AI-assisted analysis tool. All findings should be validated  
by a qualified human reviewer before any organizational action is taken.