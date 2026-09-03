import json
import re
from pathlib import Path

import pymupdf


RAW_DIR = Path("data/raw")
OUTPUT_DIR = Path("data/processed")

SOURCES_FILE = RAW_DIR / "sources.json"
OUTPUT_FILE = OUTPUT_DIR / "chunks.json"


def clean_text(text: str) -> str:
    """Clean extracted PDF text."""

    # Remove excessive whitespace
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def chunk_text(
    text: str,
    chunk_size: int = 800,
    overlap: int = 100
) -> list[str]:
    """
    Split text into overlapping word-based chunks.

    Prototype implementation.
    """

    words = text.split()

    if not words:
        return []

    chunks = []

    start = 0

    while start < len(words):

        end = start + chunk_size

        chunk = " ".join(
            words[start:end]
        )

        chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks


def extract_pdf(
    pdf_path: Path,
    source_metadata: dict,
    starting_id: int
) -> list[dict]:

    document = pymupdf.open(pdf_path)

    chunks = []

    chunk_id = starting_id

    for page_number, page in enumerate(
        document,
        start=1
    ):

        raw_text = page.get_text("text")

        text = clean_text(raw_text)

        if not text:
            continue

        page_chunks = chunk_text(text)

        for chunk_index, chunk in enumerate(
            page_chunks
        ):

            chunks.append({

                "id": chunk_id,

                "document": source_metadata["title"],

                "filename": pdf_path.name,

                "authority": source_metadata[
                    "authority"
                ],

                "jurisdiction": source_metadata[
                    "jurisdiction"
                ],

                "document_type": source_metadata[
                    "document_type"
                ],

                "language": source_metadata[
                    "language"
                ],

                "source_url": source_metadata[
                    "source_url"
                ],

                "page": page_number,

                "chunk_index": chunk_index,

                "content": chunk

            })

            chunk_id += 1

    document.close()

    return chunks


def load_sources() -> dict:

    with open(
        SOURCES_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        sources = json.load(file)

    return {
        source["filename"]: source
        for source in sources
    }


def main():

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    sources = load_sources()

    all_chunks = []

    chunk_id = 0

    for pdf_path in RAW_DIR.glob("*.pdf"):

        print(
            f"Processing: {pdf_path.name}"
        )

        if pdf_path.name not in sources:

            print(
                f"WARNING: No metadata found "
                f"for {pdf_path.name}"
            )

            continue

        metadata = sources[
            pdf_path.name
        ]

        chunks = extract_pdf(
            pdf_path,
            metadata,
            chunk_id
        )

        all_chunks.extend(chunks)

        chunk_id += len(chunks)

        print(
            f"  Created {len(chunks)} chunks"
        )

    with open(
        OUTPUT_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            all_chunks,
            file,
            ensure_ascii=False,
            indent=2
        )

    print()
    print("=" * 50)
    print(
        f"Total chunks: {len(all_chunks)}"
    )
    print(
        f"Saved to: {OUTPUT_FILE}"
    )
    print("=" * 50)


if __name__ == "__main__":
    main()