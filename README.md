<h1 align="center">Interestify</h1>

<p align="center">
  Interestify is an amazing web application that brings you a personalized browsing experience for articles. It leverages web scraping techniques to collect articles from popular sources like Springer, allowing you to explore a vast library of knowledge based on your interests. With Interestify, you can discover, bookmark, and read articles tailored specifically to your preferences.
</p>

<div align="center">
  

https://github.com/SahilSingh177/Interestify/assets/96344003/130e3750-f7c6-4a57-8ebe-d906f292c96d


</div>

## Features

- Browse articles by category
- Sort articles by popularity (most liked, recent, hot)
- Bookmark articles for later reference
- View your browsing history
- Like articles to show appreciation
- Subscribe to a weekly mail service for curated articles

## Interest-Based Browsing

Interestify takes personalized browsing to the next level by offering interest-based recommendations. The application analyzes your browsing history, likes, and bookmarks to understand your preferences. It then suggests relevant articles based on your interests, ensuring you discover new and engaging content in your areas of interest.

## Technologies Used

- Frontend: Next.js, TypeScript, Chakra UI
- Backend: Flask, Neo4j, scikit-learn

## Prerequisites

To run the Interestify backend, ensure that you have the following:

- Python 3.x
- Neo4j database (please provide your own API keys for Neo4j)

## Installation and Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/interestify.git
2. Navigate to the server directory:
   ```shell
     cd interestify/server/app
3. Install the Python dependencies:
   ```shell
     pip install -r requirements.txt
4. Start the backend server:
   ```shell
     python main.py
5. (Optional) If you also want to run the frontend on your local system, navigate to the client directory:
   ```shell
     cd ../../client
7. Install the Node.js dependencies:
   ```shell
   npm install
8. Access the application by visiting http://localhost:3000 in your web browser.

## Note on Hosting
The Interestify frontend is hosted on Vercel, ensuring a smooth and seamless browsing experience for users. However, due to memory limitations of free hosting providers, the backend is not currently hosted.

## Legal Disclaimer
We extend our gratitude to Springer for their valuable articles. Please note that Interestify is solely intended for educational purposes and not for commercial use. If there are any copyright concerns, kindly contact us, and we will promptly address any issues and remove respective posts.



   


