const ENEMIES = [
  { id:"EXP-001", name:"Gárgola", role:"Centinela de piedra", threat:"Media", tone:"w",
    desc:"Estatua de la Catedral en Ruinas que despierta cuando el Hermano Cruz cruza su nave. Se lanza en picada desde las alturas y vuelve a petrificarse para resistir golpes.",
    hp:120, dmg:15, spd:60,
    mech:["Ataque en picada desde cornisas y techos","Forma de piedra: reduce el daño recibido mientras está quieta","Vulnerable al Cántico Sagrado, que rompe la petrificación"],
    art:"gargoyle" },
  { id:"EXP-002", name:"La Muerte", role:"Segadora de almas", threat:"Alta", tone:"r",
    desc:"Persigue a quienes escaparon de su destino. Desde que la esposa del Hermano Cruz sobrevivió, la Muerte lo considera una deuda pendiente.",
    hp:180, dmg:25, spd:75,
    mech:["Barrido de guadaña de largo alcance","Se teletransporta entre sombras cercanas","Phantom advierte su aparición antes del ataque"],
    art:"death" },
  { id:"EXP-003", name:"Minotauro", role:"Bestia del laberinto", threat:"Jefe", tone:"r",
    desc:"Guardián colosal que bloquea el paso en el Bosque de las Sombras. Lento al girar, pero su embestida atraviesa todo el escenario.",
    hp:350, dmg:35, spd:40,
    mech:["Embestida en línea recta que derriba al jugador","Golpe al suelo que genera ondas de choque","Queda aturdido si choca contra una pared: ventana para la Lanza de Luz"],
    art:"minotaur" }
];
const SKILLS = [
  { id:"HAB-01", name:"Doble salto", role:"Movilidad", tone:"g", threat:"Pasiva",
    desc:"Un segundo impulso en el aire para alcanzar plataformas altas y esquivar embestidas y picadas.",
    a:2, b:0, aLabel:"Saltos", bLabel:"Recarga", aMax:2, bMax:12, aUnit:"", bUnit:"s",
    mech:["Se desbloquea tras el tutorial en la Catedral en Ruinas","Se recarga al tocar el suelo","Esencial para evitar la embestida del Minotauro"],
    art:"jump" },
  { id:"HAB-02", name:"Cántico Sagrado", role:"Control de área", tone:"r", threat:"Activa",
    desc:"El Hermano Cruz entona una oración que hiere a los demonios a su alrededor y los detiene un instante.",
    a:20, b:8, aLabel:"Daño", bLabel:"Recarga", aMax:40, bMax:12, aUnit:"", bUnit:"s",
    mech:["Daño en área alrededor del jugador","Aturde durante 1.5 s a los enemigos alcanzados","Rompe la forma de piedra de la Gárgola"],
    art:"chant" },
  { id:"HAB-03", name:"Lanza de Luz", role:"Ataque a distancia", tone:"r", threat:"Activa",
    desc:"Proyectil de luz sagrada que atraviesa enemigos en línea recta. El arma para jefes que no conviene enfrentar de cerca.",
    a:30, b:5, aLabel:"Daño", bLabel:"Recarga", aMax:40, bMax:12, aUnit:"", bUnit:"s",
    mech:["Atraviesa a varios enemigos en línea","Daño doble a un Minotauro aturdido","Mantener presionado para cargar el disparo"],
    art:"spear" }
];

