# Fair.Lens — AI Bias Detection for Automated Decisions

> Built for **Google Solution Challenge 2026** · Track: Unbiased AI Decision  
> Powered by **Gemini 2.5 Flash** · No code required · Works in any browser

---

## The Problem

Computer programs now decide who gets a job, a bank loan, or medical care.  
When these systems learn from flawed historical data, they silently repeat and amplify discrimination — affecting real lives every day.

**The gap:** Every existing bias detection tool (IBM AI Fairness 360, Google What-If Tool, Fairlearn) requires Python expertise. The HR managers, loan officers, and hospital administrators who are closest to these decisions have no accessible way to audit their own data.

---

## The Solution

FairLens is a simple web tool where any non-technical user can:

1. Paste a CSV dataset (hiring, loan, medical, or education data)
2. Click **Analyse for Bias**
3. Get a plain-language bias report in seconds — bias score, findings, and specific fixes

No installation. No code. No data science degree needed.

---

## Live Demo

🔗 **[Try FairLens →](https://YOUR_USERNAME.github.io/Fair-Lens)**

---

## How It Works

```
User pastes CSV
       ↓
JavaScript pre-calculates outcome rates per demographic group
       ↓
Structured prompt + summary sent to Gemini 2.5 Flash API
       ↓
Gemini returns structured JSON (bias_score, verdict, findings, fixes)
       ↓
Plain-language Bias Report rendered in browser
```

**Privacy first:** Raw data never leaves your device. Only the pre-calculated summary is sent to the Gemini API.

---

## Sample Output

Input — a hiring dataset where all female candidates were rejected despite higher interview scores:

```json
{
  "bias_score": 95,
  "verdict": "SEVERE",
  "findings": [
    {
      "column": "gender",
      "severity": "HIGH",
      "what_data_shows": "Male hire rate: 100% (4/4). Female hire rate: 0% (0/4). Gap: 100 percentage points. Female avg interview score: 87.5 vs Male: 76.5.",
      "who_is_affected": "Female applicants are severely disadvantaged.",
      "fix": "Implement blind resume reviews and structured interviews. Train hiring managers on unconscious bias."
    }
  ],
  "summary": "Severe bias detected against female applicants despite higher qualifications. Immediate review required.",
  "data_quality_flags": "Small sample size (4 per group) — low statistical confidence, but disparity is extreme."
}
```

---

## Domains Covered

| Domain | Example bias detected |
|---|---|
| 💼 Hiring | Gender disparity in hire rates despite equal qualifications |
| 🏦 Loan approvals | Racial disparity in approval rates despite higher credit scores |
| 🏥 Medical triage | Elderly female patients assigned lower priority than males with identical symptoms |
| 🎓 Education | Low-income students rejected despite higher GPA |

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Model | Gemini 2.5 Flash via Google AI Studio API |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Deployment | GitHub Pages |
| Output format | Structured JSON (enforced via Gemini responseSchema) |

---

## Project Structure

```
Fair-Lens/
├── index.html       ← Main UI (HTML only, no inline CSS/JS)
├── config.js        ← API key configuration
├── css/
│   └── style.css    ← All styles and design tokens
└── js/
    ├── app.js       ← Main logic: API call, UI states, report rendering
    ├── prompt.js    ← Gemini system prompt and JSON response schema
    └── samples.js   ← 4 built-in sample datasets for demo
```

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/Fair-Lens.git
cd Fair-Lens
```

Open `config.js` and replace:
```js
GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE",
```
with your free Gemini API key from [aistudio.google.com](https://aistudio.google.com).

Then serve locally — do **not** open `index.html` directly (CORS):

```bash
# Python
python -m http.server 8080

# OR Node
npx serve .
```

Open `http://localhost:8080` in your browser.

---

## Get a Free Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key**
3. Create a new key
4. Paste it into the app or into `config.js`

---

## Why FairLens vs Existing Tools

| Tool | Requires coding? | Plain English output? | Works in browser? |
|---|---|---|---|
| IBM AI Fairness 360 | ✅ Python | ❌ | ❌ |
| Google What-If Tool | ✅ TensorFlow | ❌ | ❌ |
| Fairlearn | ✅ Python | ❌ | ❌ |
| **FairLens** | **❌ None** | **✅ Yes** | **✅ Yes** |

---

## Built By

**Team FairLens**    
Google Solution Challenge 2026 · Unbiased AI Decision Track

---

## Disclaimer

FairLens is an AI-assisted analysis tool. All findings should be validated by a qualified human reviewer before any organizational action is taken.
