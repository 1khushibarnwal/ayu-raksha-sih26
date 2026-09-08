


from pathlib import Path
import json
import re
from datetime import datetime

from pypdf import PdfReader


# ============================================================
# PATHS
# ============================================================

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
# INPUT NORMALIZATION
# ============================================================

def normalize_pages_input(pages):
    """
    Accept either:

        pages

    or:

        (pages, full_text)

    and always return the pages list.

    This prevents the recurring error:

        TypeError: list indices must be integers or slices, not str
    """

    if (
        isinstance(pages, tuple)
        and len(pages) == 2
        and isinstance(pages[0], list)
    ):
        return pages[0]

    if isinstance(pages, list):
        return pages

    raise TypeError(
        "Expected pages list or (pages, full_text) tuple."
    )


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_line(line: str) -> str:
    """
    Clean common PDF extraction artifacts.
    """

    line = line.replace("\x00", " ")
    line = line.replace("\u00ad", "")
    line = line.replace("\u00a0", " ")

    # Normalize repeated spaces/tabs.
    line = re.sub(r"[ \t]+", " ", line)

    return line.strip()


def clean_page_text(text: str) -> str:
    """
    Clean extracted page text while preserving line structure.
    """

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
    Extract text from every PDF page.

    Returns:

        pages:
            List of dictionaries:

                {
                    "page_number": 1,
                    "text": "..."
                }

        full_text:
            Complete document text.
    """

    print(f"\nReading: {pdf_path.name}")

    reader = PdfReader(str(pdf_path))

    pages = []

    for page_number, page in enumerate(
        reader.pages,
        start=1,
    ):
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
# GENERIC SECTION DETECTION
# ============================================================

def detect_section(line: str):
    """
    Detect common legal section/rule formats.

    Examples:

        1. Short title
        11. Application
        11A. Publication of applications
        Rule 3. Application
        Section 8. Information
    """

    # --------------------------------------------------------
    # Explicit "Section X"
    # --------------------------------------------------------

    match = re.match(
        r"^\s*SECTION\s+(\d+[A-Z]?)\s*\.?\s*(.+)$",
        line,
        re.IGNORECASE,
    )

    if match:
        return {
            "number": match.group(1).upper(),
            "title": match.group(2).strip(),
        }

    # --------------------------------------------------------
    # Explicit "Rule X"
    # --------------------------------------------------------

    match = re.match(
        r"^\s*RULE\s+(\d+[A-Z]?)\s*\.?\s*(.+)$",
        line,
        re.IGNORECASE,
    )

    if match:
        return {
            "number": match.group(1).upper(),
            "title": match.group(2).strip(),
        }

    # --------------------------------------------------------
    # Normal numbered legal provision
    # --------------------------------------------------------

    match = re.match(
        r"^\s*(\d+[A-Z]?)\s*\.\s+(.+)$",
        line,
    )

    if match:
        number = match.group(1).upper()
        title = match.group(2).strip()

        # Avoid treating enormous numbered paragraphs as sections.
        if len(title) <= 250:
            return {
                "number": number,
                "title": title,
            }

    return None


# ============================================================
# PATENTS ACT — SPECIALIZED PARSER
# ============================================================

SECTION_HEADING_RE = re.compile(
    r"^\s*(\d+[A-Z]?)\s*\.\s*(.+?)\s*$",
    re.IGNORECASE,
)


def normalize_for_match(text: str) -> str:
    """
    Normalize text for loose title comparison.
    """

    return re.sub(
        r"[^a-z0-9]+",
        " ",
        text.lower(),
    ).strip()


def section_number_sort_key(number: str):
    """
    Natural sorting:

        9
        10
        11
        11A
        11B
        12
        92A
        100
    """

    match = re.match(
        r"^(\d+)([A-Z]*)$",
        number.upper(),
    )

    if not match:
        return (999999, number)

    numeric_part = int(match.group(1))
    alpha_part = match.group(2)

    return (
        numeric_part,
        alpha_part,
    )


def clean_section_heading_text(text: str) -> str:
    """
    Clean text appearing after a section number.

    Keeps the actual body untouched but produces a cleaner
    title for comparison.
    """

    text = text.strip()

    # Remove common PDF amendment continuation markers.
    text = re.split(
        r"\s+[—–-]\s*\d*\s*\[?",
        text,
        maxsplit=1,
    )[0]

    text = re.sub(
        r"\s+",
        " ",
        text,
    ).strip()

    return text


# ============================================================
# PATENTS ACT BODY START
# ============================================================

def find_patents_act_body_start(pages):
    """
    Find the actual beginning of the Patents Act.

    IMPORTANT:

    This accepts either:

        pages

    or:

        (pages, full_text)
    """

    pages = normalize_pages_input(pages)

    for page in pages:

        page_text = page.get("text", "")

        for line_index, line in enumerate(
            page_text.splitlines()
        ):
            if (
                "This Act may be called the Patents Act, 1970"
                in line
            ):
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
    Extract section numbers/titles from the TOC.

    The TOC is used as a reference set, not as an exact
    representation of the body.
    """

    pages = normalize_pages_input(pages)

    toc = {}
    expected_numbers = []

    for page in pages:

        if page["page_number"] >= body_page:
            break

        for line in page["text"].splitlines():

            match = SECTION_HEADING_RE.match(line)

            if not match:
                continue

            number = match.group(1).upper()
            title = match.group(2).strip()

            if len(title) < 5:
                continue

            if not re.search(
                r"[A-Za-z]",
                title,
            ):
                continue

            if number not in toc:

                toc[number] = title
                expected_numbers.append(number)

    return toc, expected_numbers


