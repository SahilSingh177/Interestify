# backend/app/utils/email_service.py
import schedule
import time
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import threading

from backend.config.config import config
# from backend.app.services.research_paper_service import fetch_papers
from backend.app.utils.read_article import read_article, summarize_article, fetch_papers

sg = SendGridAPIClient(api_key=config.SENDGRID_API_KEY)

def send_email(recipient_email):
    article_links = fetch_papers()
    articles = read_article()
    summarized = summarize_article()

    message = Mail(
        from_email=config.SENDER_EMAIL,
        to_emails=recipient_email,
        subject='Weekly Research Paper Recommendations',
        plain_text_content='Here are the recommended research papers based on your interests: ...'
    )

    try:
        response = sg.send(message)
        print(response.status_code)
    except Exception as e:
        print(str(e))

def fetch_and_send_papers():
    recipient_email = 'example@example.com'  # Replace with actual recipient email
    send_email(recipient_email)

def run_scheduler():
    schedule.every().sunday.at('09:00').do(fetch_and_send_papers)

    while True:
        schedule.run_pending()
        time.sleep(1)

def start_scheduler_thread():
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.start()

# Call start_scheduler_thread once user agrees to subscribe to email services
