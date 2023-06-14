from flask import Flask, request, jsonify
from sendgrid import SendGridAPIClient
from config.config import SENDGRID_API_KEY
from services.database.database import App
from services.springer import start_scraping_thread
from utils.read_article import read_article
from utils.summarize_article import summarize_article
import dotenv

app = Flask(__name__)
sg = None
initialized = False

DATABASE_URL = "neo4j+s://eae81324.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "C3a6el-mB51BQGsGnWGARmZiog15X1Ag8vOMH9iBpLY"

uri = DATABASE_URL
user = USER
password = PASSWORD
database = App(uri, user, password)


@app.before_request
def initialize():
    global initialized, sg
    if not initialized:
        app.logger.info("Starting scraping thread...")
        start_scraping_thread()
        sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)  # mail service
        initialized = True


@app.route('/registerUser', methods=['POST'])
def register_user():
    data = request.json
    email = data['email']
    print(email)
    # save it in database
    database.create_user(email, "sami")
    # create_user function
    return jsonify({"message": "User registered successfully"})


@app.route('/registerUserPreferences', methods=['POST'])
def register_user_preferences():
    data = request.json
    email = data['email']
    preferences = data['preferences']
    # percentage = 100 / len(preferences)
    # save it in database
    database.user_to_category(email,preferences)
    # user_to_category function
    return jsonify({"message": "User preferences registered successfully"})


@app.route('/updatePreferences', methods=['POST'])
def update_preferences():
    data = request.json
    email = data['email']
    category_preferences = data['updated_preferences']
    # user_to_category update
    return jsonify({"message": "User preferences updated successfully"})


@app.route('/getTopArticles', methods=['GET'])
def get_top_articles():
    # data = get_articles_from_db()  # Retrieve data from the database
    data = []
    resp = []

    for article_data in data:
        link = article_data['article_link']
        category = article_data['category']
        author = article_data['author']
        summary = read_article(link)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            "summary": summary
        })

    return jsonify(resp)

@app.route('/getTopArticlesPerUser', methods=['GET'])
def get_top_articles_per_user():
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


if __name__ == "__main__":
    database.create_user("test@mail", "sami")
    app.run(host='0.0.0.0', port=5000)
