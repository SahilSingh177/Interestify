import os
import threading

from datetime import datetime

import dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

from services import similar_articles, user_preference
from services.database.database import App
from services.email_automation import schedule_task
from services.springer import start_scraping_thread


app = Flask(__name__)
CORS(app, origins='*')
initialized = False

dotenv.load_dotenv()

uri = os.getenv("DATABASE_URL")
user = os.getenv("DATABASE_USER")
password = os.getenv("DATABASE_PASSWORD")
database = App(uri, user, password)


@app.before_request
def initialize():
    global initialized
    if not initialized:
        app.logger.info("Starting scraping thread...")
        start_scraping_thread()
        initialized = True

#SECTION 1 : CHECKS
@app.route('/checkUserRegistration', methods=['GET'])
def check_user_registration():
    try:
        email = request.args.get('email')
        return jsonify(database.check_user_registration(email))
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/hasSelectedCategories', methods=['POST'])
def has_selected_categories():
    try:
        data = request.json
        email = data['email']
        has_selected = database.check_user_browses_any_category(email)
        return jsonify(has_selected)
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 2 : CREATING USER AND REGISTRATION FOR SERVICES
#2.1: CREATING USER
@app.route('/registerUser', methods=['POST'])
def register_user():
    try:
        data = request.json
        email = data['email']
        username = data['username']
        database.create_user(email, username)
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500

