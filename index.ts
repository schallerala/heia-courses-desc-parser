import PagesCrawler from "./PagesCrawler";
import { Descriptions } from "./DescriptionParser";
import fs from 'fs';
import path from 'path';

const crawler = new PagesCrawler();

(async function () {
    await crawler.start();
    let creditSum = 0;
    Descriptions.forEach(d => {
        console.log(d.credits, d.url);
    });
    console.log("Sum:", creditSum);

    fs.writeFileSync(path.join(__dirname, "out.json"), JSON.stringify(Descriptions));
})();