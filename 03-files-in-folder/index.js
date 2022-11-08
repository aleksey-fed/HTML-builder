const { readdir, stat } = require('fs/promises')
const path = require('path');

const getBasename = (pathToFile) => {
  return path.basename(pathToFile);
}

const getExtention = (pathToFile) => {
  const ext = path.extname(pathToFile);
  return ext.slice(1);
}

const getSize = (file) => {
  return file.size;
}

const readDirectory = async () => {
  const pathToFolder = path.join(__dirname, 'secret-folder');
  const folderContent = await readdir(pathToFolder);

  folderContent.forEach(async (item) => {
    const pathToFile = path.join(pathToFolder, item);

    const itemStats = await stat(pathToFile);

    if (itemStats.isFile()) {
      const filename = getBasename(pathToFile).split('.')[0];
      const ext = getExtention(pathToFile);
      const size = (getSize(itemStats) / 1024).toFixed(2);

      const output = `${filename} - ${ext} - ${size}Kb`;

      console.log(output);
    }
  });  
}

readDirectory();