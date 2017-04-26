import * as d3 from 'd3';
import chartFactory from '../common';

function easingChart(enabled) {
  if (!enabled) return;
  const chart = chartFactory();

  const easings = [
    'easeLinear', 'easePolyIn(4)', 'easeQuadIn', 'easeCubicIn', 'easeSinIn', 'easeExpIn',
    'easeCircleIn', 'easeElasticIn(10, -5)', 'easeBackIn(0.5)', 'easeBounceIn', 'easeCubicIn',
    'easeCubicOut', 'easeCubicInOut'];
  const y = d3.scaleBand()
    .domain(easings)
    .range([50, 500]);
  const svg = chart.container;

  easings.forEach((easing) => {
    const transition = svg.append('circle')
      .attr('cx', 130)
      .attr('cy', y(easing))
      .attr('r', (y.bandwidth() / 2) - 5)
      .transition()
      .delay(400)
      .duration(1500)
      .attr('cx', 400);

    if (easing.indexOf('(') > -1) {
      const args = easing.match(/[0-9]+/g);
      const funcName = easing.match(/^[a-z]+/i).shift();
      const type = d3[funcName];
      transition.ease(type, args[0], args[1]);
    } else { // Use d3.easeEASINGNAME symbol
      const type = d3[easing];
      transition.ease(type);
    }

    svg.append('text')
      .text(easing)
      .attr('x', 10)
      .attr('y', y(easing) + 5);
  });
}

export default easingChart;
