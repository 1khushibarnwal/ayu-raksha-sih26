import json
from pathlib import Path

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CHUNKS_FILE = BASE_DIR / "data" / "processed" / "chunks.json"

INDEX_DIR = BASE_DIR / "data" / "index"

FAISS_FILE = INDEX_DIR / "faiss.index"
METADATA_FILE = INDEX_DIR / "metadata.json"


# ============================================================
# EMBEDDING MODEL
# ============================================================

MODEL_NAME = "all-MiniLM-L6-v2"


# ============================================================
# LOAD CHUNKS
# ============================================================

def load_chunks():

    print("Loading chunks...")

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    chunks = data["chunks"]

    print(f"Loaded {len(chunks)} chunks.")

    return chunks


# ============================================================
# CREATE EMBEDDINGS
# ============================================================

def create_embeddings(chunks):

    print("\nLoading embedding model...")
    print(f"Model: {MODEL_NAME}")

    model = SentenceTransformer(MODEL_NAME)

    texts = [
        (
            f"Document: {chunk['document_title']}\n"
            f"Section: {chunk.get('section', '')}\n"
            f"Title: {chunk.get('section_title', '')}\n\n"
            f"{chunk['text']}"
        )
        for chunk in chunks
    ]

    print(f"\nCreating embeddings for {len(texts)} chunks...")

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    print("\nEmbedding shape:")
    print(embeddings.shape)

    return embeddings


# ============================================================
# BUILD FAISS INDEX
# ============================================================

def build_faiss_index(embeddings):

    dimension = embeddings.shape[1]

    print(f"\nEmbedding dimension: {dimension}")

    # Because embeddings are normalized, inner product
    # is equivalent to cosine similarity.
    index = faiss.IndexFlatIP(dimension)

    index.add(
        embeddings.astype(np.float32)
    )

    print(f"Vectors stored in FAISS: {index.ntotal}")

    return index


# ============================================================
# SAVE METADATA
# ============================================================

def save_metadata(chunks):

    metadata = []

    for chunk in chunks:

        metadata.append({
            "chunk_id": chunk["chunk_id"],
            "document_id": chunk["document_id"],
            "document_title": chunk["document_title"],
            "source": chunk["source"],
            "section": chunk.get("section"),
            "section_title": chunk.get("section_title"),
            "text": chunk["text"]
        })

    with open(
        METADATA_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            metadata,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"Metadata saved to: {METADATA_FILE}")


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 60)
    print("BUILDING VECTOR INDEX")
    print("=" * 60)

    INDEX_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    # 1. Load chunks
    chunks = load_chunks()

    if not chunks:
        print("No chunks found.")
        return

    # 2. Generate embeddings
    embeddings = create_embeddings(chunks)

    # 3. Build FAISS index
    index = build_faiss_index(embeddings)

    # 4. Save FAISS index
    faiss.write_index(
        index,
        str(FAISS_FILE)
    )

    print(f"\nFAISS index saved to:")
    print(FAISS_FILE)

    # 5. Save metadata
    save_metadata(chunks)

    print("\n" + "=" * 60)
    print("DONE")
    print("=" * 60)

    print(f"Total chunks : {len(chunks)}")
    print(f"Total vectors: {index.ntotal}")
    print(f"Dimension    : {embeddings.shape[1]}")


if __name__ == "__main__":
    main()