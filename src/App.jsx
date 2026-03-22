import { useState, useEffect, useCallback, useMemo } from "react";

const LOGO_URL = "/logo.png";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1400&q=80",
  bottles: {
    "Lagavulin 16": "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&q=80",
    "Buffalo Trace": "https://images.unsplash.com/photo-1609767307561-81b6b1af6b59?w=400&q=80",
    "Redbreast 12": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
    "Yamazaki 12": "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&q=80",
    "Ardbeg Uigeadail": "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&q=80",
    "Woodford Reserve": "https://images.unsplash.com/photo-1609767307561-81b6b1af6b59?w=400&q=80",
    "Macallan 18 Sherry Oak": "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&q=80",
    "Blanton's Original": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&q=80",
  },
  blogHeroes: [
    "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800&q=80",
    "https://images.unsplash.com/photo-1609767307561-81b6b1af6b59?w=800&q=80",
    "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80",
    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80",
  ],
};

const createStore = () => {
  const defaultWhiskeys = [
    { id: 1, name: "Lagavulin 16", type: "Single Malt Scotch", region: "Islay", abv: "43%", price: "$85", description: "Rich, smoky peat with maritime salinity and a long, warming finish." },
    { id: 2, name: "Buffalo Trace", type: "Bourbon", region: "Kentucky", abv: "45%", price: "$30", description: "Caramel, vanilla and mint with a complex, smooth finish." },
    { id: 3, name: "Redbreast 12", type: "Single Pot Still", region: "Ireland", abv: "40%", price: "$65", description: "Sherry-influenced with dried fruit, spice and toasted wood." },
    { id: 4, name: "Yamazaki 12", type: "Japanese Whisky", region: "Japan", abv: "43%", price: "$160", description: "Peach, pineapple and ginger with Mizunara oak complexity." },
    { id: 5, name: "Ardbeg Uigeadail", type: "Single Malt Scotch", region: "Islay", abv: "54.2%", price: "$80", description: "Deep smoke, dark chocolate, espresso with sherry cask richness." },
    { id: 6, name: "Woodford Reserve", type: "Bourbon", region: "Kentucky", abv: "45.2%", price: "$38", description: "Rich dried fruit, vanilla, and toasted oak with a silky finish." },
    { id: 7, name: "Macallan 18 Sherry Oak", type: "Single Malt Scotch", region: "Speyside", abv: "43%", price: "$350", description: "Dried fruits, ginger, chocolate orange with exceptional depth." },
    { id: 8, name: "Blanton's Original", type: "Bourbon", region: "Kentucky", abv: "46.5%", price: "$65", description: "Citrus, caramel, vanilla with a dry, slightly nutty finish." },
  ];
  const defaultUsers = [
    { id: 1, username: "admin", email: "admin@noblepalatesociety.com", password: "admin123", isPro: true, isAdmin: true, displayName: "Master Distiller", avatar: "👑" },
    { id: 2, username: "james_whiskey", email: "james@nps.com", password: "pass123", isPro: true, isAdmin: false, displayName: "James Harrington", avatar: "🎩" },
    { id: 3, username: "sarah_malt", email: "sarah@nps.com", password: "pass123", isPro: true, isAdmin: false, displayName: "Sarah McAllister", avatar: "🌟" },
  ];
  const defaultReviews = [
    { id: 1, whiskey_id: 1, user_id: 2, aroma: 13, palate: 40, finish: 18, style: 9, value: 8, notes: "Exceptional peat smoke balanced with maritime salinity. The 16 years of aging bring remarkable depth.", date: "2026-03-15" },
    { id: 2, whiskey_id: 1, user_id: 3, aroma: 14, palate: 42, finish: 19, style: 9, value: 7, notes: "A benchmark for Islay single malts. Complex layers unfold with every sip.", date: "2026-03-14" },
    { id: 3, whiskey_id: 2, user_id: 2, aroma: 11, palate: 36, finish: 15, style: 7, value: 9, notes: "Outstanding value bourbon. Sweet caramel nose with surprising complexity.", date: "2026-03-12" },
    { id: 4, whiskey_id: 3, user_id: 3, aroma: 13, palate: 39, finish: 17, style: 8, value: 8, notes: "Pot still character shines through. The sherry influence adds wonderful dried fruit notes.", date: "2026-03-10" },
    { id: 5, whiskey_id: 4, user_id: 2, aroma: 14, palate: 41, finish: 18, style: 10, value: 6, notes: "Beautifully crafted Japanese whisky. Unique Mizunara oak character is captivating.", date: "2026-03-08" },
    { id: 6, whiskey_id: 5, user_id: 3, aroma: 14, palate: 43, finish: 19, style: 9, value: 8, notes: "A peat monster with heart. The sherry cask influence adds incredible richness.", date: "2026-03-05" },
    { id: 7, whiskey_id: 7, user_id: 2, aroma: 15, palate: 44, finish: 20, style: 10, value: 5, notes: "Simply extraordinary. Every sip reveals new layers of sherry-aged perfection.", date: "2026-03-01" },
    { id: 8, whiskey_id: 8, user_id: 3, aroma: 12, palate: 38, finish: 16, style: 8, value: 7, notes: "Iconic bourbon with great character. The horse stopper bottle is just the beginning.", date: "2026-02-28" },
  ];
  const defaultBlogPosts = [
    { id: 1, title: "Lagavulin 16: The King of Islay", excerpt: "Our panel revisits the legendary Lagavulin 16 and discovers why it remains the gold standard for peated Scotch whisky.", whiskey_id: 1, author_id: 2, date: "2026-03-15", content: "In the windswept shores of Islay, where the Atlantic meets ancient peat bogs, Lagavulin has been crafting liquid poetry since 1816. Our latest tasting session brought together our entire panel to revisit this iconic expression.\n\nThe nose opens with that signature Lagavulin peat smoke — not aggressive, but deeply layered. Beneath the smoke lies maritime salt, dried seaweed, and a sweetness reminiscent of burnt caramel.\n\nOn the palate, the 16 years of maturation have worked magic. The smoke plays second fiddle to waves of dried fruit, dark chocolate, and a savory meatiness that's almost umami-like.\n\nThe finish is where Lagavulin 16 truly earns its reputation — it seems to last forever, slowly fading from smoky sweetness to dry peat." },
    { id: 2, title: "Buffalo Trace: America's Best Value Bourbon?", excerpt: "We put Buffalo Trace through its paces to see if this affordable bourbon truly delivers on its legendary reputation.", whiskey_id: 2, author_id: 3, date: "2026-03-12", content: "In a market where bourbon prices continue to climb, Buffalo Trace stands as a beacon of accessibility. But does affordable mean compromised?\n\nAt roughly $30 a bottle, Buffalo Trace punches remarkably above its weight class. The nose greets you with classic bourbon notes — rich caramel, vanilla bean, and just a hint of fresh mint.\n\nThe palate delivers on the nose's promise. Brown sugar, oak tannins, and a touch of dark fruit create a balanced, medium-bodied experience.\n\nOur verdict? At this price point, Buffalo Trace isn't just good — it's exceptional." },
    { id: 3, title: "The Rise of Japanese Whisky: Yamazaki 12", excerpt: "Exploring the exquisite craftsmanship of Suntory's flagship single malt.", whiskey_id: 4, author_id: 2, date: "2026-03-08", content: "When Shinjiro Torii founded Suntory in 1923, he dreamed of creating a whisky that captured the essence of Japan. A century later, Yamazaki 12 fulfills that vision with remarkable grace.\n\nWhat sets Japanese whisky apart is its philosophy of harmony — wa — that permeates every step of production.\n\nThe Yamazaki 12 opens with elegant fruit — white peach, pineapple, and a whisper of strawberry. The Mizunara oak adds an exotic incense-like quality.\n\nOn the palate, it's silky smooth with layers of butterscotch, candied ginger, and delicate oak spice." },
    { id: 4, title: "Macallan 18 Sherry Oak: Worth the Splurge?", excerpt: "At $350 a bottle, the Macallan 18 needs to deliver an extraordinary experience.", whiskey_id: 7, author_id: 2, date: "2026-03-01", content: "The Macallan name carries weight in the whisky world like few others. Their 18 Year Old Sherry Oak sits at the pinnacle of accessible luxury.\n\nThe deep amber color speaks to years spent in sherry-seasoned oak casks from Jerez, Spain. The nose is intoxicating — dried fruits cascade into dark chocolate, orange peel, and old leather.\n\nThe palate is where the $350 begins to make sense. Layer upon layer of dried fig, ginger spice, wood smoke, and creamy toffee.\n\nIs it worth the splurge? Our panel was divided on value but unanimous on quality." },
  ];
  return { whiskeys: [...defaultWhiskeys], users: [...defaultUsers], reviews: [...defaultReviews], blogPosts: [...defaultBlogPosts], nextIds: { whiskey: 9, user: 4, review: 9, blog: 5 } };
};

