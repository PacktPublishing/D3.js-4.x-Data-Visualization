import * as d3 from 'd3';
import { csvParse } from 'd3-dsv';
import chartFactory from '../common';
import './prisonChart.css';

const prisonChart = chartFactory({
  margin: { left: 50, right: 0, top: 50, bottom: 50 },
  padding: 20,
  transitionSpeed: 500,
});

prisonChart.resolveData = async function resolveData() {
  return csvParse(await (await fetch('data/uk_prison_data_1900-2015.csv')).text());
};

prisonChart.init = async function init() {
  this.data = this.data || await this.resolveData();
  this.innerHeight = () => this.height - (this.margin.bottom + this.margin.top + this.padding);
  this.innerWidth = () => this.width - (this.margin.right + this.margin.left + this.padding);

  this.x = d3.scaleBand()
    .range([0, this.innerWidth()])
    .padding(0.2);

  this.y = d3.scaleLinear()
    .range([this.innerHeight(), 0]);

  this.x.domain(this.data.map(d => d.year));
  this.y.domain([0, d3.max(this.data, d => Number(d.total))]);

  this.xAxis = d3.axisBottom().scale(this.x)
    .tickValues(this.x.domain().filter((d, i) => !(i % 5)));
  this.yAxis = d3.axisLeft().scale(this.y);

  this.xAxisElement = this.container.append('g')
      .classed('axis x', true)
      .attr('transform', `translate(0, ${this.innerHeight()})`)
      .call(this.xAxis);

  this.yAxisElement = this.container.append('g')
      .classed('axis y', true)
      .call(this.yAxis);

  this.barsContainer = this.container.append('g')
    .classed('bars', true);
};

prisonChart.update = function update(_data) {
  const data = _data || this.data;
  const TRANSITION_SPEED = this.transitionSpeed;

  // Update
  const bars = d3.select('.bars').selectAll('.bar');
  const barsJoin = bars.data(data, d => d.year);

  // Update scales
  this.x.domain(data.map(d => +d.year));
  this.xAxis.tickValues(this.x.domain().filter((d, i, a) => (a.length > 10 ? !(i % 5) : true)));
  d3.timeout(this.xAxis.bind(this, this.xAxisElement), TRANSITION_SPEED * 2);

  // Remove
  barsJoin.exit()
    .transition()
    .duration(TRANSITION_SPEED)
    .attr('height', 0)
    .attr('y', this.y(0))
    .remove();

  const newBars = barsJoin.enter() // Enter
    .append('rect')
    .attr('x', d => this.x(+d.year))
    .classed('bar', true);

  barsJoin.merge(newBars) // Update
    .transition()
    .duration(TRANSITION_SPEED)
    .attr('height', 0)
    .attr('y', this.y(0))
    .transition()
    .attr('x', d => this.x(+d.year))
    .attr('width', this.x.bandwidth())
    .transition()
    .attr('y', d => this.y(+d.total))
    .attr('height', d => this.innerHeight() - this.y(+d.total));
};

export default prisonChart;
