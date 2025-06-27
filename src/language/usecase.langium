import 'terminals'
import 'helpers'
import 'requirement'
import 'entities'


Actor:
    'actor' name=QualifiedName '{'
        (Name|
        Description |
        'contato' ':' contato =STRING
        )*
    '}'
;

UseCase:
    'usecase' id=ID '{'
        (Name
         |Description
         |'requirements'':' requirement= [Requirement:QualifiedName](',' requirements+=[Requirement:QualifiedName])?         
         |events+=Event 
         |'depend'':' depend= [UseCase:QualifiedName](',' depends+=[UseCase:QualifiedName])?
         |'performer' ':' actors+=[Actor:QualifiedName](',' actors+=[Actor:QualifiedName])*
        )*
    '}'
;

Event:
    'event' id=ID '{'
         (Name
         |Description
         |STARTDATE
         |DUEDATE
         |'action' ':' action=STRING
         |'requirements'':' requirement= [FunctionalRequirement:QualifiedName](',' requirements+=[FunctionalRequirement:QualifiedName])?         
         |'depend'':' depend= [Event:QualifiedName](',' depends+=[Event:QualifiedName])?
         |'performer' ':' actors+=[Actor:QualifiedName](',' actors+=[Actor:QualifiedName])*
         | task += Task
        )*
    '}'
;

Team:
    'team' id=ID '{'
        (Name
        |Description
        |'actors' ':' actors+=[Actor:QualifiedName](',' actors+=[Actor:QualifiedName])*
        )*
    '}'
;

Task:
    'task' id=ID '{'
        (Name
        |Description
        |STARTDATE
        |DUEDATE
        |'status' ':' status = STATUS
        )*
    '}'
;