let STORE = createStore();

const getScores = (wid) => {
  const revs = STORE.reviews.filter(r => r.whiskey_id === wid);
  const pro = revs.filter(r => STORE.users.find(u => u.id === r.user_id)?.isPro);
  const aud = revs.filter(r => !STORE.users.find(u => u.id === r.user_id)?.isPro);
  const avg = (a) => a.length === 0 ? null : Math.round(a.reduce((s, r) => s + r.aroma + r.palate + r.finish + r.style + r.value, 0) / a.length * 10) / 10;
  return { proScore: avg(pro), audienceScore: avg(aud), proReviews: pro, audienceReviews: aud, totalReviews: revs.length };
};
const scoreColor = (s) => s >= 90 ? "#c9a84c" : s >= 80 ? "#8fbc6a" : s >= 70 ? "#7b68c4" : s >= 60 ? "#cf8f5b" : "#cf5b5b";
const scoreLabel = (s) => s >= 95 ? "Masterpiece" : s >= 90 ? "Exceptional" : s >= 85 ? "Excellent" : s >= 80 ? "Very Good" : s >= 75 ? "Good" : s >= 70 ? "Above Average" : "Average";
const wImg = (n) => IMAGES.bottles[n] || IMAGES.bottles["Lagavulin 16"];

const CSS = `
:root{--bg0:#08070a;--bg1:#0e0d12;--bg2:#13121a;--bg3:#1a1924;--bg4:#16151e;--gold:#c9a84c;--goldL:#e0c872;--goldD:#a08030;--goldM:rgba(201,168,76,0.12);--purp:#7b5ea7;--purpL:#9b7ec7;--purpD:#5a3d86;--purpM:rgba(123,94,167,0.12);--purpG:rgba(123,94,167,0.25);--t1:#f0ece4;--t2:#9a9590;--t3:#5a5550;--brd:#252230;--brdL:#353240;--red:#c45c4a;--green:#6aab5c;--blue:#5a8fc4;--r:8px;--rl:16px;--tr:all .3s cubic-bezier(.4,0,.2,1)}
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
.nb:hover{color:var(--t1);background:var(--bg3)}
.nb.a{color:var(--gold);background:var(--goldM)}
.nb.cta{background:linear-gradient(135deg,var(--gold),var(--goldD));color:#0a0a0a;font-weight:600}
.nb.cta:hover{background:linear-gradient(135deg,var(--goldL),var(--gold))}
.nu{display:flex;align-items:center;gap:8px;padding:6px 14px 6px 8px;background:var(--bg3);border-radius:24px;border:1px solid var(--brd);cursor:pointer;transition:var(--tr);font-size:13px;color:var(--t1)}
.nu:hover{border-color:var(--goldD)}
.na{width:32px;height:32px;border-radius:50%;background:var(--purpM);display:flex;align-items:center;justify-content:center;font-size:16px}
.mt{display:none;background:none;border:none;color:var(--t1);font-size:24px;cursor:pointer}
@media(max-width:768px){.mt{display:block}.nv{display:none;position:absolute;top:72px;left:0;right:0;background:var(--bg1);border-bottom:1px solid var(--brd);flex-direction:column;padding:16px;gap:4px;z-index:100}.nv.open{display:flex}.nb{width:100%;text-align:left;padding:12px 16px}.Hl img{height:40px}.Hlt{display:none}}

.pg{max-width:1240px;margin:0 auto;padding:32px 24px 80px}

.hero{position:relative;overflow:hidden;padding:100px 24px 80px;text-align:center;min-height:580px;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hero-bg{position:absolute;inset:0;z-index:0;background-image:url('${IMAGES.hero}');background-size:cover;background-position:center;filter:brightness(.18) saturate(.5)}
.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,7,10,.3) 0%,rgba(8,7,10,.6) 50%,var(--bg0) 100%),radial-gradient(ellipse at 50% 30%,rgba(123,94,167,.15) 0%,transparent 60%),radial-gradient(ellipse at 50% 70%,rgba(201,168,76,.1) 0%,transparent 50%)}
.hero-c{position:relative;z-index:1;max-width:800px}
.hero-logo{width:180px;height:auto;margin:0 auto 28px;display:block;filter:drop-shadow(0 0 20px rgba(201,168,76,.4));animation:fis 1s ease both}
.hero-m{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:500;letter-spacing:5px;text-transform:uppercase;color:var(--purpL);margin-bottom:20px;animation:fiu .8s ease .2s both}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(34px,5.5vw,60px);font-weight:700;line-height:1.1;margin-bottom:20px;animation:fiu .8s ease .3s both}
.hero h1 em{font-style:italic;color:var(--gold)}
.hero h1 .pu{color:var(--purpL)}
.hero p{font-family:'Cormorant Garamond',serif;font-size:clamp(17px,2.2vw,21px);color:var(--t2);max-width:560px;margin:0 auto 36px;line-height:1.7;animation:fiu .8s ease .4s both}
.hero-act{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;animation:fiu .8s ease .5s both}
.hero-st{display:flex;gap:48px;justify-content:center;margin-top:56px;animation:fiu .8s ease .6s both}
.hs{text-align:center}
.hs-n{font-family:'Playfair Display',serif;font-size:36px;font-weight:700;color:var(--gold)}
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
.btn-pu:hover{box-shadow:0 4px 20px var(--purpG)}

.sh{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px}
.sh h2{font-family:'Playfair Display',serif;font-size:32px;font-weight:600}
.sh p{color:var(--t2);font-size:15px;margin-top:4px}
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
.sl{font-size:9px;font-weight:700;letter-spacing:1px}
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
.bca{width:28px;height:28px;border-radius:50%;background:var(--purpM);display:flex;align-items:center;justify-content:center;font-size:14px}
.bcn{font-size:13px;color:var(--t2)}

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
.scl.pro{color:var(--gold)}
.scl.aud{color:var(--purpL)}
.scn{font-family:'Playfair Display',serif;font-size:56px;font-weight:700;line-height:1;margin-bottom:4px}
.scd{font-size:14px;color:var(--t2)}
.scc{font-size:12px;color:var(--t3);margin-top:8px}

.pr{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);padding:24px;margin-bottom:16px;position:relative;overflow:hidden}
.pr::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--gold),transparent)}
.pr.au::before{background:linear-gradient(180deg,var(--purp),transparent)}
.prh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}
.prr{display:flex;align-items:center;gap:12px}
.pra{width:48px;height:48px;border-radius:50%;background:var(--goldM);border:2px solid var(--goldD);display:flex;align-items:center;justify-content:center;font-size:22px}
.pra.au{background:var(--purpM);border-color:var(--purpD)}
.prn{font-family:'Playfair Display',serif;font-size:16px;font-weight:600}
.pb{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);background:var(--goldM);padding:3px 8px;border-radius:4px;border:1px solid rgba(201,168,76,.2)}
.prs{font-family:'Playfair Display',serif;font-size:36px;font-weight:700}
.prs span{font-size:16px;color:var(--t3);font-weight:400}
.bd{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
@media(max-width:600px){.bd{grid-template-columns:repeat(3,1fr)}}
.bdi{background:var(--bg3);border-radius:8px;padding:10px;text-align:center}
.bdl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.5px}
.bds{font-size:18px;font-weight:600;margin-top:2px}
.bdm{font-size:10px;color:var(--t3)}
.rn{font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.6;color:var(--t2);font-style:italic;border-left:2px solid var(--purpD);padding-left:16px}

.rf{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);padding:32px}
.rf h3{font-family:'Playfair Display',serif;font-size:24px;margin-bottom:24px}
.fg{margin-bottom:20px}
.fl{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;font-weight:500;margin-bottom:8px}
.flm{font-size:12px;color:var(--t3)}
.sr{display:flex;align-items:center;gap:16px}
.sli{flex:1;-webkit-appearance:none;appearance:none;height:6px;border-radius:3px;background:var(--bg3);outline:none}
.sli::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--goldD));cursor:pointer;border:2px solid var(--bg0);box-shadow:0 0 0 2px var(--goldD),0 0 12px rgba(201,168,76,.3)}
.sv{min-width:36px;text-align:center;font-size:18px;font-weight:600;color:var(--gold)}
.ta{width:100%;min-height:100px;padding:14px;background:var(--bg4);border:1px solid var(--brd);border-radius:var(--r);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;resize:vertical;outline:none;transition:var(--tr)}
.ta:focus{border-color:var(--purp);box-shadow:0 0 0 3px var(--purpG)}
.ft{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:var(--bg3);border-radius:var(--r);margin-bottom:20px;border:1px solid var(--brd)}
.ftl{font-size:16px;font-weight:500}
.fts{font-family:'Playfair Display',serif;font-size:28px;font-weight:700}
.fts span{font-size:14px;color:var(--t3);font-weight:400}

.au{max-width:420px;margin:60px auto}
.ac{background:var(--bg2);border:1px solid var(--brd);border-radius:var(--rl);padding:40px;position:relative;overflow:hidden}
.ac::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--purp),var(--gold))}
.ac h2{font-family:'Playfair Display',serif;font-size:28px;text-align:center;margin-bottom:8px}
.ac>p{text-align:center;color:var(--t2);font-size:14px;margin-bottom:28px}
.alo{width:80px;height:auto;display:block;margin:0 auto 20px;filter:drop-shadow(0 0 12px rgba(201,168,76,.3))}
.inp{width:100%;padding:12px 14px;background:var(--bg4);border:1px solid var(--brd);border-radius:var(--r);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:var(--tr)}
.inp:focus{border-color:var(--purp);box-shadow:0 0 0 3px var(--purpG)}
.il{display:block;font-size:13px;font-weight:500;margin-bottom:6px;color:var(--t2)}
.aft{text-align:center;margin-top:20px;font-size:14px;color:var(--t2)}
.aft button{background:none;border:none;color:var(--gold);cursor:pointer;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600}
.aft button:hover{color:var(--goldL)}
.err{background:rgba(196,92,74,.1);border:1px solid rgba(196,92,74,.3);border-radius:var(--r);padding:10px 14px;font-size:13px;color:var(--red);margin-bottom:16px}
.suc{background:rgba(106,171,92,.1);border:1px solid rgba(106,171,92,.3);border-radius:var(--r);padding:10px 14px;font-size:13px;color:var(--green);margin-bottom:16px}

.at{width:100%;border-collapse:collapse;background:var(--bg2);border-radius:var(--rl);overflow:hidden;border:1px solid var(--brd)}
.at th{text-align:left;padding:14px 16px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--purpL);background:var(--bg3);border-bottom:1px solid var(--brd)}
.at td{padding:14px 16px;font-size:14px;border-bottom:1px solid var(--brd)}
.at tr:last-child td{border-bottom:none}
.at tr:hover td{background:rgba(123,94,167,.04)}
.tog{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:var(--tr)}
.tog.on{background:linear-gradient(135deg,var(--gold),var(--goldD))}
.tog.off{background:var(--bg3);border:1px solid var(--brd)}
.tog::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:white;top:3px;transition:var(--tr)}
.tog.on::after{left:23px}
.tog.off::after{left:3px}

.sbar{display:flex;gap:10px;margin-bottom:32px;flex-wrap:wrap}
.sinp{flex:1;min-width:200px;padding:12px 16px;background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:var(--tr)}
.sinp:focus{border-color:var(--purp);box-shadow:0 0 0 3px var(--purpG)}
.fb{padding:10px 16px;background:var(--bg2);border:1px solid var(--brd);border-radius:var(--r);color:var(--t2);font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:var(--tr)}
.fb:hover,.fb.a{border-color:var(--purp);color:var(--purpL);background:var(--purpM)}

.tabs{display:flex;gap:4px;border-bottom:1px solid var(--brd);margin-bottom:32px}
.tab{padding:12px 20px;background:none;border:none;color:var(--t2);font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;transition:var(--tr)}
.tab:hover{color:var(--t1)}
.tab.a{color:var(--gold);border-bottom-color:var(--gold)}

.em{text-align:center;padding:60px 24px;color:var(--t3)}
.emi{font-size:48px;margin-bottom:16px;opacity:.4}
.em h3{font-family:'Playfair Display',serif;font-size:20px;color:var(--t2);margin-bottom:8px}

.um{position:absolute;top:48px;right:0;background:var(--bg3);border:1px solid var(--brd);border-radius:var(--r);padding:8px;min-width:180px;box-shadow:0 8px 48px rgba(0,0,0,.7);z-index:200}
.umb{width:100%;text-align:left;padding:10px 14px;background:none;border:none;color:var(--t2);font-family:'Outfit',sans-serif;font-size:13px;cursor:pointer;border-radius:4px;transition:var(--tr)}
.umb:hover{background:var(--purpM);color:var(--purpL)}
.umd{height:1px;background:var(--brd);margin:4px 0}
.sel{padding:12px 14px;background:var(--bg4);border:1px solid var(--brd);border-radius:var(--r);color:var(--t1);font-family:'Outfit',sans-serif;font-size:14px;outline:none;width:100%}
.tw{overflow-x:auto;border-radius:var(--rl)}

.ftr{border-top:1px solid var(--brd);padding:48px 24px;text-align:center;position:relative}
.ftr::before{content:'';position:absolute;top:-1px;left:50%;transform:translateX(-50%);width:200px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.ftr img{width:60px;margin:0 auto 12px;display:block;filter:drop-shadow(0 0 8px rgba(201,168,76,.2))}
.ftr-b{font-family:'Playfair Display',serif;font-size:16px;color:var(--gold);margin-bottom:4px}
.ftr-m{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--purpL);font-style:italic;margin-bottom:8px;letter-spacing:1px}
.ftr p{font-size:12px;color:var(--t3)}
.demo{margin-top:24px;padding:16px;background:var(--bg3);border-radius:var(--r);border:1px solid var(--brd);font-size:12px;color:var(--t3)}
.demo strong{color:var(--purpL);font-size:11px;letter-spacing:1px;text-transform:uppercase}
`;

