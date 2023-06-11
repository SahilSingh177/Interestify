from flask import jsonify
import nltk
from gensim.summarization import summarize

# Download NLTK resources (required for tokenization)
nltk.download('punkt')

def summarize_article(article):
    summary = summarize(article)
    return jsonify({'summary': summary})