import json
import re
import time
from pathlib import Path

import requests
from pypdf import PdfReader


# ============================================================
# CONFIGURATION
# ============================================================

# Official IP India consolidated Patents Act PDF.
# Incorporates amendments till 01-08-2024.
PDF_URL = (
    "https://ipindia.gov.in/frontend/pdf/patents/"
    "1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf"
)

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
PDF_DIR = DATA_DIR / "pdfs"

PDF_FILE = PDF_DIR / "patents_act_1970.pdf"
OUTPUT_FILE = DATA_DIR / "patents_act.json"


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0 Safari/537.36"
    )
}


# ============================================================
# CHAPTER MAPPING
# ============================================================

# These ranges correspond to the structure of the Patents Act.
#
# Note:
# Some chapters contain omitted sections and some section
# numbers contain letters such as 11A, 11B and 157A.

CHAPTER_RANGES = [
    (1, 2, "Chapter I", "Preliminary"),
    (3, 5, "Chapter II", "Inventions Not Patentable"),
    (6, 11, "Chapter III", "Applications for Patents"),
    (11, 24, "Chapter IV", "Publication and Examination of Applications"),
    (25, 28, "Chapter V", "Opposition Proceedings to Grant of Patents"),
    (29, 34, "Chapter VI", "Anticipation"),
    (35, 42, "Chapter VII", "Provisions for Secrecy of Certain Inventions"),
    (43, 53, "Chapter VIII", "Grant of Patents and Rights Conferred Thereby"),
    (54, 56, "Chapter IX", "Patents of Addition"),
    (57, 59, "Chapter X", "Amendment of Applications and Specifications"),
    (60, 62, "Chapter XI", "Restoration of Lapsed Patents"),
    (63, 66, "Chapter XII", "Surrender and Revocation of Patents"),
    (67, 72, "Chapter XIII", "Register of Patents"),
    (73, 76, "Chapter XIV", "Patent Office and Its Establishment"),
    (77, 81, "Chapter XV", "Powers of Controller Generally"),
    (82, 98, "Chapter XVI", "Working of Patents, Compulsory Licences and Revocation"),
    (
        99,
        103,
        "Chapter XVII",
        "Use of Inventions for Purposes of Government and Acquisition of Inventions by Central Government",
    ),
    (104, 115, "Chapter XVIII", "Suits Concerning Infringement of Patents"),
    (116, 117, "Chapter XIX", "Appeals to the Appellate Board"),
    (118, 124, "Chapter XX", "Penalties"),
    (125, 132, "Chapter XXI", "Patent Agents"),
    (133, 139, "Chapter XXII", "International Arrangements"),
    (140, 163, "Chapter XXIII", "Miscellaneous"),
]


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text: str) -> str:
    """
    Normalize PDF-extracted text while preserving paragraphs.
    """

    if not text:
        return ""

    # Normalize non-breaking spaces.
    text = text.replace("\xa0", " ")

    # Normalize Windows line endings.
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Remove excessive horizontal whitespace.
    text = re.sub(r"[ \t]+", " ", text)

    # Remove spaces before punctuation.
    text = re.sub(r"\s+([,.;:])", r"\1", text)

    # Normalize excessive blank lines.
    text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)

    return text.strip()


def normalize_lines(text: str):
    """
    Convert extracted PDF text into clean lines.
    """

    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    lines = []

    for line in text.split("\n"):

        line = re.sub(r"[ \t]+", " ", line).strip()

        if line:
            lines.append(line)

    return lines


# ============================================================
# DOWNLOAD PDF
# ============================================================

def download_pdf():
    """
    Download the official IP India PDF.
    """

    PDF_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    if PDF_FILE.exists():

        print(
            f"PDF already exists:\n{PDF_FILE}"
        )

        return

    print("Downloading official IP India PDF...")
    print(PDF_URL)
    print()

    response = requests.get(
        PDF_URL,
        headers=HEADERS,
        timeout=60,
    )

    response.raise_for_status()

    content_type = response.headers.get(
        "Content-Type",
        ""
    ).lower()

    if "pdf" not in content_type:

        print(
            "WARNING: Server did not explicitly "
            "identify the response as a PDF."
        )

    with open(PDF_FILE, "wb") as file:
        file.write(response.content)

    print(
        f"Downloaded PDF "
        f"({len(response.content) / 1024:.1f} KB)"
    )

    print(
        f"Saved to:\n{PDF_FILE}"
    )

    print()


# ============================================================
# PDF EXTRACTION
# ============================================================

