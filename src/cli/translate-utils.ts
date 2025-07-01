        // @ts-ignore
import { Actor as InternalActor, Attribute, AttributeEnum, BussinesRule, Element, EnumEntityAtribute, EnumX, Event, FunctionalRequirement, FunctionEntity, ImportedEntity, isElement, isFunctionalRequirement, isImportedEntity, isLocalEntity, isManyToOne, isNonFunctionalRequirement, isOneToMany, isOneToOne, isUseCase, LocalEntity, Module, ModuleImport, NonFunctionalRequirement, Relation, Requirements, UseCase, Model } from "../language/generated/ast.js";

import { Actor as AndesActor, UseCaseType as AndesUseCase, Attributes, EnumAttribute, Event as EventType, Package, SparkEntity, Relashioship as AndeselashionShip, Enumerate, BuisinesRuleClass, FunctionalRequirementClass, NonFunctionalRequirementClass } from "andes-lib";

// EnumX
export function translateEnumx(enumX: EnumX): Enumerate {
        // @ts-ignore
    const name = enumX.name

    const attrEnums = []
    for (const attr of enumX.attributes) attrEnums.push(translateAttrEnum(attr));
    
        // @ts-ignore
    const comment = enumX.comment ?? ""

    return {
        name: name,
        options: attrEnums.map(attr => attr.name),
    }
}

export function translateAttrEnum(attrEnum: AttributeEnum): AttributeEnum {
        // @ts-ignore
    const name = attrEnum.name
        // @ts-ignore
    const fullName = attrEnum.fullName ?? ""
        // @ts-ignore
    const comment = attrEnum.comment ?? ""
    
    return attrEnum
}

// Entity
export function translateLocalEntity(localEntity: LocalEntity): LocalEntity {
        // @ts-ignore
    const name = localEntity.name

    const attributes = []
    for (const attr of localEntity.attributes) attributes.push(translateAttribute(attr))
    
    const enumEntityAtributes = []
    for (const eea of localEntity.enumentityatributes) enumEntityAtributes.push(translateEnumEntityAttribute(eea))
    
    const functions = []
    for (const func of localEntity.functions) functions.push(translateFunction(func))

    const relations = []
    for (const rel of localEntity.relations) relations.push(translateRelation(rel))

        // @ts-ignore
    const isAbstract = localEntity.is_abstract

        // @ts-ignore
    var superType: LocalEntity | ImportedEntity | undefined
    const ref_temp = localEntity.superType?.ref
    if (ref_temp) {
        if (isLocalEntity(ref_temp)) superType = translateLocalEntity(ref_temp)
        else if (isImportedEntity(ref_temp)) superType = translateImportedEntity(ref_temp)
    }
    else superType = undefined
    
        // @ts-ignore
    const comment = localEntity.comment ?? ""

    return localEntity
}

export function translateLocalEntityToSparkEntity(entity: LocalEntity): SparkEntity
{
    return {
        name: entity.name,
        attributes: entity.attributes.map(attr => translateAttribute(attr)),
        enumAttributes: entity.enumentityatributes.map(e => translateEnumEntityAttribute(e)),
        relashionShips: entity.relations.map(r => translateRelation(r)),
    }
}

export function translateImportedEntity(importEntity: ImportedEntity): ImportedEntity {
        // @ts-ignore
    const name = importEntity.name

    return importEntity
}

export function translateFunction(func: FunctionEntity): FunctionEntity {
        // @ts-ignore
    const name = func.name

    const paramters = []
    for (const par of func.paramters) {
        if (isElement(par)) paramters.push(translateElement(par));
        else if (Array.isArray(par)) for (const elem of par) paramters.push(translateElement(elem));
    }

        // @ts-ignore
    const response = func.response.toString()

        // @ts-ignore
    const comment = func.comment ?? ""

    return func
}

export function translateElement(elem: Element): Element {
        // @ts-ignore
    const name =  elem.name
        // @ts-ignore
    const type = elem.type.toString()
    
    return elem
}

export function translateAttribute(attr: Attribute): Attributes {
        // @ts-ignore
    const name = attr.name
        // @ts-ignore
    const fullName = attr.fullName ?? ""
        // @ts-ignore
    const min = attr.min ?? ""
        // @ts-ignore
    const max = attr.max ?? ""
        // @ts-ignore
    const type = attr.type.toString()
        // @ts-ignore
    const unique = attr.unique
        // @ts-ignore
    const comment = attr.comment ?? ""

    return {
        _type: type,
        blank: false,
        name: name,
        unique: unique,
        max: Number(max),
        min: Number(min)
    }
}

export function translateEnumEntityAttribute(eea: EnumEntityAtribute): EnumAttribute {
        // @ts-ignore
    const name = eea.name
    
        // @ts-ignore
    var type: EnumX | undefined
    const ref_temp = eea.type.ref
        // @ts-ignore
    if (ref_temp) type = translateEnumx(ref_temp);

        // @ts-ignore
    const comment = eea.comment ?? ""

    return {
        _type: {
            name: eea.type.$refText,
            options: []
        },
        name: eea.name,
    }
}

