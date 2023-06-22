import pandas as pd
from sklearn.metrics.pairwise import sigmoid_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from .database.database import App

DATABASE_URL = "neo4j+s://58ad0a3e.databases.neo4j.io:7687"
USER = "neo4j"
PASSWORD = "TrU2Lb35p2JaTVKag7sn-RPD-BQtCCP0eBZMyhwXFY4"

uri = DATABASE_URL
user = USER
password = PASSWORD
app = App(uri,user,password)

def get_recommendations(id):
    data = app.get_all_blogs()
    app.close()
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
    return res