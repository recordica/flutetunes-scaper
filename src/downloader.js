import fetch from 'node-fetch';
import * as fs from 'fs';

const getFileName = (str) =>  {
  const parts = str.split('/');
  return parts[parts.length - 1];
}

const dirNameFilter = (str) => {
  return str.replace(/[\/\\:]/g, '-');
}

export async function downloader(list, dir, downloadPdf = true, downloadMidi = false) {
  if (!dir.match(/\/$/)) { // Add a tailing slash if there is not
    dir += '/';
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  let finishedCountPdf = 0;
  let finishedCountMidi = 0;
  list.forEach((i, idx) => {
    const subPath = i.title.isPartOf ? dirNameFilter(i.title.isPartOf) + '/' : '';
    const finalDir = dir + subPath;;
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir);
    }
    console.log(!downloadPdf && !downloadMidi ? 
      'Download skipped as none of pdf or midi is selected' :
      `(${idx + 1}/${list.length}) Downloading for '${i.rowTitle}'...`
    );
    if (downloadPdf) {
      fetch(i.pdf).then(res => {
        const fileName = i.rowTitle ? dirNameFilter(i.rowTitle + '.pdf') : getFileName(i.pdf);
        const fileStream = fs.createWriteStream(finalDir + fileName);
        return new Promise((resolve, reject) => {
          res.body.pipe(fileStream);
          res.body.on("error", reject);
          fileStream.on("finish", resolve);
        });
      }).then(() => {
        finishedCountPdf++;
        console.log(`(${finishedCountPdf}/${list.length})Downloaded pdf for '${i.rowTitle ? i.rowTitle : getFileName(i.pdf)}'`);
      });
    }
    if (downloadMidi) {
      fetch(i.midi).then(res => {
        const fileName = getFileName(i.midi);
        const fileStream = fs.createWriteStream(finalDir + fileName);
        return new Promise((resolve, reject) => {
          res.body.pipe(fileStream);
          res.body.on("error", reject);
          fileStream.on("finish", resolve);
        });
      }).then(() => {
        finishedCountMidi++;
        console.log(`(${finishedCountMidi}/${list.length}) Downloaded midi for '${i.rowTitle ? i.rowTitle : getFileName(i.midi)}'`);
      });
    }
  });
}