import {Model, SparkApplication, MadeApplication} from "andes-lib"
import { test } from 'vitest'

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
 })

 test("MadeApplication Test", ()=>{const madeApp = new MadeApplication
    (myModel, myTargetFolder);
    madeApp.create();
 })