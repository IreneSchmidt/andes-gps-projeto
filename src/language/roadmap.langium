import 'helpers'
import 'terminals'
import 'usecase'
import 'requirement'
import 'entities'

Roadmap:
    'roadmap' id=ID '{'
        Name
        |Description
        |milestones+= Milestone
    '}'
;

Milestone:
    'milestone' id=ID '{'
        (Name
        |Description
        | STARTDATE
        | DUEDATE
        | 'status' ':' status=STATUS
        | releases += Release)*
    '}'
;

Release:
    'release' id=ID '{'
        (
            Description
            | DUEDATE
            | 'item' ':' releaseItem+= ( [Epic:QualifiedName])(',' releaseItems+=[Epic:QualifiedName])*
            | 'status' ':' status=STATUS
            | 'version' ':' version=STRING
        )* 
    '}'
;