import logging
import os

from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

DATABASE_URL = "neo4j+s://38e75c45.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "NUsPvBV7gpZoF24ZR69mrrRRPvuRfSR3WV-CCEugV6k"
print(USER)

class App:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        # Closing the driver connection when we are finished with it
        self.driver.close()

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
    def create_blog(self, blog_title, blog_link, blog_author):
        with self.driver.session(database="neo4j") as session:
            if self.check_blog_exists(blog_link):
                print("Blog already exists")
                return False
            result = session.execute_write(
                self._create_blog, blog_title, blog_link, blog_author)
            for record in result:
                print("Created Blog: {b}"
                      .format(b=record['b']))
            return True

    @staticmethod
    def _create_blog(tx, blog_title, blog_link, blog_author):
        query = (
            "CREATE (b:Blog { title: $blog_title, link: $blog_link, author: $blog_author }) "
            "RETURN b"
        )
        result = tx.run(query, blog_title = blog_title, blog_link = blog_link, blog_author = blog_author)
        try:
            return [{"b": record["b"]["title"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

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

    def check_author_exists(self, author_name):
        with self.driver.session(database="neo4j") as session:
            return session.execute_read(
                self._check_author_exists, author_name)

    @staticmethod
    def _check_author_exists(tx, author_name):
        query = (
            "MATCH (a:Author) "
            "WHERE a.name = $author_name "
            "RETURN a"
        )
        result = tx.run(query, author_name=author_name)
        # Check if result has any data or multiple data
        if result.peek():
            return True
        else:
            return False

    def add_author(self, author_name):
        with self.driver.session(database="neo4j") as session:
            if self.check_author_exists(author_name):
                print("Author already exists")
                return False
            result = session.execute_write(
                self._add_author, author_name)
            for record in result:
                print("Added Author: {a}"
                      .format(a=record['a']))
            return True

    @staticmethod
    def _add_author(tx, author_name):
        query = (
            "CREATE (a:Author { name: $author_name }) "
            "RETURN a"
        )
        result = tx.run(query, author_name = author_name)
        try:
            return [{"a": record["a"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

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
            "MATCH (b:Blog), (c:Category) "
            "WHERE b.link = $blog_link AND c.name = $category_name "
            "CREATE (b)-[r:IN_CATEGORY]->(c) "
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

    def blog_to_author(self, blog_link, author_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_blog_exists(blog_link):
                print("Blog does not exist")
                return False
            if not self.check_author_exists(author_name):
                print("Author does not exist")
                return False
            result = session.execute_write(
                self._blog_to_author, blog_link, author_name)
            for record in result:
                print("Added Blog: {b} written by Author: {a}"
                      .format(b=record['b'], a=record['a']))
            return True

    @staticmethod
    def _blog_to_author(tx, blog_link, author_name):
        query = (
            "MATCH (b:Blog), (a:Author) "
            "WHERE b.link = $blog_link AND a.name = $author_name "
            "CREATE (b)-[r:WRITTEN_BY]->(a) "
            "RETURN b, a"
        )
        result = tx.run(query, blog_link = blog_link, author_name = author_name)
        try:
            return [{"b": record["b"]["title"], "a": record["a"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def author_to_category(self, author_name, category_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_author_exists(author_name):
                print("Author does not exist")
                return False
            if not self.check_category_exists(category_name):
                print("Category does not exist")
                return False
            result = session.execute_write(
                self._author_to_category, author_name, category_name)
            for record in result:
                print("Added Author: {a} to Category: {c}"
                      .format(a=record['a'], c=record['c']))
            return True

    @staticmethod
    def _author_to_category(tx, author_name, category_name):
        query = (
            "MATCH (a:Author), (c:Category) "
            "WHERE a.name = $author_name AND c.name = $category_name "
            "CREATE (a)-[r:IN_CATEGORY]->(c) "
            "RETURN a, c"
        )
        result = tx.run(query, author_name = author_name, category_name = category_name)
        try:
            return [{"a": record["a"]["name"], "c": record["c"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def user_to_category(self, user_email, category_name, browsing_time):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            if not self.check_category_exists(category_name):
                print("Category does not exist")
                return False
            result = session.execute_write(
                self._user_to_category, user_email, category_name, browsing_time)
            for record in result:
                print("Added User: {u} to Category: {c}"
                      .format(u=record['u'], c=record['c']))
            return True

    @staticmethod
    def _user_to_category(tx, user_email, category_name, browsing_time):
        query = (
            "MATCH (u:User)-[rel:BROWSED]->(c:Category) "
            "WHERE u.email = $user_email AND c.name = $category_name "
            "DELETE rel "
            "CREATE (u)-[r:BROWSED {duration: $browsing_time}]->(c) "
            "RETURN c.name AS categoryName, $browsing_time AS browsingDuration"
        )
        result = tx.run(query, user_email=user_email, category_name=category_name, browsing_time=browsing_time)
        try:
            return [{"categoryName": record["categoryName"], "browsingDuration": record["browsingDuration"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise



    def user_to_blog(self, user_email, blog_link):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            if not self.check_blog_exists(blog_link):
                print("Blog does not exist")
                return False
            result = session.execute_write(
                self._user_to_blog, user_email, blog_link)
            for record in result:
                print("Added User: {u} to Blog: {b}"
                      .format(u=record['u'], b=record['b']))
            return True

    @staticmethod
    def _user_to_blog(tx, user_email, blog_link):
        query = (
            "MATCH (u:User), (b:Blog) "
            "WHERE u.email = $user_email AND b.link = $blog_link "
            "CREATE (u)-[r:READ]->(b) "
            "RETURN u, b"
        )
        result = tx.run(query, user_email = user_email, blog_link = blog_link)
        try:
            return [{"u": record["u"]["email"], "b": record["b"]["title"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def user_to_author(self, user_email, author_name):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print("User does not exist")
                return False
            if not self.check_author_exists(author_name):
                print("Author does not exist")
                return False
            result = session.execute_write(
                self._user_to_author, user_email, author_name)
            for record in result:
                print("Added User: {u} to Author: {a}"
                      .format(u=record['u'], a=record['a']))
            return True

    @staticmethod
    def _user_to_author(tx, user_email, author_name):
        query = (
            "MATCH (u:User), (a:Author) "
            "WHERE u.email = $user_email AND a.name = $author_name "
            "CREATE (u)-[r:READ]->(a) "
            "RETURN u, a"
        )
        result = tx.run(query, user_email = user_email, author_name = author_name)
        try:
            return [{"u": record["u"]["email"], "a": record["a"]["name"]}
                    for record in result]
        # Capture any errors along with the query and data for traceability
        except Neo4jError as exception:
            logging.error("{query} raised an error: \n {exception}".format(
                query=query, exception=exception))
            raise

    def get_categories_ordered_by_browsing_duration(self, user_email):
        with self.driver.session(database="neo4j") as session:
            if not self.check_user_exists(user_email):
                print(user_email)
                print("User does not exist")
                return False
            result = session.execute_write(self._get_categories_ordered_by_browsing_duration, user_email)
            print("success")
            print(type(result))


    @staticmethod
    def _get_categories_ordered_by_browsing_duration(tx, user_email):
        query = (
            "MATCH (u:User {email: $user_email})-[r:BROWSED]->(c:Category) "
            "RETURN c.name AS categoryName "
            "ORDER BY r.browsingTime DESC"
        )
        result = tx.run(query, user_email=user_email)
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
    # Creation of nodes
    app.create_user("Sample@gmail.com","Sample")
    app.create_user("nikhil@gmail.com","Nikhil")
    # app.create_blog("Sampleblog","Samplelink","Sampleauthor")
    # app.create_category("Samplecategory")
    app.create_category("bc")
    app.create_category("mc")
    app.create_category("ent")
    app.create_category("dsnjdsnjdsnnkjds")
    # app.add_author("Sampleauthor")

    # Creation of relationships (For new blogs)
    # app.blog_to_category("Samplelink","Samplecategory")
    # app.blog_to_author("Samplelink","Sampleauthor")
    # app.author_to_category("Sampleauthor","Samplecategory")

    # # Creation of relationships (Users)
    # app.user_to_blog("Sample@gmail.com","Samplelink")
    # app.user_to_author("Sample@gmail.com","Sampleauthor")
    app.user_to_category("nikhil@gmail.com","dsnjdsnjdsnnkjds",69)
    app.user_to_category("nikhil@gmail.com","bc",2)
    app.user_to_category("nikhil@gmail.com","ent",7)
    app.user_to_category("nikhil@gmail.com","mc",5)
    app.get_categories_ordered_by_browsing_duration("nikhil@gmail.com")
    app.close()