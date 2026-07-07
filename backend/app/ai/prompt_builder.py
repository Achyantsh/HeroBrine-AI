"""Prompt builders for Gemini-powered commitment extraction.

This module constructs prompts used to extract commitments from text.
"""

from __future__ import annotations

from textwrap import dedent
from datetime import datetime



def build_commitment_prompt(text: str) -> str:
    """Build a production-ready prompt for commitment extraction."""
    today = datetime.now().isoformat()
    cleaned_text = text.strip()

    return dedent(
        f"""
You are HeroBrine AI's commitment extraction engine.

Your task is to identify EVERY actionable commitment contained in the user's input.
A single sentence may contain multiple commitments.
Extract every independent commitment separately.
Never invent commitments that are not implied by the text.

If uncertain, prefer null instead of guessing.
A commitment includes, but is not limited to:

- Assignment
- Exam
- Interview
- Meeting
- Project task
- Bill or payment
- Appointment
- Health-related task
- Personal task
- Event
- Reminder
- Habit
- Goal

Current date and time:
{today}

Interpret relative dates (today, tomorrow, next Friday, tonight, this weekend)
using the current date and time above.

Return all dates in ISO-8601 format.

If the exact time is unknown, choose a reasonable default:
- Morning → 09:00
- Afternoon → 15:00
- Evening → 18:00
- Night → 20:00

If no date can reasonably be inferred, return null.

interpret them relative to the current date.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap the response inside ```.

Do NOT explain your reasoning.

The output MUST follow this schema exactly:

{{
  "commitments": [
    {{
      "title": "string",
      "description": "string or null",
      "category": "assignment | exam | interview | meeting | project | bill | health | personal | event | other",
      "priority": "low | medium | high | critical",
      "deadline": "ISO-8601 datetime or null",
      "estimated_duration": "integer minutes or null",
      "dependencies": [
        "string"
      ],
      "ai_confidence": 0.0
    }}
  ]
}}

Rules:

- Return every commitment you can identify.
- If multiple commitments exist, include them all.
- Infer category when obvious.
- Infer priority when obvious.
- If deadline is missing, use null.
- If description is missing, use null.
- If estimated duration is unknown, use null.
- If no dependencies exist, return an empty array.
- Confidence must be between 0.0 and 1.0.
- If no commitments are found, return:

{{
  "commitments": []
}}

User Input:

{cleaned_text}
"""
    ).strip()