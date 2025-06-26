import { Actor, EnumX, isActor, isEnumX, isModule, isModuleImport, isRequirements, isUseCase, Module, ModuleImport, Requirements, UseCase, type Model } from '../language/generated/ast.js';
import { DocumentationApplication } from './documentation/application.js';
import { GenerateOptions } from './main.js';
import { ArtifactApplication } from './artifacts/application.js'
import { MadeApplication } from './made/application.js'
import { SparkApplication } from './spark/application.js';
import path from 'path';
import { translateEnumx, translateRequirements, translateModule, translateModuleImport, translateUseCase, translateActor } from './translate-utils.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined,opts: GenerateOptions): string {
    const final_destination  = extractDestination(filePath, destination);
    
    translate(model);

    const documentationApplication = new DocumentationApplication(model,final_destination);
    const artifactApplication = new ArtifactApplication(model,final_destination);
    const madeApplication = new MadeApplication(model,final_destination); 
    const sparkApplication = new SparkApplication(model,final_destination);
    
    if (opts.only_Documentation){
        documentationApplication.create()
    
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
        documentationApplication.create();
        artifactApplication.create();
        madeApplication.create();
        sparkApplication.create()
    }
    
    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')
  
    return destination ?? path.join(path.dirname(filePath))
}

function translate (model: Model) : Model /* Retorna um libmodel (ou qualquer que seja o nome) */ {
    const project = model.project;
    const moduleList: Module[] = []
    const enumList: EnumX[] = []
    const actorList: Actor[] = []
    const moduleImportList: ModuleImport[] = []
    const requirementsList: Requirements[] = []
    const useCaseList: UseCase[] = []

    for (const comp of model.components) {
        if (isModule(comp)) moduleList.push(translateModule(comp));

        else if (isEnumX(comp)) enumList.push(translateEnumx(comp));
        
        else if (isActor(comp)) {

            const name = comp.name
            const entity = comp.entity //call localentityTranslate or importedentityTranslate
            const actor = comp.superType ?? "" //call actorTranslate if not undefined
            const comment = comp.comment ?? ""

            actorList.push(translateActor(comp));
        }
        else if (isModuleImport(comp)) {

            const name = comp.name
            const entities = comp.entities //call importEntityTranslate
            const library = comp.library
            const packPath = comp.package_path

            moduleImportList.push(translateModuleImport(comp));
        }
        else if (isRequirements(comp)) {
            
            const id = comp.id
            const requirements = comp.requirements //call BRTranslate, FRTranslate, NFRTranslate
            const description = comp.description ?? ""
            const nameFrag = comp.name_fragment ?? ""

            requirementsList.push(translateRequirements(comp));
        }
        else if (isUseCase(comp)) {
            
            const id = comp.id
            const events = comp.events //call EventTranslate
            const actors = comp.actors //call ActorTranslate
            const depends = comp.depends //call UseCaseTranslate if not empty
            const depend = comp.depend ?? "" //call UseCaseTranslate if not undefined

            useCaseList.push(translateUseCase(comp));
        }
    }

    return model
}