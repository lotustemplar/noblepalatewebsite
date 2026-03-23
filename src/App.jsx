import { useState, useEffect, useCallback, useMemo } from "react";
import { client, urlFor, fetchSanity, QUERIES, calcAvgScore, scoreColor, scoreLabel, submitAudienceReview } from "./lib/sanity.js";

const FALLBACK_LOGO = "/logo.png";
const FALLBACK_HERO = "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&q=80";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&q=80";

function sanImg(source, width) {
  if (!source) return FALLBACK_IMG;
  try { return urlFor(source).width(width || 600).url(); } catch { return FALLBACK_IMG; }
}

// ─── CSS ───
const CSS = `
:root{--bg0:#08070a;--bg1:#0e0d12;--bg2:#13121a;--bg3:#1a1924;--bg4:#16151e;--gold:#c9a84c;--goldL:#e0c872;--goldD:#a08030;--goldM:rgba(201,168,76,0.12);--purp:#7b5ea7;--purpL:#9b7ec7;--purpD:#5a3d86;--purpM:rgba(123,94,167,0.12);--purpG:rgba(123,94,167,0.25);--t1:#f0ece4;--t2:#9a9590;--t3:#5a5550;--brd:#252230;--brdL:#353240;--red:#c45c4a;--green:#6aab5c;--r:8px;--rl:16px;--tr:all .3s cubic-bezier(.4,0,.2,1)}
*{margin:0;padding:0;box-sizing:border-box}
.N{font-family:'Outfit',sans-serif;background:var(--bg0);color:var(--t1);min-height:100vh;overflow-x:hidden}
.N a{color:var(--gold);text-decoration:none}
.H{position:sticky;top:0;z-index:100;background:rgba(8,7,10,.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--brd)}
.Hi{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px;padding:0 24px}
.Hl{cursor:pointer;display:flex;align-items:center;gap:14px}
.Hl img{height:52px;width:auto;filter:drop-shadow(0 0 8px rgba(201,168,76,.3))}
.Hlt{line-height:1.1}
.Hln{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--gold)}
.Hln span{color:var(--t1);font-weight:400}
.Hls{font-size:9px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--purpL)}
.nv{display:flex;align-items:center;gap:4px}
.nb{background:none;border:none;color:var(--t2);font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;padding:8px 16px;border-radius:6px;cursor:pointer;transition:var(--tr);white-space:nowrap}
.nb:hover{color:var(--t1);background:var(--bg3)}.nb.a{color:var(--gold);background:var(--goldM)}
.nb.cta{background:linear-gradient(135deg,var(--gold),var(--goldD));color:#0a0a0a;font-weight:600}
.mt{display:none;background:none;border:none;color:var(--t1);font-size:24px;cursor:pointer}
@media(max-width:768px){.mt{display:block}.nv{display:none;position:absolute;top:72px;left:0;right:0;background:var(--bg1);border-bottom:1px solid var(--brd);flex-direction:column;padding:16px;gap:4px;z-index:100}.nv.open{display:flex}.nb{width:100%;text-align:left;padding:12px 16px}.Hl img{height:40px}.Hlt{display:none}}
.pg{max-width:1240px;margin:0 auto;padding:32px 24px 80px}
.hero{position:relative;overflow:hidden;padding:100px 24px 80px;text-align:center;min-height:580px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hero-bg{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;filter:brightness(.18) saturate(.5)}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,10,.3) 0%,rgba(8,7,10,.6) 50%,var(--bg0) 100%),radial-gradient(ellipse at 50% 30%,rgba(123,94,167,.15) 0%,transparent 60%),radial-gradient(ellipse at 50% 70%,rgba(201,168,76,.1) 0%,transparent 50%)}
.hero-c{position:relative;z-index:1;max-width:800px}
.hero-logo{width:180px;height:auto;margin:0 auto 28px;display:block;filter:drop-shadow(0 0 20px rgba(201,168,76,.4));animation:fis 1s ease both}
.hero-m{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:500;letter-spacing:5px;text-transform:uppercase;color:var(--purpL);margin-bottom:20px;animation:fiu .8s ease .2s both}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5.5vw,60px);font-weight:700;line-height:1.1;margin-bottom:20px;animation:fiu .8s ease .3s both}
.hero h1 em{font-style:italic;color:var(--gold)}.hero h1 .pu{color:var(--purpL)}
.hero p{font-family:'Cormorant Garamond',serif;font-size:clamp(17px,2.2vw,21px);color:var(--t2);max-width:560px;margin:0 auto 36px;line-height:1.7;animation:fiu .8s ease .4s both}
.hero-act{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fiu .8s ease .5s both}
.hero-st{display:flex;gap:48px;justify-content:center;margin-top:56px;animation:fiu .8s ease .6s both}
.hs{text-align:center}.hs-n{font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:var(--gold)}
.hs-l{font-size:12px;color:var(--t3);letter-spacing:2px;text-transform:uppercase;margin-top:4px}
@keyframes fiu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fis{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
.anim{animation:fiu .5s ease both}
.btn{font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;padding:12px 28px;border-radius:6px;border:none;cursor:pointer;transition:var(--tr);display:inline-flex;align-items:center;gap:8px}
.btn-p{background:linear-gradient(135deg,var(--gold),var(--goldD));color:#0a0a0a}
.btn-p:hover{background:linear-gradient(135deg,var(--goldL),var(--gold));transform:translateY(-1px);box-shadow:0 4px 20px rgba(201,168,76,.3)}
.btn-s{background:transparent;color:var(--t1);border:1px solid var(--brdL)}
.btn-s:hover{border-color:var(--purp);color:var(--purpL)}
.btn-sm{padding:8px 16px;font-size:13px}
.btn-pu{background:linear-gradient(135deg,var(--purp),var(--purpD));color:white}
.sh{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px}
.sh h2{font-family:'Playfair Display',serif;font-size:32px;font-weight:600}.sh p{color:var(--t2);font-size:15px;margin-top:4px}
.sd{display:flex;align-items:center;gap:16px;margin-bottom:12px}
.sd::before,.sd::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--brd),transparent)}
.sd span{font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--purpL);white-space:nowrap}
.cd{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);overflow:hidden;transition:var(--tr)}
.cd:hover{border-color:var(--brdL);box-shadow:0 4px 24px rgba(0,0,0,.5),0 0 40px rgba(123,94,167,.06);transform:translateY(-3px)}
.wg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.wc{cursor:pointer}
.wci{height:180px;background-size:cover;background-position:center;position:relative;overflow:hidden}
.wci::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(19,18,26,.95) 100%)}
.wcs{position:absolute;top:12px;right:12px;z-index:1;display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.sb{font-size:13px;font-weight:600;padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;backdrop-filter:blur(8px)}
.sp{background:rgba(201,168,76,.2);color:var(--gold);border:1px solid rgba(201,168,76,.3)}
.sa{background:rgba(123,94,167,.2);color:var(--purpL);border:1px solid rgba(123,94,167,.3)}
.sl-b{font-size:9px;font-weight:700;letter-spacing:1px}
.wcb{padding:20px 24px 24px}
.wcb h3{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;margin-bottom:8px}
.wm{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.tg{font-size:11px;font-weight:500;padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--t2);border:1px solid var(--brd)}
.wcb>p{font-size:13px;color:var(--t3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px}
.bc{cursor:pointer}
.bci{height:200px;background-size:cover;background-position:center;position:relative}
.bci::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(19,18,26,.95) 100%)}
.bcb{padding:24px}
.bcd{font-size:11px;color:var(--purpL);font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.bcb h3{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin-bottom:10px;line-height:1.3}
.bcb>p{font-size:14px;color:var(--t2);line-height:1.6}
.bcf{padding:14px 24px;border-top:1px solid var(--brd);display:flex;align-items:center;gap:10px}
.bca{width:28px;height:28px;border-radius:50%;background:var(--purpM);display:flex;align-items:center;justify-content:center;font-size:14px;overflow:hidden}
.bca img{width:100%;height:100%;object-fit:cover}
.bcn{font-size:13px;color:var(--t2)}
.pb{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);background:var(--goldM);padding:3px 8px;border-radius:4px;border:1px solid rgba(201,168,76,.2)}

.dh{display:flex;gap:32px;align-items:flex-start;margin-bottom:48px;flex-wrap:wrap}
.di{width:200px;height:260px;border-radius:var(--rl);background-size:cover;background-position:center;border:1px solid var(--brd);flex-shrink:0;position:relative;overflow:hidden}
.di::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(19,18,26,.6) 100%)}
@media(max-width:600px){.di{width:100%;height:200px}}
.df{flex:1;min-width:280px}
.df h1{font-family:'Playfair Display',serif;font-size:34px;font-weight:700;margin-bottom:8px}
.df>p{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--t2);line-height:1.6;margin-bottom:20px}
.dm{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px}
.dmi{display:flex;flex-direction:column;gap:2px}
.dml{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:1.5px;font-weight:600}
.dmv{font-size:15px;font-weight:500}
.scp{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:48px}
@media(max-width:600px){.scp{grid-template-columns:1fr}}
.sc{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);padding:28px;text-align:center;position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.sc.pro::before{background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.sc.aud::before{background:linear-gradient(90deg,transparent,var(--purp),transparent)}
.scl{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}
.scl.pro{color:var(--gold)}.scl.aud{color:var(--purpL)}
.scn{font-family:'Playfair Display',serif;font-size:56px;font-weight:700;line-height:1;margin-bottom:4px}
.scd{font-size:14px;color:var(--t2)}.scc{font-size:12px;color:var(--t3);margin-top:8px}

.pr{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);padding:24px;margin-bottom:16px;position:relative;overflow:hidden}
.pr::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--gold),transparent)}
.pr.au::before{background:linear-gradient(180deg,var(--purp),transparent)}
.prh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}
.prr{display:flex;align-items:center;gap:12px}
.pra{width:48px;height:48px;border-radius:50%;background:var(--goldM);border:2px solid var(--goldD);display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden}
.pra.au{background:var(--purpM);border-color:var(--purpD)}
.pra img{width:100%;height:100%;object-fit:cover}
.prn{font-family:'Playfair Display',serif;font-size:16px;font-weight:600}
.prs{font-family:'Playfair Display',serif;font-size:36px;font-weight:700}
.prs span{font-size:16px;color:var(--t3);font-weight:400}
.bd{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
@media(max-width:600px){.bd{grid-template-columns:repeat(3,1fr)}}
.bdi{background:var(--bg3);border-radius:8px;padding:10px;text-align:center}
.bdl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px}
.bds{font-size:18px;font-weight:600;margin-top:2px}.bdm{font-size:10px;color:var(--t3)}
.rn{font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:var(--t2);font-style:italic;border-left:2px solid var(--purpD);padding-left:16px}

.tabs{display:flex;gap:4px;border-bottom:1px solid var(--brd);margin-bottom:32px}
.tab{padding:12px 20px;background:none;border:none;color:var(--t2);font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;transition:var(--tr)}
.tab:hover{color:var(--t1)}.tab.a{color:var(--gold);border-bottom-color:var(--gold)}

.em{text-align:center;padding:60px 24px;color:var(--t3)}
.emi{font-size:48px;margin-bottom:16px;opacity:.4}
.em h3{font-family:'Playfair Display',serif;font-size:20px;color:var(--t2);margin-bottom:8px}

.sbar{display:flex;gap:10px;margin-bottom:32px;flex-wrap:wrap}
.sinp{flex:1;min-width:200px;padding:12px 16px;background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:var(--tr)}
.sinp:focus{border-color:var(--purp);box-shadow:0 0 0 3px var(--purpG)}
.fb{padding:10px 16px;background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);color:var(--t2);font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:var(--tr)}
.fb:hover,.fb.a{border-color:var(--purp);color:var(--purpL);background:var(--purpM)}

.ftr{border-top:1px solid var(--brd);padding:48px 24px;text-align:center;position:relative}
.ftr::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:200px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.ftr img{width:60px;margin:0 auto 12px;display:block;filter:drop-shadow(0 0 8px rgba(201,168,76,.2))}
.ftr-b{font-family:'Playfair Display',serif;font-size:16px;color:var(--gold);margin-bottom:4px}
.ftr-m{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--purpL);font-style:italic;margin-bottom:8px;letter-spacing:1px}
.ftr p{font-size:12px;color:var(--t3)}

.loading{display:flex;align-items:center;justify-content:center;min-height:400px;flex-direction:column;gap:16px}
.loading-spinner{width:40px;height:40px;border:3px solid var(--brd);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading p{color:var(--t2);font-size:14px}
`;

