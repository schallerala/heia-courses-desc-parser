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

for (const course of translatedCourses) {
    if (year < course.year) {
        year++;
        console.log(`\n\n%\n%\n% ---------------------------------\n\\section{${year} year}`);
    }

    const str = formatCourse(course);
    const courseFile = path.join(coursesLatexFolder, `/${course.year}/${course.id}.tex`);
    fs.writeFileSync(courseFile, str);
    console.log(`\\input{courses/${year}/${course.id}}`);
}



// #1: English name
// #2: Orig name
// #3: Taught lang
// #4: Credits
// #5: Grade
// #6: Module name
// #7: Module credits
function formatCourse (c: TranslatedDescription): string {
    return [
        `% id: ${c.id}`,
        `\\course{${c.courseEn}}{${c.course}}{${c.languageEn}}{${c.credits}}{${c.grade}}{${c.moduleEn}}{TODO}`
    ].join('\n');
}