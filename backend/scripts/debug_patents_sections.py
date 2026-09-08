from pathlib import Path
from pypdf import PdfReader


PROJECT_ROOT = Path(__file__).resolve().parent.parent

PDF_PATH = (
    PROJECT_ROOT
    / "data"
    / "pdfs"
    / "patents_act_1970.pdf"
)


reader = PdfReader(str(PDF_PATH))


print("\nSearching for lines around Sections 7-13...\n")


for page_number, page in enumerate(
    reader.pages,
    start=1
):

    text = page.extract_text() or ""

    for line_index, line in enumerate(
        text.splitlines()
    ):

        stripped = line.strip()

        # Look for lines beginning with 7-13.
        if not stripped:
            continue

        first_word = stripped.split()[0]

        if first_word.rstrip(".").isdigit():

            number = int(
                first_word.rstrip(".")
            )

            if 7 <= number <= 13:

                print(
                    f"PAGE {page_number} "
                    f"LINE {line_index}: "
                    f"{repr(stripped)}"
                )