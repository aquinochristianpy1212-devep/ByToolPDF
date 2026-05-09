
import sys
from pdf2docx import Converter

if len(sys.argv) < 3:
    print("Uso: python pdf_to_word.py input.pdf output.docx")
    sys.exit(1)

input_pdf = sys.argv[1]
output_docx = sys.argv[2]

cv = Converter(input_pdf)
cv.convert(output_docx, start=0, end=None)
cv.close()
