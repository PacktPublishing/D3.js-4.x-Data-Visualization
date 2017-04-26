import * as d3 from 'd3';
import scenes from '../../data/prison_scenes.json';
import PrisonPopulationChart from './prisonChart';

const buttonPrisonPopulationChart = Object.create(PrisonPopulationChart);

buttonPrisonPopulationChart.scenes = scenes;

buttonPrisonPopulationChart.addUIElements = function addUI() {
  // Add some room for buttons
  this.height -= 100;
  this.svg.attr(
    'height',
    +this.svg.attr('height') - 100
  );

  // Needs to update y scale/axis
  this.y.range([this.innerHeight(), 0]);
  this.yAxisElement.call(this.yAxis);

  // ...and the x scale/axis
  this.xAxisElement.attr('transform', `translate(0, ${this.innerHeight()})`);

  this.buttons = d3.select('body')
    .append('div')
    .classed('buttons', true)
      .selectAll('.button')
      .data(this.scenes)
      .enter()
      .append('button')
      .classed('scene', true)
      .text(d => d.label)
      .on('click', d => this.loadScene(d))
      .on('touchstart', d => this.loadScene(d));

  this.words = d3.select('body').append('div');
  this.words.classed('words', true);
  this.loadScene(this.scenes[0]);
};

buttonPrisonPopulationChart.clearSelected = function clearSelected() {
  d3.timeout(() => {
    d3.selectAll('.selected').classed('selected', false);
  }, this.transitionSpeed);
};

buttonPrisonPopulationChart.selectBars = function selectBars(years) {
  d3.timeout(() => {
    d3.select('.bars').selectAll('.bar')
      .filter(d => years.indexOf(Number(d.year)) > -1)
      .classed('selected', true);
  }, this.transitionSpeed);
};

buttonPrisonPopulationChart.loadScene = function loadScene(scene) {
  const range = d3.range(scene.domain[0], scene.domain[1]);

  this.update(this.data.filter(d => range.indexOf(Number(d.year)) > -1));

  this.clearSelected();

  if (scene.selected) {
    const selected = scene.selected.range
      ? d3.range(...scene.selected.range) : scene.selected;
    this.selectBars(selected);
  }

  this.words.html(scene.copy);

  d3.selectAll('button.active').classed('active', false);
  d3.select((d3.event && d3.event.target) || this.buttons.node()).classed('active', true);
};

export default buttonPrisonPopulationChart;