// ─── Loading Component ───
const Loading = () => (
  <div className="loading"><div className="loading-spinner"/><p>Loading...</p></div>
);

// ─── Header ───
const Header = ({ settings, page, setPage }) => {
  const [mob, setMob] = useState(false);
  const go = (p) => { setPage(p); setMob(false); };
  const logoSrc = settings?.logo ? sanImg(settings.logo, 200) : FALLBACK_LOGO;
  return (
    <header className="H"><div className="Hi">
      <div className="Hl" onClick={() => go("home")}>
        <img src={logoSrc} alt="NPS"/>
        <div className="Hlt"><div className="Hln">Noble<span>Palate</span></div><div className="Hls">Society</div></div>
      </div>
      <button className="mt" onClick={() => setMob(!mob)}>{mob?"✕":"☰"}</button>
      <nav className={`nv ${mob?"open":""}`}>
        {[["home","Home"],["database","Database"],["blog","Blog"]].map(([k,l])=>
          <button key={k} className={`nb ${page===k?"a":""}`} onClick={()=>go(k)}>{l}</button>
        )}
      </nav>
    </div></header>
  );
};

// ─── Home ───
const Home = ({ settings, whiskeys, posts, setPage, setSW, setSB }) => {
  const top = (whiskeys || []).slice(0, 4);
  const recent = (posts || []).slice(0, 3);
  const logoSrc = settings?.logo ? sanImg(settings.logo, 400) : FALLBACK_LOGO;
  const heroSrc = settings?.heroImage ? sanImg(settings.heroImage, 1400) : FALLBACK_HERO;

  return (<div>
    <div className="hero">
      <div className="hero-bg" style={{backgroundImage:`url(${heroSrc})`}}/>
      <div className="hero-c">
        <img src={logoSrc} alt="Noble Palate Society" className="hero-logo"/>
        <div className="hero-m">{settings?.motto || "Sapientia Per Sensus"}</div>
        <h1>{settings?.heroTitle || <>The Art of <em>Whiskey</em>,<br/><span className="pu">Elevated</span></>}</h1>
        {settings?.tagline && <div style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:500,color:'var(--gold)',letterSpacing:2,marginBottom:16}}>{settings.tagline}</div>}
        <p>{settings?.heroSubtitle || "Expert reviews, curated tastings, and a community of connoisseurs."}</p>
        <div className="hero-act">
          <button className="btn btn-p" onClick={()=>setPage("database")}>Explore Database</button>
          <button className="btn btn-s" onClick={()=>setPage("blog")}>Read the Blog</button>
        </div>
        <div className="hero-st">
          <div className="hs"><div className="hs-n">{(whiskeys||[]).length}</div><div className="hs-l">Whiskeys</div></div>
          <div className="hs"><div className="hs-n">{(whiskeys||[]).reduce((s,w)=>(w.proReviews?.length||0)+(w.audienceReviews?.length||0)+s,0)}</div><div className="hs-l">Reviews</div></div>
        </div>
      </div>
    </div>
    <div className="pg">
      {top.length > 0 && <>
        <div className="sd"><span>Featured Whiskeys</span></div>
        <div className="sh"><div><h2>Our Top Picks</h2><p>Latest expert-reviewed selections</p></div><button className="btn btn-s btn-sm" onClick={()=>setPage("database")}>View All →</button></div>
        <div className="wg">{top.map((w,i)=>{
          const ps=calcAvgScore(w.proReviews);const as=calcAvgScore(w.audienceReviews);
          return(<div key={w._id} className="cd wc anim" style={{animationDelay:`${i*.08}s`}} onClick={()=>{setSW(w);setPage("detail");}}>
            <div className="wci" style={{backgroundImage:`url(${sanImg(w.image,600)})`}}>
              <div className="wcs">{ps&&<div className="sb sp"><span className="sl-b">PRO</span> {ps}</div>}{as&&<div className="sb sa"><span className="sl-b">AUD</span> {as}</div>}</div>
            </div>
            <div className="wcb"><h3>{w.name}</h3><div className="wm"><span className="tg">{w.type}</span><span className="tg">{w.region}</span>{w.abv&&<span className="tg">{w.abv}</span>}</div><p>{w.description}</p></div>
          </div>);
        })}</div>
      </>}
      {recent.length > 0 && <div style={{marginTop:72}}>
        <div className="sd"><span>From the Blog</span></div>
        <div className="sh"><div><h2>Latest Reviews</h2><p>Deep dives, tasting notes, and whiskey culture</p></div><button className="btn btn-s btn-sm" onClick={()=>setPage("blog")}>All Posts →</button></div>
        <div className="bg">{recent.map((p,i)=>(
          <div key={p._id} className="cd bc anim" style={{animationDelay:`${i*.08}s`}} onClick={()=>{setSB(p);setPage("blogdet");}}>
            <div className="bci" style={{backgroundImage:`url(${sanImg(p.heroImage,800)})`}}/>
            <div className="bcb">
              <div className="bcd">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : ''}</div>
              <h3>{p.title}</h3><p>{p.excerpt}</p>
            </div>
            <div className="bcf">
              <div className="bca">{p.authorAvatar?<img src={sanImg(p.authorAvatar,60)} alt=""/>:"👤"}</div>
              <span className="bcn">{p.authorName}</span>
              {p.authorIsPro&&<span className="pb" style={{marginLeft:'auto'}}>PRO</span>}
            </div>
          </div>
        ))}</div>
      </div>}
      {(whiskeys||[]).length===0 && (posts||[]).length===0 && (
        <div className="em" style={{marginTop:40}}>
          <div className="emi">📝</div>
          <h3>Welcome to Noble Palate Society</h3>
          <p style={{maxWidth:500,margin:'0 auto',lineHeight:1.7}}>Your site is connected to Sanity! Head to your <a href="https://www.sanity.io/manage/personal/project/utqvc7uf" target="_blank" rel="noopener">Sanity Studio</a> to start adding whiskeys, blog posts, and reviewers. All content you add there will appear here automatically.</p>
        </div>
      )}
    </div>
  </div>);
};

