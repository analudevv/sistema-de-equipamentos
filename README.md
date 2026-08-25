# 📦 Sistema de Gestão de Equipamentos

Sistema desenvolvido para auxiliar na **gestão e controle de equipamentos de um laboratório escolar**, com foco no gerenciamento de sua utilização e no registro de alocações.

> ⚠️ **Projeto em processo de refatoração**
>
> Esta é a versão original do **Sistema de Gestão de Equipamentos**. O projeto passará por uma refatoração para melhorar sua organização, arquitetura, banco de dados, interface e manutenção, mantendo sua finalidade principal e suas tecnologias atuais.

---

## 📌 Sobre o projeto

O **Sistema de Gestão de Equipamentos** foi criado durante meu período de **estágio como Técnica em Informática**, a partir de uma necessidade real identificada na gestão do laboratório de informática de uma escola.

O laboratório precisava de uma forma mais organizada de controlar seus equipamentos e suas respectivas utilizações. A partir desse problema, foi desenvolvido o sistema com o objetivo de **centralizar as informações, facilitar o controle dos equipamentos e registrar suas alocações**, tornando o processo de gestão mais organizado.

A primeira versão do sistema foi desenvolvida para atender diretamente às necessidades do laboratório durante o período de estágio.

Atualmente, o projeto está sendo utilizado como base para uma **refatoração e reorganização**, buscando aplicar conhecimentos adquiridos posteriormente e melhorar sua estrutura, organização, manutenção e experiência de uso.

---

## 🎯 Problema

Antes da implementação do sistema, o controle da utilização dos equipamentos do laboratório apresentava dificuldades relacionadas à organização das informações e ao acompanhamento das alocações.

Entre os principais problemas estavam:

* dificuldade para saber quais equipamentos estavam disponíveis;
* controle pouco centralizado das utilizações;
* possibilidade de conflitos de horários;
* dificuldade para consultar registros anteriores;
* necessidade de organizar informações de equipamentos, professores e salas.

O sistema foi desenvolvido como uma solução para centralizar essas informações e facilitar o gerenciamento do laboratório.

---

## 💡 Solução

O sistema permite centralizar as informações relacionadas aos equipamentos e suas utilizações em uma única aplicação.

Entre as principais funcionalidades estão:

* consulta de equipamentos;
* consulta de disponibilidade;
* registro de alocações;
* identificação do responsável pela utilização;
* registro da sala;
* registro de data e horário;
* acompanhamento do status das alocações;
* consulta dos registros existentes;
* gerenciamento administrativo.

A proposta é tornar o processo de utilização dos equipamentos mais **organizado, rápido e fácil de acompanhar**.

---

## ⚙️ Funcionalidades atuais

A versão original do sistema possui funcionalidades relacionadas a:

* 🔐 Autenticação de administrador;
* 📦 Consulta de equipamentos;
* 👨‍🏫 Consulta de professores;
* 📝 Registro de alocações;
* 🏫 Informação da sala de utilização;
* 📅 Registro de data e horário;
* 🔎 Consulta das alocações;
* 📊 Controle do status das alocações.

---

## 🛠️ Tecnologias

O projeto utiliza as seguintes tecnologias:

* **Node.js**
* **Express**
* **JavaScript**
* **HTML**
* **CSS**
* **EJS**
* **MySQL**

> A stack atual passará por uma mudança durante o processo de refatoração. O objetivo é melhorar a organização e a estrutura do projeto utilizando React, Typescript, Node e Posgresql.

---

## 🗄️ Banco de dados

A aplicação utiliza **MySQL** para armazenamento dos dados.

A estrutura atual possui tabelas relacionadas a:

* Equipamentos;
* Projetores;
* Caixas de som;
* Professores;
* Administradores;
* Alocações.

O banco de dados será analisado e reorganizado durante a refatoração, buscando melhorar:

* relacionamentos;
* integridade dos dados;
* organização;
* consultas;
* manutenção.

---

## 🔄 Refatoração planejada

A versão atual representa a primeira implementação do sistema e será utilizada como base para uma **refatoração e reorganização da aplicação**.