def extract_pdf_text():
    """
    Extract text from every page of the PDF.
    """

    print("Reading PDF...")

    reader = PdfReader(str(PDF_FILE))

    print(
        f"PDF contains {len(reader.pages)} pages."
    )

    pages = []

    for index, page in enumerate(reader.pages):

        print(
            f"Extracting page "
            f"{index + 1}/{len(reader.pages)}...",
            end="\r",
        )

        text = page.extract_text()

        if text:
            pages.append(text)

    print()

    full_text = "\n\n".join(pages)

    print(
        f"Extracted approximately "
        f"{len(full_text):,} characters."
    )

    return full_text


# ============================================================
# CHAPTER DETECTION
# ============================================================

def roman_to_int(value: str):
    """
    Convert Roman numerals to integers.
    """

    values = {
        "I": 1,
        "V": 5,
        "X": 10,
        "L": 50,
        "C": 100,
        "D": 500,
        "M": 1000,
    }

    value = value.upper()

    total = 0
    previous = 0

    for char in reversed(value):

        current = values.get(char, 0)

        if current < previous:
            total -= current
        else:
            total += current

        previous = current

    return total


def detect_chapter(line: str):
    """
    Detect chapter headings such as:

        CHAPTER I
        CHAPTER II
        CHAPTER XVIII

    Returns chapter metadata.
    """

    match = re.match(
        r"^CHAPTER\s+([IVXLCDM]+)\b",
        line.strip(),
        re.IGNORECASE,
    )

    if not match:
        return None

    roman = match.group(1).upper()

    number = roman_to_int(roman)

    # Find the corresponding chapter metadata.
    for start, end, chapter, title in CHAPTER_RANGES:

        chapter_match = re.search(
            r"Chapter\s+(\d+)",
            chapter,
            re.IGNORECASE,
        )

        if not chapter_match:
            continue

        chapter_number = int(
            chapter_match.group(1)
        )

        if number == chapter_number:

            return {
                "number": number,
                "name": chapter,
                "title": title,
            }

    # Fallback if the chapter is not in our mapping.
    return {
        "number": number,
        "name": f"Chapter {roman}",
        "title": None,
    }

# ============================================================
# SECTION DETECTION
# ============================================================

def section_sort_key(section):
    """
    Sort section numbers correctly.

    Examples:

        10
        11
        11A
        11B
        12
    """

    match = re.match(
        r"^(\d+)([A-Za-z]*)$",
        section,
    )

    if not match:
        return (9999, "")

    number = int(match.group(1))
    suffix = match.group(2).upper()

    return (number, suffix)


def is_section_heading(line: str):
    """
    Detect section headings.

    Examples:

        1. Short title, extent and commencement.
        2. Definitions and interpretation.
        11A. Publication of applications.
        157A. Protection of security of India.

    We deliberately avoid lines such as:

        1. (1) This Act may be called...
        2. (a) ...
    
    because those are subsections rather than section headings.
    """

    match = re.match(
        r"^(\d+[A-Za-z]?)\.\s+(.+)$",
        line.strip(),
    )

    if not match:
        return None

    section_number = match.group(1)
    title = match.group(2).strip()

    # Reject subsection-style lines.
    if title.startswith("("):
        return None

    # Reject suspiciously short titles.
    if len(title) < 3:
        return None

    return section_number, title


# ============================================================
# CHAPTER LOOKUP
# ============================================================

def determine_chapter(section_number):
    """
    Determine the chapter for a section.
    """

    match = re.match(
        r"^(\d+)",
        section_number,
    )

    if not match:
        return None

    number = int(match.group(1))

    for start, end, chapter, title in CHAPTER_RANGES:

        if start <= number <= end:

            return {
                "name": chapter,
                "title": title,
            }

    return None


# ============================================================
# REMOVE PDF NOISE
# ============================================================

def remove_common_pdf_noise(lines):
    """
    Remove common headers/footers and page numbers.

    This is intentionally conservative.
    """

    cleaned = []

    for line in lines:

        stripped = line.strip()

        if not stripped:
            continue

        # Standalone page numbers.
        if re.fullmatch(
            r"\d+",
            stripped,
        ):
            continue

        # Common repeated PDF labels.
        if stripped.upper() in {
            "THE PATENTS ACT, 1970",
            "THE PATENTS ACT 1970",
        }:
            continue

        cleaned.append(stripped)

    return cleaned


# ============================================================
# FIND ACT BODY
# ============================================================

def find_act_body(lines):
    """
    Try to skip the table of contents.

    The official PDF starts with an arrangement of sections.
    We want the actual Act text rather than the TOC.
    """

    for index, line in enumerate(lines):

        upper = line.upper()

        if (
            "ACT NO. 39 OF 1970" in upper
            or "[19TH SEPTEMBER, 1970.]" in upper
        ):
            print(
                "Located beginning of the Act body."
            )

            return lines[index:]

    print(
        "WARNING: Could not locate the expected "
        "Act header. Using complete PDF text."
    )

    return lines


