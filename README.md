## Índice

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Tecnologias](#tecnologias)
- [Features](#features)

## Introdução

Este repositório contém o código back-end do teste técnico da Cibernix Tecnologias. O projeto consiste em um blog onde é possivel criar publicações a partir de um editor em markdown. [Clique para conferir o projeto ao vivo](https://test-cibernix-client.vercel.app/)

_Obs.: é provável que, na primeira tentativa de acessar o projeto, a Vercel retorne um erro de Timeout. Isso ocorre porque o backend está hospedado no plano gratuito do [Render](https://render.com) que, após um tempo de inatividade, desliga o servidor. Portanto, ao receber o erro basta aguardar alguns segundos e atualizar a página._

Neste projeto utilizei padrões de arquitetura e design de software como:

- Clean Architecture
- SOLID

## Tecnologias

- Typescript
- Fastify
- Prisma
- Postgres
- Docker
- Vitest (Testes unitários)
- Tsyringe (Dependencies Injection)

## Instalação

**Dependências:**

- Docker

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1. Clone o repositório:
   ```bash
   git clone https://github.com/eliasnsz/test-cibernix-server.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd test-cibernix-server
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Renomeie o arquivo `.env.example` para `.env.local`

5. Para inicializar o container e rodar as migrations, execute o comando:
   ```bash
   npm run service:up
   ```
6. Rode os testes unitários:
   ```bash
   npm test
   ```
7. Inicialize o projeto:
   ```bash
   npm run dev
   ```
8. O servidor estará rodando na URL:
   ```bash
   http://localhost:3333/
   ```

## Features

| Feito | Feature                                                   | Endpoint                                      |
| ----- | --------------------------------------------------------- | --------------------------------------------- |
| ✅    | Registrar novo usuário                                    | **`POST /users`**                             |
| ✅    | Autenticar usuário                                        | **`POST /sessions`**                          |
| ✅    | Atualizar descrição do perfil do usuário                  | **`PUT /user`**                               |
| ✅    | Criar publicação                                          | **`POST /contents`**                          |
| ✅    | Editar publicação                                         | **`PUT /contents/:username/:slug`**           |
| ✅    | Excluir publicação                                        | **`DELETE /contents/:username/:contentId`**   |
| ✅    | Listar publicações com paginação                          | **`GET /contents?page=1&limit=30`**           |
| ✅    | Listar publicações de um usuário específico com paginação | **`GET /contents/:username?page=1&limit=30`** |
| ✅    | Ver perfil de outros usuários                             | **`GET /users/:username`**                    |
|       | Comentar nas publicações                                  | -                                             |
