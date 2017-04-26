import * as d3 from 'd3';
import '../chapter4';

const zoomMap = {};

const NE_SCALE = 200;
const projection = d3.geoEquirectangular()
  .center([-50, 56])
  .scale(NE_SCALE);

zoomMap.addZoomBehavior = () => {
  const chart = d3.select('#chart');

  const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', zoomMap.onZoom);

  const center = projection(projection.center());

  chart.call(zoom)
    .call(zoom.transform, d3.zoomIdentity
    .translate(center[0], center[1])
    );
};

zoomMap.onZoom = () => {
  const { x, y, k } = d3.event.transform;
  console.log(x, y);
  projection
    .scale(k * NE_SCALE)
    .translate([x, y]);

  d3.selectAll('path')
  .attr('d', d3.geoPath().projection(projection));

  d3.selectAll('line.route')
    .attr('x1', d => projection([d.from.lon, d.from.lat])[0])
    .attr('y1', d => projection([d.from.lon, d.from.lat])[1])
    .attr('x2', d => projection([d.to.lon, d.to.lat])[0])
    .attr('y2', d => projection([d.to.lon, d.to.lat])[1]);
};

zoomMap.addZoomBehaviorTransform = () => {
  const chart = d3.select('#chart');

  const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', zoomMap.onZoomTransform);

  chart.call(zoom);
};

zoomMap.onZoomTransform = () => {
  const container = d3.select('#container');
  container.attr('transform', d3.event.transform);
  container.selectAll('path')
    .style('stroke-width', 1 / d3.event.transform.k);
};

export default zoomMap;
