/* eslint-disable import/no-extraneous-dependencies */
/* eslint-env mocha */

import * as d3 from 'd3';
import chai from 'chai';
import sankey from './index.ts';

chai.should();

describe('functional tests for UK election sankey', () => {
  describe('select() method', () => {
    it('should set change link and node opacity when supplied an argument', async () => {
      const chart = await sankey();

      function getOpacities(source = null) {
        chart.select(source);

        const links = d3.selectAll('.link[opacity="1"]')
          .data()
          .map(d => d.target.name)
          .sort();
        const nodes = d3.selectAll('.node[opacity="1"]')
          .data()
          .map(d => d.name)
          .sort();

        return {
          links,
          nodes,
        };
      }

      await (async () => {
        const { links, nodes } = getOpacities('CON2010');

        links.should.eql(['CON2015', 'LAB2015', 'UKIP2015']);
        nodes.should.eql(['CON2010', 'CON2015', 'Green2015', 'LAB2015', 'LIB2015', 'Other2015', 'UKIP2015']);
      })();

      await (async () => {
        const { links, nodes } = getOpacities('LAB2010');

        links.should.eql(['CON2015', 'LAB2015', 'Other2015']);
        nodes.should.eql(['CON2015', 'Green2015', 'LAB2010', 'LAB2015', 'LIB2015', 'Other2015', 'UKIP2015']);
      })();

      await (async () => {
        const { links, nodes } = getOpacities('LIB2010');

        links.should.eql(['CON2015', 'LAB2015', 'LIB2015', 'Other2015']);
        nodes.should.eql(['CON2015', 'Green2015', 'LAB2015', 'LIB2010', 'LIB2015', 'Other2015', 'UKIP2015']);
      })();

      await (async () => {
        const { links, nodes } = getOpacities('Green2010');

        links.should.eql(['Green2015']);
        nodes.should.eql(['CON2015', 'Green2010', 'Green2015', 'LAB2015', 'LIB2015', 'Other2015', 'UKIP2015']);
      })();

      await (async () => {
        const { links, nodes } = getOpacities('Other2010');

        links.should.eql(['LIB2015', 'Other2015']);
        nodes.should.eql(['CON2015', 'Green2015', 'LAB2015', 'LIB2015', 'Other2010', 'Other2015', 'UKIP2015']);
      })();

      await (async () => {
        const { links, nodes } = getOpacities(null);
        links.should.have.length(13);
        nodes.should.have.length(11);
      })();
    });
  });
});
