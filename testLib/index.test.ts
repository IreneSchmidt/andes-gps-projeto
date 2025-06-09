import {Actor, Model, SparkApplication, MadeApplication, DocumentationApplication, Requirement, BussinesRule, FunctionalRequirement, UseCase, Event} from "andes-lib"
import { test , expect } from 'vitest'
import fs from "fs"
import path from "path"


const myActor: Actor = {
    name: "Actor"
}

const myBusinessRule: BussinesRule = {
    id: "BR01",
    description: "Business rule description",
    priority:"High",
    depends: []
}

const myFunctionalRequirement: FunctionalRequirement = {
    id: "FR01",
    description:"Functional requirement description",
    priority:"High",
    depends: [myBusinessRule]
}

const myRequirement: Requirement = {
    id:"1",
    name:"Requirement 1",
    description: "This is a requirement",
    requirement: myFunctionalRequirement,
    requirements: [myFunctionalRequirement,myBusinessRule]
}

const myEvent: Event = {
    id: "Event01",
    name: "My Event",
    description: "This is my event description",
    action: "This is my event action",
    requirements:[myFunctionalRequirement],
    depends: [],
    performer: myActor
}

const myUseCase: UseCase = {
    actors: [myActor],
    depends:[],
    events:[myEvent],
    id: "UC01",
    requirements:[myFunctionalRequirement]
}

const myModel: Model = {
    project: {
        id: "MyProject",
        name: "My Awesome Project",
        description: "This is a description of my awesome project.",
        architecture: "java",
        name_fragment: "Nome Do Projeto"
    },
    components: [
        myRequirement,
        myActor,
        myUseCase
    ]
};

//Aqui ele ta definindo o caminho onde o arquivo .spark será gerado
const myTargetFolder: string = "./generated-files"; 

test("SparkApplication Test", ()=>{const sparkApp = new SparkApplication
    (myModel, myTargetFolder);
    sparkApp.create();

    const expectedFile = path.join(myTargetFolder, "./spark/myproject.spark"); 
    expect(fs.existsSync(expectedFile)).toBe(true); // <--- Verifica se realmente a pasta foi criada, se ela existe após execução feita
 });

 test("MadeApplication Test", ()=>{const madeApp = new MadeApplication
    (myModel, myTargetFolder);
    madeApp.create();

    const expectedFile = path.join(myTargetFolder, "./made/myproject.made"); 
    expect(fs.existsSync(expectedFile)).toBe(true); 
 });

 test("DocumentationAplication Test", ()=>{const DocsApp = new DocumentationApplication
    (myModel, myTargetFolder);
    DocsApp.create();
 });