## Índice

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Tecnologias](#tecnologias)
- [Features](#features)

## Introdução

Este repositório contém o código back-end do teste técnico da Cibernix Tecnologias. O projeto consiste em um blog onde é possivel criar publicações a partir de um editor em markdown. [Clique para conferir o projeto ao vivo](https://test-cibernix-client.vercel.app/)

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
4. Para inicializar o container e rodar as migrations, execute o comando:
   ```bash
   npm run service:up
   ```
5. Rode os testes unitários:
   ```bash
   npm test
   ```
6. Inicialize o projeto:
   ```bash
   npm run dev
   ```
7. O servidor estará rodando na URL:
   ```bash
   http://localhost:3333/
   ```

## Features

- [x] Registrar novo usuário **`POST /users`**
- [x] Autenticar usuário **`POST /sessions`**
- [x] Atualizar descrição do perfil do usuário **`PUT /user`**
- [x] Criar publicação **`POST /contents`**
- [x] Editar publicação **`PUT /contents/:username/:slug`**
- [x] Excluir publicação **`DELETE /contents/:username/:contentId`**
- [x] Listar publicações com paginação **`GET /contents?page=1&limit=30`**
- [x] Listar publicações de um usuário específico com paginação **`GET /contents/:username?page=1&limit=30`**
- [x] Ver perfil de outros usuários **`GET /users/:username`**
- [ ] Comentar nas publicações
