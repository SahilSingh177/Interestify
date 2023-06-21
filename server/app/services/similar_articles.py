import pandas as pd
from sklearn.metrics.pairwise import sigmoid_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from .database.database import App

DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"

uri = DATABASE_URL
user = USER
password = PASSWORD
app = App(uri,user,password)

def get_recommendations(title):
    df = pd.read_csv("/content/drive/MyDrive/datasets/neo4j_query_table_data_2023-6-19.csv")
    lst = re.search(" title:", df['n'][7])
    rst = re.search(" elementId:", df['n'][7])
    df['identity'] = df['n'].apply(lambda row: int(row.split(',')[0][14:]))
    df['title'] = df['n'].apply(lambda row: row.split(',')[-2][12:-4])
    df['summary'] = df['n'].apply(lambda row: row[re.search(" summary:", row).end() + 1:re.search("download_link:", row).start() - 6])
    df['authors'] = df['n'].apply(lambda row: row[re.search(" author:", row).end() + 1:re.search(" link:", row).start() - 6])
    df['link'] = df['n'].apply(lambda row: row[re.search(" link:", row).end() + 1:re.search("\n    text:", row).start() - 1])
    df = df.drop("n", axis=1)
    df.to_csv("base_data.csv")
    combined_features = df['title'] + ' ' + df['summary'] + ' ' + df['authors']
    combined_features = combined_features.fillna(' ')
    vectorizer = TfidfVectorizer()
    feature_vectors = vectorizer.fit_transform(combined_features)
    sig = sigmoid_kernel(feature_vectors, feature_vectors)
    indices = pd.Series(df.index, index=df['title']).drop_duplicates()
    idx = indices[title]
    sig_scores = list(enumerate(sig[idx]))
    sig_scores = sorted(sig_scores, key=lambda x: x[1], reverse=True)
    sig_scores = sig_scores[1:11]
    df_indices = [i[0] for i in sig_scores]
    return df['title'].iloc[df_indices]

recommendations = get_recommendations('The motivations and practices of vegetarian and vegan Saudis')
print(recommendations)
