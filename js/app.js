// ─────────────────────────────────────────────
// FairLens — Main Application Logic
// ─────────────────────────────────────────────

// ── STATE ────────────────────────────────────
let currentDomain = "hiring";

// ── INIT ─────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  // Load API key from config.js if set
  const configKey = (typeof CONFIG !== "undefined") ? CONFIG.GEMINI_API_KEY : "";
  if (configKey && configKey !== "YOUR_GEMINI_API_KEY_HERE") {
    document.getElementById("apiKey").value = configKey;
    setStatus("✓ API key loaded from config.js", "ok");
  }
  loadSample("hiring");
});

// ── API KEY ───────────────────────────────────
function saveKey() {
  const val = document.getElementById("apiKey").value.trim();
  if (!val || val.length < 20) {
    setStatus("✗ Key looks too short — paste the full key", "err");
    return;
  }
  setStatus("✓ Key saved. Ready to analyze.", "ok");
}

function getKey() {
  // Priority: input field → config.js
  const inputKey = document.getElementById("apiKey").value.trim();
  if (inputKey && inputKey.length > 20) return inputKey;
  if (typeof CONFIG !== "undefined" && CONFIG.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE") {
    return CONFIG.GEMINI_API_KEY;
  }
  return null;
}

function setStatus(msg, cls) {
  const el = document.getElementById("apiStatus");
  el.textContent = msg;
  el.className = "api-status" + (cls ? " " + cls : "");
}

// ── DOMAIN ────────────────────────────────────
function setDomain(btn, domain) {
  document.querySelectorAll(".domain-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentDomain = domain;
}

// ── SAMPLE LOADER ─────────────────────────────
function loadSample(key) {
  const s = SAMPLES[key];
  if (!s) return;
  document.getElementById("dataInput").value = s.text;
  document.querySelectorAll(".sample-pill").forEach(p => p.classList.remove("active"));
  const pill = document.getElementById("pill-" + key);
  if (pill) pill.classList.add("active");
  const domainBtn = document.querySelector(`[data-domain="${s.domain}"]`);
  if (domainBtn) setDomain(domainBtn, s.domain);
  onInputChange();
}

// ── INPUT CHANGE ──────────────────────────────
function onInputChange() {
  const val = document.getElementById("dataInput").value;
  document.getElementById("charCount").textContent = val.length + " chars";
  const hasData = val.trim().length > 20;
  const btn = document.getElementById("analyseBtn");
  btn.disabled = !hasData;
  document.getElementById("btnLabel").textContent = hasData
    ? "Analyse for Bias"
    : "Select a sample or paste data";
}

// ── SHOW/HIDE STATES ──────────────────────────
function showEmpty() {
  document.getElementById("emptyState").style.display = "block";
  document.getElementById("loadingState").classList.remove("active");
  document.getElementById("report").classList.remove("show");
  document.getElementById("errorBox").classList.remove("show");
}

function showLoading() {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("loadingState").classList.add("active");
  document.getElementById("report").classList.remove("show");
  document.getElementById("errorBox").classList.remove("show");
}

function showReport() {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("loadingState").classList.remove("active");
  document.getElementById("report").classList.add("show");
  document.getElementById("errorBox").classList.remove("show");
}

function showError(msg, hint) {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("loadingState").classList.remove("active");
  document.getElementById("report").classList.remove("show");
  document.getElementById("errorBox").classList.add("show");
  document.getElementById("errorMsg").textContent = msg;
  document.getElementById("errorHint").textContent = hint || "";
}

// ── LOADING ANIMATION ─────────────────────────
async function animateSteps() {
  const steps = [
    "Reading dataset structure…",
    "Identifying demographic columns…",
    "Computing outcome rates per group…",
    "Detecting statistical disparities…",
    "Generating plain-language report…",
  ];
  const container = document.getElementById("loadingSteps");
  container.innerHTML = "";
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, 480));
    const el = document.createElement("div");
    el.className = "loading-step";
    el.textContent = `[0${i + 1}] ${steps[i]}`;
    container.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
    if (i > 0) {
      const prev = container.children[i - 1];
      if (prev) prev.classList.add("done");
    }
  }
}

