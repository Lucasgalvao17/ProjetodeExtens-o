/* Amazônia Viva - script.js
   Sistema interativo: passeios (CRUD), reservas, contatos, dashboard
   Tudo salvo em localStorage para funcionar offline (apresentação).
   Versão corrigida com seed de passeios para aparecerem automaticamente.
*/

// ---------- Helpers ----------
const storage = {
  passeiosKey: 'av_passeios_v1',
  bookingsKey: 'av_reservas_v1',
  contactsKey: 'av_contatos_v1',
  load(key){ return JSON.parse(localStorage.getItem(key) || '[]'); },
  save(key, data){ localStorage.setItem(key, JSON.stringify(data)); },
  clearAll(){ 
    localStorage.removeItem(this.passeiosKey); 
    localStorage.removeItem(this.bookingsKey); 
    localStorage.removeItem(this.contactsKey); 
  }
};

function formatCurrency(v){ 
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
}
function nowTime(){ 
  return new Date().toLocaleString('pt-BR'); 
}

// ---------- Seed (passeios iniciais) ----------
function getSeedPasseios(){
  return [
    {
      nome: "Vale das Cachoeiras",
      local: "Nova União, Rondônia",
      duracao: "meio-dia",
      preco: 120.00,
      categoria: "aventura",
      descricao: "Um dos locais mais visitados de Rondônia, o Vale das Cachoeiras possui quedas d’água de águas cristalinas cercadas por vegetação amazônica. Ideal para banhos, caminhadas e fotografia.",
      image: "fotos/imagensPontosTuristicos/valedascachoeiras.jpg"
    },
    {
      nome: "Forte Príncipe da Beira",
      local: "Costa Marques, Rondônia",
      duracao: "2h",
      preco: 0.00,
      categoria: "cultural",
      descricao: "Construído no século XVIII, o Forte Príncipe da Beira é uma das maiores fortalezas coloniais fora da Europa. Ponto histórico às margens do rio Guaporé, importante simbolo da região.",
      image: "fotos/imagensPontosTuristicos/forteprincipe.jpeg"
    },
    {
      nome: "Encontro das Águas Mamoré / Pacaás Novos",
      local: "Guajará-Mirim, Rondônia",
      duracao: "2-4h",
      preco: 80.00,
      categoria: "ecoturismo",
      descricao: "Fenômeno natural onde os rios se encontram com cores distintas. Passeio de barco recomendado para observação de fauna, fotografia e contemplação da paisagem ribeirinha.",
      image: "fotos/imagensPontosTuristicos/encontrodaságuas.jpg"
    },
    {
      nome: "Cachoeira 2 de Novembro",
      local: "Machadinho D’Oeste, Rondônia",
      duracao: "meio-dia",
      preco: 60.00,
      categoria: "aventura",
      descricao: "Quedas d'água com poços para banho e áreas verdes ao redor. Excelente para relaxar em meio à natureza e realizar trilhas leves.",
      image: "fotos/imagensPontosTuristicos/2denovembro.jpg"
    },
    {
      nome: "Cachoeira das Araras",
      local: "Vilhena, Rondônia",
      duracao: "meio-dia",
      preco: 50.00,
      categoria: "aventura",
      descricao: "Rodeada por vegetação nativa e conhecida pela presença de araras, a cachoeira oferece contato direto com a fauna local e águas limpas para banho.",
      image: "fotos/imagensPontosTuristicos/cachoeira-das-araras.webp"
    },
    {
      nome: "Morro Chico Mendes",
      local: "Ouro Preto do Oeste, Rondônia",
      duracao: "manhã/tarde",
      preco: 30.00,
      categoria: "ecoturismo",
      descricao: "Ponto de contemplação que homenageia Chico Mendes. Trilhas, mirantes e visão panorâmica da paisagem amazônica fazem parte do passeio.",
      image: "fotos/imagensPontosTuristicos/Morro-Chico-Mendes.jpg"
    },
    {
      nome: "Cachoeira do Rio Cautário",
      local: "Costa Marques, Rondônia",
      duracao: "dia inteiro",
      preco: 100.00,
      categoria: "ecoturismo",
      descricao: "Cachoeira localizada na Reserva Extrativista do Rio Cautário. Ambiente rústico e preservado, ideal para ecoturismo consciente e contato com comunidades locais.",
      image: "fotos/imagensPontosTuristicos/cachoeirariocautario.webp"
    },
    {
      nome: "Parque Estadual Serra dos Reis",
      local: "São Francisco do Guaporé / Costa Marques, Rondônia",
      duracao: "dia inteiro",
      preco: 0.00,
      categoria: "ecoturismo",
      descricao: "Parque estadual com rica biodiversidade, trilhas e formações rochosas. Excelente para pesquisa, observação de aves e trilhas na natureza.",
      image: "fotos/imagensPontosTuristicos/PARQUE-SERRA-DOS-REIS.jpg"
    },
    {
      nome: "Museu Madeira-Mamoré",
      local: "Porto Velho, Rondônia",
      duracao: "1-2h",
      preco: 10.00,
      categoria: "cultural",
      descricao: "Museu que preserva a história da Estrada de Ferro Madeira-Mamoré, com locomotivas, fotos históricas e artefatos que contam a saga da ferrovia na Amazônia.",
      image: "fotos/imagensPontosTuristicos/museuefmm.webp"
    }
  ];
}

