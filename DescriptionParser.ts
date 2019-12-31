import cheerio from 'cheerio';
import { ParsedAnswer } from "./RequestPage";

interface Section {
    intro?: string;
    list: Array<string>
}

interface Objectives extends Section { }
interface Content extends Section { }

interface Description {
    url: string;
    module: string;
    course: string;
    periods: string;
    objectives: Objectives;
    contents: Array<Content>;
    credits: string;
    year: string;
    semester: string;
    language: string;
    evaluations: Array<string>;
    teachers: Array<string>;
}

export const Descriptions: Array<Description> = new Array();

const getText = (element: CheerioElement): string => {
    if (element === undefined)
        return '';

    if (element.type == 'text' && element.nodeValue != null)
        return element.nodeValue.trim();

    return element.children.map(node => getText(node)).join('\n');
};
const getFirstChild = (element: CheerioElement, typeName: string): CheerioElement => {
    for (const child of element.children) {
        if (child.type == 'tag' && child.name == typeName)
            return child;
    }
    return null;
}
const mapNodeValues = (index: number, element: CheerioElement) => getText(element);

export default class DescriptionParser {

    private readonly $: CheerioStatic;

    constructor(page: ParsedAnswer) {
        this.$ = page.$;

        const module = this.getModule();
        const course = this.getCourse();
        const periods = this.getPeriods();
        const objectives = this.getObjectives();
        const contents = this.getContents();
        const credits = this.getCredits();
        const year = this.getYear();
        const semester = this.getSemester();
        const language = this.getLanguage();
        const evaluations = this.getEvaluations();
        const teachers = this.getTeachers();

        const desc = {
            url: page.url,
            module, course, periods, objectives, contents,
            credits, year, semester, language, evaluations, teachers
        };
        Descriptions.push(desc);

        this.checkValues(desc);
    }

    private getModule(): string {
        return getText(this.$(".header-item strong").get(1).next);
    }

    private getCourse(): string {
        return this.getFirst("span.teaser");
    }

    private getPeriods(): string {
        return this.getFirst("h3.lessonplans-course-header");
    }

    private getObjectives(): Objectives {
        const intro = this.getFirst(".objectives p");
        const list = this.$(".objectives li").map(mapNodeValues).get();
        return {
            intro, list
        };
    }

    private getContents(): Array<Content> {
        return this.$(".content").map((index: number, element: CheerioElement) => {
            const introCtn = getFirstChild(element, "p");
            const intro = introCtn ? getText(introCtn) : null;
            const list = cheerio.load(element)("li").map(mapNodeValues).get();
            return {
                intro, list
            };
        }).get();
    }

    private getCredits(): string {
        return getText(this.$(".system-grid--lessonplansDetailHeader > div.system-grid-heading:contains(oids)").next().get(0));
    }

    private getYear(): string {
        return getText(this.$(".system-grid--lessonplansDetailHeader > div.system-grid-heading:contains(plan)").next().get(0));
    }

    private getSemester(): string {
        return getText(this.$(".system-grid--lessonplansDetailHeader > div.system-grid-heading:contains(emestre)").next().get(0));
    }

    private getLanguage(): string {
        return getText(this.$(".system-grid--lessonplansDetailHeader > div.system-grid-heading:contains(angue)").next().get(0));
    }

    private getEvaluations(): Array<string> {
        // omit é or É to avoid case problems
        const evaluationTitle = this.$("div.col-12 h4:contains(valuation)").get(0);
        if (evaluationTitle == null)
            return [];

        return cheerio.load(evaluationTitle.parent)("li").map(mapNodeValues).get();
    }

    private getTeachers(): Array<string> {
        // omit e or E to avoid case problems
        const teachersTitle = this.$("div.col-12 h4:contains(nseignant)");
        if (teachersTitle.length == 0)
            return [];

        return getText(teachersTitle.next().get(0)).split(/,/).map(s => s.trim());
    }

    private getFirst(selector: string): string {
        return getText(this.$(selector).get(0));
    }

    private checkValues(desc: Description) {
        for (const [key, value] of Object.entries(desc)) {
            if (value === null)
                console.error("Missing values for: " + key);
        }
    }
}