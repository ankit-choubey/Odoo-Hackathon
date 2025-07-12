import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

# 1. Load your labeled dataset
data = pd.read_csv("answer_quality_data.csv")  # should have 'text', 'label' columns

# 2. Preprocess text
stop_words = set(stopwords.words('english'))
data['text'] = data['text'].str.lower().str.replace(r'[^\w\s]', '', regex=True)
data['text'] = data['text'].apply(lambda x: ' '.join([w for w in x.split() if w not in stop_words]))

# 3. TF-IDF Vectorization
vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(data['text'])
y = data['label']  # 0: spam/low-quality, 1: good

# 4. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train Model
model = LogisticRegression()
model.fit(X_train, y_train)

# 6. Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
