import unittest
from unittest.mock import MagicMock, patch
from database import App


class TestDatabaseFunctions(unittest.TestCase):

    @patch("database.GraphDatabase")
    def test_check_user_exists(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_read.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.check_user_exists("test@example.com")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_create_user(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.create_user("test@example.com", "Test User")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_check_blog_exists(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_read.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.check_blog_exists("http://example.com/blog")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_create_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.create_blog("Test Blog", "http://example.com/blog",
                                 "Test Author", "http://example.com/download", "TestCategory")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_check_category_exists(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_read.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.check_category_exists("TestCategory")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_create_category(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.create_category("TestCategory")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_user_to_category_browsing(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = True
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.user_to_category_browsing(
            "test@example.com", "TestCategory", "12:00", "2024-03-10")
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_get_most_liked_not_read_blogs_by_category_score_limit(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"author": "Test Author", "title": "Test Title", "link": "http://example.com/blog",
                "summary": "Test summary", "read_time": "10 minutes", "id": 1, "category_name": "TestCategory", "likes": 10}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_most_liked_not_read_blogs_by_category_score_limit(
            "test@example.com", "TestCategory", 0, 10)
        self.assertEqual(len(result), 1)

    @patch("database.GraphDatabase")
    def test_top_blogs_by_email(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_read.return_value = [
            {"author": "Test Author", "title": "Test Title", "link": "http://example.com/blog",
                "summary": "Test summary", "time": "10 minutes", "id": 1, "likes": 10}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.top_blogs_by_email("test@example.com", 1, 10)
        self.assertEqual(len(result), 1)

    @patch("database.GraphDatabase")
    def test_user_to_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.write_transaction.return_value = [
            {"u": "test@example.com", "b": "Test Blog"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.user_to_blog("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_get_user_blogs(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"title": "Test Blog 1", "link": "http://example.com/blog1",
                "author": "Test Author 1", "id": 1, "category_name": "Technology"},
            {"title": "Test Blog 2", "link": "http://example.com/blog2",
                "author": "Test Author 2", "id": 2, "category_name": "Science"}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_user_blogs("test@example.com")
        self.assertEqual(len(result), 2)

    @patch("database.GraphDatabase")
    def test_isBlogBookmarked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"r": "bookmark"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogBookmarked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_isBlogLiked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"r": "like"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogLiked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_get_user_blogs(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"title": "Test Blog 1", "link": "http://example.com/blog1",
                "author": "Test Author 1", "id": 1, "category_name": "Technology"},
            {"title": "Test Blog 2", "link": "http://example.com/blog2",
                "author": "Test Author 2", "id": 2, "category_name": "Science"}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_user_blogs("test@example.com")
        self.assertEqual(len(result), 2)

    @patch("database.GraphDatabase")
    def test_isBlogBookmarked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"r": "bookmark"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogBookmarked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_isBlogLiked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"r": "like"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogLiked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_add_likes_to_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = [{"likecount": 1}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.add_likes_to_blog("test@example.com", 1)
        self.assertEqual(result, [{"likecount": 1}])

    @patch("database.GraphDatabase")
    def test_remove_likes_from_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_write.return_value = [{"likecount": 0}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.remove_likes_from_blog("test@example.com", 1)
        self.assertEqual(result, [{"likecount": 0}])

    @patch("database.GraphDatabase")
    def test_get_blogs_by_likes(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.execute_read.return_value = [
            {"author": "Test Author", "title": "Test Blog", "link": "http://example.com/test",
                "pdf_link": "http://example.com/test.pdf", "summary": "Test Summary", "read_time": 5, "id": 1, "likes": 10}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_blogs_by_likes("Technology", 1, 5)
        self.assertEqual(len(result), 1)

    @patch("database.GraphDatabase")
    def test_user_to_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.write_transaction.return_value = [
            {"u": "test@example.com", "b": "Test Blog"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.user_to_blog("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_delete_user_to_blog(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.write_transaction.return_value = [
            {"u": "test@example.com", "b": "Test Blog"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.delete_user_to_blog("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_get_user_blogs(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"title": "Test Blog 1", "link": "http://example.com/blog1",
                "author": "Test Author 1", "id": 1, "category_name": "Technology"},
            {"title": "Test Blog 2", "link": "http://example.com/blog2",
                "author": "Test Author 2", "id": 2, "category_name": "Science"}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_user_blogs("test@example.com")
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["title"], "Test Blog 1")

    @patch("database.GraphDatabase")
    def test_isBlogBookmarked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"bookmark": "Test Bookmark"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogBookmarked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_isBlogLiked(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [{"like": "Test Like"}]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.isBlogLiked("test@example.com", 1)
        self.assertTrue(result)

    @patch("database.GraphDatabase")
    def test_get_session_data(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"category_name": "Technology", "duration": 120},
            {"category_name": "Science", "duration": 180}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_session_data("test@example.com")
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["duration"], 120)

    @patch("database.GraphDatabase")
    def test_get_blog_by_id(self, mock_graphdb):
        mock_session = MagicMock()
        mock_session.run.return_value = [
            {"author": "Test Author", "title": "Test Blog", "link": "http://example.com/blog", "pdf_link": "http://example.com/blog.pdf",
                "summary": "Test summary", "read_time": 10, "id": 1, "text": "Test blog content"}
        ]
        mock_graphdb.driver.session.return_value = mock_session

        app = App("test_uri", "test_user", "test_password")
        result = app.get_blog_by_id(1)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["title"], "Test Blog")


if __name__ == "__main__":
    unittest.main()
