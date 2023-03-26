import { downloader } from './downloader.js';
import * as fs from 'fs';

async function main() {
  const args = process.argv.slice(2);
  let [inPath, outDir] = args;
  if (!outDir.match(/\/$/)) { // Add a tailing slash if there is not
    outDir += '/';
  }
  const downloadPdf = args.findIndex(arg => arg.match(/^pdf$|^--pdf$|^-p$/)) >= 0;
  const downloadMidi = args.findIndex(arg => arg.match(/^midi$|^--midi$|^--mid$|^-m$/)) >= 0;
  console.log(downloadPdf, downloadMidi)
  try {
    const data = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
    if (data instanceof Array && data.length > 0) {
      console.log(`Successfully read ${data.length} items of data!`);
      await downloader(data, outDir, downloadPdf, downloadMidi);
    } else {
      throw new Error('ERR: Invalid input file!');
    }
  } catch (err) {
    console.error(err);
  }
}

main();