import { useState } from "react";

// ── PALETTE ──────────────────────────────────────────────
const C = {
  black:   "#0D0D0D",
  dark:    "#1A1A1A",
  card:    "#222222",
  border:  "#333333",
  ocean:   "#0077B6",
  wave:    "#00B4D8",
  sand:    "#F2E8D5",
  white:   "#FFFFFF",
  muted:   "#888888",
  success: "#22C55E",
  warn:    "#F59E0B",
  danger:  "#EF4444",
};

// ── MOCK DATA ─────────────────────────────────────────────
const MOCK_ATHLETES = [
  { id:1, name:"João Silva",   age:16, gender:"M", email:"joao@email.com",   phone:"912000001", guardian:"Maria Silva",   guardianEmail:"maria@email.com",   guardianPhone:"912000002", boards:[{id:1,name:"SharpEye HT2",brand:"SharpEye",size:"5'10\"",liters:26,type:"Performance",ideal:"Ondas ocas 1m-1.5m"}], username:"joao.silva",   password:"surf123" },
  { id:2, name:"Pedro Costa",  age:14, gender:"M", email:"pedro@email.com",  phone:"912000003", guardian:"Ana Costa",    guardianEmail:"ana@email.com",    guardianPhone:"912000004", boards:[{id:2,name:"DHD Phoenix",brand:"DHD",size:"5'8\"",liters:24,type:"Performance",ideal:"Beach break 1m-2m"}], username:"pedro.costa",  password:"surf456" },
  { id:3, name:"Tiago Mendes", age:15, gender:"M", email:"tiago@email.com",  phone:"912000005", guardian:"Carlos Mendes",guardianEmail:"carlos@email.com", guardianPhone:"912000006", boards:[{id:3,name:"Firewire Seaside",brand:"Firewire",size:"5'7\"",liters:28,type:"Hybrid",ideal:"Ondas pequenas 0.5m-1m"}], username:"tiago.mendes", password:"surf789" },
];

const MOCK_SESSIONS = [
  { id:1, date:"2025-06-10", time:"07:00", location:"Barra, Aveiro", waveSize:"1m", waveDir:"Direita", waveType:"Beach Break", crowd:"Baixo", attendees:[1,2], skills:{
    1:{ tecnica:["Trajetória Base","Velocidade"], tatica:["Seleção de onda","Posicionamento pico"], fisica:["Força","Resistência"], psicologica:["Focado"] },
    2:{ tecnica:["Trajetória Base","Trajetória Crítica"], tatica:["Prioridade"], fisica:["Explosão"], psicologica:["Gestão do erro"] }
  }},
  { id:2, date:"2025-06-12", time:"08:00", location:"Costa Nova, Aveiro", waveSize:"1.5m", waveDir:"Mista", waveType:"Beach Break", crowd:"Médio", attendees:[1,2,3], skills:{
    1:{ tecnica:["Tubos"], tatica:["Plano bateria","Gestão tempo"], fisica:["Velocidade"], psicologica:["Focado"] },
    2:{ tecnica:["Aéreos"], tatica:["Seleção de onda"], fisica:["Força"], psicologica:["Inseguro"] },
    3:{ tecnica:["Trajetória Base"], tatica:["Posicionamento pico"], fisica:["Mobilidade"], psicologica:["Desmotivado"] }
  }},
];

const MOCK_CHAMPS = [
  { id:1, name:"Regional Aveiro 2025", date:"2025-07-05", location:"Praia da Barra", category:"Regional", importance:"Alta", athletes:[1,2] },
  { id:2, name:"Nacional Júnior 2025", date:"2025-08-15", location:"Peniche", category:"Nacional", importance:"Principal", athletes:[1] },
];

// ── HELPERS ───────────────────────────────────────────────
const Star = ({ filled }) => (
  <span style={{ color: filled ? C.wave : C.border, fontSize:20 }}>★</span>
);
const Rating = ({ value, onChange }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(n => (
      <span key={n} onClick={() => onChange && onChange(n)}
        style={{ cursor: onChange ? "pointer" : "default" }}>
        <Star filled={n <= value} />
      </span>
    ))}
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{
    background: color + "22", color, border:`1px solid ${color}44`,
    borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:700,
    letterSpacing:1, textTransform:"uppercase"
  }}>{children}</span>
);

const importanceColor = { Baixa: C.muted, Média: C.warn, Alta: C.ocean, Principal: C.wave };
const categoryColor   = { Regional: C.muted, Nacional: C.ocean, Europeu: C.wave, Mundial: C.success };

function Card({ children, style }) {
  return (
    <div style={{
      background: C.card, border:`1px solid ${C.border}`,
      borderRadius:16, padding:20, marginBottom:16, ...style
    }}>{children}</div>
  );
}

