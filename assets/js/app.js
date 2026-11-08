/* RCA · Real Clube Atlético — app.js
   Layout compartilhado (header/footer), interações e renderização dos dados de data.js.
   Vanilla JS ES6+, sem dependências. */
(function () {
  'use strict';
  const D = window.RCA_DATA;
  const body = document.body;
  const ROOT = body.dataset.root || '';          // '' na raiz, '../' em /pages
  const PAGE = body.dataset.page || 'home';
  const SITE = 'https://oficialrca.vercel.app';

  /* ---------- helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const PREFIX = ROOT === '' ? 'pages/' : ROOT === '/' ? '/pages/' : '';   // '/' = páginas servidas em qualquer URL (404)
  const pg = n => PREFIX + n + '.html';
  const img = p => PREFIX + p;
  const home = ROOT + 'index.html';
  const wa = (msg) => `https://wa.me/${D.clube.whatsapp}?text=${encodeURIComponent(msg)}`;
  const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');

  /* ---------- navegação ---------- */
  const NAV = [
    { t: 'Início', href: home, id: 'home' },
    { t: 'Clube', ids: ['clube', 'diretoria', 'simbolos', 'governanca', 'contato'], items: [
      ['clube', 'fa-crown', 'Sobre o Clube'], ['diretoria', 'fa-users', 'Diretoria'], ['simbolos', 'fa-shield-halved', 'Símbolos'], ['governanca', 'fa-scale-balanced', 'Governança'], ['contato', 'fa-envelope', 'Contato']] },
    { t: 'História', ids: ['historia', 'titulos', 'estatisticas', '2022'], items: [
      ['historia', 'fa-landmark', 'Nossa História'], ['titulos', 'fa-trophy', 'Títulos e Campanhas'], ['estatisticas', 'fa-chart-line', 'Estatísticas'], ['2022', 'fa-medal', 'Redegol 2022']] },
    { t: 'Equipes', ids: ['futsal', 'fut7', 'feminino', 'jogadores', 'jogador'], items: [
      ['futsal', 'fa-futbol', 'Futsal'], ['fut7', 'fa-person-running', 'Fut7'], ['feminino', 'fa-venus', 'Feminino'], ['jogadores', 'fa-id-card', 'Jogadores']] },
    { t: 'Calendário', ids: ['calendario', 'classificacao'], items: [
      ['calendario', 'fa-calendar-days', 'Jogos e calendário'], ['classificacao', 'fa-ranking-star', 'Classificação']] },
    { t: 'Imprensa', ids: ['noticias', 'noticia', 'fotos', 'rcatv', 'fichas'], items: [
      ['noticias', 'fa-newspaper', 'Notícias'], ['fotos', 'fa-images', 'Fotos'], ['rcatv', 'fa-circle-play', 'RCAtv'], ['fichas', 'fa-clipboard-list', 'Fichas Técnicas']] },
    { t: 'Loja', href: pg('loja'), id: 'loja' },
    { t: 'Parceiros', href: pg('patrocinadores'), id: 'patrocinadores' }
  ];

  const socialLinks = (cls = '') => `
    <a href="${D.clube.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
    <a href="${D.clube.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
    <a href="${D.clube.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
    <a href="${D.clube.social.threads}" target="_blank" rel="noopener" aria-label="Threads"><i class="fa-brands fa-threads"></i></a>
    <a href="https://wa.me/${D.clube.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;

  function buildHeader() {
    const items = NAV.map(n => {
      const active = n.id === PAGE || (n.ids && n.ids.includes(PAGE));
      if (!n.items) return `<li class="${active ? 'is-active' : ''}"><a href="${n.href}" ${n.id === PAGE ? 'aria-current="page"' : ''}>${n.t}</a></li>`;
      const sub = n.items.map(([id, ic, label]) =>
        `<a href="${id === 'rcatv' ? pg('rcatv') : pg(id)}" ${id === PAGE ? 'aria-current="page"' : ''}><i class="fa-solid ${ic}"></i>${label}</a>`).join('');
      return `<li class="${active ? 'is-active' : ''}"><button type="button" aria-haspopup="true" aria-expanded="false">${n.t}<i class="fa-solid fa-chevron-down chev"></i></button><div class="dropdown">${sub}</div></li>`;
    }).join('');
    return `
    <a class="skip" href="#main">Pular para o conteúdo</a>
    <div class="topbar"><div class="container">
      <div class="topbar__social">${socialLinks()}</div>
      <div class="topbar__tag"><i class="fa-solid fa-crown"></i><span>${esc(D.clube.lema)}</span> · <a href="tel:+${D.clube.whatsapp}">${esc(D.clube.telefone)}</a></div>
    </div></div>
    <header class="header" id="header"><div class="container">
      <a class="brand" href="${home}" aria-label="Real Clube Atlético — página inicial">
        <img src="${img('images/escudo.png')}" alt="Escudo do Real Clube Atlético" width="58" height="58">
        <span class="brand__txt">Real Clube<br>Atlético<small>${esc(D.clube.handle)}</small></span>
      </a>
      <ul class="nav" id="nav">${items}<li class="nav-cta"><a class="btn btn--gold" href="${pg('seja-rca')}">Seja RCA</a></li></ul>
      <div class="header__cta">
        <a class="btn btn--gold btn--sm" href="${pg('seja-rca')}"><i class="fa-solid fa-crown"></i> Seja RCA</a>
        <button class="burger" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav"><i class="fa-solid fa-bars"></i></button>
      </div>
    </div></header>`;
  }

  function sponsorLogos(list) {
    return list.map(s => `<img src="${img(s.logo)}" alt="${esc(s.nome)}" loading="lazy">`).join('');
  }

  function buildFooter() {
    return `
    <footer class="footer"><div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <img src="${img('images/escudo.png')}" alt="Escudo RCA" loading="lazy">
          <p>Real Clube Atlético. Futsal, Fut7 e Futebol Feminino em Aracaju, Sergipe. Fundado em ${D.clube.fundacao}.</p>
          <div class="social">${socialLinks()}</div>
        </div>
        <div><h4>Clube</h4><ul>
          <li><a href="${pg('clube')}">Sobre o Clube</a></li><li><a href="${pg('diretoria')}">Diretoria</a></li>
          <li><a href="${pg('simbolos')}">Símbolos</a></li><li><a href="${pg('governanca')}">Governança</a></li></ul></div>
        <div><h4>História</h4><ul>
          <li><a href="${pg('historia')}">Nossa História</a></li><li><a href="${pg('titulos')}">Títulos e Campanhas</a></li>
          <li><a href="${pg('estatisticas')}">Estatísticas</a></li><li><a href="${pg('2022')}">Redegol 2022</a></li></ul></div>
        <div><h4>Equipes</h4><ul>
          <li><a href="${pg('futsal')}">Futsal</a></li><li><a href="${pg('fut7')}">Fut7</a></li>
          <li><a href="${pg('feminino')}">Feminino</a></li><li><a href="${pg('jogadores')}">Jogadores</a></li><li><a href="${pg('classificacao')}">Classificação</a></li><li><a href="${pg('calendario')}">Calendário</a></li></ul></div>
        <div><h4>Fale conosco</h4><ul>
          <li><a href="${pg('noticias')}">Notícias</a></li><li><a href="${pg('fotos')}">Fotos</a></li><li><a href="${pg('loja')}">Loja</a></li>
          <li><a href="${pg('patrocinadores')}">Seja patrocinador</a></li><li><a href="${pg('seja-rca')}">Seja RCA</a></li>
          <li><a href="${pg('contato')}">Contato</a></li></ul></div>
      </div>
      <div class="footer__sponsors">
        <small>Patrocinadores</small><div class="logos">${sponsorLogos(D.patrocinadores)}</div>
        <small style="display:block;margin-top:26px">Parceiros</small><div class="logos">${sponsorLogos(D.parceiros)}</div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Real Clube Atlético. Todos os direitos reservados.</span>
        <span>Desenvolvido por <a href="https://eusougeovani.vercel.app/" target="_blank" rel="noopener">GeoCODE Programmer</a></span>
      </div>
    </div></footer>
    <div class="fab">
      <button class="top" id="toTop" type="button" aria-label="Voltar ao topo"><i class="fa-solid fa-arrow-up"></i></button>
      <a class="wa" href="https://wa.me/${D.clube.whatsapp}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
    </div>`;
  }

  function mountLayout() {
    body.insertAdjacentHTML('afterbegin', buildHeader());
    body.insertAdjacentHTML('beforeend', buildFooter());
    const main = $('main'); if (main && !main.id) main.id = 'main';
  }

  /* ---------- interações globais ---------- */
  function bindGlobal() {
    const nav = $('#nav'), burger = $('#burger'), header = $('#header');
    burger.addEventListener('click', () => {
      const on = nav.classList.toggle('on');
      burger.setAttribute('aria-expanded', on);
      burger.innerHTML = `<i class="fa-solid ${on ? 'fa-xmark' : 'fa-bars'}"></i>`;
      body.style.overflow = on ? 'hidden' : '';
    });
    $$('#nav > li > button').forEach(b => b.addEventListener('click', () => {
      const li = b.parentElement, open = li.classList.contains('open');
      $$('#nav > li.open').forEach(x => { x.classList.remove('open'); x.querySelector('button')?.setAttribute('aria-expanded', 'false'); });
      if (!open) { li.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    }));
    document.addEventListener('click', e => { if (!e.target.closest('#nav')) $$('#nav > li.open').forEach(x => x.classList.remove('open')); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { $$('#nav > li.open').forEach(x => x.classList.remove('open')); closeLightbox(); } });
    const toTop = $('#toTop');
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    const onScroll = () => { header.classList.toggle('is-stuck', scrollY > 10); toTop.classList.toggle('on', scrollY > 700); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* reveal + contadores */
  function animate() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.reveal').forEach(el => io.observe(el));
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      const el = e.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dec = (el.dataset.count.split('.')[1] || '').length;
      if (matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = end + suf; return; }
      const t0 = performance.now(), dur = 1400;
      (function tick(t) { const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec).replace('.', ',') + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
    }), { threshold: .6 });
    $$('[data-count]').forEach(el => co.observe(el));
  }

  /* ---------- renderizadores ---------- */
  const R = {};

  R.numbers = el => {
    const n = D.numeros;
    el.innerHTML = [[n.jogos, 'Jogos disputados', ''], [n.vitorias, 'Vitórias', ''], [n.gols, 'Gols marcados', ''], [n.titulos, 'Título conquistado', '']]
      .map(([v, l, s]) => `<div class="num reveal"><b data-count="${v}" data-suffix="${s}">0</b><span>${l}</span></div>`).join('');
  };

  R.matches = el => {
    const limit = +el.dataset.limit || 99;
    const list = [...D.jogos].sort((a, b) => a.data.localeCompare(b.data));
    if (!list.length) {
      el.innerHTML = `<div class="empty" style="grid-column:1/-1"><i class="fa-regular fa-calendar-check"></i><h3>Calendário em definição</h3><p>O RCA volta às competições em 2027. Os jogos serão divulgados aqui e nas nossas redes assim que as tabelas forem confirmadas.</p><p style="margin-top:14px"><a class="btn btn--navy btn--sm" href="${D.clube.social.instagram}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Acompanhar no Instagram</a></p></div>`;
      return;
    }
    el.innerHTML = list.slice(-limit).reverse().map(j => {
      const done = j.placar != null;
      return `<article class="match reveal"><div class="match__top"><span>${esc(j.campeonato)}</span><span>${fmtDate(j.data)}${j.hora ? ' · ' + esc(j.hora) : ''}</span></div>
      <div class="match__teams">
        <div class="match__team"><div class="crest"><i class="fa-solid fa-shield"></i></div><b>${esc(j.casa)}</b></div>
        <div class="match__score">${done ? esc(j.placar) : 'VS'}<small>${done ? 'ENCERRADO' : 'EM BREVE'}</small></div>
        <div class="match__team"><div class="crest"><i class="fa-solid fa-shield"></i></div><b>${esc(j.fora)}</b></div></div>
      ${j.local ? `<div class="match__foot"><span><i class="fa-solid fa-location-dot"></i>${esc(j.local)}</span></div>` : ''}</article>`;
    }).join('');
  };

  R.comps = el => {
    const l = D.calendario2027 || [];
    if (!l.length) { el.innerHTML = `<div class="empty"><i class="fa-regular fa-calendar"></i><h3>Calendário em definição</h3><p>O RCA volta às competições em 2027. As competições e datas serão divulgadas aqui assim que forem confirmadas.</p></div>`; return; }
    el.innerHTML = l.map(c => `<div class="comp reveal"><div class="comp__m">${esc(c.mes)}</div><div><b>${esc(c.nome)}</b><small>${esc(c.mod)}${c.status ? ' · ' + esc(c.status) : ''}</small></div></div>`).join('');
  };

  const newsCard = n => `<article class="card news-card reveal"><a href="${pg('noticia')}?id=${n.id}" aria-label="${esc(n.titulo)}">
    <div class="news-card__img" style="background-image:url('${img(n.imagem)}')" role="img" aria-label=""><span class="tag">${esc(n.categoria)}</span></div>
    <div class="card__body"><time datetime="${n.data}">${esc(n.dataTxt)}</time><h3>${esc(n.titulo)}</h3><p>${esc(n.resumo)}</p><span class="link-arrow">Ler notícia <i class="fa-solid fa-arrow-right"></i></span></div></a></article>`;

  R.newsHome = el => {
    const sorted = [...D.noticias].sort((a, b) => b.data.localeCompare(a.data));
    const [f, ...rest] = sorted;
    el.innerHTML = `<article class="news-hero reveal"><a class="news-hero__img" style="background-image:url('${img(f.imagem)}')" href="${pg('noticia')}?id=${f.id}" aria-label="${esc(f.titulo)}"></a>
      <div class="news-hero__body"><span class="tag">${esc(f.categoria)}</span><time class="meta" datetime="${f.data}">${esc(f.dataTxt)}</time><h3>${esc(f.titulo)}</h3><p class="lead">${esc(f.resumo)}</p>
      <a class="link-arrow" href="${pg('noticia')}?id=${f.id}">Ler notícia <i class="fa-solid fa-arrow-right"></i></a></div></article>
      ${rest.length ? `<div class="grid grid--3" style="margin-top:24px">${rest.map(newsCard).join('')}</div>` : ''}`;
  };

  R.newsList = el => {
    const cats = ['Todas', ...new Set(D.noticias.map(n => n.categoria))];
    const sorted = [...D.noticias].sort((a, b) => b.data.localeCompare(a.data));
    el.innerHTML = `<div class="filters" role="tablist">${cats.map((c, i) => `<button class="chip ${i ? '' : 'is-on'}" data-c="${esc(c)}" type="button">${esc(c)}</button>`).join('')}</div><div class="grid grid--3" id="newsGrid"></div>`;
    const grid = $('#newsGrid', el);
    const draw = c => { const l = sorted.filter(n => c === 'Todas' || n.categoria === c); grid.innerHTML = l.map(newsCard).join('') || '<div class="empty" style="grid-column:1/-1">Nenhuma notícia nesta categoria ainda.</div>'; $$('.reveal', grid).forEach(x => x.classList.add('in')); };
    el.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip', el).forEach(x => x.classList.toggle('is-on', x === b)); draw(b.dataset.c); });
    draw('Todas');
  };

  R.timeline = el => {
    el.innerHTML = D.timeline.map((t, i) => `<div class="tl reveal"><div class="tl__y">${esc(t.ano)}</div><div class="tl__b"><h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p></div></div>`).join('');
  };

  R.board = el => {
    const g = D.diretoria[el.dataset.group] || [];
    el.innerHTML = g.map(p => `<article class="card person reveal"><div class="person__av ${p.nome ? '' : 'person__av--empty'}">${p.nome ? esc(p.nome.trim()[0]) : '<i class="fa-solid fa-user-plus" style="font-size:1.6rem"></i>'}</div>
      <h3>${esc(p.nome || 'Vaga em aberto')}</h3><div class="role">${esc(p.cargo)}</div><p>${esc(p.texto)}</p>
      ${p.nome ? '' : `<a class="link-arrow" style="margin-top:12px;font-size:.9rem" href="${wa('Olá! Tenho interesse em fazer parte da diretoria do RCA como ' + p.cargo + '.')}" target="_blank" rel="noopener">Quero ajudar <i class="fa-solid fa-arrow-right"></i></a>`}</article>`).join('');
  };

  R.sponsors = el => {
    const l = el.dataset.kind === 'parceiros' ? D.parceiros : D.patrocinadores;
    el.innerHTML = l.map(s => { const t = s.url ? 'a' : 'div'; return `<${t} class="sponsor reveal" ${s.url ? `href="${s.url}" target="_blank" rel="noopener"` : ''} title="${esc(s.nome)}"><img src="${img(s.logo)}" alt="${esc(s.nome)}" loading="lazy"></${t}>`; }).join('');
  };

  R.titles = el => {
    el.innerHTML = D.titulos.map(t => `<div class="trophy reveal"><i class="fa-solid fa-trophy"></i><div><b>${esc(t.nome)}</b>${esc(t.cat)} · ${t.ano} · ${esc(t.org)}</div></div>`).join('');
  };
  R.campaigns = el => {
    el.innerHTML = [...D.campanhas].sort((a, b) => b.ano - a.ano).map(c => `<div class="comp reveal"><div class="comp__m">${c.ano}</div><div><b>${esc(c.nome)}</b><small>${esc(c.org)} · ${esc(c.fase)}</small></div></div>`).join('');
  };
  R.records = el => {
    el.innerHTML = D.recordes.map(r => `<div class="record reveal"><small>${esc(r.k)}</small><b>${esc(r.v)}</b><span>${esc(r.d)}</span></div>`).join('');
  };

  R.playersTable = el => {
    let key = 'pj', dir = -1, q = '';
    const max = Math.max(...D.jogadores.map(p => p.pj));
    el.innerHTML = `<div class="table-tools"><h3>Ranking de jogadores</h3><label class="search"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Buscar jogador ou posição" aria-label="Buscar jogador"></label></div>
      <div class="scroll-x"><table><thead><tr><th>#</th><th data-k="nome">Jogador</th><th data-k="pj" title="Partidas jogadas">PJ</th><th data-k="gm" title="Gols marcados">Gols</th><th data-k="ast" title="Assistências">Assist.</th></tr></thead><tbody></tbody></table></div>`;
    const tb = $('tbody', el);
    const draw = () => {
      const l = D.jogadores.filter(p => (p.nome + ' ' + p.pos).toLowerCase().includes(q))
        .sort((a, b) => key === 'nome' ? a.nome.localeCompare(b.nome) * dir : (a[key] - b[key]) * dir || a.nome.localeCompare(b.nome));
      tb.innerHTML = l.map((p, i) => `<tr><td class="rk">${i + 1}</td><td><div class="pl"><a href="${plink(p)}"><b>${esc(p.nome)}</b></a><small>${esc(p.pos)}</small><span class="bar"><i style="width:${p.pj / max * 100}%"></i></span></div></td><td><b>${p.pj}</b></td><td>${p.gm}</td><td>${p.ast}</td></tr>`).join('') || '<tr><td colspan="5">Nenhum jogador encontrado.</td></tr>';
      $$('th[data-k]', el).forEach(th => th.classList.toggle('sorted', th.dataset.k === key));
    };
    el.addEventListener('click', e => { const th = e.target.closest('th[data-k]'); if (!th) return; const k = th.dataset.k; if (k === key) dir *= -1; else { key = k; dir = k === 'nome' ? 1 : -1; } draw(); });
    $('input', el).addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  };

  R.compsTable = el => {
    el.innerHTML = `<div class="table-tools"><h3>Campeonatos disputados</h3></div><div class="scroll-x"><table><thead><tr><th>#</th><th>Competição</th><th title="Partidas jogadas">PJ</th><th title="Partidas ganhas">V</th><th title="Campeão">🏆</th><th title="Vice">🥈</th><th title="Semifinal">🥉</th></tr></thead>
      <tbody>${D.competicoes.map((c, i) => `<tr><td class="rk">${i + 1}</td><td><div class="pl"><b>${esc(c.nome)}</b></div></td><td>${c.pj}</td><td>${c.vit}</td><td>${c.ouro || '–'}</td><td>${c.prata || '–'}</td><td>${c.bronze || '–'}</td></tr>`).join('')}</tbody></table></div>`;
  };

  R.governance = el => {
    el.innerHTML = D.governanca.map((g, gi) => `<details class="acc reveal" ${gi === 0 ? 'open' : ''}><summary>${esc(g.grupo)}</summary><div class="acc__b"><div class="grid grid--2" style="margin-top:6px">${g.docs.map(d => `
      <div class="doc"><div class="doc__ic"><i class="fa-regular fa-file-pdf"></i></div><div><h4>${esc(d.t)}</h4><p>${esc(d.d)}</p><div class="meta"><span class="tag tag--navy">${esc(d.ano)}</span>
      ${d.arquivo ? `<a class="link-arrow" href="${esc(d.arquivo)}" download><i class="fa-solid fa-download"></i> Baixar PDF</a>` : '<span class="soon">Em breve</span>'}</div></div></div>`).join('')}</div></div></details>`).join('');
  };

  R.gallery = el => {
    el.innerHTML = D.galeria.map((g, i) => `<figure class="reveal" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar: ${esc(g.legenda)}"><img src="${img(g.src)}" alt="${esc(g.legenda)}" loading="lazy"><figcaption>${esc(g.legenda)}</figcaption></figure>`).join('');
    const lb = document.createElement('div'); lb.className = 'lightbox'; lb.id = 'lb'; lb.innerHTML = '<button type="button" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button><div><img alt=""><p></p></div>';
    body.appendChild(lb);
    const open = f => { const g = D.galeria[+f.dataset.i]; $('img', lb).src = img(g.src); $('img', lb).alt = g.legenda; $('p', lb).textContent = g.legenda; lb.classList.add('on'); };
    el.addEventListener('click', e => { const f = e.target.closest('figure'); if (f) open(f); });
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { const f = e.target.closest('figure'); if (f) open(f); } });
    lb.addEventListener('click', closeLightbox);
  };
  function closeLightbox() { $('#lb')?.classList.remove('on'); }

  R.squad = el => {
    const mod = el.dataset.mod, list = D.elenco[mod] || [];
    const label = { futsal: 'futsal', fut7: 'fut7', feminino: 'futebol feminino' }[mod];
    if (!list.length) {
      el.innerHTML = `<div class="empty"><i class="fa-solid fa-people-group"></i><h3>Elenco 2027 em formação</h3><p>A lista oficial de atletas e comissão técnica será publicada assim que o grupo for fechado. Quer defender as cores do RCA?</p>
      <p style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn--gold btn--sm" href="${pg('seja-rca')}#inscricao">Quero fazer parte</a><a class="btn btn--outline btn--sm" href="${wa('Olá! Quero saber como participar do elenco de ' + label + ' do RCA.')}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Chamar no WhatsApp</a></p></div>`;
      return;
    }
    const groups = {}; list.forEach(p => (groups[p.pos] = groups[p.pos] || []).push(p));
    el.innerHTML = Object.entries(groups).map(([pos, ps]) => `<h3 style="color:var(--navy);margin:28px 0 14px">${esc(pos)}</h3><div class="grid grid--3">${ps.map(p => `
      <div class="card player reveal"><div class="player__n">${esc(p.num ?? '–')}</div><div><b style="color:var(--navy)">${esc(p.nome)}</b>${p.capitao ? ' <span class="tag">Capitão</span>' : ''}<div class="meta">${esc(p.pos)} · ${p.jogos ?? 0} jogos · ${p.gols ?? 0} gols</div></div></div>`).join('')}</div>`).join('');
  };

  /* artigo */
  R.article = el => {
    const id = new URLSearchParams(location.search).get('id') || D.noticias[0].id;
    const n = D.noticias.find(x => x.id === id);
    if (!n) { el.innerHTML = `<div class="empty"><h3>Notícia não encontrada</h3><p><a class="link-arrow" href="${pg('noticias')}">Ver todas as notícias</a></p></div>`; return; }
    document.title = `${n.titulo} | RCA`;
    $('meta[name=description]')?.setAttribute('content', n.resumo);
    $('#artTag').textContent = n.categoria; $('#artTitle').textContent = n.titulo; $('#artSub').textContent = n.resumo;
    $('#artMeta').innerHTML = `<i class="fa-regular fa-calendar"></i> ${esc(n.dataTxt)} &nbsp;·&nbsp; <i class="fa-solid fa-location-dot"></i> Aracaju, SE`;
    $('#artCover').style.backgroundImage = `url('${img(n.imagem)}')`;
    el.innerHTML = (window.RCA_ARTICLES || {})[n.id] || `<p>${esc(n.resumo)}</p>`;
    const url = encodeURIComponent(location.href), t = encodeURIComponent(n.titulo);
    $('#share').innerHTML = `<b>Compartilhar:</b> <a class="btn btn--outline btn--sm" target="_blank" rel="noopener" href="https://wa.me/?text=${t}%20${url}"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
      <a class="btn btn--outline btn--sm" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${url}"><i class="fa-brands fa-facebook"></i> Facebook</a>
      <button class="btn btn--outline btn--sm" id="copyLink" type="button"><i class="fa-regular fa-copy"></i> Copiar link</button>`;
    $('#copyLink').addEventListener('click', e => { navigator.clipboard?.writeText(location.href); e.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> Copiado'; });
    const others = D.noticias.filter(x => x.id !== n.id).slice(0, 3);
    $('#more').innerHTML = others.map(newsCard).join('');
    $$('#more .reveal').forEach(x => x.classList.add('in'));
  };

  /* ================= novos módulos: jogadores, classificação, cotas, loja, transmissão ================= */
  const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const brl = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  };
  const plink = p => `${pg('jogador')}?id=${p.slug}`;
  const avatar = (p, cls = '') => p.foto
    ? `<img class="av ${cls}" src="${img(p.foto)}" alt="${esc(p.nome)}" loading="lazy">`
    : `<span class="av ${cls}" aria-hidden="true">${esc(String(p.nome).trim().charAt(0).toUpperCase())}</span>`;

  function prepPlayers() {
    const seen = new Set();
    (D.jogadores || []).forEach(p => { const s = slug(p.nome); let k = s, n = 2; while (seen.has(k)) k = s + '-' + n++; seen.add(k); p.slug = k; });
  }

  /* diretório de jogadores */
  R.playersDir = el => {
    const tokens = [...new Set(D.jogadores.flatMap(p => p.pos.split('/')))].sort();
    let q = '', pos = 'Todos';
    el.innerHTML = `<div class="table-tools" style="border:1px solid var(--line);border-radius:var(--radius);background:#fff;margin-bottom:22px">
      <div class="filters" style="margin:0">${['Todos', ...tokens].map((t, i) => `<button class="chip ${i ? '' : 'is-on'}" data-p="${esc(t)}" type="button">${esc(t)}</button>`).join('')}</div>
      <label class="search"><i class="fa-solid fa-magnifying-glass"></i><input type="search" placeholder="Buscar jogador" aria-label="Buscar jogador"></label></div>
      <p class="meta" id="pdCount" style="margin-bottom:14px"></p><div class="grid grid--3" id="pdGrid"></div>`;
    const grid = $('#pdGrid', el), count = $('#pdCount', el);
    const draw = () => {
      const l = D.jogadores.filter(p => (pos === 'Todos' || p.pos.split('/').includes(pos)) && p.nome.toLowerCase().includes(q))
        .sort((a, b) => b.pj - a.pj || a.nome.localeCompare(b.nome));
      count.textContent = `${l.length} ${l.length === 1 ? 'jogador' : 'jogadores'}`;
      grid.innerHTML = l.map(p => `<a class="card pcard" href="${plink(p)}">${avatar(p)}<div class="pcard__n"><b>${esc(p.nome)}</b><span class="meta">${esc(p.pos)}</span></div>
        <div class="pcard__s"><span><b>${p.pj}</b>jogos</span><span><b>${p.gm}</b>gols</span><span><b>${p.ast}</b>assist.</span></div></a>`).join('')
        || '<div class="empty" style="grid-column:1/-1">Nenhum jogador encontrado.</div>';
    };
    el.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; pos = b.dataset.p; $$('.chip', el).forEach(x => x.classList.toggle('is-on', x === b)); draw(); });
    $('input', el).addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); draw(); });
    draw();
  };

  /* perfil individual */
  R.playerProfile = el => {
    const sorted = [...D.jogadores].sort((a, b) => b.pj - a.pj || a.nome.localeCompare(b.nome));
    const id = new URLSearchParams(location.search).get('id');
    const i = sorted.findIndex(p => p.slug === id);
    if (i < 0) {
      $('#plName').textContent = 'Jogador não encontrado'; $('#plPos').textContent = '';
      el.innerHTML = `<div class="empty"><i class="fa-solid fa-user-slash"></i><h3>Não encontramos esse jogador</h3><p><a class="link-arrow" href="${pg('jogadores')}">Ver todos os jogadores <i class="fa-solid fa-arrow-right"></i></a></p></div>`;
      return;
    }
    const p = sorted[i], n = sorted.length;
    document.title = `${p.nome} | RCA Real Clube Atlético`;
    $('meta[name=description]')?.setAttribute('content', `Perfil de ${p.nome} (${p.pos}) no RCA: ${p.pj} jogos, ${p.gm} gols e ${p.ast} assistências.`);
    $('#plName').textContent = p.nome;
    $('#plPos').textContent = p.pos + (p.num != null ? ` · camisa ${p.num}` : '');
    const rank = k => 1 + D.jogadores.filter(q => q[k] > p[k]).length;
    const top = k => Math.max(1, ...D.jogadores.map(q => q[k]));
    const gpj = p.pj ? (p.gm / p.pj).toFixed(2).replace('.', ',') : '0,00';
    const rows = [['pj', 'Jogos'], ['gm', 'Gols'], ['ast', 'Assistências']].map(([k, l]) => `
      <div class="rank-row"><div class="rank-row__h"><b>${l}</b><span>${p[k]} · <em>#${rank(k)} de ${n}</em></span></div><span class="bar"><i style="width:${p[k] / top(k) * 100}%"></i></span></div>`).join('');
    const prev = sorted[i - 1], next = sorted[i + 1];
    const msg = wa(`Olá! Sou ${p.nome} e quero completar meu perfil no site do RCA.`);
    el.innerHTML = `<div class="pl-grid">
      <aside class="card pl-side reveal">${avatar(p, 'av--xl')}<h2>${esc(p.nome)}</h2><span class="tag">${esc(p.pos)}</span>
        ${p.bio ? `<p class="pl-bio">${esc(p.bio)}</p>` : `<p class="pl-bio pl-bio--empty">Este perfil ainda não tem foto nem história. É você, ${esc(p.nome)}? <a class="link-arrow" href="${msg}" target="_blank" rel="noopener">Fale com a gente</a> para completar.</p>`}
        <button class="btn btn--outline btn--sm" id="plCopy" type="button"><i class="fa-regular fa-copy"></i> Copiar link do perfil</button></aside>
      <div>
        <div class="facts">
          <div class="fact reveal"><b>${p.pj}</b><span>Jogos</span></div><div class="fact reveal"><b>${p.gm}</b><span>Gols</span></div>
          <div class="fact reveal"><b>${p.ast}</b><span>Assistências</span></div><div class="fact reveal"><b>${p.gm + p.ast}</b><span>Participações em gols</span></div>
          <div class="fact reveal"><b>${gpj}</b><span>Gols por jogo</span></div></div>
        <div class="card card__body reveal"><h3 style="color:var(--navy);margin-bottom:14px">Posição no ranking do clube</h3>${rows}
          <p class="meta" style="margin-top:14px">Estatísticas históricas do clube. A posição compara este jogador com os ${n} do ranking.</p></div>
      </div></div>
      <nav class="pl-nav" aria-label="Outros jogadores">
        ${prev ? `<a class="card" href="${plink(prev)}"><small>← Anterior no ranking</small><b>${esc(prev.nome)}</b></a>` : '<span></span>'}
        ${next ? `<a class="card" href="${plink(next)}"><small>Próximo no ranking →</small><b>${esc(next.nome)}</b></a>` : '<span></span>'}
      </nav>
      <p style="text-align:center;margin-top:30px"><a class="link-arrow" href="${pg('jogadores')}">Ver todos os jogadores <i class="fa-solid fa-arrow-right"></i></a></p>`;
    $('#plCopy').addEventListener('click', e => { navigator.clipboard?.writeText(location.href); e.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> Link copiado'; });
  };

  /* classificação */
  R.standings = el => {
    const list = D.classificacao || [];
    if (!list.length) {
      el.innerHTML = `<div class="empty"><i class="fa-solid fa-ranking-star"></i><h3>Classificação a partir de 2027</h3><p>A tabela e os artilheiros aparecem aqui assim que o RCA entrar em campeonato. O retorno às competições está previsto para 2027.</p>
        <p style="margin-top:14px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn--navy btn--sm" href="${pg('estatisticas')}">Ver estatísticas históricas</a><a class="btn btn--outline btn--sm" href="${pg('calendario')}">Calendário</a></p></div>`;
      return;
    }
    el.innerHTML = `<div class="filters">${list.map((c, i) => `<button class="chip ${i ? '' : 'is-on'}" data-i="${i}" type="button">${esc(c.competicao)}</button>`).join('')}</div><div id="stBody"></div>`;
    const body = $('#stBody', el);
    const draw = i => {
      const c = list[i];
      const rows = c.tabela.map(t => ({ ...t, sg: t.gp - t.gc, pts: t.v * 3 + t.e })).sort((a, b) => b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp);
      const mine = t => /rca|real clube/i.test(t);
      body.innerHTML = `<div class="table-wrap"><div class="table-tools"><h3>${esc(c.competicao)}</h3>${c.atualizado ? `<span class="meta">Atualizado em ${fmtDate(c.atualizado)}</span>` : ''}</div>
        <div class="scroll-x"><table><thead><tr><th>#</th><th>Time</th><th title="Pontos">Pts</th><th title="Jogos">J</th><th title="Vitórias">V</th><th title="Empates">E</th><th title="Derrotas">D</th><th title="Gols pró">GP</th><th title="Gols contra">GC</th><th title="Saldo de gols">SG</th></tr></thead><tbody>
        ${rows.map((t, k) => `<tr class="${mine(t.time) ? 'is-me' : ''}"><td class="rk">${k + 1}</td><td><div class="pl"><b>${esc(t.time)}</b></div></td><td><b>${t.pts}</b></td><td>${t.v + t.e + t.d}</td><td>${t.v}</td><td>${t.e}</td><td>${t.d}</td><td>${t.gp}</td><td>${t.gc}</td><td>${t.sg > 0 ? '+' : ''}${t.sg}</td></tr>`).join('')}
        </tbody></table></div></div>
        ${(c.artilheiros || []).length ? `<div class="table-wrap" style="margin-top:24px"><div class="table-tools"><h3>Artilheiros</h3></div><div class="scroll-x"><table><thead><tr><th>#</th><th>Jogador</th><th>Time</th><th>Gols</th></tr></thead><tbody>${[...c.artilheiros].sort((a, b) => b.gols - a.gols).map((a, k) => `<tr><td class="rk">${k + 1}</td><td><div class="pl"><b>${esc(a.nome)}</b></div></td><td>${esc(a.time || '')}</td><td><b>${a.gols}</b></td></tr>`).join('')}</tbody></table></div></div>` : ''}`;
    };
    el.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip', el).forEach(x => x.classList.toggle('is-on', x === b)); draw(+b.dataset.i); });
    draw(0);
  };

  /* cotas de patrocínio */
  R.tiers = el => {
    el.innerHTML = (D.cotas || []).map(c => `<article class="card tier ${c.destaque ? 'tier--hl' : ''} reveal">${c.destaque ? '<span class="tier__flag">Destaque</span>' : ''}
      <h3>${esc(c.nome)}</h3><div class="tier__price">${c.valor ? esc(c.valor) : 'Sob consulta'}<small>${esc(c.periodo || '')}</small></div>
      <ul>${c.beneficios.map(b => `<li><i class="fa-solid fa-check"></i>${esc(b)}</li>`).join('')}</ul>
      <a class="btn ${c.destaque ? 'btn--gold' : 'btn--navy'}" href="${wa('Olá! Tenho interesse na cota ' + c.nome + ' de patrocínio do RCA.')}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Quero a cota ${esc(c.nome)}</a></article>`).join('');
  };

  /* plataformas de transmissão */
  R.platforms = el => {
    el.innerHTML = (D.plataformas || []).map(p => `<a class="card platform reveal" href="${esc(p.url)}" target="_blank" rel="noopener"><i class="${esc(p.icon)}"></i>
      <div><b>${esc(p.nome)}</b><span class="meta">${esc(p.handle)}</span><p>${esc(p.texto)}</p></div><span class="link-arrow">Seguir <i class="fa-solid fa-arrow-up-right-from-square"></i></span></a>`).join('');
  };

  /* lista de transmissão do WhatsApp */
  R.broadcast = el => {
    const canal = D.clube.canalWhatsApp;
    el.innerHTML = `<div class="broadcast reveal"><div><span class="eyebrow">Fique por dentro</span><h2>Receba as novidades da Realeza no WhatsApp</h2>
      <p>Jogos, resultados, seleção de atletas e a volta do RCA em 2027, direto no seu celular.</p></div>
      <form class="broadcast__form"><label class="sr-only" for="bc-nome">Seu nome</label><input id="bc-nome" name="nome" placeholder="Seu nome" autocomplete="name">
        <button class="btn btn--wa" type="submit"><i class="fa-brands fa-whatsapp"></i> Entrar na lista</button>
        <small>${canal ? 'Você será levado ao canal oficial do RCA no WhatsApp.' : 'Vamos abrir uma conversa com o clube no WhatsApp para confirmar sua entrada.'}</small></form></div>`;
    $('form', el).addEventListener('submit', e => {
      e.preventDefault();
      const nome = $('input', el).value.trim();
      const url = canal || wa(`Olá! Quero receber as novidades do RCA na lista de transmissão.${nome ? ' Meu nome é ' + nome + '.' : ''}`);
      window.open(url, '_blank', 'noopener');
    });
  };

  /* loja com carrinho → WhatsApp */
  R.shop = el => {
    const prods = ((D.loja && D.loja.produtos) || []).filter(p => p.ativo !== false);
    if (!prods.length) {
      el.innerHTML = `<div class="empty"><i class="fa-solid fa-shirt"></i><h3>Loja oficial em breve</h3><p>Uniformes e acessórios do RCA chegam por aqui. Entre na lista de transmissão abaixo para ser avisado quando os pedidos abrirem.</p></div>`;
      return;
    }
    const find = id => prods.find(p => p.id === id);
    let cart = store.get('rca_cart', []);
    cart = (Array.isArray(cart) ? cart : []).filter(c => c && find(c.id) && c.qty > 0).map(c => ({ id: c.id, size: c.size || '', qty: Math.min(99, Math.floor(c.qty)) }));
    const cats = [...new Set(prods.map(p => p.categoria).filter(Boolean))];
    el.innerHTML = `${cats.length > 1 ? `<div class="filters">${['Todos', ...cats].map((c, i) => `<button class="chip ${i ? '' : 'is-on'}" data-c="${esc(c)}" type="button">${esc(c)}</button>`).join('')}</div>` : ''}<div class="grid grid--3" id="shopGrid"></div>`;
    const grid = $('#shopGrid', el);
    const card = p => `<article class="card prod" data-id="${esc(p.id)}">
      <div class="prod__img">${p.imagem ? `<img src="${img(p.imagem)}" alt="${esc(p.nome)}" loading="lazy">` : '<i class="fa-solid fa-shirt" aria-hidden="true"></i>'}${p.esgotado ? '<span class="tag tag--navy prod__flag">Esgotado</span>' : ''}</div>
      <div class="card__body">${p.categoria ? `<span class="tag">${esc(p.categoria)}</span>` : ''}<h3 style="color:var(--navy);margin-top:8px">${esc(p.nome)}</h3>
        ${p.descricao ? `<p class="meta" style="margin:6px 0 4px;font-weight:500">${esc(p.descricao)}</p>` : ''}
        <div class="prod__price">${p.preco != null ? brl(p.preco) : 'Consulte'}</div>
        ${(p.tamanhos || []).length ? `<div class="sizes" role="group" aria-label="Tamanho">${p.tamanhos.map(t => `<button class="size" type="button" data-size="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>` : ''}
        <p class="prod__err" role="alert" hidden>Escolha um tamanho.</p>
        <button class="btn btn--gold btn--sm" data-add type="button" ${p.esgotado ? 'disabled' : ''}><i class="fa-solid fa-bag-shopping"></i> ${p.esgotado ? 'Indisponível' : 'Adicionar'}</button></div></article>`;
    const draw = c => { grid.innerHTML = prods.filter(p => !c || c === 'Todos' || p.categoria === c).map(card).join(''); };
    draw('Todos');

    /* carrinho (gaveta lateral) */
    const drawer = document.createElement('div');
    drawer.className = 'drawer'; drawer.id = 'drawer'; drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `<div class="drawer__bg" data-close></div><aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Seu pedido">
      <header><h3>Seu pedido</h3><button type="button" data-close aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button></header>
      <div class="drawer__items" id="cartItems"></div>
      <footer><div class="drawer__total"><span>Total</span><b id="cartTotal"></b></div><p class="form-note" id="cartNote" hidden>Há itens a consultar. Eles não estão incluídos no total acima.</p>
        <div class="field"><label for="cartNome">Seu nome</label><input id="cartNome" autocomplete="name"><p class="prod__err" id="cartErr" role="alert" hidden>Informe seu nome para finalizar.</p></div>
        <div class="field"><label for="cartObs">Observações (opcional)</label><textarea id="cartObs" style="min-height:70px"></textarea></div>
        <button class="btn btn--wa" id="checkout" type="button"><i class="fa-brands fa-whatsapp"></i> Finalizar pelo WhatsApp</button>
        <p class="form-note">O pedido é enviado por WhatsApp. Pagamento e entrega são combinados diretamente com o clube.</p></footer></aside>`;
    body.appendChild(drawer);
    const cb = document.createElement('button');
    cb.className = 'cartbtn'; cb.id = 'cartBtn'; cb.type = 'button'; cb.setAttribute('aria-label', 'Abrir carrinho');
    cb.innerHTML = '<i class="fa-solid fa-bag-shopping"></i><span id="cartCount">0</span>';
    const fab = $('.fab'); fab.insertBefore(cb, fab.querySelector('.wa'));

    const totals = () => ({ priced: cart.every(c => find(c.id).preco != null), sum: cart.reduce((s, c) => s + (find(c.id).preco || 0) * c.qty, 0) });
    const renderCart = () => {
      store.set('rca_cart', cart);
      const count = cart.reduce((s, c) => s + c.qty, 0);
      $('#cartCount').textContent = count; cb.classList.toggle('has', count > 0);
      $('#cartItems').innerHTML = cart.length ? cart.map((c, i) => { const p = find(c.id); return `<div class="citem"><div><b>${esc(p.nome)}</b><span class="meta">${c.size ? 'Tam. ' + esc(c.size) + ' · ' : ''}${p.preco != null ? brl(p.preco) : 'Consulte'}</span></div>
        <div class="qty"><button type="button" data-act="dec" data-i="${i}" aria-label="Diminuir">−</button><span>${c.qty}</span><button type="button" data-act="inc" data-i="${i}" aria-label="Aumentar">+</button></div>
        <button type="button" class="citem__x" data-act="del" data-i="${i}" aria-label="Remover"><i class="fa-regular fa-trash-can"></i></button></div>`; }).join('')
        : '<p class="meta" style="padding:22px 0">Seu carrinho está vazio.</p>';
      const t = totals();
      $('#cartTotal').textContent = brl(t.sum); $('#cartNote').hidden = !cart.length || t.priced;
      $('#checkout').disabled = !cart.length;
    };
    const toggle = on => {
      drawer.classList.toggle('on', on); drawer.setAttribute('aria-hidden', String(!on)); body.style.overflow = on ? 'hidden' : '';
      if (on) $('.drawer__panel button', drawer).focus(); else cb.focus({ preventScroll: true });
    };
    cb.addEventListener('click', () => toggle(true));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('on')) toggle(false); });
    drawer.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) return toggle(false);
      const b = e.target.closest('[data-act]'); if (!b) return;
      const c = cart[+b.dataset.i]; if (!c) return;
      if (b.dataset.act === 'inc') c.qty = Math.min(99, c.qty + 1); else if (b.dataset.act === 'dec') c.qty--; else c.qty = 0;
      cart = cart.filter(x => x.qty > 0); renderCart();
    });
    $('#checkout').addEventListener('click', () => {
      const nome = $('#cartNome').value.trim();
      if (!nome) { $('#cartErr').hidden = false; $('#cartNome').focus(); return; }
      $('#cartErr').hidden = true;
      const t = totals();
      const lines = cart.map(c => { const p = find(c.id); return `• ${c.qty}x ${p.nome}${c.size ? ' (Tam. ' + c.size + ')' : ''} — ${p.preco != null ? brl(p.preco * c.qty) : 'consultar'}`; });
      const obs = $('#cartObs').value.trim();
      const msg = `Olá! Quero fazer um pedido na loja do RCA:\n\n${lines.join('\n')}\n\n*Total:* ${brl(t.sum)}${t.priced ? '' : ' + itens a consultar'}\n\n*Nome:* ${nome}${obs ? '\n*Obs.:* ' + obs : ''}`;
      window.open(wa(msg), '_blank', 'noopener');
    });
    el.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (chip) { $$('.chip', el).forEach(x => x.classList.toggle('is-on', x === chip)); draw(chip.dataset.c); return; }
      const sz = e.target.closest('.size');
      if (sz) { const wrap = sz.parentElement; $$('.size', wrap).forEach(x => { const on = x === sz; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); }); $('.prod__err', sz.closest('.prod')).hidden = true; return; }
      const add = e.target.closest('[data-add]');
      if (add) {
        const art = add.closest('.prod'), p = find(art.dataset.id), size = $('.size.is-on', art)?.dataset.size || '';
        if ((p.tamanhos || []).length && !size) { $('.prod__err', art).hidden = false; return; }
        const same = cart.find(c => c.id === p.id && c.size === size);
        if (same) same.qty = Math.min(99, same.qty + 1); else cart.push({ id: p.id, size, qty: 1 });
        renderCart();
        add.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado'; setTimeout(() => { add.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Adicionar'; }, 1400);
      }
    });
    renderCart();
  };

  /* formulários → WhatsApp (sem backend) */
  function bindForms() {
    $$('form[data-wa]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(f), lines = [];
      fd.forEach((v, k) => { if (v) lines.push(`*${f.querySelector(`[name="${k}"]`)?.dataset.label || k}:* ${v}`); });
      const txt = `${f.dataset.wa}\n\n${lines.join('\n')}`;
      window.open(wa(txt), '_blank', 'noopener');
    }));
  }

  /* SEO dinâmico: JSON-LD */
  function jsonld() {
    if (PAGE !== 'home') return;
    const s = document.createElement('script'); s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'SportsTeam', name: D.clube.nome, alternateName: 'RCA', sport: 'Futsal, Futebol 7, Futebol Feminino',
      foundingDate: String(D.clube.fundacao), url: SITE, logo: `${SITE}/pages/images/escudo.png`, telephone: '+' + D.clube.whatsapp,
      location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Aracaju', addressRegion: 'SE', addressCountry: 'BR' } },
      sameAs: Object.values(D.clube.social)
    });
    document.head.appendChild(s);
  }

  /* ---------- init ---------- */
  function init() {
    prepPlayers();
    mountLayout();
    bindGlobal();
    $$('[data-render]').forEach(el => { const fn = R[el.dataset.render]; if (fn) fn(el); });
    bindForms(); jsonld(); animate();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register(ROOT + 'sw.js').catch(() => { });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