const ART = {
  gargoyle:`<svg viewBox="0 0 64 64" shape-rendering="crispEdges"><g fill="#8a7f80"><rect x="26" y="14" width="12" height="10"/><rect x="22" y="24" width="20" height="16"/><rect x="24" y="40" width="6" height="10"/><rect x="34" y="40" width="6" height="10"/></g><g fill="#5a4f50"><rect x="6" y="18" width="16" height="4"/><rect x="10" y="22" width="12" height="4"/><rect x="14" y="26" width="8" height="4"/><rect x="42" y="18" width="16" height="4"/><rect x="42" y="22" width="12" height="4"/><rect x="42" y="26" width="8" height="4"/><rect x="24" y="10" width="4" height="4"/><rect x="36" y="10" width="4" height="4"/></g><rect x="28" y="17" width="3" height="3" fill="#ff2a3d"/><rect x="33" y="17" width="3" height="3" fill="#ff2a3d"/></svg>`,
  death:`<svg viewBox="0 0 64 64" shape-rendering="crispEdges"><g fill="#2a2224"><rect x="22" y="10" width="20" height="8"/><rect x="18" y="18" width="28" height="34"/><rect x="16" y="44" width="32" height="8"/></g><rect x="26" y="16" width="12" height="12" fill="#e8e0e0"/><rect x="28" y="19" width="3" height="3" fill="#ff2a3d"/><rect x="33" y="19" width="3" height="3" fill="#ff2a3d"/><rect x="30" y="24" width="4" height="2" fill="#2a2224"/><rect x="48" y="6" width="3" height="50" fill="#8a7f80"/><g fill="#d8d0d0"><rect x="36" y="6" width="14" height="3"/><rect x="34" y="9" width="6" height="3"/></g></svg>`,
  minotaur:`<svg viewBox="0 0 64 64" shape-rendering="crispEdges"><g fill="#6b3a2a"><rect x="22" y="14" width="20" height="14"/><rect x="16" y="28" width="32" height="18"/><rect x="18" y="46" width="10" height="10"/><rect x="36" y="46" width="10" height="10"/><rect x="10" y="30" width="6" height="14"/><rect x="48" y="30" width="6" height="14"/></g><g fill="#e8e0d0"><rect x="14" y="10" width="8" height="4"/><rect x="12" y="6" width="4" height="4"/><rect x="42" y="10" width="8" height="4"/><rect x="48" y="6" width="4" height="4"/></g><rect x="26" y="18" width="3" height="3" fill="#ff2a3d"/><rect x="35" y="18" width="3" height="3" fill="#ff2a3d"/><rect x="28" y="24" width="8" height="4" fill="#3a1d14"/><rect x="30" y="27" width="4" height="2" fill="#c9a24a"/></svg>`,
  jump:`<svg viewBox="0 0 64 64" fill="none" stroke-width="3"><path d="M14 52h36" stroke="#5a4f50"/><path d="M20 46c4-14 10-20 14-20" stroke="#7fe0b0" stroke-dasharray="3 4"/><path d="M34 26c4-8 8-12 14-12" stroke="#7fe0b0"/><path d="M42 10l6 4-6 4" stroke="#7fe0b0"/><circle cx="34" cy="26" r="4" fill="#7fe0b0" stroke="none"/></svg>`,
  chant:`<svg viewBox="0 0 64 64" fill="none" stroke-width="2.5"><circle cx="32" cy="32" r="22" stroke="#ff2a3d" opacity=".35"/><circle cx="32" cy="32" r="15" stroke="#ff2a3d" opacity=".6"/><rect x="29" y="18" width="6" height="28" fill="#ff2a3d" stroke="none"/><rect x="22" y="25" width="20" height="6" fill="#ff2a3d" stroke="none"/></svg>`,
  spear:`<svg viewBox="0 0 64 64" fill="none" stroke-width="3"><path d="M8 48L50 14" stroke="#fff3c4"/><path d="M50 14l-12 2 10 10z" fill="#fff3c4" stroke="none"/><path d="M8 48L50 14" stroke="#ffd36b" stroke-width="9" opacity=".25"/></svg>`
};

let mode = "enemigos";
const grid = document.getElementById("grid");
const q = document.getElementById("q");
const sortSel = document.getElementById("sort");

