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

# Approximate character-based chunking.
# ~1 token is roughly 4 characters for English text.
CHUNK_SIZE = 3000

# Overlap helps preserve context between chunks.
CHUNK_OVERLAP = 300


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(text):
    """
    Clean extracted PDF text while preserving useful content.
    """

    if not text:
        return ""

    # Normalize whitespace
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Fix spaces before punctuation
    text = re.sub(r"\s+([,.;:])", r"\1", text)

    return text.strip()


# ============================================================
# CHUNKING
# ============================================================

def create_chunks(text):
    """
    Split text into overlapping chunks.

    Character-based chunking is sufficient for the prototype.
    """

    text = clean_text(text)

    if not text:
        return []

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:

        end = start + CHUNK_SIZE

        # Don't cut in the middle of a sentence if possible.
        if end < text_length:

            paragraph_break = text.rfind("\n\n", start, end)

            sentence_break = max(
                text.rfind(". ", start, end),
                text.rfind("? ", start, end),
                text.rfind("! ", start, end),
            )

            if paragraph_break > start + CHUNK_SIZE // 2:
                end = paragraph_break

            elif sentence_break > start + CHUNK_SIZE // 2:
                end = sentence_break + 1

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        # Move forward while maintaining overlap.
        next_start = end - CHUNK_OVERLAP

        if next_start <= start:
            next_start = end

        start = next_start

    return chunks


# ============================================================
# DOCUMENT PROCESSING
# ============================================================

def process_document(json_file):
    """
    Read one processed document and create page-aware chunks.
    """

    with open(json_file, "r", encoding="utf-8") as f:
        document = json.load(f)

    document_id = document["document_id"]
    title = document["title"]
    source = document["source"]

    chunks = []

    chunk_counter = 0

    for page in document.get("pages", []):

        page_number = page["page"]
        page_text = clean_text(page["text"])

        if not page_text:
            continue

        page_chunks = create_chunks(page_text)

        for chunk_text in page_chunks:

            chunk_counter += 1

            chunks.append({
                "chunk_id": f"{document_id}_{chunk_counter}",

                "document_id": document_id,

                "document_title": title,

                "source": source,

                "page": page_number,

                "text": chunk_text
            })

    return chunks


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("DOCUMENT CHUNKING")
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

        print(f"\nProcessing: {json_file.name}")

        document_chunks = process_document(json_file)

        all_chunks.extend(document_chunks)

        print(
            f"Chunks created: {len(document_chunks)}"
        )

    output = {
        "created_at": datetime.utcnow().isoformat(),

        "chunk_size": CHUNK_SIZE,

        "chunk_overlap": CHUNK_OVERLAP,

        "total_chunks": len(all_chunks),

        "chunks": all_chunks
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

    print(f"Total chunks: {len(all_chunks)}")
    print(f"Output: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()