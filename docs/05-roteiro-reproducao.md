# Roteiro de Reprodução SAEP

1. `npm install` — instalar dependências (express, prisma, @prisma/client)
2. `npx prisma migrate dev --name init` — criar o banco (dev.db) a partir do schema
3. `npm run seed` — popular o banco com dados de teste
4. `npm run dev` — subir o servidor (http://localhost:3000)
5. Acessar `login.html`, entrar com admin / 123456
6. Aba Principal — conferir alertas de estoque mínimo
7. Aba Produtos — cadastrar, editar, pesquisar e excluir um produto
8. Aba Estoque — registrar entrada e saída de um produto
9. Aba Histórico — conferir movimentações com data e responsável
