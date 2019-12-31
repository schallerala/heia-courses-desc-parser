import { Description, Objectives, Content, Section } from "./DescriptionParser";
import request from 'request';
import fs from 'fs';
import path from 'path';

const out = require('./out.json') as Array<Description>;

interface TranslationDescription extends Description {
    id: number;
    moduleEn: string;
    courseEn: string;
    objectivesEn?: Objectives;
    contentsEn: Array<Content>;
    semesterEn: string;
    languageEn: string;
    evaluationsEn: Array<string>;
}

let id = 1;
async function translateDesc (desc: Description): Promise<TranslationDescription> {
    const t: TranslationDescription = {
        ...desc,
        id: id++,
        moduleEn: getEnModule(desc.module),
        courseEn: getEnCourse(desc.course),
        contentsEn: await Promise.all(desc.contents.map(translateSection)),
        semesterEn: getEnSemester(desc.semester),
        languageEn: getEnLanguage(desc.language),
        evaluationsEn: await translate(desc.evaluations)
    };

    if (desc.objectives)
        t.objectivesEn = await translateSection(desc.objectives);

    return t;
}

async function translateSection (s: Section): Promise<Section> {
    const section: Section = {
        list: await translate(s.list)
    };
    if (s.intro)
        section.intro = (await translate([s.intro]))[0];

    return section;
}

async function translate (text: Array<string>): Promise<Array<string>> {
    if ( ! text || text.length == 0)
        return Promise.resolve([]);
    /*
     * curl https://api.deepl.com/v2/translate \
     * -d auth_key=your_auth_key \
     * -d "text=This is the first sentence."  \
     * -d "text=This is the second sentence."  \
     * -d "text=This is the third sentence."  \
     * -d "target_lang=DE"
     *
     * {
     *     "translations": [
     *         {"detected_source_language":"EN", "text":"Das ist der erste Satz."},
     *         {"detected_source_language":"EN", "text":"Das ist der zweite Satz."},
     *         {"detected_source_language":"EN", "text":"Dies ist der dritte Satz."}
     *     ]
     * }
     */
    const options  = {
        url: 'https://api.deepl.com/v2/translate',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodeBody({
            // auth_key: process.env.DEEPL_AUTH_KEY,
            text,
            target_lang: 'EN'
        })
    };

    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            const parsedBody = JSON.parse(body);
            if (parsedBody.translations && parsedBody.translations.length > 0)
                resolve(parsedBody.translations.map(t => t.text));
            else
                reject("No translation in body!\nbody:\n" + body);
        });
    });
}

Promise.all(
    out.map(translateDesc)
)
.then(translated => {
    fs.writeFileSync(path.join(__dirname, "translated.json"), JSON.stringify(translated));
});

function encodeBody (obj: any) {
    return Object.keys(obj).reduce(function (p, e, i) {
        return p + (i == 0 ? "" : "&") +
            (Array.isArray(obj[e]) ? obj[e].reduce(function (str, f, j) {
                return str + e + "=" + encodeURIComponent(f) + (j != obj[e].length - 1 ? "&" : "")
            }, "") : e + "=" + encodeURIComponent(obj[e]));
    }, "");
}


