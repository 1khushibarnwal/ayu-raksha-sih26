import time
from pathlib import Path

import requests

# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PDF_DIR = BASE_DIR / "data" / "pdfs"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/140.0 Safari/537.36"
    ),
}


# ============================================================
# OFFICIAL DOCUMENTS
# ============================================================

DOCUMENTS = [
    {
        "id": "patents_act_1970",
        "filename": "patents_act_1970.pdf",
        "title": (
            "The Patents Act, 1970 "
            "(amendments till 01-08-2024)"
        ),
        "source": "IP India",
        "url": (
            "https://ipindia.gov.in/frontend/pdf/patents/"
            "1_113_1_The_Patents_Act__1970___"
            "incorporating_all_amendments_till_1-08-2024.pdf"
        ),
    },

    {
        "id": "patents_rules_2003",
        "filename": "patents_rules_2003.pdf",
        "title": (
            "The Patents Rules, 2003 "
            "(amendments till 15-03-2024)"
        ),
        "source": "IP India",
        "url": None,
        # IMPORTANT:
        # IP India currently exposes the latest consolidated
        # Rules primarily through its HTML "View Rules" page.
        #
        # Official page:
        # https://ipindia.gov.in/acts/patent-rules-2003
        #
        # We deliberately do not put a guessed PDF URL here.
    },

    {
        "id": "ayush_invention_guidelines_2025",
        "filename": "ayush_invention_guidelines_2025.pdf",
        "title": (
            "Guidelines for Examination of "
            "Ayush Related Inventions - 2025"
        ),
        "source": "IP India",
        "url": (
            "https://ipindia.gov.in/"
            "writereaddata/Portal/IPOGuidelinesManuals/"
            "Guidelines_for_Examination_of_Ayush_Related_Inventions.pdf"
        ),
    },

    {
        "id": "drugs_rules_1945",
        "filename": "drugs_rules_1945.pdf",
        "title": "The Drugs Rules, 1945",
        "source": "CDSCO",
        "url": (
            "https://cdsco.gov.in/opencms/resources/"
            "UploadCDSCOWeb/2022/drug_rules/"
            "Drugs%20Rules%201945_2024%2009.09.2024.pdf"
        ),
    },

    {
        "id": "cosmetics_rules_2020",
        "filename": "cosmetics_rules_2020.pdf",
        "title": "The Cosmetics Rules, 2020",
        "source": "CDSCO",
        "url": (
            "https://cdsco.gov.in/opencms/resources/"
            "UploadCDSCOWeb/2022/cos_rules/"
            "Cosmetics%20Rules%202020.pdf"
        ),
    },

    {
        "id": "biodiversity_act_2002",
        "filename": "biodiversity_act.pdf",
        "title": "The Biological Diversity Act, 2002",
        "source": "India Code",
        "url": (
            "https://www.indiacode.nic.in/bitstream/"
            "123456789/2046/4/a2003-18.pdf"
        ),
    },

    {
        "id": "wipo_traditional_knowledge",
        "filename": "wipo_traditional_knowledge.pdf",
        "title": (
            "Traditional Knowledge and Intellectual Property"
        ),
        "source": "WIPO",
        "url": (
            "https://www.wipo.int/edocs/pubdocs/en/"
            "wipo_pub_tk_1.pdf"
        ),
    },

    {
        "id": "wipo_gratk_treaty",
        "filename": "wipo_gratk_treaty.pdf",
        "title": (
            "WIPO Treaty on Intellectual Property, "
            "Genetic Resources and Associated "
            "Traditional Knowledge"
        ),
        "source": "WIPO",
        "url": None,
        # We intentionally do not guess the treaty PDF URL.
        # The official WIPO treaty page is:
        #
        # https://www.wipo.int/en/web/treaties/ip/gratk
    },
]


# ============================================================
# DOWNLOAD HELPERS
# ============================================================

