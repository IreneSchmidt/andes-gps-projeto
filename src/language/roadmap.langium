import 'helpers'
import 'terminals'
import 'usecase'
import 'requirement'
import 'entities'

type Item =UseCase | FunctionalRequirement | NonFunctionalRequirement | BussinesRule;
Roadmap:
    'roadmap' id=ID '{'
        Name
        |milestones+= Milestone
    '}'
;

Milestone:
    'milestone' id=ID '{'
        (Description
        | DUEDATE
        | releases += Release)*
    '}'
;

Release:
    'release' id=ID '{'
        (
            Description
            | DUEDATE
            | 'item' ':' item+= ( [Item:QualifiedName])(',' items+=[Item:QualifiedName])*
            | 'status' ':' status=STATUS
            | 'version' ':' version=STRING
        )* 
    '}'
;