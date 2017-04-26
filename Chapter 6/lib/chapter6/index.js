import * as d3 from 'd3';
import './chapter6.css';
import chartFactory, {
  fixateColors,
  addRoot,
  colorScale as color,
  tooltip,
  heightOrValueComparator,
  valueComparator,
} from '../common';

const westerosChart = chartFactory({ margin: { left: 50, right: 50, top: 50, bottom: 50 } });

westerosChart.loadData = async function loadData(uri) {
  if (uri.match(/\.csv$/)) {
    this.data = d3.csvParse(await (await fetch(uri)).text());
  } else if (uri.match(/\.json$/)) {
    this.data = await (await fetch(uri)).json();
  }


  return this.data;
};

westerosChart.init = function initChart(chartType, dataUri, ...args) {
  this.loadData(dataUri).then(data => this[chartType].call(this, data, ...args));
};

westerosChart.tree = function Tree(_data) {
  // fixateColors(_data, 'houseLabel');
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros');
  const chart = this.container;

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);
  const root = stratify(data);

  const layout = d3.tree()
    .size([
      500,
      500,
    ]);

  // Links
  const links = layout(root)
    .descendants()
    .slice(1);

  chart.selectAll('.link')
    .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      // .attr('d', d => {
      //   return `M${d.x},${d.y
      //   }C${d.x},${(d.y + d.parent.y) / 2
      //   } ${d.parent.x},${(d.y + d.parent.y) / 2
      //   } ${d.parent.x},${d.parent.y}`
      // });
      .attr('d', d => `M${d.y},${d.x
               }C${(d.y + d.parent.y) / 2},${d.x
               } ${(d.y + d.parent.y) / 2},${d.parent.x
               } ${d.parent.y},${d.parent.x}`);

  // Nodes
  const node = chart.selectAll('.node')
    .data(root.descendants())
    .enter()
      .append('g')
      .attr('class', 'node')
      // .attr('transform', d => `translate(${d.x},${d.y})`);
      .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('r', 4.5)
    .attr('fill', d => color(d.name))
    .on('mouseover', function over() {
      d3.select(this.nextSibling).style('visibility', 'visible');
    })
    .on('mouseout', function out() {
      d3.select(this.nextSibling).style('visibility', 'hidden');
    });
  //
  node.append('text')
    .classed('label', true)
    .attr('dy', '.31em')
    .attr('text-anchor', d => (d.x < 180 ? 'start' : 'end'))
    // .attr('transform', d => (d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)'))
    .text(d => (d.depth > 1 ? d.data.itemLabel : d.data.itemLabel.substr(0, 15) + (d.data.itemLabel.length > 15 ? '...' : '')))
    .style('font-size', d => (d.depth > 1 ? '0.6em' : '0.9em'))
    .style('visibility', d => (d.depth > 0 ? 'hidden' : 'visible'));
};

westerosChart.cluster = function Cluster(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros');
  const chart = this.container;

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);
  const root = stratify(data);


  const layout = d3.cluster()
    .size([500, 500]);

  const links = layout(root)
    .descendants()
    .slice(1);

  this.container.selectAll('.link')
    .data(links)
    .enter()
    .append('path')
    .classed('link', true)
    .attr('d', d => `M${d.y},${d.x
             }C${(d.y + d.parent.y) / 2},${d.x
             } ${(d.y + d.parent.y) / 2},${d.parent.x
             } ${d.parent.y},${d.parent.x}`);

  const node = this.container.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .classed('node', true)
    .attr('transform', d => `translate(${d.y},${d.x})`);

  node.append('circle')
    .attr('r', 5)
    .attr('fill', d => color(d.data.itemLabel));

  node.append('text')
    .text(d => d.data.itemLabel);
    // .attr('dx', d => d.children.length ? -8 : 8)
    // .attr('dy', d => d.depth > 1 ? 3 : 5)
    // .attr('text-anchor', d => d.children.length ? 'end' : 'start')
    // .style('font-size', d => d.depth > 1 ? '0.8em' : '1.1em');
};

