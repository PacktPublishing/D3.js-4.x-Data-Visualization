/**
* Chapter 4
*/

import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { csvParseRows, csvParse } from 'd3-dsv';
import chartFactory from '../common/index';
import * as Rx from 'rxjs';

const scalesDemo = ((enabled) => {
  if (enabled) {
    const chart = chartFactory();

    (function ordinalScales() {
      const data = d3.range(30);
      const colors = d3.scaleOrdinal(d3.schemeCategory10);
      const points = d3.scalePoint()
      .domain(data)
      .range([0, chart.height])
      .padding(1.0);

      const bands = d3.scaleBand()
      .domain(data)
      .range([0, chart.width])
      .padding(0.1);

      chart.container.selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', d3.symbol()
      .type(d3.symbolCircle)
      .size(10)
    )
    .attr('transform', d => `translate(${(chart.width / 2)}, ${points(d)})`)
    .style('fill', d => colors(d));

      ['10', '20', '20b', '20c'].forEach((scheme, i) => {
        const height = 10;
        const padding = 5;
        const categoryScheme = `schemeCategory${scheme}`;
        const selector = `rect.scheme-${scheme}`;
        const categoryColor = d3.scaleOrdinal(d3[categoryScheme]);

        chart.container.selectAll(selector)
      .data(data.slice())
      .enter()
      .append('rect')
      .classed(selector, true)
      .attr('x', d => bands(d))
      .attr('y', (chart.height / 2) - ((i * height) + (padding * i)))
      .attr('width', bands.bandwidth)
      .attr('height', height)
      .style('fill', d => categoryColor(d));
      });
    }());

    (function quantitativeScales() {
      const weierstrass = (x) => {
        const a = 0.5;
      const b = (1 + 3 * Math.PI / 2) / a; // eslint-disable-line

      return d3.sum(d3.range(100).map(n => Math.pow(a, n) * Math.cos(Math.pow(b, n) * Math.PI * x))); // eslint-disable-line
      };

      const data = d3.range(-100, 100)
    .map(d => d / 200);
      const extent = d3.extent(data.map(weierstrass));
      const colors = d3.scaleOrdinal(d3.schemeCategory10);
      const x = d3.scaleLinear()
    .domain(d3.extent(data))
    .range([0, chart.width]);

      const drawSingle = line => chart.container.append('path')
    .datum(data)
    .attr('d', line)
    .style('stroke-width', 2)
    .style('fill', 'none');

      const linear = d3.scaleLinear()
    .domain(extent)
    .range([chart.height / 4, 0]);
      const line1 = d3.line()
    .x(x)
    .y(d => linear(weierstrass(d)));
      drawSingle(line1)
    .attr('transform', `translate(0, ${chart.height / 16})`)
    .style('stroke', colors(0));

      const identity = d3.scaleIdentity()
    .domain(extent);
      const line2 = line1.y(d => identity(weierstrass(d)));
      drawSingle(line2)
    .attr('transform', `translate(0, ${chart.height / 12})`)
    .style('stroke', colors(1));

      const power = d3.scalePow()
    .exponent(0.2)
    .domain(extent)
    .range([chart.height / 2, 0]);
      const line3 = line1.y(d => power(weierstrass(d)));
      drawSingle(line3)
    .attr('transform', `translate(0, ${chart.height / 8})`)
    .style('stroke', colors(2));

      const log = d3.scaleLog()
    .domain(d3.extent(data.filter(d => (d > 0 ? d : 0))))
    .range([0, chart.width]);
      const line4 = line1.x(d => (d > 0 ? log(d) : 0))
    .y(d => linear(weierstrass(d)));
      drawSingle(line4)
    .attr('transform', `translate(0, ${chart.height / 4})`)
    .style('stroke', colors(3));

      const offset = 100;
      const quantize = d3.scaleQuantize()
    .domain(extent)
    .range(d3.range(-1, 2, 0.5)
    .map(d => d * 100));
      const line5 = line1.x(x)
    .y(d => quantize(weierstrass(d)));
      drawSingle(line5)
    .attr('transform', `translate(0, ${(chart.height / 2) + offset})`)
    .style('stroke', colors(4));

      const threshold = d3.scaleThreshold()
    .domain([-1, 0, 1])
    .range([-50, 0, 50, 100]);
      const line6 = line1.x(x)
    .y(d => threshold(weierstrass(d)));
      drawSingle(line6)
    .attr('transform', `translate(0, ${(chart.height / 2) + (offset * 2)})`)
    .style('stroke', colors(5));
    }());
  }
})(false);

