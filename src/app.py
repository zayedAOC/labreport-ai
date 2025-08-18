# -*- coding: utf-8 -*-
import io
import re
import json
from typing import Dict, List, Tuple, Optional
import streamlit as st

# PDF text extraction (lightweight; works on Streamlit Cloud)
try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None

# Optional: Claude (Anthropic) for explanations. Add your key in Streamlit Secrets.
ANTHROPIC_AVAILABLE = False
try:
    import anthropic
    _anthropic_key = st.secrets.get("anthropic", {}).get("api_key")
    if _anthropic_key:
        client = anthropic.Anthropic(api_key=_anthropic_key)
        ANTHROPIC_AVAILABLE = True
except Exception:
    ANTHROPIC_AVAILABLE = False

# -----------------------------
# App Config
# -----------------------------
st.set_page_config(page_title="LabReport.ai", layout="centered")

LANG_OPTIONS = [
    "English", "Spanish", "Arabic", "Bengali", "French",
    "Hindi", "Urdu", "Russian", "Cantonese"
]

AGE_BUCKETS = [
    "18–24", "25–34", "35–44", "45–54", "55–64", "65+"
]

GENDERS = ["Prefer not to say", "Female", "Male", "Intersex", "Non-binary", "Other"]
RACES_ETHNICITIES = [
    "Prefer not to say", "Asian", "Black / African descent", "Hispanic / Latino/a/e",
    "Middle Eastern / North African", "Native American / Alaska Native",
    "Native Hawaiian / Pacific Islander", "White", "Other / Multi"
]

# Common lab value regexes (simple but effective for typical formats)
LAB_PATTERNS = {
    "Glucose": r"(glucose)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "HbA1c": r"(hba1c|a1c)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*%?",
    "Hemoglobin": r"(hemoglobin|hgb)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "WBC": r"(wbc|white blood cell)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "Platelets": r"(platelets|plt)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "Creatinine": r"(creatinine)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "eGFR": r"(egfr)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "LDL": r"(ldl)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "HDL": r"(hdl)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
    "Triglycerides": r"(triglycerides|tg)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)",
}

# PHI scrubbing patterns (conservative; expands easily)
PHI_PATTERNS = [
    # Emails
    (r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", "[REDACTED_EMAIL]"),
    # Phones
    (r"\b(?:\+?1[\s\-\.]?)?(?:\(?\d{3}\)?[\s\-\.]?)\d{3}[\s\-\.]?\d{4}\b", "[REDACTED_PHONE]"),
    # MRN / Medical Record Number (very approximate; looks for MRN: 12345 style)
    (r"\b(MRN|Med(?:ical)?\s*Record\s*No\.?)\s*[:#]?\s*[A-Za-z0-9\-]+\b", "[REDACTED_MRN]"),
    # SSN (US)
    (r"\b\d{3}-\d{2}-\d{4}\b", "[REDACTED_SSN]"),
    # DOB formats
    (r"\b(DOB|Date of Birth)\s*[:\-]?\s*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b", "[REDACTED_DOB]"),
    # Dates that look like full names + date on same line (very rough)
    (r"(Patient\s*Name|Name)\s*[:\-]?\s*[A-Z][A-Za-z'\-]+\s+[A-Z][A-Za-z'\-]+", "Patient [REDACTED_NAME]"),
    # Address markers
    (r"\b(Address|Street|Apt|Suite)\b.*", "[REDACTED_ADDRESS_LINE]"),
]

DISCLAIMER = (
    "LabReport.ai provides **educational summaries of lab reports**. "
    "It does **not** provide medical advice, diagnosis, or treatment recommendations. "
    "Always consult a licensed clinician before making decisions about your health."
)

# -----------------------------
# Utilities
# -----------------------------
def read_pdf_text(file_bytes: bytes) -> str:
    if PdfReader is None:
        return ""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            try:
                text_parts.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n".join(text_parts)
    except Exception:
        return ""

def read_text_file(file_bytes: bytes) -> str:
    try:
        return file_bytes.decode("utf-8", errors="ignore")
    except Exception:
        return ""

def scrub_phi(raw: str) -> str:
    text = raw
    for pattern, repl in PHI_PATTERNS:
        text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
    # Collapse extra spaces
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

def extract_lab_values(text: str) -> Dict[str, Optional[str]]:
    out: Dict[str, Optional[str]] = {}
    for label, pattern in LAB_PATTERNS.items():
        m = re.search(pattern, text, flags=re.IGNORECASE)
        out[label] = m.group(2) if m else None
    return out

def claudify_summary(text: str, lang: str) -> str:
    """
    Use Claude if available to produce a careful, plain-language explanation
    without medical advice. If not available, return a simple fallback summary.
    """
    base_prompt = f"""
You are a careful assistant that explains lab reports for general audiences.
Summarize the NON-IDENTIFIABLE text below in {lang}, using short bullet points.
Do NOT provide medical advice, diagnosis, or treatment. Clearly state that users must
consult a licensed clinician. Focus on what the values mean directionally (e.g., high/low/normal),
but avoid prescribing actions.

Text (already scrubbed of PHI):
\"\"\"{text[:8000]}\"\"\"
"""
    if ANTHROPIC_AVAILABLE:
        try:
            resp = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=700,
                temperature=0.2,
                system="You explain lab reports safely, without medical advice.",
                messages=[{"role": "user", "content": base_prompt}],
            )
            return "".join(
                [blk.text for blk in resp.content if hasattr(blk, "text")]
            ).strip()
        except Exception as e:
            return f"(Claude unavailable: {e})\n\n" + simple_fallback_summary(text, lang)
    else:
        return simple_fallback_summary(text, lang)

