import schedule
import time
from .database.database import App
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import threading

SENDGRID_API_KEY = "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"
SENDER_EMAIL = "nikhilranjan1103@gmail.com"
# from backend.app.services.research_paper_service import fetch_papers
# from main import getTopArticlesPerUser
from .database.read_article import read_article


DATABASE_URL = "neo4j+s://feacbda5.databases.neo4j.io"
USER = "neo4j"
PASSWORD = "nKH7aCT0Ft2r61zxvbyzPD9OtdG6cD_Yl3XcEY_TfMs"


uri = DATABASE_URL
user = USER
password = PASSWORD

database = App(uri,user,password)

sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)

def send_email(recipient_email):
    # article_links = getTopArticlesPerUser(recipient_email)
    # neo4j db call

    article = read_article()[1]

    # for every article
    message = Mail(
        from_email=SENDER_EMAIL,
        to_emails=recipient_email,
        subject='Weekly Research Paper Recommendations',
        plain_text_content='Here are the recommended research papers based on your interests: ...'
    )

    try:
        response = sg.send(message)
        print(response.status_code)
    except Exception as e:
        print(str(e))

def run_scheduler(recipient_email):
    schedule.every().sunday.at('09:00').do(send_email, recipient_email)

    while True:
        schedule.run_pending()
        time.sleep(1)

def start_scheduler_thread(recipient_email):
    scheduler_thread = threading.Thread(target=run_scheduler, args=(recipient_email,))
    scheduler_thread.start()


# Call start_scheduler_thread once user agrees to subscribe to email services
