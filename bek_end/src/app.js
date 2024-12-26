const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/front_war')));


app.get('/', (req, res) => {
  const filePath = "C:\\VS Code Folder\\Finance-tracker\\front_war\\main.html"
  
  res.sendFile(filePath);
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
