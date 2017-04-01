const output = require('d3node-output');
const d3nCongress = require('../');

const styles = `
.democrat {fill: #295899;}
.republican {fill: #b4362b;}
`;

output('./example/output', d3nCongress(styles));
