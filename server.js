const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(express.static('public'));

// LOGIN
app.post('/api/login', async (req, res) => {
  const { login, senha } = req.body;
  const usuario = await prisma.usuario.findUnique({ where: { login } });
  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({ erro: 'Login ou senha inválidos.' });
  }
  res.json({ id: usuario.id, nome: usuario.nome });
});

// PRODUTOS (CRUD)
app.get('/api/produtos', async (req, res) => {
  const { q } = req.query;
  const produtos = await prisma.produto.findMany({
    where: q ? { nome: { contains: q } } : {},
    orderBy: { nome: 'asc' }
  });
  res.json(produtos);
});

app.post('/api/produtos', async (req, res) => {
  const { nome, tipo, quantidade, estoqueMinimo } = req.body;
  if (!nome || !tipo) return res.status(400).json({ erro: 'Nome e tipo são obrigatórios.' });
  const produto = await prisma.produto.create({
    data: { nome, tipo, quantidade: Number(quantidade) || 0, estoqueMinimo: Number(estoqueMinimo) || 0 }
  });
  res.status(201).json(produto);
});

app.put('/api/produtos/:id', async (req, res) => {
  const { nome, tipo, quantidade, estoqueMinimo } = req.body;
  const produto = await prisma.produto.update({
    where: { id: Number(req.params.id) },
    data: { nome, tipo, quantidade: Number(quantidade), estoqueMinimo: Number(estoqueMinimo) }
  });
  res.json(produto);
});

app.delete('/api/produtos/:id', async (req, res) => {
  await prisma.produto.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

// ESTOQUE (movimentações)
app.get('/api/movimentacoes', async (req, res) => {
  const movs = await prisma.movimentacao.findMany({
    include: { produto: true, usuario: true },
    orderBy: { data: 'desc' }
  });
  res.json(movs);
});

app.post('/api/movimentacoes', async (req, res) => {
  const { produtoId, usuarioId, tipo, quantidade } = req.body;
  const qtd = Number(quantidade);
  if (!produtoId || !usuarioId || !tipo || !qtd || qtd <= 0) {
    return res.status(400).json({ erro: 'Dados inválidos.' });
  }
  const produto = await prisma.produto.findUnique({ where: { id: Number(produtoId) } });
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

  if (tipo === 'saida' && produto.quantidade < qtd) {
    return res.status(400).json({ erro: 'Estoque insuficiente para saída.' });
  }

  const novaQtd = tipo === 'entrada' ? produto.quantidade + qtd : produto.quantidade - qtd;

  const [mov] = await prisma.$transaction([
    prisma.movimentacao.create({
      data: { produtoId: Number(produtoId), usuarioId: Number(usuarioId), tipo, quantidade: qtd }
    }),
    prisma.produto.update({ where: { id: Number(produtoId) }, data: { quantidade: novaQtd } })
  ]);

  res.status(201).json({ ...mov, alerta: novaQtd < produto.estoqueMinimo });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