// ─── Database ───
const Database = ({ whiskeys, setPage, setSW }) => {
  const [q,setQ]=useState("");const [tf,setTf]=useState("all");
  const types = useMemo(()=>[...new Set((whiskeys||[]).map(w=>w.type).filter(Boolean))],[whiskeys]);
  const fil = useMemo(()=>(whiskeys||[]).filter(w=>{
    const m=(w.name||"").toLowerCase().includes(q.toLowerCase())||(w.type||"").toLowerCase().includes(q.toLowerCase())||(w.region||"").toLowerCase().includes(q.toLowerCase());
    return m&&(tf==="all"||w.type===tf);
  }),[whiskeys,q,tf]);
  return(<div className="pg">
    <div className="sd"><span>Whiskey Database</span></div>
    <div className="sh"><div><h2>All Whiskeys</h2><p>{(whiskeys||[]).length} whiskeys reviewed</p></div></div>
    <div className="sbar"><input className="sinp" placeholder="Search by name, type, or region..." value={q} onChange={e=>setQ(e.target.value)}/><button className={`fb ${tf==="all"?"a":""}`} onClick={()=>setTf("all")}>All</button>{types.map(t=><button key={t} className={`fb ${tf===t?"a":""}`} onClick={()=>setTf(t)}>{t}</button>)}</div>
    <div className="wg">{fil.map((w,i)=>{
      const ps=calcAvgScore(w.proReviews);const as=calcAvgScore(w.audienceReviews);
      return(<div key={w._id} className="cd wc anim" style={{animationDelay:`${i*.04}s`}} onClick={()=>{setSW(w);setPage("detail");}}>
        <div className="wci" style={{backgroundImage:`url(${sanImg(w.image,600)})`}}>
          <div className="wcs">
            {ps!==null&&<div className="sb sp"><span className="sl-b">PRO</span> {ps}</div>}
            {as!==null&&<div className="sb sa"><span className="sl-b">AUD</span> {as}</div>}
            {!ps&&!as&&<div className="sb" style={{background:'rgba(255,255,255,.08)',color:'var(--t3)',border:'1px solid var(--brd)'}}>Unreviewed</div>}
          </div>
        </div>
        <div className="wcb"><h3>{w.name}</h3><div className="wm"><span className="tg">{w.type}</span><span className="tg">{w.region}</span>{w.abv&&<span className="tg">{w.abv}</span>}{w.price&&<span className="tg">{w.price}</span>}</div><p>{w.description}</p></div>
      </div>);
    })}</div>
    {fil.length===0&&<div className="em"><div className="emi">🔍</div><h3>No whiskeys found</h3></div>}
  </div>);
};

