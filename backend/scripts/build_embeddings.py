import json
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer


CHUNKS_FILE = Path(
    "data/processed/chunks.json"
)

OUTPUT_DIR = Path(
    "data/index"
)

EMBEDDINGS_FILE = (
    OUTPUT_DIR / "embeddings.npy"
)

METADATA_FILE = (
    OUTPUT_DIR / "metadata.json"
)


MODEL_NAME = (
    "BAAI/bge-m3"
)


def main():

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    print("Loading chunks...")

    with open(
        CHUNKS_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        chunks = json.load(file)

    texts = [
        chunk["content"]
        for chunk in chunks
    ]

    print(
        f"Loaded {len(texts)} chunks"
    )

    print(
        f"Loading embedding model: "
        f"{MODEL_NAME}"
    )

    model = SentenceTransformer(
        MODEL_NAME
    )

    print("Generating embeddings...")

    embeddings = model.encode(
        texts,
        batch_size=16,
        show_progress_bar=True,
        normalize_embeddings=True
    )

    embeddings = np.asarray(
        embeddings,
        dtype=np.float32
    )

    np.save(
        EMBEDDINGS_FILE,
        embeddings
    )

    # Keep metadata separate from embeddings.
    metadata = [
        {
            key: value
            for key, value in chunk.items()
            if key != "content"
        }
        for chunk in chunks
    ]

    with open(
        METADATA_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            metadata,
            file,
            ensure_ascii=False,
            indent=2
        )

    print()
    print("=" * 50)
    print(
        f"Embeddings shape: "
        f"{embeddings.shape}"
    )
    print(
        f"Saved embeddings to: "
        f"{EMBEDDINGS_FILE}"
    )
    print(
        f"Saved metadata to: "
        f"{METADATA_FILE}"
    )
    print("=" * 50)


if __name__ == "__main__":
    main()