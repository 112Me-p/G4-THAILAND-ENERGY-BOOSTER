(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const PRODUCTS=[
    {id:'g4-15',cat:'booster',no:'01',name:'G4 Energy Booster',variant:'สูตรเลี้ยง · 15 ml',desc:'ขนาดทดลองสำหรับผู้ที่ต้องการเริ่มใช้ G4 สูตรเลี้ยง โดยข้อมูลแบรนด์ระบุการใช้ 10 หยดต่อน้ำครึ่งถ้วยเล็ก',tag:'DAILY CARE',image:'assets/hero-g4-15.png',price:190,features:['15 ML','สูตรเลี้ยง','ขนาดทดลอง']},
    {id:'g4-50',cat:'booster',no:'02',name:'G4 Energy Booster',variant:'สูตรเลี้ยง · 50 ml',desc:'สูตรเลี้ยงขนาดใหญ่สำหรับการดูแลประจำวันและการใช้งานต่อเนื่อง ตามแนวทางในสื่อของแบรนด์',tag:'BEST VALUE',image:'assets/hero-g4-50.png',price:490,features:['50 ML','สูตรเลี้ยง','ใช้ประจำ']},
    {id:'g4x-20',cat:'booster',no:'03',name:'G4-X Fighting',variant:'สูตรเร่งร้อง · 20 ml',desc:'สูตรสำหรับช่วงก่อนการแข่งขัน โดยข้อมูลแบรนด์ระบุ 10 หยดในน้ำครึ่งถ้วย ก่อนแข่งขันประมาณ 30 นาที',tag:'COMPETITION',image:'assets/hero-g4x-20.png',price:590,features:['20 ML','G4-X','ก่อนแข่งขัน']},
    {id:'food-100',cat:'nutrition',no:'04',name:'อาหารนกกรงหัวจุก',variant:'สูตรนกแข่ง · 100 กรัม',desc:'อาหารนกกรงหัวจุก สูตรนกแข่ง เม็ดขนาดเล็กกินง่าย ใช้เป็นพื้นฐานด้านโภชนาการสำหรับนก',tag:'NUTRITION',image:'assets/bird-food-100g.webp',price:null,features:['100 G','สูตรนกแข่ง','โภชนาการ']}
  ];
  const SHIPPING=30, storageKey='g4-thailand-cart-v2';
  const state={filter:'all',cart:JSON.parse(localStorage.getItem(storageKey)||'[]')};
  const money=n=>`${Number(n).toLocaleString('th-TH')}.-`;
  const product=id=>PRODUCTS.find(x=>x.id===id);

  function renderProducts(){
    const root=$('#productGrid');
    const items=PRODUCTS.filter(p=>state.filter==='all'||p.cat===state.filter);
    root.innerHTML=items.map(p=>`<article class="product-card">
      <div class="product-media"><img src="${p.image}" alt="${p.name} ${p.variant}"><span class="product-number">${p.no}</span><span class="product-tag">${p.tag}</span></div>
      <div class="product-body"><span class="product-kicker">G4 THAILAND</span><h3>${p.name}</h3><strong>${p.variant}</strong><p>${p.desc}</p>
      <div class="product-features">${p.features.map(x=>`<span>${x}</span>`).join('')}</div>
      <div class="product-action"><div class="price"><small>${p.price==null?'ราคา':'ราคา'}</small><strong class="${p.price==null?'quote':''}">${p.price==null?'สอบถามราคา':money(p.price)}</strong></div><button class="add-product" data-add="${p.id}">${p.price==null?'เพิ่มเพื่อสอบถาม':'เพิ่มลงตะกร้า +'}</button></div></div>
    </article>`).join('');
    $$('[data-add]',root).forEach(b=>b.onclick=()=>{addItem(b.dataset.add);b.textContent='เพิ่มแล้ว ✓';b.classList.add('added');setTimeout(()=>{if(document.body.contains(b)){const p=product(b.dataset.add);b.textContent=p?.price==null?'เพิ่มเพื่อสอบถาม':'เพิ่มลงตะกร้า +';b.classList.remove('added')}},800)});
  }

  function addItem(id,qty=1){const p=product(id);if(!p)return;const i=state.cart.find(x=>x.id===id);if(i)i.qty+=qty;else state.cart.push({id,qty});persist();toast(`เพิ่ม ${p.name} แล้ว`)}
  function persist(){localStorage.setItem(storageKey,JSON.stringify(state.cart));renderCart()}

  function renderCart(){
    state.cart=state.cart.filter(x=>product(x.id));let qty=0,subtotal=0,hasQuote=false;const root=$('#cartItems');
    root.innerHTML=state.cart.map(item=>{const p=product(item.id);qty+=item.qty;if(p.price==null)hasQuote=true;else subtotal+=p.price*item.qty;return `<div class="cart-line"><div><strong>${p.name}</strong><small>${p.variant} · ${p.price==null?'สอบถามราคา':money(p.price)}</small><button class="remove" data-remove="${item.id}">ลบรายการ</button></div><div class="qty"><button data-qty="${item.id}" data-delta="-1">−</button><b>${item.qty}</b><button data-qty="${item.id}" data-delta="1">+</button></div></div>`}).join('');
    const shipping=state.cart.length?SHIPPING:0,total=subtotal+shipping;
    $('#cartEmpty').style.display=state.cart.length?'none':'flex';
    $('#summaryQty').textContent=`${qty} รายการ`;$('#summarySubtotal').textContent=money(subtotal);$('#summaryShipping').textContent=money(shipping);$('#summaryTotal').textContent=money(total);$('#cartCountTop').textContent=qty;$('#cartCountMobile').textContent=qty;$('#cartTotalMobile').textContent=hasQuote?`${money(total)}+`:money(total);$('#quoteNote').hidden=!hasQuote;
    $$('[data-qty]',root).forEach(b=>b.onclick=()=>changeQty(b.dataset.qty,Number(b.dataset.delta)));$$('[data-remove]',root).forEach(b=>b.onclick=()=>{state.cart=state.cart.filter(x=>x.id!==b.dataset.remove);persist()});
  }

  function changeQty(id,d){const i=state.cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);persist()}
  function openCart(){$('#cartDrawer').classList.add('open');$('#drawerBackdrop').classList.add('show');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeCart(){$('#cartDrawer').classList.remove('open');$('#drawerBackdrop').classList.remove('show');$('#cartDrawer').setAttribute('aria-hidden','true');document.body.style.overflow=''}

  function orderText(){
    if(!state.cart.length)return 'ยังไม่มีสินค้าในตะกร้า';let subtotal=0,hasQuote=false;
    const lines=state.cart.map((i,n)=>{const p=product(i.id);if(p.price==null){hasQuote=true;return `${n+1}. ${p.name} (${p.variant}) x${i.qty} = สอบถามราคา`;}const sum=p.price*i.qty;subtotal+=sum;return `${n+1}. ${p.name} (${p.variant}) x${i.qty} = ${money(sum)}`});
    const note=$('#orderNote').value.trim(),total=subtotal+SHIPPING;
    return `ออเดอร์ G4 Thailand\n${lines.join('\n')}\nยอดสินค้าที่มีราคา ${money(subtotal)}\nค่าจัดส่ง ${money(SHIPPING)}\nรวมเบื้องต้น ${money(total)}${hasQuote?'\n* มีสินค้าที่ต้องสอบถามราคาเพิ่มเติม':''}${note?`\nหมายเหตุ: ${note}`:''}`;
  }

  function preset(type){const map={trial:'g4-15',daily:'g4-50',fight:'g4x-20',food:'food-100'};if(!map[type])return;addItem(map[type]);openCart()}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1600)}

  function setupSystem(){
    if(matchMedia('(max-width:720px)').matches)return;
    const steps=$$('.system-step'),img=$('#systemImage'),count=$('#systemCurrent');
    const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>.45){steps.forEach(x=>x.classList.remove('is-active'));e.target.classList.add('is-active');const src=e.target.dataset.image;if(img.getAttribute('src')!==src){img.style.opacity='.25';img.style.transform='scale(1.025)';setTimeout(()=>{img.src=src;img.style.opacity='1';img.style.transform='scale(1)'},130)}count.textContent=e.target.dataset.index}}),{threshold:[.45,.58],rootMargin:'-14% 0px -14% 0px'});
    steps.forEach(s=>ob.observe(s));
  }

  function setupHeroParallax(){
    if(matchMedia('(max-width:720px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const hero=$('.hero-stage'); if(!hero)return;
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;hero.style.setProperty('--px',`${x*10}px`);hero.style.setProperty('--py',`${y*8}px`);});
    hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--px','0px');hero.style.setProperty('--py','0px')});
  }

  function bind(){
    $$('[data-scroll]').forEach(b=>b.onclick=()=>{const target=$(b.dataset.scroll);target?.scrollIntoView({behavior:'smooth'});closeMobileNav()});
    $$('.filters button').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;$$('.filters button').forEach(x=>x.classList.toggle('is-active',x===b));renderProducts()});
    $$('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset));
    $$('[data-add]').forEach(b=>{if(!b.closest('#productGrid'))b.onclick=()=>{addItem(b.dataset.add);openCart()}});
    ['#openCartTop','#openCartBottom','#mobileCart'].forEach(s=>$(s)?.addEventListener('click',openCart));$('#closeCart').onclick=closeCart;$('#drawerBackdrop').onclick=closeCart;
    $('#copyOrder').onclick=async()=>{const txt=orderText();try{await navigator.clipboard.writeText(txt);toast('คัดลอกออเดอร์แล้ว')}catch{prompt('คัดลอกข้อความนี้',txt)}};
    $('#lineOrder').onclick=async()=>{if(!state.cart.length){toast('เลือกสินค้าก่อน');return}const txt=orderText();try{await navigator.clipboard.writeText(txt)}catch{}window.open(`https://line.me/R/oaMessage/%40961hneoj/?${encodeURIComponent(txt)}`,'_blank')};
    $('#menuToggle').onclick=toggleMobileNav;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeMobileNav()}});
  }

  function toggleMobileNav(){const n=$('#mobileNav'),b=$('#menuToggle'),open=!n.classList.contains('open');n.classList.toggle('open',open);n.setAttribute('aria-hidden',String(!open));b.setAttribute('aria-expanded',String(open));b.textContent=open?'×':'☰'}
  function closeMobileNav(){const n=$('#mobileNav'),b=$('#menuToggle');n.classList.remove('open');n.setAttribute('aria-hidden','true');b.setAttribute('aria-expanded','false');b.textContent='☰'}

  function init(){renderProducts();renderCart();bind();setupSystem();setupHeroParallax();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{})}
  document.addEventListener('DOMContentLoaded',init);
})();
