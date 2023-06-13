from flask import Flask, request, jsonify
from sendgrid import SendGridAPIClient
from .config.config import config

from .services.research_paper_services.springer import fetch_articles, start_scraping_thread
from .utils.read_article import read_article
from .utils.summarize_article import summarize_article
from .services.email_service import start_scheduler_thread

app = Flask(__name__)
sg = None

@app.before_first_request
def initialize():
    # Initialize db
    start_scraping_thread()
    sg = SendGridAPIClient(api_key=config.SENDGRID_API_KEY) #mail service


@app.route('./registerUser',methods=['GET'])
def registerUser():
    data = request.json
    email = data['email']
    # save it in database
    #create_user function

@app.route('./registerUserPreferences',methods=['POST'])
def registerUserPreferences():
    data = request.json
    email = data['email']
    preferences = data['preferences']
    percentage = 100/len(preferences)
    # save it in database
    #user_to_category function

@app.route('./subscribeUser',methods=['POST'])
def subscribeUser():
    data = request.json
    email = data['email']
    start_scheduler_thread(email)
    

@app.route('./updatePreferences',methods=['POST'])
def updatePreferences():
    data = request.json
    email = data['email']
    category_preferences = data['updated_preferences']
    #user_to_category update

@app.route('/getTopArticles', methods=['GET'])
def getTopArticles():
    # data = get_articles_from_db()  # Retrieve data from the database
    data = []
    resp = []

    for article_data in data:
        link = article_data['article_link']
        category = article_data['category']
        author = article_data['author']
        article = read_article(link)
        summary = summarize_article(article)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            "summary": summary
        })

    return jsonify(resp)

@app.route('/getTopArticlesPerUser', methods=['GET'])
def getTopArticlesPerUser():
    # data = get_articles_from_db()  # Retrieve data from the database
    data = []
    resp = []

    for article_data in data:
        link = article_data['article_link']
        category = article_data['category']
        author = article_data['author']
        article = read_article(link)
        summary = summarize_article(article)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            "summary": summary
        })

    return jsonify(resp)

if __name__ == 'main':
    app.run()