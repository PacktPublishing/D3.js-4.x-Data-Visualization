import * as d3 from 'd3';
import interactivePrisonChart from './buttonChart';

const brushablePrisonPopulationChart = Object.create(interactivePrisonChart);

// brushablePrisonPopulationChart.x
//   .padding(0.1)
//   .range([brushablePrisonPopulationChart.margin.left, brushablePrisonPopulationChart.width]);
//
// brushablePrisonPopulationChart.y
//   .range([brushablePrisonPopulationChart.height - brushablePrisonPopulationChart.margin.bottom, brushablePrisonPopulationChart.margin.top]);


brushablePrisonPopulationChart.addBrushBehavior = function () {
  this.brush = d3.brush();
  this.container.append('g')
    .classed('brush', true)
    .call(this.brush
      .on('brush', this.brushmove.bind(this))
      .on('end', this.brushend.bind(this)));

  this.update();
};

brushablePrisonPopulationChart.brushmove = function () {
  const e = d3.event.selection;
  if (e) {
    d3.selectAll('.bar').classed('selected', d =>
      e[0][0] <= this.x(d.year)
      && this.x(d.year) <= e[1][0]
    );
  }
};

brushablePrisonPopulationChart.brushend = function () {
  if (!d3.event.sourceEvent) return; // Only transition after input.
  if (!d3.event.selection) return; // Ignore empty selections.
  const selected = d3.selectAll('.selected');
  const data = selected.data();

  // Clear brush object
  d3.select('g.brush').call(d3.event.target.move, null);

  // Zoom to selection
  if (data.length >= 1) {
    const start = data.shift();
    const end = data.pop();

    this.update(this.data.filter(d =>
      d3.range(start.year, end.year + 1).indexOf(Number(d.year)) > -1));

    const hitbox = this.svg
      .append('rect')
      .classed('hitbox', true)
      .attr('width', this.svg.attr('width'))
      .attr('height', this.svg.attr('height'))
      .attr('fill-opacity', 0);

    hitbox.on('contextmenu', this.rightclick.bind(this));
  }
};

brushablePrisonPopulationChart.rightclick = function () {
  d3.event.preventDefault();
  this.clearSelected();
  this.update();
  this.svg.select('.hitbox').remove();
};

export default brushablePrisonPopulationChart;