const Header = ({ user, page, setPage, onLogout }) => {
  const [mob, setMob] = useState(false);
  const [um, setUm] = useState(false);
  const go = (p) => { setPage(p); setMob(false); setUm(false); };
  return (
    <header className="H"><div className="Hi">
      <div className="Hl" onClick={() => go("home")}><img src={LOGO_URL} alt="NPS" /><div className="Hlt"><div className="Hln">Noble<span>Palate</span></div><div className="Hls">Society</div></div></div>
      <button className="mt" onClick={() => setMob(!mob)}>{mob ? "✕" : "☰"}</button>
      <nav className={`nv ${mob ? "open" : ""}`}>
        {["home","database","blog"].map(p => <button key={p} className={`nb ${page===p?"a":""}`} onClick={() => go(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}
        {user?.isAdmin && <button className={`nb ${page==="admin"?"a":""}`} onClick={() => go("admin")}>Admin</button>}
        {user ? (
          <div style={{position:'relative'}}>
            <div className="nu" onClick={() => setUm(!um)}><div className="na">{user.avatar}</div><span>{user.displayName}</span>{user.isPro && <span className="pb">PRO</span>}</div>
            {um && <div className="um"><button className="umb" onClick={() => go("profile")}>My Profile</button><div className="umd"/><button className="umb" onClick={() => {onLogout();setUm(false);}}>Sign Out</button></div>}
          </div>
        ) : <button className="nb cta" onClick={() => go("login")}>Sign In</button>}
      </nav>
    </div></header>
  );
};

const Home = ({ setPage, setSW, setSB }) => {
  const top = STORE.whiskeys.slice(0,4).map(w => ({...w, scores: getScores(w.id)}));
  const posts = STORE.blogPosts.slice(0,3);
  return (<div>
    <div className="hero"><div className="hero-bg"/><div className="hero-c">
      <img src={LOGO_URL} alt="Noble Palate Society" className="hero-logo"/>
      <div className="hero-m">Sapientia Per Sensus</div>
      <h1>The Art of <em>Whiskey</em>,<br/><span className="pu">Elevated</span></h1>
      <p>Expert reviews, curated tastings, and a community of connoisseurs dedicated to discovering the world's finest spirits.</p>
      <div className="hero-act"><button className="btn btn-p" onClick={() => setPage("database")}>Explore Database</button><button className="btn btn-s" onClick={() => setPage("blog")}>Read the Blog</button></div>
      <div className="hero-st"><div className="hs"><div className="hs-n">{STORE.whiskeys.length}</div><div className="hs-l">Whiskeys</div></div><div className="hs"><div className="hs-n">{STORE.reviews.length}</div><div className="hs-l">Reviews</div></div><div className="hs"><div className="hs-n">{STORE.users.filter(u=>u.isPro).length}</div><div className="hs-l">Pro Reviewers</div></div></div>
    </div></div>
    <div className="pg">
      <div className="sd"><span>Featured Whiskeys</span></div>
      <div className="sh"><div><h2>Our Top Picks</h2><p>Latest expert-reviewed selections</p></div><button className="btn btn-s btn-sm" onClick={() => setPage("database")}>View All →</button></div>
      <div className="wg">{top.map((w,i) => (
        <div key={w.id} className="cd wc anim" style={{animationDelay:`${i*.08}s`}} onClick={() => {setSW(w.id);setPage("detail");}}>
          <div className="wci" style={{backgroundImage:`url(${wImg(w.name)})`}}><div className="wcs">
            {w.scores.proScore && <div className="sb sp"><span className="sl">PRO</span> {w.scores.proScore}</div>}
            {w.scores.audienceScore && <div className="sb sa"><span className="sl">AUD</span> {w.scores.audienceScore}</div>}
          </div></div>
          <div className="wcb"><h3>{w.name}</h3><div className="wm"><span className="tg">{w.type}</span><span className="tg">{w.region}</span><span className="tg">{w.abv}</span></div><p>{w.description}</p></div>
        </div>
      ))}</div>
      <div style={{marginTop:72}}>
        <div className="sd"><span>From the Blog</span></div>
        <div className="sh"><div><h2>Latest Reviews</h2><p>Deep dives, tasting notes, and whiskey culture</p></div><button className="btn btn-s btn-sm" onClick={() => setPage("blog")}>All Posts →</button></div>
        <div className="bg">{posts.map((p,i) => {const a=STORE.users.find(u=>u.id===p.author_id);return(
          <div key={p.id} className="cd bc anim" style={{animationDelay:`${i*.08}s`}} onClick={() => {setSB(p.id);setPage("blogdet");}}>
            <div className="bci" style={{backgroundImage:`url(${IMAGES.blogHeroes[i%4]})`}}/>
            <div className="bcb"><div className="bcd">{new Date(p.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div><h3>{p.title}</h3><p>{p.excerpt}</p></div>
            <div className="bcf"><div className="bca">{a?.avatar}</div><span className="bcn">{a?.displayName}</span>{a?.isPro && <span className="pb" style={{marginLeft:'auto'}}>PRO</span>}</div>
          </div>
        );})}</div>
      </div>
    </div>
  </div>);
};

const Database = ({ setPage, setSW }) => {
  const [q,setQ]=useState("");const [tf,setTf]=useState("all");
  const types = useMemo(()=>[...new Set(STORE.whiskeys.map(w=>w.type))],[]);
  const fil = useMemo(()=>STORE.whiskeys.filter(w=>{const m=w.name.toLowerCase().includes(q.toLowerCase())||w.type.toLowerCase().includes(q.toLowerCase())||w.region.toLowerCase().includes(q.toLowerCase());return m&&(tf==="all"||w.type===tf);}).map(w=>({...w,scores:getScores(w.id)})),[q,tf]);
  return(<div className="pg">
    <div className="sd"><span>Whiskey Database</span></div>
    <div className="sh"><div><h2>All Whiskeys</h2><p>{STORE.whiskeys.length} whiskeys reviewed</p></div></div>
    <div className="sbar"><input className="sinp" placeholder="Search by name, type, or region..." value={q} onChange={e=>setQ(e.target.value)}/><button className={`fb ${tf==="all"?"a":""}`} onClick={()=>setTf("all")}>All</button>{types.map(t=><button key={t} className={`fb ${tf===t?"a":""}`} onClick={()=>setTf(t)}>{t}</button>)}</div>
    <div className="wg">{fil.map((w,i)=>(
      <div key={w.id} className="cd wc anim" style={{animationDelay:`${i*.04}s`}} onClick={()=>{setSW(w.id);setPage("detail");}}>
        <div className="wci" style={{backgroundImage:`url(${wImg(w.name)})`}}><div className="wcs">
          {w.scores.proScore!==null&&<div className="sb sp"><span className="sl">PRO</span> {w.scores.proScore}</div>}
          {w.scores.audienceScore!==null&&<div className="sb sa"><span className="sl">AUD</span> {w.scores.audienceScore}</div>}
          {!w.scores.proScore&&!w.scores.audienceScore&&<div className="sb" style={{background:'rgba(255,255,255,.08)',color:'var(--t3)',border:'1px solid var(--brd)'}}>Unreviewed</div>}
        </div></div>
        <div className="wcb"><h3>{w.name}</h3><div className="wm"><span className="tg">{w.type}</span><span className="tg">{w.region}</span><span className="tg">{w.abv}</span><span className="tg">{w.price}</span></div><p>{w.description}</p></div>
      </div>
    ))}</div>
    {fil.length===0&&<div className="em"><div className="emi">🔍</div><h3>No whiskeys found</h3><p>Try adjusting your search</p></div>}
  </div>);
};

const Detail = ({ wid, user, setPage, refresh }) => {
  const w=STORE.whiskeys.find(x=>x.id===wid);const sc=getScores(wid);
  const [tab,setTab]=useState("pro");const [sf,setSf]=useState(false);
  const [form,setForm]=useState({aroma:10,palate:30,finish:14,style:7,value:7,notes:""});const [msg,setMsg]=useState(null);
  if(!w)return<div className="pg"><div className="em"><h3>Not found</h3></div></div>;
  const total=form.aroma+form.palate+form.finish+form.style+form.value;
  const ex=user?STORE.reviews.find(r=>r.whiskey_id===wid&&r.user_id===user.id):null;
  const submit=()=>{if(!user)return;STORE.reviews.push({id:STORE.nextIds.review++,whiskey_id:wid,user_id:user.id,...form,date:new Date().toISOString().split('T')[0]});setMsg("Review submitted!");setSf(false);setForm({aroma:10,palate:30,finish:14,style:7,value:7,notes:""});refresh();setTimeout(()=>setMsg(null),3000);};
  const RC=({review,isPro})=>{const rv=STORE.users.find(u=>u.id===review.user_id);const t=review.aroma+review.palate+review.finish+review.style+review.value;return(
    <div className={`pr ${isPro?'':'au'}`}><div className="prh"><div className="prr"><div className={`pra ${isPro?'':'au'}`}>{rv?.avatar||"👤"}</div><div><div className="prn">{rv?.displayName}</div>{isPro?<span className="pb">NPS Pro Reviewer</span>:<span style={{fontSize:11,color:'var(--t3)'}}>{review.date}</span>}</div></div><div className="prs" style={{color:scoreColor(t)}}>{t}<span>/100</span></div></div>
    <div className="bd">{[["Aroma",review.aroma,15],["Palate",review.palate,45],["Finish",review.finish,20],["Style",review.style,10],["Value",review.value,10]].map(([l,v,m])=><div className="bdi" key={l}><div className="bdl">{l}</div><div className="bds">{v}</div><div className="bdm">/{m}</div></div>)}</div>
    {review.notes&&<div className="rn">"{review.notes}"</div>}</div>
  );};
  return(<div className="pg">
    <button className="btn btn-s btn-sm" onClick={()=>setPage("database")} style={{marginBottom:24}}>← Back to Database</button>
    {msg&&<div className="suc">{msg}</div>}
    <div className="dh anim"><div className="di" style={{backgroundImage:`url(${wImg(w.name)})`}}/><div className="df"><h1>{w.name}</h1><div className="dm">{[["Type",w.type],["Region",w.region],["ABV",w.abv],["Price",w.price]].map(([l,v])=><div className="dmi" key={l}><span className="dml">{l}</span><span className="dmv">{v}</span></div>)}</div><p>{w.description}</p></div></div>
    <div className="scp anim"><div className="sc pro"><div className="scl pro">NPS Pro Score</div><div className="scn" style={{color:sc.proScore?scoreColor(sc.proScore):'var(--t3)'}}>{sc.proScore??"—"}</div><div className="scd">{sc.proScore?scoreLabel(sc.proScore):"Not yet reviewed"}</div><div className="scc">{sc.proReviews.length} pro review{sc.proReviews.length!==1?'s':''}</div></div><div className="sc aud"><div className="scl aud">Audience Score</div><div className="scn" style={{color:sc.audienceScore?scoreColor(sc.audienceScore):'var(--t3)'}}>{sc.audienceScore??"—"}</div><div className="scd">{sc.audienceScore?scoreLabel(sc.audienceScore):"No audience reviews"}</div><div className="scc">{sc.audienceReviews.length} audience review{sc.audienceReviews.length!==1?'s':''}</div></div></div>
    <div className="tabs"><button className={`tab ${tab==="pro"?"a":""}`} onClick={()=>setTab("pro")}>Pro Reviews ({sc.proReviews.length})</button><button className={`tab ${tab==="audience"?"a":""}`} onClick={()=>setTab("audience")}>Audience ({sc.audienceReviews.length})</button></div>
    {tab==="pro"&&(sc.proReviews.length===0?<div className="em"><div className="emi">🎩</div><h3>No pro reviews yet</h3></div>:sc.proReviews.map(r=><RC key={r.id} review={r} isPro/>))}
    {tab==="audience"&&(sc.audienceReviews.length===0?<div className="em"><div className="emi">👥</div><h3>No audience reviews yet</h3><p>Be the first!</p></div>:sc.audienceReviews.map(r=><RC key={r.id} review={r} isPro={false}/>))}
    {user&&!ex&&(<div style={{marginTop:32}}>{!sf?<button className="btn btn-p" onClick={()=>setSf(true)}>Write a Review</button>:(
      <div className="rf anim"><h3>Your Review of {w.name}</h3>{user.isPro&&<div style={{marginBottom:16}}><span className="pb">Reviewing as NPS Pro</span></div>}
      {[["Aroma","aroma",15],["Palate","palate",45],["Finish","finish",20],["Style / Uniqueness","style",10],["Value","value",10]].map(([l,k,m])=><div className="fg" key={k}><div className="fl"><span>{l}</span><span className="flm">Max: {m}</span></div><div className="sr"><input type="range" className="sli" min={0} max={m} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:+e.target.value}))}/><div className="sv">{form[k]}</div></div></div>)}
      <div className="fg"><div className="fl"><span>Tasting Notes</span></div><textarea className="ta" placeholder="Share your thoughts..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
      <div className="ft"><div className="ftl">Total Score</div><div className="fts" style={{color:scoreColor(total)}}>{total}<span>/100</span></div></div>
      <div style={{display:'flex',gap:12}}><button className="btn btn-p" onClick={submit}>Submit Review</button><button className="btn btn-s" onClick={()=>setSf(false)}>Cancel</button></div></div>
    )}</div>)}
    {user&&ex&&<div style={{marginTop:32,padding:16,background:'var(--bg2)',borderRadius:'var(--r)',border:'1px solid var(--brd)'}}><p style={{fontSize:14,color:'var(--t2)'}}>✓ Already reviewed (Score: {ex.aroma+ex.palate+ex.finish+ex.style+ex.value}/100)</p></div>}
    {!user&&<div style={{marginTop:32,padding:24,background:'var(--bg2)',borderRadius:'var(--rl)',border:'1px solid var(--brd)',textAlign:'center'}}><p style={{fontSize:15,color:'var(--t2)',marginBottom:12}}>Sign in to write a review</p><button className="btn btn-pu btn-sm" onClick={()=>setPage("login")}>Sign In</button></div>}
  </div>);
};

const Blog = ({ setPage, setSB }) => (
  <div className="pg"><div className="sd"><span>The Blog</span></div><div className="sh"><div><h2>Reviews & Stories</h2><p>Expert reviews, tasting notes, and whiskey culture</p></div></div>
  <div className="bg">{STORE.blogPosts.map((p,i)=>{const a=STORE.users.find(u=>u.id===p.author_id);return(
    <div key={p.id} className="cd bc anim" style={{animationDelay:`${i*.06}s`}} onClick={()=>{setSB(p.id);setPage("blogdet");}}>
      <div className="bci" style={{backgroundImage:`url(${IMAGES.blogHeroes[i%4]})`}}/>
      <div className="bcb"><div className="bcd">{new Date(p.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div><h3>{p.title}</h3><p>{p.excerpt}</p></div>
      <div className="bcf"><div className="bca">{a?.avatar}</div><span className="bcn">{a?.displayName}</span>{a?.isPro&&<span className="pb" style={{marginLeft:'auto'}}>PRO</span>}</div>
    </div>
  );})}</div></div>
);

const BlogDet = ({ bid, setPage, setSW }) => {
  const p=STORE.blogPosts.find(x=>x.id===bid);if(!p)return<div className="pg"><div className="em"><h3>Not found</h3></div></div>;
  const a=STORE.users.find(u=>u.id===p.author_id);const w=STORE.whiskeys.find(x=>x.id===p.whiskey_id);const sc=w?getScores(w.id):null;
  return(<div className="pg"><div style={{maxWidth:720,margin:'0 auto'}} className="anim">
    <button className="btn btn-s btn-sm" onClick={()=>setPage("blog")} style={{marginBottom:32}}>← Back to Blog</button>
    <div className="bcd" style={{fontSize:12,marginBottom:12}}>{new Date(p.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
    <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,4vw,40px)',fontWeight:700,marginBottom:16,lineHeight:1.2}}>{p.title}</h1>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:32,paddingBottom:32,borderBottom:'1px solid var(--brd)'}}>
      <div className="bca" style={{width:40,height:40,fontSize:20}}>{a?.avatar}</div>
      <div><div style={{fontSize:15,fontWeight:500}}>{a?.displayName}</div><span className="pb">NPS Pro</span></div>
    </div>
    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,lineHeight:1.9,color:'var(--t2)',whiteSpace:'pre-line'}}>{p.content}</div>
    {w&&<div style={{marginTop:40,padding:24,background:'var(--bg2)',border:'1px solid var(--brd)',borderRadius:'var(--rl)'}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'var(--purpL)',marginBottom:12}}>Featured Whiskey</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:56,height:56,borderRadius:8,backgroundImage:`url(${wImg(w.name)})`,backgroundSize:'cover',backgroundPosition:'center'}}/>
          <div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4}}>{w.name}</h3><span className="tg">{w.type}</span>{' '}<span className="tg">{w.region}</span></div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {sc?.proScore&&<div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:scoreColor(sc.proScore)}}>{sc.proScore}</div>}
          <button className="btn btn-s btn-sm" onClick={()=>{setSW(w.id);setPage("detail");}}>View Review →</button>
        </div>
      </div>
    </div>}
  </div></div>);
};

