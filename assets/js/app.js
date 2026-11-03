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
    { t: 'Clube', ids: ['clube', 'diretoria', 'simbolos', 'governanca'], items: [
      ['clube', 'fa-crown', 'Sobre o Clube'], ['diretoria', 'fa-users', 'Diretoria'], ['simbolos', 'fa-shield-halved', 'Símbolos'], ['governanca', 'fa-scale-balanced', 'Governança']] },
    { t: 'História', ids: ['historia', 'titulos', 'estatisticas', '2022'], items: [
      ['historia', 'fa-landmark', 'Nossa História'], ['titulos', 'fa-trophy', 'Títulos e Campanhas'], ['estatisticas', 'fa-chart-line', 'Estatísticas'], ['2022', 'fa-medal', 'Redegol 2022']] },
    { t: 'Equipes', ids: ['futsal', 'fut7', 'feminino'], items: [
      ['futsal', 'fa-futbol', 'Futsal'], ['fut7', 'fa-person-running', 'Fut7'], ['feminino', 'fa-venus', 'Feminino']] },
    { t: 'Calendário', href: pg('calendario'), id: 'calendario' },
    { t: 'Imprensa', ids: ['noticias', 'noticia', 'fotos', 'rcatv', 'fichas'], items: [
      ['noticias', 'fa-newspaper', 'Notícias'], ['fotos', 'fa-images', 'Fotos'], ['rcatv', 'fa-circle-play', 'RCAtv'], ['fichas', 'fa-clipboard-list', 'Fichas Técnicas']] },
    { t: 'Parceiros', href: pg('patrocinadores'), id: 'patrocinadores' },
    { t: 'Contato', href: pg('contato'), id: 'contato' }
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
          <li><a href="${pg('feminino')}">Feminino</a></li><li><a href="${pg('calendario')}">Calendário</a></li></ul></div>
        <div><h4>Fale conosco</h4><ul>
          <li><a href="${pg('noticias')}">Notícias</a></li><li><a href="${pg('fotos')}">Fotos</a></li>
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
      el.innerHTML = `<div class="empty" style="grid-column:1/-1"><i class="fa-regular fa-calendar-check"></i><h3>Calendário em definição</h3><p>Os próximos jogos serão divulgados aqui e nas nossas redes assim que as tabelas forem confirmadas.</p><p style="margin-top:14px"><a class="btn btn--navy btn--sm" href="${D.clube.social.instagram}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram"></i> Acompanhar no Instagram</a></p></div>`;
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

  R.comps2026 = el => {
    el.innerHTML = D.competicoes2026.map(c => `<div class="comp reveal"><div class="comp__m">${esc(c.mes)}</div><div><b>${esc(c.nome)}</b><small>${esc(c.mod)} · ${esc(c.status || 'anunciado em jan/2026')}</small></div></div>`).join('');
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
      tb.innerHTML = l.map((p, i) => `<tr><td class="rk">${i + 1}</td><td><div class="pl"><b>${esc(p.nome)}</b><small>${esc(p.pos)}</small><span class="bar"><i style="width:${p.pj / max * 100}%"></i></span></div></td><td><b>${p.pj}</b></td><td>${p.gm}</td><td>${p.ast}</td></tr>`).join('') || '<tr><td colspan="5">Nenhum jogador encontrado.</td></tr>';
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
      el.innerHTML = `<div class="empty"><i class="fa-solid fa-people-group"></i><h3>Elenco 2026 em formação</h3><p>A lista oficial de atletas e comissão técnica será publicada assim que o grupo for fechado. Quer defender as cores do RCA?</p>
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
    mountLayout();
    bindGlobal();
    $$('[data-render]').forEach(el => { const fn = R[el.dataset.render]; if (fn) fn(el); });
    bindForms(); jsonld(); animate();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register(ROOT + 'sw.js').catch(() => { });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