O objetivo não é mudar a finalidade do sistema, mas evoluir sua estrutura a partir dos conhecimentos adquiridos após o desenvolvimento da primeira versão.

### 🗄️ Banco de dados

* Melhor organização das tabelas;
* Melhor definição dos relacionamentos;
* Integridade dos dados;
* Redução de duplicações;
* Melhoria das consultas.

### ⚙️ Backend

* Melhor organização dos arquivos;
* Separação de responsabilidades;
* Organização das rotas;
* Melhor estrutura das regras de negócio;
* Melhor comunicação com o banco de dados.

### 🎨 Frontend

* Interface mais intuitiva;
* Melhor organização das telas;
* Melhor experiência de utilização;
* Layout responsivo.

### 🔐 Segurança

* Melhor gerenciamento das credenciais;
* Utilização de variáveis de ambiente;
* Validação dos dados;
* Melhor organização da autenticação.

### 📚 Documentação

* Melhor documentação do projeto;
* Instruções de instalação;
* Configuração do banco de dados;
* Configuração do ambiente;
* Instruções para execução.

---

## 🚧 Status do projeto

**Versão atual:** primeira versão desenvolvida durante o estágio.

**Status:** funcional e em processo de refatoração.

```text id="z6r3v1"
[✓] Identificação do problema
[✓] Desenvolvimento da primeira versão
[✓] Banco de dados inicial
[✓] Funcionalidades principais
[ ] Refatoração do banco
[ ] Organização do backend
[ ] Reorganização do frontend
[ ] Melhorias de segurança
[ ] Testes
[ ] Documentação completa
[ ] Nova versão do sistema
```

---

## 🚀 Como executar

### 1. Clone o repositório

```bash id="h7p4nc"
git clone https://github.com/analudevv/Alocacao-de-Equipamentos.git
```

### 2. Acesse o diretório

```bash id="k2w8sa"
cd Alocacao-de-Equipamentos
```

### 3. Instale as dependências

```bash id="m8z5vx"
npm install
```

### 4. Configure o MySQL

Crie o banco de dados no MySQL e execute o arquivo SQL disponível no projeto para criar as tabelas necessárias.

Configure as credenciais do banco de acordo com a configuração utilizada pela aplicação.

### 5. Execute o sistema

```bash id="r3q7df"
npm start
```

A porta utilizada dependerá da configuração atual da aplicação.

---

## 📁 Estrutura atual

A estrutura abaixo representa a organização da versão original:

```text id="v4k8sa"
Alocacao-de-Equipamentos/
├── public/
├── views/
├── app.js
├── database.txt
├── package.json
└── README.md
```

Essa estrutura será reorganizada durante o processo de refatoração.

---

## 🔮 Roadmap de evolução

```text id="n8c4wp"
Problema identificado no laboratório
              ↓
      Desenvolvimento da
        primeira versão
              ↓
       Sistema funcional
              ↓
       Análise da versão
           original
              ↓
      Refatoração do banco
              ↓
     Organização do backend
              ↓
    Reorganização do frontend
              ↓
       Melhorias de segurança
              ↓
             Testes
              ↓
         Documentação
              ↓
         Nova versão
```

---

## 👩‍💻 Contexto de desenvolvimento

O **Sistema de Gestão de Equipamentos** foi desenvolvido durante meu período de **estágio como Técnica em Informática**, em uma escola, a partir de uma necessidade identificada no laboratório de informática.

O projeto teve como objetivo transformar uma necessidade real do ambiente de trabalho em uma solução tecnológica, aplicando conhecimentos de desenvolvimento de sistemas, programação, banco de dados e organização de informações.

A experiência também serviu como oportunidade para compreender, na prática, etapas como:

* identificação de problemas;
* levantamento de necessidades;
* desenvolvimento de uma solução;
* modelagem e utilização de banco de dados;
* desenvolvimento de uma aplicação web;
* testes e correções;
* manutenção e evolução de um sistema.

A versão atual representa o resultado inicial desse processo e será posteriormente refatorada como parte da evolução técnica do projeto.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos, profissionais e de aprendizado.
