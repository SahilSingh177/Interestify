from datetime import datetime, timedelta
import logging
import math
import random
from typing import Optional

from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError
from pathlib import Path

from .read_article import read_article

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Closing the driver connection when we are finished with it
        self.driver.close()

    # Checks
    def check_user_exists(self, user_email):
        with self.driver.session(database="neo4j") as session:
            try:
                return session.execute_read(self._check_user_exists, user_email)
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _check_user_exists(tx, user_email):
        query = (
            "MATCH (u:User) "
            "WHERE u.email = $user_email "
            "RETURN u"
        )
        result = tx.run(query, user_email=user_email)
        # Check if result has any data or multiple data
        if result.peek():
            return True
        else:
            return False

    def check_blog_exists(self, blog_link):
        with self.driver.session(database="neo4j") as session:
            try:
                return session.execute_read(self._check_blog_exists, blog_link)
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _check_blog_exists(tx, blog_link):
        query = (
            "MATCH (b:Blog) "
            "WHERE b.link = $blog_link "
            "RETURN b"
        )
        result = tx.run(query, blog_link=blog_link)
        # Check if result has any data or multiple data
        if result.peek():
            return True
        else:
            return False

    def check_category_exists(self, category_name):
        with self.driver.session(database="neo4j") as session:
            try:
                return session.execute_read(self._check_category_exists, category_name)
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _check_category_exists(tx, category_name):
        query = (
            "MATCH (c:Category) "
            "WHERE c.name = $category_name "
            "RETURN c"
        )
        result = tx.run(query, category_name=category_name)
        # Check if result has any data or multiple data
        if result.peek():
            return True
        else:
            return False

    # Creation
    def create_user(self, user_email, user_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_user_exists(user_email):
                return False
            try:
                result = session.execute_write(self._create_user, user_email, user_name)
                return True
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _create_user(tx, user_email, user_name):
        query = (
            "CREATE (u:User { name: $user_name, email: $user_email, registered: False }) "
            "RETURN u"
        )
        result = tx.run(query, user_email=user_email, user_name=user_name)
        return result

    def register_mail(self, user_email):
        with self.driver.session(database="neo4j") as session:
            try:
                result = session.execute_write(self._register_mail, user_email)
                return True
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _register_mail(tx, user_email):
        query = (
            "MATCH (u:User { email: $user_email }) "
            "SET u.registered = True "
            "RETURN u"
        )
        try:
            result = tx.run(query, user_email=user_email)
            return [{"u": record["u"]["name"]} for record in result]
        except Neo4jError as exception:
            logging.error("Error executing query: {exception}".format(exception=exception))
            raise

    def unregister_mail(self, user_email):
        with self.driver.session(database="neo4j") as session:
            try:
                result = session.execute_write(self._unregister_mail, user_email)
                return True
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _unregister_mail(tx, user_email):
        query = (
            "MATCH (u:User { email: $user_email }) "
            "SET u.registered = False "
            "RETURN u"
        )
        try:
            result = tx.run(query, user_email=user_email)
            return [{"u": record["u"]["name"]} for record in result]
        except Neo4jError as exception:
            logging.error("Error executing query: {exception}".format(exception=exception))
            raise

    def search(self, text):
        with self.driver.session(database="neo4j") as session:
            try:
                result = session.execute_write(self._search, text)
                return result
            except Neo4jError as exception:
                logging.error("Error executing query: {exception}".format(exception=exception))
                raise

    @staticmethod
    def _search(tx, text):
        text += '~'
        query = (
            'CALL db.index.fulltext.queryNodes("BlogName", $searchTerm) YIELD node, score '
            'RETURN node.title AS title, ID(node) AS id '
            'LIMIT 10'
        )
        try:
            result = tx.run(query, searchTerm=text)
            formatted_result = [(record["title"], record["id"]) for record in result]
            return formatted_result
        except Neo4jError as exception:
            logging.error("Error executing query: {exception}".format(exception=exception))
            raise

    def check_user_registration(self, user_email):
        with self.driver.session(database="neo4j") as session:
            return session.execute_read(self._check_user_registration, user_email)

    @staticmethod
    def _check_user_registration(tx, user_email):
        query = (
            "MATCH (u:User) "
            "WHERE u.email = $user_email "
            "RETURN u.registered"
        )
        result = tx.run(query, user_email=user_email)
        # Check if result has any data or multiple data
        if result.peek():
            return result.single()[0]
        else:
            return False

    @staticmethod
    def _search(tx, text):
        text += '~'
        query = (
            'CALL db.index.fulltext.queryNodes("BlogName", $searchTerm) YIELD node, score '
            'RETURN node.title AS title, ID(node) as id '
            'LIMIT 10'
        )
        result = tx.run(query, searchTerm=text)
        formatted_result = [(record["title"], record["id"]) for record in result]
        return formatted_result

    def searchBookmark(self, email, text):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(self._searchBookmark, email, text)
            return result

    @staticmethod
    def _searchBookmark(tx, email, text):
        text += '~'
        query = (
            'CALL db.index.fulltext.queryNodes("BlogName", $searchTerm) YIELD node, score '
            'MATCH (user:User)-[:BOOKMARK]->(node) '
            'WHERE user.email = $email '
            'RETURN node.link AS link, score'
        )
        result = tx.run(query, searchTerm=text, email=email)
        formatted_result = [record['link'] for record in result]
        return formatted_result

    def searchHistory(self, email, text):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(self._searchHistory, email, text)
            return result

    @staticmethod
    def _searchHistory(tx, email, text):
        text += '~'
        query = (
            'CALL db.index.fulltext.queryNodes("BlogName", $searchTerm) YIELD node, score '
            'MATCH (user:User)-[:READS]->(node) '
            'WHERE user.email = $email '
            'RETURN node.link AS link, score'
        )
        result = tx.run(query, searchTerm=text, email=email)
        formatted_result = [record['link'] for record in result]
        return formatted_result

    def searchCategory(self, text):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_write(self._searchCategory, text)
            return result

    @staticmethod
    def _searchCategory(tx, text):
        query = (
            'CALL db.index.fulltext.queryNodes("CategoryName", $searchTerm+"*") YIELD node, score '
            'RETURN node.name AS name, score'
        )
        result = tx.run(query, searchTerm=text)
        formatted_result = [record['name'] for record in result]
        return formatted_result

    def create_blog(self, blog_title, blog_link, blog_author, download_link, category_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_blog_exists(blog_link):
                return False
            if not self.check_category_exists(category_name):
                self.create_category(category_name)
            try:
                summaryData = read_article(download_link)
                text = summaryData[0]
                summary = summaryData[1]
                read_time = str(summaryData[2])
                summary_text = summary.summary
                lines = summary_text.splitlines()
                cleaned_lines = [line.lstrip("- ") for line in lines]
                cleaned_summary = "\n".join(cleaned_lines)
                result = session.execute_write(
                    self._create_blog, blog_title, blog_link, blog_author, read_time, download_link, cleaned_summary, text,
                    category_name)
                return True
            except:
                return False

    @staticmethod
    def _create_blog(tx, blog_title, blog_link, blog_author, read_time, download_link, summary, text, category_name):
        query = (
            "CREATE (b:Blog { title: $blog_title, link: $blog_link, author: $blog_author, read_time: $read_time, download_link: $download_link, summary: $summary, text: $text, created_at: $created_at }) "
            "WITH b "
            "MATCH (c:Category) WHERE c.name = $category_name "
            "MERGE (b)-[:BELONGS_TO]->(c) "
            "RETURN b"
        )
        result = tx.run(query, blog_title=blog_title, blog_link=blog_link, blog_author=blog_author, read_time=read_time,
                        download_link=download_link, summary=summary, text=text, category_name=category_name,
                        created_at=datetime.now())
        try:
            return [{"b": record["b"]["title"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(query=query, exception=exception))
            raise

    def create_category(self, category_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_category_exists(category_name):
                return False
            result = session.execute_write(self._create_category, category_name)
            return True

    @staticmethod
    def _create_category(tx, category_name):
        query = (
            "CREATE (c:Category { name: $category_name }) "
            "RETURN c"
        )
        result = tx.run(query, category_name=category_name)
        try:
            return [{"c": record["c"]["name"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(query=query, exception=exception))
            raise


    # Relationship
    def blog_to_category(self, blog_link, category_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_blog_exists(blog_link):
                return False
            if not self.check_category_exists(category_name):
                return False
            result = session.execute_write(self._blog_to_category, blog_link, category_name)
            return True

    @staticmethod
    def _blog_to_category(tx, blog_link, category_name):
        query = (
            "MATCH (b:Blog {link:$blog_link}), (c:Category {name:$category_name}) "
            "MERGE (b)-[r:IN_CATEGORY]->(c) "
            "RETURN b, c"
        )
        result = tx.run(query, blog_link=blog_link, category_name=category_name)
        try:
            return [{"b": record["b"]["title"], "c": record["c"]["name"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(query=query, exception=exception))
            raise


    def find_all_categories_for_user(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.execute_read(
                self._find_all_categories_for_user, user_email)
            return result

    @staticmethod
    def _find_all_categories_for_user(tx, user_email):
        query = (
            "MATCH (u:User {email:$user_email})-[r:BROWSES]->(c:Category) "
            "RETURN c.name as name"
        )
        result = tx.run(query, user_email=user_email)
        try:
            return [{"name": record["c"]["name"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def user_to_category_browsing(self, user_email, category_name, session_time, session_date):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            if not self.check_category_exists(category_name):
                return False
            result = session.execute_write(
                self._user_to_category_browsing, user_email, category_name, session_time, session_date)
            return True

    @staticmethod
    def _user_to_category_browsing(tx, user_email, category_name, session_time, session_date):
        query = (
            "MATCH (u:User {email: $user_email}) "
            "MERGE (u)-[r:BROWSES]->(c:Category {name: $category_name}) "
            "SET r.session_time = COALESCE(r.session_time, []) + [$session_time], "
            "r.session_date = COALESCE(r.session_date, []) + [$session_date] "
            "RETURN u, c"
        )
        result = tx.run(query, user_email=user_email, category_name=category_name, session_time=session_time, session_date=session_date)
        try:
            return [{"u": record["u"]["email"], "c": record["c"]["name"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def get_duration_and_timestamp(self, user_email):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (u:User{email:$email})-[r:BROWSES]->(c:Category) "
                "RETURN r.session_time as session_time, r.session_date as session_date, c.name as category_name, u.email as user_email "
            )
            result = session.run(query, email=user_email)
            return [
                {"session_time": record["session_time"], "session_date": record["session_date"], "category_name": record["category_name"], "user_email": record["user_email"]}
                for record in result
            ]


    def set_category_score(self, user_email, category_name, score):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            if not self.check_category_exists(category_name):
                return False
            result = session.execute_write(
                self._set_category_score, user_email, category_name, score)
            return True

    @staticmethod
    def _set_category_score(tx, user_email, category_name, score):
        query = (
            "MATCH (u:User {email: $user_email})-[r:BROWSES]->(c:Category {name: $category_name}) "
            "SET r.score = $score "
            "RETURN u, c, r"
        )
        result = tx.run(query, user_email=user_email, category_name=category_name, score=score)
        try:
            return [{"u": record["u"]["email"], "c": record["c"]["name"], "score": record["r"]["score"]} for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def get_category_score(self, user_email):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (u:User{email:$email})-[r:BROWSES]->(c:Category) "
                "RETURN r.score as score, c.name as category_name, u.email as user_email "
            )
            result = session.run(query, email=user_email)
            return [
                {"score": record["score"], "category_name": record["category_name"], "user_email": record["user_email"]}
                for record in result
            ]

    def get_most_liked_not_read_blogs_by_category_score_limit(self, user_email, category_name, skip, limit):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (u:User{email:$email})-[r:BROWSES]->(c:Category{name:$category_name}) "
                "MATCH (b:Blog)-[r2:BELONGS_TO]->(c:Category) "
                "WHERE NOT (u)-[:READS]->(b) "
                "WITH b, r2, r.score as score, c.name as category_name "
                "MATCH (u2:User)-[r3:LIKES]->(b) "
                "WITH b, score, category_name, COUNT(r3) as likes "
                "RETURN b.author AS author, b.title AS title, b.link AS link, b.summary AS summary, b.read_time as read_time, ID(b) AS id, score, category_name, likes "
                "ORDER BY likes DESC "
                "SKIP $skip "
                "LIMIT $limit "
                "UNION "
                "MATCH (u:User{email:$email})-[r:BROWSES]->(c:Category{name:$category_name}) "
                "MATCH (b:Blog)-[r2:BELONGS_TO]->(c:Category) "
                "WHERE NOT (u)-[:READS]->(b) "
                "WITH b, r2, r.score as score, c.name as category_name "
                "WHERE NOT (u:User)-[r:LIKES]->(b) "
                "RETURN b.author AS author, b.title AS title, b.link AS link, b.summary AS summary, b.read_time as read_time, ID(b) AS id, score, category_name, 0 as likes "
                "ORDER BY b.created_at DESC "
                "SKIP $skip "
                "LIMIT $limit"
            )
            result = session.run(query, email=user_email, category_name=category_name, skip=skip, limit=limit)
            return [
                {"author": record["author"], "title": record["title"], "link": record["link"], "category_name": record["category_name"], "summary": record["summary"], "time": record["read_time"], "id": record["id"], "likes": record["likes"]}
                for record in result
            ]

    def top_blogs_by_email(self, user_email, page: int = 1, limit: int = 10):
        skip = (page - 1) * limit
        res = []
        ans = self.get_category_score(user_email)
        added_ids = set()  # Set to store unique IDs

        for i in ans:
            if i["score"] is None:
                continue
            else:
                val = self.get_most_liked_not_read_blogs_by_category_score_limit(
                    user_email, i["category_name"], skip, math.ceil(i["score"] * limit)
                )
                for j in val:
                    if j["id"] not in added_ids:  # Check if ID is already added
                        temp = {
                            "category": j["category_name"],
                            "title": j["title"],
                            "link": j["link"],
                            "summary": j["summary"],
                            "time": j["time"],
                            "id": j["id"],
                            "likes": j["likes"],
                            "author": j["author"]
                        }
                        res.append(temp)
                        added_ids.add(j["id"])  # Add ID to the set
        random.shuffle(res)
        return res
    
    def get_session_data(self, user_email):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (u:User{email:$email})-[r:BROWSES]->(c:Category) "
                "RETURN c.name as category_name,r.session_date as session_date,r.session_time as session_time "
            )
            result = session.run(query, email=user_email)
            res = []
            for record in result:
                if record["session_date"] is not None:
                    duration = 0
                    for i in range(len(record["session_date"])):
                        original = str(record['session_date'][i])
                        fixed_datetime = original[:-3] 
                        parsed_datetime = datetime.fromisoformat(fixed_datetime)
                        if (datetime.now() - parsed_datetime).days > 30:
                            continue
                        else:
                            duration += int(record["session_time"][i])
                    res.append({"category_name": record["category_name"], "duration": duration})
                else:
                    continue
            return res

    def get_blog_by_id(self, article_id):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (b:Blog) WHERE ID(b)=$article_id "
                "RETURN b.author AS author, b.title AS title, b.link AS link, b.download_link AS pdf_link, b.summary AS summary, b.read_time as read_time, ID(b) AS id, b.text as text"
            )
            result = session.run(query, article_id=article_id)
            return [
                {"author": record["author"], "title": record["title"], "link": record["link"], "pdf_link": record["pdf_link"], "summary": record["summary"], "read_time":record["read_time"], "id":record["id"], "text":record["text"]}
                for record in result
            ]   
            # create seprate

    def user_to_blog(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.write_transaction(self._user_to_blog, user_email, blog_id)
            return True

    @staticmethod
    def _user_to_blog(tx, user_email, blog_id):
        query = (
            "MATCH (u:User {email:$user_email}), (b:Blog) "
            "WHERE ID(b)=$blog_id "
            "MERGE (u)-[r:BOOKMARK]->(b) "
            "RETURN u, b"
        )
        result = tx.run(query, user_email=user_email, blog_id=int(blog_id))
        try:
            return [{"u": record["u"]["email"], "b": record["b"]["title"]} for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def delete_user_to_blog(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.write_transaction(self._delete_user_to_blog, user_email, blog_id)
            return True

    @staticmethod
    def _delete_user_to_blog(tx, user_email, blog_id):
        query = (
            "MATCH (u:User {email:$user_email})-[r:BOOKMARK]->(b:Blog) WHERE ID(b)=$blog_id "
            "DELETE r "
            "RETURN u, b"
        )
        result = tx.run(query, user_email=user_email, blog_id=int(blog_id))
        try:
            return [{"u": record["u"]["email"], "b": record["b"]["title"]} for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_user_blogs(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return []

            query = (
                "MATCH (u:User {email: $user_email})-[r:BOOKMARK]->(b:Blog) "
                "MATCH (b)-[:BELONGS_TO]->(c:Category) "
                "RETURN b.title, b.link, b.author, ID(b), c.name AS category_name"
            )
            result = session.run(query, user_email=user_email)
            user_blogs = [
                {
                    "title": record["b.title"],
                    "link": record["b.link"],
                    "author": record["b.author"],
                    "id": record["ID(b)"],
                    "category": record["category_name"],
                }
                for record in result
            ]
            return user_blogs

    def isBlogBookmarked(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            query = (
                "MATCH (u:User {email: $user_email})-[r:BOOKMARK]->(b:Blog) "
                "WHERE ID(b) = $blog_id "
                "RETURN r"
            )
            result = session.run(query, user_email=user_email, blog_id=int(blog_id))
            return result.peek()
        
    def isBlogLiked(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            query = (
                "MATCH (u:User {email: $user_email})-[r:LIKES]->(b:Blog) "
                "WHERE ID(b) = $blog_id "
                "RETURN r"
            )
            result = session.run(query, user_email=user_email, blog_id=int(blog_id))
            return result.peek()
        
    def add_likes_to_blog(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            try:
                if not self.check_user_exists(user_email):
                    return False
                result = session.execute_write(
                    self._add_likes_to_blog, user_email, int(blog_id))
                return result
            except Exception as e:
                return False
        
    @staticmethod
    def _add_likes_to_blog(tx, user_email, blog_id):
        query = (
            "MATCH (u:User {email:$user_email}), (b:Blog) WHERE ID(b) = $blog_id "
            "MERGE (u)-[r:LIKES]->(b) "
            "WITH b "
            "MATCH (u2:User)-[r2:LIKES]->(b) "
            "WITH COUNT(r2) AS likecount "
            "RETURN likecount"
        )
        result = tx.run(query, user_email = user_email, blog_id = blog_id)
        try:
            return [{"likecount": record["likecount"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def remove_likes_from_blog(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            try:
                if not self.check_user_exists(user_email):
                    return False
                result = session.execute_write(
                    self._remove_likes_from_blog, user_email, int(blog_id))
                return result
            except Exception as e:
                return False
            
    @staticmethod
    def _remove_likes_from_blog(tx, user_email, blog_id):
        try:
            query = (
                "MATCH (u:User {email: $user_email})-[r:LIKES]->(b:Blog) "
                "WHERE ID(b) = $blog_id "
                "DELETE r "
                "WITH b "
                "MATCH (u2:User)-[r2:LIKES]->(b) "
                "WITH COUNT(*) AS likecount "
                "RETURN likecount"

            )
            result = tx.run(query, user_email = user_email, blog_id = blog_id)
            return [{"likecount": record["likecount"]}
                        for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise
    
    def get_blogs_by_likes(self, category_name: Optional[str]=None, page: int = 1, page_limit: int = 5):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_blogs_by_likes, category_name, page, page_limit)
            return result

    @staticmethod
    def _get_blogs_by_likes(tx, category_name: Optional[str]=None, page: int = 1, page_limit: int = 5):
        skip_count = (page - 1) * page_limit
        if category_name:
            query = (
                "MATCH (u:User)-[r:LIKES]->(b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WITH b, COUNT(r) AS likeCount "
                "RETURN b.title AS title, likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "SKIP $skip_count "
                "LIMIT $page_limit "
                "UNION "
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WHERE NOT EXISTS((:User)-[:LIKES]->(b)) "
                "RETURN b.title AS title, 0 AS likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY likeCount DESC, b.created_at DESC "
                "SKIP $skip_count "
                "LIMIT $page_limit"
            )

            result = tx.run(
                query,
                category_name=category_name,
                skip_count=skip_count,
                page_limit=page_limit
            )
        else:
            query = (
                "MATCH (u:User)-[r:LIKES]->(b:Blog) "
                "WITH b, COUNT(r) AS likeCount "
                "ORDER BY likeCount DESC "
                "RETURN b.title AS title, likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "SKIP $skip_count "
                "LIMIT $page_limit "
                "UNION "
                "MATCH (b:Blog) "
                "WHERE NOT EXISTS((:User)-[:LIKES]->(b)) "
                "RETURN b.title AS title, 0 AS likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY b.created_at DESC "
                "SKIP $skip_count "
                "LIMIT $page_limit"
            )
            result = tx.run(
                query,
                skip_count=skip_count,
                page_limit=page_limit
            )

        try:
            return [
                {
                    "author": record["author"],
                    "title": record["title"],
                    "link": record["link"],
                    "pdf_link": record["download_link"],
                    "summary": record["summary"],
                    "read_time": record["read_time"],
                    "id": record["id"],
                    "likes": record["likeCount"]
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_recent_blogs(self, category_name: Optional[str] = None, limit: int = 10, page: int = 1, page_limit: int = 5):
        with self.driver.session(database="neo4j") as session:
            skip_count = (page - 1) * page_limit
            if category_name:
                query = (
                    "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                    "RETURN b.title AS title, b.author AS author, b.link AS link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                    "ORDER BY b.created_at DESC "
                    "SKIP $skip_count "
                    "LIMIT $page_limit"
                )
                result = session.run(
                    query,
                    category_name=category_name,
                    skip_count=skip_count,
                    page_limit=page_limit
                )
            else:
                query = (
                    "MATCH (b:Blog) "
                    "RETURN b.title AS title, b.author AS author, b.link AS link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                    "ORDER BY b.created_at DESC "
                    "SKIP $skip_count "
                    "LIMIT $page_limit"
                )
                result = session.run(
                    query,
                    skip_count=skip_count,
                    page_limit=page_limit
                )
            try:
                return [
                {
                    "author": record["author"],
                    "title": record["title"],
                    "link": record["link"],
                    "summary": record["summary"],
                    "read_time": record["read_time"],
                    "id": record["id"],
                    "likes": self.get_count_of_likes(record["id"])
                }
                for record in result
            ]
            except Neo4jError as exception:
                logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
                raise

    def get_hot_blogs(self, category_name: Optional[str] = None, limit: int = 10, page: int = 1, page_limit: int = 5):
        #Fetch most liked blogs in last 7 days
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                self._get_hot_blogs,
                category_name,
                limit,
                page,
                page_limit
            )
            return result
        
    @staticmethod
    def _get_hot_blogs(
        tx,
        category_name: Optional[str] = None,
        limit: int = 10,
        page: int = 1,
        page_limit: int = 5
    ):
        skip_count = (page - 1) * page_limit
        if category_name:
            query = (
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WITH b "
                "MATCH (:User)-[r:LIKES]->(b) "
                "WHERE date(b.created_at) > date($time) "
                "WITH b, COUNT(r) AS likecount "
                "RETURN b.title as title,b.author as author,b.link as link,likecount,b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY likecount DESC SKIP $skip_count LIMIT $limit"
            )
            result = tx.run(
                query,
                time = datetime.now()-timedelta(days=7),
                limit = limit,
                category_name=category_name,
                skip_count=skip_count,
                page_limit=page_limit
            )
        else:
            query = (
                "MATCH (b:Blog) "
                "WITH b "
                "MATCH (:User)-[r:LIKES]->(b) "
                "WHERE date(b.created_at) > date($time) "
                "WITH b, COUNT(r) AS likecount "
                "RETURN b.title as title,b.author as author,b.link as link,likecount,b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY likecount DESC LIMIT $limit"
            )
            result = tx.run(
                query,
                time = datetime.now()-timedelta(days=7),
                skip_count=skip_count,
                page_limit=page_limit,
                limit = limit
            )

        try:
            return [
                {
                    "author": record["author"],
                    "title": record["title"],
                    "link": record["link"],
                    "summary": record["summary"],
                    "read_time": record["read_time"],
                    "id": record["id"],
                    "likes": record["likecount"]
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise
    
    def get_category_by_blog(self, blog_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_category_by_blog, blog_id)
            if result:
                return result[0]
            else:
                return None
    def get_top_categories_for_a_user(self,user_email):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                self._get_top_categories_for_a_user,
                user_email
            )
            return result
        
    @staticmethod
    def _get_top_categories_for_a_user(tx,user_email):
        query = (
            "MATCH (u:User{email:$user_email})-[:BROWSES]->(c:Category) "
            "RETURN c.name AS category_name "
            "ORDER BY c.score DESC "
            "LIMIT 5"
        )
        result = tx.run(
            query,
            user_email=user_email
        )
        try:
            return [
                {
                    "category_name": record["category_name"]
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_top_blog_for_a_category(self,category_name):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                self._get_top_blog_for_a_category,
                category_name
            )
            return result
        
    @staticmethod
    def _get_top_blog_for_a_category(tx,category_name):
        query = (
            "MATCH (c:Category{name:$category_name})<-[:BELONGS_TO]-(b:Blog) "
            "WITH b "
            "MATCH (:User)-[r:LIKES]->(b) "
            "WITH b, COUNT(r) AS likecount "
            "RETURN b.title AS title, b.link AS link, b.summary AS summary, b.author AS author "
            "ORDER BY likecount DESC "
            "LIMIT 1"
        )
        result = tx.run(
            query,
            category_name=category_name
        )
        try:
            return [
                {
                    "title": record["title"],
                    "link": record["link"],
                    "summary": record["summary"],
                    "author": record["author"],
                    "category_name": category_name
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_all_users(self):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_all_users)
            res = {}
            for record in result:
                email = record
                categories = self.get_top_categories_for_a_user(email)
                books = []
                for category in categories:
                    top_blog = self.get_top_blog_for_a_category(category["category_name"])
                    if top_blog:
                        book = {
                            "title": top_blog[0]["title"],
                            "author": top_blog[0]["author"],
                            "category": category["category_name"],
                            "url": top_blog[0]["link"],
                            "summary": top_blog[0]["summary"]
                        }
                        books.append(book)
                res[email] = books
        return res

    @staticmethod
    def _get_all_users(tx):
        query = (
            "MATCH (u:User) WHERE u.registered = True "
            "RETURN u.email AS email"
        )
        result = tx.run(query)
        try:
            return [record.get("email") for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    @staticmethod
    def _get_category_by_blog(tx, blog_id):
        query = (
            "MATCH (b:Blog)-[r:BELONGS_TO]->(c:Category) WHERE ID(b) = $blog_id "
            "RETURN c.name AS categoryName"
        )
        result = tx.run(query, blog_id=blog_id)
        try:
            return [record.get("categoryName") for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def check_user_browses_any_category(self, user_email):
        if not self.check_user_exists(user_email):
            return False
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(
                self._check_user_browses_any_category,
                user_email
            )
            return result
        
    @staticmethod
    def _check_user_browses_any_category(tx,user_email):
        query = (
            "MATCH (u:User{email:$user_email})-[:BROWSES]->(c:Category) "
            "RETURN u "
        )
        result = tx.run(
            query,
            user_email=user_email
        )
        try:
            if result.peek() is not None:
                return True
            else:
                return False
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise


    def user_to_blog_read(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.execute_write(self._user_to_blog_read, user_email, blog_id)
            return result

    @staticmethod
    def _user_to_blog_read(tx, user_email, blog_id):
        query = (
            "MATCH (u:User {email: $user_email}),(b:Blog) "
            "WHERE ID(b) = $blog_id "
            "CREATE (u)-[r:READS]->(b) "
            "SET r.time = $time "
            "RETURN b.title AS title, b.link AS link, r.time AS time, b.author AS author"
        )
        result = tx.run(query, user_email=user_email, blog_id=blog_id, time = datetime.now())
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def get_history(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.execute_read(self._get_history, user_email)
            return result

    @staticmethod
    def _get_history(tx, user_email):
        query = (
            "MATCH (u:User {email: $user_email})-[r:READS]->(b:Blog) "
            "RETURN b.title AS title, b.link AS link, r.time AS time, b.author AS author, b.summary AS summary, ID(b) AS id, ID(r) as rid "
            "ORDER BY r.time DESC"
        )
        result = tx.run(query, user_email=user_email)
        try:
            return [{"title":record["title"],"link": record["link"], "time": record["time"], "author": record["author"], "id":record["id"],"rid":record["rid"]} for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise
    
    def delete_history(self, user_email, rid):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.execute_write(self._delete_history, user_email,int(rid))
            return result
        
    @staticmethod
    def _delete_history(tx, user_email, rid):
        query = (
            "MATCH (u:User {email: $user_email})-[r:READS]->(b:Blog) "
            "WHERE ID(r) = $rid "
            "DELETE r "
        )
        result = tx.run(query, user_email=user_email, rid=rid)
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise
    
    def get_all_blogs(self):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_all_blogs)
            return result
    
    @staticmethod
    def _get_all_blogs(tx):
        query = (
            "MATCH (b:Blog) "
            "RETURN b.title AS title, b.link AS link, b.author AS author, b.summary AS summary, ID(b) AS id "
        )
        result = tx.run(query)
        try:
            return [{"title":record["title"],"link": record["link"], "author": record["author"], "summary": record["summary"], "id":record["id"]} for record in result]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise
    
    def get_count_of_likes(self, blog_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_count_of_likes, blog_id)
            return result
        
    @staticmethod
    def _get_count_of_likes(tx, blog_id):
        query =(
            "MATCH (u:User)-[r:LIKES]->(b:Blog) "
            "WHERE ID(b) = $blog_id "
            "RETURN COUNT(*) AS count "
        )
        result = tx.run(query, blog_id=blog_id)
        try:
            return result.single()["count"]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def category_sub(self, user_email, category_list,score):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                return False
            result = session.execute_write(self._category_sub, user_email, category_list,score)
            return result
        
    @staticmethod
    def _category_sub(tx, user_email, category_list,score):
        query=(
            "MATCH (u:User {email: $user_email}) "
            "OPTIONAL MATCH (u)-[r:BROWSES]->(c:Category) "
            "DELETE r "
            "WITH u "
            "UNWIND $category_names AS category_name "
            "MATCH (c:Category {name: category_name}) "
            "MERGE (u)-[r:BROWSES]->(c) "
            "SET r.score = $score "
            "RETURN u, collect(c) AS categories, collect(r) AS relationships"
        )
        result = tx.run(query, user_email=user_email, category_names=category_list, score=score)
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise
