import json
import re
from pathlib import Path
from datetime import datetime


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PROCESSED_DIR = BASE_DIR / "data" / "processed"
OUTPUT_FILE = PROCESSED_DIR / "chunks.json"


# ============================================================
# CHUNK SETTINGS
# ============================================================

MAX_CHUNK_SIZE = 3500


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text):
    if not text:
        return ""

    # Remove CDSCO repeated header
    text = re.sub(
        r"Central Drugs Standard Control Organization,\s*"
        r"Ministry of Health and Family Welfare,\s*"
        r"Govt\. of India\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    # Remove "Page X of Y"
    text = re.sub(
        r"Page\s+\d+\s+of\s+\d+",
        "",
        text,
        flags=re.IGNORECASE
    )

    # Normalize spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Normalize excessive newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove spaces before punctuation
    text = re.sub(r"\s+([,.;:])", r"\1", text)

    return text.strip()


# ============================================================
# LEGAL SECTION DETECTION
# ============================================================

def split_into_legal_sections(text):
    """
    Split legal text whenever a new numbered section/rule begins.

    Examples:

    3. What are not inventions.
    4. Inventions relating to atomic energy not patentable.

    21. Application for licence...
    22. Conditions of licence...
    """

    # Matches things like:
    #
    # 3. What are not inventions.
    # 4. Inventions relating to atomic energy not patentable.
    # 21. Application...
    #
    # The section number must appear at the beginning of a line.

    pattern = re.compile(
        r"(?m)^(?P<number>\d{1,3})\.\s+(?P<title>[A-Z][^\n]*)"
    )

    matches = list(pattern.finditer(text))

    if not matches:
        return [{
            "section": None,
            "title": None,
            "text": text
        }]

    sections = []

    # Text before first section
    if matches[0].start() > 0:
        preamble = text[:matches[0].start()].strip()

        if preamble:
            sections.append({
                "section": None,
                "title": None,
                "text": preamble
            })

    for i, match in enumerate(matches):

        start = match.start()

        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(text)

        section_text = text[start:end].strip()

        sections.append({
            "section": match.group("number"),
            "title": match.group("title").strip(),
            "text": section_text
        })

    return sections


# ============================================================
# CHUNK LARGE SECTIONS
# ============================================================

def split_large_section(section):
    """
    If a legal section is very large, split it into smaller chunks.
    """

    text = section["text"]

    if len(text) <= MAX_CHUNK_SIZE:
        return [section]

    chunks = []

    start = 0

    while start < len(text):

        end = min(
            start + MAX_CHUNK_SIZE,
            len(text)
        )

        # Try to end at a paragraph
        if end < len(text):

            paragraph_break = text.rfind(
                "\n\n",
                start,
                end
            )

            if paragraph_break > start + 1000:
                end = paragraph_break

        chunk_text = text[start:end].strip()

        if chunk_text:

            chunks.append({
                "section": section["section"],
                "title": section["title"],
                "text": chunk_text
            })

        start = end

    return chunks


# ============================================================
# DOCUMENT PROCESSING
# ============================================================

def process_document(json_file):

    with open(json_file, "r", encoding="utf-8") as f:
        document = json.load(f)

    document_id = document["document_id"]
    title = document["title"]
    source = document["source"]

    # --------------------------------------------------------
    # Combine ALL pages first.
    # This is important.
    # --------------------------------------------------------

    full_text_parts = []

    for page in document.get("pages", []):

        page_text = clean_text(
            page.get("text", "")
        )

        if page_text:
            full_text_parts.append(page_text)

    full_text = "\n\n".join(full_text_parts)

    if not full_text:
        return []

    # --------------------------------------------------------
    # Split document into legal sections
    # --------------------------------------------------------

    sections = split_into_legal_sections(full_text)

    # --------------------------------------------------------
    # Split very large sections if necessary
    # --------------------------------------------------------

    final_sections = []

    for section in sections:

        pieces = split_large_section(section)

        final_sections.extend(pieces)

    # --------------------------------------------------------
    # Create chunks
    # --------------------------------------------------------

    chunks = []

    for index, section in enumerate(final_sections, start=1):

        section_number = section["section"]
        section_title = section["title"]
        section_text = section["text"]

        chunks.append({

            "chunk_id":
                f"{document_id}_{index}",

            "document_id":
                document_id,

            "document_title":
                title,

            "source":
                source,

            "section":
                section_number,

            "section_title":
                section_title,

            "text":
                section_text
        })

    return chunks


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("LEGAL DOCUMENT CHUNKING")
    print("=" * 60)

    json_files = [
        file
        for file in PROCESSED_DIR.glob("*.json")
        if file.name != "chunks.json"
    ]

    if not json_files:

        print("No processed JSON files found.")
        return

    all_chunks = []

    for json_file in json_files:

        print(
            f"\nProcessing: {json_file.name}"
        )

        document_chunks = process_document(
            json_file
        )

        all_chunks.extend(
            document_chunks
        )

        print(
            f"Chunks created: "
            f"{len(document_chunks)}"
        )

    output = {

        "created_at":
            datetime.utcnow().isoformat(),

        "chunk_size":
            MAX_CHUNK_SIZE,

        "total_chunks":
            len(all_chunks),

        "chunks":
            all_chunks
    }

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            output,
            f,
            ensure_ascii=False,
            indent=2
        )

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)

    print(
        f"Total chunks: "
        f"{len(all_chunks)}"
    )

    print(
        f"Output: "
        f"{OUTPUT_FILE}"
    )


if __name__ == "__main__":
    main()