import * as d3 from 'd3';
import PrisonPopulationChart from './prisonChart';

const draggablePrisonPopulationChart = Object.create(PrisonPopulationChart);

draggablePrisonPopulationChart.addDragBehavior = function addDrag() {
  this.x.range([0, this.width * 4]);

  this.update();

  const bars = d3.select('.bars');
  bars.attr('transform', 'translate(0,0)');

  const dragContainer = this.container.append('rect')
    .classed('bar-container', true)
    .attr('width', this.svg.node().getBBox().width)
    .attr('height', this.svg.node().getBBox().height)
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill-opacity', 0);

  const xAxisTranslateY = d3.select('.axis.x').node().transform.baseVal[0].matrix.f;

  const drag = d3.drag().on('drag', () => {
    const barsTranslateX = bars.node().transform.baseVal[0].matrix.e;
    const barsWidth = bars.node().getBBox().width;
    const xAxisTranslateX = d3.select('.axis.x').node().transform.baseVal[0].matrix.e;
    const dx = d3.event.dx;

    if (barsTranslateX + dx < 0 && barsTranslateX + dx > -barsWidth + this.innerWidth()) {
      bars.attr('transform', `translate(${barsTranslateX + dx}, 0)`);
      d3.select('.axis.x').attr('transform',
        `translate(${xAxisTranslateX + d3.event.dx}, ${xAxisTranslateY})`);
    }
  });

  dragContainer.call(drag);
};

export default draggablePrisonPopulationChart;