const Login = ({ setPage, onLogin }) => {
  const [un,setUn]=useState("");const [pw,setPw]=useState("");const [err,setErr]=useState("");
  const go=()=>{const u=STORE.users.find(x=>(x.username===un||x.email===un)&&x.password===pw);if(u){onLogin(u);setPage("home");}else setErr("Invalid credentials");};
  return(<div className="au anim"><div className="ac"><img src={LOGO_URL} alt="NPS" className="alo"/>
    <h2>Welcome Back</h2><p>Sign in to Noble Palate Society</p>{err&&<div className="err">{err}</div>}
    <div className="fg"><label className="il">Username or Email</label><input className="inp" value={un} onChange={e=>{setUn(e.target.value);setErr("");}} placeholder="Enter username or email" onKeyDown={e=>e.key==='Enter'&&go()}/></div>
    <div className="fg"><label className="il">Password</label><input className="inp" type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} placeholder="Enter password" onKeyDown={e=>e.key==='Enter'&&go()}/></div>
    <button className="btn btn-p" style={{width:'100%',justifyContent:'center'}} onClick={go}>Sign In</button>
    <div className="aft">Don't have an account? <button onClick={()=>setPage("signup")}>Sign Up</button></div>
    <div className="demo"><strong>Demo Accounts</strong><br/><br/>Admin: admin / admin123<br/>Pro: james_whiskey / pass123<br/>Pro: sarah_malt / pass123</div>
  </div></div>);
};

