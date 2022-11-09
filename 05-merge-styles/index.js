const { readdir, readFile, appendFile } = require('fs/promises');
const { join } = require('path');

const sourceFolder = join(__dirname, 'styles');
const projectFolder = join(__dirname, 'project-dist');

const createBundle = async (sourceFolder, projectFolder) => {
  const files = await readdir(sourceFolder);

  const destinationFile = join(projectFolder, 'bundle.css');

  for (const file of files) {
    if (file.includes(".css")) {
      const pathToFail = join(sourceFolder, file);

      const data = readFile(pathToFail);
      appendFile(destinationFile, (await data).toString(), (err) => console.log(err));
    }
  }
}

createBundle(sourceFolder, projectFolder);