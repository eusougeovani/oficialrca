# RCA · Real Clube Atlético — site oficial

Site institucional do Real Clube Atlético (futsal, fut7 e feminino · Aracaju/SE).
HTML5 + CSS3 + JavaScript ES6+ puro, sem build. Publicação estática (Vercel).

## Estrutura

```
index.html            Home
pages/*.html          Demais páginas (clube, história, equipes, notícias…)
assets/css/style.css  Design system único do site
assets/js/data.js     ⭐ Todos os dados editáveis (jogos, notícias, elenco, diretoria…)
assets/js/articles.js Texto completo das notícias
assets/js/app.js      Cabeçalho/rodapé compartilhados, menu e renderização
sw.js · manifest.json PWA (instalável / offline básico)
```

Cabeçalho, rodapé, menu e patrocinadores são gerados por `app.js`: **editou uma vez, mudou em todas as páginas.**

## Como atualizar (tudo em `assets/js/data.js`)

- **Jogos:** adicione em `jogos` →
  `{ campeonato:'Super7 Sergipe', data:'2026-04-12', hora:'16h', casa:'RCA', fora:'Adversário', local:'Ginásio X', placar:'3 × 1' }` (omita `placar` para jogo futuro).
- **Calendário 2026:** em `competicoes2026` cada item aceita `status` (ex.: `"confirmado"`, `"encerrado"`) para trocar o texto padrão “anunciado em jan/2026”.
- **Elenco:** preencha `elenco.futsal | fut7 | feminino` →
  `{ num:10, nome:'Fulano', pos:'Ala', gols:0, jogos:0, capitao:false }`.
- **Notícias:** adicione o item em `noticias` e o texto (HTML) em `articles.js` com a mesma chave `id`. Foto em `pages/images/news/`.
- **Diretoria:** preencha `nome` nos cargos de `diretoria`.
- **Documentos de governança:** coloque o PDF em `pages/docs/` e informe o caminho em `arquivo` (ex.: `"docs/estatuto.pdf"`).
- **Patrocinadores:** logo em `pages/images/patrocinio/` + item em `patrocinadores`/`parceiros`.
- **Fotos:** itens em `galeria`.

## Novos módulos (2027)

Tudo é configurado em `assets/js/data.js`.

- **Calendário 2027:** `calendario2027` → `{ nome:'Sergipano Fut7', mes:'Abril', mod:'Fut7', status:'confirmado' }`. Vazio = aviso “calendário em definição”.
- **Classificação:** `classificacao` → `{ competicao:'Sergipano Fut7 2027', atualizado:'2027-05-10', tabela:[{time:'RCA',v:3,e:1,d:0,gp:10,gc:3}], artilheiros:[{nome:'Fulano',time:'RCA',gols:5}] }`. Pontos, jogos e saldo são calculados sozinhos, e a linha do RCA fica destacada.
- **Loja (pedido pelo WhatsApp):** `loja.produtos` →
  `{ id:'camisa-titular', nome:'Camisa Titular', preco:149.9, categoria:'Uniformes', descricao:'Laranja oficial', tamanhos:['P','M','G','GG'], imagem:'images/loja/camisa.jpg', esgotado:false }`.
  `id` precisa ser único; `preco: null` mostra “Consulte”; `tamanhos` é opcional. O carrinho fica salvo no navegador do cliente e o pedido sai como mensagem pronta no WhatsApp do clube.
- **Cotas de patrocínio:** `cotas` → nome, `valor` (texto livre, vazio = “Sob consulta”), `periodo`, `destaque` e `beneficios`.
- **Perfil de jogador:** gerado automaticamente a partir de `jogadores` (`jogador.html?id=nome`). Campos opcionais por jogador: `foto` (ex.: `images/jogadores/joaquim.jpg`), `bio` e `num` (camisa).
- **Lista de transmissão:** em `clube.canalWhatsApp` coloque o link do Canal/Comunidade do WhatsApp. Vazio = o botão abre uma conversa com o clube pedindo a inclusão.
- **Plataformas de transmissão:** `plataformas` (Instagram, TikTok, YouTube).

Ao publicar mudanças em CSS/JS, aumente `VERSION` em `sw.js`.

## Rodar localmente
`python3 -m http.server 8000` e abra http://localhost:8000