const Signup = ({ setPage, onLogin }) => {
  const [f,setF]=useState({username:"",email:"",password:"",confirmPassword:"",displayName:""});const [err,setErr]=useState("");
  const go=()=>{if(!f.username||!f.email||!f.password||!f.displayName){setErr("All fields required");return;}if(f.password!==f.confirmPassword){setErr("Passwords don't match");return;}if(f.password.length<6){setErr("Password must be 6+ chars");return;}if(STORE.users.find(u=>u.username===f.username)){setErr("Username taken");return;}if(STORE.users.find(u=>u.email===f.email)){setErr("Email registered");return;}const nu={id:STORE.nextIds.user++,...f,isPro:false,isAdmin:false,avatar:"👤"};STORE.users.push(nu);onLogin(nu);setPage("home");};
  return(<div className="au anim"><div className="ac"><img src={LOGO_URL} alt="NPS" className="alo"/>
    <h2>Join the Society</h2><p>Create your account to start reviewing</p>{err&&<div className="err">{err}</div>}
    {[["Display Name","displayName","text","Your name"],["Username","username","text","Choose username"],["Email","email","email","your@email.com"],["Password","password","password","Min 6 characters"],["Confirm Password","confirmPassword","password","Confirm"]].map(([l,k,t,ph])=>
      <div className="fg" key={k}><label className="il">{l}</label><input className="inp" type={t} value={f[k]} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} placeholder={ph} onKeyDown={e=>e.key==='Enter'&&k==='confirmPassword'&&go()}/></div>
    )}
    <button className="btn btn-p" style={{width:'100%',justifyContent:'center'}} onClick={go}>Create Account</button>
    <div className="aft">Already a member? <button onClick={()=>setPage("login")}>Sign In</button></div>
  </div></div>);
};

