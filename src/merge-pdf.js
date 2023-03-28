import PDFMerger from 'pdf-merger-js';
import * as fs from 'fs';
import { resolve } from 'path';

(async () => {
  const [dir, outDir] = process.argv.slice(2);
  const dirent = fs.opendirSync(dir);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  for (let folder = dirent.readSync(); folder !== null; folder = dirent.readSync()) {
    if (folder.isDirectory()) {
      const subPath = resolve(dir, folder.name);
      const files = fs.readdirSync(subPath, {withFileTypes: true});
      const pdfList = files.filter(i => i.isFile() && i.name.match(/\.pdf$/i)).map(i => i.name);
      if (pdfList.length > 1) {
        // Only merge collections with multiple pdf files
        console.log(`Merging '${folder.name}'`);
        pdfList.sort(); // Sort before to ensure the order is by filename
        const merger = new PDFMerger();
        for (const f of pdfList) {
          await merger.add(resolve(subPath, f));
        }
        await merger.save(resolve(outDir, folder.name + '.pdf'));
        console.log(`Merging finished and saved to '${folder.name}.pdf'`);
      }
    }
  }
})();