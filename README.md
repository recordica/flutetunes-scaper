# Flutetunes Scraper

##### Scrapers to read data from flutetunes.com

##### Steps

1. Initialising
   ```
   npm install
   ```

2. Get metadata from a composer page
   ```
   npm run gtm <url> <outDir> <outFileName>
   ```
   eg. Scraping the song list of Mozart
   ```
   npm run gtm "https://www.flutetunes.com/composers.php?id=9" ./out Mozart
   ```

3. Download data
   ```
   npm run dl <metadataPath> <outDir> pdf midi
   ```
   eg. Downloading only the PDF resources from the song list of Mozart previous fetched
   ```
   npm run dl ./out/Mozart.json ./out/Mozart/ pdf
   ```
   eg. Downloading both PDF and MIDI resources
   ```
   npm run dl ./out/Mozart.json ./out/Mozart/ pdf midi
   ```  

