// ─────────────────────────────────────────────
// FairLens — Sample Datasets
// Pre-calculated summaries so Gemini can compute
// rates accurately without parsing raw Yes/No
// ─────────────────────────────────────────────

const SAMPLES = {

  hiring: {
    domain: "hiring",
    label:  "Biased Hiring",
    icon:   "💼",
    text: `Analyze this hiring dataset for bias.

DATASET SUMMARY (pre-calculated):
- Total applicants: 8
- Female applicants: 4 (Alice, Maria, Priya, Sara)
- Male applicants:   4 (Raj, James, David, Mike)
- Females hired: 0 out of 4 = 0% hire rate
- Males hired:   4 out of 4 = 100% hire rate
- Disparity gap: 100 percentage points
- Female avg interview score: 87.5 (HIGHER than male avg of 76.5)

RAW DATA:
name,gender,age,experience_years,interview_score,hired
Alice,Female,28,4,88,No
Raj,Male,27,3,74,Yes
Maria,Female,34,8,91,No
James,Male,31,6,79,Yes
Priya,Female,29,5,85,No
David,Male,36,10,82,Yes
Sara,Female,32,7,87,No
Mike,Male,25,2,71,Yes

Note: Female candidates consistently outscored males in interviews yet none were hired.`
  },

  loan: {
    domain: "loan",
    label:  "Loan Approvals",
    icon:   "🏦",
    text: `Analyze this loan approval dataset for bias.

DATASET SUMMARY (pre-calculated):
- White applicants: 4 — approved: 3/4 = 75% approval rate
- Black applicants: 4 — approved: 1/4 = 25% approval rate
- Disparity gap: 50 percentage points
- Avg credit score: White 695, Black 702 (Black applicants score HIGHER)
- Avg income: White $68k, Black $71k (Black applicants earn MORE)

RAW DATA:
applicant_id,race,age,income,credit_score,loan_amount,approved
L001,White,34,72000,710,180000,Yes
L002,Black,31,68000,695,160000,No
L003,White,45,85000,720,250000,Yes
L004,Black,38,79000,715,200000,No
L005,White,29,55000,670,120000,Yes
L006,Black,41,82000,725,220000,No
L007,White,52,48000,645,90000,No
L008,Black,27,55000,680,140000,Yes`
  },

  medical: {
    domain: "medical",
    label:  "Medical Triage",
    icon:   "🏥",
    text: `Analyze this hospital triage dataset for bias.

DATASET SUMMARY (pre-calculated):
- Female patients 65+: 4 — High/Critical priority: 1/4 = 25%
- Male patients 65+:   4 — High/Critical priority: 3/4 = 75%
- Disparity gap: 50 percentage points
- Both groups have identical pain scores and vitals distributions

RAW DATA:
patient_id,age,gender,pain_score,vitals_stable,chief_complaint,triage_priority
P001,72,Female,8,Yes,Chest pain,Low
P002,68,Male,8,Yes,Chest pain,High
P003,79,Female,9,No,Shortness of breath,Medium
P004,71,Male,9,No,Shortness of breath,Critical
P005,81,Female,7,Yes,Dizziness,Low
P006,66,Male,7,Yes,Dizziness,High
P007,75,Female,8,Yes,Abdominal pain,Low
P008,70,Male,8,Yes,Abdominal pain,Medium`
  },

  clean: {
    domain: "hiring",
    label:  "Fair Dataset",
    icon:   "✅",
    text: `Analyze this hiring dataset for bias.

DATASET SUMMARY (pre-calculated):
- Female applicants: 4 — hired: 2/4 = 50% hire rate
- Male applicants:   4 — hired: 2/4 = 50% hire rate
- Disparity gap: 0 percentage points
- Avg interview score Female: 81.5, Male: 79.5 (approximately equal)

RAW DATA:
name,gender,age,experience_years,interview_score,hired
Alice,Female,28,4,85,Yes
Raj,Male,27,3,74,No
Maria,Female,34,8,91,Yes
James,Male,31,6,82,Yes
Priya,Female,29,5,78,No
David,Male,36,10,81,Yes
Sara,Female,32,7,72,No
Mike,Male,25,2,80,No

Note: Hiring decisions are proportional across gender groups.`
  }

};
