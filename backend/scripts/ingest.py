


from pathlib import Path
import json
import re
from datetime import datetime

from pypdf import PdfReader


# ============================================================
# PATHS
# ============================================================

# IMPORTANT:
# This is __file__, NOT **file**
BASE_DIR = Path(__file__).resolve().parent.parent

PDF_DIR = BASE_DIR / "data" / "pdfs"
RAW_DIR = BASE_DIR / "data" / "raw"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

RAW_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# DOCUMENT METADATA
# ============================================================

DOCUMENT_METADATA = {
    "patents_act_1970": {
        "title": "The Patents Act, 1970",
        "source": "IP India",
        "document_type": "act",
    },
    "drugs_rules_1945": {
        "title": "The Drugs Rules, 1945",
        "source": "CDSCO",
        "document_type": "rules",
    },
    "cosmetics_rules_2020": {
        "title": "The Cosmetics Rules, 2020",
        "source": "CDSCO",
        "document_type": "rules",
    },
}


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_line(line: str) -> str:
    """
    Clean common PDF extraction artifacts.
    """

    if not isinstance(line, str):
        return ""

    line = line.replace("\x00", " ")
    line = line.replace("\u00ad", "")
    line = line.replace("\u00a0", " ")

    # Normalize common dash variants.
    line = line.replace("‐", "-")
    line = line.replace("-", "-")
    line = line.replace("‒", "-")
    line = line.replace("–", "–")
    line = line.replace("—", "—")

    # Collapse spaces/tabs.
    line = re.sub(r"[ \t]+", " ", line)

    return line.strip()


def clean_page_text(text: str) -> str:
    """
    Clean extracted page text while preserving line structure.
    """

    if not text:
        return ""

    lines = []

    for line in text.splitlines():
        line = clean_line(line)

        if line:
            lines.append(line)

    return "\n".join(lines)


# ============================================================
# PDF EXTRACTION
# ============================================================

def extract_pdf(pdf_path: Path):
    """
    Extract text from every page.

    Returns:
        pages:
            [
                {
                    "page_number": 1,
                    "text": "..."
                },
                ...
            ]

        full_text:
            Complete document text.
    """

    print(f"\nReading: {pdf_path.name}")

    reader = PdfReader(str(pdf_path))

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):

        try:
            text = page.extract_text() or ""

        except Exception as exc:
            print(
                f"  WARNING: Could not extract page "
                f"{page_number}: {exc}"
            )
            text = ""

        text = clean_page_text(text)

        pages.append(
            {
                "page_number": page_number,
                "text": text,
            }
        )

    full_text = "\n\n".join(
        page["text"]
        for page in pages
        if page["text"]
    )

    return pages, full_text


# ============================================================
# STRUCTURAL DETECTION
# ============================================================

def detect_chapter(line: str):
    """
    Detect:

        CHAPTER I
        CHAPTER II
        CHAPTER III
        CHAPTER 1
    """

    match = re.match(
        r"^\s*CHAPTER\s+([IVXLCDM]+|\d+)\s*$",
        line,
        re.IGNORECASE,
    )

    if not match:
        return None

    return match.group(1).upper()


def detect_part(line: str):
    """
    Detect:

        PART I
        PART II
        PART A
        PART 1
    """

    match = re.match(
        r"^\s*PART\s+([IVXLCDM]+|\d+|[A-Z])\s*$",
        line,
        re.IGNORECASE,
    )

    if not match:
        return None

    return match.group(1).upper()


# ============================================================
# SECTION NUMBER HELPERS
# ============================================================

SECTION_NUMBER_RE = re.compile(
    r"^\s*(\d+[A-Z]?)\s*(?:\.\s*|\-\s*|\s+)(.*)$",
    re.IGNORECASE,
)


EXPLICIT_SECTION_RE = re.compile(
    r"^\s*SECTION\s+(\d+[A-Z]?)\s*\.?\s*(.*)$",
    re.IGNORECASE,
)


EXPLICIT_RULE_RE = re.compile(
    r"^\s*RULE\s+(\d+[A-Z]?)\s*\.?\s*(.*)$",
    re.IGNORECASE,
)


def normalize_section_number(number: str) -> str:
    """
    Normalize:

        11a -> 11A
        117b -> 117B
        5 -> 5
    """

    return number.strip().upper()


