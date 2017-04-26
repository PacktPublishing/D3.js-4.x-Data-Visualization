import * as d3 from 'd3';
import chartFactory from '../common';

function spirograph(enabled) {
  if (!enabled) return;

  const chart = chartFactory();

  const position = (t) => {
    const a = 80;
    const b = 1;
    const c = 1;
    const d = 80;

    return {
      x: Math.cos(a * t) - Math.pow(Math.cos(b * t), 3),
      y: Math.sin(c * t) - Math.pow(Math.sin(d * t), 3),
    };
  };

  const tScale = d3.scaleLinear()
    .domain([500, 25000])
    .range([0, 2 * Math.PI]);

  const x = d3.scaleLinear()
    .domain([-2, 2])
    .range([100, chart.width - 100]);

  const y = d3.scaleLinear()
    .domain([-2, 2])
    .range([chart.height - 100, 100]);

  const brush = chart.container.append('circle').attr('r', 4);
  let previous = position(0);

  const step = (time) => { // eslint-disable-line consistent-return
    if (time > tScale.domain()[1]) {
      return true;
    }

    const t = tScale(time);
    const pos = position(t);

    brush
      .attr('cx', x(pos.x))
      .attr('cy', y(pos.y));

    chart.container.append('line')
      .attr('x1', x(previous.x))
      .attr('y1', y(previous.y))
      .attr('x2', x(pos.x))
      .attr('y2', y(pos.y))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.3);

    previous = pos;
  };

  d3.timer(step, 500);
}

export default spirograph;
