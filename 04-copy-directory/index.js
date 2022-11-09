const { readdir, mkdir, rm} = require('fs/promises');
const { join } = require('path');
const { pipeline } = require('stream/promises');
const { createReadStream, createWriteStream} = require('fs');

const sourceFolder = join(__dirname, 'files');
const destinationFolder = join(__dirname, 'files-copy');

copyFolder = async (sourceFolder, destinationFolder) => {
  await rm(destinationFolder, { recursive: true, force: true });
  await mkdir(destinationFolder, { recursive: true });

  const contentFolder = await readdir(sourceFolder, { withFileTypes: true });
  
  for (const item of contentFolder) {
    const sourcePath = join(sourceFolder, item.name);
    const destinationPath = join(destinationFolder, item.name);

    if (item.isFile()) {
      const rs = createReadStream(sourcePath);
      const ws = createWriteStream(destinationPath);
      await pipeline(rs, ws);
    } else {
      copyFolder(sourcePath, destinationPath);
    }
  };
}

copyFolder(sourceFolder, destinationFolder);
