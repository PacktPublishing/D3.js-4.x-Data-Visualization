// Source file: http://www.imdb.com/list/ls076752033/
// Obtained via running the following in Chrome dev console:
//

// var a = JSON.stringify([...document.querySelectorAll('.list_item')].map(v => {
//   const inner = v.querySelector('.description').innerHTML;
//   return {
//     name: v.querySelector('.info b a').textContent,
//     screentime: inner.slice(inner.lastIndexOf('<br>') + 4, inner.indexOf('<span class="bqend">')),
//     episodes: inner.match(/\s(\d+)\sepisodes/i) ? inner.match(/\s(\d+)\sepisodes/i)[1] : 'unspecified',
//     portrayedBy: {
//       name: v.querySelector('.info .secondary a:last-child').textContent,
//       imdbUrl: v.querySelector('.info .secondary a:last-child').getAttribute('href')
//     }
//   };
// }));
// copy(a);

const { readFileSync, writeFileSync } = require('fs');

const data = JSON.parse(readFileSync('./GoT-screentimes.json'));

const converted = data.map(d => {
  d.screentime = d.screentime.replace(/ minutes?/, '');
  const split = d.screentime.split(':');

  if (split.length === 2) {
    d.screentime = split[0] + '.' + split[1];
  }

  d.screentime = Number(d.screentime);
  d.episodes = Number(d.episodes) || d.episodes;

  return d;
});


writeFileSync('./GoT-screentimes.json', JSON.stringify(data), {encoding: 'utf8'});
