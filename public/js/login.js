document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const erroEl = document.getElementById('erro');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, senha })
  });

  if (!res.ok) {
    const data = await res.json();
    erroEl.textContent = data.erro || 'Falha ao entrar.';
    return;
  }

  const usuario = await res.json();
  localStorage.setItem('usuario', JSON.stringify(usuario));
  window.location.href = 'app.html';
});
