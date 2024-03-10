import unittest
from unittest.mock import patch
from email_automation import send_email, automate_mail, schedule_task

class TestEmailAutomation(unittest.TestCase):

    @patch("email_automation.smtplib.SMTP")
    def test_send_email(self, mock_smtp):
        # Mock the SMTP server
        mock_server = mock_smtp.return_value
        mock_server.starttls.return_value = None
        mock_server.login.return_value = None
        mock_server.sendmail.return_value = None

        # Test parameters
        recipient_email = "test@example.com"
        subject = "Test Subject"
        html_template = "<html><body><p>This is a test email.</p></body></html>"

        # Call the function under test
        send_email(recipient_email, subject, html_template)

        # Assert that SMTP methods are called with correct parameters
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once()
        mock_server.sendmail.assert_called_once_with("sender@example.com", recipient_email, mock_smtp().sendmail())

    @patch("email_automation.App")
    @patch("email_automation.send_email")
    def test_automate_mail(self, mock_send_email, mock_database):
        # Mock database function to return sample data
        mock_database.return_value.get_all_users.return_value = {
            "user1@example.com": [
                {"title": "Book 1", "author": "Author 1", "category": "Category 1", "url": "http://example.com/1", "summary": "Summary 1"},
                {"title": "Book 2", "author": "Author 2", "category": "Category 2", "url": "http://example.com/2", "summary": "Summary 2"}
            ],
            "user2@example.com": []
        }

        # Call the function under test
        automate_mail()

        # Assert that send_email is called for each user with the correct parameters
        mock_send_email.assert_any_call("user1@example.com", "Interestify Weekly mail!", str)

    @patch("email_automation.schedule.every")
    @patch("email_automation.schedule.run_pending")
    @patch("email_automation.time.sleep")
    def test_schedule_task(self, mock_sleep, mock_run_pending, mock_every):
        # Call the function under test
        schedule_task()

        # Assert that schedule.every and schedule.run_pending are called
        mock_every.sunday.at.assert_called_once_with('12:00')
        mock_run_pending.assert_called()

if __name__ == "__main__":
    unittest.main()
