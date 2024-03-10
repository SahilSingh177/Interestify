import unittest
from unittest.mock import patch

# Import the functions to be tested
from similar_articles import get_recommendations, get_all_blogs

class TestBlogRecommendations(unittest.TestCase):

    @patch("similar_articles.redis.Redis")
    def test_get_all_blogs(self, mock_redis):
        # Mock the Redis client
        mock_redis.get.return_value = None
        mock_redis.set.return_value = None
        mock_redis.expire.return_value = None

        # Mock the data returned from the database
        mock_data = [
            {"id": 1, "title": "Test Blog 1", "summary": "This is a test summary 1", "author": "Author 1", "link": "http://example.com/1"},
            {"id": 2, "title": "Test Blog 2", "summary": "This is a test summary 2", "author": "Author 2", "link": "http://example.com/2"},
            {"id": 3, "title": "Test Blog 3", "summary": "This is a test summary 3", "author": "Author 3", "link": "http://example.com/3"}
        ]

        # Mock the database function
        with patch("similar_articles.app.get_all_blogs") as mock_get_all_blogs:
            mock_get_all_blogs.return_value = mock_data

            # Call the function under test
            result = get_all_blogs()

            # Assert the result
            self.assertEqual(result, mock_data)

    @patch("similar_articles.redis.Redis")
    def test_get_recommendations(self, mock_redis):
        # Mock the Redis client
        mock_redis.get.return_value = None
        mock_redis.set.return_value = None
        mock_redis.expire.return_value = None

        # Mock the data returned from the database
        mock_data = [
            {"id": 1, "title": "Test Blog 1", "summary": "This is a test summary 1", "author": "Author 1", "link": "http://example.com/1"},
            {"id": 2, "title": "Test Blog 2", "summary": "This is a test summary 2", "author": "Author 2", "link": "http://example.com/2"},
            {"id": 3, "title": "Test Blog 3", "summary": "This is a test summary 3", "author": "Author 3", "link": "http://example.com/3"}
        ]

        # Mock the database function
        with patch("similar_articles.app.get_all_blogs") as mock_get_all_blogs:
            mock_get_all_blogs.return_value = mock_data

            # Call the function under test
            result = get_recommendations(1)

            # Assert the result
            self.assertIsInstance(result, list)
            self.assertEqual(len(result), 10)

if __name__ == "__main__":
    unittest.main()
