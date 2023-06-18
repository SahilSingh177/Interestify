from datetime import datetime
from flask import Flask, request, jsonify
from sendgrid import SendGridAPIClient
from services.database.database import App
from services.springer import start_scraping_thread
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
    username = data['username']
    print(email)
    # save it in database
    database.create_user(email, username)
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

@app.route('/registerBlog', methods=['POST'])
def register_blog():
    data = request.json
    email = data['email']
    blog_id = data['blog_id']
    # save it in database
    res = database.user_to_blog_read(email,blog_id)
    if res:
        return jsonify({"message": "Blog registered successfully"})
    else:
        return jsonify({"message": res})
    

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
    data = database.get_blogs_by_likes()
    resp = []
    for article_data in data:
        link = article_data['link']
        title = article_data['title']
        category = database.get_category_by_blog(article_data['id'])
        likes = article_data['likes']
        author = article_data['author']
        summary = article_data['summary']
        time = article_data['read_time']
        id = article_data['id']
        # print(data)

        resp.append({
            "link": link,
            "title": title,
            "category": category,
            "author": author,
            "summary": summary,
            "time": time,
            "id": id,
            "likes": likes,
        })
    print(resp)
    return jsonify(resp)

@app.route('/likeArticle', methods=['GET'])
def like_article():
    args = request.args
    email = args['email']
    blog_id = args['blog_id']
    ans = database.add_likes_to_blog(email,blog_id)
    if ans:
        return jsonify({"total_likes": ans[0]["likecount"]})
    else:
        return jsonify({"message": "Article already liked"})

@app.route('/dislikeArticle', methods=['GET']) 
def dislike_article():
    args = request.args
    email = args['email']
    blog_id = args['blog_id']
    ans = database.remove_likes_from_blog(email,blog_id)
    # print(ans)
    if ans:
        return jsonify({"total_likes": ans[0]["likecount"]})
    else:
        return jsonify({"message": "Article already disliked"})


@app.route('/isArticleLiked', methods=['GET'])
def is_article_liked():
    args = request.args
    email = args['email']
    blog_id = args['blog_id']
    ans = database.isBlogLiked(email,blog_id)
    if ans:
        return jsonify({"message": True})
    else:
        return jsonify({"message": False})

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
    print("here")
    category = args.get('category')
    print(category)
    data = database.get_blogs_by_likes(category)
    return jsonify(data)

@app.route('/addBookmark',methods=['GET'])
def addBookmark():
    email = request.args.get('email')
    link = request.args.get('link')
    try:
        database.user_to_blog(email,link)
        return jsonify({"result":"success"}),200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/deleteBookmark',methods=['GET'])
def deleteBookmark():
    email = request.args.get('email')
    link = request.args.get('link')
    try:
        database.delete_user_to_blog(email,link)
        return jsonify({"result":"success"}),200
    except Exception as e:
        return jsonify(error=str(e)), 500
    

@app.route('/isArticleBookmarked', methods=['GET'])
def is_article_bookmarked():
    args = request.args
    email = args['email']
    blog_id = args['blog_id']
    ans = database.isBlogBookmarked(email,blog_id)
    if ans:
        return jsonify({"message": True})
    else:
        return jsonify({"message": False})
    

@app.route('/addLike',methods=['GET'])
def addLike():
    email = request.args.get('email')
    link = request.args.get('link')
    try:
        database.user_to_blog(email,link)
        return jsonify({"result":"success"}),200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/deleteLike',methods=['GET'])
def deleteLike():
    email = request.args.get('email')
    link = request.args.get('link')
    try:
        database.delete_user_to_blog(email,link)
        return jsonify({"result":"success"}),200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/getBookMarks', methods=['GET'])
def getBookMarks():
    try:
        user_email = request.args.get('email')
        if user_email is None:
            return jsonify(error='Email parameter is missing'), 400

        data = database.get_user_blogs(user_email)
        print(data)
        return jsonify(data=data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/getArticle',methods=['GET'])    
def getArticle():
    try:
        article_id = request.args.get('article_id')
        # print(type(article_id))
        article_id = int(article_id)
        if article_id is None:
            return jsonify(error='ID parameter is missing'), 400
        data = database.get_blog_by_id(article_id)
        print(data)
        return jsonify(data=data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/history',methods=['GET'])
def get_history():
    args = request.args
    email = args['email']
    data = database.get_history(email)
    if data:
        print(data)
        resp = []
        for article_data in data:
            link = article_data['link']
            title = article_data['title']
            category = database.get_category_by_blog(article_data['link'])
            author = article_data['author']
            history_time = article_data['time']
            id = article_data['id']
            rid = article_data['rid']
            date = str(history_time.date().isoformat())

            resp.append({
                "link": link,
                "title": title,
                "category": category,
                "author": author,
                "date": date,
                # "time": time,
                "id": id,
                "rid": rid
            })
        print(resp)
        return jsonify(data=resp)
    else:
        return jsonify({"message":"No history found"})

@app.route('/deletehistory', methods=['GET'])
def delete_history():
    args = request.args
    email = args['email']
    rid = args['rid']
    try:
        database.delete_history(email,rid)
        return jsonify({"result":"success"}),200
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