def section_number_sort_key(number: str):
    """
    Natural ordering:

        1
        2
        9
        10
        11
        11A
        11B
        12
        92A
    """

    match = re.match(
        r"^(\d+)([A-Z]*)$",
        number.upper(),
    )

    if not match:
        return (999999, number)

    return (
        int(match.group(1)),
        match.group(2),
    )


def detect_section(line: str):
    """
    Generic section/rule detection.

    Examples:

        1. Short title
        11A. Publication of applications
        Section 8. Information
        Rule 3. Application
    """

    # --------------------------------------------------------
    # Explicit Section
    # --------------------------------------------------------

    match = EXPLICIT_SECTION_RE.match(line)

    if match:
        return {
            "number": normalize_section_number(
                match.group(1)
            ),
            "title": match.group(2).strip(),
        }

    # --------------------------------------------------------
    # Explicit Rule
    # --------------------------------------------------------

    match = EXPLICIT_RULE_RE.match(line)

    if match:
        return {
            "number": normalize_section_number(
                match.group(1)
            ),
            "title": match.group(2).strip(),
        }

    # --------------------------------------------------------
    # Normal numbered provision
    # --------------------------------------------------------

    match = SECTION_NUMBER_RE.match(line)

    if match:
        number = normalize_section_number(
            match.group(1)
        )

        title = match.group(2).strip()

        if len(title) <= 300:
            return {
                "number": number,
                "title": title,
            }

    return None


# ============================================================
# PATENTS ACT
# ============================================================

PATENTS_SECTION_RE = re.compile(
    r"^\s*(\d+[A-Z]?)\s*\.\s*(.*?)\s*$",
    re.IGNORECASE,
)


def normalize_for_match(text: str) -> str:
    """
    Normalize text for title comparison.
    """

    if not text:
        return ""

    return re.sub(
        r"[^a-z0-9]+",
        " ",
        text.lower(),
    ).strip()


def clean_section_heading_text(text: str) -> str:
    """
    Clean a possible section heading.

    This deliberately does NOT destroy the original
    body text. It is only used for title matching.
    """

    if not text:
        return ""

    text = text.strip()

    # Remove common PDF spacing.
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


def looks_like_toc_page(page_text: str) -> bool:
    """
    Detect the Patents Act Table of Contents.
    """

    if not page_text:
        return False

    upper = page_text.upper()

    return (
        "ARRANGEMENT OF SECTIONS" in upper
        or (
            "CHAPTER I" in upper
            and "PRELIMINARY" in upper
            and "SECTIONS" in upper
        )
    )


def find_patents_act_body_start(pages):
    """
    Locate the actual beginning of the Patents Act.

    IMPORTANT:
    This function accepts either:

        pages

    or accidentally:

        (pages, full_text)

    """

    # --------------------------------------------------------
    # Safety: support extract_pdf() tuple.
    # --------------------------------------------------------

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        pages = pages[0]

    if not isinstance(pages, list):
        raise TypeError(
            "find_patents_act_body_start() expected "
            "a list of page dictionaries."
        )

    # --------------------------------------------------------
    # Strong body-start markers.
    # --------------------------------------------------------

    body_markers = [
        "This Act may be called the Patents Act, 1970",
        "BE it enacted by Parliament",
        "Short title, extent and commencement",
    ]

    for page in pages:

        page_text = page.get("text", "")

        for line_index, line in enumerate(
            page_text.splitlines()
        ):

            for marker in body_markers:

                if marker.lower() in line.lower():

                    return (
                        page["page_number"],
                        line_index,
                    )

    # --------------------------------------------------------
    # Fallback:
    # Find Section 1 after the TOC.
    # --------------------------------------------------------

    toc_seen = False

    for page in pages:

        text = page.get("text", "")

        if looks_like_toc_page(text):
            toc_seen = True
            continue

        if not toc_seen:
            continue

        for line_index, line in enumerate(
            text.splitlines()
        ):

            match = PATENTS_SECTION_RE.match(line)

            if not match:
                continue

            number = normalize_section_number(
                match.group(1)
            )

            if number == "1":

                return (
                    page["page_number"],
                    line_index,
                )

    raise ValueError(
        "Could not locate the beginning of the "
        "Patents Act body."
    )


# ============================================================
# PATENTS ACT TOC
# ============================================================

