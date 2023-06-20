import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from database.database import App

DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"

database = App(DATABASE_URL, USER, PASSWORD)


def send_email(recipient_email, subject, html_template):
    # Email configuration
    sender_email = 'sahilsingh1221177@gmail.com'
    sender_password = ''
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587

    # Create an SMTP connection
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)

        for article in articles:
            # Create a MIME multipart message for each article
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
subject = 'Hello from Python!'
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
    <div class="blog-card" style="background-color: #999">
      <h2 class="blog-title">{title}</h2>
      <p class="blog-author">Author: {author}</p>
      <p class="blog-category">Category: {category}</p>
      <a href="{url}" class="read-link">Read about this</a>
    </div>
    <hr class="break" />
  </body>
</html>
"""

data = database.get_blogs_by_category_and_limit('Engineering', 5)
articles = []
for blog in data:
    title = blog['title']
    author = blog['author']
    category = 'Engineering'
    url = blog['link']
    article = {
        'title': title,
        'author': author,
        'category': category,
        'url': url
    }
    articles.append(article)

print(articles)
send_email(recipient_email, subject, html_template)
database.close()
