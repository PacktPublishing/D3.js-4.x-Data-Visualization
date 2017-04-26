import * as d3 from 'd3';

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

export default function chartFactory(opts, proto = protoChart) {
  const chart = Object.assign({}, proto, opts);

  chart.svg = d3.select('body')
    .append('svg')
    .attr('id', chart.id || 'chart')
    .attr('width', chart.width - chart.margin.right)
    .attr('height', chart.height - chart.margin.bottom);

  chart.container = chart.svg.append('g')
    .attr('id', 'container')
    .attr('transform', `translate(${chart.margin.left}, ${chart.margin.top})`);

  return chart;
}

export function addRoot(data, itemKey, parentKey, joinValue) {
  data.forEach((d) => { d[parentKey] = d[parentKey] || joinValue; });
  data.push({
    [parentKey]: '',
    [itemKey]: joinValue,
  });

  return data;
}

export function linkHorizontal(d) {
  return "M" + d.source.x + "," + d.source.y
      + "C" + d.source.x +  "," + (d.source.y + d.target.y) / 2
      + " " + d.target.x + "," + (d.source.y + d.target.y) / 2
      + " " + d.target.x + "," + d.target.y;
}

export function linkVertical(d) {
  return "M" + d.source.x + "," + d.source.y
      + "C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
      + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y
      + " " + d.target.x + "," + d.target.y;
}

// export function addRoot(data, parentKey, parentValue) {
//   return {
//     [parentKey]: parentValue,
//     children: data,
//   };
// }

export const uniques = (data, name) => data.reduce(
  (uniqueValues, d) => {
    uniqueValues.push((uniqueValues.indexOf(name(d)) < 0 ? name(d) : undefined));
    return uniqueValues;
  }, [])
  .filter(i => i); // Filter by identity

// export function uniques(data, name) {
//   const uniques = [];
//   data.forEach((d) => {
//     if (uniques.indexOf(name(d)) < 0) {
//       uniques.push(name(d));
//     }
//   });
//   return uniques;
// }

export function nameId(data, name) {
  const uniqueNames = uniques(data, name);
  return d3.scaleOrdinal()
    .domain(uniqueNames)
    .range(d3.range(uniqueNames.length));
}

export function binPerName(data, name) {
  const nameIds = nameId(data, name);
  const histogram = d3.layout.histogram()
    .bins(nameIds.range())
    .value(d => nameIds(name(d)));

  return histogram(data);
}

// export const colorScale = d3.scaleOrdinal().range(['#EF3B39', '#FFCD05', '#69C9CA', '#666699', '#CC3366',
//   '#0099CC', '#999999', '#FBF5A2', '#6FE4D0', '#009966', '#C1272D', '#F79420', '#445CA9',
//   '#A67C52', '#016735', '#F1AAAF', '#C9A8E2', '#F190AC', '#7BD2EA',
//   '#DBD6B6']);
export const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

export function fixateColors(data, key) {
  colorScale.domain(uniques(data, d => d[key]));
}

export function tickAngle(d) {
  const midAngle = (d.endAngle - d.startAngle) / 2;
  return ((midAngle + d.startAngle) / Math.PI) * (180 - 90);
}

export function arcLabels(text, radius) {
  return (selection) => {
    selection.append('text')
      .text(text)
      .attr('text-anchor', d => (tickAngle(d) > 100 ? 'end' : 'start'))
      .attr('transform', (d) => {
        const degrees = tickAngle(d);
        let turn = `rotate(${degrees}) translate(${radius(d) + 10}, 0)`;
        if (degrees > 100) {
          turn += 'rotate(180)';
        }
        return turn;
      });
  };
}

export function tooltip(text, chart) {
  return (selection) => {
    function mouseover(d) {
      const path = d3.select(this);
      path.classed('highlighted', true);

      const mouse = d3.mouse(chart.node());
      const tool = chart.append('g')
        .attr('id', 'tooltip')
        .attr('transform', `translate(${mouse[0] + 5},${mouse[1] + 10})`);

      const textNode = tool.append('text')
        .text(text(d))
        .attr('fill', 'black')
        .node();

      tool.append('rect')
        .attr('height', textNode.getBBox().height)
        .attr('width', textNode.getBBox().width)
        .style('fill', 'rgba(255, 255, 255, 0.6)')
        .attr('transform', 'translate(0, -16)');

      tool.select('text')
        .remove();

      tool.append('text').text(text(d));
    }

    function mousemove() {
      const mouse = d3.mouse(chart.node());
      d3.select('#tooltip')
        .attr('transform', `translate(${mouse[0] + 15},${mouse[1] + 20})`);
    }

    function mouseout() {
      const path = d3.select(this);
      path.classed('highlighted', false);
      d3.select('#tooltip').remove();
    }

    selection.on('mouseover.tooltip', mouseover)
      .on('mousemove.tooltip', mousemove)
      .on('mouseout.tooltip', mouseout);
  };
}

export function allUniqueNames(data, sourceKey = 'source', targetKey = 'target') {
  const sources = uniques(data, d => d[sourceKey]);
  const targets = uniques(data, d => d[targetKey]);
  return uniques(sources.concat(targets), d => d);
}

