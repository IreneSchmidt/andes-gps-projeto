---
title: Domain
sidebar_position 3
---

# Diagrama de Domínio
```plantuml
@startuml
	class Pessoa {
		+string nome
		+integer idade
		+email correiovirtual

	}
	class PNC {
		+string nome
		+integer idade
		+email correiovirtual
		+cpf identificacao

	}
@enduml
```


# ModuloTeste

## Pessoa
Entidade Pessoa, possuí relação com OUTRO

## PNC
Entidade PNC, não possui relações.