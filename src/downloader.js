import fetch from 'node-fetch';
import * as fs from 'fs';

const getFileName = (str) =>  {
  const parts = str.split('/');
  return parts[parts.length - 1];
}

const dirNameFilter = (str) => {
  return str.replace(/[\/\\:]/g, '-');
}

export async function downloader(list, dir) {
  if (!dir.match(/\/$/)) { // Add a tailing slash if there is not
    dir += '/';
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  list.forEach((i, idx) => {
    const subPath = i.title.isPartOf ? dirNameFilter(i.title.isPartOf) + '/' : '';
    const finalDir = dir + subPath;;
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir);
    }
    console.log(`(${idx}/${list.length}) Downloading pdf and midi for '${i.rowTitle}'...`);
    fetch(i.pdf).then(res => {
      const fileName = i.rowTitle ? dirNameFilter(i.rowTitle + '.pdf') : getFileName(i.pdf);
      const fileStream = fs.createWriteStream(finalDir + fileName);
      return new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
    });
    fetch(i.midi).then(res => {
      const fileName = getFileName(i.midi);
      const fileStream = fs.createWriteStream(finalDir + fileName);
      return new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
    });  
  });
}