export function connectionMatrix(data, sourceKey = 'source', targetKey = 'target', valueKey = 'value') {
  const nameIds = nameId(allUniqueNames(data, 'Source', 'Target'), d => d);
  const uniqueIds = nameIds.domain();
  const matrix = d3.range(uniqueIds.length).map(() => d3.range(uniqueIds.length).map(() => 1));
  data.forEach((d) => {
    matrix[nameIds(d[sourceKey])][nameIds(d[targetKey])] += Number(d[valueKey]);
  });

  return matrix;
}

export function makeTree(data, filterByDonor, name1, name2) {
  const tree = { name: 'Donations', children: [] };
  const uniqueNames = uniques(data, d => d.DonorName);

  tree.children = uniqueNames.map((name) => {
    const donatedTo = data.filter(d => filterByDonor(d, name));
    const donationsValue = donatedTo.reduce((last, curr) => {
      const value = Number(curr.Value.replace(/[^\d.]*/g, ''));
      return value ? last + value : last;
    }, 0);

    return {
      name,
      donated: donationsValue,
      children: donatedTo.map(d => ({
        name: name2(d),
        count: 0,
        children: [],
      })),
    };
  });

  return tree;
}

// /**
//  * Returns whether a point is inside a polygon.
//  * The following function is taken from https://github.com/substack/point-in-polygon/
//  *
//  * Based on a ray-casting algorithm from
//  * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
//  *
//  * @param  {Array}                 point      An array with x and y coordinates of a point.
//  *                                            Can also be lon/lat.
//  *
//  * @param  {Array<Array<Number>>}  polygon    The polygon as an array of arrays containing x and y
//  *                                            coordinates. Whether the point is inside the polygon
//  *                                             or not.
//  * @return {Boolean}
//  */
// export function isInside(point, polygon) {
//   const x = Number(point[0]);
//   const y = Number(point[1]);
//
//   let inside = false;
//   for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//     const xi = polygon[i][0];
//     const yi = polygon[i][1];
//     const xj = polygon[j][0];
//     const yj = polygon[j][1];
//
//     // I think I've gotten the order of ops correct.
//     const intersect = ((yi > y) !== (yj > y)) && (x < (((xj - xi) * (y - yi)) / (yj - yi)) + xi);
//     // const intersect = ((yi > y) != (yj > y))
//     //       && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//     if (intersect) inside = !inside;
//   }
//
//   return inside;
// }
//
// /**
//  * Find the nearest point using Voronoi geom
//  * @param  {String}               location Comma-separated lat/lng string
//  * @param  {Array<Array<Number>>} points   An array of arrays containing points
//  * @return {Object|Void}                   The nearest point to location
//  * @throws {Error}                         Will throw an error if point not found.
//  */
// export function nearestVoronoi(location, points, returnEquirectangular = true) {
//   let nearest = {};
//   const projection = d3.geo.equirectangular();
//
//   const locationArray = location.split(/,\s?/);
//
//   const voronoi = d3.geom.voronoi(
//     points.map((point) => {
//       const projected = returnEquirectangular ?
//         projection([point.longitude, point.latitude]) :
//         [point.longitude, point.latitude];
//       return [projected[0], projected[1], point];
//     }))
//     .filter(d => d);
//
//   voronoi.forEach((region) => {
//     if (isInside(
//       returnEquirectangular ?
//         projection([locationArray[1], locationArray[0]]) :
//         [locationArray[1], locationArray[0]], region)) {
//       nearest = {
//         point: region.point[2],
//         region,
//       };
//     }
//   });
//
//   if (nearest === {}) throw new Error('Nearest not findable');
//   else return nearest;
// }
//
// export function initTooltip() {
//   const body = d3.select('body');
//   const tooltip = body.select('#tooltip');
//   if (!tooltip.size()) body.append('div').attr('id', 'tooltip');
//
//   return tooltip;
// }

export const heightOrValueComparator = (a, b) => b.height - a.height || b.value - a.value;
export const valueComparator = (a, b) => b.value - a.value;

export const descendantsDarker = (d, color, invert = false, dk = 5) =>
d3.color(color(d.ancestors()[d.ancestors().length - 2].id.split(' ').pop()))[invert ? 'brighter' : 'darker'](d.depth / dk);


// // Adapted from https://github.com/d3/d3-plugins/blob/master/graph/graph.js#L88
// export const computeAdjacencyMatrix = (links, sourceKey = 'source', targetKey = 'target', valueKey = 'value') => {
//   const matrix = [];
//   const n = links.length;
//   const max = d3.max(links, d => d3.max([d[sourceKey], d[targetKey]]));
//
//   // zero matrix
//   let i = -1; while (++i <= max) {
//     matrix[i] = [];
//     let j = -1; while (++j <= max) {
//       matrix[i][j] = 0;
//     }
//   }
//
//   i = -1; while (++i < n) {
//     try {
//       matrix[links[i][sourceKey]][links[i][targetKey]] = links[i][valueKey];
//     } catch (e) {
//       console.error(e);
//     }
//
//   }
//
//   return matrix;
// };
