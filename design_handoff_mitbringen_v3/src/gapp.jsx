const { useState, useEffect, useRef, useMemo } = React;

const eur = (n) => "€" + Math.max(0, n).toFixed(2).replace(".", ",");

/* ---------- icons ---------- */
function Icon({ n, s = 22, w = 2 }) {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" };
  const M = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    back: <path d="M19 12H5M11 18 5 12l6-6" />,
    receipt: <><path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3L6 21V3Z" /><path d="M9 8h6M9 12h6" /></>,
    deals: <><path d="M20 12v7H4v-7M2 7h20v5H2zM12 7v12M12 7 8.5 3.5M12 7l3.5-3.5" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
    home: <><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10.5V20h12v-9.5" /></>,
    list: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    chev: <path d="m9 6 6 6-6 6" />,
    chevd: <path d="m6 9 6 6 6-6" />,
    pin: <><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
    check: <path d="M5 12.5 10 17l9-10" />,
    trash: <><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></>,
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.1 2.1M15.9 15.9 18 18M18 6l-2.1 2.1M8.1 15.9 6 18" />,
    mail: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7.5 8 5.2 8-5.2" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2 2 0 0 1 2.9 2.9L7.6 18.6 3.5 19.6l1-4.1Z" /></>,
    logout: <><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="m16 16 4-4-4-4" /><path d="M20 12H9" /></>,
    x: <path d="M6 6 18 18M18 6 6 18" />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeoff: <><path d="M2 12s3.5-7 10-7c2.1 0 3.9.7 5.4 1.6M22 12s-3.5 7-10 7c-2.1 0-3.9-.7-5.4-1.6" /><path d="m4 4 16 16" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /></>,
    chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  };
  return <svg {...p}>{M[n]}</svg>;
}

const STORE_HEX = { hofer: "#e2342b", lidl: "#2660c9", spar: "#1f8a4d", billa: "#e0a01e" };
const hex = (id) => STORE_HEX[id] || "#2461ff";

/* ---------- brand mark: basket + check + leaf (Concept D3) ---------- */
function Brand({ size = 36, radius = 11 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flex: "0 0 auto", display: "grid", placeItems: "center", background: "linear-gradient(150deg,#2f6bff,#1748d8)", boxShadow: "0 6px 14px -6px rgba(36,97,255,.7)" }}>
      <svg width={size * .68} height={size * .68} viewBox="0 0 100 100" fill="none">
        <path d="M58 44C52 41 49 34 51 27c5 3 9 10 9 17" fill="#c4ec5a" />
        <path d="M35 44a15 12 0 0 1 30 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <path d="M23 44h54l-5.4 36A6 6 0 0 1 65.7 85H34.3A6 6 0 0 1 28.4 80L23 44Z" fill="#fff" />
        <circle cx="64" cy="74" r="13" fill="#2fc46f" />
        <path d="M58 74l4 4 8-8.5" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------- animated number ---------- */
