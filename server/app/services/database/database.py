from datetime import datetime, timedelta
import logging
import os
from typing import Optional

from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError
# from dotenv import load_dotenv
from pathlib import Path

from .read_article import read_article

# load_dotenv()


DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"
print(USER)

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Closing the driver connection when we are finished with it
        self.driver.close()

    # Checks
    def check_user_exists(self, user_email):
        with self.driver.session(database="neo4j") as session:
            return session.execute_read(
                self._check_user_exists, user_email)

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
            return session.execute_read(
                self._check_blog_exists, blog_link)

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
            return session.execute_read(
                self._check_category_exists, category_name)

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
                print("User already exists")
                return False
            result = session.execute_write(
                self._create_user, user_email, user_name)
            for record in result:
                print("Created User: {u}"
                      .format(u=record['u']))
            return True

    @staticmethod
    def _create_user(tx, user_email, user_name):
        query = (
            "CREATE (u:User { name: $user_name, email: $user_email }) "
            "RETURN u"
        )
        result = tx.run(query, user_name = user_name, user_email = user_email)
        try:
            return [{"u": record["u"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def search(self, text):
        with self.driver.session(database="neo4j") as session:
            # return self._search(session, text)
            result = session.execute_write(
                self._search,text)
            return result
    @staticmethod
    def _search(tx, text):
        query = (
            'CALL db.index.fulltext.queryNodes("BlogName", $searchTerm) YIELD node, score '
            'RETURN node.title AS title, ID(node) as id '
            'LIMIT 10 '
        )
        result = tx.run(query, searchTerm=text)
        formatted_result = [(record["title"], record["id"]) for record in result]
        return formatted_result

    def create_blog(self, blog_title, blog_link, blog_author, download_link, category_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_blog_exists(blog_link):
                print("Blog already exists")
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
                cleaned_summary = "\n".join(cleaned_lines)[:3]
                result = session.execute_write(
                    self._create_blog, blog_title, blog_link, blog_author,read_time, download_link, cleaned_summary,text, category_name)
                for record in result:
                    print("Created Blog: {b}"
                        .format(b=record['b']))
                return True
            except:
                print("Error creating blog")
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
        result = tx.run(query, blog_title = blog_title, blog_link = blog_link, blog_author = blog_author,read_time=read_time ,download_link = download_link, summary = summary, text = text, category_name = category_name, created_at = datetime.now())
        try:
            return [{"b": record["b"]["title"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    def create_category(self, category_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_category_exists(category_name):
                print("Category already exists")
                return False
            result = session.execute_write(
                self._create_category, category_name)
            for record in result:
                print("Created Category: {c}"
                      .format(c=record['c']))
            return True

    @staticmethod
    def _create_category(tx, category_name):
        query = (
            "CREATE (c:Category { name: $category_name }) "
            "RETURN c"
        )
        result = tx.run(query, category_name = category_name)
        try:
            return [{"c": record["c"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise


    # Relationship
    def blog_to_category(self, blog_link, category_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_blog_exists(blog_link):
                print("Blog does not exist")
                return False
            if not self.check_category_exists(category_name):
                print("Category does not exist")
                return False
            result = session.execute_write(
                self._blog_to_category, blog_link, category_name)
            for record in result:
                print("Added Blog: {b} to Category: {c}"
                      .format(b=record['b'], c=record['c']))
            return True

    @staticmethod
    def _blog_to_category(tx, blog_link, category_name):
        query = (
            "MATCH (b:Blog {link:$blog_link}), (c:Category {name:$category_name}) "
            "MERGE (b)-[r:IN_CATEGORY]->(c) "
            "RETURN b, c"
        )
        result = tx.run(query, blog_link = blog_link, category_name = category_name)
        try:
            return [{"b": record["b"]["title"], "c": record["c"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def user_to_category(self, user_email, category_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            if not self.check_category_exists(category_name):
                print("Category does not exist")
                return False
            result = session.execute_write(
                self._user_to_category, user_email, category_name)
            for record in result:
                print("Added User: {u} to Category: {c}"
                      .format(u=record['u'], c=record['c']))
            return True
        
    @staticmethod
    def _user_to_category(tx, user_email, category_name):
        query = (
            "MATCH (u:User {email:$user_email}), (c:Category {name:$category_name}) "
            "MERGE (u)-[r:BROWSED]->(c) "
            "RETURN u, c"
        )
        result = tx.run(query, user_email = user_email, category_name = category_name)
        try:
            return [{"u": record["u"]["email"], "c": record["c"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def find_all_categories_for_user(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            result = session.execute_read(
                self._find_all_categories_for_user, user_email)
            return result
        
    @staticmethod
    def _find_all_categories_for_user(tx, user_email):
        query = (
            "MATCH (u:User {email:$user_email})-[r:BROWSED]->(c:Category) "
            "RETURN c.name as name"
        )
        result = tx.run(query, user_email = user_email)
        try:
            return [{"name": record["c"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise
        

    def user_to_category_browsing(self, user_email, category_name, browsing_time):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            if not self.check_category_exists(category_name):
                print("Category does not exist")
                return False
            result = session.execute_write(
                self._user_to_category_browsing, user_email, category_name, browsing_time)
            for record in result:
                print("Added User: {u} to Category: {c} with browsing time: {t}"
                      .format(u=record['u'], c=record['c'], t=record['t']))
            return True
        
    @staticmethod
    def _user_to_category_browsing(tx, user_email, category_name, browsing_time):
        query = (
            "MATCH (u:User {email:$user_email})-[r:BROWSED]->(c:Category {name:$category_name}) "
            "SET r.time = $browsing_time "
            "RETURN u, c, r.time"
        )
        result = tx.run(query, user_email = user_email, category_name = category_name, browsing_time = browsing_time)
        try:
            return [{"u": record["u"]["email"], "c": record["c"]["name"], "t": record["r.time"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise
    
    def get_blog_by_id(self, article_id):
        with self.driver.session(database="neo4j") as session:
            query = (
                "MATCH (b:Blog) WHERE ID(b)=$article_id "
                "RETURN b.author AS author, b.title AS title, b.link AS link, b.download_link AS pdf_link, b.summary AS summary, b.read_time as read_time, ID(b) AS id, b.text as text"
            )
            print("here")
            result = session.run(query, article_id=article_id)
            print(result)
            return [
                {"author": record["author"], "title": record["title"], "link": record["link"], "pdf_link": record["pdf_link"], "summary": record["summary"], "read_time":record["read_time"], "id":record["id"], "text":record["text"]}
                for record in result
            ]   
            # create seprate

    def user_to_blog(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            result = session.write_transaction(self._user_to_blog, user_email, blog_id)
            for record in result:
                print("Added User: {u} to Blog: {b}".format(u=record['u'], b=record['b']))
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
                print("User does not exist")
                return False
            result = session.write_transaction(self._delete_user_to_blog, user_email, blog_id)
            for record in result:
                print("Deleted User: {u} from Blog: {b}".format(u=record['u'], b=record['b']))
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
                print("User does not exist")
                return []

            query = (
                "MATCH (u:User {email: $user_email})-[r:BOOKMARK]->(b:Blog) "
                "RETURN b.title, b.link, b.author, ID(b)"
            )
            result = session.run(query, user_email=user_email)
            user_blogs = [
                {
                    "title": record["b.title"],
                    "link": record["b.link"],
                    "author": record["b.author"],
                    "id": record["ID(b)"]
                }
                for record in result
            ]
            return user_blogs

    def isBlogBookmarked(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
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
                print("User does not exist")
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
                    print("User does not exist")
                    return False
                result = session.execute_write(
                    self._add_likes_to_blog, user_email, int(blog_id))
                for record in result:
                    print("{likecount} likes for Blog"
                        .format(likecount=record['likecount']))
                return result
            except Exception as e:
                print(e)
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
                    print("User does not exist")
                    return False
                result = session.execute_write(
                    self._remove_likes_from_blog, user_email, int(blog_id))
                for record in result:
                    print("{likecount} likes for Blog"
                        .format(likecount=record['likecount']))
                return result
            except Exception as e:
                print(e)
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
    
    def get_blogs_by_likes(self, category_name: Optional[str] = None, limit: int = 10, page: int = 1, page_limit: int = 5):
        print(category_name)
        with self.driver.session(database="neo4j") as session:
            result = session.read_transaction(
                self._get_blogs_by_likes,
                category_name,
                limit,
                page,
                page_limit
            )
            print("Success")
            print(result)
            return result

    @staticmethod
    def _get_blogs_by_likes(
        tx,
        category_name: Optional[str] = None,
        limit: int = 10,
        page: int = 1,
        page_limit: int = 5
    ):
        skip_count = (page - 1) * page_limit
        # print(skip_count)
        if category_name:
            query = (
                "MATCH (u:User)-[r:LIKES]->(b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WITH b, COUNT(r) AS likeCount "
                "ORDER BY likeCount DESC "
                "RETURN b.title AS title, likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "UNION "
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WHERE NOT EXISTS((:User)-[:LIKES]->(b)) "
                "RETURN b.title AS title, 0 AS likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY b.createdAt DESC "
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
                "UNION "
                "MATCH (b:Blog) "
                "WHERE NOT EXISTS((:User)-[:LIKES]->(b)) "
                "RETURN b.title AS title, 0 AS likeCount, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY b.createdAt DESC "
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
            result = session.execute_read(
                self._get_recent_blogs,
                category_name,
                limit,
                page,
                page_limit
            )
            print("Success")
            return result

    @staticmethod
    def _get_recent_blogs(
        tx,
        category_name: Optional[str] = None,
        limit: int = 10,
        page: int = 1,
        page_limit: int = 5
    ):
        skip_count = (page - 1) * page_limit
        # print(skip_count)
        if category_name:
            query = (
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "RETURN b.title AS title, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY b.createdAt DESC "
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
                "MATCH (b:Blog) "
                "RETURN b.title AS title, b.author AS author, b.link AS link, b.download_link AS download_link, b.summary AS summary, b.read_time AS read_time, ID(b) AS id "
                "ORDER BY b.createdAt DESC "
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
                    "id": record["id"]
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
            print("Success")
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
        # print(skip_count)
        if category_name:
            query = (
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "WITH b "
                "MATCH (:User)-[r:LIKES]->(b) "
                "WHERE date(b.created_at) > date($time) "
                "WITH b, COUNT(r) AS likecount "
                "RETURN b.title as title,b.author as author,b.link as link "
                "ORDER BY likecount DESC LIMIT $limit"
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
                "RETURN b.title as title,b.author as author,b.link as link "
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
                    "link": record["link"]
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_recent_blogs(self, category_name: Optional[str] = None, limit: int = 10, page: int = 1, page_limit: int = 5):
        with self.driver.session(database="neo4j") as session:
            result = session.read_transaction(
                self._get_recent_blogs,
                category_name,
                limit,
                page,
                page_limit
            )
            print("Success")
            print(result)
            return result
        
    @staticmethod
    def _get_recent_blogs(
        tx,
        category_name: Optional[str] = None,
        limit: int = 10,
        page: int = 1,
        page_limit: int = 5
    ):
        if category_name:
            query = (
                "MATCH (b:Blog)-[:BELONGS_TO]->(c:Category{name:$category_name}) "
                "RETURN b.title as title,b.author as author,b.link as link "
                "ORDER BY b.created_at DESC LIMIT $limit"
            )
            result = tx.run(
                query,
                category_name=category_name,
                limit=limit
            )
        else:
            query = (
                "MATCH (b:Blog) "
                "RETURN b.title as title,b.author as author,b.link as link "
                "ORDER BY b.created_at DESC LIMIT $limit"
            )
            result = tx.run(
                query,
                limit=limit
            )
        
        try:
            return [
                {
                    "author": record["author"],
                    "title": record["title"],
                    "link": record["link"]
                }
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise

    def get_blogs_by_category_and_limit(self, category_name, limit):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_blogs_by_category_and_limit, category_name, limit)
            if result:
                print("Success")
                return result
            else:
                print("Failure")
                return False
            
    @staticmethod
    def _get_blogs_by_category_and_limit(tx, category_name, limit):
        query = (
            "MATCH (b:Blog)-[:BELONGS_TO]->(:Category {name:$category_name})  "
            "WITH b "
            "MATCH (:User)-[r:LIKES]->(b) "
            "WITH b, COUNT(r) AS likecount "
            "RETURN b.title as title,b.author as author,b.link as link "
            "ORDER BY likecount DESC LIMIT $limit"
        )
        result = tx.run(query, category_name=category_name, limit=limit)
        try:
            return [
                {"author": record["author"], "title": record["title"], "link": record["link"]}
                for record in result
            ]
        except Neo4jError as exception:
            logging.error("{query} raised an error:\n{exception}".format(query=query, exception=exception))
            raise
        
    def get_categories_ordered_by_browsing_duration(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print(user_email)
                print("User does not exist")
                return False
            result = session.execute_write(self._get_categories_ordered_by_browsing_duration, user_email)
            print("success")
            return result


    @staticmethod
    def _get_categories_ordered_by_browsing_duration(tx, user_email):
        query = (
            "MATCH (u:User {email: $user_email})-[r:BROWSED]->(c:Category) "
            "RETURN c.name AS categoryName "
            "ORDER BY r.time DESC"
        )
        result = tx.run(query, user_email=user_email)
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def get_category_by_blog(self, blog_id):
        with self.driver.session(database="neo4j") as session:
            result = session.execute_read(self._get_category_by_blog, blog_id)
            if result:
                return result[0]
            else:
                return None

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

    
    # Deletion

    def delete_user(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            result = session.execute_write(self._delete_user, user_email)
            print("success")
            return True
        
    @staticmethod
    def _delete_user(tx, user_email):
        query = (
            "MATCH (u:User {email: $user_email}) "
            "DETACH DELETE u "
        )
        result = tx.run(query, user_email=user_email)
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise
    
    def delete_user_to_category(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            result = session.execute_write(self._delete_user_to_category, user_email)
            print("Deleted user to category relationship")
            return True
        
    @staticmethod
    def _delete_user_to_category(tx, user_email):
        query = (
            "MATCH (u:User {email: $user_email})-[r:BROWSES]->(c:Category) "
            "DELETE r "
        )
        result = tx.run(query, user_email=user_email)
        try:
            return result
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def user_to_blog_read(self, user_email, blog_id):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            result = session.execute_write(self._user_to_blog_read, user_email, blog_id)
            print("success")
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
                print("User does not exist")
                return False
            result = session.execute_read(self._get_history, user_email)
            print("success")
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
                print("User does not exist")
                return False
            print(int(rid))
            result = session.execute_write(self._delete_history, user_email,int(rid))
            print("success")
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
if __name__ == "__main__":
    # Aura queries use an encrypted connection using the "neo4j+s" URI scheme
    uri = DATABASE_URL
    user = USER
    password = PASSWORD
    app = App(uri, user, password)
    # app.create_blog("testing title","https://link.springer.com/content/pdf/10.1007/s42757-022-0154-6.pdf?pdf=button","https://link.springer.com/content/pdf/10.1007/s42757-022-0154-6.pdf?pdf=button")
    # Creation of nodes
    # app.create_user("Sa@gmail.com","Sample")
    # app.create_user("nikhil@gmail.com","Nikhil")
    # app.create_blog("Sampleblog","Samplelink","Sampleauthor")
    # app.create_category("Samplecategory")
    # app.create_category("bc")
    # app.create_category("mc")
    # app.create_category("ent")
    # app.create_category("dsnjdsnjdsnnkjds")
    # app.add_author("Sampleauthor")

    # # Creation of relationships (For new blogs)
    # app.blog_to_category("Samplelink","Samplecategory")
    # app.blog_to_author("Samplelink","Sampleauthor")
    # app.author_to_category("Sampleauthor","Samplecategory")

    # # Creation of relationships (Users)
    # app.user_to_blog_bookmark("Sample@gmail.com","Samplelink")
    # app.user_to_blog_bookmark("Sample@gmail.com","Sampleauthor")
    # app.user_to_category("nikhil@gmail.com","dsnjdsnjdsnnkjds")
    # app.user_to_category_browsing("nikhil@gmail.com","dsnjdsnjdsnnkjds",29)
    # app.user_to_category("nikhil@gmail.com","bc")
    # app.user_to_category_browsing("nikhil@gmail.com","bc",18)
    # app.user_to_category_browsing("nikhil@gmail.com","ent",1)
    # app.user_to_category("nikhil@gmail.com","mc")
    # app.get_categories_ordered_by_browsing_duration("nikhil@gmail.com")
    # app.add_likes_to_blog("sahil@gmail.com","https://link.springer.com/content/pdf/10.1007/s42757-022-0144-8.pdf?pdf=button")
    # app.add_likes_to_blog("nikhil@gmail.com","https://link.springer.com/content/pdf/10.1007/s42757-022-0156-4.pdf?pdf=button")
    # app.blog_to_category("https://link.springer.com/content/pdf/10.1007/s42757-022-0156-4.pdf?pdf=button","bc")
    # app.blog_to_category("https://link.springer.com/content/pdf/10.1007/s42757-022-0144-8.pdf?pdf=button","bc")
    # ans = app.get_blogs_by_likes()
    # print(ans)
    # for i in ans:
    #     print(i["pdf_link"])
    # summary = read_article("https://link.springer.com/content/pdf/10.1007/s00120-023-02043-2.pdf?pdf=button")
    # summary_text = summary.summary
    # lines = summary_text.splitlines()
    # cleaned_lines = [line.lstrip("- ") for line in lines]
    # cleaned_summary = "\n".join(cleaned_lines)
    # print(cleaned_summary)
    # app.user_to_category_browsing("nikhil@gmail.com","dsnjdsnjdsnnkjds",92)
    # app.delete_user_to_category("sahil@gmail.com")
    # ans = app.get_category_by_blog("https://link.springer.com/content/pdf/10.1007/s42757-022-0144-8.pdf?pdf=button")
    # app.user_to_blog_read("sahil@gmail.com",58)
    # app.user_to_blog_read("sahil@gmail.com",56)
    # app.user_to_blog_read("sahil@gmail.com",57)
    # app.user_to_blog_read("sahil@gmail.com",53)
    # print(app.get_history("sahil@gmail.com"))
    # print(ans)
    # app.create_blog("Myblg","Samplelink","Sampleauthor","https://link.springer.com/content/pdf/10.1007/s42757-022-0144-8.pdf?pdf=button","sample_category")
    # app.create_user("sam@gmail.com","Sam")
    # app.remove_likes_from_blog("sam@gmail.com",30)
    # app.get_blogs_by_likes()
    # app.add_likes_to_blog("sahilsingh1221177@gmail.com",30)
    # app.remove_likes_from_blog("sahilsingh1221177@gmail.com",30)
    # app.get_blogs_by_likes("Physics")
    # app.get_blogs_by_category_and_limit("Engineering",2)
    # app.find_all_categories_for_user("sahilsinghh1221177@gmail.com")
    app.get_hot_blogs("Environment")
    # print(datetime.now()-timedelta(days=7))
    app.close()