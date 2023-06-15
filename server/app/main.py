from flask import Flask, request, jsonify
from sendgrid import SendGridAPIClient
from services.database.database import App
from services.springer import start_scraping_thread
# from utils.read_article import read_article
# from utils.summarize_article import summarize_article
import dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
sg = None
initialized = False

DATABASE_URL = "neo4j+s://eae81324.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "C3a6el-mB51BQGsGnWGARmZiog15X1Ag8vOMH9iBpLY"
SENDGRID_API_KEY = "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"

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
    for preference in preferences:
        database.user_to_category(email,preference)
    # user_to_category function
    return jsonify({"message": "User preferences registered successfully"})


@app.route('/updatePreferences', methods=['POST'])
def update_preferences():
    data = request.json
    email = data['email']
    category_preferences = data['updated_preferences']
    database.delete_user_to_category(email)
    for update_preference in category_preferences:
        database.user_to_category(email,update_preference)
    # user_to_category update
    return jsonify({"message": "User preferences updated successfully"})


@app.route('/getTopArticles', methods=['GET'])
def get_top_articles():
    # data = get_articles_from_db()  # Retrieve data from the database
    data = database.get_blogs_by_likes()
    resp = []
    for article_data in data:
        link = article_data['link']
        category = database.get_category_by_blog(article_data['link'])
        author = article_data['author']
        # article = read_article(link)
        # summary = summarize_article(article)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            # "summary": summary
        })
    print(resp)
    return jsonify(resp)

@app.route('/getTopArticlesPerUser', methods=['GET'])
def get_top_articles_per_user():
    # data = get_articles_from_db()  # Retrieve data from the database
    args = request.args
    category = args['category']
    limit = int(args['limit'])
    data = database.get_blogs_by_category_and_limit(category,limit)
    resp = []

    for article_data in data:
        link = article_data['link']
        author = article_data['author']
        # article = read_article(link)
        # summary = summarize_article(article)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            # "summary": summary
        })

    return jsonify(resp)

@app.route('/getTopArticlesfor', methods=['GET'])
def get_top_articles_by_category():
    args = request.args
    category = args['category']
    print(category)
    data = database.get_blogs_by_likes_and_category(category)
    resp = []
    for article_data in data:
        link = article_data['link']
        category = database.get_category_by_blog(article_data['link'])
        author = article_data['author']
        # article = read_article(link)
        # summary = summarize_article(article)
        resp.append({
            "link": link,
            "category": category,
            "author": author,
            # "summary": summary
        })
    print(resp)
    return jsonify(resp)

if __name__ == "__main__":
    database.create_user("test@mail", "sami")
    app.run(host='0.0.0.0', port=5000)
