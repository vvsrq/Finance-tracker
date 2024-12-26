const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(process.cwd(), '/front_war')));


app.get('/', (req, res) => {

const filePath = path.join(process.cwd(), 'front_war', 'main.html');

  
  res.sendFile(filePath);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
