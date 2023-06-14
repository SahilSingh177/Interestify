# backend/app/utils/email_service.py
import schedule
import time
from .database.database import App
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import threading

from config.config import SENDER_EMAIL, SENDGRID_API_KEY
# from backend.app.services.research_paper_service import fetch_papers
from main import getTopArticlesPerUser
from utils.read_article import read_article
from utils.summarize_article import summarize_article


DATABASE_URL = "neo4j+s://eae81324.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "C3a6el-mB51BQGsGnWGARmZiog15X1Ag8vOMH9iBpLY"


uri = DATABASE_URL
user = USER
password = PASSWORD

database = App(uri,user,password)

sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)

def send_email(recipient_email):
    article_links = getTopArticlesPerUser(recipient_email)

    article = read_article()
    summarized = summarize_article()

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

def fetch_and_send_papers(recipient_email):
    # fetch top 5 papers
    article_links = [] #top articles retireve from db
    summaries = []
    send_email(recipient_email)

def run_scheduler(recipient_email):
    schedule.every().sunday.at('09:00').do(fetch_and_send_papers, recipient_email)

    while True:
        schedule.run_pending()
        time.sleep(1)

def start_scheduler_thread(recipient_email):
    scheduler_thread = threading.Thread(target=run_scheduler, args=(recipient_email,))
    scheduler_thread.start()


# Call start_scheduler_thread once user agrees to subscribe to email services