// Seed apenas se não houver passeios gravados
function ensureSeedPasseios(){
  const existing = getPasseios();
  if(!existing || existing.length === 0){
    const seed = getSeedPasseios();
    // save seed
    savePasseios(seed);
  }
}

// ---------- Inicialização única ----------
document.addEventListener('DOMContentLoaded', () => {
  // garantir seed
  ensureSeedPasseios();

  // UI: botão topo
  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', () => topBtn.style.display = window.scrollY > 300 ? 'block' : 'none');
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // reveal animation (se houver elementos com data-anim)
  function reveal(){
    document.querySelectorAll('[data-anim]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 60) el.classList.add('in');
    });
  }
  reveal();
  window.addEventListener('scroll', reveal);

  // popular select rápido (home)
  const qb_trip = document.getElementById('qb_trip');
  if (qb_trip) populatePasseiosSelect(qb_trip);

  // inicializações de páginas
  renderPasseiosTable();       // se estiver em cadastro.html
  refreshPasseiosOnPublic();   // se estiver em passeios.html
  updateDashboardStats();      // se estiver em dashboard.html
  renderRecentBookings();      // se estiver onde há recentBookings

  // listeners de busca/filtro (se existem)
  const searchInput = document.getElementById('searchPasseios');
  if (searchInput){
    searchInput.addEventListener('input', applyPasseiosFilters);
    document.getElementById('filterDuration')?.addEventListener('change', applyPasseiosFilters);
    document.getElementById('clearFilters')?.addEventListener('click', () => {
      document.getElementById('searchPasseios').value = '';
      document.getElementById('filterDuration').value = '';
      refreshPasseiosOnPublic();
    });
  }

  // Form quick booking (home)
  const quickForm = document.getElementById('quickBooking');
  if (quickForm){
    quickForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('qb_name').value.trim();
      const email = document.getElementById('qb_email').value.trim();
      const trip = document.getElementById('qb_trip').value;
      if (!name || !email || !trip) return alert('Preencha nome, e-mail e escolha um passeio.');
      const bookings = storage.load(storage.bookingsKey);
      bookings.unshift({ name, email, trip, ts: Date.now() });
      storage.save(storage.bookingsKey, bookings);
      document.getElementById('qb_msg').textContent = `Obrigado ${name}! Reserva registrada localmente.`;
      quickForm.reset();
      renderRecentBookings();
      updateDashboardStats();
    });
    document.getElementById('qb_clear')?.addEventListener('click', () => quickForm.reset());
  }

  // Form cadastro (se existir)
  const formPasseio = document.getElementById('formPasseio');
  if (formPasseio){
    formPasseio.addEventListener('submit', e => {
      e.preventDefault();
      const idx = document.getElementById('p_index').value;
      const novo = {
        nome: document.getElementById('p_nome').value.trim(),
        local: document.getElementById('p_local').value,
        duracao: document.getElementById('p_duracao').value.trim(),
        preco: Number(document.getElementById('p_preco').value) || 0,
        categoria: document.getElementById('p_categoria').value,
        descricao: document.getElementById('p_descricao').value.trim(),
        image: document.getElementById('p_image') ? document.getElementById('p_image').value.trim() : '',
        created: Date.now()
      };
      const arr = getPasseios();
      if (idx === '' || idx === null) {
        arr.push(novo);
      } else {
        arr[Number(idx)] = novo;
        document.getElementById('p_index').value = '';
      }
      savePasseios(arr);
      formPasseio.reset();
      renderPasseiosTable();
      refreshPasseiosOnPublic();
      populatePasseiosSelect(document.getElementById('qb_trip'));
      alert('Passeio salvo com sucesso!');
    });

    document.getElementById('p_cancel')?.addEventListener('click', () => {
      formPasseio.reset();
      document.getElementById('p_index').value = '';
    });

    document.getElementById('exportPasseios')?.addEventListener('click', () => {
      const data = getPasseios();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'passeios_amazonia.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Form contato (se existir)
  const contactForm = document.getElementById('formContato');
  if (contactForm){
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const nome = document.getElementById('c_nome').value.trim();
      const email = document.getElementById('c_email').value.trim();
      const assunto = document.getElementById('c_assunto').value.trim();
      const mensagem = document.getElementById('c_mensagem').value.trim();
      if (!nome || !email || !mensagem) return alert('Preencha os campos obrigatórios');
      const arr = storage.load(storage.contactsKey);
      arr.unshift({ nome, email, assunto, mensagem, ts: Date.now() });
      storage.save(storage.contactsKey, arr);
      document.getElementById('contactResult').textContent = `Obrigado ${nome}! Mensagem salva localmente.`;
      contactForm.reset();
      updateDashboardStats();
    });
    document.getElementById('clearContact')?.addEventListener('click', () => contactForm.reset());
  }

  // Dashboard buttons (se existirem)
  document.getElementById('exportAllData')?.addEventListener('click', exportAllData);
  document.getElementById('exportAllCSV')?.addEventListener('click', exportAllCSV);
  document.getElementById('clearAll')?.addEventListener('click', clearAllData);
});