export function translateRelation(rel: Relation): AndeselashionShip {
    let relationType = "";

    if (isOneToOne(rel)) {
        // @ts-ignore
        const name = rel.name

        relationType = "OneToOne"

        // @ts-ignore
        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        // @ts-ignore
        const fullName = rel.fullName ?? ""
        // @ts-ignore
        const comment = rel.comment ?? ""
    }
    else if (isOneToMany(rel)) {
        // @ts-ignore
        const name = rel.name

        relationType = "OneToMany";

        // @ts-ignore
        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        // @ts-ignore
        const fullName = rel.fullName ?? ""
        // @ts-ignore
        const comment = rel.comment ?? ""
    }
    else if (isManyToOne(rel)){
        // @ts-ignore
        const name = rel.name

        relationType = "ManyToOne";

        // @ts-ignore
        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        // @ts-ignore
        const fullName = rel.fullName ?? ""
        // @ts-ignore
        const comment = rel.comment ?? ""
    }
    else {
        // @ts-ignore
        const name = rel.name

        relationType = "ManyToMany"

        // @ts-ignore
        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        // @ts-ignore
        const fullName = rel.fullName ?? ""
        // @ts-ignore
        const comment = rel.comment ?? ""
    } 

    console.log(rel.name);
    console.log(type?.name)

    return {
        name: rel.name,
        _relationType: relationType,
        relationDestination: {name: type?.name??"", attributes: [], enumAttributes: [], relashionShips: []}
    }
}

// Module
export function translateModule(module: Module): Package
{
        // @ts-ignore
    const name = module.name
        // @ts-ignore
    const description = module.description ?? ""
    
    const enumXs = []
    for (const enumX of module.enumXs) enumXs.push(translateEnumx(enumX))
    
    const localEntities = []
    for (const locEnt of module.localEntities) localEntities.push(translateLocalEntity(locEnt))
    
    const modules = []
    for (const mod of module.modules) modules.push(translateModule(mod))

    return {
        name: module.name,
        identifier: module.name,
        description: module.description ? module.description : "",
        entityes: module.localEntities.map(le => translateLocalEntityToSparkEntity(le)),
        enums: module.enumXs.map(e => translateEnumx(e)),
        subPackages: []
    }
}

export function translateModuleImport(moduleImport: ModuleImport): ModuleImport {
        // @ts-ignore
    const name = moduleImport.name
        // @ts-ignore
    const package_path = moduleImport.package_path
        // @ts-ignore
    const library = moduleImport.library

    const entities = []
    for (const ent of moduleImport.entities) entities.push(translateImportedEntity(ent));

    return moduleImport
}

// UseCase
export function translateUseCase(useCase: UseCase, ucStack: UseCase[] = []): AndesUseCase {
        // @ts-ignore
    const id =  useCase.id
        // @ts-ignore
    const name_fragment = useCase.name_fragment ?? ""
        // @ts-ignore
    const description = useCase.description ?? ""

        // @ts-ignore
    var depend: UseCase | undefined = undefined

    if(!ucStack.includes(useCase))
    {
        ucStack.push(useCase)
        // @ts-ignore
        if (useCase.depend?.ref) depend = translateUseCase(useCase.depend.ref, ucStack);
    }

    const depends = []
    for (const uc of useCase.depends) {
        const ref_temp = uc.ref
        if (ref_temp) depends.push(translateUseCase(ref_temp));
    }

    const actors = []
    for (const actor of useCase.actors) {
        const ref_temp = actor.ref
        if (ref_temp) actors.push(translateActor(ref_temp))
    }

    const events = []
    for (const event of useCase.events) events.push(translateEvent(event));

        // @ts-ignore
    var requirement: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (useCase.requirement?.ref) {
        const ref_temp = useCase.requirement?.ref
        if (isFunctionalRequirement(ref_temp)) requirement = translateFR(ref_temp);
        else requirement = translateNFR(ref_temp);
    }

    const requirements = []
    for (const req of useCase.requirements) {
        const ref_temp = req.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) requirements.push(translateFR(ref_temp));
            else requirements.push(translateNFR(ref_temp));
        }
    }

    return {
        // @ts-ignore
        actors: useCase.actors.map(a => translateActor(a)),
        // @ts-ignore
        depends: useCase.depends,
        // @ts-ignore
        description: useCase.description ? useCase.depend : "",
        id: useCase.id,
        name: useCase.name_fragment ? useCase.name_fragment : "TODO: Name Fragment Not Defined",
        // @ts-ignore
        requirements: useCase.requirement ? useCase.requirement : [],
        // @ts-ignore
        events: useCase.events.map(e => translateEvent(e))
    };
}

