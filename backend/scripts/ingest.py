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
# TEXT CLEANING
# ============================================================

def clean_line(line: str) -> str:
    """
    Clean common PDF extraction artifacts from a single line.
    """

    line = line.replace("\x00", " ")
    line = line.replace("\u00ad", "")  # soft hyphen

    # Collapse repeated whitespace
    line = re.sub(r"[ \t]+", " ", line)

    return line.strip()


def clean_page_text(text: str) -> str:
    """
    Clean extracted text while preserving line structure.
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
    Extract text from every page of a PDF.

    Returns:
        pages: list of dictionaries containing page number and text
        full_text: complete document text
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
                "page": page_number,
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
    Detect chapter headings such as:

        CHAPTER I
        CHAPTER II
        Chapter III
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
    Detect part headings such as:

        PART I
        PART II
        PART A
    """

    match = re.match(
        r"^\s*PART\s+([IVXLCDM]+|\d+|[A-Z])\s*$",
        line,
        re.IGNORECASE,
    )

    if not match:
        return None

    return match.group(1).upper()


def detect_section(line: str):
    """
    Detect common legal section/rule formats.

    Examples:

        1. Short title
        2. Definitions
        11A. Publication of application
        Rule 3. Application
        Section 8. Information...
    """

    # Explicit "Section X"
    match = re.match(
        r"^\s*SECTION\s+(\d+[A-Z]?)\.?\s*(.*)$",
        line,
        re.IGNORECASE,
    )

    if match:
        return {
            "number": match.group(1),
            "title": match.group(2).strip(),
        }

    # Explicit "Rule X"
    match = re.match(
        r"^\s*RULE\s+(\d+[A-Z]?)\.?\s*(.*)$",
        line,
        re.IGNORECASE,
    )

    if match:
        return {
            "number": match.group(1),
            "title": match.group(2).strip(),
        }

    # Normal numbered legal provision:
    #
    # 1. Short title
    # 11A. Publication of application
    #
    match = re.match(
        r"^\s*(\d+[A-Z]?)\.\s+(.+)$",
        line,
    )

    if match:
        number = match.group(1)
        title = match.group(2).strip()

        # Avoid treating ordinary numbered lists as legal sections.
        # Legal headings generally have reasonably short titles.
        if len(title) <= 250:
            return {
                "number": number,
                "title": title,
            }

    return None

# ============================================================
# PATENTS ACT — SPECIALIZED SECTION PARSER
# ============================================================

SECTION_HEADING_RE = re.compile(
    r"^\s*(\d+[A-Z]?)\.\s+(.+?)\s*$"
)

AMENDMENT_NOTE_PREFIXES = (
    "ins. by",
    "subs. by",
    "clause",
    "sub-clause",
    "omitted by",
    "inserted by",
    "substituted by",
    "the words",
    "the proviso",
    "vide notification",
)


def normalize_for_match(text):
    """
    Normalize text so that minor PDF extraction differences
    in punctuation/spacing do not affect comparisons.
    """
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def find_patents_act_body_start(pages):
    """
    Find the first real occurrence of Section 1 in the Act body.

    The TOC also contains:
        1. Short title, extent and commencement.

    We distinguish the real body because it contains:
        This Act may be called the Patents Act, 1970.
    """

    for page in pages:
        for line_index, line in enumerate(page["text"].splitlines()):

            if "This Act may be called the Patents Act, 1970" in line:
                return page["page_number"], line_index

    raise ValueError(
        "Could not locate the beginning of the Patents Act body."
    )


def extract_patents_act_toc(pages, body_page):
    """
    Extract the section sequence from the Table of Contents.

    The TOC is extremely useful because it tells us which section
    numbers are actually valid.
    """

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

            # Ignore obviously invalid fragments.
            if len(title) < 5:
                continue

            if not re.search(r"[A-Za-z]", title):
                continue

            if number not in toc:
                toc[number] = title
                expected_numbers.append(number)

    return toc, expected_numbers


def looks_like_amendment_note(text):
    """
    Reject numbered footnotes such as:

        1. Ins. by Act 38 of 2002...
        2. Subs. by s. 5...
        3. The words "... omitted...
    """

    normalized = text.strip().lower()

    for prefix in AMENDMENT_NOTE_PREFIXES:
        if normalized.startswith(prefix):
            return True

    # Most amendment notes contain these patterns.
    amendment_patterns = [
        "w.e.f.",
        "ibid.",
        "for clause",
        "for sub-section",
        "for certain words",
        "with effect from",
    ]

    for pattern in amendment_patterns:
        if pattern in normalized:
            return True

    return False


