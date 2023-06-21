# import pandas as pd
# from datetime import datetime
# from .database.database import App

# DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
# USER = "neo4j"
# PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"
# database = App(DATABASE_URL, USER, PASSWORD)

# def find_score(user_data,email):
#     session_data = []
#     for data in user_data:
#         # for each session_time and session_date, create a session_entry
#         for i in range(len(data['session_time'])):
#             original = str(data['session_date'][i])
#             fixed_datetime = original[:-3]  # Remove the last three digits
#             parsed_datetime = datetime.fromisoformat(fixed_datetime)
#             formatted_datetime = parsed_datetime.strftime('%Y-%m-%d %H:%M:%S')
#             session_entry = {
#                 'category': data['category_name'],
#                 'duration': data['session_time'][i],
#                 'timestamp': formatted_datetime,
#             }
#             session_data.append(session_entry)

#     if len(session_data) > 0:
#         df = pd.DataFrame(session_data)
#         df['timestamp'] = pd.to_datetime(df['timestamp'])  # Convert 'timestamp' to datetime type
#         df['recency'] = (datetime.now() - df['timestamp']).dt.total_seconds()
#         df['score'] = df['duration'] * (1 - 0.0000069) * df['recency']

#         user_profiles = df.groupby(['category']).agg({'score': 'sum'})
#         total_score = user_profiles['score'].sum()
#         print("Total score:", total_score)
#         for category,score in user_profiles.iterrows():
#             database.set_category_score(email,category,(score['score'])/total_score)
#     else:
#         print("No session data available.")

# def publish_score(email):
#     print("Publishing score for",email)
#     user_data = database.get_duration_and_timestamp(email)
#     find_score(user_data,email)
#     database.close()
