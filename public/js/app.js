const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
if (!usuario) window.location.href = 'login.html';
document.getElementById('usuario-logado').textContent = usuario?.nome || '';

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('usuario');
  window.location.href = 'login.html';
});

// ---- Abas ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.hidden = true);
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).hidden = false;
    if (btn.dataset.tab === 'principal') carregarAlertas();
    if (btn.dataset.tab === 'produtos') carregarProdutos();
    if (btn.dataset.tab === 'estoque') carregarSelectProdutos();
    if (btn.dataset.tab === 'historico') carregarHistorico();
  });
});

// ---- Principal: alertas ----
async function carregarAlertas() {
  const produtos = await (await fetch('/api/produtos')).json();
  const tbody = document.getElementById('lista-alertas');
  const baixos = produtos.filter(p => p.quantidade < p.estoqueMinimo);
  tbody.innerHTML = baixos.length
    ? baixos.map(p => `<tr class="alerta"><td>${p.nome}</td><td>${p.quantidade}</td><td>${p.estoqueMinimo}</td></tr>`).join('')
    : '<tr><td colspan="3">Nenhum produto abaixo do estoque mínimo.</td></tr>';
}

// ---- Produtos (CRUD) ----
async function carregarProdutos(busca = '') {
  const produtos = await (await fetch('/api/produtos?q=' + encodeURIComponent(busca))).json();
  document.getElementById('lista-produtos').innerHTML = produtos.map(p => `
    <tr>
      <td>${p.nome}</td><td>${p.tipo}</td><td>${p.quantidade}</td><td>${p.estoqueMinimo}</td>
      <td>
        <button onclick="editarProduto(${p.id})">Editar</button>
        <button onclick="excluirProduto(${p.id})">Excluir</button>
      </td>
    </tr>`).join('');
  window._produtosCache = produtos;
}

document.getElementById('busca-produto').addEventListener('input', (e) => carregarProdutos(e.target.value));

document.getElementById('form-produto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('produto-id').value;
  const body = {
    nome: document.getElementById('produto-nome').value,
    tipo: document.getElementById('produto-tipo').value,
    quantidade: document.getElementById('produto-quantidade').value,
    estoqueMinimo: document.getElementById('produto-minimo').value
  };
  await fetch(id ? `/api/produtos/${id}` : '/api/produtos', {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  e.target.reset();
  document.getElementById('produto-id').value = '';
  carregarProdutos();
});

document.getElementById('btn-cancelar-produto').addEventListener('click', () => {
  document.getElementById('form-produto').reset();
  document.getElementById('produto-id').value = '';
});

function editarProduto(id) {
  const p = window._produtosCache.find(p => p.id === id);
  document.getElementById('produto-id').value = p.id;
  document.getElementById('produto-nome').value = p.nome;
  document.getElementById('produto-tipo').value = p.tipo;
  document.getElementById('produto-quantidade').value = p.quantidade;
  document.getElementById('produto-minimo').value = p.estoqueMinimo;
}

async function excluirProduto(id) {
  if (!confirm('Excluir este produto?')) return;
  await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
  carregarProdutos();
}

// ---- Estoque (movimentações) ----
async function carregarSelectProdutos() {
  const produtos = await (await fetch('/api/produtos')).json();
  document.getElementById('mov-produto').innerHTML =
    produtos.map(p => `<option value="${p.id}">${p.nome} (qtd: ${p.quantidade})</option>`).join('');
}

document.getElementById('form-mov').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    produtoId: document.getElementById('mov-produto').value,
    usuarioId: usuario.id,
    tipo: document.getElementById('mov-tipo').value,
    quantidade: document.getElementById('mov-quantidade').value
  };
  const res = await fetch('/api/movimentacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  const msg = document.getElementById('mov-msg');
  if (!res.ok) {
    msg.textContent = data.erro;
  } else {
    msg.textContent = data.alerta ? 'Registrado! Atenção: estoque abaixo do mínimo.' : 'Registrado com sucesso.';
    e.target.reset();
    carregarSelectProdutos();
  }
});

// ---- Histórico ----
async function carregarHistorico() {
  const movs = await (await fetch('/api/movimentacoes')).json();
  document.getElementById('lista-historico').innerHTML = movs.map(m => `
    <tr>
      <td>${new Date(m.data).toLocaleString('pt-BR')}</td>
      <td>${m.produto.nome}</td>
      <td>${m.tipo}</td>
      <td>${m.quantidade}</td>
      <td>${m.usuario.nome}</td>
    </tr>`).join('');
}

carregarAlertas();
