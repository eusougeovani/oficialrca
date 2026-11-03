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
- **Elenco:** preencha `elenco.futsal | fut7 | feminino` →
  `{ num:10, nome:'Fulano', pos:'Ala', gols:0, jogos:0, capitao:false }`.
- **Notícias:** adicione o item em `noticias` e o texto (HTML) em `articles.js` com a mesma chave `id`. Foto em `pages/images/news/`.
- **Diretoria:** preencha `nome` nos cargos de `diretoria`.
- **Documentos de governança:** coloque o PDF em `pages/docs/` e informe o caminho em `arquivo` (ex.: `"docs/estatuto.pdf"`).
- **Patrocinadores:** logo em `pages/images/patrocinio/` + item em `patrocinadores`/`parceiros`.
- **Fotos:** itens em `galeria`.

Ao publicar mudanças em CSS/JS, aumente `VERSION` em `sw.js`.

## Rodar localmente
`python3 -m http.server 8000` e abra http://localhost:8000
