import 'helpers'
import 'terminals'
import 'usecase'
import 'requirement'
import 'entities'
import 'andes'

Sprint: 
    'sprint' id=ID '{'
        (Name
        |Description
        | STARTDATE
        | DUEDATE
        | 'status' ':' status=STATUS
        | 'sprintBacklog' ':' sprintbacklog = SprintBacklog
        )*
    '}'
;

SprintBacklog:
    'sprintbacklog' id=ID '{'
        ('items' ':' items+=[Item:QualifiedName](',' items+=[Item:QualifiedName])*
        )*
    '}'
;

//Item:
    'item' id=ID '{'
        (
            
        )*
    '}'
;