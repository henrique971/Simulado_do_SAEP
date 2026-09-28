# Casos de Teste

| # | Caso | Passos | Resultado esperado |
|---|------|--------|---------------------|
| 1 | Login inválido | Informar login/senha errados | Mensagem de erro, acesso negado |
| 2 | Login válido | Informar admin/123456 | Redireciona para tela principal |
| 3 | Cadastrar produto | Preencher formulário e salvar | Produto aparece na listagem |
| 4 | Cadastro inválido | Enviar formulário sem nome | Erro de validação, nada é salvo |
| 5 | Editar produto | Alterar quantidade e salvar | Listagem reflete novo valor |
| 6 | Excluir produto | Clicar em excluir e confirmar | Produto some da listagem |
| 7 | Entrada de estoque | Registrar entrada de 5 unidades | Quantidade do produto aumenta em 5 |
| 8 | Saída de estoque | Registrar saída maior que o estoque | Erro "estoque insuficiente" |
| 9 | Alerta de estoque mínimo | Reduzir quantidade abaixo do mínimo | Produto aparece na aba Principal como alerta |
| 10 | Histórico | Realizar movimentações e abrir aba Histórico | Todas aparecem com data e responsável |
