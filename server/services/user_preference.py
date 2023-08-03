import os
import pandas as pd
from datetime import datetime

import dotenv
from .database.database import App

dotenv.load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
USER = os.getenv("DATABASE_USER")
PASSWORD = os.getenv("DATABASE_PASSWORD")
database = App(DATABASE_URL, USER, PASSWORD)

def find_score(user_data, email):
    try:
        session_data = []
        for data in user_data:
            # for each session_time and session_date, create a session_entry
            if data['session_time'] is None:
                continue
            for i in range(len(data['session_time'])):
                original = str(data['session_date'][i])
                fixed_datetime = original[:-3]  # Remove the last three digits
                parsed_datetime = datetime.fromisoformat(fixed_datetime)
                formatted_datetime = parsed_datetime.strftime('%Y-%m-%d %H:%M:%S')
                session_entry = {
                    'category': data['category_name'],
                    'duration': data['session_time'][i],
                    'timestamp': formatted_datetime,
                }
                session_data.append(session_entry)

        if len(session_data) > 0:
            df = pd.DataFrame(session_data)
            df['timestamp'] = pd.to_datetime(df['timestamp'])  # Convert 'timestamp' to datetime type
            df['recency'] = (datetime.now() - df['timestamp']).dt.total_seconds()
            df['score'] = df['duration'] * (1 - 0.0000069) * df['recency']

            user_profiles = df.groupby(['category']).agg({'score': 'sum'})
            total_score = user_profiles['score'].sum()
            print("Total score:", total_score)
            for category, score in user_profiles.iterrows():
                database.set_category_score(email, category, (score['score']) / total_score)
        else:
            print("No session data available.")

    except Exception as e:
        print("An error occurred in find_score:", e)

def publish_score(email):
    try:
        print("Publishing score for", email)
        user_data = database.get_duration_and_timestamp(email)
        find_score(user_data, email)
    except Exception as e:
        print("An error occurred in publish_score:", e)
    finally:
        database.close()
