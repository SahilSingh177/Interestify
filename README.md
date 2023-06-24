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

## How Interestify Works



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
- Backend: Flask, Neo4j, scikit-learn

## Prerequisites

To run the Interestify backend, ensure that you have the following:

- Python 3.x
- Neo4j database (please provide your own API keys for Neo4j)

## Installation and Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/interestify.git
   ```

# For running server

  1. Navigate to the server directory:
     ```shell
     cd interestify/server/app
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

  1. Navigate to the client directory:
    ```shell
      cd interestify/client
    ```
  2. Install the Node.js dependencies:
     ```shell
     npm install
     ```
  3. Run the frontend:
  ```shell
  npm run dev
  ```
  4. Access the application by visiting http://localhost:3000 in your web browser.

## Note on Hosting

The Interestify frontend is hosted on Vercel and the backend is hosted on pythonanywhere, ensuring a smooth and seamless browsing experience for users. 

## Legal Disclaimer
We extend our gratitude to Springer for their valuable articles. Please note that Interestify is solely intended for educational purposes and not for commercial use. If there are any copyright concerns, kindly contact us, and we will promptly address any issues and remove respective posts.
