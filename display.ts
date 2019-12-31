import { Description } from "./DescriptionParser";

const out = require('./out.json') as Array<Description>;

const headers = ['year', 'semester', 'language', 'module', 'course', 'credits', 'url'];
console.log(headers.join(','));
out.forEach(d => {
    const res = [];
    for (const header of headers) {
        res.push(`"${d[header]}"`);
    }
    console.log(res.join(','));
});