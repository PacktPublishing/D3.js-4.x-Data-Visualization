/**
 * Chapter 3 examples
 */

import * as d3 from 'd3';
import chartFactory from '../common/index';

export function yayPaths() {
  const chart = chartFactory();
  const path = chart.container.append('path')
  .attr('d', 'M 10 500 L 300 100 L 300 500 M 300 100 l 100 0 M 155 300 l 245 0 M 300 500 l 100 0')
  .attr('stroke', 'black')
  .attr('stroke-width', 2)
  .attr('fill', 'transparent');

  // const sine = d3.range(0, 10)
  // .map(k => [0.5 * k * Math.PI, Math.sin(0.5 * k * Math.PI)]);
  //
  // const x = d3.scaleLinear()
  // .range([
  //   0,
  //   (chart.width / 2) - (chart.margin.left + chart.margin.right),
  // ])
  // .domain(d3.extent(sine, d => d[0]));
  //
  // const y = d3.scaleLinear()
  // .range([
  //   (chart.height / 2) - (chart.margin.top + chart.margin.bottom),
  //   0,
  // ])
  // .domain([-1, 1]);
  //
  // const line = d3.line()
  // .x(d => x(d[0]))
  // .y(d => y(d[1]));
  //
  // const g = chart.container.append('g');
  //
  // g.append('path')
  // .datum(sine)
  // .attr('d', line)
  // .attr('stroke', 'steelblue')
  // .attr('stroke-width', 2)
  // .attr('fill', 'none');
  //
  // g.append('path')
  // .datum(sine)
  // .attr('d', line.curve(d3.curveStepBefore))
  // .attr('stroke', 'black')
  // .attr('stroke-width', 1)
  // .attr('fill', 'none');
  //
  // const g2 = chart.container.append('g')
  // .attr('transform',
  // `translate(${(chart.width / 2) + (chart.margin.left + chart.margin.right)},
  // ${chart.margin.top})`);
  //
  // const area = d3.area()
  // .x(d => x(d[0]))
  // .y0(chart.height / 2)
  // .y1(d => y(d[1]))
  // .curve(d3.curveBasis);
  //
  // g2.append('path')
  // .datum(sine)
  // .attr('d', area)
  // .attr('fill', 'steelblue')
  // .attr('fill-opacity', 0.4);
  //
  // g2.append('path')
  // .datum(sine)
  // .attr('d', line.curve(d3.curveBasis))
  // .attr('stroke', 'steelblue')
  // .attr('stroke-width', 2)
  // .attr('fill', 'none');
  //
  // const arc = d3.arc();
  // const g3 = chart.container.append('g')
  // .attr('transform', `translate(${chart.margin.left + chart.margin.right},
  //   ${(chart.height / 2) + (chart.margin.top + chart.margin.bottom)})`);
  //
  //   g3.append('path')
  //   .attr('d',
  //   arc({
  //     outerRadius: 100,
  //     innerRadius: 50,
  //     startAngle: -Math.PI * 0.25,
  //     endAngle: Math.PI * 0.25,
  //   }))
  //   .attr('transform', 'translate(150, 150)')
  //   .attr('fill', 'lightslategrey');
  //
  //
  //   const symbols = d3.symbol()
  //   .type(d => (d[1] > 0 ? d3.symbolTriangle : d3.symbolDiamond))
  //   .size((d, i) => (i % 2 ? 0 : 64));
  //
  //   g2.selectAll('path')
  //   .data(sine)
  //   .enter()
  //   .append('path')
  //   .attr('d', symbols)
  //   .attr('stroke', 'steelblue')
  //   .attr('stroke-width', 2)
  //   .attr('fill', 'white')
  //   .attr('transform', d => `translate(${x(d[0])},${y(d[1])})`);
    //
    // g3.append('g')
    //   .selectAll('path')
    //   .data([{
    //     source: {
    //       radius: 50,
    //       startAngle: -Math.PI * 0.30,
    //       endAngle: -Math.PI * 0.20,
    //     },
    //     target: {
    //       radius: 50,
    //       startAngle: Math.PI * 0.30,
    //       endAngle: Math.PI * 0.30,
    //     },
    //   }])
    //     .enter()
    //     .append('path')
    //     .attr('d', d3.ribbon());
    //
    // const data = d3.zip(d3.range(0, 12), d3.shuffle(d3.range(0, 12)));
    // const colors = ['linen', 'lightsteelblue', 'lightcyan', 'lavender', 'honeydew', 'gainsboro'];
    // const ribbon = d3.ribbon()
    //   .source(d => d[0])
    //   .target(d => d[1])
    //   .radius(150)
    //   .startAngle(d => -2 * Math.PI * (1 / data.length) * d)
    //   .endAngle(d => -2 * Math.PI * (1 / data.length) * ((d - 1) % data.length));
    //
    // g3.append('g')
    //   .attr('transform', 'translate(300, 200)')
    //   .selectAll('path')
    //   .data(data)
    //   .enter()
    //   .append('path')
    //   .attr('d', ribbon)
    //   .attr('fill', (d, i) => colors[i % colors.length])
    //   .attr('stroke', (d, i) => colors[(i + 1) % colors.length]);
}

yayPaths();

export function axisDemos() {
    const chart = chartFactory({
      margin: { top: 10, bottom: 10, left: 10, right: 10 },
    });

    const amount = 100;

    const x = d3.scaleLinear()
    .domain([0, amount])
    .range([
      0,
      chart.width - chart.margin.right - chart.margin.left - 20,
    ]);

    /* eslint-disable newline-per-chained-call */
    const axes = [
      d3.axisBottom().scale(x),
      d3.axisTop().scale(x).ticks(5),
      d3.axisBottom().scale(x).tickSize(10, 5, 10),
      d3.axisTop().scale(x).tickValues([0, 20, 50, 70, 100])
      .tickFormat((d, i) => ['a', 'e', 'i', 'o', 'u'][i]),
    ];
    /* eslint-enable */

    axes.forEach((axis, i) =>
    chart.container.append('g')
    .data(d3.range(0, amount))
    .classed('trippy', i % 2)
    .attr('transform', `translate(0,${(i * 50) + chart.margin.top})`)
    .call(axis)
  );
}

// axisDemos();

export function colorWheels() {
  const chart = chartFactory();
  const rings = 15;
  const colors = d3.schemeCategory20b;
  const angle = d3.scaleLinear()
  .domain([0, 20])
  .range([0, 2*Math.PI]);

  const arc = d3.arc()
  .innerRadius(d => d*50/rings)
  .outerRadius(d => 50+d*50/rings)
  .startAngle((d, i, j) => angle(j))
  .endAngle((d, i, j) => angle(j+1));

  const shade = {
    darker: (d, j) => d3.rgb(colors[j])
    .darker(d / rings),
    brighter: (d, j) => d3.rgb(colors[j])
    .brighter(d / rings)
  };

  [
    [100, 100, shade.darker],
    [300, 100, shade.brighter]
  ].forEach(conf =>
    chart.container.append('g')
    .attr('transform', `translate(${conf[0]}, ${conf[1]})`)
    .selectAll('g')
    .data(colors)
    .enter()
    .append('g')
    .selectAll('path')
    .data(d => d3.range(0, rings))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i, j) => conf[2](d, j))
  );
}

// colorWheels();