const Admin = ({ user, refresh }) => {
  const [tab,setTab]=useState("users");const [msg,setMsg]=useState(null);const [addW,setAddW]=useState(false);
  const [wf,setWf]=useState({name:"",type:"Bourbon",region:"",abv:"",price:"",description:""});
  if(!user?.isAdmin)return<div className="pg"><div className="em"><div className="emi">🔒</div><h3>Admin access required</h3></div></div>;
  const togglePro=(uid)=>{const u=STORE.users.find(x=>x.id===uid);if(u&&!u.isAdmin){u.isPro=!u.isPro;setMsg(`${u.displayName} → ${u.isPro?'PRO':'Member'}`);refresh();setTimeout(()=>setMsg(null),3000);}};
  const addWhiskey=()=>{if(!wf.name||!wf.region){setMsg("Name & region required");return;}STORE.whiskeys.push({id:STORE.nextIds.whiskey++,...wf});setAddW(false);setWf({name:"",type:"Bourbon",region:"",abv:"",price:"",description:""});setMsg("Whiskey added!");refresh();setTimeout(()=>setMsg(null),3000);};
  return(<div className="pg">
    <div className="sd"><span>Administration</span></div>
    <div className="sh"><div><h2>Admin Panel</h2><p>Manage users, whiskeys, and content</p></div></div>
    {msg&&<div className="suc">{msg}</div>}
    <div className="tabs"><button className={`tab ${tab==="users"?"a":""}`} onClick={()=>setTab("users")}>Users ({STORE.users.length})</button><button className={`tab ${tab==="whiskeys"?"a":""}`} onClick={()=>setTab("whiskeys")}>Whiskeys ({STORE.whiskeys.length})</button><button className={`tab ${tab==="reviews"?"a":""}`} onClick={()=>setTab("reviews")}>Reviews ({STORE.reviews.length})</button></div>
    {tab==="users"&&<div className="tw"><table className="at"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Pro Status</th><th>Reviews</th></tr></thead><tbody>
      {STORE.users.map(u=><tr key={u.id}><td><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:20}}>{u.avatar}</span><div><div style={{fontWeight:500}}>{u.displayName}</div><div style={{fontSize:12,color:'var(--t3)'}}>@{u.username}</div></div></div></td><td style={{color:'var(--t2)'}}>{u.email}</td><td>{u.isAdmin?<span style={{fontSize:10,fontWeight:700,color:'var(--red)',background:'rgba(196,92,74,.1)',padding:'3px 8px',borderRadius:4}}>ADMIN</span>:u.isPro?<span className="pb">PRO</span>:<span style={{fontSize:11,color:'var(--t3)'}}>Member</span>}</td><td>{!u.isAdmin&&<button className={`tog ${u.isPro?'on':'off'}`} onClick={()=>togglePro(u.id)}/>}</td><td>{STORE.reviews.filter(r=>r.user_id===u.id).length}</td></tr>)}
    </tbody></table></div>}
    {tab==="whiskeys"&&<div>
      <div style={{marginBottom:20}}><button className="btn btn-pu btn-sm" onClick={()=>setAddW(!addW)}>{addW?"Cancel":"+ Add Whiskey"}</button></div>
      {addW&&<div className="rf anim" style={{marginBottom:24}}><h3>Add New Whiskey</h3><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="fg"><label className="il">Name *</label><input className="inp" value={wf.name} onChange={e=>setWf(f=>({...f,name:e.target.value}))} placeholder="e.g. Glenfiddich 18"/></div>
        <div className="fg"><label className="il">Type</label><select className="sel" value={wf.type} onChange={e=>setWf(f=>({...f,type:e.target.value}))}>{["Bourbon","Single Malt Scotch","Single Pot Still","Japanese Whisky","Rye","Blended Scotch","Irish Whiskey","Canadian Whisky"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="fg"><label className="il">Region *</label><input className="inp" value={wf.region} onChange={e=>setWf(f=>({...f,region:e.target.value}))} placeholder="e.g. Speyside"/></div>
        <div className="fg"><label className="il">ABV</label><input className="inp" value={wf.abv} onChange={e=>setWf(f=>({...f,abv:e.target.value}))} placeholder="e.g. 43%"/></div>
        <div className="fg"><label className="il">Price</label><input className="inp" value={wf.price} onChange={e=>setWf(f=>({...f,price:e.target.value}))} placeholder="e.g. $120"/></div>
      </div><div className="fg"><label className="il">Description</label><textarea className="ta" value={wf.description} onChange={e=>setWf(f=>({...f,description:e.target.value}))} placeholder="Tasting notes..."/></div><button className="btn btn-p" onClick={addWhiskey}>Add Whiskey</button></div>}
      <div className="tw"><table className="at"><thead><tr><th>Whiskey</th><th>Type</th><th>Region</th><th>Pro</th><th>Audience</th><th>Reviews</th></tr></thead><tbody>
        {STORE.whiskeys.map(w=>{const s=getScores(w.id);return<tr key={w.id}><td style={{fontWeight:500}}>{w.name}</td><td style={{color:'var(--t2)'}}>{w.type}</td><td style={{color:'var(--t2)'}}>{w.region}</td><td><span style={{color:s.proScore?scoreColor(s.proScore):'var(--t3)',fontWeight:600}}>{s.proScore??"—"}</span></td><td><span style={{color:s.audienceScore?scoreColor(s.audienceScore):'var(--t3)',fontWeight:600}}>{s.audienceScore??"—"}</span></td><td>{s.totalReviews}</td></tr>;})}
      </tbody></table></div>
    </div>}
    {tab==="reviews"&&<div className="tw"><table className="at"><thead><tr><th>Reviewer</th><th>Whiskey</th><th>Score</th><th>Type</th><th>Date</th></tr></thead><tbody>
      {[...STORE.reviews].reverse().map(r=>{const u=STORE.users.find(x=>x.id===r.user_id);const w=STORE.whiskeys.find(x=>x.id===r.whiskey_id);const t=r.aroma+r.palate+r.finish+r.style+r.value;return<tr key={r.id}><td><div style={{display:'flex',alignItems:'center',gap:8}}><span>{u?.avatar}</span><span>{u?.displayName}</span></div></td><td>{w?.name}</td><td><span style={{color:scoreColor(t),fontWeight:600}}>{t}/100</span></td><td>{u?.isPro?<span className="pb">PRO</span>:<span style={{fontSize:11,color:'var(--t3)'}}>Audience</span>}</td><td style={{color:'var(--t2)'}}>{r.date}</td></tr>;})}
    </tbody></table></div>}
  </div>);
};