westerosChart.treemap = function Treemap(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  const layout = d3.treemap()
    .size([600, 600])
    .padding(2)
    .round(true);

  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants().slice(1))
    .enter()
    .append('g')
      .attr('class', 'node');

  nodes.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', (d) => { while (d.depth > 1) d = d.parent; return color(d.data.itemLabel); });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};

westerosChart.partition = function Partition(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort(heightOrValueComparator);

  const layout = d3.partition()
    .size([600, 600])
    .padding(2)
    .round(true);

  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants().slice(1))
    .enter()
    .append('g')
      .attr('class', 'node');

  nodes.append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', (d) => { while (d.depth > 1) d = d.parent; return color(d.data.itemLabel); });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};

westerosChart.pack = function Pack(_data) {
  const data = addRoot(_data, 'itemLabel', 'fatherLabel', 'Westeros')
    .map((d, i, a) => {
      if (d.fatherLabel === 'Westeros') {
        const childrenLen = a.filter(e => e.fatherLabel === d.itemLabel).length;
        return childrenLen > 0 ? d : undefined;
      } else {
        return d;
      }
    })
    .filter(i => i);

  fixateColors(data, 'itemLabel');

  const stratify = d3.stratify()
    .parentId(d => d.fatherLabel)
    .id(d => d.itemLabel);

  const root = stratify(data)
    .sum(d => d.screentime)
    .sort(valueComparator);

  const layout = d3.pack()
    .size([600, 600])
    // .padding(2)
    // .round(true);

  layout(root);

  const nodes = this.container.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('circle')
      .attr('class', 'node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', (d) => { while (d.depth > 1) d = d.parent; return color(d.data.itemLabel); });

  nodes.call(tooltip(d => d.data.itemLabel, this.container));
};


// function partition(filterString = ' MP') {
//   const filtered = this.data.filter(d => d.EntityName.match(filterString));
//   const tree = makeTree(filtered,
//     (d, name) => d.DonorName === name,
//     d => d.EntityName,
//     d => d.EntityName || '');
//
//   fixateColors(filtered);
//
//   const partition = d3.layout.partition()
//     .value(d => d.parent.donated)
//     .sort((a, b) => d3.descending(a.parent.donated, b.parent.donated))
//     .size([2 * Math.PI, 300]);
//
//   let nodes = partition.nodes(tree);
//
//   const arc = d3.svg.arc()
//     .innerRadius(d => d.y)
//     .outerRadius(d => d.depth ? d.y + d.dy / d.depth : 0);
//
//   nodes = nodes.map((d) => {
//     d.startAngle = d.x;
//     d.endAngle = d.x + d.dx;
//
//     return d;
//   });
//
//   nodes = nodes.filter(d => d.depth);
//
//   const chart = this.chart.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
//
//   const node = chart.selectAll('g')
//     .data(nodes)
//     .enter()
//     .append('g');
//
//   node.append('path')
//   .classed('partition', true)
//   .attr({
//     d: arc,
//     fill: d => color(d.name),
//   });
//
//   node.call(tooltip(d => d.name, chart));
// }
//
// function pack(filterString = ' MP') {
//   const filtered = this.data.filter(d => d.EntityName.match(filterString));
//   const tree = makeTree(filtered,
//     (d, name) => d.DonorName === name,
//     d => d.EntityName,
//     d => d.EntityName || '');
//
//   fixateColors(filtered);
//
//   const pack = d3.layout.pack()
//           .padding(5)
//           .size([this.width / 1.5, this.height / 1.5])
//           .value(d => d.parent.donated);
//
//   const nodes = pack.nodes(tree);
//
//   this.chart.append('g')
//     .attr('transform', 'translate(100, 100)')
//     .selectAll('g')
//     .data(nodes)
//     .enter()
//     .append('circle')
//     .attr({
//       r: d => d.r,
//       cx: d => d.x,
//       cy: d => d.y,
//     })
//     .attr('fill', d => color(d.name))
//     .call(tooltip(d => d.name));
// }
//
export default westerosChart;
