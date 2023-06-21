import requests
from bs4 import BeautifulSoup
import time
import concurrent.futures
import threading
import atexit
from .database.database import App

DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"

uri = DATABASE_URL
user = USER
password = PASSWORD

root_url = "https://link.springer.com"
base_url = "https://link.springer.com/search/page/"
articles_limit = 1
category = [
    "Medicine+%26+Public+Health",
    "Life+Sciences",
    "Chemistry",
    "Physics",
    "Biomedicine",
    "Engineering",
    "Materials+Science",
    "Mathematics",
    "Earth+Sciences",
    "Computer+Science",
    "Environment",
    "Psychology",
    "Pharmacy",
    "Social+Sciences",
    "Science%2C+Humanities+and+Social+Sciences%2C+multidisciplinary",
    "Economics",
    "Business+and+Management",
    "Philosophy",
    "Education",
    "Dentistry",
    "Law",
    "Statistics",
    "Political+Science+and+International+Relations",
    "Energy",
    "Linguistics",
    "Geography",
    "Finance",
    "Criminology+and+Criminal+Justice",
    "Literature",
    "Cultural+and+Media+Studies",
    "History",
    "Architecture+%2F+Design",
    "Medicine",
    "Religious+Studies",
    "Biomedical+Sciences",
    "Materials",
    "Earth+Sciences+%26+Geography",
    "Material+Science",
    "Environmental+Sciences",
    "Astronomy",
    "Business+%26+Management",
    "Education+%26+Language",
    "Earth+Sciences+and+Geography"
]

backend_category = [
    "Medicine & Public Health",
    "Life Sciences",
    "Chemistry",
    "Physics",
    "Biomedicine",
    "Engineering",
    "Materials Science",
    "Mathematics",
    "Earth Sciences",
    "Computer Science",
    "Environment",
    "Psychology",
    "Pharmacy",
    "Social Sciences",
    "Science, Humanities and Social Sciences, multidisciplinary",
    "Economics",
    "Business and Management",
    "Philosophy",
    "Education",
    "Dentistry",
    "Law",
    "Statistics",
    "Political Science and International Relations",
    "Energy",
    "Linguistics",
    "Geography",
    "Finance",
    "Criminology and Criminal Justice",
    "Literature",
    "Cultural and Media Studies",
    "History",
    "Architecture / Design",
    "Medicine",
    "Religious Studies",
    "Biomedical Sciences",
    "Materials",
    "Earth Sciences & Geography",
    "Material Science",
    "Environmental Sciences",
    "Astronomy",
    "Business & Management",
    "Education & Language",
    "Earth Sciences and Geography"
]

def fetch_articles(page, current_category):
    """
    Fetches articles from a specific page and extracts the download links for PDFs.
    """
    url = base_url + str(page) + "?facet-content-type=Article&facet-discipline=" + current_category
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    articles_list = soup.find("ol", class_="content-item-list")

    articles_data = []

    for article in articles_list.find_all("li"):
        # Check if the element has the 'no-access' class
        if article.get("class") and "no-access" in article.get("class"):
            continue
        if article.find("span", class_="authors") :
            article_authors = article.find("span", class_="authors").find_all("a")
            authors = [author.get_text() for author in article_authors]
        if article.find("a", class_="title") :
            article_title = article.find("a", class_="title").get_text()
        if article.find("h2") :
            article_link = article.find("h2").find("a")
        article_url = root_url + article_link.get("href") if article_link else None
        index = category.index(current_category)
        back_category = backend_category[index]
        pdf_link = None
        if article_url:
            pdf_link = download_pdf(article_url)
        article_data = {
            "authors": authors,
            "title": article_title,
            "link": article_url,
            "pdf_link": pdf_link,
            "backend_category": back_category
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

def shutdown(self):
    """
    Shutdowns the executor.
    """
    self._running = False
    self._worker_queue.put(None)
    for worker in self._workers:
        worker.join()
executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)
shutdown_event = threading.Event()

def start_scraping_thread():
    # Start fetching new articles on a separate thread
    fetch_articles_thread = threading.Thread(target=fetch_new_articles, args=(executor, shutdown_event))
    fetch_articles_thread.start()


# Start doing this as soon as the app is run
atexit.register(executor.shutdown)


def fetch_new_articles(executor, shutdown_event):
    """
    Fetches new articles from page 1 and 2 and adds them to the generated_articles list.
    """
    try:
        article_futures = []

        for page in range(1, 3):
            for current_category in category:
                future = executor.submit(fetch_articles, page, current_category)
                article_futures.append(future)

            for future in concurrent.futures.as_completed(article_futures):
                articles_data = future.result()
                for article_data in articles_data:
                    authors = ", ".join(article_data["authors"])
                    title = article_data["title"]
                    link = article_data["link"]
                    pdf_link = article_data["pdf_link"]
                    backend_category = article_data["backend_category"]
                    app = App(uri, user, password)
                    app.create_blog(title, link, authors, pdf_link, backend_category)
                        # break
                    print("New article found:", title)
        time.sleep(3600)

    finally:
        # Notify the executor that it can shut down
        shutdown_event.set()