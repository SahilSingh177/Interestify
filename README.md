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
- Backend: Flask, Neo4j, Redis, scikit-learn

## Prerequisites

To run the Interestify backend, ensure that you have the following:

- Python 3.x
- 
- Neo4j database
- Firebase account
- Redis cloud keys
- Cohere API keys
- SMPT Port

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
The Interestify platform is meticulously designed to provide users with a highly responsive and user-friendly browsing experience. Our strategic hosting arrangement involves utilizing the Vercel platform for the frontend and PythonAnywhere for the backend. This combination allows us to leverage the strengths of each hosting provider to optimize performance and ensure a seamless user experience.

However, it is important to note that intermittent speed issues may arise due to certain constraints imposed by the Hacker plan on PythonAnywhere. This plan restricts the number of workers available to handle incoming requests, which can impact the speed of certain features, such as the search functionality. Despite our efforts to optimize code and infrastructure, the high volume of requests generated within a short span of time can lead to reduced performance on the hosted site.

To address these limitations, we are committed to continuously enhancing our codebase and refining our infrastructure. By implementing ongoing optimizations, we strive to maintain a consistently fast browsing experience for our users. We understand that peak usage periods may result in load-related slowdowns, and we appreciate your understanding and patience during such times.

For users seeking the utmost browsing experience with minimal latency, we recommend running the Interestify website locally on your own machines. By doing so, you can harness the full processing power and resources of your local environment, resulting in unparalleled speed and responsiveness. Hosting the website on a local server ensures that the system resources are dedicated solely to serving the site, further enhancing its speed and overall performance.

We highly value the feedback provided by our users, as it plays a crucial role in our ongoing efforts to optimize and refine our infrastructure. Your continued support is invaluable to us as we strive to deliver the best possible browsing experience on Interestify. Thank you for your understanding and for being a part of our journey towards improving the platform's performance.

## Legal Disclaimer
We extend our gratitude to Springer for their valuable articles. Please note that Interestify is solely intended for educational purposes and not for commercial use. If there are any copyright concerns, kindly contact us, and we will promptly address any issues and remove respective posts.