def format_size(size_bytes: int) -> str:
    """
    Convert bytes to a human-readable size.
    """

    if size_bytes < 1024:
        return f"{size_bytes} B"

    if size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"

    return f"{size_bytes / (1024 * 1024):.2f} MB"


def is_pdf(response: requests.Response) -> bool:
    """
    Verify that the response is actually a PDF.

    We check both Content-Type and the PDF magic bytes.
    """

    content_type = response.headers.get(
        "Content-Type",
        ""
    ).lower()

    first_bytes = response.content[:5]

    return (
        "application/pdf" in content_type
        or first_bytes == b"%PDF-"
    )


def download_document(document):
    """
    Download one document.
    """

    filename = document["filename"]
    url = document["url"]

    output_path = PDF_DIR / filename

    print("=" * 60)
    print(f"Document: {document['title']}")
    print(f"Source:   {document['source']}")
    print(f"File:     {filename}")
    print("=" * 60)

    # --------------------------------------------------------
    # Missing URL
    # --------------------------------------------------------

    if not url:

        print(
            "SKIPPED: No verified direct PDF URL is configured."
        )

        print(
            "Use the official source page to obtain the "
            "current PDF URL rather than guessing it."
        )

        print()

        return "skipped"

    # --------------------------------------------------------
    # Existing file
    # --------------------------------------------------------

    if output_path.exists():

        size = format_size(
            output_path.stat().st_size
        )

        print(
            f"Already exists ({size})."
        )

        print(
            f"Path: {output_path}"
        )

        print()

        return "exists"

    # --------------------------------------------------------
    # Download
    # --------------------------------------------------------

    print("Downloading...")
    print(url)
    print()

    try:

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=120,
            allow_redirects=True,
        )

        response.raise_for_status()

    except requests.RequestException as error:

        print(
            f"ERROR: Download failed:\n{error}"
        )

        print()

        return "failed"

    # --------------------------------------------------------
    # Verify PDF
    # --------------------------------------------------------

    if not is_pdf(response):

        print(
            "ERROR: Server response is not a PDF."
        )

        print(
            "Content-Type:",
            response.headers.get(
                "Content-Type",
                "unknown",
            ),
        )

        print(
            "First bytes:",
            repr(response.content[:20]),
        )

        print(
            "The URL may point to an HTML page "
            "rather than the actual PDF."
        )

        print()

        return "failed"

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    with open(
        output_path,
        "wb",
    ) as file:

        file.write(response.content)

    size = format_size(
        output_path.stat().st_size
    )

    print(
        f"SUCCESS: Downloaded {size}"
    )

    print(
        f"Saved to:\n{output_path}"
    )

    print()

    return "downloaded"


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print(" AYU-RAKSHA DOCUMENT DOWNLOADER")
    print("=" * 60)
    print()

    PDF_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    results = {
        "downloaded": 0,
        "exists": 0,
        "skipped": 0,
        "failed": 0,
    }

    total = len(DOCUMENTS)

    for index, document in enumerate(
        DOCUMENTS,
        start=1,
    ):

        print(
            f"[{index}/{total}]"
        )

        status = download_document(
            document
        )

        results[status] += 1

        # Small delay between requests.
        if index < total:
            time.sleep(1)

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print(" DOWNLOAD SUMMARY")
    print("=" * 60)

    print(
        f"Downloaded : {results['downloaded']}"
    )

    print(
        f"Already had: {results['exists']}"
    )

    print(
        f"Skipped    : {results['skipped']}"
    )

    print(
        f"Failed     : {results['failed']}"
    )

    print()

    print(
        f"PDF directory:\n{PDF_DIR}"
    )

    print()

    if results["failed"] > 0:

        print(
            "WARNING: One or more documents failed "
            "to download."
        )

    if results["skipped"] > 0:

        print(
            "NOTE: Some documents need their "
            "current direct PDF URL configured."
        )

    print()


if __name__ == "__main__":
    main()
