from pathlib import Path

import fitz
import pytesseract
from PIL import Image


# Tesseract executable installed on Windows
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_pdf_pages(file_path: str) -> list[dict]:
    """
    Extract text from a PDF while preserving page numbers.

    For normal PDFs:
        PyMuPDF extracts the text directly.

    For scanned/image-based PDFs:
        The page is rendered as an image and OCR is used.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    if path.suffix.lower() != ".pdf":
        raise ValueError(
            "Currently only PDF files are supported for ingestion."
        )

    pages = []

    with fitz.open(path) as pdf:
        for page_number, page in enumerate(pdf, start=1):

            # First try normal PDF text extraction
            text = page.get_text("text").strip()

            # If no text exists, use OCR
            if not text:
                pix = page.get_pixmap(
                    matrix=fitz.Matrix(2, 2),
                    alpha=False,
                )

                image = Image.frombytes(
                    "RGB",
                    [pix.width, pix.height],
                    pix.samples,
                )

                text = pytesseract.image_to_string(
                    image,
                    lang="eng",
                ).strip()

            if not text:
                continue

            pages.append(
                {
                    "page": page_number,
                    "text": text,
                }
            )

    return pages


def chunk_text(
    text: str,
    chunk_size: int = 1000,
    overlap: int = 200,
) -> list[str]:
    """
    Split text into overlapping chunks.

    Example:
        chunk 1 = characters 0-1000
        chunk 2 = characters 800-1800
        chunk 3 = characters 1600-2600
    """

    if not text.strip():
        return []

    if overlap >= chunk_size:
        raise ValueError(
            "overlap must be smaller than chunk_size"
        )

    chunks = []

    start = 0
    text_length = len(text)

    while start < text_length:
        end = min(
            start + chunk_size,
            text_length,
        )

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        start = end - overlap

    return chunks


def create_document_chunks(file_path: str) -> list[dict]:
    """
    Extract a PDF and convert its pages into searchable chunks.

    Every chunk keeps its original page number so that
    we can provide source citations later.
    """

    pages = extract_pdf_pages(file_path)

    document_chunks = []

    chunk_index = 0

    for page in pages:
        chunks = chunk_text(page["text"])

        for chunk in chunks:
            document_chunks.append(
                {
                    "page_number": page["page"],
                    "chunk_index": chunk_index,
                    "chunk_text": chunk,
                }
            )

            chunk_index += 1

    return document_chunks