# ============================================================
# PATENTS ACT HEADING VALIDATION
# ============================================================

def is_valid_patents_section_heading(
    number,
    text,
    expected_numbers,
    toc,
):
    """
    Validate a possible Patents Act heading.

    Rules:

    1. Number must exist in the TOC.
    2. Heading must contain readable text.
    3. If a TOC title exists, compare the extracted heading
       with it loosely.
    4. Amendment markers after a legitimate title are allowed.
    """

    number = number.upper()

    # --------------------------------------------------------
    # 1. Number must exist in TOC.
    # --------------------------------------------------------

    if number not in expected_numbers:
        return False

    # --------------------------------------------------------
    # 2. Clean heading.
    # --------------------------------------------------------

    cleaned_text = clean_section_heading_text(text)

    if len(cleaned_text) < 5:
        return False

    if not re.search(
        r"[A-Za-z]",
        cleaned_text,
    ):
        return False

    # --------------------------------------------------------
    # 3. Compare against TOC.
    # --------------------------------------------------------

    toc_title = toc.get(
        number,
        "",
    )

    if not toc_title:
        return True

    normalized_body = normalize_for_match(
        cleaned_text
    )

    normalized_toc = normalize_for_match(
        toc_title
    )

    if not normalized_body:
        return False

    if not normalized_toc:
        return True

    # Exact match.
    if normalized_body == normalized_toc:
        return True

    # Body heading starts with TOC title.
    if normalized_body.startswith(
        normalized_toc
    ):
        return True

    # Compare first several words.
    body_words = normalized_body.split()
    toc_words = normalized_toc.split()

    compare_count = min(
        6,
        len(body_words),
        len(toc_words),
    )

    if compare_count >= 3:

        if (
            body_words[:compare_count]
            == toc_words[:compare_count]
        ):
            return True

    return False


# ============================================================
# PATENTS ACT PARSER
# ============================================================

