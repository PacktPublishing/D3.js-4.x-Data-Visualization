import * as d3 from 'd3';
import chartFactory from '../common/index';
import tableFactory from './table-factory';

export default async function lifeExpectancyTable() {
  const getData = async () => {
    try {
      const response = await fetch('data/who-gho-life-expectancy.json');
      const raw = await response.json();
      return raw.fact.filter(d => d.dim.GHO === 'Life expectancy at birth (years)'
        && d.dim.SEX === 'Both sexes' && d.dim.YEAR === '2014')
        .map(d => [
          d.dim.COUNTRY,
          d.Value,
        ]);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  const data = await getData();
  data.unshift(['Country', 'Life expectancy (years from birth)']);

  return tableFactory(data).table
    .selectAll('tr')
    .filter(i => i)
    .sort(([, yearsA], [, yearsB]) => yearsA - yearsB);
}

export function renderSVGStuff() {
  const chart = chartFactory();

  const text = chart.container.append('text')
    .text("Ceci n'est pas un trajet!")
    .attr('x', 50)
    .attr('y', 200)
    .attr('text-anchor', 'start');

  const circle = chart.container.append('circle')
    .attr('cx', 350)
    .attr('cy', 250)
    .attr('r', 100)
    .attr('fill', 'green')
    .attr('stroke', 'steelblue')
    .attr('fill-opacity', 0.5)
    .attr('stroke-width', 2);

  const ellipses = chart.container.append('ellipse')
    .attr('cx', 350)
    .attr('cy', 250)
    .attr('rx', 150)
    .attr('ry', 70)
    .attr('fill', 'green')
    .attr('fill-opacity', 0.3)
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 0.7);

  chart.container.append('ellipse')
    .attr('cx', 350)
    .attr('cy', 250)
    .attr('rx', 80)
    .attr('ry', 7);

  const line = chart.container.append('line')
    .attr('x1', 10)
    .attr('y1', 10)
    .attr('x2', 100)
    .attr('y2', 100)
    .attr('stroke', 'blue')
    .attr('stroke-width', 3);

  const rect = chart.container.append('rect')
    .attr('x', 200)
    .attr('y', 50)
    .attr('width', 300)
    .attr('height', 400)
    .lower();

  rect.attr('stroke', 'green')
    .attr('stroke-width', 0.5)
    .attr('fill', 'white')
    .attr('rx', 20)
    .attr('ry', 4);

  // chart.container.selectAll('ellipse, circle')
  //   .attr('transform', 'translate(150, 0)');
  //
  // chart.container.selectAll('ellipse, circle')
  //     .attr('transform', 'translate(150, 0) rotate(-45, 350, 250)');

  // chart.container.selectAll('ellipse, circle')
  //   .attr('transform', 'translate(150, 0) rotate(-45, 350, 250) scale(1.2)');
  //
  chart.container.selectAll('ellipse, circle')
    .attr('transform', `translate(150, 0)
      scale(1.2)
      translate(-250, 0)
      rotate(-45, ${350 / 1.2}, ${250 / 1.2})`);
      // skewY(20)`);

  const path = chart.container.append('path')
    .attr('d', 'M 100 100 L 300 100 L 200 300 z')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'red')
    .attr('fill-opacity', 0.7);

  // chart.container.selectAll('*')
  //   .remove();
}

// renderSVGStuff();
