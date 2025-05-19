# 🏋️‍♂️ Workout Tracker - Plataforma de Gestão de Treinos Pessoais

O **Workout Tracker** é um projeto em desenvolvimento com o objetivo de facilitar a vida de quem treina, permitindo **criar, editar, deletar e registrar logs de treinos e exercícios de academia**, além de oferecer diversas funcionalidades voltadas ao acompanhamento da evolução física e da rotina de treinos.

Com base em conceitos modernos como **Arquitetura Limpa**, **princípios SOLID** e **Inversão de Dependência**, o projeto visa ser escalável, modular e altamente testável, pronto para receber evoluções como personal trainers, grupos de amigos, estatísticas gráficas, notificações, login social e integração com serviços de pagamento.

---

## 🚀 Funcionalidades Atuais

- 🔐 Autenticação (login, troca e recuperação de senha via email)
- 🧑 Perfil do usuário (avatar, informações pessoais e físicas)
- 🏋️ Criação e gerenciamento de treinos
- 💪 Criação e vinculação de exercícios aos treinos
- 📝 Registro de execução de exercícios (logs)
- 📊 Dashboard com métricas médias semanais do treino
- 📚 Histórico completo de logs paginado
- 📧 Recuperação de senha com token por email
- 🖼️ Upload de imagem de perfil via MinIO

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia                                                                                                                                                                                                         | Descrição                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)                                                                                                              | **NestJS** — Framework modular e escalável para Node.js       |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)                                                                                                        | **Express** — Utilizado internamente pelo NestJS              |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                  | **PostgreSQL** — Banco de dados relacional                    |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)                                                                                                              | **Prisma ORM** — ORM moderno e tipado para banco de dados     |
| ![MinIO](https://img.shields.io/badge/MinIO-C41E1E?style=for-the-badge&logo=minio&logoColor=white)                                                                                                                 | **MinIO** — Armazenamento de imagens (simulação do S3)        |
| ![Nodemailer](https://img.shields.io/badge/Nodemailer-2465E0?style=for-the-badge)                                                                                                                                  | **Nodemailer** — Envio de e-mails (como recuperação de senha) |
| ![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | **Passport + JWT** — Autenticação com tokens                  |
| ![Zod](https://img.shields.io/badge/Zod-3A1C78?style=for-the-badge) ![class-validator](https://img.shields.io/badge/class--validator-FF8C00?style=for-the-badge)                                                   | **Zod & class-validator** — Validações fortes com feedback    |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)                                                                                                           | **Swagger** — Documentação automática da API                  |
| ![Multer](https://img.shields.io/badge/Multer-1E90FF?style=for-the-badge)                                                                                                                                          | **Multer** — Upload de arquivos                               |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)                                                                                                  | **TypeScript** — Tipagem estática e robustez                  |
| ![dayjs](https://img.shields.io/badge/dayjs-DD0031?style=for-the-badge) ![date-fns](https://img.shields.io/badge/date--fns-008080?style=for-the-badge)                                                             | **Dayjs / date-fns** — Manipulação de datas                   |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)  | **ESLint + Prettier** — Padrões de código e formatação        |
| ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=black)                                                                                                                    | **pnpm** — Gerenciador de pacotes rápido e eficiente          |

---

## 📁 Estrutura de Pastas

A estrutura é baseada em **Arquitetura Limpa**, com separação clara de responsabilidades entre domínio, infraestrutura e aplicação:

```bash
src/
├── core/ # Lógica essencial compartilhada (ex: DTOs, helpers, erros globais)
├── domain/ # Domínio da aplicação
│ ├── application/ # Casos de uso, interfaces e lógica de negócio
│ │ ├── cryptography/ # Abstrações de criptografia (hash, JWT)
│ │ ├── errors/ # Erros de negócio
│ │ ├── repositories/ # Interfaces dos repositórios
│ │ ├── use-cases/ # Casos de uso (Application Services)
│ ├── enterprise/ # Camada do domínio puro
│ │ ├── entities/ # Entidades (User, Workout, Exercise, Log, etc.)
│ │ ├── types/ # Tipagens utilitárias
│ │ ├── value-object/ # Value Objects (ex: Email, Password, etc.)
├── infra/ # Implementações concretas
│ ├── auth/ # Estratégias de autenticação (JWT, guards, interceptors)
│ ├── cryptography/ # Hashing, JWT, etc.
│ ├── database/ # Prisma Client e conexão com PostgreSQL
│ ├── env/ # Configuração de variáveis de ambiente
│ ├── guards/ # Guards personalizados para rotas
│ ├── http/ # Controllers, rotas e DTOs da camada HTTP
│ ├── mailer/ # Envio de emails com Nodemailer
│ ├── storage/ # Uploads de arquivos com MinIO
├── utils/ # Funções auxiliares e helpers
├── app.module.ts # Módulo principal da aplicação
├── main.ts # Ponto de entrada da aplicação
```

## 🔮 Funcionalidades Futuras

- 📝 FAQ para dúvidas
- 💳 Integração com meios de pagamento para planos futuros (ex: Stripe)
- 🤝 Relacionamento de usuário com personal trainer
- 👥 Criação de grupos de amigos
- 📈 Estatísticas gráficas de desempenho por período
- 🔔 Notificações (lembrete de treino)
- 🔑 Login com Google, GitHub, etc.
- 🧠 Recomendação inteligente de treinos (IA)

---

## ⚙️ Instalação

```bash
pnpm install
```

# Desenvolvimento

```bash
pnpm start:dev
```

# Produção

```bash
pnpm start:prod
```

## 📦 Migrations com Prisma

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## 🔑 Variáveis de Ambiente

Crie um arquivo .env na raiz com os seguintes valores:

```bash
SERVICE=""
PORT=""
VERSION=""

DATABASE_URL=""
FRONTEND_URLS=""
APP_URL_WORKOUT_TRACKER=""

MINIO_BUCKET_NAME=""
MINIO_BUCKET_URL=""
MINIO_ACCESS_KEY_ID=""
MINIO_SECRET_ACCESS_KEY=""

JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""

NODE_MAILER_PORT=""
NODE_MAILER_HOST=""
NODE_MAILER_FROM=""
NODE_MAILER_USER=""
NODE_MAILER_PASSWORD=""
```

## 📬 Envio de Emails

Funcionalidades disponíveis:

Envio de token para recuperação de senha

Recuperação de senha com token válido

⚠️ Para funcionar corretamente, configure as variáveis do Nodemailer com uma conta válida.

## 🖼️ Upload de Imagens

Utiliza o MinIO para simular o Amazon S3, permitindo:

- Upload seguro de imagem de perfil

- Acesso posterior aos arquivos de forma segura

## 📬 Contato

- **Autor**: 👨‍💻 [YuriLRodrigues](https://github.com/YuriLRodrigues)
- **LinkedIn**: [Yuri Leite Rodrigues](https://www.linkedin.com/in/yuri-leite-rodrigues)
