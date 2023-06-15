import requests
from bs4 import BeautifulSoup
import time
import concurrent.futures
import threading

from .database.database import App

DATABASE_URL = "neo4j+s://eae81324.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "C3a6el-mB51BQGsGnWGARmZiog15X1Ag8vOMH9iBpLY"

uri = DATABASE_URL
user = USER
password = PASSWORD

root_url = "https://link.springer.com"
base_url = "https://link.springer.com/search/page/"
articles_limit = 1
executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)

def fetch_articles(page):
    """
    Fetches articles from a specific page and extracts the download links for PDFs.
    """
    url = base_url + str(page) + "?facet-content-type=Article"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    articles_list = soup.find("ol", class_="content-item-list")

    # Ignore articles with no-access class
    for article in articles_list.find_all("li", class_="no-access"):
        article.decompose()

    articles_data = []

    for article in articles_list.find_all("li"):
        article_authors = article.find("span", class_="authors").find_all("a")
        authors = [author.get_text() for author in article_authors]

        article_title = article.find("a", class_="title").get_text()

        article_link = article.find("h2").find("a")
        article_url = root_url + article_link.get("href") if article_link else None

        pdf_link = None
        if article_url:
            pdf_link = download_pdf(article_url)
        article_data = {
            "authors": authors,
            "title": article_title,
            "link": article_url,
            "pdf_link": pdf_link,
        }

        articles_data.append(article_data)

    return articles_data

def download_pdf(article_url):
    """
    Downloads the PDF for a given article link.
    """
    article_html = requests.get(article_url)
    soup = BeautifulSoup(article_html.text, "html.parser")
    pdf_link = soup.find("a", attrs={"data-article-pdf": "true"})
    if pdf_link:
        return root_url + pdf_link.get("href")
    return None

def fetch_new_articles():
    """
    Fetches new articles from page 1 and 2 and adds them to the generated_articles list.
    """
    while True:
        for page in range(1, 3):
            articles_data = fetch_articles(page)
            for article_data in articles_data:
                authors = ", ".join(article_data["authors"])
                title = article_data["title"]
                link = article_data["link"]
                pdf_link = article_data["pdf_link"]
                app = App(uri, user, password)
                app.create_blog(title, link, authors, pdf_link)
                print("New article found:", title)

        time.sleep(1)  # Makes request every 30 minutes

def start_scraping_thread():
    # Start fetching new articles on a separate thread
    fetch_articles_thread = threading.Thread(target=fetch_new_articles)
    fetch_articles_thread.start()

# Start doing this as soon as the app is run
start_scraping_thread()
