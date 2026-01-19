const pizzas = [
  { id:1, name:'Margherita', desc:'Molho de tomate, mussarela, manjericão', price:29.90, img:'https://images.unsplash.com/photo-1601924582971-03b6b4b2e5d0?q=80&w=400&auto=format&fit=crop&crop=faces', popular:true },
  { id:2, name:'Calabresa', desc:'Calabresa fatiada, cebola, azeitona', price:34.90, img:'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=400&auto=format&fit=crop&crop=faces' },
  { id:3, name:'Quatro Queijos', desc:'Mussarela, parmesão, gorgonzola, provolone', price:39.90, img:'https://images.unsplash.com/photo-1606756794433-ff7e7e0a5d5d?q=80&w=400&auto=format&fit=crop&crop=faces' },
];

const state = { cart: JSON.parse(localStorage.getItem('cart')||'[]') };

function formatPrice(v){return v.toFixed(2)}

function renderPizzas(filter){
  const el = document.getElementById('pizzas-list');
  el.innerHTML = '';
  const list = typeof filter === 'string' && filter.trim() ? pizzas.filter(p=> (p.name+ ' '+p.desc).toLowerCase().includes(filter.toLowerCase())) : pizzas;
  list.forEach(p=>{
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `
      ${p.popular?'<div class="card-badge">Mais pedida</div>':''}
      <img src="pizza.png" alt="${p.name}">
      <div class="meta">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">R$ ${formatPrice(p.price)}</div>
      </div>
      <div>
        <button class="btn primary" data-id="${p.id}">Adicionar</button>
      </div>`;
    el.appendChild(card);
  });
}

function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.cart)); updateCartUI(); }

function addToCart(id){
  const item = pizzas.find(p=>p.id===+id);
  const found = state.cart.find(c=>c.id===item.id);
  if(found) found.qty++;
  else state.cart.push({id:item.id,name:item.name,price:item.price,qty:1});
  saveCart();
  showAddedFeedback(+id);
}

function showAddedFeedback(id){
  const btn = document.querySelector(`button[data-id="${id}"]`);
  if(!btn) return;
  const card = btn.closest('.card');
  if(!card) return;
  // add temporary badge
  if(!card.querySelector('.added-badge')){
    const badge = document.createElement('div');
    badge.className = 'added-badge';
    badge.textContent = 'Adicionado';
    card.appendChild(badge);
    card.classList.add('card-added');
    setTimeout(()=>{
      badge.remove();
      card.classList.remove('card-added');
    },1400);
  }
  // pulse floating cart so user notices
  const floatBtn = document.getElementById('floating-cart');
  if(floatBtn){
    floatBtn.classList.add('pulse');
    setTimeout(()=>floatBtn.classList.remove('pulse'),600);
  }
}

function updateCartUI(){
  const count = state.cart.reduce((s,i)=>s+i.qty,0);
  const cartCountEl = document.getElementById('cart-count');
  if(cartCountEl) cartCountEl.textContent = count;
  const floatCountEl = document.getElementById('float-count');
  if(floatCountEl) floatCountEl.textContent = count;
  const cartItemsEl = document.getElementById('cart-items');
  if(cartItemsEl) cartItemsEl.innerHTML = (state.cart.length ? state.cart.map(i=>{
    return `
      <li data-id="${i.id}">
        <div class="cart-item simple">
          <div class="cart-body">
            <div class="cart-title">${i.name}</div>
            <div class="cart-meta">R$ ${formatPrice(i.price)} • <span class="muted">${i.qty}x</span></div>
          </div>
          <div class="cart-controls-right">
            <div class="cart-controls">
              <button class="qty-btn" data-action="decrease" data-id="${i.id}">−</button>
              <span class="qty-display">${i.qty}</span>
              <button class="qty-btn" data-action="increase" data-id="${i.id}">+</button>
            </div>
            <div class="cart-right">
              <div class="cart-subtotal">R$ ${formatPrice(i.price*i.qty)}</div>
              <button class="remove-icon" data-action="remove" data-id="${i.id}" aria-label="Remover item">Remover</button>
            </div>
          </div>
        </div>
      </li>`;
  }).join('') : `<li class="cart-empty">Seu carrinho está vazio</li>`);
  const total = state.cart.reduce((s,i)=>s + i.price*i.qty,0);
  const cartTotalEl = document.getElementById('cart-total');
  if(cartTotalEl) cartTotalEl.textContent = formatPrice(total);
}

