import { Actor, Attribute, AttributeEnum, BussinesRule, EnumEntityAtribute, EnumX, Event, FunctionalRequirement, ImportedEntity, isFunctionalRequirement, isImportedEntity, isLocalEntity, isManyToOne, isNonFunctionalRequirement, isOneToMany, isOneToOne, isUseCase, LocalEntity, Module, ModuleImport, NonFunctionalRequirement, Relation, Requirements, UseCase } from "../language/generated/ast.js";

// EnumX
export function translateEnumx(enumX: EnumX): EnumX {
    const name = enumX.name

    const attrEnums = []
    for (const attr of enumX.attributes) attrEnums.push(translateAttrEnum(attr));
    
    const comment = enumX.comment ?? ""

    return enumX
}

export function translateAttrEnum(attrEnum: AttributeEnum): AttributeEnum {
    const name = attrEnum.name
    const fullName = attrEnum.fullName ?? ""
    const comment = attrEnum.comment ?? ""
    
    return attrEnum
}

// Entity
export function translateLocalEntity(localEntity: LocalEntity): LocalEntity {
    const name = localEntity.name

    const attributes = []
    for (const attr of localEntity.attributes) attributes.push(translateAttribute(attr))
    
    const enumEntityAtributes = []
    for (const eea of localEntity.enumentityatributes) enumEntityAtributes.push(translateEnumEntityAttribute(eea))
    
    // const functions = []
    // for (const func of localEntity.functions) functions.push(translateFunction(func))

    const relations = []
    for (const rel of localEntity.relations) relations.push(translateRelation(rel))

    const isAbstract = localEntity.is_abstract

    var superType: LocalEntity | ImportedEntity | undefined
    const ref_temp = localEntity.superType?.ref
    if (ref_temp) {
        if (isLocalEntity(ref_temp)) superType = translateLocalEntity(ref_temp)
        else if (isImportedEntity(ref_temp)) superType = translateImportedEntity(ref_temp)
    }
    else superType = undefined
    
    const comment = localEntity.comment ?? ""
    
    return localEntity
}

export function translateImportedEntity(importEntity: ImportedEntity): ImportedEntity {
    const name = importEntity.name

    return importEntity
}

// export function translateFunction(func: FunctionEntity): FunctionEntity {
//     const name = func.name

//     const paramters = []
//     for (const par of func.paramters) {
//         if (isElement(par)) paramters.push(translateElement(par));
//         else if (Array.isArray(par)) for (const elem of par) paramters.push(translateElement(elem));
//     }

//     const response = translateDataType(func.response)

//     const comment = func.comment ?? ""

//     return func
// }

// export function translateElement(elem: Element): Element {
    
    
//     return elem
// }

export function translateAttribute(attr: Attribute): Attribute {
    const name = attr.name
    const fullName = attr.fullName ?? ""
    const min = attr.min ?? ""
    const max = attr.max ?? ""
    const type = attr.type.toString()
    const unique = attr.unique
    const comment = attr.comment ?? ""

    return attr
}

export function translateEnumEntityAttribute(eea: EnumEntityAtribute): EnumEntityAtribute {
    const name = eea.name
    
    var type: EnumX | undefined
    const ref_temp = eea.type.ref
    if (ref_temp) type = translateEnumx(ref_temp);

    const comment = eea.comment ?? ""

    return eea
}

export function translateRelation(rel: Relation): Relation {
    if (isOneToOne(rel)) {
        const name = rel.name

        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        const fullName = rel.fullName ?? ""
        const comment = rel.comment ?? ""
    }
    else if (isOneToMany(rel)) {
        const name = rel.name

        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        const fullName = rel.fullName ?? ""
        const comment = rel.comment ?? ""
    }
    else if (isManyToOne(rel)){
        const name = rel.name

        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        const fullName = rel.fullName ?? ""
        const comment = rel.comment ?? ""
    }
    else {
        const name = rel.name

        var type: LocalEntity | ImportedEntity | undefined = undefined
        const ref_temp = rel.type.ref
        if (ref_temp) {
            if (isLocalEntity(ref_temp)) type = translateLocalEntity(ref_temp);
            else if (isImportedEntity(ref_temp)) type = translateImportedEntity(ref_temp);
        }
        
        const fullName = rel.fullName ?? ""
        const comment = rel.comment ?? ""
    } 

    return rel
}

// Module
export function translateModule(module: Module): Module {
    const name = module.name
    const description = module.description ?? ""
    
    const enumXs = []
    for (const enumX of module.enumXs) enumXs.push(translateEnumx(enumX))
    
    const localEntities = []
    for (const locEnt of module.localEntities) localEntities.push(translateLocalEntity(locEnt))
    
    const modules = []
    for (const mod of module.modules) modules.push(translateModule(mod))

    return module
}

export function translateModuleImport(moduleImport: ModuleImport): ModuleImport {
    const name = moduleImport.name
    const package_path = moduleImport.package_path
    const library = moduleImport.library

    const entities = []
    for (const ent of moduleImport.entities) entities.push(translateImportedEntity(ent));

    return moduleImport
}

// UseCase
export function translateUseCase(useCase: UseCase): UseCase {
    const id =  useCase.id
    const name_fragment = useCase.name_fragment ?? ""
    const description = useCase.description ?? ""

    var depend: UseCase | undefined = undefined
    if (useCase.depend?.ref) depend = translateUseCase(useCase.depend.ref);

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

    return useCase;
}

export function translateEvent(event: Event): Event {
    const id = event.id
    const name_fragment = event.name_fragment ?? ""
    const description = event.description ?? ""
    const action = event.action ?? ""

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

    var depend: Event | undefined = undefined
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

    return event
}

export function translateActor(actor: Actor): Actor {
    const name = actor.name
    const comment = actor.comment ?? ""

    var superType: Actor | undefined = undefined
    if (actor.superType?.ref) {
        const ref_temp = actor.superType.ref
        superType = translateActor(ref_temp)
    }

    var entity: LocalEntity | ImportedEntity | undefined = undefined
    if (actor.entity.ref) {
        const ref_temp = actor.entity.ref
        if (isLocalEntity(ref_temp)) entity = translateLocalEntity(ref_temp);
        else entity = translateImportedEntity(ref_temp)
    }
    
    return actor
}

// Requirements
export function translateRequirements(req: Requirements): Requirements {
    const id = req.id
    const name_fragment = req.name_fragment ?? ""
    const description = req.description ?? ""

    const requirements = []
    for (const rqmt of req.requirements) {
        if (isFunctionalRequirement(rqmt)) requirements.push(translateFR(rqmt));
        else if (isNonFunctionalRequirement(rqmt)) requirements.push(translateNFR(rqmt));
        else requirements.push(translateBR(rqmt));
    }

    return req
}

export function translateFR(fr: FunctionalRequirement): FunctionalRequirement {
    const id = fr.id
    const priority = fr.priority ?? ""
    const description = fr.description ?? ""

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
    const id = nfr.id
    const priority = nfr.priority ?? ""
    const description = nfr.description ?? ""

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
    const id = br.id
    const priority = br.priority ?? ""
    const description = br.description ?? ""

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