function useTween(target, dur = 600) {
  const [v, setV] = useState(target);
  const from = useRef(target), raf = useRef(0), start = useRef(0);
  useEffect(() => {
    const f = from.current;
    if (f === target) { setV(target); return; }
    cancelAnimationFrame(raf.current); start.current = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const t = Math.min(1, (ts - start.current) / dur);
      setV(f + (target - f) * ease(t));
      if (t < 1) raf.current = requestAnimationFrame(step);
      else { from.current = target; setV(target); }
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  useEffect(() => { from.current = v; }); // eslint-disable-line
  return v;
}
function BigEuro({ value, size = 54, color = "#fff", weight = 800 }) {
  const v = useTween(value);
  const s = Math.max(0, v), int = Math.floor(s), dec = Math.round((s - int) * 100).toString().padStart(2, "0");
  return (
    <span className="tnum" style={{ display: "inline-flex", alignItems: "flex-start", color, fontWeight: weight, letterSpacing: "-0.04em", lineHeight: 1 }}>
      <span style={{ fontSize: size * .44, marginTop: size * .12, fontWeight: 700 }}>€</span>
      <span style={{ fontSize: size }}>{int}</span>
      <span style={{ fontSize: size * .44, marginTop: size * .12, fontWeight: 700 }}>,{dec}</span>
    </span>
  );
}

/* ============================================================ HOME */
function Home({ items, saved, goal, onOpenList, onNewList, monthLabel }) {
  const pct = goal ? Math.min(100, (saved / goal) * 100) : 0;
  const predicted = items.reduce((s, p) => s + savingsOf(p), 0);

  // store breakdown from current list
  const storeRows = useMemo(() => {
    const by = {};
    items.forEach((it) => { (by[it.store] = by[it.store] || []).push(it); });
    return Object.keys(by).map((id) => ({
      store: STORES[id], items: by[id],
      save: by[id].reduce((s, p) => s + savingsOf(p), 0),
    })).sort((a, b) => b.save - a.save).slice(0, 3);
  }, [items]);

  return (
    <div className="screen">
      <div className="pad" style={{ paddingBottom: 8 }}>
        {/* savings card */}
        <div className="savecard aUp">
          <div className="r1" /><div className="r2" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div className="eyebrow" style={{ color: "rgba(255,255,255,.72)" }}>Saved in {monthLabel}</div>
            <div className="chip-up">↑ {eur(8.4)} this week</div>
          </div>
          <div style={{ marginTop: 12 }}><BigEuro value={saved} size={54} /></div>
          <div className="track"><i style={{ width: pct + "%" }} /></div>
          <div className="save-meta">
            <span className="tnum" style={{ color: "#fff" }}>{Math.round(pct)}% of {eur(goal)} goal</span>
            <span className="tnum" style={{ color: "rgba(255,255,255,.72)" }}>{eur(goal - saved)} to go</span>
          </div>
        </div>

        {/* quick actions */}
        <div className="quick aUp" style={{ animationDelay: ".05s" }}>
          {[
            { k: "New list", ico: "plus", bg: "var(--blue-soft)", c: "var(--blue)", on: onNewList },
            { k: "Scan bill", ico: "receipt", bg: "var(--coral-soft)", c: "var(--coral)" },
            { k: "Deals", ico: "deals", bg: "var(--green-soft)", c: "var(--green)", on: onOpenList },
            { k: "Goal", ico: "target", bg: "var(--violet-soft)", c: "var(--violet)" },
          ].map((q) => (
            <button key={q.k} className="qa" onClick={q.on}>
              <div className="ico" style={{ background: q.bg, color: q.c }}><Icon n={q.ico} s={19} /></div>
              <div className="lbl">{q.k}</div>
            </button>
          ))}
        </div>

        {/* your list */}
        <div className="sec"><h3>Your list</h3><button onClick={onOpenList}>Open</button></div>
        <button className="card aUp" style={{ padding: 18, width: "100%", textAlign: "left", display: "block", animationDelay: ".1s" }} onClick={onOpenList}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" }}>Wocheneinkauf</div>
              <div className="tnum" style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 600, marginTop: 3 }}>{items.length} items · ready to shop</div>
            </div>
            <div className="lc-go"><Icon n="arrow" s={18} w={2.2} /></div>
          </div>
          <div className="dots">
            {items.slice(0, 5).map((p) => <div key={p.id} className="dot">{p.emoji}</div>)}
            {items.length > 5 && <div className="dot" style={{ fontSize: 11, fontWeight: 700, color: "var(--ink2)" }}>+{items.length - 5}</div>}
            {predicted > 0 && <span className="savetag tnum">saves {eur(predicted)}</span>}
          </div>
        </button>

        {/* where to save */}
        {storeRows.length > 0 && (
          <>
            <div className="sec"><h3>Where to save this week</h3></div>
            <div className="card aUp" style={{ padding: "6px 4px", animationDelay: ".15s" }}>
              {storeRows.map((r) => (
                <button key={r.store.id} className="srow" onClick={onOpenList}>
                  <div className="smark" style={{ background: hex(r.store.id) }}>{r.store.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="sname">{r.store.name}</div>
                    <div className="smeta tnum">{r.items.length} of your items on offer</div>
                  </div>
                  <div className="ssave tnum">{eur(r.save)}</div>
                  <span style={{ color: "var(--ink3)" }}><Icon n="chev" s={18} /></span>
                </button>
              ))}
            </div>
          </>
        )}
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
}

/* ============================================================ LIST */
function ListBuilder({ items, onAdd, onRemove, onFind }) {
  const [q, setQ] = useState("");
  const [foc, setFoc] = useState(false);
  const inp = useRef(null);
  const have = new Set(items.map((i) => i.id));
  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    return CATALOG.filter((p) => !have.has(p.id)).filter((p) => !t || p.name.toLowerCase().includes(t) || p.cat.toLowerCase().includes(t)).slice(0, 6);
  }, [q, items]);
  const predicted = items.reduce((s, p) => s + savingsOf(p), 0);
  const spend = items.reduce((s, p) => s + p.promo, 0);
  const add = (p) => { onAdd(p); setQ(""); inp.current && inp.current.focus(); };

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div className="pad" style={{ paddingTop: 2 }}>
        <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.03em" }}>Wocheneinkauf</h2>
      </div>

      <div className="pad" style={{ marginTop: 14, position: "relative", zIndex: 20 }}>
        <div className={"search" + (foc ? " foc" : "")}>
          <span style={{ color: foc ? "var(--blue)" : "var(--ink3)" }}><Icon n="search" s={20} /></span>
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFoc(true)} onBlur={() => setTimeout(() => setFoc(false), 140)}
            onKeyDown={(e) => e.key === "Enter" && matches[0] && add(matches[0])} placeholder="Add an item — “Milch”, “Käse”…" />
        </div>
        {foc && matches.length > 0 && (
          <div className="aIn" style={{ position: "absolute", left: 18, right: 18, top: 58, background: "#fff", borderRadius: 16, boxShadow: "var(--shadow-card)", overflow: "hidden", zIndex: 30, border: "1px solid var(--line)" }}>
            {matches.map((p) => (
              <button key={p.id} onMouseDown={(e) => e.preventDefault()} onClick={() => add(p)}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 13px", textAlign: "left", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontSize: 21, width: 30, textAlign: "center" }}>{p.emoji}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 700, fontSize: 14.5 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 600 }}>{p.unit} · {STORES[p.store].name}</span>
                </span>
                <span style={{ textAlign: "right", lineHeight: 1.15 }}>
                  <span className="tnum" style={{ display: "block", fontWeight: 800, color: "var(--green)", fontSize: 14.5 }}>{eur(p.promo)}</span>
                  <span className="tnum iwas">{eur(p.regular)}</span>
                </span>
                <span style={{ color: "var(--blue)" }}><Icon n="plus" s={18} /></span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="screen pad" style={{ flex: 1, paddingTop: 14 }}>
        {items.length === 0 ? (
          <div className="aIn" style={{ textAlign: "center", paddingTop: 60, color: "var(--ink3)" }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, margin: "0 auto", display: "grid", placeItems: "center", background: "var(--blue-soft)", color: "var(--blue)" }}><Icon n="list" s={26} /></div>
            <p style={{ marginTop: 14, fontWeight: 700, color: "var(--ink2)" }}>Your list is empty</p>
            <p style={{ marginTop: 4, fontSize: 13.5 }}>Search above to add items at their<br />cheapest price near you.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {items.map((p, i) => (
              <div key={p.id} className="irow aUp" style={{ animationDelay: (i * .02) + "s" }}>
                <div className="ithumb">{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="iname">{p.name}</div>
                  <div className="imeta"><span className="sdot" style={{ background: hex(p.store) }} /><span className="tnum">{p.unit} · {STORES[p.store].name}</span></div>
                </div>
                <div style={{ textAlign: "right", marginRight: 2 }}>
                  <div className="iprice tnum">{eur(p.promo)}</div>
                  <div className="iwas tnum">{eur(p.regular)}</div>
                </div>
                <button onClick={() => onRemove(p.id)} style={{ width: 30, height: 30, display: "grid", placeItems: "center", color: "var(--ink3)" }}><Icon n="trash" s={17} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="pad aUp" style={{ paddingTop: 10, paddingBottom: 14, background: "linear-gradient(to top,var(--bg) 78%, rgba(233,237,244,0))" }}>
          <div className="card" style={{ padding: "15px 16px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--green)" }}>You’ll save</div>
                <div style={{ marginTop: 5 }}><BigEuro value={predicted} size={34} color="var(--green)" /></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12.5, color: "var(--ink3)", fontWeight: 600 }}>Basket total</div>
                <div className="tnum" style={{ fontSize: 19, fontWeight: 800, marginTop: 4 }}>{eur(spend)}</div>
              </div>
            </div>
            <button className="btn" style={{ marginTop: 14 }} onClick={onFind}><Icon n="pin" s={19} /> Find where to shop</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================ STORE REC */
function StoreRec({ items, onBack, onComplete }) {
  const plan = useMemo(() => optimiseBasket(items), [items]);
  const total = plan.totalSaving;
  const stops = useMemo(() => [...plan.stops].sort((a, b) => b.saving - a.saving), [plan]);
  const [open, setOpen] = useState(stops.length ? stops[0].store.id : null);

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div className="pad" style={{ paddingTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, display: "grid", placeItems: "center", marginLeft: -6 }}><Icon n="back" s={22} /></button>
        <span style={{ fontWeight: 800, fontSize: 17 }}>Where to shop</span>
      </div>

      <div className="screen pad" style={{ flex: 1, paddingTop: 12 }}>
        <div className="savecard aUp" style={{ textAlign: "center", padding: "22px 20px" }}>
          <div className="r1" /><div className="r2" />
          <div className="eyebrow" style={{ color: "rgba(255,255,255,.72)" }}>Most you can save</div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}><BigEuro value={total} size={50} /></div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.8)", fontWeight: 600, marginTop: 8 }}>across {items.length} items this shop</div>
        </div>

        <div className="sec"><h3>Compare stores</h3></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {stops.map((stop, idx) => {
            const best = idx === 0, isOpen = open === stop.store.id;
            return (
              <div key={stop.store.id} className="card aUp" style={{ overflow: "hidden", animationDelay: (.06 + idx * .06) + "s", boxShadow: best ? "0 0 0 2px var(--blue), var(--shadow-card)" : "var(--shadow-card)" }}>
                {best && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--blue)", color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: ".06em", padding: "8px 16px" }}>
                    <Icon n="spark" s={14} /> BEST CHOICE
                  </div>
                )}
                <button className="srow" style={{ borderRadius: 0 }} onClick={() => setOpen(isOpen ? null : stop.store.id)}>
                  <div className="smark" style={{ background: hex(stop.store.id) }}>{stop.store.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="sname" style={{ fontSize: 17 }}>{stop.store.name} <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink3)", background: "var(--inset)", padding: "2px 8px", borderRadius: 999, marginLeft: 4 }}>#{idx + 1}</span></div>
                    <div className="smeta tnum">{stop.items.length} items on offer</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="eyebrow" style={{ fontSize: 9.5, color: "var(--green)" }}>You save</div>
                    <div className="tnum" style={{ fontSize: 20, fontWeight: 800, color: "var(--green)", marginTop: 2 }}>{eur(stop.saving)}</div>
                  </div>
                  <span style={{ color: "var(--ink3)", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "none" }}><Icon n="chevd" s={20} /></span>
                </button>
                {isOpen && (
                  <div style={{ padding: "2px 14px 14px", borderTop: "1px solid var(--line)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 2px 9px", fontSize: 12.5, color: "var(--ink3)", fontWeight: 600 }}>
                      <span>Products on offer here</span><span className="tnum">spend {eur(stop.spend)}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {stop.items.map((p) => (
                        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <span style={{ fontSize: 19, width: 32, height: 32, borderRadius: 9, background: "var(--inset)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>{p.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                            <div style={{ fontSize: 11.5, color: "var(--ink3)", marginTop: 1 }}>{p.unit}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", background: "var(--green-soft)", padding: "3px 8px", borderRadius: 999 }}>−{discountPct(p)}%</span>
                          <span style={{ textAlign: "right", lineHeight: 1.15, minWidth: 50 }}>
                            <span className="iprice tnum" style={{ display: "block", fontSize: 14 }}>{eur(p.promo)}</span>
                            <span className="iwas tnum">{eur(p.regular)}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ height: 12 }} />
      </div>

      <div className="pad" style={{ paddingTop: 8, paddingBottom: 16 }}>
        <button className="btn btn-dark" onClick={() => onComplete(total)}><Icon n="check" s={20} /> I shopped — bank {eur(total)}</button>
      </div>
    </div>
  );
}

/* ============================================================ PROFILE */
function Field({ icon, label, value, onClick }) {
  return (
    <button className="prow" onClick={onClick}>
      <div className="pico"><Icon n={icon} s={19} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="plab">{label}</div>
        <div className="pval">{value}</div>
      </div>
      <span style={{ color: "var(--ink3)", flex: "0 0 auto" }}><Icon n="edit" s={17} /></span>
    </button>
  );
}

function EditSheet({ field, onSave, onClose }) {
  const [val, setVal] = useState(field.value);
  const inp = useRef(null);
  useEffect(() => { const t = setTimeout(() => inp.current && inp.current.focus(), 90); return () => clearTimeout(t); }, []);
  const valid = field.key === "email"
    ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val.trim())
    : val.trim().length > 0;
  return (
    <div className="sheet-back aIn" onClick={onClose}>
      <div className="sheet aSheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>{field.title}</div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--inset)", color: "var(--ink2)" }}><Icon n="x" s={17} /></button>
        </div>
        <div className="eyebrow" style={{ marginTop: 18 }}>{field.label}</div>
        <input ref={inp} className="sfield tnum" type={field.type || "text"} value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && valid) onSave(val.trim()); }}
          placeholder={field.placeholder} autoComplete="off" autoCapitalize={field.key === "name" ? "words" : "none"} />
        {field.key === "email" && val.trim() && !valid && (
          <div style={{ fontSize: 12.5, color: "var(--coral)", fontWeight: 600, marginTop: 8 }}>Enter a valid email address.</div>
        )}
        <button className="btn" style={{ marginTop: 18, opacity: valid ? 1 : .45, pointerEvents: valid ? "auto" : "none" }} onClick={() => valid && onSave(val.trim())}>Save changes</button>
      </div>
    </div>
  );
}

function ConfirmSheet({ onConfirm, onClose }) {
  return (
    <div className="sheet-back aIn" onClick={onClose}>
      <div className="sheet aSheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 52, height: 52, borderRadius: 16, display: "grid", placeItems: "center", background: "var(--coral-soft)", color: "var(--coral)" }}><Icon n="logout" s={24} /></div>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 15 }}>Sign out?</div>
        <div style={{ fontSize: 14, color: "var(--ink2)", fontWeight: 500, marginTop: 6, lineHeight: 1.45 }}>You’ll need to sign in again to see your lists and savings.</div>
        <button className="btn" style={{ marginTop: 18, background: "var(--coral)", boxShadow: "0 14px 30px -10px rgba(255,106,77,.5)" }} onClick={onConfirm}><Icon n="logout" s={19} /> Sign out</button>
        <button onClick={onClose} style={{ width: "100%", height: 50, marginTop: 6, fontWeight: 700, color: "var(--ink2)" }}>Cancel</button>
      </div>
    </div>
  );
}

function Profile({ profile, saved, initial, onEditName, onEditEmail, onSignOut }) {
  return (
    <div className="screen">
      <div className="pad" style={{ paddingTop: 6, paddingBottom: 8 }}>
        {/* header */}
        <div className="card aUp" style={{ padding: "26px 20px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(150deg,#2f6bff,#1748d8)", color: "#fff", display: "grid", placeItems: "center", fontSize: 33, fontWeight: 800, boxShadow: "var(--shadow-blue)" }}>{initial}</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", marginTop: 15 }}>{profile.name}</div>
          <div style={{ fontSize: 13.5, color: "var(--ink2)", fontWeight: 600, marginTop: 3 }}>{profile.email}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 16, background: "var(--green-soft)", color: "var(--green)", fontWeight: 700, fontSize: 13, padding: "7px 14px", borderRadius: 999 }}>
            <Icon n="spark" s={15} /> <span className="tnum">{eur(saved)} saved with mitbringen</span>
          </div>
        </div>

        {/* account */}
        <div className="sec"><h3>Account</h3></div>
        <div className="card aUp" style={{ padding: "3px 4px", animationDelay: ".05s" }}>
          <Field icon="profile" label="Name" value={profile.name} onClick={onEditName} />
          <Field icon="mail" label="Email" value={profile.email} onClick={onEditEmail} />
        </div>

        {/* sign out */}
        <button className="signout aUp" style={{ animationDelay: ".1s" }} onClick={onSignOut}>
          <Icon n="logout" s={20} /> Sign out
        </button>
        <div style={{ height: 14 }} />
      </div>
    </div>
  );
}

/* ============================================================ AUTH */
function GoogleG({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.2 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.2 5.6C43.6 37.9 46.5 31.8 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.5 19.4l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.9-6.1C9.9 27 9.5 25.5 9.5 24s.4-3 1-4.6z" />
      <path fill="#34A853" d="M24 48c6.4 0 11.9-2.1 15.8-5.8l-7.2-5.6c-2 1.4-4.6 2.2-8.6 2.2-6.3 0-11.6-3.7-13.5-9l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const signup = mode === "signup";
  const [email, setEmail] = useState("anna@example.com");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pwValid = pw.length >= 6;
  const valid = emailValid && pwValid;
  const submit = () => { setTouched(true); if (valid) onAuth(); };

  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column" }}>
      <div className="pad" style={{ paddingTop: 40, flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="aUp" style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Brand size={40} radius={13} />
          <div style={{ fontWeight: 800, fontSize: 23, letterSpacing: "-0.045em" }}>mit<span style={{ color: "var(--blue)" }}>bringen</span></div>
        </div>

        <div className="aUp" style={{ marginTop: 36, animationDelay: ".05s" }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}>{signup ? <>Save on<br />every shop</> : <>Welcome back</>}</h1>
          <p style={{ color: "var(--ink2)", fontSize: 15, fontWeight: 500, lineHeight: 1.5, marginTop: 10, maxWidth: 290 }}>{signup ? "Track the cheapest prices and watch your savings add up." : "Log in to pick up your list where you left off."}</p>
        </div>

        <button className="btn btn-soft aUp" style={{ marginTop: 28, gap: 11, animationDelay: ".1s" }} onClick={onAuth}><GoogleG size={20} /> Continue with Google</button>

        <div className="aUp" style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0", animationDelay: ".14s" }}>
          <span style={{ flex: 1, height: 1, background: "var(--line2)" }} /><span style={{ fontSize: 12.5, color: "var(--ink3)", fontWeight: 600 }}>or with email</span><span style={{ flex: 1, height: 1, background: "var(--line2)" }} />
        </div>

        <div className="aUp" style={{ display: "flex", flexDirection: "column", gap: 10, animationDelay: ".18s" }}>
          <input className={"afield" + (touched && !emailValid ? " bad" : "")} type="email" inputMode="email" autoCapitalize="none" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <div style={{ position: "relative" }}>
            <input className={"afield" + (touched && !pwValid ? " bad" : "")} type={show ? "text" : "password"} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} style={{ paddingRight: 46 }} />
            <button onClick={() => setShow((s) => !s)} style={{ position: "absolute", right: 8, top: 8, width: 38, height: 38, display: "grid", placeItems: "center", color: "var(--ink3)" }} aria-label={show ? "Hide password" : "Show password"}><Icon n={show ? "eyeoff" : "eye"} s={19} /></button>
          </div>
          {touched && !valid && <div style={{ fontSize: 12.5, color: "var(--coral)", fontWeight: 600 }}>{!emailValid ? "Enter a valid email address." : "Password must be at least 6 characters."}</div>}
          {!signup && <button style={{ alignSelf: "flex-end", fontSize: 13, fontWeight: 700, color: "var(--blue)" }}>Forgot password?</button>}
        </div>
      </div>

      <div className="pad" style={{ paddingBottom: 22, paddingTop: 10 }}>
        <button className="btn" onClick={submit} style={{ opacity: valid ? 1 : .55 }}>{signup ? "Create account" : "Log in"} <Icon n="arrow" s={20} /></button>
        {signup && <p style={{ fontSize: 11.5, color: "var(--ink3)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>By continuing you agree to our <b style={{ color: "var(--ink2)" }}>Terms</b> &amp; <b style={{ color: "var(--ink2)" }}>Privacy Policy</b>.</p>}
        <div style={{ textAlign: "center", marginTop: signup ? 8 : 16, fontSize: 14, color: "var(--ink2)", fontWeight: 600 }}>
          {signup ? "Already have an account? " : "New to mitbringen? "}
          <button className="linklike" onClick={() => { setMode(signup ? "login" : "signup"); setTouched(false); }}>{signup ? "Log in" : "Create account"}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ ASSISTANT */
function AssistantScreen({ onClose }) {
  const [notified, setNotified] = useState(false);
  const caps = [
    { icon: "search", t: "Find anything",     d: "\u201cWhere\u2019s gluten-free pasta near me?\u201d" },
    { icon: "spark",  t: "Smarter swaps",     d: "Cheaper alternatives for what\u2019s on your list" },
    { icon: "target", t: "Learns your taste", d: "Suggests foods you\u2019ll love, from your shops" },
  ];
  return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* grabber */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--line2)" }} />
      </div>

      {/* header */}
      <div className="pad" style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 10, paddingBottom: 14, flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: "var(--green-soft)", color: "var(--green)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Icon n="chat" s={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>Assistant</span>
            <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", color: "var(--amber)", background: "var(--amber-soft)", padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>COMING SOON</span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink2)", fontWeight: 500, marginTop: 2 }}>Your personal shopping helper</div>
        </div>
        <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--inset)", color: "var(--ink2)", flexShrink: 0 }}>
          <Icon n="x" s={17} />
        </button>
      </div>

      {/* content */}
      <div className="pad" style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        {/* teaser chat */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "var(--green)", color: "#fff", padding: "11px 15px", borderRadius: "16px 16px 4px 16px", fontSize: 14.5, fontWeight: 500, maxWidth: "82%", lineHeight: 1.4 }}>
              Where can I find oat milk on offer near me?
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 12, position: "relative" }}>
            <div style={{ background: "var(--surface)", boxShadow: "var(--shadow-card)", padding: "13px 16px", borderRadius: "16px 16px 16px 4px", fontSize: 14.5, color: "var(--ink2)", maxWidth: "86%", lineHeight: 1.5, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
              Hofer nearby has it for \u20ac1.19 this week \u2014 that\u2019s 30% off. It\u2019s the cheapest option across all stores near you right now.
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(13,18,32,.82)", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}>
                <Icon n="lock" s={14} /> Unlocks soon
              </div>
            </div>
          </div>
        </div>

        {/* capability cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {caps.map((c) => (
            <div key={c.t} className="card" style={{ padding: "13px 15px", display: "flex", alignItems: "center", gap: 13 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "var(--green-tint)", color: "var(--green)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                <Icon n={c.icon} s={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{c.t}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* notify CTA */}
      <div className="pad" style={{ paddingTop: 12, paddingBottom: 16, flexShrink: 0 }}>
        <button className={"btn" + (notified ? "" : " btn-dark")} onClick={() => setNotified(true)} disabled={notified}
          style={{ gap: 9, background: notified ? "var(--green-soft)" : undefined, color: notified ? "var(--green)" : undefined, boxShadow: notified ? "none" : undefined }}>
          <Icon n={notified ? "check" : "bell"} s={19} /> {notified ? "We\u2019ll let you know" : "Notify me when it\u2019s ready"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================ APP */
function App() {
  const seed = CATALOG.slice(0, 7);
  const [tab, setTab] = useState("home");
  const [view, setView] = useState("build"); // build | store
  const [items, setItems] = useState(seed);
  const [saved, setSaved] = useState(23.4);
  const [goal] = useState(50);
  const [banked, setBanked] = useState(0);
  const [profile, setProfile] = useState({ name: "Anna", email: "anna@example.com" });
  const [editing, setEditing] = useState(null);
  const [confirmOut, setConfirmOut] = useState(false);
  const [authed, setAuthed] = useState(false);
  const signOut = () => { setConfirmOut(false); setEditing(null); setTab("home"); setView("build"); setAuthed(false); };

  const initial = (profile.name.trim()[0] || "?").toUpperCase();
  const firstName = profile.name.trim().split(/\s+/)[0] || "there";
  const editName = () => setEditing({ key: "name", title: "Edit name", label: "Your name", value: profile.name, type: "text", placeholder: "e.g. Anna Bauer" });
  const editEmail = () => setEditing({ key: "email", title: "Edit email", label: "Email address", value: profile.email, type: "email", placeholder: "you@example.com" });
  const saveField = (v) => { setProfile((p) => ({ ...p, [editing.key]: v })); setEditing(null); };

  const addItem = (p) => setItems((xs) => xs.find((x) => x.id === p.id) ? xs : [p, ...xs]);
  const removeItem = (id) => setItems((xs) => xs.filter((x) => x.id !== id));
  const complete = (amt) => {
    setSaved((s) => +(s + amt).toFixed(2));
    setItems([]); setView("build"); setTab("home");
    setBanked(+amt.toFixed(2)); setTimeout(() => setBanked(0), 2800);
  };

  const showStore = tab === "list" && view === "store";

  return (
    <div className="viewport">
      <div className="app">
        {!authed ? (
          <Auth onAuth={() => setAuthed(true)} />
        ) : (
        <>
        {!showStore && tab !== "assistant" && (
          <div className="topbar">
            {tab === "home" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <Brand size={38} radius={12} />
                  <div><div className="hi-sub">Guten Morgen,</div><div className="hi-name">{firstName}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="icbtn"><Icon n="search" s={20} /></button>
                  <button className="avatar" onClick={() => { setTab("profile"); setView("build"); }}>{initial}</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Brand size={32} radius={10} />
                  <div className="hi-name" style={{ fontSize: 20 }}>{tab === "profile" ? "Profile" : "Lists"}</div>
                </div>
                {tab !== "profile" && <div className="avatar">{initial}</div>}
              </>
            )}
          </div>
        )}

        {banked > 0 && (
          <div className="aPop" style={{ position: "absolute", top: 78, left: "50%", transform: "translateX(-50%)", zIndex: 70, background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 14, padding: "9px 16px", borderRadius: 999, boxShadow: "0 10px 24px -6px rgba(18,161,80,.6)" }}>
            🎉 Banked {eur(banked)} into your savings
          </div>
        )}

        {tab === "home" && <Home items={items} saved={saved} goal={goal} monthLabel="June" onOpenList={() => { setTab("list"); setView("build"); }} onNewList={() => { setTab("list"); setView("build"); }} />}
        {tab === "list" && !showStore && <ListBuilder items={items} onAdd={addItem} onRemove={removeItem} onFind={() => setView("store")} />}
        {showStore && <StoreRec items={items} onBack={() => setView("build")} onComplete={complete} />}
        {tab === "profile" && <Profile profile={profile} saved={saved} initial={initial} onEditName={editName} onEditEmail={editEmail} onSignOut={() => setConfirmOut(true)} />}
        {tab === "assistant" && <AssistantScreen onClose={() => setTab("home")} />}

        {editing && <EditSheet field={editing} onSave={saveField} onClose={() => setEditing(null)} />}
        {confirmOut && <ConfirmSheet onConfirm={signOut} onClose={() => setConfirmOut(false)} />}

        {!showStore && (
          <div className="tabs">
            {[{ k: "home", l: "Home", i: "home" }, { k: "list", l: "Lists", i: "list" }, { k: "assistant", l: "Assistant", i: "chat" }, { k: "profile", l: "Profile", i: "profile" }].map((t) => (
              <button key={t.k} className={"tab" + (tab === t.k || (t.k === "list" && tab === "list") ? " on" : "")} onClick={() => { setTab(t.k); if (t.k !== "assistant") setView("build"); }}>
                <Icon n={t.i} s={22} /> {t.l}
              </button>
            ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