// ─── Detail ───
const Detail = ({ whiskey: w, setPage }) => {
  if(!w)return<div className="pg"><div className="em"><h3>Not found</h3></div></div>;
  const [tab,setTab]=useState("pro");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",email:"",aroma:10,palate:30,finish:14,style:7,value:7,notes:""});
  const [submitting,setSubmitting]=useState(false);
  const [msg,setMsg]=useState(null);
  const [copied,setCopied]=useState(false);
  const ps=calcAvgScore(w.proReviews);const as=calcAvgScore(w.audienceReviews);
  const total=form.aroma+form.palate+form.finish+form.style+form.value;

  const handleSubmit=async()=>{
    if(!form.name.trim()){setMsg({type:'err',text:'Please enter your name'});return;}
    setSubmitting(true);
    const result=await submitAudienceReview({whiskeyId:w._id,name:form.name,email:form.email,aroma:form.aroma,palate:form.palate,finish:form.finish,style:form.style,value:form.value,notes:form.notes});
    setSubmitting(false);
    if(result.success){
      setMsg({type:'suc',text:'Thank you! Your review has been submitted and is pending approval by our team.'});
      setShowForm(false);
      setForm({name:"",email:"",aroma:10,palate:30,finish:14,style:7,value:7,notes:""});
    } else {
      setMsg({type:'err',text:result.error||'Something went wrong.'});
    }
    setTimeout(()=>setMsg(null),6000);
  };

  const RC=({review,isPro})=>{const t=review.aroma+review.palate+review.finish+review.style+review.value;return(
    <div className={`pr ${isPro?'':'au'}`}><div className="prh"><div className="prr">
      <div className={`pra ${isPro?'':'au'}`}>{review.reviewerAvatar?<img src={sanImg(review.reviewerAvatar,100)} alt=""/>:"👤"}</div>
      <div><div className="prn">{review.reviewerName||"Anonymous"}</div>{isPro?<span className="pb">NPS Pro Reviewer</span>:<span style={{fontSize:11,color:'var(--t3)'}}>{review._createdAt?new Date(review._createdAt).toLocaleDateString():''}</span>}</div>
    </div><div className="prs" style={{color:scoreColor(t)}}>{t}<span>/100</span></div></div>
    <div className="bd">{[["Aroma",review.aroma,15],["Palate",review.palate,45],["Finish",review.finish,20],["Style",review.style,10],["Value",review.value,10]].map(([l,v,m])=><div className="bdi" key={l}><div className="bdl">{l}</div><div className="bds">{v}</div><div className="bdm">/{m}</div></div>)}</div>
    {review.notes&&<div className="rn">"{review.notes}"</div>}</div>
  );};
  return(<div className="pg">
    <button className="btn btn-s btn-sm" onClick={()=>setPage("database")} style={{marginBottom:24}}>← Back to Database</button>
    {msg&&<div className={msg.type}>{msg.text}</div>}
    <div className="dh anim"><div className="di" style={{backgroundImage:`url(${sanImg(w.image,600)})`}}/><div className="df"><h1>{w.name}</h1><div className="dm">{[["Type",w.type],["Region",w.region],["ABV",w.abv],["Price",w.price]].filter(([,v])=>v).map(([l,v])=><div className="dmi" key={l}><span className="dml">{l}</span><span className="dmv">{v}</span></div>)}</div><p>{w.description}</p></div></div>
    <div className="scp anim"><div className="sc pro"><div className="scl pro">NPS Pro Score</div><div className="scn" style={{color:scoreColor(ps)}}>{ps??"—"}</div><div className="scd">{scoreLabel(ps)}</div><div className="scc">{(w.proReviews||[]).length} pro review{(w.proReviews||[]).length!==1?'s':''}</div></div><div className="sc aud"><div className="scl aud">Audience Score</div><div className="scn" style={{color:scoreColor(as)}}>{as??"—"}</div><div className="scd">{scoreLabel(as)}</div><div className="scc">{(w.audienceReviews||[]).length} audience review{(w.audienceReviews||[]).length!==1?'s':''}</div></div></div>
    
    {/* Write Review + Share buttons */}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:32}}>
      <button className="btn btn-pu" onClick={()=>{setShowForm(true);setTab("audience");}}>✍ Write a Review</button>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <span style={{fontSize:12,color:'var(--t3)',marginRight:4}}>Share:</span>
        <button onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${w.name} on Noble Palate Society!${ps ? ` Pro Score: ${ps}/100` : ''}`)}&url=${encodeURIComponent(window.location.origin)}`,`_blank`)} style={{background:'var(--bg3)',border:'1px solid var(--brd)',borderRadius:6,padding:'6px 12px',cursor:'pointer',color:'var(--t2)',fontSize:13,fontFamily:'Outfit,sans-serif',transition:'var(--tr)'}} onMouseEnter={e=>e.target.style.color='var(--gold)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>𝕏</button>
        <button onClick={()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,`_blank`)} style={{background:'var(--bg3)',border:'1px solid var(--brd)',borderRadius:6,padding:'6px 12px',cursor:'pointer',color:'var(--t2)',fontSize:13,fontFamily:'Outfit,sans-serif',transition:'var(--tr)'}} onMouseEnter={e=>e.target.style.color='var(--purpL)'} onMouseLeave={e=>e.target.style.color='var(--t2)'}>Facebook</button>
        <button onClick={()=>{navigator.clipboard?.writeText(`${window.location.origin} — ${w.name} on Noble Palate Society`);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{background:'var(--bg3)',border:'1px solid var(--brd)',borderRadius:6,padding:'6px 12px',cursor:'pointer',color: copied?'var(--green)':'var(--t2)',fontSize:13,fontFamily:'Outfit,sans-serif',transition:'var(--tr)'}}>{copied?'Copied!':'Copy Link'}</button>
      </div>
    </div>

    <div className="tabs"><button className={`tab ${tab==="pro"?"a":""}`} onClick={()=>setTab("pro")}>Pro Reviews ({(w.proReviews||[]).length})</button><button className={`tab ${tab==="audience"?"a":""}`} onClick={()=>setTab("audience")}>Audience ({(w.audienceReviews||[]).length})</button></div>
    {tab==="pro"&&((w.proReviews||[]).length===0?<div className="em"><div className="emi">🎩</div><h3>No pro reviews yet</h3></div>:(w.proReviews||[]).map(r=><RC key={r._id} review={r} isPro/>))}
    {tab==="audience"&&(<>
      {(w.audienceReviews||[]).length===0&&!showForm&&<div className="em"><div className="emi">👥</div><h3>No audience reviews yet</h3><p>Be the first to review this whiskey!</p></div>}
      {(w.audienceReviews||[]).map(r=><RC key={r._id} review={r} isPro={false}/>)}
      {showForm&&(
        <div className="rf anim" style={{marginTop:24}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,marginBottom:24}}>Review {w.name}</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
            <div className="fg" style={{margin:0}}><label className="fl"><span>Your Name *</span></label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Enter your name"/></div>
            <div className="fg" style={{margin:0}}><label className="fl"><span>Email (optional)</span></label><input className="inp" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com"/></div>
          </div>
          {[["Aroma","aroma",15],["Palate","palate",45],["Finish","finish",20],["Style / Uniqueness","style",10],["Value","value",10]].map(([l,k,m])=><div className="fg" key={k}><div className="fl"><span>{l}</span><span className="flm">Max: {m}</span></div><div className="sr"><input type="range" className="sli" min={0} max={m} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:+e.target.value}))}/><div className="sv">{form[k]}</div></div></div>)}
          <div className="fg"><div className="fl"><span>Tasting Notes</span></div><textarea className="ta" placeholder="Share your thoughts on this whiskey..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
          <div className="ft"><div className="ftl">Total Score</div><div className="fts" style={{color:scoreColor(total)}}>{total}<span>/100</span></div></div>
          <p style={{fontSize:13,color:'var(--t2)',marginBottom:16}}>Your review will be submitted for approval by our team before appearing on the site.</p>
          <div style={{display:'flex',gap:12}}>
            <button className="btn btn-p" onClick={handleSubmit} disabled={submitting}>{submitting?'Submitting...':'Submit Review'}</button>
            <button className="btn btn-s" onClick={()=>setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>)}
  </div>);
};