function Btn({ children, onClick, variant="primary", small, style }) {
  const base = {
    border:"none", borderRadius:10, cursor:"pointer", fontWeight:700,
    fontSize: small ? 13 : 15, padding: small ? "6px 14px" : "12px 24px",
    letterSpacing:0.5, transition:"opacity .15s", ...style
  };
  const variants = {
    primary:  { background: C.ocean,   color: C.white },
    wave:     { background: C.wave,    color: C.black },
    ghost:    { background:"transparent", color: C.wave, border:`1px solid ${C.wave}` },
    danger:   { background: C.danger,  color: C.white },
    success:  { background: C.success, color: C.white },
    dark:     { background: C.border,  color: C.white },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
}

function Input({ label, value, onChange, type="text", placeholder }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <div style={{ color:C.muted, fontSize:12, fontWeight:700, marginBottom:5, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width:"100%", background:C.dark, border:`1px solid ${C.border}`, borderRadius:10,
          color:C.white, padding:"10px 14px", fontSize:15, outline:"none", boxSizing:"border-box"
        }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <div style={{ color:C.muted, fontSize:12, fontWeight:700, marginBottom:5, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width:"100%", background:C.dark, border:`1px solid ${C.border}`, borderRadius:10,
          color:C.white, padding:"10px 14px", fontSize:15, outline:"none", boxSizing:"border-box"
        }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function CheckList({ items, selected, onChange, color }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {items.map(item => {
        const on = selected.includes(item);
        return (
          <div key={item} onClick={() => {
            if (on) onChange(selected.filter(x => x !== item));
            else onChange([...selected, item]);
          }} style={{
            padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
            background: on ? (color || C.ocean) + "33" : C.dark,
            border: `1px solid ${on ? (color || C.ocean) : C.border}`,
            color: on ? (color || C.wave) : C.muted,
            transition:"all .15s"
          }}>{item}</div>
        );
      })}
    </div>
  );
}

// ── WAVE DECORATION ───────────────────────────────────────
function WaveBar() {
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none"
      style={{ width:"100%", height:40, display:"block", marginBottom:-1 }}>
      <path d="M0,30 C200,0 400,60 600,30 C800,0 1000,60 1200,30 L1200,60 L0,60 Z"
        fill={C.ocean} opacity={0.25} />
      <path d="M0,40 C300,10 600,60 900,30 C1050,15 1150,45 1200,35 L1200,60 L0,60 Z"
        fill={C.wave} opacity={0.15} />
    </svg>
  );
}

// ── LOGIN ─────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState("");

  const handle = () => {
    if (user === "treinador" && pass === "asa2025") { onLogin({ role:"coach", name:"Treinador" }); return; }
    const a = MOCK_ATHLETES.find(a => a.username === user && a.password === pass);
    if (a) { onLogin({ role:"athlete", id:a.id, name:a.name }); return; }
    setErr("Credenciais inválidas.");
  };

  return (
    <div style={{ minHeight:"100vh", background:C.black, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Logo area */}
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ width:90, height:90, borderRadius:20, background:C.white, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:`0 0 40px ${C.wave}44` }}>
          <span style={{ fontSize:48 }}>🏄</span>
        </div>
        <div style={{ color:C.white, fontSize:22, fontWeight:900, letterSpacing:2, textTransform:"uppercase" }}>Associação de Surf</div>
        <div style={{ color:C.wave, fontSize:14, fontWeight:700, letterSpacing:4, textTransform:"uppercase" }}>de Aveiro</div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:36, width:"100%", maxWidth:380, boxShadow:`0 20px 60px #00000088` }}>
        <div style={{ color:C.white, fontSize:18, fontWeight:800, marginBottom:24 }}>Entrar na plataforma</div>
        <Input label="Utilizador" value={user} onChange={setUser} placeholder="ex: joao.silva" />
        <Input label="Password" value={pass} onChange={setPass} type="password" placeholder="••••••••" />
        {err && <div style={{ color:C.danger, fontSize:13, marginBottom:12 }}>{err}</div>}
        <Btn onClick={handle} style={{ width:"100%" }}>Entrar →</Btn>
        <div style={{ color:C.muted, fontSize:12, marginTop:16, textAlign:"center" }}>
          Treinador: <b style={{color:C.wave}}>treinador / asa2025</b><br/>
          Atletas: <b style={{color:C.wave}}>joao.silva / surf123</b>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────
