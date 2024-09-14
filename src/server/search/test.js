const express = require('express');
const app = express();
const port = 80;

// ルートのエンドポイント
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
