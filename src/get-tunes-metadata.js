import { tunesListScraper } from './tunes-list-scraper.js';

async function main() {
  let [url, dir, fileName] = process.argv.slice(2);
  if (!dir.match(/\/$/)) { // Add a tailing slash if there is not
    dir += '/';
  }
  if (!fileName.match(/\.json$/)) { // Add a extension if not presented
    fileName += '.json';
  }
  try {
    await tunesListScraper(url, dir, fileName);
  } catch (err) {
    console.error(err);
  }
}

main();