const Profile = ({ user }) => {
  const revs=STORE.reviews.filter(r=>r.user_id===user?.id);if(!user)return null;
  return(<div className="pg"><div className="sd"><span>My Profile</span></div>
    <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:32,alignItems:'start'}}>
      <div className="cd" style={{padding:32,textAlign:'center'}}>
        <div style={{fontSize:56,marginBottom:12}}>{user.avatar}</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:4}}>{user.displayName}</h3>
        <div style={{fontSize:13,color:'var(--t3)',marginBottom:12}}>@{user.username}</div>
        <div style={{display:'flex',gap:6,justifyContent:'center',flexWrap:'wrap'}}>{user.isPro&&<span className="pb">NPS PRO</span>}{user.isAdmin&&<span style={{fontSize:10,fontWeight:700,color:'var(--red)',background:'rgba(196,92,74,.1)',padding:'3px 8px',borderRadius:4}}>ADMIN</span>}</div>
        <div style={{marginTop:20,padding:'16px 0',borderTop:'1px solid var(--brd)',display:'flex',justifyContent:'space-around'}}>
          <div><div style={{fontSize:24,fontWeight:700,color:'var(--gold)'}}>{revs.length}</div><div style={{fontSize:11,color:'var(--t3)'}}>Reviews</div></div>
          <div><div style={{fontSize:24,fontWeight:700,color:'var(--purpL)'}}>{revs.length>0?Math.round(revs.reduce((s,r)=>s+r.aroma+r.palate+r.finish+r.style+r.value,0)/revs.length):0}</div><div style={{fontSize:11,color:'var(--t3)'}}>Avg Score</div></div>
        </div>
      </div>
      <div><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:16}}>My Reviews</h3>
        {revs.length===0?<div className="em"><div className="emi">📝</div><h3>No reviews yet</h3></div>:revs.map(r=>{const w=STORE.whiskeys.find(x=>x.id===r.whiskey_id);const t=r.aroma+r.palate+r.finish+r.style+r.value;return(
          <div key={r.id} className="pr" style={{marginBottom:12}}><div className="prh"><div><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600}}>{w?.name}</div><div style={{fontSize:12,color:'var(--t3)'}}>{r.date}</div></div><div className="prs" style={{color:scoreColor(t)}}>{t}<span>/100</span></div></div>{r.notes&&<div className="rn" style={{marginTop:8}}>"{r.notes}"</div>}</div>
        );})}
      </div>
    </div>
  </div>);
};

