const { createReadStream, createWriteStream } = require('fs');
const { readdir, mkdir, rm, readFile, writeFile, appendFile } = require('fs/promises');
const { join } = require('path');
const { pipeline } = require('stream/promises');

const projectFolder = join(__dirname, 'project-dist');
const sourceAssets = join(__dirname, 'assets');
const projectAssets = join(projectFolder, 'assets');
const sourceStyles = join(__dirname, 'styles');
const sourceComponents = join(__dirname, 'components');
const bundleCss = join(projectFolder, 'style.css');
const sourceHtmlTemplate = join(__dirname, 'template.html');
const projectHtmlPage = join(projectFolder, 'index.html');


const createHtmlPage = async (htmlTemplate, components, htmlPage) => {
  const templates = {};

  const templateFiles = await readdir(components);
  
  for (const file of templateFiles) {
    const fileToPath = join(components, file);

    if (file.includes('html')) {
      const data = readFile(fileToPath);
      templates[file.split('.')[0]] = (await data).toString();
    }
  }

  let templateHtml = readFile(htmlTemplate);
  for (const item in templates) {
    const regexp = new RegExp (`{{${item}}}`, 'g');
    templateHtml = (await templateHtml).toString().replace(regexp, templates[item]);
  }

  writeFile(htmlPage, templateHtml, (err) => console.log(err));
}

const copyFolder = async (sourceFolder, destinationFolder) => {
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

const createCssBundle = async (sourceFolder, bundleCss) => {
  const files = await readdir(sourceFolder);

  for (const file of files) {
    if (file.includes(".css")) {
      const pathToFail = join(sourceFolder, file);

      const data = readFile(pathToFail);
      appendFile(bundleCss, (await data).toString(), (err) => console.log(err));
    }
  }
}

const createProject = async () => {
  await rm(projectFolder, { recursive: true, force: true });
  await mkdir(projectFolder, { recursive: true });

  await createHtmlPage(sourceHtmlTemplate, sourceComponents, projectHtmlPage);
  await copyFolder(sourceAssets, projectAssets);
  await createCssBundle(sourceStyles, bundleCss);
}

createProject();


