import { TranslationDescription } from './prepare_for_translation';
import { DescriptionSorter } from './src/DescriptionParser';
import fs from 'fs';
import path from 'path';

const translatedCourses = require('./translated.json') as Array<TranslatedDescription>;

interface TranslatedDescription extends TranslationDescription {
    grade: number | "Validated";
}

const coursesLatexFolder = path.join(__dirname, '/latex/courses');

translatedCourses.sort(DescriptionSorter);

let year = 0;
let moduleName = "";

for (const course of translatedCourses) {
    if (year < course.year) {
        year++;
        console.log(`\n\n%\n%\n% ---------------------------------\n\\section{${year} year}`);
    }
    if (moduleName != course.moduleEn) {
        moduleName = course.moduleEn;
        console.log(`\\module{${course.moduleEn}}{${getModuleCredits(moduleName)}}`);
    }

    const str = formatCourse(course);
    const courseFile = path.join(coursesLatexFolder, `/${course.year}/${course.id}.tex`);
    fs.writeFileSync(courseFile, str);
    console.log(`\\input{courses/${year}/${course.id}} % ${course.course}`);
}



// #1: English name
// #2: Credits
// #3: Grade
// #4: Orig name
// #5: Taught lang
function formatCourse (c: TranslatedDescription): string {
    return [
        `% id: ${c.id}`,
        (typeof c.grade == 'number'
            ? `\\gradedCourse{${c.courseEn}}{${c.credits}}{${c.grade}}{${c.course}}{${c.languageEn.toLocaleLowerCase()}}{${c.teachers.join(', ')}}`
            : `\\validatedCourse{${c.courseEn}}{${c.credits}}{${c.course}}{${c.languageEn.toLocaleLowerCase()}}{${c.teachers.join(', ')}`),
        ...c.contentsEn.map(content => {
            const contentStrs = [
                content.intro
                    ? (content.intro.match(/:\s*$/) ? content.intro : content.intro + ":" )
                    : 'Course content included:',
            ];

            if (content.list.length > 0) {
                contentStrs.push(...[
                    '\\begin{itemize}',
                    ...content.list.map(item => `    \\item ${item}`),
                    '\\end{itemize}'
                ]);
            }

            return contentStrs.join('\n');
        })
    ].join('\n').replace(/&/g, '\\&');
}

function getModuleCredits (name: string): number {
    switch(name) {
        case 'Mathematics': return 14;
        case 'Basic computing Science': return 17;
        case 'Languages, communication and management': return 13;
        case 'Discrete Electronics': return 8;
        case 'Networking': return 8;

        case 'Mathematics and Sciences for Computer Scientists': return 12;
        case 'Project and Project Management': return 6;
        case 'Algorithmic, Database, Software Engineering': return 17;
        case 'Information Systems and Mobile Applications': return 14;
        case 'Embedded systems and operating systems': return 11;

        case 'Advanced Computer Science': return 8;
        case 'Advanced Computer Science 2': return 10;
        case 'Applied Computer Science 1': return 9;
        case 'Information Systems Specialization': return 12;
        case 'Semester Projects': return 9;
        case "Bachelor Thesis": return 12;
        default: throw new Error(`Unknown module: ${name}`);
    }
}