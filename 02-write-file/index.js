const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'output.txt');
const writeStream = fs.WriteStream(pathToFile);

function goodbye() {
  process.stdout.write('Пока!');
  process.exit();
}

process.stdout.write('Привет! Введи текст:\n');
process.stdout.write('Для записи текста в файл нажми Ctrl + C или напиши "exit".\n');

process.stdin.on('data', (data) => {
  if (data.includes('exit')) {
    goodbye();
  } else {
    writeStream.write(data);
  }
});

process.on('SIGINT', () => {
  goodbye();
});




