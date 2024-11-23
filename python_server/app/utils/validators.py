# File: app/utils/validators.py

import re
from typing import Optional  # Step 1: Import Optional
from app.models.schemas import Timing

def parse_timing(timing: Optional[str]) -> Optional[Timing]:
    """
    Parse timing into a structured format.
    Expected formats:
    - "S 09:25 AM - 10:40 AM"
    - "M 04:30 PM - 06:30 PM"
    - "ST 08:00 AM - 09:15 AM"
    - "MW 10:00 AM - 11:15 AM"
    - "TR 01:00 PM - 02:15 PM"
    - "SR 03:30 PM - 04:45 PM"
    If timing is missing or invalid, return None.
    """
    if not timing or not isinstance(timing, str):  # Step 2
        return None  # Step 3

    # Updated regex to handle AM/PM, single or two-letter day codes, and extra spaces
    pattern = r'^([SMTWRFA]{1,2})\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)$'  # Step 4
    match = re.match(pattern, timing.strip())  # Step 5
    if not match:
        return None  # Step 6
    days, start_time, end_time = match.groups()  # Step 7
    return Timing(
        days=days,
        start_time=start_time.upper(),
        end_time=end_time.upper()
    )  # Step 8