// ---------- PASSEIOS: CRUD helpers ----------
function getPasseios(){ return storage.load(storage.passeiosKey); }
function savePasseios(arr){ storage.save(storage.passeiosKey, arr); }

function renderPasseiosTable(){
  const tabela = document.querySelector('#tabelaPasseios tbody');
  if (!tabela) return;
  const passeios = getPasseios();
  tabela.innerHTML = '';
  passeios.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.nome}</td>
                    <td>${p.local}</td>
                    <td>${p.duracao || ''}</td>
                    <td>${formatCurrency(p.preco || 0)}</td>
                    <td>${p.categoria || ''}</td>
                    <td>
                      <button onclick="editarPasseio(${i})" class="btn">Editar</button>
                      <button onclick="removerPasseio(${i})" class="btn ghost">Excluir</button>
                    </td>`;
    tabela.appendChild(tr);
  });
}

function editarPasseio(index){
  const p = getPasseios()[index];
  if (!p) return alert('Passeio não encontrado');
  if(!document.getElementById('p_index')) return alert('Formulário de edição não encontrado nesta página.');
  document.getElementById('p_index').value = index;
  document.getElementById('p_nome').value = p.nome;
  document.getElementById('p_local').value = p.local;
  document.getElementById('p_duracao').value = p.duracao || '';
  document.getElementById('p_preco').value = p.preco || 0;
  document.getElementById('p_categoria').value = p.categoria || 'aventura';
  document.getElementById('p_descricao').value = p.descricao || '';
  if(document.getElementById('p_image')) document.getElementById('p_image').value = p.image || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removerPasseio(i){
  if (!confirm('Excluir este passeio?')) return;
  const arr = getPasseios();
  arr.splice(i, 1);
  savePasseios(arr);
  renderPasseiosTable();
  refreshPasseiosOnPublic();
  populatePasseiosSelect(document.getElementById('qb_trip'));
}

// ---------- PUBLIC PAGE: lista de passeios (cards) ----------
function refreshPasseiosOnPublic(){
  const container = document.getElementById('passeios-lista');
  if (!container) return;
  const passeios = getPasseios();
  if (passeios.length === 0){
    container.innerHTML = '<p>Nenhum passeio cadastrado ainda. Cadastre em "Cadastro".</p>';
    return;
  }
  // construir cards com imagem e descrição maior
  container.innerHTML = passeios.map((p, i) => `
    <div class="card-passeio">
      <img src="${p.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60'}" alt="${escapeHtml(p.nome)}" />
      <div style="padding:14px">
        <h3>${escapeHtml(p.nome)}</h3>
        <p class="muted"><strong>Local:</strong> ${escapeHtml(p.local)}</p>
        <p style="margin-top:8px">${escapeHtml(p.descricao || '')}</p>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" onclick="reservarPasseio(${i})">Reservar</button>
          <button class="btn ghost" onclick="verDetalhes(${i})">Ver detalhes</button>
        </div>
      </div>
    </div>
  `).join('');
  renderRecentBookings();
}

// escape simples
function escapeHtml(s){
  if(!s) return '';
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

// ---------- Busca & filtros ----------
function applyPasseiosFilters(){
  const q = (document.getElementById('searchPasseios')?.value || '').toLowerCase();
  const dur = document.getElementById('filterDuration')?.value;
  const arr = getPasseios().filter(p => {
    if (q && !( (p.nome||'').toLowerCase().includes(q) || (p.local||'').toLowerCase().includes(q) || (p.descricao||'').toLowerCase().includes(q) )) return false;
    if (dur) {
      const hours = extractHours(p.duracao || '');
      if (dur === 'curta' && hours > 2) return false;
      if (dur === 'medio' && (hours <= 2 || hours > 5)) return false;
      if (dur === 'longa' && hours <= 5) return false;
    }
    return true;
  });
  const container = document.getElementById('passeios-lista');
  if (!container) return;
  if (arr.length === 0){
    container.innerHTML = '<p>Nenhum passeio encontrado.</p>';
    return;
  }
  container.innerHTML = arr.map((p,i) => `
    <div class="card-passeio">
      <img src="${p.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60'}" alt="${escapeHtml(p.nome)}" />
      <div style="padding:14px">
        <h3>${escapeHtml(p.nome)}</h3>
        <p class="muted">${escapeHtml(p.local)} • ${escapeHtml(p.duracao||'')}</p>
        <p style="margin-top:8px">${escapeHtml((p.descricao||'').substring(0,300))}${(p.descricao||'').length>300?'...':''}</p>
        <div style="margin-top:10px"><button class="btn" onclick="reservarPasseioPublic('${encodeURIComponent(p.nome)}')">Reservar</button></div>
      </div>
    </div>
  `).join('');
}

function extractHours(durStr){
  if (!durStr) return 0;
  const m = durStr.match(/(\d+)\s*h/);
  if (m) return Number(m[1]);
  const day = durStr.match(/(\d+)\s*dia/);
  if (day) return Number(day[1]) * 8;
  return 3;
}

// ---------- Reservas ----------
function populatePasseiosSelect(selectEl){
  if (!selectEl) return;
  const passeios = getPasseios();
  selectEl.innerHTML = passeios.length 
    ? passeios.map(p => `<option value="${escapeHtml(p.nome)}">${escapeHtml(p.nome)}</option>`).join('')
    : `<option value="">-- sem passeios cadastrados --</option>`;
}

function reservarPasseio(index){
  const p = getPasseios()[index];
  if (!p) return alert('Passeio não encontrado');
  const name = prompt('Nome para reserva:');
  const email = prompt('E-mail:');
  if (!name || !email) return alert('Reserva cancelada');
  const bookings = storage.load(storage.bookingsKey);
  bookings.unshift({ name, email, trip: p.nome, ts: Date.now() });
  storage.save(storage.bookingsKey, bookings);
  alert('Reserva registrada! (salva no navegador)');
  renderRecentBookings();
  updateDashboardStats();
}

function reservarPasseioPublic(encodedName){
  const nome = decodeURIComponent(encodedName);
  const p = getPasseios().find(x => x.nome === nome);
  if (!p) return alert('Passeio não encontrado');
  reservarPasseio(getPasseios().indexOf(p));
}

function verDetalhes(i){
  const p = getPasseios()[i];
  if (!p) return;
  // mostrar modal simples com detalhes — aqui usamos alert para simplicidade
  alert(`${p.nome}\n\nLocal: ${p.local}\nDuração: ${p.duracao || '—'}\nPreço: ${formatCurrency(p.preco || 0)}\n\n${p.descricao || ''}`);
}

function renderRecentBookings(){
  const target = document.getElementById('recentBookings');
  if (!target) return;
  const bookings = storage.load(storage.bookingsKey);
  if (bookings.length === 0){
    target.innerHTML = '<p>Nenhuma reserva recente.</p>';
    return;
  }
  target.innerHTML = bookings.slice(0, 6).map(b => 
    `<div style="margin-bottom:6px"><strong>${escapeHtml(b.name)}</strong> — ${escapeHtml(b.trip)}<br><small class="muted">${new Date(b.ts).toLocaleString()}</small></div>`
  ).join('');
}

// ---------- Dashboard & exports ----------
function updateDashboardStats(){
  const passeios = getPasseios();
  const reservas = storage.load(storage.bookingsKey);
  const contatos = storage.load(storage.contactsKey);
  document.getElementById('statPasseios') && (document.getElementById('statPasseios').textContent = passeios.length);
  document.getElementById('statReservas') && (document.getElementById('statReservas').textContent = reservas.length);
  document.getElementById('statContatos') && (document.getElementById('statContatos').textContent = contatos.length);

  const panelR = document.getElementById('panelReservas');
  if (panelR){
    panelR.innerHTML = reservas.length ? reservas.slice(0, 8).map(r =>
      `<div style="margin-bottom:8px"><strong>${escapeHtml(r.name)}</strong> — ${escapeHtml(r.trip)}<br><small class="muted">${new Date(r.ts).toLocaleString()}</small></div>`
    ).join('') : '<p>Nenhuma reserva.</p>';
  }

  const panelC = document.getElementById('panelContatos');
  if (panelC){
    panelC.innerHTML = contatos.length ? contatos.slice(0, 8).map(c =>
      `<div style="margin-bottom:8px"><strong>${escapeHtml(c.nome)}</strong> — ${escapeHtml(c.assunto || '—')}<br><small class="muted">${new Date(c.ts).toLocaleString()}</small><div style="margin-top:6px">${escapeHtml((c.mensagem||'').substring(0,160))}${(c.mensagem||'').length>160?'...':''}</div></div>`
    ).join('') : '<p>Nenhuma mensagem.</p>';
  }
}

function exportAllData(){
  const data = {
    passeios: getPasseios(),
    reservas: storage.load(storage.bookingsKey),
    contatos: storage.load(storage.contactsKey),
    exportedAt: Date.now()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'amazonia_viva_all_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function exportAllCSV(){
  const passeios = getPasseios();
  const reservas = storage.load(storage.bookingsKey);
  const contatos = storage.load(storage.contactsKey);
  let rows = [['tipo','campo1','campo2','campo3','campo4']];
  passeios.forEach(p => rows.push(['passeio', p.nome, p.local, p.duracao, p.preco]));
  reservas.forEach(r => rows.push(['reserva', r.name, r.email, r.trip, new Date(r.ts).toLocaleString()]));
  contatos.forEach(c => rows.push(['contato', c.nome, c.email, c.assunto, c.mensagem.substring(0,40)]));
  const csv = rows.map(r => r.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'amazonia_viva_data.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function clearAllData(){
  if (!confirm('Remover todos os dados salvos localmente? (irreversível)')) return;
  storage.clearAll();
  ensureSeedPasseios(); // re-seeda para que a página não fique vazia
  renderPasseiosTable();
  refreshPasseiosOnPublic();
  renderRecentBookings();
  updateDashboardStats();
  alert('Dados removidos e seed restaurado.');
}

// ---------- final init call to keep compatibility if needed ----------
(function safeInitialCalls(){
  // in case some pages load functions before DOMContentLoaded handlers above run
  try { ensureSeedPasseios(); } catch(e){}
})();
