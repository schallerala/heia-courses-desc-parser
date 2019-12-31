import PagesCrawler from "./PagesCrawler";
import { Descriptions, DescriptionSorter } from "./DescriptionParser";
import fs from 'fs';
import path from 'path';

const crawler = new PagesCrawler();

throw new Error("Don't execute anymore!");
(async function () {
    await crawler.start();
    Descriptions.sort(DescriptionSorter);
    fs.writeFileSync(path.join(__dirname, "out.json"), JSON.stringify(Descriptions));
})();