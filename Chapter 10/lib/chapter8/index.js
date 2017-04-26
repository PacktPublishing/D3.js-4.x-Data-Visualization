import 'source-map-support/register';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as d3 from 'd3';
import * as Canvas from 'canvas-prebuilt';
import * as topojson from 'topojson-client';
import { readFileSync } from 'fs';

import * as boundaries from '../../data/cultural.json';
import * as land from '../../data/land.json';

const airportData = readFileSync('data/airports.dat', { encoding: 'utf8' });
const points = d3.csvParseRows(airportData)
  .filter(airport => !airport[5].match(/N/) && airport[4] !== '')
  .map(airport => ({
    name: airport[1],
    location: airport[2],
    country: airport[3],
    code: airport[4],
    latitude: airport[6],
    longitude: airport[7],
    timezone: airport[11],
  }));

async function renderView(ctx, next) {
  if (ctx.method === 'GET') {
    ctx.body =
    `<!doctype html>
      <html>
      <head>
        <title>Find your nearest airport!</title>
      </head>
      <body>
        <form method="POST" action="#">
          <h1>Enter your latitude and longitude, or allow your browser to check.</h1>
          <input type="text" name="location" /> <br />
          <input type="submit" value="Check" />
        </form>
        <script type="text/javascript">
        navigator.geolocation.getCurrentPosition(function(position) {
          document.querySelector('[name="location"]').value = position.coords.latitude + ',' + position.coords.longitude;
        });
        </script>
      </body>
    </html>`;
  } else if (ctx.method === 'POST'){
    await next(); // This ensures all the other middleware runs first!
    const airport = ctx.state.airport.data;
    ctx.body = `<!doctype html>
    <html>
    <head>
      <title>Your nearest airport is: ${airport.name}</title>
    </head>
    <body style="text-align: center;">
      <h1>
        The airport closest to your location is: ${airport.name}
      </h1>
      <table style="margin: 0 auto;">
      <tr>
        ${Object.keys(airport).map(v => `<th>${v}</th>`).join('')}
      </tr>
      <tr>
        ${Object.keys(airport).map(v => `<td>${airport[v]}</td>`).join('')}
        </tr>
      </body>
    </html>`;
  }
}

async function renderViewCanvas(ctx, next) {
  if (ctx.method === 'GET') {
    ctx.body =
    `<!doctype html>
      <html>
      <head>
        <title>Find your nearest airport!</title>
      </head>
      <body>
        <form method="POST" action="#">
          <h1>Enter your latitude and longitude, or allow your browser to check.</h1>
          <input type="text" name="location" /> <br />
          <input type="submit" value="Check" />
        </form>
        <script type="text/javascript">
        navigator.geolocation.getCurrentPosition(function(position) {
          document.querySelector('[name="location"]').value = position.coords.latitude + ',' + position.coords.longitude;
        });
        </script>
      </body>
    </html>`;
  } else if (ctx.method === 'POST') {
    await next(); // This ensures all the other middleware runs first!
    const airport = ctx.state.airport.data;
    const { canvasOutput } = ctx.state;
    ctx.body = `<!doctype html>
    <html>
    <head>
      <title>Your nearest airport is: ${airport.name}</title>
    </head>
    <body style="text-align: center;">
      <h1>
        The airport closest to your location is: ${airport.name}
      </h1>
      <img style="width: 480px; height: 250px;" src="${canvasOutput}" />
      <table style="margin: 0 auto;">
      <tr>
        ${Object.keys(airport).map(v => `<th>${v}</th>`).join('')}
      </tr>
      <tr>
        ${Object.keys(airport).map(v => `<td>${airport[v]}</td>`).join('')}
        </tr>
      </body>
    </html>`;
  }
}

function nearestAirport(ctx, next) {
  if (ctx.request.body.location) {
    const { location } = ctx.request.body;
    ctx.state.airport = nearestLocation(location, points);
    next();
  }
}

export function nearestLocation(location, points) {
  const coords = location.split(/,\s?/);
  const voronoi = d3.voronoi()
    .x(d => d.latitude)
    .y(d => d.longitude);

  return voronoi(points).find(coords[0], coords[1]);
}

function canvasMap(ctx, next) {
  const { airport } = ctx.state;
  const scale = ctx.query.scale || 1200;
  const projectionName = d3.hasOwnProperty(ctx.query.projection) ? ctx.query.projection : 'geoStereographic';
  const canvas = new Canvas(960, 500);
  const canvasCtx = canvas.getContext('2d');
  const projection = d3[projectionName]()
    .center([airport.data.longitude, airport.data.latitude])
    .scale(scale);

  const path = d3.geoPath()
    .projection(projection)
    .context(canvasCtx);

  canvasCtx.beginPath();
  path(topojson.mesh(land));
  path(topojson.mesh(boundaries));
  canvasCtx.stroke();

  const airportProjected = projection([airport.data.longitude, airport.data.latitude]);
  canvasCtx.fillStyle = '#f00';
  canvasCtx.fillRect(airportProjected[0] - 5, airportProjected[1] - 5, 10, 10);

  ctx.state.canvasOutput = canvas.toDataURL();
  next();
}

const app = new Koa();
const port = process.env.PORT || 5555;

app.use(bodyParser())
   .use(renderViewCanvas)
   .use(nearestAirport)
   .use(canvasMap);

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
