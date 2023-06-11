import requests
from bs4 import BeautifulSoup
import time
import concurrent.futures
import threading

root_url = "https://link.springer.com"
base_url = "https://link.springer.com/search/page/"
articles_limit = 10
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
generated_articles = []
page = 1
while len(generated_articles) < articles_limit:
    futures = [executor.submit(fetch_articles, page + i) for i in range(4)]

    for future in concurrent.futures.as_completed(futures):
        article_links = future.result()
        generated_articles.extend(article_links)

    page += 4
    if len(article_links) == 0:
        break

def fetch_new_articles():
    """
    Fetches new articles from page 1 and 2 and adds them to the generated_articles list.
    """
    while True:
        for page in range(1, 3):
            article_links = fetch_articles(page)
            for article in article_links:
                if article not in generated_articles:
                    generated_articles.append(article)
                    print("New article found:", article)

        time.sleep(1800)  # Makes request every 30 minutes

def start_scraping_thread():
    # Start fetching new articles on a separate thread
    fetch_articles_thread = threading.Thread(target=fetch_new_articles)
    fetch_articles_thread.start()

# Start doing this as soon as app is run
