const topojson = require('topojson');
const topo = require('./data/congress-115-states.json'); // source: https://github.com/bradoyler/atlas-make/tree/master/us-congress-census
const fs = require('fs');
const csvString = fs.readFileSync('data/unopposed-house-2016.csv', 'UTF-8').toString();
const D3Node = require('d3-node');
const output = require('d3node-output');

// derived from http://bl.ocks.org/mbostock/4657115
const css = `
.district-boundaries {
 fill: none;
 stroke: #aaa;
 stroke-width: .8px;
}
.state-boundaries {
 fill: none;
 stroke: #aaa;
 stroke-width: 1.5px;
}`;

const d3n = new D3Node({svgStyles: css});
const d3 = d3n.d3;

function findFips(d) {
  return (item) => {
    return (d.id === item.fips);
  };
};

var width = 960;
var height = 500;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);

var svg = d3n.createSVG()
  .attr('width', width).attr('height', height);

var data = d3.csvParse(csvString);

svg.append('defs').append('path')
      .attr('id', 'land')
      .datum(topojson.feature(topo, topo.objects.states))
      .attr('d', path);

svg.append('clipPath')
   .attr('id', 'clip-land')
   .append('use')
   .attr('xlink:href', '#land');

svg.append('g')
    .attr('class', 'districts')
  //  .attr('clip-path', 'url(#clip-land)') // causes issue with svg2png
  .selectAll('path')
    .data(topojson.feature(topo, topo.objects.districts).features)
    .enter().append('path')
    .attr('d', path)
    .style('fill', (d) => {
      var race = data.find(findFips(d));

      if (race && race.party === 'Republican') {
        return '#cc203a'; // red
      } else if (race && race.party === 'Democratic') {
        return '#4286f4'; // blue
      }
      return '#ccc';
    })
    .append('title')
    .text((d) => d.id);

svg.append('path')
    .attr('class', 'district-boundaries')
    .datum(topojson.mesh(topo, topo.objects.districts, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)))
    .attr('d', path);

svg.append('path')
    .attr('class', 'state-boundaries')
    .datum(topojson.mesh(topo, topo.objects.states, (a, b) => a !== b))
    .attr('d', path);

// create output files
output('dist/output', d3n);
