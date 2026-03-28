import sys
import fitz # PyMuPDF

try:
    doc = fitz.open(sys.argv[1])
    pages_to_extract = min(10, len(doc))
    
    with open("pdf_preview2.txt", "w", encoding="utf-8") as f:
        for i in range(pages_to_extract):
            page = doc[i]
            text = page.get_text()
            f.write(f"--- PAGE {i+1} ---\n{text}\n\n")
            # Also check if it's an image
            images = page.get_images(full=True)
            f.write(f"Images found on page {i+1}: {len(images)}\n\n")
    print(f"Successfully extracted {pages_to_extract} pages to pdf_preview2.txt")
except Exception as e:
    print(f"Error: {e}")