def extract_patents_act_toc(
    pages,
    body_page,
):
    """
    Extract the Patents Act TOC.

    Handles both:

        11A. Publication of application.

    and cases where PDF extraction separates
    the number and title across lines.
    """

    # --------------------------------------------------------
    # Safety for tuple input.
    # --------------------------------------------------------

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        pages = pages[0]

    toc = {}
    expected_numbers = []

    page_index = 0

    while page_index < len(pages):

        page = pages[page_index]

        if page["page_number"] >= body_page:
            break

        lines = page["text"].splitlines()

        line_index = 0

        while line_index < len(lines):

            line = lines[line_index].strip()

            match = PATENTS_SECTION_RE.match(
                line
            )

            if not match:
                line_index += 1
                continue

            number = normalize_section_number(
                match.group(1)
            )

            title = match.group(2).strip()

            # ------------------------------------------------
            # If title is empty, PDF extraction probably
            # placed it on the following line.
            # ------------------------------------------------

            if not title and line_index + 1 < len(lines):

                next_line = lines[
                    line_index + 1
                ].strip()

                # Do not consume obvious structural lines.
                if (
                    next_line
                    and not re.match(
                        r"^(CHAPTER|PART|SECTIONS?)\b",
                        next_line,
                        re.IGNORECASE,
                    )
                ):
                    title = next_line
                    line_index += 1

            # ------------------------------------------------
            # Ignore invalid fragments.
            # ------------------------------------------------

            if (
                len(title) >= 3
                and re.search(
                    r"[A-Za-z]",
                    title,
                )
            ):

                if number not in toc:

                    toc[number] = title
                    expected_numbers.append(
                        number
                    )

            line_index += 1

        page_index += 1

    return toc, expected_numbers


# ============================================================
# PATENTS ACT HEADING VALIDATION
# ============================================================

def title_matches_toc(
    extracted_title: str,
    toc_title: str,
) -> bool:
    """
    Loose comparison between actual heading and TOC title.

    The comparison intentionally tolerates:
        - punctuation changes
        - amendment markers
        - extra PDF-extracted material
        - minor OCR/extraction differences
    """

    extracted = normalize_for_match(
        extracted_title
    )

    expected = normalize_for_match(
        toc_title
    )

    if not extracted or not expected:
        return False

    if extracted == expected:
        return True

    if extracted.startswith(expected):
        return True

    if expected.startswith(extracted):
        return True

    extracted_words = extracted.split()
    expected_words = expected.split()

    compare_count = min(
        6,
        len(extracted_words),
        len(expected_words),
    )

    if compare_count >= 2:

        return (
            extracted_words[:compare_count]
            == expected_words[:compare_count]
        )

    return False


def is_valid_patents_section_heading(
    number,
    text,
    expected_numbers,
    toc,
):
    """
    Validate a Patents Act section heading.

    The TOC is used as a validation set, but the body does
    NOT have to follow the TOC perfectly.
    """

    number = normalize_section_number(
        number
    )

    # --------------------------------------------------------
    # Must exist in TOC.
    # --------------------------------------------------------

    if number not in expected_numbers:
        return False

    cleaned = clean_section_heading_text(
        text
    )

    # --------------------------------------------------------
    # Some sections such as:
    #
    # 5. [Omitted.]
    #
    # are valid even though their body is short.
    # --------------------------------------------------------

    if not cleaned:
        return True

    if not re.search(
        r"[A-Za-z]",
        cleaned,
    ):
        return False

    toc_title = toc.get(
        number,
        "",
    )

    if not toc_title:
        return True

    return title_matches_toc(
        cleaned,
        toc_title,
    )


# ============================================================
# PATENTS ACT — BODY HEADING EXTRACTION
# ============================================================

def find_next_nonempty_line(
    lines,
    start_index,
):
    """
    Return:
        (index, line)

    for the next non-empty line.
    """

    index = start_index + 1

    while index < len(lines):

        value = lines[index].strip()

        if value:
            return index, value

        index += 1

    return None, ""