export function translateEvent(event: Event): EventType {
        // @ts-ignore
    const id = event.id
        // @ts-ignore
    const name_fragment = event.name_fragment ?? ""
        // @ts-ignore
    const description = event.description ?? ""
        // @ts-ignore
    const action = event.action ?? ""

        // @ts-ignore
    var requirement: FunctionalRequirement | undefined = undefined
    if (event.requirement?.ref) {
        const ref_temp = event.requirement?.ref
        requirement = translateFR(ref_temp);
    }

    const requirements = []
    for (const req of event.requirements) {
        const ref_temp = req.ref
        if (ref_temp) {
            requirements.push(translateFR(ref_temp));
        }
    }

        // @ts-ignore
    var depend: Event | undefined = undefined
        // @ts-ignore
    if (event.depend?.ref) depend = translateEvent(event.depend.ref);

    const depends = []
    for (const uc of event.depends) {
        const ref_temp = uc.ref
        if (ref_temp) depends.push(translateEvent(ref_temp));
    }

    const actors = []
    for (const actor of event.actors) {
        const ref_temp = actor.ref
        if (ref_temp) actors.push(translateActor(ref_temp))
    }

    return {
        // @ts-ignore
        action: event.action ? event.action : [],
        // @ts-ignore
        depends: event.depend ? event.depend : [],
        description: event.description ? event.description : "",
        identifier: event.id,
        name: event.name_fragment ? event.name_fragment : "",
        // @ts-ignore
        requirements: event.requirement ? event.requirement : [],
    }
}

export function translateActor(actor: InternalActor): AndesActor {
        // @ts-ignore
    const name = actor.name
        // @ts-ignore
    const comment = actor.comment ?? ""

        // @ts-ignore
    var superType: InternalActor | undefined = undefined
    if (actor.superType?.ref) {
        const ref_temp = actor.superType.ref
        // @ts-ignore
        superType = translateActor(ref_temp)
    }

        // @ts-ignore
    var entity: LocalEntity | ImportedEntity | undefined = undefined
    if (actor.entity.ref) {
        const ref_temp = actor.entity.ref
        if (isLocalEntity(ref_temp)) entity = translateLocalEntity(ref_temp);
        else entity = translateImportedEntity(ref_temp)
    }
    
    return {
        name: actor.name,
        comment: actor.comment? actor.comment : "",
    };
}

// Requirements
export function translateRequirements(req: Requirements): Requirements {
        // @ts-ignore
    const id = req.id
        // @ts-ignore
    const name_fragment = req.name_fragment ?? ""
        // @ts-ignore
    const description = req.description ?? ""

    const requirements = []
    for (const rqmt of req.fr) {
        requirements.push(translateFR(rqmt));
    }

    for (const rqmt of req.nfr) {
        requirements.push(translateNFR(rqmt));
    }

    for (const rqmt of req.br) {
        requirements.push(translateBR(rqmt));
    }

    return req
}

export function translateFR(fr: FunctionalRequirement): FunctionalRequirement {
        // @ts-ignore
    const id = fr.id
        // @ts-ignore
    const priority = fr.priority ?? ""
        // @ts-ignore
    const description = fr.description ?? ""

        // @ts-ignore
    var depend: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (fr.depend?.ref) {
        if (isFunctionalRequirement(fr.depend.ref)) depend = translateFR(fr.depend.ref)
        else depend = translateNFR(fr.depend.ref);
    }

    const depends = []
    for (const dep of fr.depends) {
        const ref_temp = dep.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) depends.push(translateFR(ref_temp));
            else depends.push(translateNFR(ref_temp));
        }
    }

    return fr
}

export function translateNFR(nfr: NonFunctionalRequirement): NonFunctionalRequirement {
        // @ts-ignore
    const id = nfr.id
        // @ts-ignore
    const priority = nfr.priority ?? ""
        // @ts-ignore
    const description = nfr.description ?? ""

        // @ts-ignore
    var depend: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (nfr.depend?.ref) {
        if (isFunctionalRequirement(nfr.depend.ref)) depend = translateFR(nfr.depend.ref)
        else depend = translateNFR(nfr.depend.ref);
    }

    const depends = []
    for (const dep of nfr.depends) {
        const ref_temp = dep.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) depends.push(translateFR(ref_temp));
            else depends.push(translateNFR(ref_temp));
        }
    }

    return nfr
}

export function translateBR(br: BussinesRule): BussinesRule {
        // @ts-ignore
    const id = br.id
        // @ts-ignore
    const priority = br.priority ?? ""
        // @ts-ignore
    const description = br.description ?? ""

        // @ts-ignore
    var depend: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (br.depend?.ref) {
        if (isFunctionalRequirement(br.depend.ref)) depend = translateFR(br.depend.ref)
        else depend = translateNFR(br.depend.ref);
    }

    const depends = []
    for (const dep of br.depends) {
        const ref_temp = dep.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) depends.push(translateFR(ref_temp));
            else depends.push(translateNFR(ref_temp));
        }
    }

    return br
}

export function translateBrToBrC(br: BussinesRule): BuisinesRuleClass
{
    return new BuisinesRuleClass(br.id, br.description);
}

export function translateFrToFrC(fr: FunctionalRequirement): FunctionalRequirementClass
{
    // @ts-ignore
    return new FunctionalRequirementClass(fr.id, fr.priority?? "", fr.description, fr.depends.map(d => translateFrToFrC(translateFR(d))));
}

export function translateNfrToNfrC(nfr: NonFunctionalRequirement): NonFunctionalRequirementClass
{
    return new NonFunctionalRequirementClass(nfr.id, nfr.description);
}