// ─── Blog ───
const Blog = ({ posts, setPage, setSB }) => (
  <div className="pg"><div className="sd"><span>The Blog</span></div><div className="sh"><div><h2>Reviews & Stories</h2><p>Expert reviews, tasting notes, and whiskey culture</p></div></div>
  {(posts||[]).length===0?<div className="em"><div className="emi">📝</div><h3>No posts yet</h3><p>Add blog posts in Sanity Studio</p></div>:
  <div className="bg">{(posts||[]).map((p,i)=>(
    <div key={p._id} className="cd bc anim" style={{animationDelay:`${i*.06}s`}} onClick={()=>{setSB(p);setPage("blogdet");}}>
      <div className="bci" style={{backgroundImage:`url(${sanImg(p.heroImage,800)})`}}/>
      <div className="bcb"><div className="bcd">{p.publishedAt?new Date(p.publishedAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):''}</div><h3>{p.title}</h3><p>{p.excerpt}</p></div>
      <div className="bcf"><div className="bca">{p.authorAvatar?<img src={sanImg(p.authorAvatar,60)} alt=""/>:"👤"}</div><span className="bcn">{p.authorName}</span>{p.authorIsPro&&<span className="pb" style={{marginLeft:'auto'}}>PRO</span>}</div>
    </div>
  ))}</div>}</div>
);

