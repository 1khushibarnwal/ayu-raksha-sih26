import json

from pathlib import Path


CHUNKS_FILE = Path(
    "data/processed/chunks.json"
)


def main():

    with open(
        CHUNKS_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        chunks = json.load(file)

    print(
        f"\nTotal chunks: {len(chunks)}\n"
    )

    for chunk in chunks[:5]:

        print("=" * 80)

        print(
            f"ID: {chunk['id']}"
        )

        print(
            f"Document: {chunk['document']}"
        )

        print(
            f"Authority: {chunk['authority']}"
        )

        print(
            f"Page: {chunk['page']}"
        )

        print(
            f"URL: {chunk['source_url']}"
        )

        print()

        print(
            chunk["content"][:700]
        )

        print()


if __name__ == "__main__":
    main()