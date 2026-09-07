import numpy as np

from app.rag.store import (
    deserialize_embedding,
    generate_embeddings,
)


def cosine_similarity(
    a: np.ndarray,
    b: np.ndarray,
) -> float:
    """
    Calculate cosine similarity between two vectors.
    """

    denominator = np.linalg.norm(a) * np.linalg.norm(b)

    if denominator == 0:
        return 0.0

    return float(
        np.dot(a, b) / denominator
    )


def retrieve_chunks(
    query: str,
    chunks: list[dict],
    top_k: int = 5,
) -> list[dict]:
    """
    Retrieve the most relevant persisted document chunks.
    """

    if not query.strip() or not chunks:
        return []

    query_embedding = np.array(
        generate_embeddings([query])[0],
        dtype=np.float32,
    )

    results = []

    for chunk in chunks:
        stored_embedding = chunk.get("embedding")

        if not stored_embedding:
            continue

        embedding = deserialize_embedding(
            stored_embedding
        )

        score = cosine_similarity(
            query_embedding,
            embedding,
        )

        results.append(
            {
                **chunk,
                "relevance_score": round(score, 4),
            }
        )

    results.sort(
        key=lambda item: item["relevance_score"],
        reverse=True,
    )

    return results[:top_k]