import json
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer


BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_FILE = BASE_DIR / "data" / "index" / "faiss.index"
METADATA_FILE = BASE_DIR / "data" / "index" / "metadata.json"

MODEL_NAME = "all-MiniLM-L6-v2"


def load_index():
    print("Loading FAISS index...")
    index = faiss.read_index(str(INDEX_FILE))
    print(f"Loaded {index.ntotal} vectors.")
    return index


def load_metadata():
    print("Loading metadata...")

    with open(METADATA_FILE, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    print(f"Loaded {len(metadata)} metadata entries.")
    return metadata


def search(query, index, metadata, model, top_k=5):

    # Convert user's question into an embedding
    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    # Search FAISS
    scores, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for score, index_id in zip(scores[0], indices[0]):

        if index_id == -1:
            continue

        result = metadata[index_id].copy()
        result["score"] = float(score)

        results.append(result)

    return results


def main():

    print("=" * 60)
    print("AYU-RAKSHA RETRIEVAL TEST")
    print("=" * 60)

    index = load_index()
    metadata = load_metadata()

    print("\nLoading embedding model...")
    model = SentenceTransformer(MODEL_NAME)

    print("\nReady.")
    print("Type a question.")
    print("Type 'exit' to quit.")

    while True:

        query = input("\nQuestion: ").strip()

        if query.lower() == "exit":
            break

        if not query:
            continue

        results = search(
            query,
            index,
            metadata,
            model,
            top_k=5
        )

        print("\n" + "=" * 60)
        print("TOP RESULTS")
        print("=" * 60)

        for i, result in enumerate(results, start=1):

            print(f"\nRESULT {i}")
            print("-" * 60)

            print(f"Score: {result['score']:.4f}")
            print(f"Document: {result['document_title']}")
            print(f"Section: {result.get('section')}")
            print(f"Section title: {result.get('section_title')}")
            print(f"Chunk ID: {result['chunk_id']}")

            print("\nText:")
            print(result["text"])


if __name__ == "__main__":
    main()