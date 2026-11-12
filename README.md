# Start Digital — Landing Page

Landing page da Start Digital, com foco em gerar contatos pelo WhatsApp para advogados.

Especificação completa: `PRD.md` (na pasta acima, em `C:\Users\USER\PRD.md`).

## Estrutura

- `index.html`: conteúdo e seções da página.
- `styles.css`: visual e animações.
- `script.js`: foguete (desktop e celular), redirecionamento do WhatsApp e estrelas de fundo.
- `.gitignore`: arquivos que não devem ir para o GitHub.

## Como visualizar localmente

Abra o arquivo `index.html` no navegador. Ou rode um servidor local, por exemplo com `npx serve`.

## Como alterar o número ou a mensagem do WhatsApp

Edite as constantes no início de `script.js`:

- `WHATSAPP_NUMBER`: número com 55 + DDD + número.

Hoje o botão abre o WhatsApp sem mensagem pré-preenchida. Para adicionar uma mensagem no futuro, veja o comentário em `script.js`.

## Publicação

1. Crie um repositório vazio no GitHub (por exemplo, `start-digital`).
2. Envie os arquivos desta pasta para o repositório.
3. No Vercel, clique em **Add New > Project**, importe o repositório e conclua o deploy. Não é necessário configurar build: é um site estático.

Cada novo `push` no GitHub atualiza o site publicado.
