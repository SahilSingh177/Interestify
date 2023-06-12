import requests
from bs4 import BeautifulSoup
import time
import concurrent.futures
import threading
# from ...database.database import 

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

    article_links = []
    download_pdf_links = []

    for article in articles_list.find_all("li"):
        article_link = article.find("h2").find("a")
        if article_link:
            article_links.append(root_url + article_link.get("href"))

    def download_pdf(article_link):
        """
        Downloads the PDF for a given article link.
        """
        article_html = requests.get(article_link)
        soup = BeautifulSoup(article_html.text, "html.parser")
        pdf_link = soup.find("a", attrs={"data-article-pdf": "true"})
        if pdf_link:
            return root_url + pdf_link.get("href")
        return None

    for article_link in article_links:
        pdf_link = download_pdf(article_link)
        if pdf_link:
            download_pdf_links.append(pdf_link)

    return download_pdf_links

# Generate 10 articles
page = 1

def fetch_new_articles():
    """
    Fetches new articles from page 1 and 2 and adds them to the generated_articles list.
    """
    while True:
        for page in range(1, 3):
            article_links = fetch_articles(page)
            for article in article_links:
                    #call to model to get categories
                    #Save to db
                    print("New article found:", article)

        time.sleep(1800)  # Makes request every 30 minutes

def start_scraping_thread():
    # Start fetching new articles on a separate thread
    fetch_articles_thread = threading.Thread(target=fetch_new_articles)
    fetch_articles_thread.start()

# Start doing this as soon as app is run
