const envelope = document.getElementById('envelope');
const site = document.getElementById('site');
let opened = false;
function openInvitation(){
  if(opened) return; opened = true;
  envelope.classList.add('opening');
  site.classList.add('ready');
  site.setAttribute('aria-hidden','false');
  setTimeout(()=> envelope.remove(), 1200);
}
envelope.addEventListener('click', openInvitation);
// В оригинальном ролике заставка держится несколько секунд; оставляем тот же ритм.
setTimeout(openInvitation, 7000);

const target = new Date('2026-11-06T15:45:00+03:00').getTime();
function tick(){
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  document.getElementById('days').textContent = String(d).padStart(2,'0');
  document.getElementById('hours').textContent = String(h).padStart(2,'0');
  document.getElementById('minutes').textContent = String(m).padStart(2,'0');
  document.getElementById('seconds').textContent = String(s).padStart(2,'0');
}
tick(); setInterval(tick,1000);

// Календарь: ноябрь 2026, понедельник — первый день недели.
const grid = document.getElementById('calendar');
for(let i=0;i<6;i++){ const e=document.createElement('span');e.className='empty';e.textContent='·';grid.append(e); }
for(let day=1;day<=30;day++){ const s=document.createElement('span');s.textContent=day;if(day===6)s.className='wedding-day';grid.append(s); }

const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);} }),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const dlg = document.getElementById('rsvpDialog');
const form = document.getElementById('rsvpForm');
const showForm = ()=> dlg.showModal();
document.getElementById('confirmBtn').addEventListener('click',showForm);
document.getElementById('messageBtn').addEventListener('click',showForm);
document.getElementById('closeDialog').addEventListener('click',()=>dlg.close());

// Опционально: укажите URL обработчика (Formspree / Make / свой endpoint), чтобы ответы приходили онлайн.
// Пример: const RSVP_ENDPOINT = 'https://formspree.io/f/ВАШ_ID';
const RSVP_ENDPOINT = '';
form.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem('wedding_rsvp', JSON.stringify({...data, savedAt:new Date().toISOString()}));
  if(RSVP_ENDPOINT){
    try{
      const res = await fetch(RSVP_ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!res.ok) throw new Error('send failed');
    }catch(e){ console.warn(e); }
  }
  form.innerHTML = '<h3 class="great" style="font-size:44px;text-align:center;margin:20px 0">Спасибо! ♡</h3><p style="text-align:center;font-size:20px">Ваш ответ сохранён.</p><button class="confirm" type="button" onclick="document.getElementById(\'rsvpDialog\').close()">Закрыть</button>';
});
