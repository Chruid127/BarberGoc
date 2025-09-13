// ================== DATOS ==================
const money = (n) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP', maximumFractionDigits:0}).format(n);

const DATA = {
  deliveryBase: 8000,
  deliveryExtraPerService: 2000,
  deals: [{title:'Combo Corte + Barba', desc:'Ahorra reservando el combo', price: 35000, id:'deal-combo'}],
  services: [
    {id:'svc-corte', name:'Corte clásico', price:18000, time:'35 min', tag:'Clásico', desc:'Perfilado y degradado básico.'},
    {id:'svc-barba', name:'Arreglo de barba', price:15000, time:'25 min', tag:'Barba', desc:'Definición con toalla caliente.'},
    {id:'svc-combo', name:'Corte + Barba', price:30000, time:'55 min', tag:'Combo', desc:'Paquete ahorro.'},
    {id:'svc-tinte', name:'Color/Tinte', price:28000, time:'60 min', tag:'Color', desc:'Aplicación de color.'},
    {id:'svc-nino', name:'Corte Kids', price:15000, time:'30 min', tag:'Kids', desc:'Para peques con paciencia :)'},
    {id:'svc-premium', name:'Premium a domicilio', price:45000, time:'70 min', tag:'VIP', desc:'Incluye cuidado facial.'},
  ],
  barbers: [
    {id:'bryan', name:'Bryan López', rating:4.9, specialties:['Degradados','Barba','Diseños'], photos:['https://images.unsplash.com/photo-1593702288056-7927b442d278?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1593701807465-7c94b9395464?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop']},
    {id:'andres', name:'Andrés Pérez', rating:4.8, specialties:['Clásicos','Kids','Cejas'], photos:['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1559595500-e15296bdbef1?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop']},
    {id:'kevin', name:'Kevin Rojas', rating:4.7, specialties:['Tinte','Barba','Perfilados'], photos:['https://images.unsplash.com/photo-1556229162-5c63ed9c4efb?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1593701807465-7c94b9395464?q=80&w=800&auto=format&fit=crop','https://images.unsplash.com/photo-1593702288056-7927b442d278?q=80&w=800&auto=format&fit=crop']},
  ],
  products: [
    {id:'prd-cera', name:'Cera para cabello', price:18000, cat:'Cabello'},
    {id:'prd-pomada', name:'Pomada mate', price:22000, cat:'Cabello'},
    {id:'prd-hidratante', name:'Crema hidratante', price:26000, cat:'Cuidado facial'},
    {id:'prd-oxidante', name:'Oxidante crecimiento', price:38000, cat:'Tratamiento'},
    {id:'prd-shampoo', name:'Shampoo fortificante', price:24000, cat:'Cabello'},
    {id:'prd-peine', name:'Peine barbero', price:12000, cat:'Accesorios'},
    {id:'prd-camiseta', name:'Camiseta BarberGo', price:45000, cat:'Ropa'},
    {id:'prd-zapatos', name:'Zapatos casual', price:99000, cat:'Calzado'},
    {id:'prd-gorra', name:'Gorra BG', price:35000, cat:'Accesorios'},
  ]
};

// ================== ESTADO ==================
const state = {
  section: 'home',
  cart: load('barbergo_cart') || [],
  selectedBarber: load('barbergo_barber') || null,
};

function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ try{ return JSON.parse(localStorage.getItem(key)); }catch{ return null } }

