<h1 align="center">Interestify</h1>

<p align="center">
  Interestify is an amazing web application that brings you a personalized browsing experience for articles. It leverages web scraping techniques to collect articles from popular sources like Springer, allowing you to explore a vast library of knowledge based on your interests. With Interestify, you can discover, bookmark, and read articles tailored specifically to your preferences.
</p>

<div align="center">

https://github.com/SahilSingh177/Interestify/assets/96344003/a19068c0-f3b3-44bc-867d-62d210fbee5e

</div>
<div class="image-container">
<img src="https://github.com/SahilSingh177/Interestify/assets/96344003/1299b8e5-c6b0-4fda-ab0b-5fd0591a717c" alt="Image 1">
  
![Screenshot from 2023-06-24 23-18-15](https://github.com/SahilSingh177/Interestify/assets/96344003/6f883096-5beb-4dd3-843d-cdb5e5a17620)
  
![Screenshot from 2023-06-24 23-19-06](https://github.com/SahilSingh177/Interestify/assets/96344003/3bf5444f-285f-4dfa-b7cf-8febcbc49f0e)

<img src="https://github.com/SahilSingh177/Interestify/assets/96344003/e3cf52b8-e305-4ddd-a116-36a56486c610" alt="Image 1">

</div>

## Features

- Browse articles by category
- Sort articles by popularity (most liked, recent, hot)
- Bookmark articles for later reference
- View your browsing history
- Like articles to show appreciation
- Subscribe to a weekly mail service for curated articles

## How Interestify Works

<p>During the signup process, users are asked to specify their category preferences. A "BROWSES" relationship is then established between the user and the chosen category in the database. Initially, all categories are given equal preferences, which are also stored in the database along with the relationship. When a user visits the front page, a request is sent to the backend to retrieve articles, and the articles displayed are based on the user's preferences. Categories with higher priority will have a greater number of displayed blogs. After a user reads an article, the priority of all categories is updated. The update function takes into account the decay rate of an article. If a user previously browsed a category but has recently stopped browsing it, the blogs from that category will appear less frequently in their feed. </p>
<p>
For email services, we utilize the smtplib library and a thread scheduler to ensure that emails are sent out every week at the scheduled time. To generate similar articles, we use sklearn library.  In addition, we are utilizing Redis as a caching mechanism for storing the cache of similar articles. This allows us to efficiently retrieve and serve similar articles based on cosine similarity calculations.
</p>

## Interest-Based Browsing

Interestify takes personalized browsing to the next level by offering interest-based recommendations. The application analyzes your browsing history, likes, and bookmarks to understand your preferences. It then suggests relevant articles based on your interests, ensuring you discover new and engaging content in your areas of interest.

### Database showing relationship between User, Category, and Blogs

| <img src="https://via.placeholder.com/12x12/914286/?text=+" alt="Purple"> | Category |
| --- | --- |
| <img src="https://via.placeholder.com/12x12/ffe081/?text=+" alt="Yellow"> | Blog |
| <img src="https://via.placeholder.com/12x12/f79767/?text=+" alt="Orange"> | User |

![bloom-visualization](https://github.com/SahilSingh177/Interestify/assets/96344003/b474ff8e-09a7-4c26-a517-543a95d3b566)

## Technologies Used

- Frontend: Next.js, TypeScript, Chakra UI
- Backend: Flask, Neo4j, scikit-learn, Redis, smtplib, lucene

## Prerequisites

To run the Interestify backend, ensure that you have the following:

- Python 3.x
- Neo4j database (please provide your own API keys for Neo4j)

## Installation and Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/SahilSingh177/interestify.git
   ```

# For running server

  1. Navigate to the server directory:
     
     ```shell
     cd interestify/server
      ```
    
  2. Install the Python dependencies:
     
     ```shell
     pip install -r requirements.txt
      ```
    
  3. Start the backend server:

     ```
     python main.py
     ```

# For running frontend

1. Navigate to the server directory:

     ```shell
     cd interestify/client
2. Install the Node.js dependencies:
     ```shell
     npm install
     ```
3. Run the frontend:

   ```shell
   npm run dev
## Note on Hosting
As students, we are unable to purchase expensive hosting plans. Despite this limitation, we have meticulously designed the Interestify platform to provide users with a highly responsive and user-friendly browsing experience. We leverage Vercel for frontend hosting and PythonAnywhere for backend hosting to optimize performance. However, intermittent speed issues may occur due to constraints on the PythonAnywhere Hacker plan, particularly during high traffic periods. We continuously work to improve our code and infrastructure to maintain fast browsing speeds. To experience the platform with minimal latency, we recommend running Interestify locally on your own machine, utilizing its full processing power. Your feedback is invaluable to us as we strive to enhance the platform's performance. Thank you for being part of our journey.

## Legal Disclaimer
We extend our gratitude to Springer for their valuable articles. Please note that Interestify is solely intended for educational purposes and not for commercial use. If there are any copyright concerns, kindly contact us, and we will promptly address any issues and remove respective posts.