// ─── Blog Detail ───
const BlogDet = ({ post, setPage, setSW, whiskeys }) => {
  const [full, setFull] = useState(null);
  useEffect(()=>{
    if(post?.slug?.current){
      fetchSanity(QUERIES.blogPostBySlug, {slug:post.slug.current}).then(setFull);
    } else if(post) { setFull(post); }
  },[post]);
  if(!full) return <Loading/>;

  // Render portable text simply
  const renderBody = (body) => {
    if(!body) return <p style={{color:'var(--t2)'}}>No content yet.</p>;
    if(typeof body === 'string') return <p>{body}</p>;
    return body.map((block,i) => {
      if(block._type==='image') return <div key={i} style={{margin:'24px 0'}}><img src={sanImg(block,800)} alt={block.caption||''} style={{width:'100%',borderRadius:8}}/>{block.caption&&<p style={{fontSize:13,color:'var(--t3)',marginTop:8,textAlign:'center'}}>{block.caption}</p>}</div>;
      if(block._type==='htmlEmbed' && block.html) return <div key={i} style={{margin:'32px 0',borderRadius:12,overflow:'hidden'}} dangerouslySetInnerHTML={{__html: block.html}}/>;
      if(block._type==='block'){
        const children = (block.children||[]).map((child, ci) => {
          let text = child.text;
          if(!text) return null;
          const marks = child.marks || [];
          if(marks.includes('strong')) text = <strong key={ci}>{text}</strong>;
          if(marks.includes('em')) text = <em key={ci}>{text}</em>;
          return text;
        });
        if(block.style==='h2') return <h2 key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:28,margin:'32px 0 16px',color:'var(--t1)'}}>{children}</h2>;
        if(block.style==='h3') return <h3 key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:22,margin:'24px 0 12px',color:'var(--t1)'}}>{children}</h3>;
        if(block.style==='blockquote') return <blockquote key={i} style={{borderLeft:'3px solid var(--purpD)',paddingLeft:16,fontStyle:'italic',color:'var(--t2)',margin:'20px 0'}}>{children}</blockquote>;
        return <p key={i} style={{marginBottom:16}}>{children}</p>;
      }
      return null;
    });
  };

  const fw = full.featuredWhiskey;

  return(<div className="pg"><div style={{maxWidth:720,margin:'0 auto'}} className="anim">
    <button className="btn btn-s btn-sm" onClick={()=>setPage("blog")} style={{marginBottom:32}}>← Back to Blog</button>
    <div className="bcd" style={{fontSize:12,marginBottom:12}}>{full.publishedAt?new Date(full.publishedAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):''}</div>
    <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,4vw,40px)',fontWeight:700,marginBottom:16,lineHeight:1.2}}>{full.title}</h1>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32,paddingBottom:32,borderBottom:'1px solid var(--brd)'}}>
      <div className="bca" style={{width:40,height:40,fontSize:20}}>{full.authorAvatar?<img src={sanImg(full.authorAvatar,80)} alt=""/>:"👤"}</div>
      <div><div style={{fontSize:15,fontWeight:500}}>{full.authorName}</div>{full.authorIsPro&&<span className="pb">NPS Pro</span>}</div>
    </div>
    {full.heroImage && <img src={sanImg(full.heroImage,1000)} alt="" style={{width:'100%',borderRadius:12,marginBottom:32}}/>}
    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,lineHeight:1.9,color:'var(--t2)'}}>{renderBody(full.body)}</div>
    {fw&&<div style={{marginTop:40,padding:24,background:'var(--bg2)',border:'1px solid var(--brd)',borderRadius:'var(--rl)'}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'var(--purpL)',marginBottom:12}}>Featured Whiskey</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          {fw.image&&<div style={{width:56,height:56,borderRadius:8,backgroundImage:`url(${sanImg(fw.image,120)})`,backgroundSize:'cover',backgroundPosition:'center'}}/>}
          <div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4}}>{fw.name}</h3><span className="tg">{fw.type}</span>{' '}<span className="tg">{fw.region}</span></div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {fw.proScore&&<div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:scoreColor(fw.proScore)}}>{Math.round(fw.proScore)}</div>}
          <button className="btn btn-s btn-sm" onClick={()=>{const match=(whiskeys||[]).find(x=>x._id===fw._id);if(match){setSW(match);setPage("detail");}}}>View Review →</button>
        </div>
      </div>
    </div>}
  </div></div>);
};

