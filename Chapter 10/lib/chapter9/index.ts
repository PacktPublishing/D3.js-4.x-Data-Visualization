import {sankey, SankeyLink, SankeyNode, SankeyData } from 'd3-sankey';
import * as d3 from 'd3';
import 'whatwg-fetch';
import chartFactory from '../common/index';

const chart = chartFactory({
  margin: { left: 40, right: 40, top: 40, bottom: 40 },
  padding: { left: 10, right: 10, top: 10, bottom: 10 },
});


const partyColors = {
  CON: '#0087DC',
  LAB: '#DC241F',
  SNP: '#FFFF00',
  LIB: '#FDBB30',
  UKIP: '#70147A',
  Green: '#6AB023',
  Other: '#CCCCCC',
};

export default async function typescriptSankey() {
  const sankeyData: SankeyData = await (await fetch('data/uk-election-sankey.json')).json();
  const width = chart.width;
  const height = chart.height;

  const svg = chart.container;

  const defs = svg.append('defs');
  Object.keys(partyColors).forEach((d, i, a) => {
    a.forEach(v => {
      defs.append('linearGradient')
        .attr('id', `${d}-${v}`)
        .call((gradient) => {
            gradient.append('stop').attr('offset', '0%').attr('style', `stop-color:${partyColors[d]}; stop-opacity:0.8`);
            gradient.append('stop').attr('offset', '100%').attr('style', `stop-color:${partyColors[v]}; stop-opacity:0.8`);
        });
    });
  });

  const sankeyGenerator = sankey()
    .size([width - 100, height - 100])
    .nodeWidth(15)
    .nodePadding(10)
    .nodes(sankeyData.nodes)
    .links(sankeyData.links)
    .layout(1);

  const path = sankeyGenerator.link();

  const link = svg.selectAll('.link')
    .data(sankeyData.links)
    .enter()
    .append('g')
    .classed('link', true);

  link.append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', d => {
      const source = d.source.name.replace(/(2010|2015)/, '');
      const target = d.target.name.replace(/(2010|2015)/, '');
      return `url(#${source}-${target})`;
    })
    .style('stroke-width', d => Math.max(1, d.dy));

  const node = svg.selectAll('.node')
    .data(sankeyData.nodes)
    .enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => `translate(${d.x},${d.y})`);

  node.append('rect')
    .attr('height', d => d.dy)
    .attr('width', sankeyGenerator.nodeWidth())
    .style('fill', d => partyColors[d.name.replace(/(2010|2015)/, '')])
    .append('title')
    .text(d => `${d.name}\nSeats: ${d.value}`);

  node.append('text')
    .attr('x', -6)
    .attr('y', d => d.dy / 2)
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .text(d => d.name)
    .filter(d => d.x < width / 2)
    .attr('x', 6 + sankeyGenerator.nodeWidth())
    .attr('text-anchor', 'start');

  node.selectAll('rect[height="0"]')
    .each(function(d){
      this.parentNode.remove();
    });

  const select = (item: string|null) => {
    if (item) {
      const filteredLinks = sankeyData.links.filter(d => d.source.name === item);
      const filteredNodes = sankeyData.nodes.filter(d => d.name === item || d.name.match(/2015$/));

      svg.selectAll('.link')
        .attr('opacity', d => d.source.name === item ? 1 : .3);

      svg.selectAll('.node')
        .attr('opacity', d => (d.name === item || d.name.match('2015')) ? 1 : .3);
    } else {
      svg.selectAll('.link')
        .attr('opacity', 1);

      svg.selectAll('.node')
        .attr('opacity', 1);
    }
  }

  let current = null;
  node.on('click', e => {
    if (current === e.name) {
      current = null;
    } else {
      current = e.name;
    }

    select(current);
  });

  return {
    select,
    node,
    link,
    data: sankeyData,
  };
}
