const topojson = require('topojson');
const us = require('./data/congress.json'); // source: https://github.com/bradoyler/atlas-make/tree/master/us-congress
const D3Node = require('d3-node');

const defaultStyles = `
.Democrat {fill: blue;}
.Republican {fill: red;}
`;

// derived from http://bl.ocks.org/bradoyler/e9d70c6b1ce76e1ba8b83d94cfd4296c

function congress(svgStyles = defaultStyles) {
  const d3n = new D3Node({ svgStyles });
  const d3 = d3n.d3;

  const projection = d3.geoAlbersUsa();
  const path = d3.geoPath().projection(projection);
  const svg = d3n.createSVG(960, 500);

  svg.selectAll('.region')
      .data(topojson.feature(us, us.objects.congress).features)
      .enter()
      .append('path')
      .attr('class', function(d){
         if(d.properties.PARTY_AFF=='Democrat') {
            return 'democrat';
         } else {
           return 'republican';
         }
       })
      .attr('d', path)
      .style('stroke', '#aaa')
      .style('stroke-width', '.6px');

  return d3n;
}

module.exports = congress;
