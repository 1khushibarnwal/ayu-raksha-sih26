from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent / "scripts"))

from ingest import extract_pdf


pdf_path = Path("data/pdfs/patents_act_1970.pdf")

pages, _ = extract_pdf(pdf_path)

for page in pages:
    if 4 <= page["page_number"] <= 7:
        print(f"\n--- PAGE {page['page_number']} ---")
        print(page["text"][:4000])