import { Description } from "./src/DescriptionParser";

const out = require('./out.json') as Array<Description>;

let sum: { [year: number]: number } = {};
out.forEach(d => sum[d.year] ? sum[d.year] += d.credits : sum[d.year] = d.credits);

console.log(sum);