"""Prompt builders for Gemini-powered commitment extraction.

This module constructs strict prompts used to extract structured commitments
from user-provided text.
"""

from __future__ import annotations

from datetime import datetime, timezone
from textwrap import dedent


VALID_CATEGORIES = (
    "assignment",
    "exam",
    "interview",
    "meeting",
    "project",
    "bill",
    "health",
    "personal",
    "event",
    "other",
)

VALID_PRIORITIES = (
    "low",
    "medium",
    "high",
    "critical",
)


def build_commitment_prompt(text: str) -> str:
    """Build a strict commitment-extraction prompt for Gemini.

    The prompt guarantees that every extracted commitment must contain a valid
    priority value and instructs the model to use deterministic fallback rules.
    """

    cleaned_text = text.strip()
    current_datetime = datetime.now(timezone.utc).astimezone().isoformat()

    return dedent(
        f"""
        You are HeroBrine AI's structured commitment extraction engine.

        Your only task is to convert the user's input into valid JSON containing
        every actionable commitment found in the input.

        A commitment is an action, responsibility, deadline, obligation,
        appointment, reminder, goal, habit, or planned activity that the user
        should complete, attend, prepare for, pay, submit, or remember.

        Extract every independent commitment separately.

        Examples of commitments include:

        - Assignments and submissions
        - Exams and preparation tasks
        - Interviews
        - Meetings
        - Project tasks
        - Bills and payments
        - Appointments
        - Health-related tasks
        - Personal tasks
        - Events
        - Reminders
        - Habits
        - Goals

        CURRENT DATE AND TIME

        {current_datetime}

        Use the current date and time above to interpret relative expressions such
        as:

        - today
        - tomorrow
        - tonight
        - next Friday
        - this weekend
        - in two hours
        - after three days
        - by the end of the week

        DATE RULES

        - Return deadlines in ISO-8601 datetime format.
        - Preserve timezone information whenever possible.
        - If the date is known but the time is missing, use 18:00 local time.
        - Use these defaults for named time periods:
          - morning: 09:00
          - noon: 12:00
          - afternoon: 15:00
          - evening: 18:00
          - night: 20:00
        - If no date can reasonably be inferred, return null.
        - Never invent a specific date when the text gives no date information.

        TITLE RULES

        - The title must be short, clear, and action-oriented.
        - Prefer verb-first titles.
        - Good: "Submit database assignment"
        - Bad: "Database assignment"
        - Do not include unnecessary dates or priority words in the title.

        DESCRIPTION RULES

        - Include useful supporting details not already present in the title.
        - Return null if there are no additional details.
        - Do not repeat the title word-for-word.

        CATEGORY RULES

        The category must be exactly one of:

        {", ".join(VALID_CATEGORIES)}

        Category mapping guidance:

        - homework, coursework, report submission -> assignment
        - test, quiz, examination, revision -> exam
        - job interview, screening, technical round -> interview
        - call, sync, discussion, appointment with people -> meeting
        - software task, research task, project milestone -> project
        - payment, recharge, fee, invoice, rent -> bill
        - medicine, workout, doctor, sleep, health check -> health
        - personal errands or personal responsibilities -> personal
        - seminar, fest, conference, ceremony, social event -> event
        - use other only when none of the above reasonably applies

        PRIORITY RULES

        Priority is mandatory.

        Every commitment must contain exactly one of:

        {", ".join(VALID_PRIORITIES)}

        Never return null, an empty string, or any value outside this list.

        Determine priority using the following rules, in order:

        1. CRITICAL
           Use "critical" when:
           - the user explicitly says critical, emergency, immediately, ASAP,
             urgent, must do now, or cannot miss
           - the commitment is overdue
           - the deadline is within the next 6 hours
           - failure could cause severe consequences such as missing an exam,
             interview, payment cutoff, medical emergency, or final submission

        2. HIGH
           Use "high" when:
           - the user explicitly says important or high priority
           - the deadline is within 24 hours
           - it is an exam, interview, payment deadline, major submission,
             important meeting, or project milestone
           - missing it would have meaningful academic, professional, financial,
             or health consequences

        3. LOW
           Use "low" when:
           - the task is clearly optional
           - the user says whenever, sometime, maybe, if possible, or no rush
           - there is no deadline and the task has little consequence
           - it is a minor habit, casual idea, or low-impact personal task

        4. MEDIUM
           Use "medium" as the mandatory default when:
           - priority cannot be confidently inferred
           - the task is ordinary but still actionable
           - the deadline is more than 24 hours away
           - none of the critical, high, or low rules clearly apply

        Important fallback rule:

        If there is any uncertainty about priority, return "medium".

        Never omit priority.

        ESTIMATED DURATION RULES

        - Return duration in integer minutes.
        - Use null only when duration cannot reasonably be estimated.
        - Do not return strings such as "1 hour".
        - Convert hours into minutes.
        - Examples:
          - 30 minutes -> 30
          - 1 hour -> 60
          - 2.5 hours -> 150

        DEPENDENCY RULES

        - Include only explicit or strongly implied prerequisite tasks.
        - Return an empty array when no dependency exists.
        - Do not invent dependencies.

        CONFIDENCE RULES

        - ai_confidence must be a number between 0.0 and 1.0.
        - Use higher values when the task, deadline, category, and priority are
          explicit.
        - Use lower values when important details are inferred.
        - Never return confidence outside the range 0.0 to 1.0.

        OUTPUT FORMAT

        Return only valid JSON.

        Do not return markdown.

        Do not wrap the output in code fences.

        Do not include explanations, comments, reasoning, or additional text.

        The output must follow this exact structure:

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

        VALIDATION REQUIREMENTS

        Before returning the JSON, internally verify all of the following:

        - The top-level object contains exactly one key: "commitments".
        - "commitments" is an array.
        - Every commitment contains all required keys.
        - Every title is a non-empty string.
        - Every category is one of the allowed category values.
        - Every priority is exactly low, medium, high, or critical.
        - No priority is null.
        - No priority is missing.
        - Every estimated_duration is an integer or null.
        - Every dependencies value is an array.
        - Every ai_confidence value is between 0.0 and 1.0.
        - The final output is valid JSON.

        If no actionable commitments are found, return exactly:

        {{
          "commitments": []
        }}

        USER INPUT

        {cleaned_text}
        """
    ).strip()