// ── MAIN ANALYSIS ─────────────────────────────
async function runAnalysis() {
  const apiKey = getKey();
  if (!apiKey) {
    showError(
      "No API key found.",
      "Enter your Gemini API key in the field above and click Save. Or set it in config.js."
    );
    return;
  }

  const input = document.getElementById("dataInput").value.trim();
  if (!input) return;

  document.getElementById("analyseBtn").disabled = true;
  showLoading();
  animateSteps();

  const model = (typeof CONFIG !== "undefined") ? CONFIG.GEMINI_MODEL : "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }]
    },
    contents: [{
      role: "user",
      parts: [{ text: `Domain context: ${currentDomain}\n\n${input}` }]
    }],
    generationConfig: {
      temperature: (typeof CONFIG !== "undefined") ? CONFIG.TEMPERATURE : 0.2,
      topP:        (typeof CONFIG !== "undefined") ? CONFIG.TOP_P      : 0.8,
      responseMimeType: "application/json",
      responseSchema:   RESPONSE_SCHEMA
    }
  };

  try {
    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${res.status}`;
      if (res.status === 400) throw new Error(`Bad request: ${msg}`);
      if (res.status === 401 || res.status === 403) throw new Error("API key rejected by Google. Check your key.");
      if (res.status === 429) throw new Error("Rate limit hit. Wait 30 seconds and try again.");
      throw new Error(msg);
    }

    const data = await res.json();
    const raw  = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Gemini returned an empty response. Try again.");

    const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
    renderReport(result);

  } catch (err) {
    let hint = "";
    if (err.message.toLowerCase().includes("api key") || err.message.includes("403")) {
      hint = "Double-check your API key in the field above or in config.js.";
    } else if (err.message.toLowerCase().includes("fetch") || err.message.includes("network")) {
      hint = "Make sure you're running this from a server (not opening the file directly). Use VS Code Live Server or deploy to GitHub Pages.";
    }
    showError(err.message, hint);
  } finally {
    document.getElementById("analyseBtn").disabled = false;
  }
}

// ── RENDER REPORT ─────────────────────────────
function renderReport(r) {
  // Score ring
  const score = Math.min(100, Math.max(0, Math.round(r.bias_score || 0)));
  document.getElementById("scoreNum").textContent = score;

  const arc = document.getElementById("scoreArc");
  const circumference = 339;
  arc.style.stroke = score >= 60 ? "#C1280A" : score >= 35 ? "#B85C00" : "#1A6B3A";
  arc.style.strokeDashoffset = circumference;
  setTimeout(() => {
    arc.style.strokeDashoffset = circumference - (score / 100) * circumference;
  }, 80);

  // Verdict
  const verdict = (r.verdict || "CLEAN").toUpperCase();
  const ve = document.getElementById("scoreVerdict");
  ve.textContent = verdict;
  ve.className = "score-verdict v-" + verdict.toLowerCase();

  const subMap = {
    CLEAN:    "No significant bias detected",
    LOW:      "Minor disparities found",
    MODERATE: "Moderate bias — review recommended",
    HIGH:     "Significant bias — action required",
    SEVERE:   "Severe discrimination — urgent action needed"
  };
  document.getElementById("scoreSub").textContent = subMap[verdict] || "Analysis complete";

  // Findings
  const list = document.getElementById("findingsList");
  list.innerHTML = "";
  const findings = r.findings || [];

  if (!findings.length) {
    list.innerHTML = `<p class="no-findings">No significant bias findings detected in this dataset.</p>`;
  } else {
    findings.forEach((f, i) => {
      const sev = (f.severity || "LOW").toUpperCase();
      const card = document.createElement("div");
      card.className = "finding fade-up";
      card.style.animationDelay = (i * 0.1) + "s";
      card.innerHTML = `
        <div class="finding-head">
          <span class="sev-pip sev-${sev}"></span>
          <span class="finding-col">${esc(f.column || "—")}</span>
          <span class="sev-badge badge-${sev}">${sev}</span>
        </div>
        <div class="finding-body">
          <div class="finding-what">${esc(f.what_data_shows || "")}</div>
          <div class="finding-who">${esc(f.who_is_affected || "")}</div>
          <div class="finding-fix">
            <div class="fix-label">Recommended fix</div>
            ${esc(f.fix || "")}
          </div>
        </div>`;
      list.appendChild(card);
    });
  }

  // Summary
  const sumClean = (r.summary || "").replace(/AI-assisted analysis\..*$/i, "").trim();
  document.getElementById("summaryText").textContent = sumClean;

  // Data quality
  const dqSec = document.getElementById("dqSection");
  if (r.data_quality_flags && r.data_quality_flags.trim()) {
    dqSec.style.display = "block";
    document.getElementById("dqText").textContent = r.data_quality_flags;
  } else {
    dqSec.style.display = "none";
  }

  showReport();
  document.querySelector(".results-panel").scrollTop = 0;
}

// ── UTILS ─────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
