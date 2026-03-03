import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════
// CIE ENGINE V6
// ═══════════════════════════════════════════════
function n15(v) { return ((v - 1) / 4) * 100; }
function incomeScore(band) {
  return ({ low:20, lower_middle:40, middle:60, upper_middle:78, high:92 })[band] ?? 40;
}
function examRisk(s) {
  if (s >= 80) return { label:"Strong", color:"#16a34a", bg:"#f0fdf4" };
  if (s >= 60) return { label:"Moderate", color:"#d97706", bg:"#fffbeb" };
  if (s >= 40) return { label:"Needs Work", color:"#dc2626", bg:"#fef2f2" };
  return { label:"Not Ready", color:"#7f1d1d", bg:"#fff1f2" };
}
function penalty(score, ...traits) {
  const m = Math.min(...traits);
  if (m < 25) return score * 0.45;
  if (m < 40) return score * 0.72;
  return score;
}

function runEngine(d) {
  const lg=n15(d.logical), ma=n15(d.math), ph=n15(d.physics), bi=n15(d.biology);
  const co=n15(d.commerce), ve=n15(d.verbal), me=n15(d.memory), at=n15(d.attention);
  const cr=n15(d.creative), he=n15(d.helping), pr=n15(d.practical), le=n15(d.leadership);
  const em=n15(d.empathy), so=n15(d.social), wr=n15(d.writing), st=n15(d.stamina);
  const ri=n15(d.risk), re=n15(d.resilience), cn=n15(d.consistency), se=n15(d.seriousness);
  const ti=n15(d.tech_interest), bi2=n15(d.business_interest);
  const fin = (incomeScore(d.income_band) + (d.afford_private?80:35)) / 2;
  const exp = d.family_business ? 75 : 35;

  let C = {
    "Analytical & Data":           penalty(0.25*lg+0.20*ma+0.15*at+0.15*cn+0.10*se+0.10*me+0.05*ti, ma, lg),
    "Technology Engineering":      penalty(0.25*ti+0.20*ma+0.15*ph+0.15*lg+0.10*pr+0.10*at+0.05*cn, ma, ti),
    "Core Engineering":            penalty(0.25*ph+0.20*pr+0.20*ma+0.15*lg+0.10*at+0.10*cn, ph, ma),
    "Life Sciences & Healthcare":  penalty(0.25*bi+0.20*he+0.15*me+0.15*em+0.10*cn+0.10*st+0.05*at, bi, me),
    "Business & Management":       penalty(0.20*bi2+0.20*le+0.15*ri+0.15*so+0.10*re+0.10*exp+0.10*co, ri, le),
    "Creative & Design":           penalty(0.30*cr+0.20*pr+0.15*wr+0.15*at+0.10*ti+0.10*ve, cr),
    "Government & Public Services":penalty(0.20*cn+0.20*me+0.15*re+0.15*se+0.15*ve+0.10*lg+0.05*he, cn, me),
    "Defense & Armed Forces":      penalty(0.25*ri+0.25*re+0.20*st+0.15*pr+0.10*cn+0.05*le, ri, re, st),
  };

  const SS = {
    "Science":            0.30*ma+0.25*ph+0.20*bi+0.15*lg+0.10*cn,
    "Commerce":           0.30*co+0.25*bi2+0.20*lg+0.15*so+0.10*me,
    "Arts / Humanities":  0.30*ve+0.25*cr+0.20*wr+0.15*em+0.10*so,
    "Vocational / Skill": 0.35*pr+0.25*st+0.20*cn+0.10*at+0.10*re,
  };
  const stream = Object.entries(SS).sort((a,b)=>b[1]-a[1])[0][0];
  const sorted = Object.entries(C).sort((a,b)=>b[1]-a[1]);
  const [p1,p2,p3] = sorted;
  const gap = p1[1]-p2[1];
  const conf = gap<5?"Low Clarity":gap<15?"Moderate Clarity":"High Clarity";
  const confNote = gap<5
    ? "Your profile spans multiple areas — more self-exploration needed."
    : gap<15
    ? "A direction is emerging but not yet definitive."
    : "Your strengths point clearly in one direction.";

  const dec = d.declared_interest;
  let align = "No Declared Interest";
  if (dec && C[dec]!==undefined) {
    const ag = p1[1]-C[dec];
    align = ag<5?"Strong Alignment":ag<15?"Moderate Alignment":"Significant Misalignment";
  }

  const CM = {
    "Analytical & Data":{"Math":ma,"Logical":lg},
    "Technology Engineering":{"Math":ma,"Tech Interest":ti},
    "Core Engineering":{"Physics":ph,"Math":ma},
    "Life Sciences & Healthcare":{"Biology":bi,"Memory":me},
    "Business & Management":{"Risk":ri,"Leadership":le},
    "Creative & Design":{"Creativity":cr,"Writing":wr},
    "Government & Public Services":{"Consistency":cn,"Memory":me},
    "Defense & Armed Forces":{"Risk":ri,"Resilience":re,"Stamina":st},
  };
  let diag = "";
  if (dec && CM[dec]) {
    const wk = Object.entries(CM[dec]).sort((a,b)=>a[1]-b[1])[0];
    if (wk[1]<25) diag=`Critical gap: ${wk[0]} is severely underdeveloped for ${dec}.`;
    else if (wk[1]<45) diag=`Limiting factor: ${wk[0]} is below required threshold for ${dec}.`;
  }

  const jee  = 0.35*ma+0.25*ph+0.15*cn+0.15*re+0.10*se;
  const neet = 0.35*bi+0.20*me+0.15*cn+0.15*st+0.10*at+0.05*re;
  const upsc = 0.25*ve+0.20*me+0.15*cn+0.15*re+0.10*lg+0.10*wr+0.05*se;
  const gate = 0.30*lg+0.25*ma+0.20*cn+0.15*me+0.10*at;

  const exams = {
    "JEE":          { score:Math.round(jee),  ...examRisk(jee)  },
    "NEET":         { score:Math.round(neet), ...examRisk(neet) },
    "UPSC":         { score:Math.round(upsc), ...examRisk(upsc) },
    "GATE/Banking": { score:Math.round(gate), ...examRisk(gate) },
  };

  let finWarn = null;
  if (["Technology Engineering","Core Engineering","Life Sciences & Healthcare"].includes(p1[0]) && fin<50)
    finWarn="This path needs significant investment. Prioritize IITs, NITs, AIIMS via competitive exams. Plan for scholarships or loans if private college is the only option.";
  else if (fin<35)
    finWarn="Financial constraints are real. Focus on government pathways, scholarships, and high-ROI skill programs.";

  const AP = {
    "Analytical & Data":           ["Solve logic and data interpretation problems daily.","Take a free Python/statistics course on Khan Academy or NPTEL.","Score above 85% in Math in Class 10 — non-negotiable."],
    "Technology Engineering":      ["Start JEE Math + Physics foundation from Class 9 itself.","Build one small project — a simple app or circuit counts.","Join CodeChef or HackerRank and solve 3 problems per week."],
    "Core Engineering":            ["Master NCERT Physics Class 9–10 thoroughly first.","Begin JEE foundation self-study with HC Verma.","Talk to working engineers — exposure builds conviction."],
    "Life Sciences & Healthcare":  ["NEET prep starts now. Read Biology NCERT 3+ times by Class 12.","Use flashcards and spaced repetition every day.","Shadow a doctor if possible — early exposure matters."],
    "Business & Management":       ["Read one business case study per month — start simple.","Start something at school: sell, organise, lead anything.","Actively develop public communication skills."],
    "Creative & Design":           ["Build a portfolio: drawings, writing, digital work — anything.","Learn Figma or Canva basics before Class 11.","Research NID and NIFT entrance requirements now."],
    "Government & Public Services":["Read newspapers and basic civics every single day.","Score high in boards — consistency is your main credential.","Practice structured writing in clear, concise paragraphs."],
    "Defense & Armed Forces":      ["Physical fitness is a selection criterion — build it now.","Research NDA, CDS, Sainik School pathways and eligibility.","Take on hard challenges deliberately to build mental toughness."],
  };

  const mode = d.advisory_mode || "normal";
  let advisory = "";
  if (mode==="normal") {
    advisory = `Your strongest area is ${p1[0]}. ${confNote} `;
    if (diag) advisory += diag + " ";
    if (align==="Significant Misalignment") advisory += "Your declared interest and measured strengths point in different directions. Reflect on whether your stated interest is genuine or externally influenced.";
    else if (align==="Strong Alignment") advisory += "Your declared interest and strengths are well aligned. Stay on this path.";
    else if (align==="Moderate Alignment") advisory += "Your interest aligns reasonably with your strengths, but there are gaps to close.";
  } else {
    advisory = `Your measurable profile is strongest in ${p1[0]}. Not what you were told. Not what is popular. What your actual traits show. `;
    if (diag) advisory += diag + " ";
    if (align==="Significant Misalignment")
      advisory += `You said you want ${dec}. Your scores do not support that right now. That path exists — but only after fixing specific weaknesses. Going in without doing that means higher failure probability. This is the actual situation.`;
    else
      advisory += "Your declared direction is supported by your current strengths. This doesn't guarantee success — it means you're starting from the right position. Execution is now your problem.";
    const relExam = {"Technology Engineering":"JEE","Core Engineering":"JEE","Analytical & Data":"JEE","Life Sciences & Healthcare":"NEET","Government & Public Services":"UPSC"}[p1[0]];
    if (relExam && exams[relExam]) advisory += ` For ${relExam}: your readiness is currently '${exams[relExam].label}'. If you are not prepared to change this, reconsider the path before investing years into it.`;
  }

  return {
    stream, streamScores: Object.fromEntries(Object.entries(SS).map(([k,v])=>[k,Math.round(v)])),
    primary:   { name:p1[0], score:Math.round(p1[1]) },
    secondary: { name:p2[0], score:Math.round(p2[1]) },
    tertiary:  { name:p3[0], score:Math.round(p3[1]) },
    allClusters: sorted.map(([k,v])=>({ name:k, score:Math.round(v) })),
    conf, confNote, align, exams, finWarn,
    plan: AP[p1[0]] || [], advisory, diag,
  };
}

// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════
const CLUSTERS = ["Analytical & Data","Technology Engineering","Core Engineering","Life Sciences & Healthcare","Business & Management","Creative & Design","Government & Public Services","Defense & Armed Forces"];
const ICONS = {"Analytical & Data":"◈","Technology Engineering":"⬡","Core Engineering":"⬟","Life Sciences & Healthcare":"◎","Business & Management":"◇","Creative & Design":"◉","Government & Public Services":"▣","Defense & Armed Forces":"▲"};
const STEPS = [{id:"cognitive",label:"Mind",sub:"How you think"},{id:"personality",label:"Self",sub:"Who you are"},{id:"behavioral",label:"Drive",sub:"How you act"},{id:"context",label:"Reality",sub:"Your situation"},{id:"direction",label:"Aim",sub:"What you want"}];
const TRAITS = {
  cognitive: [
    {k:"logical",   l:"Logical Reasoning",    h:"Can you solve problems step by step?"},
    {k:"math",      l:"Math Ability",          h:"How comfortable are you with numbers and equations?"},
    {k:"physics",   l:"Physics Aptitude",      h:"Do you understand how things work mechanically?"},
    {k:"biology",   l:"Biology Interest",      h:"Are you drawn to living systems and life sciences?"},
    {k:"commerce",  l:"Commerce / Economics",  h:"Do you understand money, trade, and business basics?"},
    {k:"verbal",    l:"Language & Verbal",     h:"Can you read, write, and communicate clearly?"},
    {k:"memory",    l:"Memory & Recall",       h:"How well do you retain and recall information?"},
    {k:"attention", l:"Attention to Detail",   h:"Do you catch small errors and stay precise?"},
  ],
  personality: [
    {k:"creative",         l:"Creativity",         h:"Do you imagine new ideas and original solutions?"},
    {k:"helping",          l:"Helping Others",      h:"Does serving or caring for people energise you?"},
    {k:"practical",        l:"Practical Thinking",  h:"Do you prefer real, hands-on problem solving?"},
    {k:"leadership",       l:"Leadership",          h:"Do people naturally look to you to organise or decide?"},
    {k:"empathy",          l:"Empathy",             h:"Can you understand what others feel?"},
    {k:"social",           l:"Social Confidence",   h:"Are you comfortable in public or group settings?"},
    {k:"writing",          l:"Written Expression",  h:"Can you express ideas clearly in writing?"},
    {k:"stamina",          l:"Endurance & Stamina", h:"Can you sustain effort over long periods?"},
    {k:"tech_interest",    l:"Technology Interest", h:"Are you genuinely drawn to computers or electronics?"},
    {k:"business_interest",l:"Business Interest",   h:"Does building or managing a business excite you?"},
  ],
  behavioral: [
    {k:"risk",        l:"Risk Tolerance",        h:"Are you willing to bet on uncertain outcomes?"},
    {k:"resilience",  l:"Resilience",            h:"Do you recover quickly from failure or setbacks?"},
    {k:"consistency", l:"Consistency",           h:"Can you maintain discipline for months or years?"},
    {k:"seriousness", l:"Seriousness & Maturity",h:"Do you approach your future with genuine focus?"},
  ],
};

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════
function Bar({ score, dark=false }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 80); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{height:2,background:dark?"#333":"#EFEFEF",borderRadius:2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${w}%`,background:dark?"#fff":"#0A0A0A",borderRadius:2,transition:"width 0.9s cubic-bezier(.4,0,.2,1)"}}/>
    </div>
  );
}

function Slider({ trait, value, onChange }) {
  const labels = ["","Very Low","Low","Average","High","Very High"];
  return (
    <div style={{marginBottom:32}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{flex:1,paddingRight:12}}>
          <div style={{fontSize:15,fontWeight:700,color:"#0A0A0A",letterSpacing:"-0.02em"}}>{trait.l}</div>
          <div style={{fontSize:12,color:"#999",marginTop:3,lineHeight:1.4}}>{trait.h}</div>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:"#BBB",textAlign:"right",minWidth:58,paddingTop:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>{labels[value]}</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {[1,2,3,4,5].map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            flex:1, height:42, border:"1.5px solid",
            borderColor: value===v ? "#0A0A0A" : "#E5E5E5",
            background: value===v ? "#0A0A0A" : "white",
            color: value===v ? "white" : "#BBB",
            borderRadius:10, fontSize:15, fontWeight:700,
            cursor:"pointer", transition:"all 0.12s ease", fontFamily:"inherit",
          }}>{v}</button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function NextMove() {
  const [screen, setScreen] = useState("land");
  const [step, setStep] = useState(0);
  const [A, setA] = useState({
    logical:3,math:3,physics:3,biology:3,commerce:3,verbal:3,memory:3,attention:3,
    creative:3,helping:3,practical:3,leadership:3,empathy:3,social:3,writing:3,stamina:3,
    risk:3,resilience:3,consistency:3,seriousness:3,
    tech_interest:3,business_interest:3,
    income_band:"middle", afford_private:false, family_business:false,
    declared_interest:null, advisory_mode:"normal",
  });
  const [R, setR] = useState(null);
  const [tab, setTab] = useState("overview");
  const topRef = useRef();

  const set = (k, v) => setA(a => ({...a, [k]:v}));
  const submit = () => { setR(runEngine(A)); setScreen("result"); setTimeout(() => topRef.current?.scrollIntoView({behavior:"smooth"}), 50); };
  const reset  = () => { setScreen("land"); setStep(0); setR(null); setTab("overview"); };

  const S = {
    page:  { minHeight:"100vh", background:"#F8F7F4", fontFamily:"'Helvetica Neue',Arial,sans-serif" },
    serif: { fontFamily:"'Palatino Linotype','Palatino',Georgia,serif" },
  };

  // ── LANDING ──────────────────────────────────
  if (screen==="land") return (
    <div style={{...S.page, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px"}}>
      <div style={{maxWidth:460, width:"100%"}}>
        <div style={{fontSize:11,letterSpacing:"0.22em",color:"#AAA",textTransform:"uppercase",fontWeight:700,marginBottom:20,fontFamily:"'Helvetica Neue',sans-serif"}}>Career Intelligence · India</div>
        <div style={{fontSize:68,fontWeight:900,color:"#0A0A0A",letterSpacing:"-0.05em",lineHeight:0.9,marginBottom:24,...S.serif}}>Next<br/>Move</div>
        <div style={{width:40,height:1.5,background:"#0A0A0A",marginBottom:24}}/>
        <p style={{fontSize:19,color:"#444",lineHeight:1.65,fontStyle:"italic",margin:0,...S.serif}}>
          "Choose what fits you.<br/>Not what others chose for you."
        </p>
        <p style={{fontSize:14,color:"#888",lineHeight:1.8,margin:"28px 0 40px"}}>
          A structured assessment for Class 9–10 students in India.<br/>
          22 traits · 8 career paths · 4 exam readiness scores.<br/>
          One honest report.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:40}}>
          {[["22","Traits measured"],["8","Career clusters"],["4","Exam paths"],["~8 min","To complete"]].map(([n,l]) => (
            <div key={n} style={{padding:"16px 18px",background:"white",borderRadius:14,border:"1px solid #E8E8E8"}}>
              <div style={{fontSize:24,fontWeight:900,color:"#0A0A0A",letterSpacing:"-0.04em",...S.serif}}>{n}</div>
              <div style={{fontSize:11,color:"#AAA",marginTop:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setScreen("survey")} style={{
          width:"100%",padding:"17px",background:"#0A0A0A",color:"white",
          border:"none",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:"-0.01em",fontFamily:"inherit",
        }}>Begin Assessment →</button>
        <div style={{textAlign:"center",marginTop:14,fontSize:12,color:"#CCC"}}>Free · No login · No data stored</div>
      </div>
    </div>
  );

  // ── SURVEY ───────────────────────────────────
  if (screen==="survey") {
    const sid = STEPS[step].id;
    const traits = TRAITS[sid] || [];

    return (
      <div style={S.page}>
        {/* Sticky header */}
        <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(248,247,244,0.96)",backdropFilter:"blur(16px)",borderBottom:"1px solid #E8E8E8"}}>
          <div style={{maxWidth:580,margin:"0 auto",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:17,fontWeight:900,letterSpacing:"-0.04em",color:"#0A0A0A",...S.serif}}>NextMove</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {STEPS.map((_,i) => (
                <div key={i} style={{width:i===step?22:7,height:7,borderRadius:4,background:i<=step?"#0A0A0A":"#DDD",transition:"all 0.3s ease"}}/>
              ))}
            </div>
          </div>
          <div style={{height:2,background:"#EBEBEB"}}>
            <div style={{height:"100%",width:`${step/STEPS.length*100}%`,background:"#0A0A0A",transition:"width 0.5s ease"}}/>
          </div>
        </div>

        <div style={{maxWidth:580,margin:"0 auto",padding:"40px 24px 130px"}}>
          <div style={{marginBottom:44}}>
            <div style={{fontSize:11,letterSpacing:"0.18em",color:"#AAA",textTransform:"uppercase",fontWeight:700,marginBottom:8}}>{STEPS[step].sub}</div>
            <div style={{fontSize:40,fontWeight:900,color:"#0A0A0A",letterSpacing:"-0.04em",...S.serif}}>{STEPS[step].label}</div>
          </div>

          {/* Trait sliders */}
          {(sid==="cognitive"||sid==="personality"||sid==="behavioral") && traits.map(t => (
            <Slider key={t.k} trait={t} value={A[t.k]} onChange={v => set(t.k, v)} />
          ))}

          {/* Context */}
          {sid==="context" && (
            <div>
              <div style={{marginBottom:32}}>
                <div style={{fontSize:15,fontWeight:700,color:"#0A0A0A",marginBottom:6,letterSpacing:"-0.02em"}}>Family Annual Income</div>
                <div style={{fontSize:12,color:"#999",marginBottom:14}}>Be honest — this affects the financial feasibility note.</div>
                {[["low","Below ₹2L / year"],["lower_middle","₹2L – ₹5L / year"],["middle","₹5L – ₹12L / year"],["upper_middle","₹12L – ₹25L / year"],["high","Above ₹25L / year"]].map(([v,l]) => (
                  <button key={v} onClick={() => set("income_band",v)} style={{
                    display:"block",width:"100%",textAlign:"left",padding:"13px 16px",marginBottom:8,
                    background:A.income_band===v?"#0A0A0A":"white",
                    color:A.income_band===v?"white":"#555",
                    border:"1.5px solid",borderColor:A.income_band===v?"#0A0A0A":"#E5E5E5",
                    borderRadius:11,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:500,
                  }}>{l}</button>
                ))}
              </div>
              {[["afford_private","Can your family afford a private college (₹3L+ per year)?"],["family_business","Does your family have a business background?"]].map(([k,label]) => (
                <div key={k} style={{marginBottom:28}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#0A0A0A",marginBottom:12,letterSpacing:"-0.02em"}}>{label}</div>
                  <div style={{display:"flex",gap:10}}>
                    {["Yes","No"].map(opt => {
                      const active=(A[k]===true&&opt==="Yes")||(A[k]===false&&opt==="No");
                      return (
                        <button key={opt} onClick={() => set(k,opt==="Yes")} style={{
                          flex:1,padding:"13px",border:"1.5px solid",
                          borderColor:active?"#0A0A0A":"#E5E5E5",
                          background:active?"#0A0A0A":"white",
                          color:active?"white":"#555",
                          borderRadius:11,fontSize:15,cursor:"pointer",fontFamily:"inherit",fontWeight:700,
                        }}>{opt}</button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Direction */}
          {sid==="direction" && (
            <div>
              <div style={{marginBottom:36}}>
                <div style={{fontSize:15,fontWeight:700,color:"#0A0A0A",marginBottom:6,letterSpacing:"-0.02em"}}>Do you have a career direction in mind?</div>
                <div style={{fontSize:12,color:"#999",marginBottom:14}}>Be honest — this detects alignment or misalignment with your actual profile.</div>
                <button onClick={() => set("declared_interest",null)} style={{
                  display:"block",width:"100%",textAlign:"left",padding:"12px 16px",marginBottom:8,
                  background:A.declared_interest===null?"#0A0A0A":"white",
                  color:A.declared_interest===null?"white":"#888",
                  border:"1.5px solid",borderColor:A.declared_interest===null?"#0A0A0A":"#E5E5E5",
                  borderRadius:11,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontStyle:"italic",
                }}>Not sure yet</button>
                {CLUSTERS.map(c => (
                  <button key={c} onClick={() => set("declared_interest",c)} style={{
                    display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",
                    padding:"12px 16px",marginBottom:8,
                    background:A.declared_interest===c?"#0A0A0A":"white",
                    color:A.declared_interest===c?"white":"#444",
                    border:"1.5px solid",borderColor:A.declared_interest===c?"#0A0A0A":"#E5E5E5",
                    borderRadius:11,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:500,
                  }}>
                    <span style={{fontSize:16,opacity:0.6}}>{ICONS[c]}</span>{c}
                  </button>
                ))}
              </div>

              <div>
                <div style={{fontSize:15,fontWeight:700,color:"#0A0A0A",marginBottom:6,letterSpacing:"-0.02em"}}>How do you want feedback delivered?</div>
                <div style={{fontSize:12,color:"#999",marginBottom:14}}>This controls the tone of your advisory report.</div>
                {[["normal","Supportive — honest but constructive"],["hard","Hard Truth — direct, no sugar coating"]].map(([v,l]) => (
                  <button key={v} onClick={() => set("advisory_mode",v)} style={{
                    display:"block",width:"100%",textAlign:"left",padding:"13px 16px",marginBottom:10,
                    background:A.advisory_mode===v?"#0A0A0A":"white",
                    color:A.advisory_mode===v?"white":"#444",
                    border:"1.5px solid",borderColor:A.advisory_mode===v?"#0A0A0A":"#E5E5E5",
                    borderRadius:11,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:500,
                  }}>{l}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(248,247,244,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid #E8E8E8",padding:"16px 24px"}}>
          <div style={{maxWidth:580,margin:"0 auto",display:"flex",gap:10}}>
            {step>0 && (
              <button onClick={() => setStep(s=>s-1)} style={{
                flex:1,padding:"15px",background:"white",border:"1.5px solid #E5E5E5",
                borderRadius:13,fontSize:14,fontWeight:700,cursor:"pointer",color:"#AAA",fontFamily:"inherit",
              }}>← Back</button>
            )}
            {step<STEPS.length-1 ? (
              <button onClick={() => setStep(s=>s+1)} style={{
                flex:3,padding:"15px",background:"#0A0A0A",color:"white",
                border:"none",borderRadius:13,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              }}>Continue →</button>
            ) : (
              <button onClick={submit} style={{
                flex:3,padding:"15px",background:"#0A0A0A",color:"white",
                border:"none",borderRadius:13,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              }}>Get My Report →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────
  if (screen==="result" && R) {
    const alignColor = {"Strong Alignment":"#16a34a","Moderate Alignment":"#d97706","Significant Misalignment":"#dc2626","No Declared Interest":"#888"};
    const TABS = ["overview","clusters","exams","plan"];

    return (
      <div ref={topRef} style={S.page}>
        {/* Hero */}
        <div style={{background:"#0A0A0A",padding:"48px 24px 40px",color:"white"}}>
          <div style={{maxWidth:580,margin:"0 auto"}}>
            <div style={{fontSize:11,letterSpacing:"0.2em",color:"#555",textTransform:"uppercase",fontWeight:700,marginBottom:20}}>Your NextMove Report</div>
            <div style={{fontSize:44,fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:10,...S.serif}}>{R.primary.name}</div>
            <div style={{fontSize:13,color:"#555",marginBottom:24}}>Primary Cluster · Score {R.primary.score} / 100</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[R.stream, R.conf, R.align!=="No Declared Interest"?R.align:null].filter(Boolean).map((tag,i) => (
                <span key={i} style={{padding:"6px 14px",background:"#161616",borderRadius:20,fontSize:12,fontWeight:600,color:i===2?(alignColor[tag]||"#AAA"):"#AAA"}}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:"white",borderBottom:"1px solid #EBEBEB",position:"sticky",top:0,zIndex:10}}>
          <div style={{maxWidth:580,margin:"0 auto",display:"flex"}}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1,padding:"15px 8px",border:"none",background:"none",
                fontSize:12,fontWeight:700,textTransform:"capitalize",letterSpacing:"0.04em",
                color:tab===t?"#0A0A0A":"#BBB",
                borderBottom:`2px solid ${tab===t?"#0A0A0A":"transparent"}`,
                cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{maxWidth:580,margin:"0 auto",padding:"32px 24px 100px"}}>

          {/* OVERVIEW */}
          {tab==="overview" && (
            <div>
              <div style={{background:"white",borderRadius:18,padding:"26px",border:"1px solid #E8E8E8",marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#BBB",marginBottom:14}}>
                  {A.advisory_mode==="hard" ? "Hard Truth Advisory" : "Advisory"}
                </div>
                <p style={{fontSize:15,lineHeight:1.8,color:"#222",margin:0,...S.serif,fontStyle:"italic"}}>"{R.advisory}"</p>
              </div>

              {[{rank:"Primary",d:R.primary,c:"#0A0A0A"},{rank:"Secondary",d:R.secondary,c:"#666"},{rank:"Tertiary",d:R.tertiary,c:"#BBB"}].map(({rank,d,c}) => (
                <div key={rank} style={{background:"white",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:10,color:"#CCC",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{rank}</div>
                      <div style={{fontSize:16,fontWeight:800,color:c,letterSpacing:"-0.02em"}}>{ICONS[d.name]} {d.name}</div>
                    </div>
                    <div style={{fontSize:34,fontWeight:900,color:c,letterSpacing:"-0.05em",...S.serif}}>{d.score}</div>
                  </div>
                  <Bar score={d.score}/>
                </div>
              ))}

              <div style={{background:"white",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8",marginTop:8,marginBottom:18}}>
                <div style={{fontSize:10,color:"#BBB",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:6}}>Recommended Stream — Class 11</div>
                <div style={{fontSize:26,fontWeight:900,color:"#0A0A0A",letterSpacing:"-0.03em",marginBottom:18,...S.serif}}>{R.stream}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {Object.entries(R.streamScores).map(([s,sc]) => (
                    <div key={s}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                        <span style={{color:"#AAA"}}>{s}</span>
                        <span style={{fontWeight:800,color:"#0A0A0A"}}>{sc}</span>
                      </div>
                      <Bar score={sc}/>
                    </div>
                  ))}
                </div>
              </div>

              {R.finWarn && (
                <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:14,padding:"18px 20px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#92400E",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Financial Consideration</div>
                  <p style={{fontSize:13,color:"#78350F",margin:0,lineHeight:1.7}}>{R.finWarn}</p>
                </div>
              )}
            </div>
          )}

          {/* CLUSTERS */}
          {tab==="clusters" && (
            <div>
              <p style={{fontSize:13,color:"#999",marginBottom:24,lineHeight:1.7}}>All 8 career clusters ranked by your trait profile. Penalty logic applied for critical weak traits.</p>
              {R.allClusters.map(({name,score},i) => (
                <div key={name} style={{background:"white",borderRadius:13,padding:"18px 20px",border:"1px solid #E8E8E8",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#DDD",width:22}}>#{i+1}</div>
                      <div style={{fontSize:14,fontWeight:700,color:i===0?"#0A0A0A":"#555"}}>{ICONS[name]} {name}</div>
                    </div>
                    <div style={{fontSize:26,fontWeight:900,color:i===0?"#0A0A0A":"#CCC",letterSpacing:"-0.04em",...S.serif}}>{score}</div>
                  </div>
                  <Bar score={score}/>
                </div>
              ))}
            </div>
          )}

          {/* EXAMS */}
          {tab==="exams" && (
            <div>
              <p style={{fontSize:13,color:"#999",marginBottom:24,lineHeight:1.7}}>Readiness scores for 4 major competitive exam paths. Based on current trait profile — not preparation level.</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                {Object.entries(R.exams).map(([name,data]) => (
                  <div key={name} style={{background:data.bg,borderRadius:14,padding:"18px",border:`1px solid ${data.color}22`}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#888",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{name}</div>
                    <div style={{fontSize:38,fontWeight:900,color:data.color,letterSpacing:"-0.05em",...S.serif}}>{data.score}</div>
                    <div style={{fontSize:11,color:data.color,fontWeight:700,marginTop:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{data.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"white",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#BBB",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>Score Key</div>
                {[["80+","Strong","#16a34a","Foundational traits are there. Execution is the variable."],["60–79","Moderate","#d97706","Direction is right but specific areas need focused work."],["40–59","Needs Work","#dc2626","Significant improvement needed before serious exam prep."],["<40","Not Ready","#7f1d1d","Foundational gaps exist. Address these before choosing this path."]].map(([r,l,c,desc]) => (
                  <div key={r} style={{display:"flex",gap:14,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{fontSize:13,fontWeight:900,color:c,minWidth:42,...S.serif}}>{r}</div>
                    <div style={{fontSize:13,color:"#666",lineHeight:1.5}}><strong style={{color:c}}>{l}</strong> — {desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PLAN */}
          {tab==="plan" && (
            <div>
              <div style={{background:"#0A0A0A",borderRadius:18,padding:"22px 24px",marginBottom:24}}>
                <div style={{fontSize:10,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:6}}>Your Focus Area</div>
                <div style={{fontSize:24,fontWeight:900,color:"white",letterSpacing:"-0.03em",...S.serif}}>{R.primary.name}</div>
              </div>

              <div style={{fontSize:10,fontWeight:700,color:"#BBB",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:16}}>3 Actions — Starting Now</div>
              {R.plan.map((s,i) => (
                <div key={i} style={{display:"flex",gap:18,background:"white",borderRadius:14,padding:"20px",border:"1px solid #E8E8E8",marginBottom:12}}>
                  <div style={{fontSize:30,fontWeight:900,color:"#EBEBEB",flexShrink:0,letterSpacing:"-0.05em",...S.serif,lineHeight:1}}>0{i+1}</div>
                  <div style={{fontSize:14,color:"#333",lineHeight:1.7,paddingTop:3}}>{s}</div>
                </div>
              ))}

              {R.diag && (
                <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:"18px 20px",marginTop:8,marginBottom:20}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#991B1B",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8}}>Gap to Address</div>
                  <p style={{fontSize:13,color:"#7F1D1D",margin:0,lineHeight:1.7}}>{R.diag}</p>
                </div>
              )}

              <button onClick={reset} style={{
                width:"100%",marginTop:24,padding:"15px",background:"white",
                border:"1.5px solid #E5E5E5",borderRadius:13,fontSize:14,fontWeight:700,
                cursor:"pointer",color:"#AAA",fontFamily:"inherit",
              }}>↺ Retake Assessment</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