def is_valid_patents_section_heading(
    number,
    text,
    expected_number,
    toc_title
):
    """
    Determine whether a numbered line is a genuine section heading.
    """

    # It must be the section we are currently expecting.
    if number != expected_number:
        return False

    # Remove obvious amendment footnotes.
    if looks_like_amendment_note(text):
        return False

    # Reject tiny garbage fragments such as:
    # 73 .
    # 133 ;]
    if len(text.strip()) < 5:
        return False

    if not re.search(r"[A-Za-z]", text):
        return False

    # The body heading should correspond to the title in the TOC.
    normalized_body = normalize_for_match(text)
    normalized_toc = normalize_for_match(toc_title)

    if not normalized_body.startswith(normalized_toc):
        return False

    return True


def parse_patents_act(pages):
    """
    Parse the Patents Act using:

        TOC → expected section sequence → actual body

    This prevents numbered amendment footnotes and sub-content
    from becoming fake sections.
    """

    body_page, body_line_index = find_patents_act_body_start(pages)

    toc, expected_numbers = extract_patents_act_toc(
        pages,
        body_page
    )

    print(f"TOC sections detected : {len(expected_numbers)}")

    sections = []

    expected_index = 0
    current_section = None

    body_started = False

    for page in pages:

        page_number = page["page_number"]

        # Skip everything before the Act body.
        if page_number < body_page:
            continue

        lines = page["text"].splitlines()

        for line_index, line in enumerate(lines):

            # On the first body page, skip lines before Section 1.
            if (
                page_number == body_page
                and not body_started
                and line_index < body_line_index
            ):
                continue

            body_started = True

            match = SECTION_HEADING_RE.match(line)

            if match:

                number = match.group(1).upper()
                remainder = match.group(2).strip()

                if expected_index < len(expected_numbers):

                    expected_number = expected_numbers[expected_index]

                    toc_title = toc.get(
                        expected_number,
                        ""
                    )

                    if is_valid_patents_section_heading(
                        number,
                        remainder,
                        expected_number,
                        toc_title
                    ):

                        # Save previous section.
                        if current_section is not None:
                            current_section["page_end"] = page_number

                            current_section["text"] = "\n".join(
                                current_section.pop("_lines")
                            ).strip()

                            sections.append(current_section)

                        current_section = {
                            "number": number,
                            "title": toc_title,
                            "chapter": None,
                            "part": None,
                            "page_start": page_number,
                            "page_end": page_number,
                            "text": "",
                            "_lines": [line],
                        }

                        expected_index += 1

                        continue

            # Track chapter information.
            chapter = detect_chapter(line)

            if chapter and current_section is not None:
                current_section["chapter"] = chapter

            # Track part information.
            part = detect_part(line)

            if part and current_section is not None:
                current_section["part"] = part

            # Add normal body text to current section.
            if current_section is not None:
                current_section["_lines"].append(line)

    # Save final section.
    if current_section is not None:

        current_section["page_end"] = pages[-1]["page_number"]

        current_section["text"] = "\n".join(
            current_section.pop("_lines")
        ).strip()

        sections.append(current_section)

    missing = expected_numbers[expected_index:]

    print(f"Actual sections parsed   : {len(sections)}")

    if missing:
        print(
            "WARNING: Sections not parsed:",
            ", ".join(missing)
        )

    return sections

# ============================================================
# DOCUMENT STRUCTURING
# ============================================================

