import 'terminals'
import 'helpers'
import 'usecase'

type Requirement=(FunctionalRequirement | NonFunctionalRequirement|BussinesRule);
type Epic = UseCase | FunctionalRequirement | NonFunctionalRequirement | BussinesRule;

Requirements: 
    'requirements' id=ID '{'
        (Name
        |Description
        | STARTDATE
        | DUEDATE 
        |requirements+=(FunctionalRequirement|NonFunctionalRequirement|BussinesRule))*
    '}'
;  

FunctionalRequirement:
    'functional_requirement' id=ID '{'
        (Description
        |Priority 
        | STARTDATE
        | DUEDATE 
        |'depend'':' depend= [Requirement:QualifiedName](',' depends+=[Requirement:QualifiedName])?  
        )*
    '}'
;

NonFunctionalRequirement:
    'non_functional_requirement' id=ID '{'
        ( Description
        |Priority
        | STARTDATE
        | DUEDATE 
        |'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

BussinesRule:
    'bussines_rule' id=ID '{'
        ( Description
        | Priority
        | STARTDATE
        | DUEDATE 
        | 'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

