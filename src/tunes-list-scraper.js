import fetch from 'node-fetch';
import * as ch from 'cheerio';
import * as fs from 'fs';

async function tunesPageScraper ({rowTitle, url}) {
  const res = await fetch(url);
  const {protocol, host} = new URL(url);
  const urlBase = `${protocol}//${host}`;
	const $ = ch.load(await res.text());
  console.log(`Fetched the tunes page of ${rowTitle}`);
  const $th = $('table.tune > tbody > tr > th');
  if ($th.length <= 0 || $('.pdf:first').length <= 0 || $('.midi:first').length <= 0) {
    throw new Error('ERR: The tunes page is not valid!');
  }
	const info = {
    rowTitle,
    url,
		title: '',
		opus: $th.filter((_, el) => $(el).text().match(/opus/i)).eq(0).next('td').text(),
		composer: $th.filter((_, el) => $(el).text().match(/composer/i)).eq(0).next('td').text(),
		pdf: urlBase + $('.pdf:first')[0].attribs.href,
		midi: urlBase + $('.midi:first')[0].attribs.href
	};
	const $tdTitle = $th.filter((_, el) => $(el).text().match(/title/i)).eq(0).next('td');
	const isPartOf = $tdTitle.find('[property=schema:isPartOf]');
	if (isPartOf.length > 0) {
		info.title = {
			name: $tdTitle.find('[property=schema:name]').text(),
			isPartOf: isPartOf.text()
		}
	} else {
		info.title = $tdTitle.text();
	}
	return info;
}

const getRowTitle = ($td) => {
  let textArr = [];
  for (let i = 0; i < $td.length ;i++) {
    textArr.push($td.eq(i).text());
  }
  textArr = textArr.filter(str => !!str).map(str => str.trim());
  textArr[textArr.length - 1] = `(${textArr[textArr.length - 1]})`;
  return textArr.join(' ');
}

export async function tunesListScraper(url, savePath, fileName) {
  try {
    const {protocol, host} = new URL(url);
    const urlBase = `${protocol}//${host}`;
    const res = await fetch(url);
    const content = await res.text();
    console.log('Fetched the tunes list page!');
    const $ = ch.load(content);
    const tunesPageATags = $('table.browser a');
    const list = [];
    try {
      for (let i = 0; i < tunesPageATags.length; i++) {
        list.push({
          rowTitle: getRowTitle(tunesPageATags.eq(i).closest('tr').children()),
          url: urlBase + tunesPageATags[i].attribs.href
        });
      }
    } catch (_) {
      throw new Error('ERR: The page is not valid!');
    }
    console.log(`Parsed ${list.length} tunes and fectching for details...`);
    const finalList = await Promise.all(list.map(i => tunesPageScraper(i)));
    fs.writeFileSync(savePath + fileName, JSON.stringify(finalList, null, 2));
    console.log(`The results have been saved to '${savePath + fileName}'.`);
  } catch (err) {
    console.error(err);
  }
}