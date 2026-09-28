# Diagrama Entidade-Relacionamento (DER)

Usuario (id, nome, login, senha)
Produto (id, nome, tipo, quantidade, estoqueMinimo)
Movimentacao (id, produtoId FK, usuarioId FK, tipo, quantidade, data)

Relacionamentos:
- Usuario 1:N Movimentacao (um usuário faz várias movimentações)
- Produto 1:N Movimentacao (um produto tem várias movimentações)

```mermaid
erDiagram
  USUARIO ||--o{ MOVIMENTACAO : registra
  PRODUTO ||--o{ MOVIMENTACAO : sofre
  USUARIO {
    int id
    string nome
    string login
    string senha
  }
  PRODUTO {
    int id
    string nome
    string tipo
    int quantidade
    int estoqueMinimo
  }
  MOVIMENTACAO {
    int id
    string tipo
    int quantidade
    datetime data
  }
```