#2.1: MAIL SERVICE
@app.route('/registerMail', methods=['POST'])
def register_mail():
    try:
        data = request.json
        email = data['email']
        database.register_mail(email)
        return jsonify({"message": "User registered successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/unregisterMail', methods=['POST'])
def unregister_mail():
    try:
        data = request.json
        email = data['email']
        database.unregister_mail(email)
        return jsonify({"message": "User unregistered successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 3 : CREATING BLOG AND CORRESPONDING CATEGORIES
#3.1: RETRIEVING BLOG
@app.route('/getArticle', methods=['GET'])
def get_article():
    try:
        article_id = int(request.args.get('article_id'))
        email = request.args.get('email')
        if article_id is None:
            return jsonify(error='ID parameter is missing'), 400
        article_data = database.get_blog_by_id(email, article_id)
        category = database.get_category_by_blog(article_id)
        article_data[0]["category"] = category
        return jsonify(data=article_data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 4 : SESSION DATA AND CATEGORY SCORE
#4.1: UPDATE CATEGORIES
@app.route('/updatePreferences', methods=['POST'])
def update_preferences():
    try:
        data = request.json
        email = data['email']
        preferences = data['updated_preferences']
        total_categories = len(preferences)
        database.category_sub(email, preferences,1/total_categories)
        return jsonify({"message": "User preferences updated successfully"})
    except Exception as e:
        return jsonify(error=str(e)), 500

 #4.2: UPDATE CATEGORY SCORE
@app.route('/updateCategoryScore', methods=['POST'])
def update_category_score():
    try:
        data = request.json
        user_email = data['email']
        category_name = data['category_name']
        duration = data['duration']
        database.user_to_category_browsing(user_email, category_name, duration, datetime.now())
        user_preference.publish_score(user_email)
        return jsonify({"result": "success"}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500  

#4.3: GETTING SEESION DATA
@app.route('/getCategoryData', methods=['GET'])
def get_category_data():
    try:
        email = request.args['email']
        data = database.get_session_data(email)
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

#4.4: GETTING SIMILAR ARTICLE
@app.route('/getSimilarArticles', methods=['GET'])
def get_similar_articles():
    try:
        article_id = int(request.args['article_id'])
        return jsonify(similar_articles.get_recommendations(article_id))
    except Exception as e:
        print('ok')
        return jsonify(error=str(e)), 500
    




# SECTION 5 : DISPLAYING BLOGS
#5.1: GETTING TOP BLOGS
@app.route('/getTopArticles', methods=['GET'])
def get_top_articles():
    try:
        args = request.args
        email = args.get('email', default=None, type=str)
        page = args.get('page', default=1, type=int)
        if email is not None:
            resp = database.top_blogs_by_email(email, page=page)
        else:
            data = database.get_blogs_by_likes(page=page)
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
                isLiked = article_data['isLiked']
                isBookmarked = article_data['isBookmarked']
                resp.append({
                    "link": link,
                    "title": title,
                    "category": category,
                    "author": author,
                    "summary": summary,
                    "time": time,
                    "id": id,
                    "likes": likes,
                    "isLiked": isLiked,
                    "isBookmarked": isBookmarked
                })
        return jsonify(resp)
    except Exception as e:
        return jsonify(error=str(e)), 500

#5.2: GETTING TOP BLOGS BY CATEGORY
@app.route('/getTopArticlesfor', methods=['GET'])
def get_top_articles_by_category():
    email = request.args.get('email', default=None, type=str)
    try:
        args = request.args
        category = args.get('category')
        page = int(args.get('page'))
        if email:
            data = database.get_blogs_by_likes(email, category_name=category, page=page)
            return jsonify(data)
        else:
            data = database.get_blogs_by_likes(email,category_name=category,page=page)
            return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

#5.2: GETTING RECENT BLOGS BY CATEGORY
@app.route('/getRecentArticlesfor', methods=['GET'])
def get_recent_articles_by_category():
    try:
        args = request.args
        category = args.get('category')
        page = int(args.get('page'))
        email = args.get('email')
        data = database.get_recent_blogs(email, category_name=category, page=page)
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500

#5.2: GETTING HOT BLOGS BY CATEGORY
@app.route('/getHotArticlesfor', methods=['GET'])
def get_hot_articles_by_category():
    try:
        args = request.args
        category = args.get('category')
        page = int(args.get('page'))
        email = args.get('email')
        data = database.get_hot_blogs(email=email,category_name=category, page=page)
        return jsonify(data)
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 6 : LIKES
#6.1: IS BLOG LIKED BY A PARTICULAR USER?
@app.route('/isArticleLiked', methods=['GET'])
def is_article_liked():
    try:
        email = request.args['email']
        blog_id = request.args['blog_id']
        ans = database.isBlogLiked(email, blog_id)
        if ans:
            return jsonify({"message": True})
        else:
            return jsonify({"message": False})
    except Exception as e:
        return jsonify(error=str(e)), 500

#6.2: LIKE A BLOG 
@app.route('/likeArticle', methods=['GET'])
def like_article():
    try:
        email = request.args['email']
        blog_id = request.args['blog_id']
        ans = database.add_likes_to_blog(email, blog_id)
        if ans:
            return jsonify({"total_likes": ans[0]["likecount"]})
        else:
            return jsonify({"message": "Article already liked"})
    except Exception as e:
        return jsonify(error=str(e)), 500

#6.2: UNLIKE A BLOG 
@app.route('/dislikeArticle', methods=['GET'])
def dislike_article():
    try:
        email = request.args['email']
        blog_id = request.args['blog_id']
        ans = database.remove_likes_from_blog(email, blog_id)
        if ans:
            return jsonify({"total_likes": ans[0]["likecount"]})
        else:
            return jsonify({"message": "Article already disliked"})
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 7 : BOOKMARKS
#7.1: IS BLOG BOOKMARKED BY A PARTICULAR USER?
@app.route('/isArticleBookmarked', methods=['GET'])
def is_article_bookmarked():
    try:
        email = request.args['email']
        blog_id = request.args['blog_id']
        ans = database.isBlogBookmarked(email, blog_id)
        if ans:
            return jsonify({"message": True})
        else:
            return jsonify({"message": False})
    except Exception as e:
        return jsonify(error=str(e)), 500

#7.2: RETRIEVING BOOKMARKS
@app.route('/getBookMarks', methods=['GET'])
def get_bookmarks():
    try:
        user_email = request.args.get('email')
        if user_email is None:
            return jsonify(error='Email parameter is missing'), 400
        data = database.get_user_blogs(user_email)
        return jsonify(data=data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

#7.3: BOOKMARKING A BLOG
@app.route('/addBookmark', methods=['GET'])
def add_bookmark():
    try:
        email = request.args.get('email')
        blog_id = request.args.get('id')
        database.user_to_blog(email, blog_id)
        return jsonify({"result": "success"}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

#7.4: REMOVE BOOKMARK
@app.route('/deleteBookmark', methods=['GET'])
def delete_bookmark():
    try:
        email = request.args.get('email')
        id = request.args.get('id')
        database.delete_user_to_blog(email, id)
        return jsonify({"result": "success"}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 8 : HISTORY
#8.1: ADDING BLOG TO HISTORY
@app.route('/registerBlog', methods=['POST'])
def register_blog():
    try:
        data = request.json
        email = data['email']
        blog_id = data['blog_id']
        res = database.user_to_blog_read(email, blog_id)
        if res:
            return jsonify({"message": "Blog registered successfully"})
        else:
            return jsonify({"message": res})
    except Exception as e:
        return jsonify(error=str(e)), 500
    
#8.2: RETRIEVING HISTORY
@app.route('/history', methods=['GET'])
def get_history():
    try:
        email = request.args['email']
        page = request.args['page']
        page = int(page)
        data = database.get_history(email,page)
        if data:
            resp = []
            for article_data in data:
                link = article_data['link']
                title = article_data['title']
                category = database.get_category_by_blog(article_data['id'])
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
                    "id": id,
                    "rid": rid
                })
            return jsonify(data=resp)
        else:
            return jsonify({"message": "No history found"})
    except Exception as e:
        return jsonify(error=str(e)), 500
    
#8.3: DELETING A BLOG FROM HISTORY
@app.route('/deletehistory', methods=['GET'])
def delete_history():
    try:
        email = request.args['email']
        rid = request.args['rid']
        database.delete_history(email, rid)
        return jsonify({"result": "success"}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500





# SECTION 9 : SEARCHING THE DATABASE
#9.1: SEARCH ARTICLES
@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.json
        text = data['text']
        results = database.search(text)
        return jsonify(results)
    except Exception as e:
        return jsonify(error=str(e)), 500

#9.2: SEARCH BOOKMARKS
@app.route('/searchBookmark', methods=['POST'])
def search_bookmark():
    try:
        data = request.json
        text = data['text']
        email = data['email']
        results = database.search_bookmark(text=text, email=email)
        return jsonify(results)
    except Exception as e:
        return jsonify(error=str(e)), 500

#9.3: SEARCH HISTORY
@app.route('/searchHistory', methods=['POST'])
def search_history():
    try:
        data = request.json
        text = data['text']
        email = data['email']
        results = database.search_history(text=text, email=email)
        if results:
            resp = []
            for article_data in results:
                link = article_data['link']
                title = article_data['title']
                category = database.get_category_by_blog(article_data['id'])
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
                    "id": id,
                    "rid": rid
                })
            return jsonify(data=resp)
        else:
            return jsonify({"message": "No history found"})
    except Exception as e:
        return jsonify(error=str(e)), 500

#9.4: SEARCH CATEGORY
@app.route('/searchCategory', methods=['POST'])
def search_category():
    try:
        data = request.json
        text = data['text']
        results = database.search_category(text=text)
        return jsonify(results)
    except Exception as e:
        return jsonify(error=str(e)), 500


def run_flask_app():
    app.run(host='0.0.0.0', port=5000)


if __name__ == "__main__":
    task_thread = threading.Thread(target=schedule_task)
    app_thread = threading.Thread(target=run_flask_app)

    task_thread.start()
    app_thread.start()

    task_thread.join()
    app_thread.join()
