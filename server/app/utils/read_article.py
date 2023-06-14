import requests
import PyPDF2
import os
import summarize_article
import cohere
co = cohere.Client('410fhpjmHWW23NoOKDJ9u9yTkRqxyWrJdKHLJ04u')

def read_article(link):
    article = ""

    # Download the PDF file
    response = requests.get(link)
    with open("temp.pdf", "wb") as file:
        file.write(response.content)

    pdf_file = open("temp.pdf", "rb")
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    pageData = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        pageData += page.extract_text()

    article = pageData
    summary = co.summarize(text=article)
    print(summary)
    pdf_file.close()
    os.remove("temp.pdf")

    return summary

read_article("https://link.springer.com/content/pdf/10.1007/s42757-022-0154-6.pdf?pdf=button")