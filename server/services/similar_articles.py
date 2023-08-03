import os
import pickle

import pandas as pd
import redis
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import sigmoid_kernel

import dotenv
from .database.database import App

dotenv.load_dotenv()

# Initialize Redis client
redis_host = os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT")
redis_password = os.getenv("REDIS_PASSWORD")
redis_client = redis.Redis(host=redis_host, port=redis_port, password=redis_password)

DATABASE_URL = os.getenv("DATABASE_URL")
USER = os.getenv("DATABASE_USER")
PASSWORD = os.getenv("DATABASE_PASSWORD")

uri = DATABASE_URL
user = USER
password = PASSWORD
app = App(uri, user, password)

def get_all_blogs():
    cache_key = "all_blogs"
    cached_data = redis_client.get(cache_key)
    if cached_data:
        data = pickle.loads(cached_data)
    else:
        data = app.get_all_blogs()
        redis_client.set(cache_key, pickle.dumps(data))
        redis_client.expire(cache_key, 12 * 60 * 60)
    return data

def get_recommendations(id):
    try:
        cache_key = f"recommendations_{id}"
        cached_data = redis_client.get(cache_key)
        if cached_data:
            recommendations = pickle.loads(cached_data)
        else:
            data = get_all_blogs()
            df = pd.DataFrame(data)
            df = df[['id', 'title', 'summary', 'author', 'link']]
            df.fillna('', inplace=True)
            df['combined_features'] = df['title'] + ' ' + df['summary'] + ' ' + df['author']
            vectorizer = TfidfVectorizer()
            feature_vectors = vectorizer.fit_transform(df['combined_features'])
            sig = sigmoid_kernel(feature_vectors, feature_vectors)
            indices = pd.Series(df.index, index=df['id']).drop_duplicates()
            idx = indices[id]
            sig_scores = list(enumerate(sig[idx]))
            sig_scores = sorted(sig_scores, key=lambda x: x[1], reverse=True)
            sig_scores = sig_scores[1:11]
            df_indices = [i[0] for i in sig_scores]
            res = []
            for i in df_indices:
                res.append({'id': int(df['id'][i]), 'title': df['title'][i], 'link': df['link'][i]})
            recommendations = res
            redis_client.set(cache_key, pickle.dumps(recommendations))
            redis_client.expire(cache_key, 12 * 60 * 60)
        return recommendations

    except Exception as e:
        print("An error occurred in get_recommendations:", e)
        return []

    finally:
        app.close()
