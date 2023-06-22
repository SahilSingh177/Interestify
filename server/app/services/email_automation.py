import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(recipient_email, subject, html_template, articles):
    # Email configuration
    sender_email = 'sahilsingh1221177@gmail.com'
    sender_password = 'shntcrranvcttymv'
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587

    # Create an SMTP connection
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)

        for article in articles:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = sender_email
            message["To"] = recipient_email

            # Fill in the HTML template with article data
            filled_template = html_template.format(
                title=article['title'],
                author=article['author'],
                category=article['category'],
                url=article['url']
            )

            # Create a MIME text part for the filled HTML content
            html_part = MIMEText(filled_template, "html")

            # Attach the HTML part to the message
            message.attach(html_part)

            # Send the email for each article
        server.sendmail(sender_email, recipient_email, message.as_string())

        server.quit()


# Example usage
recipient_email = 'lcs2021033@iiitl.ac.in'
subject = 'Interestify Weekly mail!'
html_template = """
<html>
  <head>
    <title>Blog Cards</title>
    <style>
      body {{
        background-color: #f2f2f2;
      }}

      .blog-card {{
        background-color: #ececec;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
      }}

      .blog-title {{
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }}

      .blog-author {{
        font-size: 16px;
        color: #555;
      }}

      .blog-category {{
        font-size: 16px;
        color: #555;
        margin-bottom: 10px;
      }}

      .break {{
        height: 2px;
        background-color: #999;
        margin: 20px 0;
      }}

      .read-link {{
        font-size: 16px;
        color: #007bff;
        text-decoration: none;
      }}
    </style>
  </head>
  <body>
  Here are the recommended research papers from your top 5 categories:
  {content}
  </body>
</html>
"""

articles = [
    {
        'title': 'Book 1',
        'author': 'Author 1',
        'category': 'Engineering',
        'url': 'https://example.com/book1'
    },
    {
        'title': 'Book 2',
        'author': 'Author 2',
        'category': 'Engineering',
        'url': 'https://example.com/book2'
    },
    {
        'title': 'Book 3',
        'author': 'Author 3',
        'category': 'Engineering',
        'url': 'https://example.com/book3'
    },
    {
        'title': 'Book 4',
        'author': 'Author 4',
        'category': 'Engineering',
        'url': 'https://example.com/book4'
    },
    {
        'title': 'Book 5',
        'author': 'Author 5',
        'category': 'Engineering',
        'url': 'https://example.com/book5'
    }
]

# Generate the content for the HTML template
content = ""
for article in articles:
    content += """
    <div class="blog-card" style="background-color: #999">
      <h2 class="blog-title">{title}</h2>
      <p class="blog-author">Author: {author}</p>
      <p class="blog-category">Category: {category}</p>
      <p class="blog-summary">{summary}</p>
      <a href="{url}" class="read-link">Read about this</a>
    </div>
    <hr class="break" />
    """.format(
        title=article['title'],
        author=article['author'],
        category=article['category'],
        summary=article['summary'],
        url=article['url']
    )

html_template = html_template.replace("{content}", content)

send_email(recipient_email, subject, html_template, articles)