function vital(k, v, max, cls, unit=""){
  const pct = Math.max(4, Math.min(100, (v / max) * 100));
  return `<div class="vital"><span class="k">${k}</span><div class="bar ${cls}" role="meter" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${v}" aria-label="${k}"><i data-w="${pct}"></i></div><span class="v">${v}${unit}</span></div>`;
}
function card(x){
  const isEnemy = mode === "enemigos";
  const vit = isEnemy
    ? vital("Salud", x.hp, 400, "") + vital("Daño", x.dmg, 40, "alt") + vital("Veloc.", x.spd, 100, "cyan")
    : vital(x.aLabel, x.a, x.aMax, x.tone==="g"?"cyan":"") + vital(x.bLabel, x.b, x.bMax, "alt", x.bUnit);
  return `<article class="card">
    <div class="chart-top"><span class="id">${x.id}</span><span class="pill ${x.tone}">${isEnemy ? "Amenaza: "+x.threat : x.threat}</span></div>
    <div class="portrait">${ART[x.art]}</div>
    <div class="body">
      <div><h3>${x.name}</h3><div class="role">${x.role}</div></div>
      <p class="desc">${x.desc}</p>
      <div class="vitals">${vit}</div>
      <details><summary>${isEnemy ? "Patrones de ataque" : "Mecánica"}</summary><ul>${x.mech.map(m=>`<li>${m}</li>`).join("")}</ul></details>
    </div>
  </article>`;
}
function render(){
  const data = (mode === "enemigos" ? ENEMIES : SKILLS).slice();
  const term = q.value.trim().toLowerCase();
  let list = data.filter(x => !term || (x.name + " " + x.desc + " " + x.role + " " + x.mech.join(" ")).toLowerCase().includes(term));
  const s = sortSel.value;
  const A = x => mode==="enemigos" ? x.hp : x.a;
  const B = x => mode==="enemigos" ? x.dmg : x.b;
  if (s==="a") list.sort((m,n)=>A(n)-A(m));
  if (s==="b") list.sort((m,n)=>B(n)-B(m));
  if (s==="name") list.sort((m,n)=>m.name.localeCompare(n.name,"es"));
  grid.innerHTML = list.length ? list.map(card).join("") : `<div class="empty">Ningún expediente coincide con “${q.value}”.</div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>grid.querySelectorAll(".bar i").forEach(i=>i.style.width=i.dataset.w+"%")));
}
function setMode(m){
  mode = m;
  document.getElementById("tab-enemigos").setAttribute("aria-selected", m==="enemigos");
  document.getElementById("tab-habilidades").setAttribute("aria-selected", m==="habilidades");
  document.getElementById("db-title").textContent = m==="enemigos" ? "Expedientes del inframundo" : "Habilidades desbloqueables";
  document.getElementById("db-sub").textContent = m==="enemigos"
    ? "Enemigos de los tres primeros niveles: Catedral en Ruinas, Ciudad y Bosque de las Sombras."
    : "Lo que el Hermano Cruz gana al avanzar: movilidad, fe y luz contra los demonios.";
  const opts = sortSel.options;
  opts[1].textContent = m==="enemigos" ? "Mayor salud" : "Mayor valor principal";
  opts[2].textContent = m==="enemigos" ? "Mayor daño" : "Mayor recarga";
  try{ localStorage.setItem("hh-tab", m) }catch(e){}
  render();
}
document.getElementById("tab-enemigos").onclick = ()=>setMode("enemigos");
document.getElementById("tab-habilidades").onclick = ()=>setMode("habilidades");
q.addEventListener("input", render);
sortSel.addEventListener("change", render);
let saved = "enemigos";
try{ saved = localStorage.getItem("hh-tab") || "enemigos" }catch(e){}
if (location.hash === "#habilidades") saved = "habilidades";
setMode(saved === "habilidades" ? "habilidades" : "enemigos");

/* ECG */
(function(){
  let d = "M0 50", x = 0;
  while (x < 1200){
    d += ` L${x+60} 50 L${x+70} 44 L${x+80} 50 L${x+92} 50 L${x+98} 58 L${x+106} 8 L${x+114} 78 L${x+120} 50 L${x+140} 50 L${x+155} 40 L${x+170} 50 L${x+200} 50`;
    x += 200;
  }
  document.getElementById("ecgpath").setAttribute("d", d);
})();

/* Descargas */
const DL = {
  community:{ kind:"App de la Comunidad", title:"HellMed Hub para Android",
    text:"Gestiona tu perfil, sigue tu progreso, personaliza skins (Cura Clásico y Paramédico), compra DLCs y entra al foro.",
    rows:[["Plataforma","Android · Google Play"],["Precio","Gratis con compras opcionales"],["Estado","Enlace de descarga en preparación"]] },
  game:{ kind:"Videojuego móvil", title:"HELLMED: Pulse of the Damned",
    text:"Instalable del juego para celular, con los tres niveles iniciales y el sistema de curación con botiquín.",
    rows:[["Plataforma","Android (APK)"],["Contenido","Catedral en Ruinas, Ciudad, Bosque de las Sombras"],["Estado","Enlace de descarga en preparación"]] }
};
const ov = document.getElementById("overlay");
let lastBtn = null;
document.querySelectorAll("[data-dl]").forEach(b=>b.addEventListener("click",()=>{
  const d = DL[b.dataset.dl]; lastBtn = b;
  document.getElementById("m-kind").textContent = d.kind;
  document.getElementById("m-title").textContent = d.title;
  document.getElementById("m-text").textContent = d.text;
  document.getElementById("m-dl").innerHTML = d.rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join("");
  ov.hidden = false; document.getElementById("m-close").focus();
}));
function closeM(){ ov.hidden = true; lastBtn && lastBtn.focus(); }
document.getElementById("m-close").onclick = closeM;
ov.addEventListener("click", e=>{ if(e.target===ov) closeM(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !ov.hidden) closeM(); });