def extract_patents_body_candidates(
    pages,
    body_page,
    body_line_index,
):
    """
    Extract possible section headings from the actual Act body.

    This is intentionally tolerant.

    It supports:

        10. Title text

    and:

        10.
        Title text

    and:

        11A. Publication of applications

    and:

        11A
        Publication of applications
    """

    candidates = []

    body_started = False

    current_chapter = None
    current_part = None

    for page in pages:

        page_number = page["page_number"]

        if page_number < body_page:
            continue

        lines = page["text"].splitlines()

        for line_index, raw_line in enumerate(
            lines
        ):

            line = raw_line.strip()

            # ------------------------------------------------
            # Skip text before actual body.
            # ------------------------------------------------

            if (
                page_number == body_page
                and not body_started
                and line_index < body_line_index
            ):
                continue

            body_started = True

            # ------------------------------------------------
            # Chapter.
            # ------------------------------------------------

            chapter = detect_chapter(line)

            if chapter:
                current_chapter = chapter
                continue

            # ------------------------------------------------
            # Part.
            # ------------------------------------------------

            part = detect_part(line)

            if part:
                current_part = part
                continue

            # ------------------------------------------------
            # Standard:
            #
            # 11A. Publication...
            # ------------------------------------------------

            match = PATENTS_SECTION_RE.match(
                line
            )

            if match:

                number = normalize_section_number(
                    match.group(1)
                )

                title = match.group(2).strip()

                # ------------------------------------------------
                # Handle:
                #
                # 11A.
                # Publication...
                # ------------------------------------------------

                if not title:

                    next_index, next_line = (
                        find_next_nonempty_line(
                            lines,
                            line_index,
                        )
                    )

                    if next_line:

                        # Do not consume a new section.
                        if not PATENTS_SECTION_RE.match(
                            next_line
                        ):

                            title = next_line

                candidates.append(
                    {
                        "number": number,
                        "title": title,
                        "page_number": page_number,
                        "line_index": line_index,
                        "chapter": current_chapter,
                        "part": current_part,
                    }
                )

                continue

            # ------------------------------------------------
            # Handle:
            #
            # 11A
            #
            # followed by:
            #
            # Publication of applications
            #
            # ------------------------------------------------

            number_only_match = re.match(
                r"^\s*(\d+[A-Z]?)\s*$",
                line,
                re.IGNORECASE,
            )

            if number_only_match:

                number = normalize_section_number(
                    number_only_match.group(1)
                )

                next_index, next_line = (
                    find_next_nonempty_line(
                        lines,
                        line_index,
                    )
                )

                if next_line:

                    if (
                        not PATENTS_SECTION_RE.match(
                            next_line
                        )
                    ):

                        candidates.append(
                            {
                                "number": number,
                                "title": next_line,
                                "page_number": page_number,
                                "line_index": line_index,
                                "chapter": current_chapter,
                                "part": current_part,
                            }
                        )

    return candidates


# ============================================================
# PATENTS ACT — FINAL PARSER
# ============================================================