// ─── Main App ───
export default function App() {
  const [page, setPage] = useState("home");
  const [settings, setSettings] = useState(null);
  const [whiskeys, setWhiskeys] = useState(null);
  const [posts, setPosts] = useState(null);
  const [selW, setSelW] = useState(null);
  const [selB, setSelB] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSanity(QUERIES.siteSettings),
      fetchSanity(QUERIES.allWhiskeys),
      fetchSanity(QUERIES.allBlogPosts),
    ]).then(([s, w, p]) => {
      setSettings(s);
      setWhiskeys(w || []);
      setPosts(p || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { window.scrollTo?.({ top: 0, behavior: 'smooth' }); }, [page]);

  const logoSrc = settings?.logo ? sanImg(settings.logo, 200) : FALLBACK_LOGO;

  if (loading) return (
    <div className="N"><style>{CSS}</style>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:20}}>
        <img src={FALLBACK_LOGO} alt="NPS" style={{width:120,filter:'drop-shadow(0 0 20px rgba(201,168,76,.4))'}}/>
        <div className="loading-spinner" style={{width:40,height:40,border:'3px solid #252230',borderTopColor:'#c9a84c',borderRadius:'50%',animation:'spin 1s linear infinite'}}/>
        <p style={{color:'#9a9590',fontFamily:'Outfit,sans-serif',fontSize:14}}>Loading Noble Palate Society...</p>
      </div>
    </div>
  );

  return (
    <div className="N"><style>{CSS}</style>
      <Header settings={settings} page={page} setPage={setPage}/>
      {page==="home"&&<Home settings={settings} whiskeys={whiskeys} posts={posts} setPage={setPage} setSW={setSelW} setSB={setSelB}/>}
      {page==="database"&&<Database whiskeys={whiskeys} setPage={setPage} setSW={setSelW}/>}
      {page==="detail"&&<Detail whiskey={selW} setPage={setPage}/>}
      {page==="blog"&&<Blog posts={posts} setPage={setPage} setSB={setSelB}/>}
      {page==="blogdet"&&<BlogDet post={selB} setPage={setPage} setSW={setSelW} whiskeys={whiskeys}/>}
      <footer className="ftr">
        <img src={logoSrc} alt="NPS"/>
        <div className="ftr-b">NoblePalateSociety.com</div>
        <div className="ftr-m">{settings?.motto || "Sapientia Per Sensus"} — Wisdom Through the Senses</div>
        <p>© 2026 Noble Palate Society. The pursuit of liquid perfection.</p>
      </footer>
    </div>
  );
}
