import requests
import PyPDF2
import os

def read_article(links):
    article = ""

    for link in links:
        # Download the PDF file
        response = requests.get(link)
        with open("temp.pdf", "wb") as file:
            file.write(response.content)

        pdf_file = open("temp.pdf", "rb")
        pdf_reader = PyPDF2.PdfFileReader(pdf_file)

        text = ""
        for page_num in range(pdf_reader.numPages):
            page = pdf_reader.getPage(page_num)
            text += page.extract_text()

        articles = text

        pdf_file.close()
        os.remove("temp.pdf")

    return articles