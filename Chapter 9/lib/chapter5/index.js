// import easingChart from './easingChart';
// import spirograph from './spirograph';
// import buttonPrisonChart from './buttonChart';
// import draggablePrisonChart from './draggableChart';
// import brushableChart from './brushableChart';


// easingChart(false);
// spirograph(true);
//
// import prisonChart from './prisonChart';
//
// // Base chart
// (async (enabled) => {
//   if (!enabled) return;
//   await prisonChart.init();
//
//   const data = prisonChart.data;
//   function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
//
//   const randomChart = () => {
//     try {
//       const from = getRandomInt(0, data.length - 1);
//       const to = getRandomInt(from, data.length - 1);
//       prisonChart.update(data.slice(from, to));
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   prisonChart.update(data);
//   setInterval(randomChart, 5000);
// })(false);

// Button chart
// (async (enabled) => {
//   if (!enabled) return;
//
//   await buttonPrisonChart.init();
//   buttonPrisonChart.addUIElements();
// })(true);

// (async (enabled) => {
//   if (!enabled) return;
//
//   await draggablePrisonChart.init();
//   draggablePrisonChart.addDragBehavior();
// })(true);

// (async (enabled) => {
//   if (!enabled) return;
//
//   await brushableChart.resolveData();
//   await brushableChart.init();
//   brushableChart.addBrushBehavior();
// })(true);

import zoomMap from './zoomMap';

(async (enabled) => {
  if (!enabled) return;
  // zoomMap.addZoomBehavior();
  zoomMap.addZoomBehavior();
})(true);
