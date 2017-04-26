import { select as d3Select } from 'd3-selection';

const protoChart = {
  width: window.innerWidth,
  height: window.innerHeight,
  margin: {
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
  },
};

// export default Object.create(protoChart);

export default function chartFactory(opts, proto = protoChart) {
  const chart = Object.assign({}, proto);
  Object.entries(opts)
    .forEach(([key, val]) => {
      chart[key] = Object(val) === val ? Object.assign({}, chart[key], val) : val;
    });

  chart.svg = d3Select('body')
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width - chart.margin.right)
    .attr('height', chart.height - chart.margin.bottom);

  chart.container = chart.svg.append('g')
    .attr('id', 'container')
    .attr('transform', `translate(${chart.margin.left}, ${chart.margin.top})`);

  return chart;
}
