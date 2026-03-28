import sys
from pypdf import PdfReader

try:
    reader = PdfReader(sys.argv[1])
    # Extract only the first 50 pages to prevent memory issues for now
    pages_to_extract = min(50, len(reader.pages))
    
    with open("pdf_preview.txt", "w", encoding="utf-8") as f:
        for i in range(pages_to_extract):
            text = reader.pages[i].extract_text()
            f.write(f"--- PAGE {i+1} ---\n{text}\n\n")
    print(f"Successfully extracted {pages_to_extract} pages to pdf_preview.txt")
except Exception as e:
    print(f"Error: {e}")
