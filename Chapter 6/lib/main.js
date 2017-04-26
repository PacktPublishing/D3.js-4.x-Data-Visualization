// import * as d3 from 'd3';
// import chartFactory from './common/index';
// import './chapter3/index';
import '../styles/index.css';

// import './chapter4/index';
import westerosChart from './chapter6/index';

// westerosChart.init('tree', 'data/GoT-lineage-by-father.json');
westerosChart.init('cluster', 'data/GoT-lineage-by-father.json');
// westerosChart.init('treemap', 'data/GoT-lineages-screentimes.json');
// westerosChart.init('partition', 'data/GoT-lineages-screentimes.json');
// westerosChart.init('pack', 'data/GoT-lineages-screentimes.json');

// This isn't mentioned in the book, but I've added this line to let hotreload work.
// Hot module reloading is really flaky in jspm so use with caution.
export const __hotReload = true; // eslint-disable-line
