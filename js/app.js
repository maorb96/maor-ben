const BY_ID = Object.fromEntries(CATS.map(c => [c.id, c]));

const RITUAL = [
  {name:'חימום', cats:['day','play'], count:2},
  {name:'עומק', cats:['feel','us','deep','memory','dream','whatif'], count:2},
  {name:'סיום חם', cats:['close'], count:1, together:true}
];

/* remember which questions were asked, per browser, so they don't repeat */
const KEY = 'maor-ben-seen-v1';
let seen = new Set();
try { seen = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
function saveSeen(){ try { localStorage.setItem(KEY, JSON.stringify([...seen])); } catch (e) {} }

function pick(catIds){
  let pool = [];
  catIds.forEach(id => BY_ID[id].qs.forEach((q, i) => pool.push({cat:id, i, q, key:id + ':' + i})));
  let fresh = pool.filter(p => !seen.has(p.key) && (!state.current || p.key !== state.current.key));
  if (!fresh.length) {
    pool.forEach(p => seen.delete(p.key));
    fresh = pool.filter(p => !state.current || p.key !== state.current.key);
  }
  const choice = fresh[Math.floor(Math.random() * fresh.length)];
  seen.add(choice.key); saveSeen();
  return choice;
}

const state = { mode:null, cats:null, stage:0, step:0, turn:0, current:null };
const app = document.getElementById('app');

function home(){
  state.mode = null; state.current = null;
  const cats = CATS.filter(c => !c.hidden).map(c =>
    `<button class="cat" data-cat="${c.id}" type="button"><b>${c.name}</b><small>${c.hint}</small></button>`).join('');
  app.innerHTML = `
  <section class="view">
    <header>
      <div class="eyebrow">שאלה אחת. ערב אחד. ממשיכים לגלות.</div>
      <h1>מאור <span class="amp">ו</span>בן</h1>
      <p class="lead">שומרים על הגחלת: כמה דקות בערב, טלפון אחד על השולחן, והרבה סקרנות אחד כלפי השני.</p>
    </header>
    <div class="ember-wrap">
      <button class="ember" id="startRitual" type="button" aria-label="להתחיל את טקס הערב">
        <b>טקס הערב</b><span>להדליק</span>
      </button>
      <div class="ember-note">חימום, עומק וסיום חם · בערך 15 דקות</div>
    </div>
    <div>
      <h2 class="section-title">או לבחור נושא</h2>
      <div class="cats">
        ${cats}
        <button class="cat wide" data-cat="all" type="button"><b>הפתעה</b><small>שאלה מכל הנושאים</small></button>
      </div>
    </div>
    <div class="foot">השאלות לא חוזרות על עצמן עד שנגמר הנושא</div>
  </section>`;
  document.getElementById('startRitual').onclick = intro;
  app.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => startFree(b.dataset.cat));
}

function intro(){
  app.innerHTML = `
  <section class="view">
    <div class="topbar"><button class="link" id="back" type="button">→ חזרה</button></div>
    <header>
      <div class="eyebrow">לפני שמתחילים</div>
      <h1 style="font-size:clamp(36px,10vw,50px)">הערב שלנו</h1>
    </header>
    <ul class="rules">
      <li><span>שמים בצד את הטלפונים האחרים. נשאר רק המסך הזה.</span></li>
      <li><span>אחד עונה, השני <b>רק מקשיב</b>. בלי לתקן ובלי לפתור.</span></li>
      <li><span>מותר לשאול "ספר עוד". אסור למהר.</span></li>
      <li><span>שאלה לא מתאימה הערב? מדלגים בלי הסברים.</span></li>
    </ul>
    <div class="plan">
      <div><b>חימום</b><small>2 שאלות קלילות</small></div>
      <div><b>עומק</b><small>2 שאלות פתוחות</small></div>
      <div><b>סיום חם</b><small>רגע אחד ביחד</small></div>
    </div>
    <div class="actions"><button class="btn primary" id="go" type="button">מוכנים ←</button></div>
  </section>`;
  document.getElementById('back').onclick = home;
  document.getElementById('go').onclick = startRitual;
}