export default function App() {
  const [page,setPage]=useState("home");const [user,setUser]=useState(null);
  const [sw,setSW]=useState(null);const [sb,setSB]=useState(null);
  const [,setTick]=useState(0);const refresh=useCallback(()=>setTick(t=>t+1),[]);
  useEffect(()=>{window.scrollTo?.({top:0,behavior:'smooth'});},[page]);
  return(<div className="N"><style>{CSS}</style>
    <Header user={user} page={page} setPage={setPage} onLogout={()=>{setUser(null);setPage("home");}}/>
    {page==="home"&&<Home setPage={setPage} setSW={setSW} setSB={setSB}/>}
    {page==="database"&&<Database setPage={setPage} setSW={setSW}/>}
    {page==="detail"&&<Detail wid={sw} user={user} setPage={setPage} refresh={refresh}/>}
    {page==="blog"&&<Blog setPage={setPage} setSB={setSB}/>}
    {page==="blogdet"&&<BlogDet bid={sb} setPage={setPage} setSW={setSW}/>}
    {page==="login"&&<Login setPage={setPage} onLogin={setUser}/>}
    {page==="signup"&&<Signup setPage={setPage} onLogin={setUser}/>}
    {page==="admin"&&<Admin user={user} refresh={refresh}/>}
    {page==="profile"&&<Profile user={user}/>}
    <footer className="ftr"><img src={LOGO_URL} alt="NPS"/><div className="ftr-b">NoblePalateSociety.com</div><div className="ftr-m">Sapientia Per Sensus — Wisdom Through the Senses</div><p>© 2026 Noble Palate Society. The pursuit of liquid perfection.</p></footer>
  </div>);
}
