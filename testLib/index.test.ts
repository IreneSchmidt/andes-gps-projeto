import {Model, SparkApplication, MadeApplication} from "andes-lib"
import { test , expect } from 'vitest'
import fs from "fs"
import path from "path"

const myModel: Model = {
    project: {
        id: "MyProject",
        name: "My Awesome Project",
        description: "This is a description of my awesome project.",
        architecture: "java"
    },
    components: [] //Tem que colucar uns modulos aqui para testar
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