def parse_patents_act(pages):
    """
    Final Patents Act parser.

    IMPORTANT DESIGN:

    We do NOT require every TOC entry to have a matching body
    paragraph.

    Instead:

        1. Extract the PDF.
        2. Find actual Act body.
        3. Extract TOC.
        4. Find actual body headings.
        5. Match body headings to TOC.
        6. Keep all successfully located sections.
        7. Add TOC-only entries for sections which are omitted,
           missing from extraction, or represented only in TOC.

    Therefore we preserve the legal document's section list
    without inventing body text.
    """

    # --------------------------------------------------------
    # Safety.
    # --------------------------------------------------------

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        pages = pages[0]

    if not isinstance(pages, list):
        raise TypeError(
            "parse_patents_act() expected a list "
            "of page dictionaries."
        )

    # --------------------------------------------------------
    # Find body.
    # --------------------------------------------------------

    body_page, body_line_index = (
        find_patents_act_body_start(
            pages
        )
    )

    print(
        f"Patents Act body starts : "
        f"page {body_page}, "
        f"line {body_line_index}"
    )

    # --------------------------------------------------------
    # Extract TOC.
    # --------------------------------------------------------

    toc, expected_numbers = (
        extract_patents_act_toc(
            pages,
            body_page,
        )
    )

    print(
        f"TOC sections detected : "
        f"{len(expected_numbers)}"
    )

    expected_set = set(
        expected_numbers
    )

    # --------------------------------------------------------
    # Find actual body candidates.
    # --------------------------------------------------------

    candidates = (
        extract_patents_body_candidates(
            pages,
            body_page,
            body_line_index,
        )
    )

    print(
        f"Body heading candidates : "
        f"{len(candidates)}"
    )

    # --------------------------------------------------------
    # Match candidates against TOC.
    # --------------------------------------------------------

    located = {}

    for candidate in candidates:

        number = candidate[
            "number"
        ]

        if number not in expected_set:
            continue

        title = candidate[
            "title"
        ]

        toc_title = toc.get(
            number,
            "",
        )

        valid = (
            is_valid_patents_section_heading(
                number=number,
                text=title,
                expected_numbers=expected_set,
                toc=toc,
            )
        )

        # ----------------------------------------------------
        # If title validation fails, still allow an exact
        # section number when the TOC marks it as omitted.
        # ----------------------------------------------------

        if not valid:

            normalized_toc = (
                normalize_for_match(
                    toc_title
                )
            )

            if "omitted" not in normalized_toc:
                continue

        # ----------------------------------------------------
        # First occurrence wins.
        # ----------------------------------------------------

        if number not in located:

            located[number] = candidate

    # --------------------------------------------------------
    # Determine body positions.
    # --------------------------------------------------------

    sorted_located = sorted(
        located.values(),
        key=lambda item: (
            item["page_number"],
            item["line_index"],
        ),
    )

    # --------------------------------------------------------
    # Build body section objects.
    # --------------------------------------------------------

    sections = []

    for index, candidate in enumerate(
        sorted_located
    ):

        number = candidate[
            "number"
        ]

        start_page = candidate[
            "page_number"
        ]

        start_line = candidate[
            "line_index"
        ]

        # ----------------------------------------------------
        # End position:
        # next located section.
        # ----------------------------------------------------

        if index + 1 < len(
            sorted_located
        ):

            next_candidate = (
                sorted_located[
                    index + 1
                ]
            )

            end_page = (
                next_candidate[
                    "page_number"
                ]
            )

        else:

            end_page = pages[-1][
                "page_number"
            ]

        # ----------------------------------------------------
        # Extract complete section body from start heading
        # until the next located heading.
        # ----------------------------------------------------

        body_lines = []

        collecting = False

        for page in pages:

            page_number = page[
                "page_number"
            ]

            if page_number < start_page:
                continue

            if page_number > end_page:
                break

            lines = page[
                "text"
            ].splitlines()

            for line_index, line in enumerate(
                lines
            ):

                if (
                    page_number == start_page
                    and line_index < start_line
                ):
                    continue

                # ------------------------------------------------
                # Stop at the next section.
                # ------------------------------------------------

                if (
                    page_number == end_page
                    and index + 1 < len(
                        sorted_located
                    )
                ):

                    next_candidate = (
                        sorted_located[
                            index + 1
                        ]
                    )

                    if (
                        page_number
                        == next_candidate[
                            "page_number"
                        ]
                        and line_index
                        >= next_candidate[
                            "line_index"
                        ]
                    ):
                        collecting = False
                        break

                collecting = True

                if collecting:
                    body_lines.append(
                        line
                    )

            if (
                index + 1 < len(
                    sorted_located
                )
            ):

                next_candidate = (
                    sorted_located[
                        index + 1
                    ]
                )

                if (
                    page_number
                    == next_candidate[
                        "page_number"
                    ]
                ):
                    break

        # ----------------------------------------------------
        # Remove empty lines.
        # ----------------------------------------------------

        body_lines = [
            line.strip()
            for line in body_lines
            if line.strip()
        ]

        body_text = "\n".join(
            body_lines
        ).strip()

        toc_title = toc.get(
            number,
            candidate["title"],
        )

        # ----------------------------------------------------
        # Detect omitted sections.
        # ----------------------------------------------------

        status = "located"

        if "omitted" in normalize_for_match(
            toc_title
        ):
            status = "omitted"

        sections.append(
            {
                "number": number,
                "title": toc_title,
                "chapter": candidate[
                    "chapter"
                ],
                "part": candidate[
                    "part"
                ],
                "page_start": start_page,
                "page_end": end_page,
                "status": status,
                "source": "body",
                "text": body_text,
            }
        )

    # ========================================================
    # ADD TOC-ONLY SECTIONS
    # ========================================================

    located_numbers = {
        section["number"]
        for section in sections
    }

    missing_numbers = [
        number
        for number in expected_numbers
        if number not in located_numbers
    ]

    # --------------------------------------------------------
    # We preserve TOC entries which are not recoverable from
    # the body.
    #
    # We do NOT fabricate their text.
    # --------------------------------------------------------

    for number in missing_numbers:

        toc_title = toc.get(
            number,
            "",
        )

        normalized_title = (
            normalize_for_match(
                toc_title
            )
        )

        if "omitted" in normalized_title:

            status = "omitted"

        else:

            status = "toc_only"

        sections.append(
            {
                "number": number,
                "title": toc_title,
                "chapter": None,
                "part": None,
                "page_start": None,
                "page_end": None,
                "status": status,
                "source": "toc",
                "text": "",
            }
        )

    # --------------------------------------------------------
    # Final ordering = TOC ordering.
    #
    # This is much more reliable than sorting:
    # 11A, 11, 12, etc.
    # --------------------------------------------------------

    toc_position = {
        number: index
        for index, number in enumerate(
            expected_numbers
        )
    }

    sections.sort(
        key=lambda section: toc_position.get(
            section["number"],
            999999,
        )
    )

    # --------------------------------------------------------
    # Final statistics.
    # --------------------------------------------------------

    located_count = sum(
        1
        for section in sections
        if section["source"] == "body"
    )

    toc_only_count = sum(
        1
        for section in sections
        if section["source"] == "toc"
    )

    omitted_count = sum(
        1
        for section in sections
        if section["status"] == "omitted"
    )

    print(
        f"Body sections located  : "
        f"{located_count}"
    )

    print(
        f"TOC-only sections      : "
        f"{toc_only_count}"
    )

    print(
        f"Omitted sections       : "
        f"{omitted_count}"
    )

    print(
        f"Final section records  : "
        f"{len(sections)}"
    )

    if missing_numbers:

        print(
            "TOC entries without recoverable "
            "body text:"
        )

        print(
            ", ".join(
                missing_numbers
            )
        )

        print(
            "These are preserved as "
            "'toc_only' records; no text "
            "has been fabricated."
        )

    else:

        print(
            "All TOC sections located in "
            "the extracted body."
        )

    return sections