def parse_patents_act(pages):
    """
    Parse the Patents Act.

    This version does NOT require the body to follow one
    perfectly continuous TOC sequence.

    Instead:

        TOC
          ↓
        valid section numbers
          ↓
        actual body scan
          ↓
        section extraction

    This is much safer for PDFs containing amendment notes,
    inserted text and irregular extraction.
    """

    pages = normalize_pages_input(pages)

    # --------------------------------------------------------
    # Locate Act body.
    # --------------------------------------------------------

    body_page, body_line_index = (
        find_patents_act_body_start(
            pages
        )
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

    expected_number_set = set(
        expected_numbers
    )

    sections = []

    current_section = None

    current_chapter = None
    current_part = None

    body_started = False

    seen_numbers = set()

    # --------------------------------------------------------
    # Scan actual Act body.
    # --------------------------------------------------------

    for page in pages:

        page_number = page["page_number"]

        if page_number < body_page:
            continue

        lines = page["text"].splitlines()

        for line_index, line in enumerate(lines):

            # ------------------------------------------------
            # Skip lines before body start.
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
            # Possible section heading.
            # ------------------------------------------------

            match = SECTION_HEADING_RE.match(line)

            if not match:
                continue

            number = match.group(1).upper()
            remainder = match.group(2).strip()

            # ------------------------------------------------
            # Must be a number known by TOC.
            # ------------------------------------------------

            if number not in expected_number_set:
                continue

            # ------------------------------------------------
            # Validate heading.
            # ------------------------------------------------

            valid = is_valid_patents_section_heading(
                number=number,
                text=remainder,
                expected_numbers=expected_number_set,
                toc=toc,
            )

            if not valid:
                continue

            # ------------------------------------------------
            # Duplicate section?
            # ------------------------------------------------

            if number in seen_numbers:

                if current_section is not None:

                    current_section[
                        "_lines"
                    ].append(line)

                continue

            # ------------------------------------------------
            # Save previous section.
            # ------------------------------------------------

            if current_section is not None:

                current_section["page_end"] = (
                    page_number
                )

                current_section["text"] = (
                    "\n".join(
                        current_section.pop(
                            "_lines"
                        )
                    ).strip()
                )

                sections.append(
                    current_section
                )

            # ------------------------------------------------
            # Start new section.
            # ------------------------------------------------

            title = toc.get(
                number,
                clean_section_heading_text(
                    remainder
                ),
            )

            current_section = {
                "number": number,
                "title": title,
                "chapter": current_chapter,
                "part": current_part,
                "page_start": page_number,
                "page_end": page_number,
                "text": "",
                "_lines": [line],
            }

            seen_numbers.add(number)

    # --------------------------------------------------------
    # Save final section.
    # --------------------------------------------------------

    if current_section is not None:

        current_section["page_end"] = (
            pages[-1]["page_number"]
        )

        current_section["text"] = (
            "\n".join(
                current_section.pop(
                    "_lines"
                )
            ).strip()
        )

        sections.append(
            current_section
        )

    # --------------------------------------------------------
    # Sort by document position.
    # --------------------------------------------------------

    sections.sort(
        key=lambda section: (
            section["page_start"],
            section_number_sort_key(
                section["number"]
            ),
        )
    )

    # --------------------------------------------------------
    # Missing sections.
    # --------------------------------------------------------

    parsed_numbers = {
        section["number"]
        for section in sections
    }

    missing = [
        number
        for number in expected_numbers
        if number not in parsed_numbers
    ]

    print(
        f"Actual sections parsed   : "
        f"{len(sections)}"
    )

    print(
        f"Unique section numbers   : "
        f"{len(parsed_numbers)}"
    )

    if missing:

        print(
            f"WARNING: {len(missing)} TOC "
            f"section(s) were not located."
        )

        print(
            "Missing sections:",
            ", ".join(missing),
        )

    else:

        print(
            "All expected Patents Act sections "
            "parsed successfully."
        )

    return sections


# ============================================================
# GENERIC DOCUMENT PARSER
# ============================================================

def build_sections_generic(pages):
    """
    Generic parser for Drugs Rules and Cosmetics Rules.
    """

    pages = normalize_pages_input(pages)

    sections = []

    current_section = None
    current_chapter = None
    current_part = None

    for page in pages:

        page_number = page["page_number"]
        text = page["text"]

        if not text:
            continue

        lines = text.splitlines()

        for line in lines:

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
            # Section / Rule.
            # ------------------------------------------------

            detected = detect_section(line)

            if detected:

                # Save previous section.
                if current_section:

                    current_section["text"] = (
                        "\n".join(
                            current_section[
                                "text_lines"
                            ]
                        ).strip()
                    )

                    del current_section[
                        "text_lines"
                    ]

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

                # Start new section.
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
                    "text_lines": [],
                }

                if detected["title"]:

                    current_section[
                        "text_lines"
                    ].append(
                        detected["title"]
                    )

                continue

            # ------------------------------------------------
            # Body text.
            # ------------------------------------------------

            if current_section:

                current_section[
                    "text_lines"
                ].append(line)

    # --------------------------------------------------------
    # Save final section.
    # --------------------------------------------------------

    if current_section:

        current_section["text"] = (
            "\n".join(
                current_section[
                    "text_lines"
                ]
            ).strip()
        )

        del current_section[
            "text_lines"
        ]

        sections.append(
            current_section
        )

    return sections


# ============================================================
# SELECT PARSER
# ============================================================

def build_sections(
    pages,
    document_id=None,
):
    """
    Select parser according to document.
    """

    pages = normalize_pages_input(pages)

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
    Create processed JSON representation.
    """

    pages = normalize_pages_input(pages)

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
        "title": metadata["title"],
        "source": metadata["source"],
        "document_type": metadata[
            "document_type"
        ],
        "filename": pdf_path.name,
        "ingested_at": datetime.now().isoformat(),
        "page_count": len(pages),
        "character_count": len(full_text),
        "section_count": len(sections),
        "sections": sections,
        "pages": pages,
    }


# ============================================================
# PROCESS ONE DOCUMENT
# ============================================================

def process_document(
    pdf_path: Path,
):
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

    document_json = create_document_json(
        document_id=document_id,
        pdf_path=pdf_path,
        pages=pages,
        full_text=full_text,
        sections=sections,
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
        "characters": len(full_text),
        "sections": len(sections),
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

    for pdf_path in pdf_files:

        try:

            result = process_document(
                pdf_path
            )

            results.append(result)

        except Exception as exc:

            print(
                f"\nERROR processing "
                f"{pdf_path.name}: {exc}"
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