function Sidebar({ role, active, setActive, onLogout }) {
  const coachNav = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"athletes",  icon:"🏄", label:"Atletas" },
    { id:"sessions",  icon:"🌊", label:"Treinos" },
    { id:"champs",    icon:"🏆", label:"Campeonatos" },
    { id:"fees",      icon:"💶", label:"Mensalidades" },
  ];
  const athleteNav = [
    { id:"my-profile",  icon:"👤", label:"Perfil" },
    { id:"my-sessions", icon:"🌊", label:"Treinos" },
    { id:"my-champs",   icon:"🏆", label:"Campeonatos" },
    { id:"my-boards",   icon:"🏄", label:"Pranchas" },
  ];
  const nav = role === "coach" ? coachNav : athleteNav;

  return (
    <div style={{
      width:220, minHeight:"100vh", background:C.dark, borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column", flexShrink:0
    }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏄</div>
          <div>
            <div style={{ color:C.white, fontSize:13, fontWeight:800, lineHeight:1.2 }}>Surf Aveiro</div>
            <div style={{ color:C.wave, fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>
              {role === "coach" ? "Treinador" : "Atleta"}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex:1, padding:"12px 10px" }}>
        {nav.map(item => (
          <div key={item.id} onClick={() => setActive(item.id)}
            style={{
              display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
              borderRadius:10, cursor:"pointer", marginBottom:4,
              background: active === item.id ? C.ocean + "33" : "transparent",
              color: active === item.id ? C.wave : C.muted,
              fontWeight: active === item.id ? 700 : 500, fontSize:14,
              transition:"all .15s"
            }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ padding:16, borderTop:`1px solid ${C.border}` }}>
        <Btn variant="ghost" onClick={onLogout} style={{ width:"100%", fontSize:13 }}>Sair</Btn>
      </div>
    </div>
  );
}

// ── TOPBAR ────────────────────────────────────────────────
function TopBar({ title, subtitle }) {
  return (
    <div style={{ padding:"24px 32px 0", marginBottom:24 }}>
      <div style={{ color:C.white, fontSize:26, fontWeight:900, letterSpacing:-0.5 }}>{title}</div>
      {subtitle && <div style={{ color:C.muted, fontSize:14, marginTop:2 }}>{subtitle}</div>}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────
function Dashboard({ athletes, sessions, champs }) {
  const thisMonth = sessions.filter(s => s.date.startsWith("2025-06"));
  const presences = thisMonth.reduce((acc,s) => acc + s.attendees.length, 0);

  return (
    <div>
      <TopBar title="Dashboard" subtitle="Visão geral da equipa" />
      <div style={{ padding:"0 32px" }}>
        <WaveBar />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
          {[
            { label:"Atletas Ativos",   value: athletes.length, icon:"🏄", color:C.wave },
            { label:"Presenças (mês)",  value: presences,       icon:"📅", color:C.success },
            { label:"Mensalidades Pendentes", value: 2,         icon:"💶", color:C.warn },
            { label:"Próximo Campeonato", value:"5 Jul",        icon:"🏆", color:C.ocean },
          ].map(stat => (
            <Card key={stat.label} style={{ borderTop:`3px solid ${stat.color}`, marginBottom:0 }}>
              <div style={{ color:stat.color, fontSize:28, marginBottom:4 }}>{stat.icon}</div>
              <div style={{ color:C.white, fontSize:28, fontWeight:900 }}>{stat.value}</div>
              <div style={{ color:C.muted, fontSize:13 }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card>
            <div style={{ color:C.wave, fontWeight:800, marginBottom:14, fontSize:15 }}>🌊 Últimos Treinos</div>
            {sessions.slice(-3).reverse().map(s => (
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ color:C.white, fontWeight:700, fontSize:14 }}>{s.location}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{s.date} · {s.time}</div>
                </div>
                <Badge color={C.ocean}>{s.waveSize}</Badge>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ color:C.wave, fontWeight:800, marginBottom:14, fontSize:15 }}>🏆 Próximos Campeonatos</div>
            {champs.map(c => (
              <div key={c.id} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ color:C.white, fontWeight:700, fontSize:14 }}>{c.name}</div>
                <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>{c.date} · {c.location}</div>
                <Badge color={importanceColor[c.importance]}>{c.importance}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── ATHLETES ──────────────────────────────────────────────
function Athletes({ athletes, setAthletes }) {
  const [view,   setView]   = useState("list"); // list | detail | create
  const [sel,    setSel]    = useState(null);
  const [form,   setForm]   = useState({ name:"",dob:"",gender:"M",address:"",email:"",phone:"",guardian:"",guardianEmail:"",guardianPhone:"" });

  const create = () => {
    const uname = form.name.toLowerCase().replace(/ /g,".");
    const newA = { ...form, id: athletes.length+1, username:uname, password:"surf"+Date.now().toString().slice(-4), boards:[] };
    setAthletes([...athletes, newA]);
    setView("list");
    setForm({ name:"",dob:"",gender:"M",address:"",email:"",phone:"",guardian:"",guardianEmail:"",guardianPhone:"" });
  };

  if (view === "detail" && sel) {
    const a = athletes.find(x => x.id === sel);
    return (
      <div>
        <div style={{ padding:"24px 32px 0", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <Btn variant="ghost" small onClick={() => setView("list")}>← Voltar</Btn>
          <div style={{ color:C.white, fontSize:24, fontWeight:900 }}>{a.name}</div>
        </div>
        <div style={{ padding:"0 32px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <Card>
              <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>👤 Dados Pessoais</div>
              {[["Email",a.email],["Telefone",a.phone],["Género",a.gender]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.muted, fontSize:13 }}>{k}</span>
                  <span style={{ color:C.white, fontSize:13 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>👨‍👩‍👦 Encarregado</div>
              {[["Nome",a.guardian],["Email",a.guardianEmail],["Tel",a.guardianPhone]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ color:C.muted, fontSize:13 }}>{k}</span>
                  <span style={{ color:C.white, fontSize:13 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>🔑 Acesso</div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.muted, fontSize:13 }}>Username</span>
                <span style={{ color:C.wave, fontSize:13, fontFamily:"monospace" }}>{a.username}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0" }}>
                <span style={{ color:C.muted, fontSize:13 }}>Password temp.</span>
                <span style={{ color:C.wave, fontSize:13, fontFamily:"monospace" }}>{a.password}</span>
              </div>
            </Card>
            <Card>
              <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>🏄 Pranchas ({a.boards.length})</div>
              {a.boards.map(b => (
                <div key={b.id} style={{ padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ color:C.white, fontWeight:700 }}>{b.name}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{b.size} · {b.liters}L · {b.type}</div>
                </div>
              ))}
              {a.boards.length === 0 && <div style={{ color:C.muted, fontSize:13 }}>Sem pranchas registadas.</div>}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (view === "create") return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Btn variant="ghost" small onClick={() => setView("list")}>← Voltar</Btn>
        <div style={{ color:C.white, fontSize:24, fontWeight:900 }}>Novo Atleta</div>
      </div>
      <div style={{ padding:"0 32px", maxWidth:600 }}>
        <Card>
          <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Dados Pessoais</div>
          <Input label="Nome completo" value={form.name} onChange={v => setForm({...form,name:v})} />
          <Input label="Data de nascimento" value={form.dob} onChange={v => setForm({...form,dob:v})} type="date" />
          <Select label="Género" value={form.gender} onChange={v => setForm({...form,gender:v})} options={["M","F","Outro"]} />
          <Input label="Email atleta" value={form.email} onChange={v => setForm({...form,email:v})} type="email" />
          <Input label="Telefone" value={form.phone} onChange={v => setForm({...form,phone:v})} />
        </Card>
        <Card>
          <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Encarregado de Educação</div>
          <Input label="Nome" value={form.guardian} onChange={v => setForm({...form,guardian:v})} />
          <Input label="Email" value={form.guardianEmail} onChange={v => setForm({...form,guardianEmail:v})} type="email" />
          <Input label="Telefone" value={form.guardianPhone} onChange={v => setForm({...form,guardianPhone:v})} />
        </Card>
        <Btn onClick={create}>Criar Atleta →</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ color:C.white, fontSize:26, fontWeight:900 }}>Atletas</div>
          <div style={{ color:C.muted, fontSize:14 }}>{athletes.length} atletas registados</div>
        </div>
        <Btn onClick={() => setView("create")}>+ Novo Atleta</Btn>
      </div>
      <div style={{ padding:"0 32px" }}>
        {athletes.map(a => (
          <Card key={a.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}
            onClick={() => { setSel(a.id); setView("detail"); }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:C.ocean+"33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏄</div>
              <div>
                <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{a.name}</div>
                <div style={{ color:C.muted, fontSize:13 }}>{a.email} · {a.phone}</div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>Encarregado</div>
              <div style={{ color:C.wave, fontSize:13, fontWeight:600 }}>{a.guardian}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SESSIONS ──────────────────────────────────────────────
// Técnica usa estrutura hierárquica: grupos com sub-itens
const TECNICA_GROUPS = [
  {
    id: "traj_base",
    label: "Trajetórias Base",
    subs: ["Bottom turn", "Cutback", "Re-entry", "Floater"],
  },
  {
    id: "traj_critica",
    label: "Trajetórias Críticas",
    subs: ["Snap / Hack", "Carving cutback", "Off-the-lip", "Full rotation (360)"],
  },
  {
    id: "aereos",
    label: "Aéreos (entrada/saída)",
    subs: ["Aéreo básico", "Aéreo reverse"],
  },
  {
    id: "combinacoes",
    label: "Combinações",
    subs: [],
  },
  {
    id: "tubos",
    label: "Tubos",
    subs: [],
  },
];

const SKILLS = {
  tecnica:    { label:"Técnica",    color:C.ocean,   hierarchical: true },
  tatica:     { label:"Tática",     color:C.wave,    items:["Seleção de onda","Posicionamento pico","Prioridade","Gestão tempo","Plano bateria"] },
  fisica:     { label:"Física",     color:C.success, items:["Força","Velocidade","Explosão","Resistência","Mobilidade","Reforço muscular"] },
  psicologica:{ label:"Psicológica",color:C.warn,    items:["Focado","Gestão do erro","Inseguro","Desmotivado"] },
};

// Helper: devolve todos os itens seleccionáveis de técnica (grupos + subs)
function allTecnicaKeys() {
  const keys = [];
  TECNICA_GROUPS.forEach(g => {
    keys.push(g.id);
    g.subs.forEach(s => keys.push(g.id + ":" + s));
  });
  return keys;
}

// Componente hierárquico para Técnica
function TecnicaCheckList({ selected, onChange, color }) {
  const toggle = key => {
    if (selected.includes(key)) onChange(selected.filter(x => x !== key));
    else onChange([...selected, key]);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {TECNICA_GROUPS.map(g => {
        const groupOn = selected.includes(g.id);
        return (
          <div key={g.id}>
            {/* Grupo principal */}
            <div onClick={() => toggle(g.id)} style={{
              display:"flex", alignItems:"center", gap:10, padding:"8px 14px",
              borderRadius:10, cursor:"pointer",
              background: groupOn ? color+"33" : C.dark,
              border:`1px solid ${groupOn ? color : C.border}`,
              color: groupOn ? color : C.white,
              fontWeight:700, fontSize:14, marginBottom: g.subs.length ? 6 : 0,
            }}>
              <span style={{ fontSize:16 }}>{groupOn ? "☑" : "☐"}</span>
              {g.label}
            </div>
            {/* Sub-itens com indentação */}
            {g.subs.length > 0 && (
              <div style={{ paddingLeft:24, display:"flex", flexWrap:"wrap", gap:6 }}>
                {g.subs.map(sub => {
                  const key = g.id + ":" + sub;
                  const on = selected.includes(key);
                  return (
                    <div key={key} onClick={() => toggle(key)} style={{
                      display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
                      borderRadius:8, cursor:"pointer", fontSize:13,
                      background: on ? color+"22" : C.dark,
                      border:`1px solid ${on ? color+"88" : C.border}`,
                      color: on ? color : C.muted,
                      fontWeight: on ? 700 : 400,
                    }}>
                      <span style={{ fontSize:10, opacity:0.6 }}>↳</span>
                      {sub}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Helper para mostrar labels legíveis de técnica na vista do atleta
function tecnicaLabel(key) {
  if (key.includes(":")) {
    const [gid, sub] = key.split(":");
    const g = TECNICA_GROUPS.find(x => x.id === gid);
    return g ? `${g.label} › ${sub}` : sub;
  }
  const g = TECNICA_GROUPS.find(x => x.id === key);
  return g ? g.label : key;
}

function Sessions({ athletes, sessions, setSessions }) {
  const [view,      setView]      = useState("list");
  const [sel,       setSel]       = useState(null);
  const [skillAth,  setSkillAth]  = useState(null);
  const [form,      setForm]      = useState({ date:"", time:"", location:"", waveSize:"1m", waveDir:"Direita", waveType:"Beach Break", crowd:"Baixo", attendees:[], skills:{} });

  const saveSession = () => {
    const s = { ...form, id: sessions.length+1 };
    setSessions([...sessions, s]);
    setView("list");
  };

  const updateSkills = (sessId, athId, cat, list) => {
    setSessions(sessions.map(s => {
      if (s.id !== sessId) return s;
      const skills = { ...s.skills, [athId]: { ...(s.skills[athId]||{}), [cat]: list } };
      return { ...s, skills };
    }));
  };

  if (view === "create") return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Btn variant="ghost" small onClick={() => setView("list")}>← Voltar</Btn>
        <div style={{ color:C.white, fontSize:24, fontWeight:900 }}>Novo Treino</div>
      </div>
      <div style={{ padding:"0 32px", maxWidth:680 }}>
        <Card>
          <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Dados do Treino</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Data" value={form.date} onChange={v => setForm({...form,date:v})} type="date" />
            <Input label="Hora" value={form.time} onChange={v => setForm({...form,time:v})} type="time" />
          </div>
          <Input label="Local" value={form.location} onChange={v => setForm({...form,location:v})} placeholder="ex: Praia da Barra, Aveiro" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            <Select label="Tamanho onda" value={form.waveSize} onChange={v => setForm({...form,waveSize:v})} options={["0.5m","1m","1.5m","2m","+2m"]} />
            <Select label="Direção" value={form.waveDir} onChange={v => setForm({...form,waveDir:v})} options={["Direita","Esquerda","Mista"]} />
            <Select label="Tipo" value={form.waveType} onChange={v => setForm({...form,waveType:v})} options={["Beach Break","Point Break","Reef Break"]} />
          </div>
          <Select label="Crowd" value={form.crowd} onChange={v => setForm({...form,crowd:v})} options={["Baixo","Médio","Alto"]} />
        </Card>
        <Card>
          <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Presenças</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {athletes.map(a => {
              const on = form.attendees.includes(a.id);
              return (
                <div key={a.id} onClick={() => {
                  const atts = on ? form.attendees.filter(x => x!==a.id) : [...form.attendees, a.id];
                  setForm({...form, attendees:atts});
                }} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, cursor:"pointer",
                  background: on ? C.ocean+"33" : C.dark, border:`1px solid ${on ? C.ocean : C.border}`,
                  color: on ? C.wave : C.muted, fontWeight:600, fontSize:14
                }}>
                  <span>{on ? "☑" : "☐"}</span> {a.name}
                </div>
              );
            })}
          </div>
        </Card>
        <Btn onClick={saveSession}>Guardar Treino →</Btn>
      </div>
    </div>
  );

  if (view === "skills" && sel) {
    const s = sessions.find(x => x.id === sel);
    const ath = skillAth ? athletes.find(a => a.id === skillAth) : null;
    return (
      <div>
        <div style={{ padding:"24px 32px 0", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <Btn variant="ghost" small onClick={() => { setSkillAth(null); setView("list"); }}>← Voltar</Btn>
          <div style={{ color:C.white, fontSize:24, fontWeight:900 }}>Competências — {s.location}</div>
        </div>
        <div style={{ padding:"0 32px" }}>
          {/* Athlete selector */}
          <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
            {s.attendees.map(id => {
              const a = athletes.find(x => x.id === id);
              const on = skillAth === id;
              return (
                <div key={id} onClick={() => setSkillAth(id)} style={{
                  padding:"8px 18px", borderRadius:10, cursor:"pointer",
                  background: on ? C.ocean+"33" : C.dark, border:`1px solid ${on ? C.ocean : C.border}`,
                  color: on ? C.wave : C.muted, fontWeight:700, fontSize:14
                }}>{a?.name}</div>
              );
            })}
          </div>

          {ath && Object.entries(SKILLS).map(([cat, meta]) => {
            const curSkills = s.skills?.[skillAth]?.[cat] || [];
            return (
              <Card key={cat} style={{ borderLeft:`3px solid ${meta.color}` }}>
                <div style={{ color:meta.color, fontWeight:800, marginBottom:12 }}>{meta.label}</div>
                {meta.hierarchical
                  ? <TecnicaCheckList selected={curSkills} color={meta.color}
                      onChange={list => updateSkills(s.id, skillAth, cat, list)} />
                  : <CheckList items={meta.items} selected={curSkills} color={meta.color}
                      onChange={list => updateSkills(s.id, skillAth, cat, list)} />
                }
              </Card>
            );
          })}
          {!ath && <div style={{ color:C.muted }}>Seleciona um atleta para ver as competências.</div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ color:C.white, fontSize:26, fontWeight:900 }}>Treinos</div>
          <div style={{ color:C.muted, fontSize:14 }}>{sessions.length} sessões registadas</div>
        </div>
        <Btn onClick={() => setView("create")}>+ Novo Treino</Btn>
      </div>
      <div style={{ padding:"0 32px" }}>
        {sessions.map(s => (
          <Card key={s.id} style={{ borderLeft:`3px solid ${C.ocean}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{s.location}</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:10 }}>{s.date} · {s.time}</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <Badge color={C.ocean}>{s.waveSize}</Badge>
                  <Badge color={C.wave}>{s.waveDir}</Badge>
                  <Badge color={C.muted}>{s.waveType}</Badge>
                  <Badge color={C.success}>{s.attendees.length} atletas</Badge>
                </div>
              </div>
              <Btn small variant="ghost" onClick={() => { setSel(s.id); setSkillAth(null); setView("skills"); }}>
                Competências →
              </Btn>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
              {s.attendees.map(id => {
                const a = athletes.find(x => x.id === id);
                return <span key={id} style={{ background:C.ocean+"22", color:C.wave, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{a?.name}</span>;
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── CHAMPIONSHIPS ─────────────────────────────────────────
function Champs({ athletes, champs, setChamps }) {
  const [view, setView] = useState("list");
  const [form, setForm] = useState({ name:"", date:"", location:"", category:"Regional", importance:"Média", athletes:[] });

  const save = () => {
    setChamps([...champs, { ...form, id:champs.length+1 }]);
    setView("list");
    setForm({ name:"", date:"", location:"", category:"Regional", importance:"Média", athletes:[] });
  };

  if (view === "create") return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Btn variant="ghost" small onClick={() => setView("list")}>← Voltar</Btn>
        <div style={{ color:C.white, fontSize:24, fontWeight:900 }}>Novo Campeonato</div>
      </div>
      <div style={{ padding:"0 32px", maxWidth:600 }}>
        <Card>
          <Input label="Nome" value={form.name} onChange={v => setForm({...form,name:v})} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Data" value={form.date} onChange={v => setForm({...form,date:v})} type="date" />
            <Input label="Local" value={form.location} onChange={v => setForm({...form,location:v})} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Select label="Categoria" value={form.category} onChange={v => setForm({...form,category:v})} options={["Regional","Nacional","Europeu","Mundial"]} />
            <Select label="Importância" value={form.importance} onChange={v => setForm({...form,importance:v})} options={["Baixa","Média","Alta","Principal"]} />
          </div>
        </Card>
        <Card>
          <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Atletas</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {athletes.map(a => {
              const on = form.athletes.includes(a.id);
              return (
                <div key={a.id} onClick={() => {
                  const list = on ? form.athletes.filter(x=>x!==a.id) : [...form.athletes,a.id];
                  setForm({...form,athletes:list});
                }} style={{
                  display:"flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:10, cursor:"pointer",
                  background: on ? C.ocean+"33" : C.dark, border:`1px solid ${on ? C.ocean : C.border}`,
                  color: on ? C.wave : C.muted, fontWeight:600, fontSize:14
                }}>
                  <span>{on ? "☑" : "☐"}</span> {a.name}
                </div>
              );
            })}
          </div>
        </Card>
        <Btn onClick={save}>Criar Campeonato →</Btn>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ color:C.white, fontSize:26, fontWeight:900 }}>Campeonatos</div>
          <div style={{ color:C.muted, fontSize:14 }}>{champs.length} eventos no calendário</div>
        </div>
        <Btn onClick={() => setView("create")}>+ Novo Campeonato</Btn>
      </div>
      <div style={{ padding:"0 32px" }}>
        {champs.map(c => (
          <Card key={c.id} style={{ borderLeft:`3px solid ${importanceColor[c.importance]}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{c.name}</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:10 }}>{c.date} · {c.location}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <Badge color={categoryColor[c.category]}>{c.category}</Badge>
                  <Badge color={importanceColor[c.importance]}>{c.importance}</Badge>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ color:C.muted, fontSize:12, marginBottom:6 }}>Atletas</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
                  {c.athletes.map(id => {
                    const a = athletes.find(x=>x.id===id);
                    return <span key={id} style={{ background:C.ocean+"22", color:C.wave, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{a?.name}</span>;
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── FEES ──────────────────────────────────────────────────
function Fees({ athletes }) {
  const [fees, setFees] = useState(
    athletes.reduce((acc,a) => ({ ...acc, [a.id]:{ amount:40, paid:false } }), {})
  );
  const toggle = id => setFees({ ...fees, [id]:{ ...fees[id], paid:!fees[id].paid } });

  return (
    <div>
      <TopBar title="Mensalidades" subtitle={`${Object.values(fees).filter(f=>f.paid).length} pagas · ${Object.values(fees).filter(f=>!f.paid).length} pendentes`} />
      <div style={{ padding:"0 32px" }}>
        {athletes.map(a => {
          const f = fees[a.id] || { amount:40, paid:false };
          return (
            <Card key={a.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:10, background: f.paid ? C.success+"33" : C.warn+"33", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                  {f.paid ? "✅" : "⏳"}
                </div>
                <div>
                  <div style={{ color:C.white, fontWeight:800 }}>{a.name}</div>
                  <div style={{ color:C.muted, fontSize:13 }}>{a.guardianEmail}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:C.white, fontWeight:900, fontSize:20 }}>€{f.amount}</div>
                  <Badge color={f.paid ? C.success : C.warn}>{f.paid ? "Pago" : "Pendente"}</Badge>
                </div>
                <Btn small variant={f.paid ? "dark" : "success"} onClick={() => toggle(a.id)}>
                  {f.paid ? "Reverter" : "Validar Pagamento"}
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── ATHLETE VIEWS ─────────────────────────────────────────
function MyProfile({ athlete }) {
  return (
    <div>
      <TopBar title={`Olá, ${athlete.name.split(" ")[0]}! 🤙`} subtitle="O teu perfil de atleta" />
      <div style={{ padding:"0 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card>
            <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>👤 Os meus dados</div>
            {[["Email",athlete.email],["Telefone",athlete.phone],["Género",athlete.gender]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.muted, fontSize:13 }}>{k}</span>
                <span style={{ color:C.white, fontSize:13 }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ color:C.wave, fontWeight:800, marginBottom:14 }}>🔑 Acesso</div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ color:C.muted, fontSize:13 }}>Username</span>
              <span style={{ color:C.wave, fontFamily:"monospace" }}>{athlete.username}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MySessions({ athlete, sessions }) {
  const mySessions = sessions.filter(s => s.attendees.includes(athlete.id));
  return (
    <div>
      <TopBar title="Os meus Treinos" subtitle={`${mySessions.length} sessões`} />
      <div style={{ padding:"0 32px" }}>
        {mySessions.map(s => {
          const mySkills = s.skills?.[athlete.id] || {};
          return (
            <Card key={s.id} style={{ borderLeft:`3px solid ${C.wave}` }}>
              <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{s.location}</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:12 }}>{s.date} · {s.time}</div>
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                <Badge color={C.ocean}>{s.waveSize}</Badge>
                <Badge color={C.wave}>{s.waveDir}</Badge>
                <Badge color={C.muted}>{s.waveType}</Badge>
              </div>
              {Object.entries(mySkills).length > 0 && (
                <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                  <div style={{ color:C.wave, fontWeight:700, marginBottom:10, fontSize:13 }}>⚡ As tuas competências nesta sessão:</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {Object.entries(SKILLS).map(([cat, meta]) => {
                      const items = mySkills[cat] || [];
                      if (!items.length) return null;
                      return (
                        <div key={cat} style={{ background:meta.color+"11", border:`1px solid ${meta.color}33`, borderRadius:10, padding:10 }}>
                          <div style={{ color:meta.color, fontWeight:700, fontSize:12, marginBottom:6 }}>{meta.label}</div>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                            {items.map(i => (
                              <span key={i} style={{ background:meta.color+"22", color:meta.color, borderRadius:5, padding:"2px 8px", fontSize:11 }}>
                                {cat === "tecnica" ? tecnicaLabel(i) : i}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        {!mySessions.length && <div style={{ color:C.muted }}>Ainda sem treinos registados.</div>}
      </div>
    </div>
  );
}

function MyChamps({ athlete, champs }) {
  const mine = champs.filter(c => c.athletes.includes(athlete.id));
  return (
    <div>
      <TopBar title="Os meus Campeonatos" subtitle={`${mine.length} eventos`} />
      <div style={{ padding:"0 32px" }}>
        {mine.map(c => (
          <Card key={c.id} style={{ borderLeft:`3px solid ${importanceColor[c.importance]}` }}>
            <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>{c.name}</div>
            <div style={{ color:C.muted, fontSize:13, marginBottom:10 }}>{c.date} · {c.location}</div>
            <div style={{ display:"flex", gap:8 }}>
              <Badge color={categoryColor[c.category]}>{c.category}</Badge>
              <Badge color={importanceColor[c.importance]}>{c.importance}</Badge>
            </div>
          </Card>
        ))}
        {!mine.length && <div style={{ color:C.muted }}>Ainda não estás inscrito em campeonatos.</div>}
      </div>
    </div>
  );
}

function MyBoards({ athlete, athletes, setAthletes }) {
  const [form, setForm] = useState({ name:"", brand:"", size:"", liters:"", type:"Performance", ideal:"" });
  const [adding, setAdding] = useState(false);

  const add = () => {
    const newBoard = { ...form, id: Date.now() };
    setAthletes(athletes.map(a => a.id === athlete.id ? { ...a, boards:[...a.boards, newBoard] } : a));
    setForm({ name:"", brand:"", size:"", liters:"", type:"Performance", ideal:"" });
    setAdding(false);
  };

  return (
    <div>
      <div style={{ padding:"24px 32px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ color:C.white, fontSize:26, fontWeight:900 }}>As minhas Pranchas</div>
          <div style={{ color:C.muted, fontSize:14 }}>{athlete.boards.length} pranchas</div>
        </div>
        <Btn small onClick={() => setAdding(!adding)}>{adding ? "Cancelar" : "+ Adicionar"}</Btn>
      </div>
      <div style={{ padding:"0 32px" }}>
        {adding && (
          <Card style={{ borderTop:`3px solid ${C.wave}` }}>
            <div style={{ color:C.wave, fontWeight:800, marginBottom:16 }}>Nova Prancha</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Input label="Nome" value={form.name} onChange={v => setForm({...form,name:v})} placeholder="ex: SharpEye HT2" />
              <Input label="Marca" value={form.brand} onChange={v => setForm({...form,brand:v})} />
              <Input label="Medidas" value={form.size} onChange={v => setForm({...form,size:v})} placeholder='ex: 5&apos;10"' />
              <Input label="Litros" value={form.liters} onChange={v => setForm({...form,liters:v})} placeholder="ex: 26" />
            </div>
            <Select label="Tipo" value={form.type} onChange={v => setForm({...form,type:v})} options={["Performance","Hybrid","Fish","Longboard","Gun"]} />
            <Input label="Condições ideais" value={form.ideal} onChange={v => setForm({...form,ideal:v})} placeholder="ex: Beach break 1m-1.5m" />
            <Btn small onClick={add}>Guardar Prancha</Btn>
          </Card>
        )}
        {athlete.boards.map(b => (
          <Card key={b.id} style={{ borderLeft:`3px solid ${C.ocean}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:C.white, fontWeight:800, fontSize:16 }}>🏄 {b.name}</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:8 }}>{b.brand}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <Badge color={C.ocean}>{b.size}</Badge>
                  <Badge color={C.wave}>{b.liters}L</Badge>
                  <Badge color={C.muted}>{b.type}</Badge>
                </div>
              </div>
              {b.ideal && (
                <div style={{ maxWidth:200, textAlign:"right" }}>
                  <div style={{ color:C.muted, fontSize:11, marginBottom:4 }}>Condições ideais</div>
                  <div style={{ color:C.wave, fontSize:13 }}>{b.ideal}</div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(null);
  const [active,    setActive]    = useState("dashboard");
  const [athletes,  setAthletes]  = useState(MOCK_ATHLETES);
  const [sessions,  setSessions]  = useState(MOCK_SESSIONS);
  const [champs,    setChamps]    = useState(MOCK_CHAMPS);

  const onLogin = u => {
    setUser(u);
    setActive(u.role === "coach" ? "dashboard" : "my-profile");
  };
  const onLogout = () => { setUser(null); setActive("dashboard"); };

  if (!user) return <LoginPage onLogin={onLogin} />;

  const currentAthlete = user.role === "athlete" ? athletes.find(a => a.id === user.id) : null;

  const renderContent = () => {
    if (user.role === "coach") {
      switch(active) {
        case "dashboard": return <Dashboard athletes={athletes} sessions={sessions} champs={champs} />;
        case "athletes":  return <Athletes athletes={athletes} setAthletes={setAthletes} />;
        case "sessions":  return <Sessions athletes={athletes} sessions={sessions} setSessions={setSessions} />;
        case "champs":    return <Champs athletes={athletes} champs={champs} setChamps={setChamps} />;
        case "fees":      return <Fees athletes={athletes} />;
        default: return null;
      }
    } else {
      if (!currentAthlete) return null;
      switch(active) {
        case "my-profile":  return <MyProfile athlete={currentAthlete} />;
        case "my-sessions": return <MySessions athlete={currentAthlete} sessions={sessions} />;
        case "my-champs":   return <MyChamps athlete={currentAthlete} champs={champs} />;
        case "my-boards":   return <MyBoards athlete={currentAthlete} athletes={athletes} setAthletes={setAthletes} />;
        default: return null;
      }
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.black, fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <Sidebar role={user.role} active={active} setActive={setActive} onLogout={onLogout} />
      <div style={{ flex:1, overflowY:"auto", paddingBottom:40 }}>
        {renderContent()}
      </div>
    </div>
  );
}
