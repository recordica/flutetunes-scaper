import { downloader } from './downloader.js';
import * as fs from 'fs';

async function main() {
  let [inPath, outDir] = process.argv.slice(2);
  if (!outDir.match(/\/$/)) { // Add a tailing slash if there is not
    outDir += '/';
  }
  try {
    const data = JSON.parse(fs.readFileSync(inPath, 'utf-8'));
    if (data instanceof Array && data.length > 0) {
      console.log(`Successfully read ${data.length} items of data!`);
      await downloader(data, outDir);
    } else {
      throw new Error('ERR: Invalid input file!');
    }
  } catch (err) {
    console.error(err);
  }
}

main();