function toggleCart(open){
  const sheet = document.getElementById('cart-sheet');
  if(open){ sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false'); }
  else { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); }
}

function init(){
  renderPizzas(); updateCartUI();
  document.getElementById('pizzas-list').addEventListener('click',e=>{
    const btn = e.target.closest('button[data-id]'); if(!btn) return;
    addToCart(btn.dataset.id);
  });
  const openCartBtn = document.getElementById('open-cart');
  if(openCartBtn) openCartBtn.addEventListener('click',()=>toggleCart(true));
  const closeCartBtn = document.getElementById('close-cart');
  if(closeCartBtn) closeCartBtn.addEventListener('click',()=>toggleCart(false));
  const floating = document.getElementById('floating-cart');
  if(floating) floating.addEventListener('click',()=>toggleCart(true));

  // Cart item controls (increase, decrease, remove)
  const cartItemsEl = document.getElementById('cart-items');
  if(cartItemsEl) cartItemsEl.addEventListener('click', e=>{
    const action = e.target.dataset.action;
    const id = e.target.dataset.id && Number(e.target.dataset.id);
    if(!action || !id) return;
    const idx = state.cart.findIndex(i=>i.id===id);
    if(idx === -1) return;
    if(action === 'increase'){
      state.cart[idx].qty++;
    } else if(action === 'decrease'){
      state.cart[idx].qty--;
      if(state.cart[idx].qty <= 0) state.cart.splice(idx,1);
    } else if(action === 'remove'){
      state.cart.splice(idx,1);
    }
    saveCart();
  });

  // Search handling
  const searchEl = document.getElementById('search');
  if(searchEl){
    searchEl.addEventListener('input', e=>{
      renderPizzas(e.target.value);
    });
    const clearBtn = document.getElementById('clear-search');
    if(clearBtn) clearBtn.addEventListener('click', ()=>{ searchEl.value=''; renderPizzas(); searchEl.focus(); });
  }

  const checkoutBtn = document.getElementById('checkout');
  if(checkoutBtn) checkoutBtn.addEventListener('click',()=>{
    const modal = document.getElementById('checkout-modal'); if(modal) modal.setAttribute('aria-hidden','false');
  });
  const cancelBtn = document.getElementById('cancel-checkout');
  if(cancelBtn) cancelBtn.addEventListener('click',()=>{
    const modal = document.getElementById('checkout-modal'); if(modal) modal.setAttribute('aria-hidden','true');
  });
  // Checkout flow: open payment modal on submit
  const checkoutForm = document.getElementById('checkout-form');
  let pendingOrder = null;
  if(checkoutForm) checkoutForm.addEventListener('submit',e=>{
    e.preventDefault();
    const form = new FormData(e.target);
    pendingOrder = {customer:Object.fromEntries(form.entries()), items:state.cart, total: state.cart.reduce((s,i)=>s+i.price*i.qty,0)};
    const modal = document.getElementById('checkout-modal'); if(modal) modal.setAttribute('aria-hidden','true');
    showPaymentModal();
  });

  // Payment modal handlers
  const paymentModal = document.getElementById('payment-modal');
  const paymentOptions = document.getElementById('payment-options');
  const paymentExtra = document.getElementById('payment-extra');
  let selectedPayment = null;
  const PIX_KEY = 'pix@pizzariaadonai.com';
  const PIZZARIA_WHATSAPP = '55XXXXXXXXXXX'; // replace with real number

  function showPaymentModal(){
    if(paymentModal) paymentModal.setAttribute('aria-hidden','false');
    selectedPayment = null;
    paymentExtra.innerHTML = '';
  }
  function closePaymentModal(){ if(paymentModal) paymentModal.setAttribute('aria-hidden','true'); }

  if(paymentOptions) paymentOptions.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-pay]'); if(!btn) return;
    selectedPayment = btn.dataset.pay;
    // highlight selection
    Array.from(paymentOptions.querySelectorAll('button')).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    // render extra UI
    if(selectedPayment === 'cash'){
      paymentExtra.innerHTML = `<label>Valor para troco<br/><input id="change-value" type="number" min="0" step="0.5" placeholder="Ex: 50" /></label>`;
    } else if(selectedPayment === 'pix'){
      paymentExtra.innerHTML = `<p>Receba o PIX usando a chave abaixo ao confirmar:</p><div class="pix-key">${PIX_KEY}</div>`;
    } else {
      paymentExtra.innerHTML = `<p>Pagamento no cartão será processado na entrega.</p>`;
    }
  });

  const cancelPayment = document.getElementById('cancel-payment');
  if(cancelPayment) cancelPayment.addEventListener('click', ()=>{ closePaymentModal(); });

  const confirmPayment = document.getElementById('confirm-payment');
  if(confirmPayment) confirmPayment.addEventListener('click', ()=>{
    if(!selectedPayment){ alert('Selecione a forma de pagamento'); return; }
    closePaymentModal();
    if(selectedPayment === 'pix'){
      showPixScreen(pendingOrder);
    } else if(selectedPayment === 'card'){
      finalizeOrder(pendingOrder, 'cartao');
    } else if(selectedPayment === 'cash'){
      const cv = document.getElementById('change-value');
      const changeFor = cv && cv.value ? Number(cv.value) : null;
      pendingOrder.changeFor = changeFor;
      finalizeOrder(pendingOrder, 'dinheiro');
    }
  });

  function showPixScreen(order){
    const orderModal = document.getElementById('order-modal');
    const content = document.getElementById('order-modal-content');
    if(!content || !orderModal) return;
    content.innerHTML = `
      <h3>Pedido em andamento</h3>
      <p>Faça o PIX para a chave abaixo e envie o comprovante:</p>
      <div class="pix-box">${PIX_KEY}</div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn" id="copy-pix">Copiar chave</button>
        <button class="btn primary" id="send-pix-whats">Enviar comprovante via WhatsApp</button>
      </div>
    `;
    orderModal.setAttribute('aria-hidden','false');

    const copyBtn = document.getElementById('copy-pix');
    if(copyBtn) copyBtn.addEventListener('click', ()=>{ navigator.clipboard && navigator.clipboard.writeText(PIX_KEY); alert('Chave PIX copiada'); });
    const sendBtn = document.getElementById('send-pix-whats');
    if(sendBtn) sendBtn.addEventListener('click', ()=>{
      const text = `Segue comprovante do pagamento PIX para pedido. Pedido: ${JSON.stringify(order.customer)}`;
      const url = `https://wa.me/${PIZZARIA_WHATSAPP}?text=${encodeURIComponent(text)}`;
      window.open(url,'_blank');
    });
    // mark order as in progress locally
    console.log('Pedido PIX em andamento', order);
    state.cart = []; saveCart();
  }

  function finalizeOrder(order, method){
    const orderModal = document.getElementById('order-modal');
    const content = document.getElementById('order-modal-content');
    if(!content || !orderModal) return;
    content.innerHTML = `
      <h3>Pedido confirmado</h3>
      <p>Forma de pagamento: <strong>${method==='cartao'?'Cartão':method==='dinheiro'?'Dinheiro':'PIX'}</strong></p>
      ${order && order.changeFor ? `<p>Troco para: R$ ${order.changeFor.toFixed(2)}</p>` : ''}
      <p>Obrigado! Seu pedido foi registrado.</p>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
        <button class="btn" id="track-order">Acompanhar Pedido</button>
        <button class="btn primary" id="close-order">Fechar</button>
      </div>
    `;
    orderModal.setAttribute('aria-hidden','false');
    console.log('Pedido confirmado', order, method);
    state.cart = []; saveCart();
    const closeOrder = document.getElementById('close-order');
    if(closeOrder) closeOrder.addEventListener('click', ()=>{ orderModal.setAttribute('aria-hidden','true'); toggleCart(false); });
    const trackOrder = document.getElementById('track-order');
    if(trackOrder) trackOrder.addEventListener('click', ()=>{
      // save order to localStorage orders and redirect to orders page with id
      const orders = JSON.parse(localStorage.getItem('orders')||'[]');
      const id = Date.now().toString().slice(-6);
      const orderEntry = { id, customer: order.customer, items: order.items, total: order.total, created: Date.now(), status: 'Recebido' };
      orders.unshift(orderEntry);
      localStorage.setItem('orders', JSON.stringify(orders));
      orderModal.setAttribute('aria-hidden','true');
      // navigate to orders page and pass id via hash
      window.location.href = `orders.html#${id}`;
    });
  }
  // openTrackSection removed — tracking handled in orders.html
}

document.addEventListener('DOMContentLoaded',init);
