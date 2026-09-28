const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.usuario.create({
    data: { nome: 'Admin', login: 'admin', senha: '123456' }
  });

  const produtos = await Promise.all([
    prisma.produto.create({ data: { nome: 'iPhone 13', tipo: 'smartphone', quantidade: 10, estoqueMinimo: 3 } }),
    prisma.produto.create({ data: { nome: 'Notebook Dell i5', tipo: 'notebook', quantidade: 5, estoqueMinimo: 2 } }),
    prisma.produto.create({ data: { nome: 'Smart TV 50" LG', tipo: 'smart tv', quantidade: 2, estoqueMinimo: 3 } })
  ]);

  const movs = [
    { produtoId: produtos[0].id, tipo: 'entrada', quantidade: 10 },
    { produtoId: produtos[1].id, tipo: 'entrada', quantidade: 5 },
    { produtoId: produtos[2].id, tipo: 'entrada', quantidade: 2 },
    { produtoId: produtos[2].id, tipo: 'saida', quantidade: 1 }
  ];
  for (const m of movs) {
    await prisma.movimentacao.create({ data: { ...m, usuarioId: admin.id } });
  }

  console.log('Seed concluído.');
}

main().finally(() => prisma.$disconnect());
