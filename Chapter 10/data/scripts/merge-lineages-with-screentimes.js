const { readFileSync, writeFileSync } = require('fs');

const lineageData = JSON.parse(readFileSync('../GoT-lineage-by-father.json'));
const timeData = JSON.parse(readFileSync('../GoT-screentimes.json'));


const output = lineageData.map((d) => {
  try {
    let time = timeData.filter(e => e.name.split(' ').shift() === d.itemLabel.split(' ').shift());
    if (time.length > 1) {
      time = timeData.filter(e => e.name === d.itemLabel);
    }

    d.screentime = time[0].screentime;
    d.episodes = time[0].episodes;

    return d;
  } catch (e) {
    // console.log(d.itemLabel);
    // console.error(e);
    d.screentime = 0;
    d.episodes = 0;

    return d;
  }
});//.filter(i => i.screentime > 0);

writeFileSync('../GoT-lineages-screentimes.json', JSON.stringify(output), { encoding: 'utf8' });
