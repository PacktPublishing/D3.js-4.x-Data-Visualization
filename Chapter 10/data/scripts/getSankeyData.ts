/**
 * Data originally from Martin Baxter's Electoral Calculus:
 * @see http://www.electoralcalculus.co.uk/flatfile.html
 */

import * as topojson from 'topojson-client';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SankeyLink, SankeyNode, SankeyData } from 'd3-sankey';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

async function generateData() {
  const parser = d3.dsvFormat(',');
  const csv2010 = readFileSync('../electdata_2010.csv', {encoding: 'utf8'});
  const data2010 = parser.parse(csv2010);
  data2010.forEach((d: any) => {
    delete d.Region;
    delete d.Electorate;
    delete d.MP;
    delete d['County Area'];
  });
  const seats2010 = data2010.map((d: any) => {
    const seat = d.Name;
    delete d.Name;
    const max = Math.max.apply(null,Object.keys(d).map(x => d[x]));
    const winner = Object.keys(d).filter(x => Number(d[x]) === max).shift();

    return {
      seat,
      winner2010: winner,
    };
  });

  const csv2015 = readFileSync('../electdata_2015.csv', {encoding: 'utf8'});
  const data2015 = parser.parse(csv2015);
  data2015.forEach((d: any) => {
    delete d.Region;
    delete d.Electorate;
    delete d.MP;
    delete d['County Area'];
  });

  const seats2015 = data2015.map((d: any) => {
    const seat = d.Name;
    delete d.Name;
    const max = Math.max.apply(null,Object.keys(d).map(x => d[x]));
    const winner = Object.keys(d).filter(x => Number(d[x]) === max).shift();

    return {
      seat,
      winner2015: winner,
    };
  });

  const merged = _.merge([], seats2015, seats2010);
  const nodes: Array<SankeyNode> = [
    { name: "CON2015" },
    { name: "LAB2015" },
    { name: "LIB2015" },
    { name: "UKIP2015" },
    { name: "Green2015" },
    { name: "Other2015" },
    { name: "CON2010" },
    { name: "LAB2010" },
    { name: "LIB2010" },
    { name: "UKIP2010" },
    { name: "Green2010" },
    { name: "Other2010" }
  ];

  console.dir(merged);
  const links = merged.reduce((coll: Array<SankeyLink>, curr) => {
    const source = _.findIndex(nodes, d => d.name === curr.winner2010 + '2010');
    const target = _.findIndex(nodes, d => d.name === curr.winner2015 + '2015');
    const linkIdx = _.findIndex(coll, d => d.source === source && d.target === target);
    if (linkIdx === -1) {
      coll.push({
        source,
        target,
        value: 1,
      });
    } else {
      coll[linkIdx].value++;
    }
    return coll;
  }, []);

  writeFileSync(resolve(__dirname, '..', 'uk-election-sankey.json'),
    JSON.stringify({nodes, links}, null, '\t'),
    {encoding: 'utf8'},
  );
}



generateData();

// async function tschart(useCanvas = false) {
//   const us = await (await fetch('//unpkg.com/us-atlas@1.0.0/us/10m.json')).json();
//
//   if (useCanvas) {
//     const width = 960;
//     const height = 600;
//     const projection = d3.geoAlbersUsa();
//     const canvas = d3.select(document.body)
//       .append('canvas')
//       .attr('width', width)
//       .attr('height', height)
//       .node();
//     const context = canvas.getContext('2d');
//     const states = topojson.feature(us, us.objects.states);
//     const path = d3.geoPath().context(context);
//     context.beginPath();
//     path(states);
//     context.stroke();
//
//     function redraw() {
//       context.clearRect(0, 0, width, height);
//     }
//   } else {
//     const width = 960;
//     const height = 600;
//     const path = d3.geoPath();
//     const chart = d3.select(document.body)
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height);
//
//
//     const states = chart
//       .datum(topojson.feature(us, us.objects.states))
//       .append('path')
//       .attr('stroke', 'tomato')
//       .attr('fill', 'none')
//       .attr('d', path);
//
//     const centroids = us.objects.states.features.map(d => path(d).centroid());
//     const tree = d3.quadtree(centroids, path.x, path.y)
//       .extent([
//         [0, 0],
//         [width, height],
//     ]);
//   }
// };
//
// tschart(true);
// export default tschart;
