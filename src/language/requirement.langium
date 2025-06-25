import 'terminals'
import 'helpers'
import 'usecase'

type Requirement=(FunctionalRequirement | NonFunctionalRequirement);
type Epic = UseCase | FunctionalRequirement | NonFunctionalRequirement | BussinesRule;

Requirements: 
    'requirements' id=ID '{'
        (Name
        |Description
        |requirements+=(FunctionalRequirement|NonFunctionalRequirement|BussinesRule))*
    '}'
;  

FunctionalRequirement:
    'functional_requirement' id=ID '{'
        (Description
        |Priority 
        |'depend'':' depend= [Requirement:QualifiedName](',' depends+=[Requirement:QualifiedName])?  
        )*
    '}'
;

NonFunctionalRequirement:
    'non_functional_requirement' id=ID '{'
        ( Description
        |Priority  
        |'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

BussinesRule:
    'bussines_rule' id=ID '{'
        ( Description
        | Priority 
        | 'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

Release:
    'release' id=ID '{'
        (Description 
        |'item' ':' items+= (UseCase | FunctionalRequirement | NonFunctionalRequirement | BussinesRule)
        |'status' ':' status=STATUS
        |'due_date' ':' due_date=STRING
        |'version' ':' version=STRING
    '}')*
;