function getEnCourse (fr: string): string {
    switch(fr) {
        case 'Programmation': return "Programming";
        case 'Algorithmique et structures de données 1': return "Algorithmics and Data Structures";
        case 'Interface Homme-Machine 1': return "Human-Computer Interaction";
        case 'Allemand technique 1': return "Technical German 1";
        case 'Anglais 1': return "English 1";
        case 'Communication 1': return "Communcation 1";
        case 'Methodologie': return "Methodology";
        case 'Projet TIC': return "IT Project";
        case 'Allemand technique 2': return "Technical German 2";
        case 'Anglais 2': return "English 2";
        case 'Communication 2': return "Communication 2";
        case 'Algèbre linéaire 1': return "Linear Algebra 1";
        case 'Analyse 1': return "Calculus 1";
        case 'Algèbre linéaire 2': return "Linear Algebra 2";
        case 'Analyse 2': return "Calculus 2";
        case 'Technique numérique 1': return "Discrete Electronics 1";
        case 'Technique numérique 2': return "Discrete Electronics 2";
        case 'Téléinformatique 1': return "Networking 1";
        case 'Téléinformatique 2': return "Networking 2";

        case 'Algorithmique et structures de données 2': return "Data Structures and Algorithms 2 & Labs";
        case 'Bases de données 1': return "Databases 1";
        case 'Génie Logiciel 1': return "Software Engineering 1";
        case 'Algorithmique et structures de données 3': return "Data Structures and Algorithms 3 & Labs";
        case 'Mathématiques spécifiques 1': return "Specialized Mathematics 1";
        case 'Statistiques': return "Statistics";
        case 'Mathématiques spécifiques 2': return "Specialized Mathematics 2";
        case 'Physique SIAM': return "Physics SIAM";
        case 'Betriebswirtschaft': return "Business Management";
        case 'Gestion de projets TIC': return "Project Management ICT";
        case 'Projet de semestre (2ème année Info)': return "Semester Project";
        case 'Programmation concurrente 1': return "Concurrent Programming 1";
        case 'Applications Mobiles 1': return "Mobile Applications 1";
        case 'Programmation concurrente 2': return "Concurrent Programming 2";
        case 'Systèmes d\'information - I': return "Information Systems 1";
        case 'Système d\'exploitation 1': return "Operating Systems 1";
        case 'Systèmes Embarqués 1': return "Embedded-Systems 1";
        case 'Systèmes Embarqués 2': return "Embedded-Systems 2";

        case 'Physique et simulation': return "Physics and Simulation";
        case 'Programmation C/C++': return "C/C++ Programming";
        case 'Microprocesseurs': return "Microprocessor Systems";
        case 'Sécurité des applications Web': return "Web Application Security";
        case 'Chapitre spécialisé: Introduction au monde NoSQL': return "Elective: NoSQL";
        case 'Chapitre spécialisé: Game Design and Development': return "Elective: Game Design and Development";
        case 'Chapitre spécialisé: IT startup bootcamp': return "Elective: IT startup bootcamp"; // TODO check!
        case 'Chapitre spécialisé: Machine Learning Applications': return "Elective: Macine Learning";
        case 'Bases de données 2': return "Databases 2";
        case 'Génie logiciel 2': return "Software Engineering 2";
        case 'Interface homme-machine 2': return "Human-Computer Interaction 2";
        case 'Programmation logique': return "Logic Programming";
        case 'Projet de semestre 5': return "Semester Project 5";
        case 'Projet de semestre 6': return "Semester Project 6";
        case 'Programmation avancée Java': return "Advanced Java Programming";
        case 'Systèmes d\'information - II': return "Information Systems 2";
        case 'Architecture des systèmes d\'information': return "Information Systems Architecture";
        case 'Travail de Bachelor': return "Bachelor Thesis";
        default: throw new Error(`Unknown course: ${fr}`);
    }
}

function getEnModule (fr: string): string {
    switch(fr) {
        case 'Mathématiques': return 'Mathematics';
        case 'Informatique de base': return 'Basic computing Science';
        case 'Langues, communication et gestion': return 'Languages, communication and management';
        case 'Technique numérique': return 'Discrete Electronics';
        case 'Téléinformatique': return 'Networking';

        case 'Maths et Sciences pour Informaticiens': return 'Mathematics and Sciences for Computer Scientists';
        case 'Projet et Gestion de projets': return 'Project and Project Management';
        case 'Algorithmique, Base de données, Génie Logiciel': return 'Algorithmic, Database, Software Engineering';
        case 'Systèmes d\'Information et Applications Mobiles': return 'Information Systems and Mobile Applications';
        case 'Systèmes embarqués et systèmes d\'exploitation': return 'Embedded systems and operating systems';

        case 'Informatique avancée': return 'Advanced Computer Science';
        case 'Informatique avancée 2': return 'Advanced Computer Science 2';
        case 'Informatique appliquée': return 'Applied Computer Science 1';
        case 'Spécialisation SI ou AM': return 'Information Systems Specialization';
        case 'Projets de semestre': return 'Semester Projects';
        case 'Travail de bachelor': return "Bachelor Thesis";
        default: throw new Error(`Unknown module: ${fr}`);
    }
}

function getEnSemester (fr: string): string {
    switch (fr) {
        case 'Automne': return "Autumn";
        case 'Printemps': return "Spring";
        default: throw new Error(`Unknown semester: ${fr}`);
    }
}

function getEnLanguage (fr: string): string {
    switch (fr) {
        case 'Allemand': return "German";
        case 'Français': return "French";
        case 'Anglais': return "English";
        default: throw new Error(`Unknown language: ${fr}`);
    }
}



















