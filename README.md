# BananaPay - Sistema de Pagamentos via PIX

BananaPay é uma solução moderna e segura para pagamentos instantâneos via PIX. O projeto foi desenhado com foco em escalabilidade, boas práticas de engenharia de software e arquitetura limpa. A aplicação permite a leitura de QR Codes, envio e recebimento de valores via PIX, gerenciamento de contatos, agendamentos e pagamentos recorrentes.

---

## 🌟 Funcionalidades

- Leitura e geração de QR Code PIX
- Transferências via chaves PIX
- Suporte a "Pix Copia e Cola"
- Cadastro e gerenciamento de contatos PIX
- Pagamentos agendados
- Pagamentos automáticos recorrentes

---

## 🪑 Tecnologias Utilizadas

| Camada         | Tecnologia                      |
| -------------- | ------------------------------- |
| Frontend       | Next.js (App Router)            |
| Backend API    | Node.js, Express, TypeScript    |
| ORM            | Prisma ORM                      |
| Banco de Dados | SQLite (dev), PostgreSQL (prod) |
| Validação      | Zod                             |
| Testes         | Jest                            |

---

## 📁 Estrutura do Projeto

O backend segue os princípios da Arquitetura Limpa com separação em:

- `domain/` - Entidades e contratos
- `application/` - Casos de uso
- `infra/` - Implementações (Prisma, integrações)
- `interface/` - Rotas, controllers e validadores
- `shared/` - Tipagens, helpers, erros globais

Mais detalhes estão em [`design.md`](./design.md).

---

## 🎨 Instalação e Execução

### Requisitos

- Node.js 18+
- Yarn ou npm
- Docker (opcional para banco em prod)

### Clonando o Projeto

```bash
git clone https://github.com/aleksanderpalamar/banana-pay.git
cd banana-pay
```

### Instalando Dependências

```bash
npm install
```

### Rodando em Desenvolvimento

```bash
npm run dev
```

### Rodando Testes

```bash
npm run test
```

---

## 📑 Documentação da API

A documentação será gerada automaticamente via Swagger e ficará disponível em:

```
http://localhost:3000/docs
```

---

## 🚀 Futuras Expansões

- Integração com OpenPix ou Banco Central
- Painel administrativo para gestão das transações
- Autenticação via OAuth2 / JWT
- Monitoramento de performance com Prometheus e Grafana

---

## 👨‍💼 Autor

Desenvolvido por **Aleksander Palamar**

> "Pagar com PIX nunca foi tão fácil quanto com BananaPay!"

---

## ✅ Licença

Este projeto está licenciado sob a [MIT License](./LICENSE).