const ulamSpiral = ((enabled) => {
  if (!enabled) return;

  const chart = chartFactory();
  const generateSpiral = (n) => {
    const spiral = [];
    let x = 0;
    let y = 0;
    const min = [0, 0];
    const max = [0, 0];
    let add = [0, 0];
    let direction = 0;
    const directions = {
      up: [0, -1],
      left: [-1, 0],
      down: [0, 1],
      right: [1, 0],
    };
    d3.range(1, n).forEach((i) => {
      spiral.push({ x, y, n: i });
      add = directions[['up', 'left', 'down', 'right'][direction]];
      x += add[0];
      y += add[1];

      if (x < min[0]) {
        direction = (direction + 1) % 4;
        min[0] = x;
      }
      if (x > max[0]) {
        direction = (direction + 1) % 4;
        max[0] = x;
      }
      if (y < min[1]) {
        direction = (direction + 1) % 4;
        min[1] = y;
      }
      if (y > max[1]) {
        direction = (direction + 1) % 4;
        max[1] = y;
      }
    });

    return spiral;
  };

  const generatePrimes = (n) => {
    /* eslint-disable */ // I'm not even going to try to make this pass lint.
    function *numbers(start) {
      while (true) {
        yield start++;
      }
    }

    function *primes() {
      let seq = numbers(2); // Start on 2.
      let prime;

      while (true) {
        prime = seq.next().value;
        yield prime;
        seq = filter(seq, prime);
      }
    }

    function *getPrimes(count, seq) {
      while (count) {
        yield seq.next().value;
        count--;
      }
    }

    function *filter(seq, prime) {
      for (const num of seq) {
        if (num % prime !== 0) {
          yield num;
        }
      }
    }

    const results = [];
    for (let prime of getPrimes(n, primes())) {
      results.push(prime);
    }

    return results;
    /* eslint-enable */
  };

  const dot = d3.symbol().type(d3.symbolCircle).size(3);
  const center = 400;
  const l = 2;
  const x = (x, l) => center + (l * x);
  const y = (y, l) => center + (l * y);
  const primes = generatePrimes(2000);
  const sequence = generateSpiral(d3.max(primes)).filter(d => primes.indexOf(d.n) > -1);
  console.dir(sequence);
  chart.container.selectAll('path')
    .data(sequence)
    .enter()
    .append('path')
    .attr('transform', d => `translate(${x(d.x, l)}, ${y(d.y, l)})`)
    .attr('d', dot);

  const scale = 8;
  const regions = d3.nest()
    .key(d => Math.floor(d.x / scale))
    .key(d => Math.floor(d.y / scale))
    .rollup(d => d.length)
    .map(sequence);

  const values = d3.merge(d3.keys(regions).map(_x => d3.values(regions[_x])));
  const median = d3.median(values);
  const extent = d3.extent(values);
  const shades = (extent[1] - extent[0]) / 2;

  regions.each((_x, _xKey) => {
    _x.each((_y, _yKey) => {
      let color,
        red = '#e23c22',
        green = '#497c36';
      if (_y > median) {
        color = d3.rgb(green).brighter(_y / shades);
      } else {
        color = d3.rgb(red).darker(_y / shades);
      }
      chart.container.append('rect')
        .attr('x', x(_xKey, l * scale))
        .attr('y', y(_yKey, l * scale))
        .attr('width', l * scale)
        .attr('height', l * scale)
        .style('fill', color)
        .style('fill-opacity', 0.9);
    });
  });
})(false);

const observableDemo = ((enabled) => {
  Rx.Observable
    .fromPromise(fetch('/data/cultural.json'))
    .flatMap(v => v.json())
    .subscribe(
      (data) => {
        console.dir(data);
      },
      (error) => {
        console.dir(error);
      },
      () => {
        console.log('complete!');
      }
    );
})(true);

const geoDemo = (async (enabled) => {
  if (enabled) {
    const chart = chartFactory();
    const projection = d3.geoEquirectangular()
    .center([-50, 56])
    .scale(200);

    const addRenditions = (airportData, renditions) => {
      const airports = csvParseRows(airportData)
        .reduce((obj, airport) => {
          obj[airport[4]] = {
            lat: airport[6],
            lon: airport[7],
          };

          return obj;
        }, {});

      const routes = csvParse(renditions).map((v) => {
        const dep = v['Departure Airport'];
        const arr = v['Arrival Airport'];
        return {
          from: airports[dep],
          to: airports[arr],
        };
      })
        .filter(v => v.to && v.from)
        .slice(0, 100);

      chart.container.selectAll('.route')
        .data(routes)
        .enter()
        .append('line')
        .attr('x1', d => projection([d.from.lon, d.from.lat])[0])
        .attr('y1', d => projection([d.from.lon, d.from.lat])[1])
        .attr('x2', d => projection([d.to.lon, d.to.lat])[0])
        .attr('y2', d => projection([d.to.lon, d.to.lat])[1])
        .classed('route', true);
    };

    const addToMap = (collection, key) => chart.container.append('g')
        .selectAll('path')
        .data(topojson.feature(collection, collection.objects[key]).features)
        .enter()
        .append('path')
        .attr('d', d3.geoPath().projection(projection));

    const draw = (worldData) => {
      const [sea, land, cultural] = worldData;
      // addToMap(sea, 'water')
      //   .classed('water', true);
      addToMap(land, 'land')
        .classed('land', true);
      // addToMap(cultural, 'ne_50m_admin_0_boundary_lines_land')
      //   .classed('boundary', true);
      // addToMap(cultural, 'ne_50m_urban_areas')
      //   .classed('urban', true);

      chart.svg.node().classList.add('map');
    };

    const world = await Promise.all([
      (await fetch('data/water.json')).json(),
      (await fetch('data/land.json')).json(),
      (await fetch('data/cultural.json')).json(),
    ]);

    draw(world);
    addRenditions(
      await (await fetch('data/airports.dat')).text(),
      await (await fetch('data/renditions.csv')).text()
    );
  }
})(true);

export const __hotReload = true; // eslint-disable-line