def build_sections_generic(pages):
    """
    Convert extracted page text into approximate legal sections.

    IMPORTANT:
    This is a first-pass structural parser.
    It does not attempt to understand the legal meaning
    of the document.
    """

    sections = []

    current_section = None
    current_chapter = None
    current_part = None

    for page in pages:
        page_number = page["page"]
        text = page["text"]

        if not text:
            continue

        lines = text.splitlines()

        for line in lines:

            # -----------------------------------------------
            # Chapter
            # -----------------------------------------------

            chapter = detect_chapter(line)

            if chapter:
                current_chapter = chapter
                continue

            # -----------------------------------------------
            # Part
            # -----------------------------------------------

            part = detect_part(line)

            if part:
                current_part = part
                continue

            # -----------------------------------------------
            # Section / Rule
            # -----------------------------------------------

            detected = detect_section(line)

            if detected:

                # Save previous section
                if current_section:
                    current_section["text"] = (
                        "\n".join(current_section["text_lines"])
                        .strip()
                    )

                    del current_section["text_lines"]

                    current_section["page_end"] = (
                        page_number - 1
                        if page_number > current_section["page_start"]
                        else page_number
                    )

                    sections.append(current_section)

                current_section = {
                    "number": detected["number"],
                    "title": detected["title"],
                    "chapter": current_chapter,
                    "part": current_part,
                    "page_start": page_number,
                    "page_end": page_number,
                    "text_lines": [],
                }

                # The heading itself is useful content.
                if detected["title"]:
                    current_section["text_lines"].append(
                        detected["title"]
                    )

                continue

            # -----------------------------------------------
            # Section body
            # -----------------------------------------------

            if current_section:
                current_section["text_lines"].append(line)

    # Save final section
    if current_section:

        current_section["text"] = (
            "\n".join(current_section["text_lines"])
            .strip()
        )

        del current_section["text_lines"]

        sections.append(current_section)

    return sections

def build_sections(pages, document_id=None):
    """
    Select the appropriate parser for each document.
    """

    if document_id == "patents_act_1970":
        return parse_patents_act(pages)

    return build_sections_generic(pages)

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
        "document_type": metadata["document_type"],
        "filename": pdf_path.name,
        "ingested_at": datetime.now().isoformat(),
        "page_count": len(pages),
        "character_count": len(full_text),
        "section_count": len(sections),

        "sections": sections,

        # Keeping the page-level text is useful for
        # debugging and future citation support.
        "pages": pages,
    }


# ============================================================
# PROCESS ONE DOCUMENT
# ============================================================

def process_document(pdf_path: Path):

    document_id = pdf_path.stem

    print("\n" + "=" * 60)
    print(f"PROCESSING: {pdf_path.name}")
    print("=" * 60)

    # --------------------------------------------------------
    # Extract
    # --------------------------------------------------------

    pages, full_text = extract_pdf(pdf_path)

    print(f"Pages extracted : {len(pages)}")
    print(f"Characters      : {len(full_text):,}")

    # --------------------------------------------------------
    # Save raw text
    # --------------------------------------------------------

    raw_path = RAW_DIR / f"{document_id}.txt"

    raw_path.write_text(
        full_text,
        encoding="utf-8",
    )

    print(f"Raw text saved  : {raw_path}")

    # --------------------------------------------------------
    # Parse structure
    # --------------------------------------------------------

    sections = build_sections(pages, document_id=document_id)

    print(f"Sections found  : {len(sections)}")

    # --------------------------------------------------------
    # Create JSON
    # --------------------------------------------------------

    document_json = create_document_json(
        document_id=document_id,
        pdf_path=pdf_path,
        pages=pages,
        full_text=full_text,
        sections=sections,
    )

    json_path = PROCESSED_DIR / f"{document_id}.json"

    json_path.write_text(
        json.dumps(
            document_json,
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    print(f"JSON saved      : {json_path}")

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
    print(" AYU-RAKSHA DOCUMENT INGESTION")
    print("=" * 60)

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))

    if not pdf_files:
        print("\nNo PDF files found.")
        print(f"Expected directory:\n{PDF_DIR}")
        return

    print(f"\nFound {len(pdf_files)} PDF(s).")

    results = []

    for pdf_path in pdf_files:

        try:
            result = process_document(pdf_path)
            results.append(result)

        except Exception as exc:
            print(
                f"\nERROR processing "
                f"{pdf_path.name}: {exc}"
            )

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    print("\n")
    print("=" * 60)
    print(" INGESTION SUMMARY")
    print("=" * 60)

    for result in results:
        print(
            f"{result['document']}: "
            f"{result['pages']} pages | "
            f"{result['characters']:,} chars | "
            f"{result['sections']} sections"
        )

    print("\nProcessed JSON directory:")
    print(PROCESSED_DIR)

    print("\nRaw text directory:")
    print(RAW_DIR)

    print("\nDone.")


if __name__ == "__main__":
    main()