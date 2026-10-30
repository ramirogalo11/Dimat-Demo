// DIMAT demo: reemplazar el número cuando DIMAT confirme el WhatsApp oficial.
const WHATSAPP_NUMBER = ''; // Formato internacional sin +, espacios ni guiones. Ej.: 54911XXXXXXXX
const products = [
 {name:'Jamón cocido',category:'Fiambres',unit:'Precio de ejemplo / kg',price:6890,image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',tag:'CLÁSICO'},
 {name:'Salame tipo milán',category:'Fiambres',unit:'Precio de ejemplo / kg',price:7490,image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80',tag:'PICADAS'},
 {name:'Queso cremoso',category:'Quesos',unit:'Precio de ejemplo / kg',price:5980,image:'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=700&q=80',tag:'MUY ELEGIDO'},
 {name:'Queso mozzarella',category:'Quesos',unit:'Precio de ejemplo / kg',price:7250,image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80',tag:'PARA PIZZA'},
 {name:'Queso semiduro',category:'Quesos',unit:'Precio de ejemplo / kg',price:8190,image:'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=700&q=80',tag:'SELECCIÓN'},
 {name:'Hamburguesas',category:'Congelados',unit:'Precio de ejemplo / pack',price:4290,image:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80',tag:'CONGELADOS'},
 {name:'Salchichas',category:'Congelados',unit:'Precio de ejemplo / pack',price:1890,image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',tag:'PRÁCTICO'},
 {name:'Aceitunas',category:'Almacén',unit:'Precio de ejemplo / frasco',price:2490,image:'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=700&q=80',tag:'ALMACÉN'}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let activeFilter='Todos';
const money = n => '$'+n.toLocaleString('es-AR');
function renderProducts(){
 const term=$('#searchInput').value.trim().toLocaleLowerCase('es-AR');
 const list=products.filter(p=>(activeFilter==='Todos'||p.category===activeFilter)&&(`${p.name} ${p.category}`.toLocaleLowerCase('es-AR').includes(term)));
 $('#productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}" onerror="this.style.opacity='.15'"><span class="product-tag">${p.tag}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.unit}</p><div class="product-price-row"><div class="product-price"><small>VALOR ILUSTRATIVO</small><strong>${money(p.price)}</strong></div><button class="product-ask" data-product="${p.name}">Consultar ↗</button></div></div></article>`).join('')||'<p>No encontramos productos con esa búsqueda.</p>';
 $('#resultCount').textContent=`${list.length} producto${list.length===1?'':'s'} de muestra`;
 $$('.product-ask').forEach(b=>b.addEventListener('click',()=>openWhatsApp(`Hola DIMAT, quisiera consultar precio y disponibilidad de ${b.dataset.product}.`)));
}
function openWhatsApp(message){if(!WHATSAPP_NUMBER){alert('Demo: falta configurar el número oficial de WhatsApp de DIMAT. Mensaje preparado: '+message);return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener');}
$('#searchInput').addEventListener('input',renderProducts);
$$('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;$$('.filter').forEach(x=>x.classList.toggle('active',x===b));renderProducts()}));
$$('[data-category-link]').forEach(a=>a.addEventListener('click',()=>{activeFilter=a.dataset.categoryLink;$$('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===activeFilter));renderProducts()}));
$('#wholesaleBtn').addEventListener('click',()=>openWhatsApp('Hola DIMAT, quisiera consultar la lista de precios mayorista.'));
$('#retailBtn').addEventListener('click',()=>openWhatsApp('Hola DIMAT, quisiera consultar la lista de precios minorista.'));
$$('.wa-action').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openWhatsApp(b.dataset.message||'Hola DIMAT, quisiera hacer una consulta.')}));
$('#year').textContent=new Date().getFullYear();
$('#menuToggle').addEventListener('click',()=>$('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('open')));

// Consentimiento de cookies: demostración local en el navegador, no es un registro central de personas.
const CONSENT_KEY='dimat_demo_cookie_consent_v1';
const banner=$('#cookieBanner'), backdrop=$('#cookieBackdrop'), cookieDialog=$('#cookieDialog');
function showCookieBanner(){banner.hidden=false;backdrop.hidden=false;}
function hideCookieBanner(){banner.hidden=true;backdrop.hidden=true;}
function saveConsent(categories,action='preferences_saved'){
 const record={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),timestamp:new Date().toISOString(),action,version:'demo-1.0',categories:{necessary:true,preferences:!!categories.preferences,analytics:!!categories.analytics,advertising:!!categories.advertising},note:'Guardado únicamente en este navegador; no se transmite a DIMAT.'};
 localStorage.setItem(CONSENT_KEY,JSON.stringify(record));hideCookieBanner();cookieDialog.close();
}
function openPreferences(){const old=JSON.parse(localStorage.getItem(CONSENT_KEY)||'null');$('#prefPrefs').checked=!!old?.categories?.preferences;$('#prefAnalytics').checked=!!old?.categories?.analytics;$('#prefAds').checked=!!old?.categories?.advertising;cookieDialog.showModal();}
if(!localStorage.getItem(CONSENT_KEY))showCookieBanner();
$('#acceptAll').addEventListener('click',()=>saveConsent({preferences:true,analytics:true,advertising:true},'accepted_all'));
$('#rejectOptional').addEventListener('click',()=>saveConsent({preferences:false,analytics:false,advertising:false},'rejected_optional'));
$('#openCookiePrefs').addEventListener('click',openPreferences);$('#cookieSettings').addEventListener('click',openPreferences);
$('#savePrefs').addEventListener('click',()=>saveConsent({preferences:$('#prefPrefs').checked,analytics:$('#prefAnalytics').checked,advertising:$('#prefAds').checked}));
$$('[data-legal]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openLegal(b.dataset.legal)}));
const legalContent={
 privacy:{title:'Política de privacidad',html:`<h3>1. Responsable</h3><p>Esta página es una demostración. Antes de publicar, DIMAT deberá completar su razón social o nombre del responsable, domicilio de contacto y un correo válido para consultas de privacidad.</p><h3>2. Datos y finalidades</h3><p>El sitio de muestra permite consultar productos y abrir enlaces de contacto. No incluye un formulario de registro ni envía los datos ingresados a un servidor. Si se agregan formularios, deberán indicarse los datos solicitados y su finalidad antes de recopilarlos.</p><h3>3. Derechos</h3><p>La política definitiva deberá explicar cómo solicitar acceso, rectificación, actualización o supresión de datos, según la normativa aplicable en Argentina, y ofrecer un canal de contacto real.</p><h3>4. Seguridad y conservación</h3><p>La versión definitiva deberá describir los proveedores utilizados, las medidas de seguridad y los plazos de conservación correspondientes.</p>`},
 cookies:{title:'Política de cookies',html:`<h3>Cookies necesarias</h3><p>Son necesarias para funciones básicas del sitio. Esta demostración guarda la preferencia del banner en el almacenamiento local del navegador.</p><h3>Cookies opcionales</h3><p>Las opciones de preferencias, analítica y publicidad son ilustrativas. No se activan herramientas analíticas ni publicitarias en esta demo.</p><h3>Cómo cambiar la elección</h3><p>Podés abrir “Configurar cookies” desde el pie de página para modificar la elección guardada en este navegador.</p><h3>Alcance de esta demo</h3><p>La elección se guarda localmente y no crea un registro central de personas ni se envía a DIMAT. La política definitiva deberá reflejar las tecnologías que efectivamente se instalen.</p>`},
 terms:{title:'Términos y condiciones',html:`<h3>Uso de la página</h3><p>Este sitio es una demostración comercial. Los productos, precios, imágenes y descripciones son ilustrativos y no constituyen una oferta comercial vigente.</p><h3>Precios y disponibilidad</h3><p>Los valores mostrados son ficticios. Consultá directamente con DIMAT para conocer precios, presentaciones, disponibilidad y condiciones de venta actualizadas.</p><h3>Información pendiente</h3><p>Antes de publicar, el titular deberá completar su identificación legal, datos de contacto y cualquier condición comercial aplicable.</p>`}
};
function openLegal(type){const c=legalContent[type];$('#legalTitle').textContent=c.title;$('#legalBody').innerHTML=c.html;$('#legalDialog').showModal();}
renderProducts();