function startRitual(){
  state.mode = 'ritual'; state.stage = 0; state.step = 0;
  state.turn = Math.random() < .5 ? 0 : 1;
  state.current = pick(RITUAL[0].cats);
  question();
  keepAwake();
}

function startFree(catId){
  state.mode = 'free';
  state.cats = catId === 'all' ? CATS.filter(c => !c.hidden).map(c => c.id) : [catId];
  state.turn = Math.random() < .5 ? 0 : 1;
  state.current = pick(state.cats);
  question();
  keepAwake();
}

function question(){
  const q = state.current;
  const ritual = state.mode === 'ritual';
  const st = ritual ? RITUAL[state.stage] : null;
  const together = ritual && st.together;
  const first = NAMES[state.turn], second = NAMES[1 - state.turn];
  const stages = ritual ? `<div class="stages" aria-label="שלב ${state.stage + 1} מתוך 3">${
    RITUAL.map((s, i) => `<div class="stage ${i < state.stage ? 'done' : i === state.stage ? 'now' : ''}">${s.name}</div>`).join('')
  }</div>` : '';
  const isLast = ritual && state.stage === RITUAL.length - 1 && state.step >= st.count - 1;
  app.innerHTML = `
  <section class="view">
    <div class="topbar"><button class="link" id="back" type="button">→ בית</button>${stages}</div>
    <div class="qzone">
      <span class="tag">${BY_ID[q.cat].name}</span>
      <p class="question">${q.q}</p>
      <div class="turn"><span class="dot"></span>${
        together ? '<span><b>שניכם</b>, ביחד</span>' : `<span><b>${first}</b> עונה ראשון, ואז ${second}</span>`
      }</div>
    </div>
    <div class="actions">
      <button class="btn ghost" id="skip" type="button">שאלה אחרת</button>
      <button class="btn primary" id="next" type="button">${isLast ? 'סיימנו ←' : 'הבאה ←'}</button>
    </div>
  </section>`;
  document.getElementById('back').onclick = home;
  document.getElementById('skip').onclick = () => {
    state.current = pick(ritual ? st.cats : state.cats); question();
  };
  document.getElementById('next').onclick = next;
}

function next(){
  state.turn = 1 - state.turn;
  if (state.mode === 'free') { state.current = pick(state.cats); return question(); }
  state.step++;
  if (state.step >= RITUAL[state.stage].count) { state.stage++; state.step = 0; }
  if (state.stage >= RITUAL.length) return end();
  state.current = pick(RITUAL[state.stage].cats);
  question();
}

function end(){
  app.innerHTML = `
  <section class="view">
    <div class="end">
      <div class="eyebrow">הגחלת דולקת</div>
      <h2>לילה טוב,<br>מאור ובן</h2>
      <p>עוד ערב קטן שבניתם ביחד. נתראה כאן מחר.</p>
    </div>
    <div class="actions">
      <button class="btn ghost" id="more" type="button">עוד שאלה אחת</button>
      <button class="btn primary" id="home" type="button">חזרה להתחלה</button>
    </div>
  </section>`;
  document.getElementById('home').onclick = home;
  document.getElementById('more').onclick = () => startFree('all');
}

/* keep the screen on during the evening, when the browser allows it */
let lock = null;
async function keepAwake(){
  try { if ('wakeLock' in navigator && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => lock = null); } } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && state.mode) keepAwake(); });

/* rising embers */
(function(){
  const box = document.getElementById('sparks');
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('i');
    s.style.left = (5 + Math.random() * 90) + '%';
    s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    s.style.animationDuration = (7 + Math.random() * 8) + 's';
    s.style.animationDelay = (-Math.random() * 12) + 's';
    const size = 2 + Math.random() * 3;
    s.style.width = s.style.height = size + 'px';
    box.appendChild(s);
  }
})();

home();