# ============================================================
# GENERIC DOCUMENT STRUCTURING
# ============================================================

def build_sections_generic(
    pages,
):
    """
    Generic first-pass parser for Drugs Rules and
    Cosmetics Rules.

    This is intentionally separate from the Patents Act
    parser because the Patents Act has a reliable TOC that
    can be used as a structural reference.
    """

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        pages = pages[0]

    sections = []

    current_section = None
    current_chapter = None
    current_part = None

    for page in pages:

        page_number = page[
            "page_number"
        ]

        text = page[
            "text"
        ]

        if not text:
            continue

        lines = text.splitlines()

        for line in lines:

            # ------------------------------------------------
            # Chapter.
            # ------------------------------------------------

            chapter = detect_chapter(
                line
            )

            if chapter:

                current_chapter = chapter
                continue

            # ------------------------------------------------
            # Part.
            # ------------------------------------------------

            part = detect_part(
                line
            )

            if part:

                current_part = part
                continue

            # ------------------------------------------------
            # Section / Rule.
            # ------------------------------------------------

            detected = detect_section(
                line
            )

            if detected:

                # Save previous.
                if current_section:

                    current_section[
                        "text"
                    ] = "\n".join(
                        current_section.pop(
                            "_lines"
                        )
                    ).strip()

                    current_section[
                        "page_end"
                    ] = (
                        page_number - 1
                        if page_number
                        > current_section[
                            "page_start"
                        ]
                        else page_number
                    )

                    sections.append(
                        current_section
                    )

                # Start new.
                current_section = {
                    "number": detected[
                        "number"
                    ],
                    "title": detected[
                        "title"
                    ],
                    "chapter": current_chapter,
                    "part": current_part,
                    "page_start": page_number,
                    "page_end": page_number,
                    "status": "located",
                    "source": "body",
                    "_lines": [],
                }

                if detected[
                    "title"
                ]:

                    current_section[
                        "_lines"
                    ].append(
                        detected[
                            "title"
                        ]
                    )

                continue

            # ------------------------------------------------
            # Normal body text.
            # ------------------------------------------------

            if current_section:

                current_section[
                    "_lines"
                ].append(
                    line
                )

    # --------------------------------------------------------
    # Save final section.
    # --------------------------------------------------------

    if current_section:

        current_section[
            "text"
        ] = "\n".join(
            current_section.pop(
                "_lines"
            )
        ).strip()

        sections.append(
            current_section
        )

    return sections


# ============================================================
# DOCUMENT STRUCTURING
# ============================================================

def build_sections(
    pages,
    document_id=None,
):
    """
    Select parser according to document.
    """

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        pages = pages[0]

    if document_id == "patents_act_1970":

        return parse_patents_act(
            pages
        )

    return build_sections_generic(
        pages
    )


