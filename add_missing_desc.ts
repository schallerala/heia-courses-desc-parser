import { DescriptionSorter, Description } from "./src/DescriptionParser";
import fs from 'fs';
import path from 'path';

const out = require('./out.json') as Array<Description>;

const itBootcamp = {
    module: "Informatique avancée",
    course: "Chapitre spécialisé: IT startup bootcamp",
    objectives: {
        intro: "À la fin de ce cours l'étudiant est capable de:",
        list: [
            "Comprendre le processus entrepreneurial, les méthodes utilisées pour l’identification des occasions d’affaires",
            "Apprécier l’importance de l’innovation dans le processus entrepreneurial",
            "Amorcer le processus d’une nouvelle idée et organiser les ressources afin de lancer des projets ou des entreprises",
            "Comprendre les briques de base d’un business plan",
            "Présenter oralement un business plan simple à des partenaires et investisseurs potentiels",
            "Initier la recherche de financement pour l’entreprise",
        ]
    },
    contents: [{
        list: [
            "Innova&on et entreprenariat / Développer une opportunité (idéation, pitch, etc.)",
            "Business concept & modèles en IT / Business model canvas / Lean canvas",
            "Lean startup development / Minimum Viable Products / IT product roadmap",
            "Ecosystème start-up incluant coaching, funding, etc.",
            "Eléments de propriétés intellectuelles dans un contexte startup IT",
            "Équipe (créer son équipe, etc.) / opportunité du marché (go-to-market)",
            "Finances (grands lignes) / Approches de financement des startups : crowdfunding- angels-VC, valorisation, NPV"
        ]
    }],
    credits: 2,
    year: 3,
    semester: "Printemps",
    language: "Français",
    evaluations: [ "Contrôle continu: travaux écrits, TP/évaluation de rapports, Présentations" ],
    teachers: ["Omar Abou Khaled", 'Jean Hennebert']
};
// Economie d'entreprise
const businessManagement = {
    module: "Projet et Gestion de projets",
    course: "Betriebswirtschaft",
    contents: [{
        list: [
            "Das Unternehmen und sein Umfeld (Rahmenbedingungen, Aufbau, Funktionen, Beziehungen, Rechtsformen etc.)",
            "Finanzielle Aspekte (Übergeordnete Ziele, Investition, Finanzierung)",
            "Buchhalterische Aspekte (Buchführung, Bilanz, ER, Analyse)",
            "Unternehmensführung (Managementfunktionen, HR)",
            "Management-Techniken (Analysemethoden, Szenarien)"
        ]
    }],
    credits: 1.5,
    year: 2,
    semester: "Automne",
    language: "Allemand",
    evaluations: [ "Contrôle continu: travaux écrits, Présentations" ],
    teachers: ["Alfred Münger"]
};

out.push(itBootcamp, businessManagement);

out.sort(DescriptionSorter);
fs.writeFileSync(path.join(__dirname, "out.json"), JSON.stringify(out));