# ============================================================
# PARSE SECTIONS
# ============================================================

def parse_sections(lines):
    """
    Parse the Act into section-level records.
    """

    records = []

    current_section = None
    current_title = None
    current_chapter = None
    current_content = []

    def save_current_section():

        nonlocal current_section
        nonlocal current_title
        nonlocal current_content
        nonlocal current_chapter

        if current_section is None:
            return

        content = clean_text(
            "\n".join(current_content)
        )

        if not content:
            return

        chapter_name = None
        chapter_title = None

        if current_chapter:

            chapter_name = current_chapter["name"]
            chapter_title = current_chapter["title"]

        else:

            chapter = determine_chapter(
                current_section
            )

            if chapter:

                chapter_name = chapter["name"]
                chapter_title = chapter["title"]

        records.append(
            {
                "act": "Patents Act, 1970",
                "chapter": chapter_name,
                "chapter_title": chapter_title,
                "section": f"Section {current_section}",
                "section_number": current_section,
                "title": current_title,
                "content": content,
                "source": "IP India",
                "source_url": PDF_URL,
            }
        )

    for line in lines:

        # ----------------------------------------------------
        # Detect chapter.
        # ----------------------------------------------------

        chapter = detect_chapter(line)

        if chapter:

            current_chapter = chapter

            continue

        # ----------------------------------------------------
        # Detect section.
        # ----------------------------------------------------

        section = is_section_heading(line)

        if section:

            section_number, title = section

            # Save previous section.
            save_current_section()

            current_section = section_number
            current_title = title
            current_content = []

            continue

        # ----------------------------------------------------
        # Add content to current section.
        # ----------------------------------------------------

        if current_section is not None:

            current_content.append(line)

    # Save final section.
    save_current_section()

    return records


# ============================================================
# CLEAN RECORDS
# ============================================================

def clean_records(records):
    """
    Perform final cleanup on parsed records.
    """

    cleaned = []

    seen_sections = set()

    for record in records:

        section_number = record[
            "section_number"
        ]

        # Avoid accidental duplicate section detection.
        if section_number in seen_sections:
            continue

        content = record["content"]

        # Remove excessive whitespace.
        content = clean_text(content)

        # Skip suspiciously tiny records.
        if len(content) < 10:
            continue

        record["content"] = content

        cleaned.append(record)

        seen_sections.add(section_number)

    # Sort numerically.
    cleaned.sort(
        key=lambda item: section_sort_key(
            item["section_number"]
        )
    )

    return cleaned


# ============================================================
# SAVE JSON
# ============================================================

def save_json(records):

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8",
    ) as file:

        json.dump(
            records,
            file,
            ensure_ascii=False,
            indent=2,
        )

    print()
    print(
        f"Saved dataset to:\n{OUTPUT_FILE}"
    )


# ============================================================
# MAIN SCRAPER
# ============================================================

def scrape():

    print("=" * 50)
    print(" IP India Patents Act PDF Scraper")
    print("=" * 50)
    print()

    # --------------------------------------------------------
    # Step 1 — Download PDF
    # --------------------------------------------------------

    download_pdf()

    # Small pause before processing.
    time.sleep(0.5)

    # --------------------------------------------------------
    # Step 2 — Extract PDF text
    # --------------------------------------------------------

    text = extract_pdf_text()

    if not text.strip():

        raise RuntimeError(
            "No text could be extracted from the PDF."
        )

    # --------------------------------------------------------
    # Step 3 — Normalize lines
    # --------------------------------------------------------

    lines = normalize_lines(text)

    lines = remove_common_pdf_noise(lines)

    print(
        f"Normalized {len(lines):,} lines."
    )

    # --------------------------------------------------------
    # Step 4 — Find actual Act body
    # --------------------------------------------------------

    lines = find_act_body(lines)

    # --------------------------------------------------------
    # Step 5 — Parse sections
    # --------------------------------------------------------

    print()
    print("Parsing chapters and sections...")

    records = parse_sections(lines)

    print(
        f"Detected {len(records)} section records."
    )

    # --------------------------------------------------------
    # Step 6 — Clean records
    # --------------------------------------------------------

    records = clean_records(records)

    print(
        f"After cleanup: {len(records)} sections."
    )

    # --------------------------------------------------------
    # Step 7 — Save JSON
    # --------------------------------------------------------

    save_json(records)

    print()
    print("=" * 50)
    print(" Scraping complete.")
    print("=" * 50)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    scrape()