def simple_fallback_summary(text: str, lang: str) -> str:
    # Super-simple fallback: show first N lines with a safety banner.
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    preview = "\n• " + "\n• ".join(lines[:8]) if lines else "No readable text."
    return (f"**Summary preview ({lang}) — model-free fallback:**\n"
            f"{preview}\n\n"
            f"_For complete explanations, connect Claude in Secrets._")

def dict_to_csv_rows(d: Dict[str, Optional[str]]) -> str:
    header = "test,value\n"
    rows = "\n".join([f"{k},{(v or '')}" for k, v in d.items()])
    return header + rows + "\n"

# -----------------------------
# UI
# -----------------------------
st.title("LabReport.ai – Private Lab Report Explainer")
st.caption("Upload a PDF or text lab report. We scrub PHI locally, then summarize.")

with st.sidebar:
    st.markdown("### Preferences")
    lang = st.selectbox("Language for explanation", LANG_OPTIONS, index=0)
    age = st.selectbox("Age group (optional)", AGE_BUCKETS, index=2)
    gender = st.selectbox("Gender (optional)", GENDERS, index=0)
    race = st.selectbox("Race / Ethnicity (optional)", RACES_ETHNICITIES, index=0)

    st.divider()
    st.markdown("### Privacy")
    st.write("We **do not store** personal identifiers. PHI is scrubbed before analysis.")
    st.write("See our [Privacy Policy](https://labreport.ai/privacy-policy).")

st.markdown(f"> ⚠️ **Disclaimer:** {DISCLAIMER}")

uploaded = st.file_uploader(
    "Upload your lab report (PDF or TXT). Images will be supported later.",
    type=["pdf", "txt"],
    accept_multiple_files=False
)

process = st.button("Analyze Report")

if process:
    if not uploaded:
        st.error("Please upload a PDF or TXT file first.")
        st.stop()

    # Read text
    raw_text = ""
    if uploaded.type == "application/pdf":
        if PdfReader is None:
            st.error("PDF reader not available. Please switch to TXT for now.")
            st.stop()
        raw_bytes = uploaded.read()
        raw_text = read_pdf_text(raw_bytes)
    else:
        raw_text = read_text_file(uploaded.read())

    if not raw_text.strip():
        st.error("Could not extract any text. Ensure the PDF has real text (not only images).")
        st.stop()

    # PHI scrubbing
    scrubbed = scrub_phi(raw_text)

    # Extract values (from scrubbed to be safe)
    labs = extract_lab_values(scrubbed)

    # Summarize
    with st.spinner("Generating a plain-language explanation…"):
        summary = claudify_summary(scrubbed, lang)

    # Results UI
    st.success("Analysis complete.")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Key Lab Values (auto-parsed)")
        st.write("These are best-effort matches. Always verify against your original report.")
        st.table({k: (v or "—") for k, v in labs.items()})

        csv_data = dict_to_csv_rows(labs)
        st.download_button(
            "Download CSV",
            data=csv_data.encode("utf-8"),
            file_name="lab_values.csv",
            mime="text/csv"
        )
        st.download_button(
            "Download JSON",
            data=json.dumps(labs, indent=2).encode("utf-8"),
            file_name="lab_values.json",
            mime="application/json"
        )

    with col2:
        st.subheader("Plain-language Summary")
        st.markdown(summary)

    with st.expander("View scrubbed text (PHI removed)"):
        st.text(scrubbed)

    st.markdown("---")
    st.caption(
        "Educational use only. This tool cannot diagnose, treat, or prescribe. "
        "Consult a licensed clinician for medical decisions."
    )

else:
    st.info("Upload a PDF or TXT and click **Analyze Report** to begin.")