// ================== NAVEGACIÓN ==================
function go(id){
  state.section = id;
  document.querySelectorAll('section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===id));
  if(id==='services') renderServices();
  if(id==='barbers') renderBarbers();
  if(id==='store') renderStore();
  if(id==='cart') renderCart();
  if(id==='home') renderHome();
  window.scrollTo({top:0,behavior:'smooth'});
}

// ================== RENDER HOME ==================
function renderHome(){
  const wrap = document.getElementById('homeHighlights');
  const items = [
    {title:'Reserva sencilla', desc:'Elige servicio y barbero en 2 clics', emoji:'⚡'},
    {title:'Pagas al recibir', desc:'Seguridad y confianza', emoji:'💵'},
    {title:'Llega a tu casa', desc:'Disponible en tu zona', emoji:'🏠'}
  ];
  wrap.innerHTML = items.map(i=>`
    <div class="card">
      <div class="body">
        <div class="row"><span class="chip">${i.emoji}</span><span class="pill">BarberGo</span></div>
        <h3 class="mt-12">${i.title}</h3>
        <p>${i.desc}</p>
        <div class="mt-12"><button class="btn" onclick="go('services')">Probar ahora</button></div>
      </div>
    </div>`).join('');
}

// ================== SERVICIOS ==================
function renderServices(filter=''){
  const q = filter?.toLowerCase?.() || '';
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = DATA.services.filter(s=> s.name.toLowerCase().includes(q) || s.tag.toLowerCase().includes(q)).map(s=>`
    <div class="card">
      <div class="media"></div>
      <div class="body">
        <div class="row">
          <h3>${s.name}</h3>
          <span class="chip">${s.time}</span>
        </div>
        <p>${s.desc}</p>
        <div class="row mt-12">
          <span class="price">${money(s.price)}</span>
          <div>
            <button class="btn" onclick="reserveService('${s.id}')">Reservar</button>
            <button class="btn" onclick="addService('${s.id}')">Añadir</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function reserveService(serviceId){
  // Forzar selección de barbero si no hay uno
  if(!state.selectedBarber){ openBarberModal(serviceId); }
  else { addService(serviceId); toast('Servicio agregado con '+ getBarber(state.selectedBarber).name); }
}

function addService(serviceId){
  const svc = DATA.services.find(s=>s.id===serviceId);
  const barberId = state.selectedBarber || null;
  state.cart.push({type:'service', id:serviceId, name:svc.name, price:svc.price, qty:1, barberId});
  save('barbergo_cart', state.cart);
  toast('Servicio añadido');
  updateCartBadge();
}

// ================== BARBEROS ==================
function getBarber(id){ return DATA.barbers.find(b=>b.id===id); }

function renderBarbers(){
  const badge = document.getElementById('selectedBarberBadge');
  if(state.selectedBarber){
    const b = getBarber(state.selectedBarber);
    badge.innerHTML = `Barbero seleccionado: <strong>${b.name}</strong> · ⭐ ${b.rating}`;
    badge.classList.remove('hidden');
  } else badge.classList.add('hidden');

  const grid = document.getElementById('barbersGrid');
  grid.innerHTML = DATA.barbers.map(b=>`
    <div class="card">
      <div class="media"></div>
      <div class="body">
        <div class="row"><h3>${b.name}</h3><span class="chip">⭐ ${b.rating}</span></div>
        <div class="barber-specialties">${b.specialties.map(s=>`<span class="chip">${s}</span>`).join('')}</div>
        <div class="gallery">${b.photos.map(src=>`<img loading="lazy" src="${src}" alt="Corte de ${b.name}">`).join('')}</div>
        <div class="row mt-12">
          <button class="btn" onclick="chooseBarber('${b.id}')">Elegir</button>
          <button class="btn" onclick="go('services')">Ver servicios</button>
        </div>
      </div>
    </div>`).join('');
}

function chooseBarber(id){
  state.selectedBarber = id;
  save('barbergo_barber', id);
  renderBarbers();
  toast('Barbero seleccionado');
}

function openBarberModal(serviceId){
  const list = document.getElementById('barberModalList');
  list.innerHTML = DATA.barbers.map(b=>`
    <div class="row" style="border-bottom:1px dashed var(--border);padding:10px 0">
      <div><strong>${b.name}</strong><div class="muted">⭐ ${b.rating} · ${b.specialties.join(' · ')}</div></div>
      <div>
        <button class="btn" onclick="state.selectedBarber='${b.id}'; save('barbergo_barber','${b.id}'); addService('${serviceId}'); closeModal('barberModal'); renderBarbers();">Elegir</button>
      </div>
    </div>`).join('');
  openModal('barberModal');
}

// ================== TIENDA ==================
function renderStore(filter=''){
  const q = filter?.toLowerCase?.() || '';
  const grid = document.getElementById('storeGrid');
  const list = DATA.products.filter(p=> p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  grid.innerHTML = list.map(p=>`
    <div class="card">
      <div class="media"></div>
      <div class="body">
        <div class="row"><h3>${p.name}</h3><span class="chip">${p.cat}</span></div>
        <div class="row mt-12">
          <span class="price">${money(p.price)}</span>
          <div>
            <button class="btn" onclick="addProduct('${p.id}')">Agregar</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function addProduct(id){
  const p = DATA.products.find(x=>x.id===id);
  const found = state.cart.find(i=>i.type==='product' && i.id===id);
  if(found) found.qty += 1; else state.cart.push({type:'product', id, name:p.name, price:p.price, qty:1});
  save('barbergo_cart', state.cart);
  toast('Producto añadido');
  updateCartBadge();
}

// ================== CARRITO ==================
function renderCart(){
  const wrap = document.getElementById('cartLines');
  if(state.cart.length===0){
    wrap.innerHTML = `<div class="card"><div class="body"><h3>Tu carrito está vacío</h3><p class='muted'>Agrega servicios o productos para continuar.</p><div class="mt-12"><button class="btn" onclick="go('services')">Ir a servicios</button></div></div></div>`;
  } else {
    wrap.innerHTML = state.cart.map((it, idx)=>{
      const subt = it.price * it.qty;
      const typeChip = it.type==='service' ? '✂️ Servicio' : '🛍 Producto';
      const barberNote = it.type==='service' && it.barberId ? `<span class='pill'>${getBarber(it.barberId)?.name || ''}</span>` : '';
      return `<div class="cart-line">
        <div>
          <div><strong>${it.name}</strong></div>
          <div class="muted">${typeChip} ${barberNote}</div>
        </div>
        <div class="qty">
          <button onclick="decQty(${idx})">−</button>
          <input value="${it.qty}" readonly />
          <button onclick="incQty(${idx})">+</button>
        </div>
        <div class="row">
          <span>${money(subt)}</span>
          <button class="btn" onclick="removeLine(${idx})">Eliminar</button>
        </div>
      </div>`;
    }).join('');
  }
  updateTotals();
}

function incQty(i){ state.cart[i].qty++; save('barbergo_cart', state.cart); renderCart(); }
function decQty(i){ state.cart[i].qty = Math.max(1, state.cart[i].qty-1); save('barbergo_cart', state.cart); renderCart(); }
function removeLine(i){ state.cart.splice(i,1); save('barbergo_cart', state.cart); renderCart(); updateCartBadge(); }
function clearCart(){ state.cart = []; save('barbergo_cart', state.cart); renderCart(); updateCartBadge(); }

function updateTotals(){
  const subtotal = state.cart.reduce((a,i)=> a + i.price*i.qty, 0);
  const servicesCount = state.cart.filter(i=>i.type==='service').reduce((a,i)=> a + i.qty, 0);
  const home = document.getElementById('homeService').checked;
  const delivery = home && servicesCount>0 ? DATA.deliveryBase + Math.max(0,servicesCount-1)*DATA.deliveryExtraPerService : 0;
  const discount = subtotal>180000 ? Math.round(subtotal*0.05) : 0; // 5% promo
  const total = subtotal + delivery - discount;
  document.getElementById('sumSubtotal').textContent = money(subtotal);
  document.getElementById('sumDelivery').textContent = money(delivery);
  document.getElementById('sumDiscount').textContent = discount? `−${money(discount)}` : money(0);
  document.getElementById('sumTotal').textContent = money(total);
}

function checkout(){
  if(state.cart.length===0){ toast('Agrega algo al carrito'); return }
  const address = document.getElementById('address').value.trim();
  const home = document.getElementById('homeService').checked;
  if(home && !address){ toast('Escribe la dirección para el servicio a domicilio'); return }
  const summary = state.cart.map(i=>`• ${i.qty} × ${i.name}`).join('\n');
  const subtotal = state.cart.reduce((a,i)=> a + i.price*i.qty, 0);
  const servicesCount = state.cart.filter(i=>i.type==='service').reduce((a,i)=> a + i.qty, 0);
  const delivery = home && servicesCount>0 ? DATA.deliveryBase + Math.max(0,servicesCount-1)*DATA.deliveryExtraPerService : 0;
  const discount = subtotal>180000 ? Math.round(subtotal*0.05) : 0;
  const total = subtotal + delivery - discount;
  alert(`¡Pedido creado!\n\n${summary}\n\nSubtotal: ${money(subtotal)}\nDomicilio: ${money(delivery)}\nDescuento: ${discount?'-'+money(discount):money(0)}\nTOTAL: ${money(total)}\n\n${home? 'Servicio a domicilio en: '+address : 'Atención en punto o acordar con barbero'}`);
  clearCart();
  go('home');
}

function updateCartBadge(){
  // (Para futura badget en botón FAB si se desea)
}

// ================== UTILIDADES ==================
function openAbout(){
  alert('Cómo funciona BarberGo:\n1) Elige servicios y un barbero.\n2) Agrega productos si deseas.\n3) Activa servicio a domicilio y escribe tu dirección.\n4) Confirmas y pagas al recibir.');
}

function toast(text){
  const el = document.getElementById('toast');
  el.textContent = text || 'Acción realizada';
  el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 1600);
}

function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function globalSearch(q){
  const query = (q||'').trim();
  renderServices(query);
  renderStore(query);
}

// ================== INIT ==================
renderHome();
renderServices();
renderBarbers();
renderStore();
