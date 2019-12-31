import RequestPage, { ParsedAnswer } from './RequestPage';
import DescriptionParser from './DescriptionParser';


const rootUrl = "https://www.heia-fr.ch/fr/formation/bachelor/informatique-et-systemes-de-communication/programme-de-formation/";
const start = `${rootUrl}?&cursus=bilingue&programId=INFO&optionId=`;


export default class PagesCrawler {

    private linkProvider: LinksProvider;
    private descriptionPages: number;

    constructor () {
        this.linkProvider = new LinksProvider();
        this.descriptionPages = 0;
        // TODO check credit sum
    }

    public async start () {
        const answer = await new RequestPage(start).request();
        const moduleLinks = this.linkProvider.getLinks(answer, "a.system-list-item-link");

        if (moduleLinks.length == 0)
            throw new Error("Missing module links!")

        await Promise.all(moduleLinks.map(this.requestModule.bind(this)));

        console.log(`Description pages: ${this.descriptionPages}`);
    }

    private async requestModule(moduleLink: string) {
        const answer = await new RequestPage(moduleLink).request();
        const classesDesc = this.linkProvider.getLinks(answer, "a.sm-btn-blue");

        if (classesDesc.length == 0)
            throw new Error("Missing classes descriptions!");

        await Promise.all(classesDesc.map(this.requestDescription.bind(this)));
    }

    private async requestDescription (descriptionLink: string) {
        const answer = await new RequestPage(descriptionLink).request();
        this.parseDescription(answer);
    }

    private parseDescription (desciptionPage: ParsedAnswer) {
        this.descriptionPages++;
        new DescriptionParser(desciptionPage);
    }
}

class LinksProvider {
    public getLinks (page: ParsedAnswer, selector: string): Array<string> {
        return page.$(selector)
            .map((index: number, element: CheerioElement) => element.attribs["href"]).get()
            .map((relativeLink: string) => relativeLink.replace(/^\./, rootUrl));
    }
}