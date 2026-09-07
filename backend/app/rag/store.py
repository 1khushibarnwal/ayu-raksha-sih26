import json

import numpy as np
from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

_model = None


def get_embedding_model():
    global _model

    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)

    return _model


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """
    Generate normalized embeddings for a list of text chunks.
    """

    if not texts:
        return []

    model = get_embedding_model()

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )

    return embeddings.astype(np.float32).tolist()


def serialize_embedding(embedding: list[float]) -> str:
    """
    Convert an embedding vector into JSON for database storage.
    """

    return json.dumps(embedding)


def deserialize_embedding(embedding: str) -> np.ndarray:
    """
    Convert a stored JSON embedding back into a NumPy array.
    """

    return np.array(
        json.loads(embedding),
        dtype=np.float32,
    )