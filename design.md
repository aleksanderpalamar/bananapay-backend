# System Design - Backend BananaPay

## Visão Geral

O backend do BananaPay foi projetado para ser modular, testável e escalável, utilizando os princípios da Arquitetura Limpa, DDD (Domain-Driven Design), TDD e SOLID. A aplicação está estruturada em módulos, com responsabilidades bem definidas, e separação entre camadas de domínio, aplicação, infraestrutura e interfaces.

## Arquitetura

A arquitetura é baseada nos seguintes pilares:

- **Domain Layer**: Regras de negócio puras, entidades, interfaces de repositórios e value objects.
- **Application Layer**: Casos de uso que orquestram o domínio e implementam a lógica de aplicação.
- **Infrastructure Layer**: Implementações concretas (banco de dados, chamadas HTTP, email, etc).
- **Interface Layer**: Controladores, rotas, DTOs e middleware de entrada.

### Diagrama de Camadas

```text
[ interface (HTTP) ]
         |
   [ application ]
         |
   [ domain ] <--- abstrações
         ^
   [ infrastructure ]
```

## Fluxo de Requisição

1. **Entrada via HTTP**: A requisição chega por uma rota REST na camada `interface`.
2. **Controller**: O controlador recebe a requisição, valida os dados e aciona um caso de uso.
3. **Use Case**: A camada `application` executa as regras de aplicação e orquestra entidades.
4. **Domínio**: As entidades executam as regras de negócio puras.
5. **Repositórios/Serviços**: A camada `infra` fornece implementações concretas das interfaces de persistência ou integrações externas.
6. **Resposta**: O resultado retorna ao controller que monta a resposta HTTP.

## Tecnologias

| Camada         | Tecnologia                        |
| -------------- | --------------------------------- |
| Interface      | Express, Zod (validação), Swagger |
| Application    | TypeScript puro                   |
| Domain         | TypeScript puro, entidades        |
| Infrastructure | Prisma ORM, PostgreSQL, Axios     |

## Padrões e Princípios

- **SOLID**: Cada classe tem responsabilidade única, dependências injetadas via interfaces.
- **DDD**: O domínio é o coração da aplicação. Entidades e casos de uso não conhecem detalhes técnicos.
- **Arquitetura Limpa**: Infraestrutura depende do domínio, nunca o contrário.
- **TDD**: Os casos de uso são escritos com testes unitários desde o início.

## Observabilidade

- Logs estruturados com Prometheus e Grafana
- Healthcheck endpoint (Ex: `/health`)
- Middleware de logging por requisição
- Testes unitários com Jest e cobertura de código

## Escalabilidade

- Estrutura modular por contextos (Ex: `pix`, `contacts`, `users`)
- Interfaces desacopladas permitem mocks e testes
- Possibilidade de adicionar mensageria (ex: RabbitMQ) em futuros serviços assíncronos

## Segurança

- Validação de entrada com Zod
- Rate limiting com middleware
- Autenticação JWT/OAuth2
- HTTPS e headers seguros com Helmet
