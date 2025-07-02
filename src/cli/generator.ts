import { Actor, EnumX, isActor, isEnumX, isFunctionalRequirement, isModule, isModuleImport, isNonFunctionalRequirement, isRequirements, isUseCase, Module, ModuleImport, Requirements, UseCase, type Model } from '../language/generated/ast.js';
import { GenerateOptions } from './main.js';
import { ArtifactApplication } from './artifacts/application.js'
import { MadeApplication } from './made/application.js'
import { SparkApplication } from './spark/application.js';
import path from 'path';
import { translateEnumx, translateRequirements, translateModule, translateModuleImport, translateUseCase, translateActor, translateBrToBrC, translateBR, translateFrToFrC, translateFR, translateNFR, translateNfrToNfrC } from './translate-utils.js';

import appli from "andes-lib"

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined,opts: GenerateOptions): string {
    const final_destination  = extractDestination(filePath, destination);
    
    translate(model);

    const artifactApplication = new ArtifactApplication(model,final_destination);
    const madeApplication = new MadeApplication(model,final_destination); 
    const sparkApplication = new SparkApplication(model,final_destination);

    const overview: Overview = {
        architecture: model.project?.architcture ? model.project.architcture : "python",
        description: model.project?.description ? model.project.description : "",
        name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
        miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
        purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
    }

    const singleModule: ModuleInterface = {
        actors: model.Actor.map(c => translateActor(c)),
        useCases: model.UseCase.map(uc => translateUseCase(uc)),
        description: model.project?.description ? model.project.description : "No Description",
        identifier: model.project?.id ? model.project.id : "",
        miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
        name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
        // @ts-ignore
        description: model.project?.description ? model.project.description : "",
        purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
        requisites: {
            buiinesRule: model.Requirements?.br.map((br)=>translateBrToBrC(translateBR(br)))??[],
            //@ts-ignore
            functionalRequiriment: model.Requirements?.fr.filter(fr => isFunctionalRequirement(fr)).map(fr => translateFrToFrC(translateFR(fr)))??[],
            nonFunctionalRequiriment: model.Requirements?.nfr.filter(nfr => isNonFunctionalRequirement(nfr)).map(nfr => translateNfrToNfrC(translateNFR(nfr)))??[],
        },

        // @ts-ignore
        packages: model.AbstractElement.filter(pkgs => isModule(pkgs)).map(pkg => translateModule(pkg)),
    }

    const project: ProjectInterface = {
        overview: overview,
        modules: [singleModule]
    }

    const app = new AndesLib.(project, final_destination);
    
    if(opts.destination == undefined)
    {
        // Some error ocurred and it is simple just overwrite it
        opts.all = true;
    }

    if (opts.only_Documentation){
        console.log("Not Implemented Yet");
    }
    if (opts.only_spark){
        sparkApplication.create()
    }

    if (opts.only_testing){
        artifactApplication.create()
    }

    if (opts.only_made){
        madeApplication.create()
    }

    if (opts.all){
        console.log(singleModule.requisites.functionalRequiriment[1])
        app.create();
    }
    
    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')
  
    return destination ?? path.join(path.dirname(filePath))
}

function translate (model: Model) : Model /* Retorna um libmodel (ou qualquer que seja o nome) */ {
        // @ts-ignore
    const project = model.project;
    const moduleList: Module[] = []
    const enumList: EnumX[] = []
    const actorList: Actor[] = []
    const moduleImportList: ModuleImport[] = []
    const requirementsList: Requirements[] = []
    const useCaseList: UseCase[] = []

    for (const comp of [...model.AbstractElement, ...model.Actor, ...model.UseCase, ...model.ModuleImport]) {
        // @ts-ignore
        if (isModule(comp)) moduleList.push(translateModule(comp));

        // @ts-ignore
        else if (isEnumX(comp)) enumList.push(translateEnumx(comp));
        
        else if (isActor(comp)) {

        // @ts-ignore
            const name = comp.name
        // @ts-ignore
            const entity = comp.entity //call localentityTranslate or importedentityTranslate
        // @ts-ignore
            const actor = comp.superType ?? "" //call actorTranslate if not undefined
        // @ts-ignore
            const comment = comp.comment ?? ""

            // @ts-ignore
            actorList.push(translateActor(comp));
        }
        else if (isModuleImport(comp)) {

        // @ts-ignore
            const name = comp.name
        // @ts-ignore
            const entities = comp.entities //call importEntityTranslate
        // @ts-ignore
            const library = comp.library
        // @ts-ignore
            const packPath = comp.package_path

            moduleImportList.push(translateModuleImport(comp));
        }
        else if (isRequirements(comp)) {
            
        // @ts-ignore
            const id = comp.id
        // @ts-ignore
            const requirements = comp.requirements //call BRTranslate, FRTranslate, NFRTranslate
        // @ts-ignore
            const description = comp.description ?? ""
        // @ts-ignore
            const nameFrag = comp.name_fragment ?? ""

            requirementsList.push(translateRequirements(comp));
        }
        else if (isUseCase(comp)) {
            
        // @ts-ignore
            const id = comp.id
        // @ts-ignore
            const events = comp.events //call EventTranslate
        // @ts-ignore
            const actors = comp.actors //call ActorTranslate
        // @ts-ignore
            const depends = comp.depends //call UseCaseTranslate if not empty
        // @ts-ignore
            const depend = comp.depend ?? "" //call UseCaseTranslate if not undefined

            // @ts-ignore
            useCaseList.push(translateUseCase(comp));
        }
    }

    //@ts-ignore
    model.Requirements?.fr.forEach(fr => requirementsList.push(translateFR(fr)));
    //@ts-ignore
    model.Requirements?.nfr.forEach(fr => requirementsList.push(translateNFR(fr)));
    //@ts-ignore
    model.Requirements?.br.forEach(fr => requirementsList.push(translateBR(fr)));

    return model
}