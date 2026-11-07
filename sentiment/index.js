require('dotenv').config();
const express = require('express');
const natural = require('natural');

const app = express();
app.use(express.json());
const port = 3000;

app.post('/sentiment', async (req, res) => {
  const { sentence } = req.query;

  if (!sentence) {
    return res.status(400).json({ error: 'No sentence provided' });
  }

  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer('English', stemmer, 'afinn');
  const tokenizer = new natural.WordTokenizer();

  try {
    const tokens = tokenizer.tokenize(sentence);
    const score = analyzer.getSentiment(tokens);

    let sentiment = 'neutral';
    if (score < 0) {
      sentiment = 'negative';
    } else if (score > 0.33) {
      sentiment = 'positive';
    }

    res.status(200).json({ sentimentScore: score, sentiment: sentiment });
  } catch (error) {
    res.status(500).json({ message: 'Error performing sentiment analysis' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});