# ============================================================
# JSON CREATION
# ============================================================

def create_document_json(
    document_id: str,
    pdf_path: Path,
    pages,
    full_text: str,
    sections,
):
    """
    Create final processed JSON.
    """

    metadata = DOCUMENT_METADATA.get(
        document_id,
        {
            "title": pdf_path.stem,
            "source": "Unknown",
            "document_type": "unknown",
        },
    )

    return {
        "document_id": document_id,
        "title": metadata[
            "title"
        ],
        "source": metadata[
            "source"
        ],
        "document_type": metadata[
            "document_type"
        ],
        "filename": pdf_path.name,
        "ingested_at": datetime.now().isoformat(),
        "page_count": len(pages),
        "character_count": len(
            full_text
        ),
        "section_count": len(
            sections
        ),
        "sections": sections,

        # Preserve page-level text for
        # debugging and citations.
        "pages": pages,
    }


# ============================================================
# PROCESS ONE DOCUMENT
# ============================================================

def process_document(
    pdf_path: Path,
):
    """
    Process one PDF from extraction through JSON.
    """

    document_id = pdf_path.stem

    print("\n" + "=" * 60)
    print(
        f"PROCESSING: {pdf_path.name}"
    )
    print("=" * 60)

    # --------------------------------------------------------
    # Extract.
    # --------------------------------------------------------

    pages, full_text = extract_pdf(
        pdf_path
    )

    print(
        f"Pages extracted : "
        f"{len(pages)}"
    )

    print(
        f"Characters      : "
        f"{len(full_text):,}"
    )

    # --------------------------------------------------------
    # Save raw text.
    # --------------------------------------------------------

    raw_path = (
        RAW_DIR
        / f"{document_id}.txt"
    )

    raw_path.write_text(
        full_text,
        encoding="utf-8",
    )

    print(
        f"Raw text saved  : "
        f"{raw_path}"
    )

    # --------------------------------------------------------
    # Parse structure.
    # --------------------------------------------------------

    sections = build_sections(
        pages,
        document_id=document_id,
    )

    print(
        f"Sections found  : "
        f"{len(sections)}"
    )

    # --------------------------------------------------------
    # Create JSON.
    # --------------------------------------------------------

    document_json = (
        create_document_json(
            document_id=document_id,
            pdf_path=pdf_path,
            pages=pages,
            full_text=full_text,
            sections=sections,
        )
    )

    json_path = (
        PROCESSED_DIR
        / f"{document_id}.json"
    )

    json_path.write_text(
        json.dumps(
            document_json,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    print(
        f"JSON saved      : "
        f"{json_path}"
    )

    return {
        "document": document_id,
        "pages": len(pages),
        "characters": len(
            full_text
        ),
        "sections": len(
            sections
        ),
        "json": json_path,
    }


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print(
        " AYU-RAKSHA DOCUMENT INGESTION"
    )
    print("=" * 60)

    # --------------------------------------------------------
    # Find PDFs.
    # --------------------------------------------------------

    pdf_files = sorted(
        PDF_DIR.glob("*.pdf")
    )

    if not pdf_files:

        print(
            "\nNo PDF files found."
        )

        print(
            f"Expected directory:\n"
            f"{PDF_DIR}"
        )

        return

    print(
        f"\nFound {len(pdf_files)} PDF(s)."
    )

    results = []

    # --------------------------------------------------------
    # Process PDFs.
    # --------------------------------------------------------

    for pdf_path in pdf_files:

        try:

            result = process_document(
                pdf_path
            )

            results.append(
                result
            )

        except Exception as exc:

            print(
                f"\nERROR processing "
                f"{pdf_path.name}: "
                f"{exc}"
            )

    # --------------------------------------------------------
    # Summary.
    # --------------------------------------------------------

    print("\n")
    print("=" * 60)
    print(
        " INGESTION SUMMARY"
    )
    print("=" * 60)

    for result in results:

        print(
            f"{result['document']}: "
            f"{result['pages']} pages | "
            f"{result['characters']:,} chars | "
            f"{result['sections']} sections"
        )

    print(
        "\nProcessed JSON directory:"
    )

    print(
        PROCESSED_DIR
    )

    print(
        "\nRaw text directory:"
    )

    print(
        RAW_DIR
    )

    print("\nDone.")


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    main()