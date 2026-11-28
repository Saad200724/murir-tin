(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();class vh{ctx=null;engineOsc=null;engineGain=null;soundEnabled=!0;sfxVolume=.85;engineVolume=.7;setPreferences(e,t=.85,n=.7){this.soundEnabled=e,this.sfxVolume=Math.max(0,Math.min(1,t)),this.engineVolume=Math.max(0,Math.min(1,n)),!e&&this.engineGain&&this.ctx&&this.engineGain.gain.setTargetAtTime(1e-4,this.ctx.currentTime,.05)}unlock(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e}this.ctx.state==="suspended"&&this.ctx.resume(),this.ensureEngineLoop()}ensureEngineLoop(){if(!this.ctx||this.engineOsc)return;const e=this.ctx.createOscillator(),t=this.ctx.createBiquadFilter(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.value=54,t.type="lowpass",t.frequency.value=180,n.gain.value=1e-4,e.connect(t),t.connect(n),n.connect(this.ctx.destination),e.start(),this.engineOsc=e,this.engineGain=n}updateEngineRumble(e,t,n){if(!this.ctx||!this.engineOsc||!this.engineGain||this.ctx.state!=="running")return;const i=this.ctx.currentTime;if(!this.soundEnabled||!t||this.engineVolume<=.01){this.engineGain.gain.setTargetAtTime(1e-4,i,.08);return}const s=46+e*1.35+(n?24:0),a=(n?.055:.032)*this.engineVolume;this.engineOsc.frequency.setTargetAtTime(s,i,.08),this.engineGain.gain.setTargetAtTime(a,i,.08)}pauseAll(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend()}resumeAll(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}tone(e,t,n,i,s,a=0){if(!this.ctx||this.ctx.state!=="running"||!this.soundEnabled||this.sfxVolume<=.01)return;const o=this.ctx.currentTime+a,l=this.ctx.createOscillator(),c=this.ctx.createGain();l.type=n,l.frequency.setValueAtTime(e,o),s!==void 0&&l.frequency.exponentialRampToValueAtTime(Math.max(30,s),o+t);const h=i*this.sfxVolume;c.gain.setValueAtTime(1e-4,o),c.gain.linearRampToValueAtTime(h,o+.01),c.gain.exponentialRampToValueAtTime(1e-4,o+t),l.connect(c),c.connect(this.ctx.destination),l.start(o),l.stop(o+t+.02)}playHydraulicHorn(){this.soundEnabled&&(this.unlock(),this.tone(330,.13,"sawtooth",.12,315,0),this.tone(415,.13,"sawtooth",.1,395,0),this.tone(330,.11,"sawtooth",.12,315,.16),this.tone(415,.11,"sawtooth",.1,395,.16),this.tone(392,.24,"sawtooth",.13,360,.3),this.tone(494,.24,"sawtooth",.1,460,.3))}playTrainHorn(){this.soundEnabled&&(this.unlock(),this.tone(185,.45,"sawtooth",.11,180,0),this.tone(233,.45,"sawtooth",.09,228,0),this.tone(185,.55,"sawtooth",.12,175,.52),this.tone(233,.55,"sawtooth",.1,222,.52))}playPoliceSiren(){this.soundEnabled&&(this.unlock(),this.tone(660,.18,"triangle",.12,920,0),this.tone(920,.18,"triangle",.12,660,.18))}playChapaniSparks(e=1){if(!this.soundEnabled)return;this.unlock();const t=Math.min(600,Math.max(0,e-1)*75);this.tone(900+t,.09,"triangle",.15,1360+t,0),this.tone(1220+t,.14,"sine",.14,1680+t,.06)}playHelperDoorSlap(){this.soundEnabled&&(this.unlock(),this.tone(190,.06,"square",.15,95,0),this.tone(210,.06,"square",.15,105,.09),this.tone(720,.16,"triangle",.12,980,.16))}playWrenchRepair(){this.soundEnabled&&(this.unlock(),this.tone(440,.08,"triangle",.14,660,0),this.tone(660,.14,"sine",.15,990,.08))}playTollPaid(){this.soundEnabled&&(this.unlock(),this.tone(880,.1,"sine",.14,880,0),this.tone(1174,.18,"triangle",.15,1318,.1))}playBarrierSmash(){this.soundEnabled&&(this.unlock(),this.tone(180,.25,"sawtooth",.2,55,0),this.tone(620,.18,"triangle",.15,1280,.05))}playMilestoneFanfare(){this.soundEnabled&&(this.unlock(),this.tone(523,.12,"triangle",.14,523,0),this.tone(659,.12,"triangle",.14,659,.11),this.tone(784,.26,"triangle",.16,1046,.22))}playCrash(){this.soundEnabled&&(this.unlock(),this.tone(140,.36,"sawtooth",.24,38,0),this.tone(95,.42,"square",.18,32,.03))}playVoicePackClip(e){if(!(!this.soundEnabled||this.sfxVolume<=.01))try{const t=new Audio(`./voices/${e}.mp3`);t.volume=Math.min(1,this.sfxVolume),t.play().catch(()=>{})}catch{}}}const kn=84e3,Cr=4.6,xh=260,mt=[{id:"thakurgaon",name:"ঠাকুরগাঁও",enName:"Thakurgaon",startM:0,endM:3800,biome:"north_bengal",hasParallelRail:!0,isHub:!0,mapX:72,mapY:108,labelAnchor:"right",tagline:"ভোরের কুয়াশা আর সবুজ ধানক্ষেত থেকে যাত্রা শুরু!"},{id:"dinajpur_flyover",name:"দিনাজপুর ফ্লাইওভার",enName:"Dinajpur Flyover",startM:3800,endM:5200,biome:"flyover",mapX:142,mapY:165,tagline:"ফ্লাইওভারের ঢাল বেয়ে স্পিড তোলেন ওস্তাদ!"},{id:"rangpur",name:"রংপুর",enName:"Rangpur",startM:5200,endM:11500,biome:"north_bengal",isHub:!0,mapX:210,mapY:168,labelAnchor:"right",tagline:"তাজহাট ও রংপুর হাইওয়ে — সরিষা খেতের পাশ দিয়ে!"},{id:"bogura",name:"বগুড়া",enName:"Bogura",startM:11500,endM:17500,biome:"north_bengal",hasParallelRail:!0,isHub:!0,mapX:236,mapY:305,labelAnchor:"left",tagline:"বগুড়ার দই আর উত্তরাঞ্চলের হাই-স্পিড রুট!"},{id:"bogura_flyover",name:"বগুড়া বাইপাস ফ্লাইওভার",enName:"Bogura Flyover",startM:17500,endM:19e3,biome:"flyover",mapX:246,mapY:338,tagline:"বাইপাস ফ্লাইওভার — জ্যাম ছাড়াই উড়াল!"},{id:"sirajganj",name:"সিরাজগঞ্জ",enName:"Sirajganj",startM:19e3,endM:24500,biome:"north_bengal",hasParallelRail:!0,mapX:262,mapY:392,tagline:"যমুনা নদীর পাড়ে পৌঁছে গেছি — সামনেই মহাসেতু!"},{id:"jamuna_bridge",name:"যমুনা সেতু (বঙ্গবন্ধু সেতু) 🌉",enName:"Jamuna Bridge",startM:24500,endM:27500,biome:"river_bridge",bridgeStyle:"jamuna",tollFee:300,hasParallelRail:!0,isHub:!0,mapX:290,mapY:408,labelAnchor:"left",labelDy:14,tagline:"৪.৮ কিমি যমুনা সেতু — পাশে ছুটে চলেছে আন্তঃনগর ট্রেন!"},{id:"tangail",name:"টাঙ্গাইল",enName:"Tangail",startM:27500,endM:34e3,biome:"north_bengal",mapX:332,mapY:422,tagline:"টাঙ্গাইল চমচম আর এলেঙ্গা-চন্দ্রা এক্সপ্রেস!"},{id:"gazipur_flyover",name:"গাজীপুর ফ্লাইওভার",enName:"Gazipur Flyover",startM:34e3,endM:35800,biome:"flyover",mapX:384,mapY:462,tagline:"ঢাকায় প্রবেশের উড়ালসড়ক!"},{id:"dhaka",name:"ঢাকা (মিরপুর ➔ গুলিস্তান)",enName:"Dhaka City",startM:35800,endM:42500,biome:"dhaka_city",hasParallelRail:!0,isHub:!0,mapX:382,mapY:508,labelAnchor:"right",labelDy:-8,tagline:"মেট্রোরেলের নিচে আসল বাম প্লাস্টিক চাপানি!"},{id:"hanif_flyover",name:"মেয়র হানিফ ফ্লাইওভার",enName:"Mayor Hanif Flyover",startM:42500,endM:44200,biome:"flyover",mapX:392,mapY:526,tagline:"মাওয়া এক্সপ্রেসওয়ে ধরে পদ্মার পথে!"},{id:"padma_bridge",name:"পদ্মা সেতু 🌉",enName:"Padma Setu",startM:44200,endM:47400,biome:"river_bridge",bridgeStyle:"padma",tollFee:250,hasParallelRail:!0,isHub:!0,mapX:372,mapY:566,labelAnchor:"left",labelDy:10,tagline:"স্বপ্নের পদ্মা সেতু — নীল স্টিলের ট্রাস আর উত্তাল নদী!"},{id:"meghna_bridge",name:"মেঘনা সেতু 🌉",enName:"Meghna Bridge",startM:47400,endM:50200,biome:"river_bridge",bridgeStyle:"meghna",tollFee:200,mapX:424,mapY:535,labelAnchor:"right",labelDy:-10,tagline:"চট্টগ্রাম মহাসড়কের মেঘনা সেতু!"},{id:"daudkandi",name:"দাউদকান্দি",enName:"Daudkandi",startM:50200,endM:54500,biome:"rain_highway",mapX:446,mapY:556,tagline:"হঠাৎ কালবৈশাখী বৃষ্টি — পিচ্ছিল রাস্তায় বোনাস ড্রাইভ!"},{id:"gumti_bridge",name:"গোমতী সেতু 🌉",enName:"Gumti Bridge",startM:54500,endM:57e3,biome:"river_bridge",bridgeStyle:"gumti",tollFee:180,mapX:464,mapY:568,labelAnchor:"left",labelDy:16,tagline:"বৃষ্টির মাঝে লাল-সোনালী গোমতী সেতু!"},{id:"comilla",name:"কুমিল্লা",enName:"Comilla",startM:57e3,endM:63500,biome:"rain_highway",hasParallelRail:!0,isHub:!0,mapX:494,mapY:582,labelAnchor:"right",labelDy:4,tagline:"কুমিল্লার রসমালাই আর বৃষ্টিস্নাত হাইওয়ে!"},{id:"feni_flyover",name:"ফেনী ফ্লাইওভার",enName:"Feni Flyover",startM:63500,endM:65200,biome:"flyover",mapX:520,mapY:648,tagline:"ফেনী মহিপাল ফ্লাইওভার — পাহাড়ি সূর্যাস্ত শুরু!"},{id:"chittagong_hills",name:"সীতাকুণ্ড ও চট্টগ্রাম",enName:"Chattogram",startM:65200,endM:73500,biome:"hills",hasParallelRail:!0,isHub:!0,mapX:576,mapY:735,labelAnchor:"left",tagline:"সবুজ পাহাড় আর সোনালী সূর্যাস্তের চট্টগ্রাম!"},{id:"karnaphuli_bridge",name:"শাহ আমানত (কর্ণফুলী) সেতু 🌉",enName:"Shah Amanat Bridge",startM:73500,endM:76200,biome:"river_bridge",bridgeStyle:"karnaphuli",tollFee:200,isHub:!0,mapX:594,mapY:772,labelAnchor:"right",labelDy:6,tagline:"ঝুলন্ত তারের শাহ আমানত সেতু — হেডলাইট অন!"},{id:"coxs_bazar",name:"কক্সবাজার মেরিন ড্রাইভ 🏖️",enName:"Cox's Bazar",startM:76200,endM:84e3,biome:"marine_drive",isHub:!0,mapX:638,mapY:908,labelAnchor:"left",tagline:"বামে পাহাড়, ডানে বঙ্গোপসাগর — কক্সবাজার পৌঁছে গেছি!"}],yh=mt.filter(r=>r.isHub);function ri(r){return(Math.max(0,r)/100).toFixed(1)}function No(r){const e=Math.max(0,r),t=Math.floor(e/kn),n=e%kn;let i=mt.findIndex(m=>n>=m.startM&&n<m.endM);i<0&&(i=0);const s=mt[i],a=mt[(i+1)%mt.length];let o=0,l=0;if(s.biome==="river_bridge"||s.biome==="flyover"){const m=s.endM-s.startM,f=n-s.startM,b=Math.min(xh,m*.3);if(f<b){const x=f/b;o=Cr*.5*(1-Math.cos(Math.PI*x)),l=.085*Math.sin(Math.PI*x)}else if(f>m-b){const x=(m-f)/b;o=Cr*.5*(1-Math.cos(Math.PI*x)),l=-.085*Math.sin(Math.PI*x)}else o=Cr,l=0}const c=n/kn;let h=0;if(n>=5e4&&n<=63800){const m=(n-5e4)/13800;h=Math.sin(Math.PI*m)*.95}const d=n>=71500||h>=.55,u=Math.max(1,s.endM-s.startM),p=Math.max(0,Math.min(1,(n-s.startM)/u)),g=s.mapX+(a.mapX-s.mapX)*p,_=s.mapY+(a.mapY-s.mapY)*p;return{lapIndex:t,lapDist:n,segmentIndex:i,segment:s,nextSegment:a,elevationY:o,slopePitch:l,timeOfDay:c,rainIntensity:h,headlightsOn:d,mapX:g,mapY:_}}const At=[{id:"classic_mirpur",modelName:"murir_tin_bus",name:"মুড়ির টিন ক্লাসিক",routeBadge:"ঠাকুরগাঁও ➔ ঢাকা ➔ কক্সবাজার",tagline:"চ্যাপ্টা ফ্রন্ট ও ছাদের র‍্যাক — খাঁটি দেশি লিজেন্ড!",bodyHex:"#06b888",stripeHex:"#ef476f",cost:0,bonusSpeed:0,bonusArmor:0,stats:{speed:68,armor:65,nitro:65,capacity:72}},{id:"rajdhani_express",modelName:"rajdhani_bus",name:"রাজধানী সুপার সার্ভিস লিঃ",routeBadge:"মিরপুর ১৪ ➔ সাভার ➔ কক্সবাজার",tagline:"হিনো ফেসিয়া, টুইন মিরর, VIP লিভারি ও +১ এক্সট্রা লাইফ!",bodyHex:"#b81d38",stripeHex:"#ffbe0b",cost:900,bonusSpeed:2.2,bonusArmor:1,stats:{speed:88,armor:85,nitro:86,capacity:92}},{id:"balaka_rocket",modelName:"murir_tin_bus",name:"বলাকা তুফান মেইল",routeBadge:"গাজীপুর ➔ সায়েদাবাদ ➔ চট্টগ্রাম",tagline:"হাই-রেভ ডিজেল টার্বো আর ফায়ারি অরেঞ্জ বডি!",bodyHex:"#fb5607",stripeHex:"#ffbe0b",cost:1400,bonusSpeed:2.8,bonusArmor:0,stats:{speed:86,armor:72,nitro:84,capacity:78}},{id:"chiriakhana_vip",modelName:"murir_tin_bus",name:"ডিস্কো চিড়িয়াখানা",routeBadge:"মিরপুর ১ ➔ মতিঝিল ➔ পদ্মা সেতু",tagline:"নিয়ন পার্পল বডি ও হাই-স্পিড নাইট্রো বোনাস!",bodyHex:"#8338ec",stripeHex:"#06d6a0",cost:2200,bonusSpeed:3.4,bonusArmor:1,stats:{speed:92,armor:82,nitro:95,capacity:84}},{id:"dholaikhal_boss",modelName:"murir_tin_bus",name:"ধোলাইখাল সম্রাট",routeBadge:"অল বাংলাদেশ রকেট 👑",tagline:"সর্বোচ্চ স্পিড ও +২ বাম্পার লাইফ — রাজপথের সম্রাট!",bodyHex:"#d90429",stripeHex:"#ffd166",cost:3500,bonusSpeed:4.5,bonusArmor:2,stats:{speed:98,armor:98,nitro:96,capacity:95}}],Mh=[{id:"engine",name:"ইঞ্জিন টিউনিং",description:"টপ স্পিড ও পিক-আপ বাড়াবে!",emoji:"⚙️",baseCost:300,maxLevel:5},{id:"armor",name:"ধোলাইখাল বাম্পার",description:"বাসের লাইফ +১ করে বাড়াবে!",emoji:"🛡️",baseCost:350,maxLevel:4},{id:"nitro",name:"নাইট্রো সিলিন্ডার",description:"নাইট্রো স্পিড ও চাপানি পয়েন্ট বাড়াবে!",emoji:"🔥",baseCost:320,maxLevel:5}];function Sh(r,e){return r.baseCost*e}const bh={chapani:{duration:110,weak:.45,strong:.2},horn:{duration:75,weak:.25,strong:.1},nitro:{duration:90,weak:.35,strong:.25},bridge:{duration:180,weak:.5,strong:.35},crash:{duration:320,weak:.85,strong:.9}},Eh={connected:!1,label:"",steer:0,accelerate:!1,brake:!1,nitro:!1,hornPressed:!1,cameraPressed:!1,mapPressed:!1,pausePressed:!1,confirmPressed:!1,cancelPressed:!1};function Ir(r){const e=r.toLowerCase();return e.includes("xbox")||e.includes("xinput")?"Xbox Controller":e.includes("dualsense")?"PS5 DualSense":e.includes("dualshock")||e.includes("sony")||e.includes("054c")?"PS DualShock":e.includes("nintendo")||e.includes("pro controller")?"Switch Pro":(r.replace(/\s*\(.*?\)\s*/g," ").replace(/\s+/g," ").trim()||"Gamepad").slice(0,24)}function Th(r,e,t,n=.14){const i=e.map(u=>u>.45),s=u=>!!(i[u]&&!t[u]),a=u=>(e[u]??0)>.15,o=r[0]??0;let l=0;if(Math.abs(o)>n){const u=Math.sign(o),p=(Math.abs(o)-n)/(1-n);l=u*Math.min(1,Math.max(0,p))}i[14]?l=-1:i[15]&&(l=1);const c=a(7)||!!i[12],h=a(6)||!!i[1],d=!!i[0]||!!i[5];return{state:{steer:l,accelerate:c,brake:h,nitro:d,hornPressed:s(2)||s(4)||s(10),cameraPressed:s(3),mapPressed:s(8),pausePressed:s(9),confirmPressed:s(0)||s(9),cancelPressed:s(1)},nextPressed:i}}class wh{constructor(e){this.onConnectionChange=e,typeof window<"u"&&(window.addEventListener("gamepadconnected",t=>{const n=Ir(t.gamepad.id);this.setConnectionState(!0,n)}),window.addEventListener("gamepaddisconnected",()=>{const t=this.findActiveGamepad();t?this.setConnectionState(!0,Ir(t.id)):(this.prevPressed=[],this.setConnectionState(!1,""))}))}prevPressed=[];connected=!1;activeLabel="";setConnectionState(e,t){this.connected===e&&this.activeLabel===t||(this.connected=e,this.activeLabel=t,this.onConnectionChange?.(e,t))}findActiveGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return null;const e=navigator.getGamepads();let t=null;for(const n of e)if(!(!n||!n.connected)){if(n.mapping==="standard")return n;t||(t=n)}return t}poll(){const e=this.findActiveGamepad();if(!e)return this.connected&&(this.prevPressed=[],this.setConnectionState(!1,"")),Eh;const t=Ir(e.id);this.setConnectionState(!0,t);const n=e.buttons.map(a=>a.pressed?Math.max(a.value,1):a.value),{state:i,nextPressed:s}=Th(e.axes,n,this.prevPressed);return this.prevPressed=s,{connected:!0,label:t,...i}}rumble(e,t){if(!t)return;const i=this.findActiveGamepad()?.vibrationActuator;if(!i?.playEffect)return;const s=bh[e];try{i.playEffect("dual-rumble",{startDelay:0,duration:s.duration,weakMagnitude:s.weak,strongMagnitude:s.strong})?.catch?.(()=>{})}catch{}}}const gc="murir_tin_lb_cache_v1";function Ah(){if(typeof localStorage>"u")return null;try{const r=localStorage.getItem(gc);return r?JSON.parse(r):null}catch{return null}}function _c(r){if(!(typeof localStorage>"u"))try{localStorage.setItem(gc,JSON.stringify(r))}catch{}}async function Uo(){try{const r=await fetch("/api/leaderboard",{cache:"no-store"});if(!r.ok)throw new Error(`HTTP ${r.status}`);const e=await r.json();return _c(e),e}catch(r){const e=Ah();if(e)return e;throw r}}async function Rh(r){const e=await fetch("/api/leaderboard",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),t=await e.json();if(!e.ok||!t.ok)throw new Error(t.error||`HTTP ${e.status}`);return _c({updatedAt:t.updatedAt,entries:t.entries,jsonUrl:t.jsonUrl}),t}async function li(r){const e=await fetch("./api/race",{method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify(r)}),t=await e.json();if(!e.ok)throw new Error(t.error||`HTTP ${e.status}`);return t}async function Ch(r,e,t){return li({action:"create",playerName:r,busId:e,route:t})}async function Ih(r,e,t){return li({action:"join",code:r.trim().toUpperCase(),playerName:e,busId:t})}async function Fo(r){const e=await fetch(`./api/race?code=${encodeURIComponent(r.trim().toUpperCase())}`,{method:"GET",cache:"no-store"}),t=await e.json();if(!e.ok)throw new Error(t.error||`HTTP ${e.status}`);return t}async function Bo(r,e,t,n,i){return li({action:"ready",code:r,playerId:e,ready:t,busId:n,playerName:i})}async function Ph(r,e,t){return li({action:"route",code:r,playerId:e,route:t})}async function Lh(r,e){return li({action:"start",code:r,playerId:e})}async function Dh(r,e,t){return li({action:"sync",code:r,playerId:e,...t})}async function Nh(r,e){return li({action:"rematch",code:r,playerId:e})}async function Oo(r,e){try{await fetch("./api/race",{method:"POST",headers:{"Content-Type":"application/json"},keepalive:!0,body:JSON.stringify({action:"leave",code:r,playerId:e})})}catch{}}function Uh(r){const e=typeof window<"u"?window.location.hostname:"";return e==="127.0.0.1"||e==="localhost"?`${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(r)}`:`https://murirtin-express.vercel.app/?room=${encodeURIComponent(r)}`}class Fh{tracks=new Map;clear(){this.tracks.clear()}updateFromRoom(e,t,n){const i=new Set;for(const s of e.players){if(s.id===t)continue;i.add(s.id);const a=this.tracks.get(s.id);a?(a.latest=s,a.receivedAtMs=n):this.tracks.set(s.id,{latest:s,receivedAtMs:n,curX:s.x,curDist:s.distanceM,curTilt:s.tiltAngle})}for(const s of this.tracks.keys())i.has(s)||this.tracks.delete(s)}sample(e,t){const n=[],i=Math.min(.1,Math.max(.001,e)),s=Math.min(1,i*12);for(const a of this.tracks.values()){const o=a.latest,l=o.finishedAt!==null,c=l?0:Math.min(.35,Math.max(0,(t-a.receivedAtMs)/1e3)),h=o.distanceM+o.speed*c;a.curX+=(o.x-a.curX)*s,a.curDist+=(h-a.curDist)*s,a.curTilt+=(o.tiltAngle-a.curTilt)*s,n.push({id:o.id,name:o.name,busId:o.busId,color:o.color,x:a.curX,distanceM:a.curDist,speed:o.speed,tiltAngle:a.curTilt,nitroActive:o.nitroActive,finished:l})}return n}}const ji=[{id:"bogura_sirajganj",label:"বগুড়া ➔ সিরাজগঞ্জ",subtitle:"বগুড়া বাইপাস ফ্লাইওভার হয়ে সিরাজগঞ্জ স্প্রিন্ট (~৫০ কিমি)",startM:14500,finishM:19500},{id:"jamuna_dash",label:"সিরাজগঞ্জ ➔ যমুনা সেতু পার",subtitle:"৪.৮ কিমি যমুনা সেতু + পাশে রেলগাড়ি (~৪২ কিমি)",startM:23500,finishM:27700},{id:"dhaka_padma",label:"ঢাকা ➔ পদ্মা সেতু স্প্রিন্ট",subtitle:"মেয়র হানিফ ফ্লাইওভার ও স্বপ্নের পদ্মা সেতু (~৫৭ কিমি)",startM:41800,finishM:47500},{id:"daudkandi_gumti",label:"দাউদকান্দি ➔ গোমতী বৃষ্টি রেস",subtitle:"কালবৈশাখী বৃষ্টি ও লাল-সোনালী গোমতী সেতু (~৪৭ কিমি)",startM:52500,finishM:57200},{id:"ctg_karnaphuli",label:"চট্টগ্রাম ➔ শাহ আমানত নাইট রেস",subtitle:"পাহাড়ি সূর্যাস্ত ও ঝুলন্ত কর্ণফুলী সেতু (~৪৬ কিমি)",startM:71800,finishM:76400},{id:"coxs_marine",label:"কক্সবাজার মেরিন ড্রাইভ ডার্বি",subtitle:"বামে পাহাড়, ডানে বঙ্গোপসাগর ফাইনাল ডার্বি (~৫০ কিমি)",startM:76200,finishM:81200}];function ko(r,e){const t=mt.findIndex(h=>h.id===r),n=mt.findIndex(h=>h.id===e);if(t<0||n<0||n<t)return null;const i=mt[t],s=mt[n],a=i.startM,o=Math.min(s.endM,a+15e3);if(o<=a+800)return null;const l=h=>h.replace(" 🌉","").replace(" 🏖️",""),c=((o-a)/100).toFixed(0);return{id:`custom:${i.id}:${s.id}`,label:`${l(i.name)} ➔ ${l(s.name)}`,subtitle:`কাস্টম রুট (~${c} কিমি)`,startM:a,finishM:o}}function ma(r){if(r===null||!Number.isFinite(r)||r<0)return"চলছে...";const e=r/1e3,t=Math.floor(e/60),n=e%60,i=n<10?`0${n.toFixed(1)}`:n.toFixed(1);return`${String(t).padStart(2,"0")}:${i}`}function Pr(r){return[...r].sort((e,t)=>{const n=e.finishMs!==null&&e.finishMs>0,i=t.finishMs!==null&&t.finishMs>0;return n&&i?e.finishMs-t.finishMs:n?-1:i?1:t.distanceM!==e.distanceM?t.distanceM-e.distanceM:t.score-e.score})}function Bh(r){let e=r>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const ga=6.2,pn=[-4.5,-1.5,1.5,4.5],Oh=250;mt.map(r=>r.name);const Rs=[{id:"m_chapani",kind:"chapani",title:"৩টি গাড়িতে চাপানি মারুন",target:3,rewardTaka:280,rewardPts:350},{id:"m_horn",kind:"horn",title:"হর্ন দিয়ে ২টি গাড়ি সরান",target:2,rewardTaka:240,rewardPts:300},{id:"m_pax",kind:"passenger",title:"৬ জন যাত্রী তুলুন",target:6,rewardTaka:300,rewardPts:320},{id:"m_tesla",kind:"tesla",title:"২টি দেশি টেসলা ডজ দিন",target:2,rewardTaka:350,rewardPts:420},{id:"m_bridge",kind:"bridge",title:"১টি সেতু পার হন",target:1,rewardTaka:400,rewardPts:500}];function kh(r){return r>=12e3?"অল বাংলাদেশ মুড়ির টিন সম্রাট 👑":r>=6e3?"পদ্মা-যমুনা এক্সপ্রেস কিংবদন্তি 🌉🔥":r>=3e3?"হাইওয়ে ওস্তাদ ড্রাইভার 💪":r>=1200?"আগারগাঁওয়ের চাল্লু হেল্পার 📣":"গুলিস্তানের নুব হেল্পার 😅"}class Hh{constructor(e=1,t=1,n=1,i=0,s=0){this.engineLevel=e,this.armorLevel=t,this.nitroLevel=n,this.busBonusSpeed=i,this.busBonusArmor=s,this.reset(0)}playerX=-1.5;playerVx=0;speed=26;tiltAngle=0;distanceM=0;score=0;takaEarned=0;passengers=6;plasticScrapes=0;teslaDodges=0;chapaniCombo=0;comboTimer=0;feverActive=!1;nitroCharge=60;nitroActive=!1;health=3;maxHealth=3;invulnTimer=0;crashed=!1;hornCooldown=0;revivesUsed=0;raceMode=!1;raceStartM=0;raceFinishM=0;raceFinished=!1;raceSlowdownTimer=0;currentSegment=mt[0];nextSegment=mt[1];currentBiome="north_bengal";activeBridgeStyle=null;isOnPadmaBridge=!1;isOnBridge=!1;bridgeBlend=0;flyoverBlend=0;elevationY=0;slopePitch=0;timeOfDay=0;rainIntensity=0;headlightsOn=!1;mapX=mt[0].mapX;mapY=mt[0].mapY;totalTollPaid=0;bridgesCrossed=0;padmaCrossings=0;wantedLevel=0;wantedClearDist=0;activeMission={...Rs[0],progress:0};missionCursor=0;trainActive=!1;trainZ=-180;trainSpeed=42;trainTimer=14;entities=[];nextEntityId=1;spawnTimer=.6;stopTimer=4.2;pickupTimer=6.5;rivalActive=!1;rivalTimer=14;warnedBridgeKeys=new Set;spawnedGateKeys=new Set;completedBridgeKeys=new Set;announcedHubs=new Set;completedLaps=0;get speedKmh(){return Math.round(this.speed*3.1)}startRace(e,t,n=1){this.reset(e),this.raceMode=!0,this.raceStartM=e,this.raceFinishM=t,this.raceFinished=!1,this.raceSlowdownTimer=0;const i=Math.max(0,Math.min(3,n));this.playerX=pn[i]}reset(e=0){this.playerX=-1.5,this.playerVx=0,this.speed=24+(this.engineLevel-1)*2.2+this.busBonusSpeed,this.tiltAngle=0,this.distanceM=Math.max(0,e),this.score=0,this.takaEarned=0,this.passengers=6,this.plasticScrapes=0,this.teslaDodges=0,this.chapaniCombo=0,this.comboTimer=0,this.feverActive=!1,this.nitroCharge=60,this.nitroActive=!1,this.maxHealth=2+this.armorLevel+this.busBonusArmor,this.health=this.maxHealth,this.invulnTimer=0,this.crashed=!1,this.hornCooldown=0,this.revivesUsed=0,this.raceMode=!1,this.raceStartM=0,this.raceFinishM=0,this.raceFinished=!1,this.raceSlowdownTimer=0,this.totalTollPaid=0,this.bridgesCrossed=0,this.padmaCrossings=0,this.wantedLevel=0,this.wantedClearDist=0,this.missionCursor=0,this.activeMission={...Rs[0],progress:0},this.trainActive=!1,this.trainZ=-180,this.trainSpeed=42,this.trainTimer=12,this.entities=[],this.spawnTimer=.45,this.stopTimer=3.8,this.pickupTimer=5.5,this.rivalActive=!1,this.rivalTimer=12,this.warnedBridgeKeys.clear(),this.spawnedGateKeys.clear(),this.completedBridgeKeys.clear(),this.announcedHubs.clear(),this.completedLaps=Math.floor(this.distanceM/kn);const t=Math.floor(this.distanceM/kn),n=this.distanceM%kn;for(const i of mt)if(i.biome==="river_bridge"&&i.endM<=n){const s=`${t}:${i.id}`;this.warnedBridgeKeys.add(s),this.spawnedGateKeys.add(s),this.completedBridgeKeys.add(s)}this.syncRouteSample(!0),this.spawnTrafficVehicle(-34,2,"plastic_sedan"),this.spawnTrafficVehicle(-56,1,"cng"),this.spawnTrafficVehicle(-78,3,"plastic_sedan")}syncRouteSample(e=!1){const t=No(this.distanceM);this.currentSegment=t.segment,this.nextSegment=t.nextSegment,this.currentBiome=t.segment.biome,this.activeBridgeStyle=t.segment.bridgeStyle??null,this.isOnBridge=t.segment.biome==="river_bridge",this.isOnPadmaBridge=t.segment.id==="padma_bridge",this.elevationY=t.elevationY,this.slopePitch=t.slopePitch,this.timeOfDay=t.timeOfDay,this.rainIntensity=t.rainIntensity,this.headlightsOn=t.headlightsOn,this.mapX=t.mapX,this.mapY=t.mapY,e&&(this.bridgeBlend=this.isOnBridge?1:0,this.flyoverBlend=this.currentBiome==="flyover"?1:0)}revive(){return this.revivesUsed>=1?!1:(this.revivesUsed+=1,this.crashed=!1,this.health=Math.max(2,Math.ceil(this.maxHealth/2)),this.invulnTimer=2.6,this.entities=this.entities.filter(e=>e.z<-28||e.z>10),!0)}getCurrentStopName(){return this.currentSegment.name}getNextStopName(){return this.nextSegment.name}advanceMission(e,t,n){if(this.activeMission.kind===e&&(this.activeMission.progress+=t,this.activeMission.progress>=this.activeMission.target)){const i=this.activeMission;this.score+=i.rewardPts,this.takaEarned+=i.rewardTaka,this.nitroCharge=Math.min(100,this.nitroCharge+25),n.push({type:"mission_complete",callout:`🎯 মিশন কমপ্লিট: ${i.title}! +${i.rewardTaka} ৳`,takaDelta:i.rewardTaka}),this.missionCursor=(this.missionCursor+1)%Rs.length,this.activeMission={...Rs[this.missionCursor],progress:0}}}blastHorn(){if(this.crashed||this.hornCooldown>0)return[];this.hornCooldown=.65;const e=[];let t=0;const n=(i,s,a)=>{const o=pn[i];return!this.entities.some(l=>l.id!==a&&l.kind!=="toll_gate"&&Math.abs(l.z-s)<13&&Math.abs((l.dodgeTargetX??l.x)-o)<1.35)};for(const i of this.entities)if((i.kind==="plastic_sedan"||i.kind==="cng")&&!i.hornDodged&&i.z<-2&&i.z>-40&&Math.abs(i.x-this.playerX)<2.25){const s=i.x>=this.playerX?1:-1,a=i.laneIndex+s,o=i.laneIndex-s;let l=null;a>=0&&a<=3&&n(a,i.z,i.id)?l=a:o>=0&&o<=3&&n(o,i.z,i.id)&&(l=o),l!==null&&(i.hornDodged=!0,i.laneIndex=l,i.dodgeTargetX=pn[l],t++)}if(t>0){const i=75*t,s=35*t;this.score+=i,this.takaEarned+=s,e.push({type:"horn_panic",callout:`হর্ন শুনে সাইড দিছে! +${s} ৳`,takaDelta:s}),this.advanceMission("horn",t,e)}return e}step(e,t,n=Math.random,i=1){if(this.crashed)return[];const s=Math.min(.05,Math.max(.001,e)),a=[];if(this.invulnTimer=Math.max(0,this.invulnTimer-s),this.hornCooldown=Math.max(0,this.hornCooldown-s),this.raceSlowdownTimer=Math.max(0,this.raceSlowdownTimer-s),this.comboTimer>0&&(this.comboTimer=Math.max(0,this.comboTimer-s),this.comboTimer===0&&(this.chapaniCombo=0,this.feverActive=!1)),t.nitro&&this.nitroCharge>8?this.nitroActive=!0:(!t.nitro||this.nitroCharge<=0)&&(this.nitroActive=!1),this.nitroActive){const w=Math.max(14,24-(this.nitroLevel-1)*2.2);this.nitroCharge=Math.max(0,this.nitroCharge-w*s),this.nitroCharge<=0&&(this.nitroActive=!1)}else this.nitroCharge=Math.min(100,this.nitroCharge+2.6*s);const o=Math.min(20,this.distanceM*.0012),l=this.raceMode?1.1:2.5,c=25+(this.engineLevel-1)*l+this.busBonusSpeed+o+(this.isOnBridge||this.currentBiome==="flyover"?2.8:0);let h=c;t.accelerate&&(h+=8.5),t.brake&&(h=Math.max(11,c-12)),this.nitroActive&&(h+=19+(this.nitroLevel-1)*2),h-=this.slopePitch*22,this.raceMode&&this.raceSlowdownTimer>0&&(h=Math.min(h,13)),this.speed+=(h-this.speed)*Math.min(1,s*5.5);const d=this.speed*s;this.distanceM+=d;const u=this.feverActive?1.5:1,p=1+this.wantedLevel*.35,g=this.rainIntensity>.3?1.35:1;this.score+=Math.floor(d*1.6*u*p*g),this.raceMode&&!this.raceFinished&&this.distanceM>=this.raceFinishM&&(this.raceFinished=!0,this.score+=1e3,a.push({type:"race_finish",callout:"🏁 ফিনিশ লাইন পার! দারুণ ড্রাইভ ওস্তাদ!",takaDelta:0}));const _=this.completedLaps,m=No(this.distanceM);this.syncRouteSample(!1);const f=m.segment.biome==="river_bridge"?1:0;this.bridgeBlend+=(f-this.bridgeBlend)*Math.min(1,s*2.4);const b=m.segment.biome==="flyover"?1:0;this.flyoverBlend+=(b-this.flyoverBlend)*Math.min(1,s*2.4),m.segment.isHub&&!this.announcedHubs.has(m.segment.id)&&(this.announcedHubs.add(m.segment.id),m.segment.id!=="thakurgaon"&&a.push({type:"hub_unlocked",callout:`📍 ${m.segment.name} পৌঁছালেন! (${m.segment.tagline})`,takaDelta:0,hubId:m.segment.id})),m.lapIndex>_&&(this.completedLaps=m.lapIndex,this.score+=2e3,this.takaEarned+=1e3,this.nitroCharge=100,a.push({type:"route_complete",callout:"🏖️ ঠাকুরগাঁও ➔ কক্সবাজার ফুল ট্রিপ কমপ্লিট! +১,০০০ ৳ ও +২,০০০ পয়েন্ট!",takaDelta:1e3}));for(const w of mt){if(w.biome!=="river_bridge")continue;const N=`${m.lapIndex}:${w.id}`,O=w.tollFee??250;if(m.lapDist>=w.startM-175&&m.lapDist<w.startM-10&&!this.warnedBridgeKeys.has(N)&&(this.warnedBridgeKeys.add(N),a.push({type:"toll_approaching",callout:`🌉 সামনে ${w.name} টোল প্লাজা! (টোল ৳${O} অথবা 🔥 নাইট্রো!)`,takaDelta:0})),m.lapDist>=w.startM-140&&m.lapDist<w.startM-15&&!this.spawnedGateKeys.has(N)){this.spawnedGateKeys.add(N);const V=-(w.startM-m.lapDist);this.entities=this.entities.filter(W=>Math.abs(W.z-V)>22);const X=this.spawnEntity("toll_gate",0,V,ga,1.5,0,0);X.tollFee=O,X.tollLabel=w.name}if(m.lapDist>=w.endM&&m.lapDist<w.endM+120&&!this.completedBridgeKeys.has(N)){this.completedBridgeKeys.add(N),this.bridgesCrossed+=1,this.padmaCrossings+=1;const V=600,X=300;this.score+=V,this.takaEarned+=X,this.nitroCharge=Math.min(100,this.nitroCharge+30),a.push({type:"bridge_complete",callout:`🌉 ${w.name} পার! +${X} ৳ ও +${V} পয়েন্ট!`,takaDelta:X}),this.advanceMission("bridge",1,a)}}this.wantedLevel>0&&this.distanceM>=this.wantedClearDist&&(this.wantedLevel=0,this.score+=500,a.push({type:"wanted_cleared",callout:"🚓 হাইওয়ে পুলিশকে ফাঁকি দিছেন! Wanted Cleared +500 pts!",takaDelta:0})),this.trainActive?(this.trainZ+=d+this.trainSpeed*s,this.trainZ>110&&(this.trainActive=!1,this.trainTimer=16+n()*12)):(this.trainTimer-=s,this.trainTimer<=0&&(m.segment.hasParallelRail||this.isOnBridge)&&(this.trainActive=!0,this.trainZ=-190,this.trainSpeed=32+n()*16,this.trainTimer=20+n()*12,a.push({type:"train_passing",callout:"🚆 পাশে বাংলাদেশ রেলওয়ে এক্সপ্রেস ছুটছে!",takaDelta:0})));const x=this.rainIntensity>.35?.015:.002,v=48*Math.max(.6,Math.min(1.6,i));Math.abs(t.steer)>.02?this.playerVx+=t.steer*v*s:this.playerVx*=Math.pow(x,s),this.isOnBridge&&Math.abs(t.steer)<.05&&(this.playerVx+=Math.sin(this.distanceM*.045)*3.2*s);const C=12+(this.engineLevel-1)*.4;this.playerVx=Math.max(-C,Math.min(C,this.playerVx)),this.playerX+=this.playerVx*s;const A=ga-1.15;this.playerX<-A?(this.playerX=-A,this.playerVx=Math.max(0,this.playerVx)):this.playerX>A&&(this.playerX=A,this.playerVx=Math.min(0,this.playerVx));const R=1+Math.min(1.4,(this.passengers-4)*.055),D=-this.playerVx/C*.16*R;if(this.tiltAngle+=(D-this.tiltAngle)*Math.min(1,s*10),this.spawnTimer-=s,this.spawnTimer<=0){const w=Math.max(.42,.9-this.distanceM*18e-6);this.spawnTimer=w*(.82+n()*.42),this.spawnRandomRoadHazard(n)}if(!this.isOnBridge&&this.currentBiome!=="flyover"&&(this.stopTimer-=s,this.stopTimer<=0&&(this.stopTimer=7.5+n()*3.5,this.isZoneClear(-135,0)&&this.spawnEntity("bus_stop",-5.1,-135,1.4,3.8,0,0))),this.pickupTimer-=s,this.pickupTimer<=0){this.pickupTimer=7.5+n()*4;const w=Math.floor(n()*4);if(this.isZoneClear(-130,w)){const N=n()<.48?"wrench_pickup":"nitro_pickup";this.spawnEntity(N,pn[w],-130,.9,.9,0,w)}}if(this.rivalTimer-=s,!this.raceMode&&!this.rivalActive&&this.rivalTimer<=0&&!this.hasTollGateNear(-95)){this.rivalActive=!0,this.rivalTimer=18;const w=this.playerX<0?2:1;this.isZoneClear(-95,w)?this.spawnEntity("rival_bus",pn[w],-95,1.12,2.75,this.speed-3.5,w):(this.rivalActive=!1,this.rivalTimer=4)}const E=1.08,S=2.65;for(let w=this.entities.length-1;w>=0;w--){const N=this.entities[w];if(N.z+=d-N.speed*s,N.dodgeTargetX!==null&&(N.x+=(N.dodgeTargetX-N.x)*Math.min(1,s*7),Math.abs(N.x-N.dodgeTargetX)<.05&&(N.x=N.dodgeTargetX,N.dodgeTargetX=null)),N.kind==="rival_bus"&&(N.speed=Math.max(16,this.speed-(this.nitroActive?14:2.2)),!N.hitResolved&&N.z>12)){N.hitResolved=!0,this.rivalActive=!1;const K=500;this.score+=K,this.takaEarned+=K,a.push({type:"rival_win",callout:"রেষারেষি জিতছেন ওস্তাদ! +৫০০ ৳",takaDelta:K})}const O=Math.abs(this.playerX-N.x),V=Math.abs(N.z),X=O<E+N.halfW-.16,W=V<S+N.halfL-.25;if(!N.hitResolved&&X&&W)N.hitResolved=!0,this.handleOverlap(N,a,n);else if(!N.nearMissed&&!N.hitResolved&&N.z>-.5&&N.z<5.5&&(N.kind==="plastic_sedan"||N.kind==="cargo_truck"||N.kind==="deshi_tesla"||N.kind==="cng")){const K=O-(E+N.halfW);K>=-.15&&K<=1.05&&(N.nearMissed=!0,this.handleNearMiss(N,a))}(N.z>24||N.z<-200)&&(N.kind==="rival_bus"&&(this.rivalActive=!1),this.entities.splice(w,1))}return a}raiseWanted(e){const t=this.wantedLevel;this.wantedLevel=Math.min(3,this.wantedLevel+1),this.wantedClearDist=this.distanceM+360,this.wantedLevel>t&&e.push({type:"wanted_up",callout:`⭐ ওয়ান্টেড লেভেল ${this.wantedLevel}! (${(1+this.wantedLevel*.35).toFixed(2)}x পয়েন্ট!)`,takaDelta:0})}handleOverlap(e,t,n){if(e.kind==="toll_gate"){const i=e.tollFee??Oh,s=e.tollLabel??"পদ্মা সেতু";if(this.nitroActive){this.score+=550,this.chapaniCombo+=1,this.comboTimer=4.5;const l=this.playerX<0?3:0;this.spawnEntity("sergeant",pn[l],-70,.65,.65,0,l),t.push({type:"toll_smash",callout:`🔥 টোল ব্যারিকেড ভেঙে ${s}-তে উড়াল! (+550 pts)`,takaDelta:0,x:this.playerX,z:e.z}),this.raiseWanted(t);return}if(this.takaEarned>=i){this.takaEarned-=i,this.totalTollPaid+=i;const o=this.feverActive?600:400;this.score+=o,this.nitroCharge=Math.min(100,this.nitroCharge+35),this.speed+=3,t.push({type:"toll_paid",callout:`🌉 ${s} টোল ৳${i} পরিশোধ! +${o} পয়েন্ট`,takaDelta:-i,x:this.playerX,z:e.z});return}const a=this.takaEarned;this.takaEarned=0,this.totalTollPaid+=a,this.invulnTimer<=0&&this.applyDamageOrGameOver(t,this.playerX,e.z,"toll_fine",`🚧 ভাড়া কম (টোল ৳${i})! ব্যারিকেডে ধাক্কা (-১ ❤️)`,`টোল (৳${i}) না দিয়ে ব্যারিকেডে ধাক্কা! মুড়ির টিন শেষ 💥`,-a);return}if(e.kind==="bus_stop"){const i=2+Math.floor(n()*3);this.passengers+=i;const s=i*45;this.takaEarned+=s,this.score+=s+80,t.push({type:"passenger_pickup",callout:`রানিংয়ে ${i} জন বাদুড়ঝোলা! +${s} ৳`,takaDelta:s,x:e.x,z:e.z}),this.advanceMission("passenger",i,t);return}if(e.kind==="wrench_pickup"){this.health<this.maxHealth?(this.health=Math.min(this.maxHealth,this.health+1),this.score+=100,t.push({type:"wrench_heal",callout:"ধোলাইখাল গিয়ার-রিপেয়ার! বাসের লাইফ +১ ⚙️",takaDelta:0,x:e.x,z:e.z})):(this.score+=200,this.nitroCharge=Math.min(100,this.nitroCharge+25),t.push({type:"wrench_heal",callout:"ফুল হেলথ সার্ভিস বোনাস! +২০০ pts ⚙️",takaDelta:0,x:e.x,z:e.z})),e.z=999;return}if(e.kind==="nitro_pickup"){this.nitroCharge=Math.min(100,this.nitroCharge+45),this.score+=120,t.push({type:"nitro_pickup",callout:"সিলিন্ডার ফুল গ্যাস! 🔥",takaDelta:0,x:e.x,z:e.z}),e.z=999;return}if(e.kind==="sergeant"){if(this.nitroActive)this.score+=300,this.takaEarned+=200,t.push({type:"sergeant_dodge",callout:"সার্জেন্টের সামনে দিয়ে উড়াল! +২০০ ৳",takaDelta:200,x:e.x,z:e.z}),this.raiseWanted(t);else{const i=Math.min(this.takaEarned,120+this.wantedLevel*40);this.takaEarned-=i,this.wantedLevel=Math.max(0,this.wantedLevel-1),t.push({type:"sergeant_fine",callout:`মামলা খাইছি ওস্তাদ! -${i} ৳`,takaDelta:-i,x:e.x,z:e.z})}return}if(e.kind==="wasa_pit"&&this.nitroActive){this.score+=300,this.takaEarned+=220,e.z=999,t.push({type:"pit_smash",callout:"নাইট্রো দিয়ে ব্যারিকেড উড়াই দিছেন! +২২০ ৳",takaDelta:220,x:e.x,z:e.z});return}if(!(this.invulnTimer>0)){if(this.nitroActive){e.dodgeTargetX=e.x>=this.playerX?6.5:-6.5,this.score+=150,t.push({type:"chapani",callout:"নাইট্রো ধাক্কায় রাস্তা ক্লিয়ার! +১৫০",takaDelta:0,x:e.x,z:e.z});return}this.applyDamageOrGameOver(t,e.x,e.z,"crash","রাস্তা কি তোর বাপের?! (-১ লাইফ)","মুড়ির টিন উল্টায়ে গেছে ওস্তাদ!! 💥",0)}}applyDamageOrGameOver(e,t,n,i,s,a,o){if(this.health-=1,this.invulnTimer=1.35,this.chapaniCombo=0,this.feverActive=!1,this.speed=Math.max(12,this.speed*.55),this.health<=0){if(this.raceMode){this.health=this.maxHealth,this.raceSlowdownTimer=2.2,this.invulnTimer=2.6,this.speed=9,e.push({type:"crash",callout:"💥 ধাক্কা! ২ সেকেন্ড স্পিড ডাউন — বন্ধু ওভারটেক করছে!",takaDelta:o,x:t,z:n});return}this.health=0,this.crashed=!0,e.push({type:"gameover",callout:a,takaDelta:o,x:this.playerX,z:0})}else e.push({type:i,callout:s,takaDelta:o,x:t,z:n})}handleNearMiss(e,t){this.chapaniCombo+=1,this.comboTimer=4.5;const n=this.feverActive;this.chapaniCombo>=4&&(this.feverActive=!0);const i=this.feverActive?1.5:1,s=1+this.wantedLevel*.35,a=1+(this.nitroLevel-1)*.15;if(e.kind==="deshi_tesla"){this.teslaDodges+=1;const o=Math.round((200+this.chapaniCombo*40)*a*i*s);this.score+=o,this.takaEarned+=o,this.nitroCharge=Math.min(100,this.nitroCharge+26),t.push({type:"tesla_dodge",callout:`দেশি টেসলা ডজ x${this.chapaniCombo}! +${o} ৳`,takaDelta:o,x:e.x,z:e.z}),this.advanceMission("tesla",1,t)}else{this.plasticScrapes+=1;const o=e.x<this.playerX,l=Math.round((130+this.chapaniCombo*35)*a*i*s);this.score+=l,this.takaEarned+=l,this.nitroCharge=Math.min(100,this.nitroCharge+22);const c=o?"বাম প্লাস্টিক":"ডান চাপানি";t.push({type:"chapani",callout:`${c} ক্লিয়ার x${this.chapaniCombo}! +${l} ৳`,takaDelta:l,x:e.x,z:e.z}),this.advanceMission("chapani",1,t)}!n&&this.feverActive&&t.push({type:"fever_mode",callout:"🔥 ফিভার মোড অন! ১.৫x পয়েন্ট বৃষ্টি!",takaDelta:0})}hasTollGateNear(e){return this.entities.some(t=>t.kind==="toll_gate"&&Math.abs(t.z-e)<30)}isZoneClear(e,t){return this.hasTollGateNear(e)?!1:!this.entities.some(n=>Math.abs(n.z-e)<18&&n.laneIndex===t)}spawnRandomRoadHazard(e){const t=Math.floor(e()*4),n=-128-e()*14;if(!this.isZoneClear(n,t))return;const i=new Set;for(const o of this.entities)o.kind!=="bus_stop"&&o.kind!=="wrench_pickup"&&o.kind!=="nitro_pickup"&&Math.abs(o.z-n)<22&&i.add(o.laneIndex);if(i.size>=2)return;const s=e(),a=this.wantedLevel>0?.86:.94;if(s<.34)this.spawnTrafficVehicle(n,t,"plastic_sedan");else if(s<.56)this.spawnTrafficVehicle(n,t,"cng");else if(s<.74)this.spawnEntity("deshi_tesla",pn[t],n,.7,1.15,-13-e()*5,t);else if(s<.88&&this.wantedLevel===0)this.spawnTrafficVehicle(n,t,"cargo_truck");else if(!this.isOnBridge&&this.currentBiome!=="flyover"&&s<a)this.spawnEntity("wasa_pit",pn[t],n,1.15,1,0,t);else{const o=e()<.5?0:3;if(this.isZoneClear(n,o)){const l=o===0?-4.7:4.7;this.spawnEntity("sergeant",l,n,.65,.65,0,o)}}}spawnTrafficVehicle(e,t,n){const i={plastic_sedan:{hw:.92,hl:2.05,spd:13.5},cng:{hw:.68,hl:1.12,spd:10.5},cargo_truck:{hw:1.15,hl:2.95,spd:11.5}}[n];this.spawnEntity(n,pn[t],e,i.hw,i.hl,i.spd,t)}spawnEntity(e,t,n,i,s,a,o){const l={id:this.nextEntityId++,kind:e,x:t,z:n,halfW:i,halfL:s,speed:a,laneIndex:o,nearMissed:!1,hitResolved:!1,hornDodged:!1,dodgeTargetX:null};return this.entities.push(l),l}}const Ho="murir_tin_3d_save_v1";function vc(){return{left:"KeyA",right:"KeyD",accelerate:"KeyW",brake:"KeyS",horn:"Space",nitro:"ShiftLeft",map:"KeyM",pause:"Escape"}}function zo(){return{playerName:"",taka:250,bestScore:0,bestDistanceM:0,selectedSkin:"classic_mirpur",unlockedSkins:["classic_mirpur"],unlockedHubs:["thakurgaon"],engineLevel:1,armorLevel:1,nitroLevel:1,soundEnabled:!0,voiceCalloutsEnabled:!1,sfxVolume:.85,engineVolume:.7,steerSensitivity:1,cameraMode:"chase",graphicsPreset:"high",showFps:!1,gamepadVibration:!0,keymap:vc()}}class zh{constructor(e=typeof localStorage<"u"?localStorage:null){this.storage=e,this.data=this.load()}data;load(){const e=zo();if(!this.storage)return e;try{const t=this.storage.getItem(Ho);if(!t)return e;const n=JSON.parse(t);return{...e,...n,playerName:typeof n.playerName=="string"?n.playerName.slice(0,24):"",unlockedSkins:Array.isArray(n.unlockedSkins)?n.unlockedSkins:["classic_mirpur"],unlockedHubs:Array.isArray(n.unlockedHubs)&&n.unlockedHubs.length>0?n.unlockedHubs:["thakurgaon"],keymap:{...e.keymap,...n.keymap??{}}}}catch{return e}}get(){return this.data}update(e){return e(this.data),this.save(),this.data}save(){if(this.storage)try{this.storage.setItem(Ho,JSON.stringify(this.data))}catch{}}reset(){return this.data=zo(),this.save(),this.data}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oo="175",Gh=0,Go=1,Vh=2,xc=1,yc=2,Mn=3,wn=0,Bt=1,cn=2,Hn=0,Pi=1,Vo=2,Wo=3,Xo=4,Wh=5,ni=100,Xh=101,$h=102,Yh=103,qh=104,jh=200,Kh=201,Zh=202,Jh=203,_a=204,va=205,Qh=206,ed=207,td=208,nd=209,id=210,sd=211,rd=212,ad=213,od=214,xa=0,ya=1,Ma=2,Ni=3,Sa=4,ba=5,Ea=6,Ta=7,Mc=0,ld=1,cd=2,zn=0,hd=1,dd=2,ud=3,lo=4,fd=5,pd=6,md=7,$o="attached",gd="detached",Sc=300,Ui=301,Fi=302,wa=303,Aa=304,br=306,Bi=1e3,Bn=1001,gr=1002,Dt=1003,bc=1004,ls=1005,Gt=1006,lr=1007,bn=1008,An=1009,Ec=1010,Tc=1011,ms=1012,co=1013,ai=1014,sn=1015,Es=1016,ho=1017,uo=1018,gs=1020,wc=35902,Ac=1021,Rc=1022,Kt=1023,Cc=1024,Ic=1025,_s=1026,vs=1027,fo=1028,po=1029,Pc=1030,mo=1031,go=1033,cr=33776,hr=33777,dr=33778,ur=33779,Ra=35840,Ca=35841,Ia=35842,Pa=35843,La=36196,Da=37492,Na=37496,Ua=37808,Fa=37809,Ba=37810,Oa=37811,ka=37812,Ha=37813,za=37814,Ga=37815,Va=37816,Wa=37817,Xa=37818,$a=37819,Ya=37820,qa=37821,fr=36492,ja=36494,Ka=36495,Lc=36283,Za=36284,Ja=36285,Qa=36286,xs=2300,ys=2301,Lr=2302,Yo=2400,qo=2401,jo=2402,_d=2500,vd=0,Dc=1,eo=2,xd=3200,yd=3201,Nc=0,Md=1,Fn="",ut="srgb",Ut="srgb-linear",_r="linear",it="srgb",hi=7680,Ko=519,Sd=512,bd=513,Ed=514,Uc=515,Td=516,wd=517,Ad=518,Rd=519,to=35044,Zo="300 es",En=2e3,vr=2001;class Vi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Jo=1234567;const ds=Math.PI/180,Oi=180/Math.PI;function rn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Tt[r&255]+Tt[r>>8&255]+Tt[r>>16&255]+Tt[r>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]).toLowerCase()}function He(r,e,t){return Math.max(e,Math.min(t,r))}function _o(r,e){return(r%e+e)%e}function Cd(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Id(r,e,t){return r!==e?(t-r)/(e-r):0}function us(r,e,t){return(1-t)*r+t*e}function Pd(r,e,t,n){return us(r,e,1-Math.exp(-t*n))}function Ld(r,e=1){return e-Math.abs(_o(r,e*2)-e)}function Dd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Nd(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Ud(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Fd(r,e){return r+Math.random()*(e-r)}function Bd(r){return r*(.5-Math.random())}function Od(r){r!==void 0&&(Jo=r);let e=Jo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kd(r){return r*ds}function Hd(r){return r*Oi}function zd(r){return(r&r-1)===0&&r!==0}function Gd(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Vd(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Wd(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),d=s((e-n)/2),u=a((e-n)/2),p=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*d,l*u,o*c);break;case"YZY":r.set(l*u,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*u,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*p,o*c);break;case"YXY":r.set(l*p,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function nn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function tt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Qn={DEG2RAD:ds,RAD2DEG:Oi,generateUUID:rn,clamp:He,euclideanModulo:_o,mapLinear:Cd,inverseLerp:Id,lerp:us,damp:Pd,pingpong:Ld,smoothstep:Dd,smootherstep:Nd,randInt:Ud,randFloat:Fd,randFloatSpread:Bd,seededRandom:Od,degToRad:kd,radToDeg:Hd,isPowerOfTwo:zd,ceilPowerOfTwo:Gd,floorPowerOfTwo:Vd,setQuaternionFromProperEuler:Wd,normalize:tt,denormalize:nn};class De{constructor(e=0,t=0){De.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Fe{constructor(e,t,n,i,s,a,o,l,c){Fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=i[0],m=i[3],f=i[6],b=i[1],x=i[4],v=i[7],C=i[2],A=i[5],R=i[8];return s[0]=a*_+o*b+l*C,s[3]=a*m+o*x+l*A,s[6]=a*f+o*v+l*R,s[1]=c*_+h*b+d*C,s[4]=c*m+h*x+d*A,s[7]=c*f+h*v+d*R,s[2]=u*_+p*b+g*C,s[5]=u*m+p*x+g*A,s[8]=u*f+p*v+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*s,p=c*s-a*l,g=t*d+n*u+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=u*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Dr.makeScale(e,t)),this}rotate(e){return this.premultiply(Dr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Dr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Dr=new Fe;function Fc(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ms(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Xd(){const r=Ms("canvas");return r.style.display="block",r}const Qo={};function pr(r){r in Qo||(Qo[r]=!0,console.warn(r))}function $d(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Yd(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function qd(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const el=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tl=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jd(){const r={enabled:!0,workingColorSpace:Ut,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===it&&(i.r=Tn(i.r),i.g=Tn(i.g),i.b=Tn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(i.r=Li(i.r),i.g=Li(i.g),i.b=Li(i.b))),i},fromWorkingColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},toWorkingColorSpace:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Fn?_r:this.spaces[i].transfer},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Ut]:{primaries:e,whitePoint:n,transfer:_r,toXYZ:el,fromXYZ:tl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ut},outputColorSpaceConfig:{drawingBufferColorSpace:ut}},[ut]:{primaries:e,whitePoint:n,transfer:it,toXYZ:el,fromXYZ:tl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ut}}}),r}const Xe=jd();function Tn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Li(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let di;class Kd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{di===void 0&&(di=Ms("canvas")),di.width=e.width,di.height=e.height;const i=di.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=di}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ms("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Tn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Tn(t[n]/255)*255):t[n]=Tn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zd=0;class vo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=rn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Nr(i[a].image)):s.push(Nr(i[a]))}else s=Nr(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Nr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Kd.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Jd=0;class vt extends Vi{constructor(e=vt.DEFAULT_IMAGE,t=vt.DEFAULT_MAPPING,n=Bn,i=Bn,s=Gt,a=bn,o=Kt,l=An,c=vt.DEFAULT_ANISOTROPY,h=Fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Jd++}),this.uuid=rn(),this.name="",this.source=new vo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new De(0,0),this.repeat=new De(1,1),this.center=new De(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Sc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bi:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case gr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bi:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case gr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}vt.DEFAULT_IMAGE=null;vt.DEFAULT_MAPPING=Sc;vt.DEFAULT_ANISOTROPY=1;class Ze{constructor(e=0,t=0,n=0,i=1){Ze.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,v=(p+1)/2,C=(f+1)/2,A=(h+u)/4,R=(d+_)/4,D=(g+m)/4;return x>v&&x>C?x<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(x),i=A/n,s=R/n):v>C?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=A/i,s=D/i):C<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(C),n=R/s,i=D/s),this.set(n,i,s,t),this}let b=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(d-_)/b,this.z=(u-h)/b,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qd extends Vi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ze(0,0,e,t),this.scissorTest=!1,this.viewport=new Ze(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new vt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new vo(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends Qd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Bc extends vt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class eu extends vt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=s[a+0],p=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==u||c!==p||h!==g){let m=1-o;const f=l*u+c*p+h*g+d*_,b=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const C=Math.sqrt(x),A=Math.atan2(C,f*b);m=Math.sin(m*A)/C,o=Math.sin(o*A)/C}const v=o*b;if(l=l*m+u*v,c=c*m+p*v,h=h*m+g*v,d=d*m+_*v,m===1-o){const C=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=C,c*=C,h*=C,d*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=s[a],u=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+h*d+l*p-c*u,e[t+1]=l*g+h*u+c*d-o*p,e[t+2]=c*g+h*p+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(s/2),u=l(n/2),p=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-i)*p}else if(n>o&&n>d){const p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+c)/p}else if(o>d){const p=2*Math.sqrt(1+o-n-d);this._w=(s-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-o);this._w=(a-i)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(nl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(nl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-s*d,this.z=i+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ur.copy(this).projectOnVector(e),this.sub(Ur)}reflect(e){return this.sub(Ur.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ur=new P,nl=new Vn;class Rn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Qt):Qt.fromBufferAttribute(s,a),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cs.copy(n.boundingBox)),Cs.applyMatrix4(e.matrixWorld),this.union(Cs)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ki),Is.subVectors(this.max,Ki),ui.subVectors(e.a,Ki),fi.subVectors(e.b,Ki),pi.subVectors(e.c,Ki),Cn.subVectors(fi,ui),In.subVectors(pi,fi),$n.subVectors(ui,pi);let t=[0,-Cn.z,Cn.y,0,-In.z,In.y,0,-$n.z,$n.y,Cn.z,0,-Cn.x,In.z,0,-In.x,$n.z,0,-$n.x,-Cn.y,Cn.x,0,-In.y,In.x,0,-$n.y,$n.x,0];return!Fr(t,ui,fi,pi,Is)||(t=[1,0,0,0,1,0,0,0,1],!Fr(t,ui,fi,pi,Is))?!1:(Ps.crossVectors(Cn,In),t=[Ps.x,Ps.y,Ps.z],Fr(t,ui,fi,pi,Is))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const mn=[new P,new P,new P,new P,new P,new P,new P,new P],Qt=new P,Cs=new Rn,ui=new P,fi=new P,pi=new P,Cn=new P,In=new P,$n=new P,Ki=new P,Is=new P,Ps=new P,Yn=new P;function Fr(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Yn.fromArray(r,s);const o=i.x*Math.abs(Yn.x)+i.y*Math.abs(Yn.y)+i.z*Math.abs(Yn.z),l=e.dot(Yn),c=t.dot(Yn),h=n.dot(Yn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const tu=new Rn,Zi=new P,Br=new P;class dn{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):tu.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zi.subVectors(e,this.center);const t=Zi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Zi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Br.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zi.copy(e.center).add(Br)),this.expandByPoint(Zi.copy(e.center).sub(Br))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const gn=new P,Or=new P,Ls=new P,Pn=new P,kr=new P,Ds=new P,Hr=new P;class Er{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=gn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gn.copy(this.origin).addScaledVector(this.direction,t),gn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Or.copy(e).add(t).multiplyScalar(.5),Ls.copy(t).sub(e).normalize(),Pn.copy(this.origin).sub(Or);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Ls),o=Pn.dot(this.direction),l=-Pn.dot(Ls),c=Pn.lengthSq(),h=Math.abs(1-a*a);let d,u,p,g;if(h>0)if(d=a*l-o,u=a*o-l,g=s*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Or).addScaledVector(Ls,u),p}intersectSphere(e,t){gn.subVectors(e.center,this.origin);const n=gn.dot(this.direction),i=gn.dot(gn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(s=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,gn)!==null}intersectTriangle(e,t,n,i,s){kr.subVectors(t,e),Ds.subVectors(n,e),Hr.crossVectors(kr,Ds);let a=this.direction.dot(Hr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Pn.subVectors(this.origin,e);const l=o*this.direction.dot(Ds.crossVectors(Pn,Ds));if(l<0)return null;const c=o*this.direction.dot(kr.cross(Pn));if(c<0||l+c>a)return null;const h=-o*Pn.dot(Hr);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ne{constructor(e,t,n,i,s,a,o,l,c,h,d,u,p,g,_,m){Ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,d,u,p,g,_,m)}set(e,t,n,i,s,a,o,l,c,h,d,u,p,g,_,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=i,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ne().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/mi.setFromMatrixColumn(e,0).length(),s=1/mi.setFromMatrixColumn(e,1).length(),a=1/mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=a*h,p=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,p=l*d,g=c*h,_=c*d;t[0]=u+_*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=_+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,p=l*d,g=c*h,_=c*d;t[0]=u-_*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=_-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,p=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-p,t[8]=u*c+_,t[1]=l*d,t[5]=_*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-u*d,t[8]=g*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+_,t[5]=a*h,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nu,e,iu)}lookAt(e,t,n){const i=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),Ln.crossVectors(n,Ht),Ln.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),Ln.crossVectors(n,Ht)),Ln.normalize(),Ns.crossVectors(Ht,Ln),i[0]=Ln.x,i[4]=Ns.x,i[8]=Ht.x,i[1]=Ln.y,i[5]=Ns.y,i[9]=Ht.y,i[2]=Ln.z,i[6]=Ns.z,i[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],b=n[3],x=n[7],v=n[11],C=n[15],A=i[0],R=i[4],D=i[8],E=i[12],S=i[1],w=i[5],N=i[9],O=i[13],V=i[2],X=i[6],W=i[10],K=i[14],G=i[3],se=i[7],de=i[11],xe=i[15];return s[0]=a*A+o*S+l*V+c*G,s[4]=a*R+o*w+l*X+c*se,s[8]=a*D+o*N+l*W+c*de,s[12]=a*E+o*O+l*K+c*xe,s[1]=h*A+d*S+u*V+p*G,s[5]=h*R+d*w+u*X+p*se,s[9]=h*D+d*N+u*W+p*de,s[13]=h*E+d*O+u*K+p*xe,s[2]=g*A+_*S+m*V+f*G,s[6]=g*R+_*w+m*X+f*se,s[10]=g*D+_*N+m*W+f*de,s[14]=g*E+_*O+m*K+f*xe,s[3]=b*A+x*S+v*V+C*G,s[7]=b*R+x*w+v*X+C*se,s[11]=b*D+x*N+v*W+C*de,s[15]=b*E+x*O+v*K+C*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+s*l*d-i*c*d-s*o*u+n*c*u+i*o*p-n*l*p)+_*(+t*l*p-t*c*u+s*a*u-i*a*p+i*c*h-s*l*h)+m*(+t*c*d-t*o*p-s*a*d+n*a*p+s*o*h-n*c*h)+f*(-i*o*h-t*l*d+t*o*u+i*a*d-n*a*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],b=d*m*c-_*u*c+_*l*p-o*m*p-d*l*f+o*u*f,x=g*u*c-h*m*c-g*l*p+a*m*p+h*l*f-a*u*f,v=h*_*c-g*d*c+g*o*p-a*_*p-h*o*f+a*d*f,C=g*d*l-h*_*l-g*o*u+a*_*u+h*o*m-a*d*m,A=t*b+n*x+i*v+s*C;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=b*R,e[1]=(_*u*s-d*m*s-_*i*p+n*m*p+d*i*f-n*u*f)*R,e[2]=(o*m*s-_*l*s+_*i*c-n*m*c-o*i*f+n*l*f)*R,e[3]=(d*l*s-o*u*s-d*i*c+n*u*c+o*i*p-n*l*p)*R,e[4]=x*R,e[5]=(h*m*s-g*u*s+g*i*p-t*m*p-h*i*f+t*u*f)*R,e[6]=(g*l*s-a*m*s-g*i*c+t*m*c+a*i*f-t*l*f)*R,e[7]=(a*u*s-h*l*s+h*i*c-t*u*c-a*i*p+t*l*p)*R,e[8]=v*R,e[9]=(g*d*s-h*_*s-g*n*p+t*_*p+h*n*f-t*d*f)*R,e[10]=(a*_*s-g*o*s+g*n*c-t*_*c-a*n*f+t*o*f)*R,e[11]=(h*o*s-a*d*s-h*n*c+t*d*c+a*n*p-t*o*p)*R,e[12]=C*R,e[13]=(h*_*i-g*d*i+g*n*u-t*_*u-h*n*m+t*d*m)*R,e[14]=(g*o*i-a*_*i-g*n*l+t*_*l+a*n*m-t*o*m)*R,e[15]=(a*d*i-h*o*i+h*n*l-t*d*l-a*n*u+t*o*u)*R,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,u=s*c,p=s*h,g=s*d,_=a*h,m=a*d,f=o*d,b=l*c,x=l*h,v=l*d,C=n.x,A=n.y,R=n.z;return i[0]=(1-(_+f))*C,i[1]=(p+v)*C,i[2]=(g-x)*C,i[3]=0,i[4]=(p-v)*A,i[5]=(1-(u+f))*A,i[6]=(m+b)*A,i[7]=0,i[8]=(g+x)*R,i[9]=(m-b)*R,i[10]=(1-(u+_))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=mi.set(i[0],i[1],i[2]).length();const a=mi.set(i[4],i[5],i[6]).length(),o=mi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],en.copy(this);const c=1/s,h=1/a,d=1/o;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=h,en.elements[5]*=h,en.elements[6]*=h,en.elements[8]*=d,en.elements[9]*=d,en.elements[10]*=d,t.setFromRotationMatrix(en),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=En){const l=this.elements,c=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),u=(n+i)/(n-i);let p,g;if(o===En)p=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===vr)p=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=En){const l=this.elements,c=1/(t-e),h=1/(n-i),d=1/(a-s),u=(t+e)*c,p=(n+i)*h;let g,_;if(o===En)g=(a+s)*d,_=-2*d;else if(o===vr)g=s*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const mi=new P,en=new Ne,nu=new P(0,0,0),iu=new P(1,1,1),Ln=new P,Ns=new P,Ht=new P,il=new Ne,sl=new Vn;class hn{constructor(e=0,t=0,n=0,i=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(He(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-He(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return il.makeRotationFromQuaternion(e),this.setFromRotationMatrix(il,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sl.setFromEuler(this),this.setFromQuaternion(sl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class Oc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let su=0;const rl=new P,gi=new Vn,_n=new Ne,Us=new P,Ji=new P,ru=new P,au=new Vn,al=new P(1,0,0),ol=new P(0,1,0),ll=new P(0,0,1),cl={type:"added"},ou={type:"removed"},_i={type:"childadded",child:null},zr={type:"childremoved",child:null};class ot extends Vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ot.DEFAULT_UP.clone();const e=new P,t=new hn,n=new Vn,i=new P(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ne},normalMatrix:{value:new Fe}}),this.matrix=new Ne,this.matrixWorld=new Ne,this.matrixAutoUpdate=ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Oc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(al,e)}rotateY(e){return this.rotateOnAxis(ol,e)}rotateZ(e){return this.rotateOnAxis(ll,e)}translateOnAxis(e,t){return rl.copy(e).applyQuaternion(this.quaternion),this.position.add(rl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(al,e)}translateY(e){return this.translateOnAxis(ol,e)}translateZ(e){return this.translateOnAxis(ll,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Us.copy(e):Us.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Ji,Us,this.up):_n.lookAt(Us,Ji,this.up),this.quaternion.setFromRotationMatrix(_n),i&&(_n.extractRotation(i.matrixWorld),gi.setFromRotationMatrix(_n),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cl),_i.child=e,this.dispatchEvent(_i),_i.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ou),zr.child=e,this.dispatchEvent(zr),zr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),_n.multiply(e.parent.matrixWorld)),e.applyMatrix4(_n),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cl),_i.child=e,this.dispatchEvent(_i),_i.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,e,ru),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,au,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ot.DEFAULT_UP=new P(0,1,0);ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new P,vn=new P,Gr=new P,xn=new P,vi=new P,xi=new P,hl=new P,Vr=new P,Wr=new P,Xr=new P,$r=new Ze,Yr=new Ze,qr=new Ze;class jt{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),tn.subVectors(e,t),i.cross(tn);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){tn.subVectors(i,t),vn.subVectors(n,t),Gr.subVectors(e,t);const a=tn.dot(tn),o=tn.dot(vn),l=tn.dot(Gr),c=vn.dot(vn),h=vn.dot(Gr),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const u=1/d,p=(c*l-o*h)*u,g=(a*h-o*l)*u;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,xn)===null?!1:xn.x>=0&&xn.y>=0&&xn.x+xn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xn.x),l.addScaledVector(a,xn.y),l.addScaledVector(o,xn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return $r.setScalar(0),Yr.setScalar(0),qr.setScalar(0),$r.fromBufferAttribute(e,t),Yr.fromBufferAttribute(e,n),qr.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector($r,s.x),a.addScaledVector(Yr,s.y),a.addScaledVector(qr,s.z),a}static isFrontFacing(e,t,n,i){return tn.subVectors(n,t),vn.subVectors(e,t),tn.cross(vn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),tn.cross(vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return jt.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;vi.subVectors(i,n),xi.subVectors(s,n),Vr.subVectors(e,n);const l=vi.dot(Vr),c=xi.dot(Vr);if(l<=0&&c<=0)return t.copy(n);Wr.subVectors(e,i);const h=vi.dot(Wr),d=xi.dot(Wr);if(h>=0&&d<=h)return t.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(vi,a);Xr.subVectors(e,s);const p=vi.dot(Xr),g=xi.dot(Xr);if(g>=0&&p<=g)return t.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(xi,o);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return hl.subVectors(s,i),o=(d-h)/(d-h+(p-g)),t.copy(i).addScaledVector(hl,o);const f=1/(m+_+u);return a=_*f,o=u*f,t.copy(n).addScaledVector(vi,a).addScaledVector(xi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function jr(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Me{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=_o(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=jr(a,s,e+1/3),this.g=jr(a,s,e),this.b=jr(a,s,e-1/3)}return Xe.toWorkingColorSpace(this,i),this}setStyle(e,t=ut){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ut){const n=kc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Tn(e.r),this.g=Tn(e.g),this.b=Tn(e.b),this}copyLinearToSRGB(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ut){return Xe.fromWorkingColorSpace(wt.copy(this),e),Math.round(He(wt.r*255,0,255))*65536+Math.round(He(wt.g*255,0,255))*256+Math.round(He(wt.b*255,0,255))}getHexString(e=ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.fromWorkingColorSpace(wt.copy(this),t);const n=wt.r,i=wt.g,s=wt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=ut){Xe.fromWorkingColorSpace(wt.copy(this),e);const t=wt.r,n=wt.g,i=wt.b;return e!==ut?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Dn),this.setHSL(Dn.h+e,Dn.s+t,Dn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Dn),e.getHSL(Fs);const n=us(Dn.h,Fs.h,t),i=us(Dn.s,Fs.s,t),s=us(Dn.l,Fs.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new Me;Me.NAMES=kc;let lu=0;class an extends Vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=rn(),this.name="",this.type="Material",this.blending=Pi,this.side=wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_a,this.blendDst=va,this.blendEquation=ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ko,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hi,this.stencilZFail=hi,this.stencilZPass=hi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(n.blending=this.blending),this.side!==wn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_a&&(n.blendSrc=this.blendSrc),this.blendDst!==va&&(n.blendDst=this.blendDst),this.blendEquation!==ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ko&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class pt extends an{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Mc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new P,Bs=new De;let cu=0;class Nt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=to,this.updateRanges=[],this.gpuType=sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Bs.fromBufferAttribute(this,t),Bs.applyMatrix3(e),this.setXY(t,Bs.x,Bs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),i=tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),i=tt(i,this.array),s=tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==to&&(e.usage=this.usage),e}}class Hc extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class zc extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class St extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let hu=0;const $t=new Ne,Kr=new ot,yi=new P,zt=new Rn,Qi=new Rn,Mt=new P;class Ot extends Vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hu++}),this.uuid=rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fc(e)?zc:Hc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Fe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return Kr.lookAt(e),Kr.updateMatrix(),this.applyMatrix4(Kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(yi).negate(),this.translate(yi.x,yi.y,yi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new St(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];zt.setFromBufferAttribute(s),this.morphTargetsRelative?(Mt.addVectors(this.boundingBox.min,zt.min),this.boundingBox.expandByPoint(Mt),Mt.addVectors(this.boundingBox.max,zt.max),this.boundingBox.expandByPoint(Mt)):(this.boundingBox.expandByPoint(zt.min),this.boundingBox.expandByPoint(zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(zt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(Mt.addVectors(zt.min,Qi.min),zt.expandByPoint(Mt),Mt.addVectors(zt.max,Qi.max),zt.expandByPoint(Mt)):(zt.expandByPoint(Qi.min),zt.expandByPoint(Qi.max))}zt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Mt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Mt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Mt.fromBufferAttribute(o,c),l&&(yi.fromBufferAttribute(e,c),Mt.add(yi)),i=Math.max(i,n.distanceToSquared(Mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let D=0;D<n.count;D++)o[D]=new P,l[D]=new P;const c=new P,h=new P,d=new P,u=new De,p=new De,g=new De,_=new P,m=new P;function f(D,E,S){c.fromBufferAttribute(n,D),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,S),u.fromBufferAttribute(s,D),p.fromBufferAttribute(s,E),g.fromBufferAttribute(s,S),h.sub(c),d.sub(c),p.sub(u),g.sub(u);const w=1/(p.x*g.y-g.x*p.y);isFinite(w)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(w),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(w),o[D].add(_),o[E].add(_),o[S].add(_),l[D].add(m),l[E].add(m),l[S].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let D=0,E=b.length;D<E;++D){const S=b[D],w=S.start,N=S.count;for(let O=w,V=w+N;O<V;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const x=new P,v=new P,C=new P,A=new P;function R(D){C.fromBufferAttribute(i,D),A.copy(C);const E=o[D];x.copy(E),x.sub(C.multiplyScalar(C.dot(E))).normalize(),v.crossVectors(A,E);const w=v.dot(l[D])<0?-1:1;a.setXYZW(D,x.x,x.y,x.z,w)}for(let D=0,E=b.length;D<E;++D){const S=b[D],w=S.start,N=S.count;for(let O=w,V=w+N;O<V;O+=3)R(e.getX(O+0)),R(e.getX(O+1)),R(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const i=new P,s=new P,a=new P,o=new P,l=new P,c=new P,h=new P,d=new P;if(e)for(let u=0,p=e.count;u<p;u+=3){const g=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)i.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mt.fromBufferAttribute(e,t),Mt.normalize(),e.setXYZ(t,Mt.x,Mt.y,Mt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new Nt(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ot,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const dl=new Ne,qn=new Er,Os=new dn,ul=new P,ks=new P,Hs=new P,zs=new P,Zr=new P,Gs=new P,fl=new P,Vs=new P;class ee extends ot{constructor(e=new Ot,t=new pt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){Gs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],d=s[l];h!==0&&(Zr.fromBufferAttribute(d,e),a?Gs.addScaledVector(Zr,h):Gs.addScaledVector(Zr.sub(t),h))}t.add(Gs)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Os.copy(n.boundingSphere),Os.applyMatrix4(s),qn.copy(e.ray).recast(e.near),!(Os.containsPoint(qn.origin)===!1&&(qn.intersectSphere(Os,ul)===null||qn.origin.distanceToSquared(ul)>(e.far-e.near)**2))&&(dl.copy(s).invert(),qn.copy(e.ray).applyMatrix4(dl),!(n.boundingBox!==null&&qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qn)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=b,C=x;v<C;v+=3){const A=o.getX(v),R=o.getX(v+1),D=o.getX(v+2);i=Ws(this,f,e,n,c,h,d,A,R,D),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const b=o.getX(m),x=o.getX(m+1),v=o.getX(m+2);i=Ws(this,a,e,n,c,h,d,b,x,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=a[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=b,C=x;v<C;v+=3){const A=v,R=v+1,D=v+2;i=Ws(this,f,e,n,c,h,d,A,R,D),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const b=m,x=m+1,v=m+2;i=Ws(this,a,e,n,c,h,d,b,x,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function du(r,e,t,n,i,s,a,o){let l;if(e.side===Bt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===wn,o),l===null)return null;Vs.copy(o),Vs.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(Vs);return c<t.near||c>t.far?null:{distance:c,point:Vs.clone(),object:r}}function Ws(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,ks),r.getVertexPosition(l,Hs),r.getVertexPosition(c,zs);const h=du(r,e,t,n,ks,Hs,zs,fl);if(h){const d=new P;jt.getBarycoord(fl,ks,Hs,zs,d),i&&(h.uv=jt.getInterpolatedAttribute(i,o,l,c,d,new De)),s&&(h.uv1=jt.getInterpolatedAttribute(s,o,l,c,d,new De)),a&&(h.normal=jt.getInterpolatedAttribute(a,o,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new P,materialIndex:0};jt.getNormal(ks,Hs,zs,u.normal),h.face=u,h.barycoord=d}return h}class Pe extends Ot{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new St(c,3)),this.setAttribute("normal",new St(h,3)),this.setAttribute("uv",new St(d,2));function g(_,m,f,b,x,v,C,A,R,D,E){const S=v/R,w=C/D,N=v/2,O=C/2,V=A/2,X=R+1,W=D+1;let K=0,G=0;const se=new P;for(let de=0;de<W;de++){const xe=de*w-O;for(let ke=0;ke<X;ke++){const st=ke*S-N;se[_]=st*b,se[m]=xe*x,se[f]=V,c.push(se.x,se.y,se.z),se[_]=0,se[m]=0,se[f]=A>0?1:-1,h.push(se.x,se.y,se.z),d.push(ke/R),d.push(1-de/D),K+=1}}for(let de=0;de<D;de++)for(let xe=0;xe<R;xe++){const ke=u+xe+X*de,st=u+xe+X*(de+1),Y=u+(xe+1)+X*(de+1),te=u+(xe+1)+X*de;l.push(ke,st,te),l.push(st,Y,te),G+=6}o.addGroup(p,G,E),p+=G,u+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ki(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Lt(r){const e={};for(let t=0;t<r.length;t++){const n=ki(r[t]);for(const i in n)e[i]=n[i]}return e}function uu(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Gc(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const fu={clone:ki,merge:Lt};var pu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends an{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pu,this.fragmentShader=mu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ki(e.uniforms),this.uniformsGroups=uu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Vc extends ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ne,this.projectionMatrix=new Ne,this.projectionMatrixInverse=new Ne,this.coordinateSystem=En}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new P,pl=new De,ml=new De;class Ct extends Vc{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Oi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Oi*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z)}getViewSize(e,t){return this.getViewBounds(e,pl,ml),t.subVectors(ml,pl)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ds*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Mi=-90,Si=1;class gu extends ot{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ct(Mi,Si,e,t);i.layers=this.layers,this.add(i);const s=new Ct(Mi,Si,e,t);s.layers=this.layers,this.add(s);const a=new Ct(Mi,Si,e,t);a.layers=this.layers,this.add(a);const o=new Ct(Mi,Si,e,t);o.layers=this.layers,this.add(o);const l=new Ct(Mi,Si,e,t);l.layers=this.layers,this.add(l);const c=new Ct(Mi,Si,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===vr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Wc extends vt{constructor(e=[],t=Ui,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class _u extends oi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Wc(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Pe(5,5,5),s=new Gn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Bt,blending:Hn});s.uniforms.tEquirect.value=t;const a=new ee(i,s),o=t.minFilter;return t.minFilter===bn&&(t.minFilter=Gt),new gu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}class Le extends ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const vu={type:"move"};class Jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vu)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Le;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class xr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Me(e),this.near=t,this.far=n}clone(){return new xr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Xc extends ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class $c{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=to,this.updateRanges=[],this.version=0,this.uuid=rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Pt=new P;class Ss{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=tt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=nn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=nn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=nn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=nn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),i=tt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),n=tt(n,this.array),i=tt(i,this.array),s=tt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ss(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Yc extends an{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let bi;const es=new P,Ei=new P,Ti=new P,wi=new De,ts=new De,qc=new Ne,Xs=new P,ns=new P,$s=new P,gl=new De,Qr=new De,_l=new De;class xu extends ot{constructor(e=new Yc){if(super(),this.isSprite=!0,this.type="Sprite",bi===void 0){bi=new Ot;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $c(t,5);bi.setIndex([0,1,2,0,2,3]),bi.setAttribute("position",new Ss(n,3,0,!1)),bi.setAttribute("uv",new Ss(n,2,3,!1))}this.geometry=bi,this.material=e,this.center=new De(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ei.setFromMatrixScale(this.matrixWorld),qc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ti.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ei.multiplyScalar(-Ti.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const a=this.center;Ys(Xs.set(-.5,-.5,0),Ti,a,Ei,i,s),Ys(ns.set(.5,-.5,0),Ti,a,Ei,i,s),Ys($s.set(.5,.5,0),Ti,a,Ei,i,s),gl.set(0,0),Qr.set(1,0),_l.set(1,1);let o=e.ray.intersectTriangle(Xs,ns,$s,!1,es);if(o===null&&(Ys(ns.set(-.5,.5,0),Ti,a,Ei,i,s),Qr.set(0,1),o=e.ray.intersectTriangle(Xs,$s,ns,!1,es),o===null))return;const l=e.ray.origin.distanceTo(es);l<e.near||l>e.far||t.push({distance:l,point:es.clone(),uv:jt.getInterpolation(es,Xs,ns,$s,gl,Qr,_l,new De),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ys(r,e,t,n,i,s){wi.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(ts.x=s*wi.x-i*wi.y,ts.y=i*wi.x+s*wi.y):ts.copy(wi),r.copy(e),r.x+=ts.x,r.y+=ts.y,r.applyMatrix4(qc)}const vl=new P,xl=new Ze,yl=new Ze,yu=new P,Ml=new Ne,qs=new P,ea=new dn,Sl=new Ne,ta=new Er;class Mu extends ee{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=$o,this.bindMatrix=new Ne,this.bindMatrixInverse=new Ne,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Rn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qs),this.boundingBox.expandByPoint(qs)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new dn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,qs),this.boundingSphere.expandByPoint(qs)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ea.copy(this.boundingSphere),ea.applyMatrix4(i),e.ray.intersectsSphere(ea)!==!1&&(Sl.copy(i).invert(),ta.copy(e.ray).applyMatrix4(Sl),!(this.boundingBox!==null&&ta.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ta)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ze,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===$o?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===gd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;xl.fromBufferAttribute(i.attributes.skinIndex,e),yl.fromBufferAttribute(i.attributes.skinWeight,e),vl.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=yl.getComponent(s);if(a!==0){const o=xl.getComponent(s);Ml.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(yu.copy(vl).applyMatrix4(Ml),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class jc extends ot{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Kc extends vt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=Dt,h=Dt,d,u){super(null,a,o,l,c,h,i,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const bl=new Ne,Su=new Ne;class xo{constructor(e=[],t=[]){this.uuid=rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ne)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ne;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:Su;bl.multiplyMatrices(o,t[s]),bl.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new xo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Kc(t,e,e,Kt,sn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new jc),this.bones.push(a),this.boneInverses.push(new Ne().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class no extends Nt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ai=new Ne,El=new Ne,js=[],Tl=new Rn,bu=new Ne,is=new ee,ss=new dn;class Eu extends ee{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new no(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,bu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Rn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ai),Tl.copy(e.boundingBox).applyMatrix4(Ai),this.boundingBox.union(Tl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new dn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ai),ss.copy(e.boundingSphere).applyMatrix4(Ai),this.boundingSphere.union(ss)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(is.geometry=this.geometry,is.material=this.material,is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ss.copy(this.boundingSphere),ss.applyMatrix4(n),e.ray.intersectsSphere(ss)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Ai),El.multiplyMatrices(n,Ai),is.matrixWorld=El,is.raycast(e,js);for(let a=0,o=js.length;a<o;a++){const l=js[a];l.instanceId=s,l.object=this,t.push(l)}js.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new no(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Kc(new Float32Array(i*this.count),i,this.count,fo,sn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const na=new P,Tu=new P,wu=new Fe;class ei{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=na.subVectors(n,t).cross(Tu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(na),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||wu.getNormalMatrix(e),i=this.coplanarPoint(na).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const jn=new dn,Ks=new P;class yo{constructor(e=new ei,t=new ei,n=new ei,i=new ei,s=new ei,a=new ei){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En){const n=this.planes,i=e.elements,s=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],d=i[6],u=i[7],p=i[8],g=i[9],_=i[10],m=i[11],f=i[12],b=i[13],x=i[14],v=i[15];if(n[0].setComponents(l-s,u-c,m-p,v-f).normalize(),n[1].setComponents(l+s,u+c,m+p,v+f).normalize(),n[2].setComponents(l+a,u+h,m+g,v+b).normalize(),n[3].setComponents(l-a,u-h,m-g,v-b).normalize(),n[4].setComponents(l-o,u-d,m-_,v-x).normalize(),t===En)n[5].setComponents(l+o,u+d,m+_,v+x).normalize();else if(t===vr)n[5].setComponents(o,d,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),jn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),jn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(jn)}intersectsSprite(e){return jn.center.set(0,0,0),jn.radius=.7071067811865476,jn.applyMatrix4(e.matrixWorld),this.intersectsSphere(jn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Ks.x=i.normal.x>0?e.max.x:e.min.x,Ks.y=i.normal.y>0?e.max.y:e.min.y,Ks.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ks)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Zc extends an{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const yr=new P,Mr=new P,wl=new Ne,rs=new Er,Zs=new dn,ia=new P,Al=new P;class Mo extends ot{constructor(e=new Ot,t=new Zc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)yr.fromBufferAttribute(t,i-1),Mr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=yr.distanceTo(Mr);e.setAttribute("lineDistance",new St(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(i),Zs.radius+=s,e.ray.intersectsSphere(Zs)===!1)return;wl.copy(i).invert(),rs.copy(e.ray).applyMatrix4(wl);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=h.getX(_),b=h.getX(_+1),x=Js(this,e,rs,l,f,b,_);x&&t.push(x)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),f=Js(this,e,rs,l,_,m,g-1);f&&t.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const f=Js(this,e,rs,l,_,_+1,_);f&&t.push(f)}if(this.isLineLoop){const _=Js(this,e,rs,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Js(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(yr.fromBufferAttribute(o,i),Mr.fromBufferAttribute(o,s),t.distanceSqToSegment(yr,Mr,ia,Al)>n)return;ia.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(ia);if(!(c<e.near||c>e.far))return{distance:c,point:Al.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Rl=new P,Cl=new P;class Au extends Mo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Rl.fromBufferAttribute(t,i),Cl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Rl.distanceTo(Cl);e.setAttribute("lineDistance",new St(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ru extends Mo{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Jc extends an{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Il=new Ne,io=new Er,Qs=new dn,er=new P;class Cu extends ot{constructor(e=new Ot,t=new Jc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(i),Qs.radius+=s,e.ray.intersectsSphere(Qs)===!1)return;Il.copy(i).invert(),io.copy(e.ray).applyMatrix4(Il);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=u,_=p;g<_;g++){const m=c.getX(g);er.fromBufferAttribute(d,m),Pl(er,m,l,i,e,t,this)}}else{const u=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let g=u,_=p;g<_;g++)er.fromBufferAttribute(d,g),Pl(er,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Pl(r,e,t,n,i,s,a){const o=io.distanceSqToPoint(r);if(o<t){const l=new P;io.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class cs extends vt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qc extends vt{constructor(e,t,n=ai,i,s,a,o=Dt,l=Dt,c,h=_s){if(h!==_s&&h!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new vo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class qt extends Ot{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],d=[],u=[],p=[];let g=0;const _=[],m=n/2;let f=0;b(),a===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new St(d,3)),this.setAttribute("normal",new St(u,3)),this.setAttribute("uv",new St(p,2));function b(){const v=new P,C=new P;let A=0;const R=(t-e)/n;for(let D=0;D<=s;D++){const E=[],S=D/s,w=S*(t-e)+e;for(let N=0;N<=i;N++){const O=N/i,V=O*l+o,X=Math.sin(V),W=Math.cos(V);C.x=w*X,C.y=-S*n+m,C.z=w*W,d.push(C.x,C.y,C.z),v.set(X,R,W).normalize(),u.push(v.x,v.y,v.z),p.push(O,1-S),E.push(g++)}_.push(E)}for(let D=0;D<i;D++)for(let E=0;E<s;E++){const S=_[E][D],w=_[E+1][D],N=_[E+1][D+1],O=_[E][D+1];(e>0||E!==0)&&(h.push(S,w,O),A+=3),(t>0||E!==s-1)&&(h.push(w,N,O),A+=3)}c.addGroup(f,A,0),f+=A}function x(v){const C=g,A=new De,R=new P;let D=0;const E=v===!0?e:t,S=v===!0?1:-1;for(let N=1;N<=i;N++)d.push(0,m*S,0),u.push(0,S,0),p.push(.5,.5),g++;const w=g;for(let N=0;N<=i;N++){const V=N/i*l+o,X=Math.cos(V),W=Math.sin(V);R.x=E*W,R.y=m*S,R.z=E*X,d.push(R.x,R.y,R.z),u.push(0,S,0),A.x=X*.5+.5,A.y=W*.5*S+.5,p.push(A.x,A.y),g++}for(let N=0;N<i;N++){const O=C+N,V=w+N;v===!0?h.push(V,V+1,O):h.push(V+1,V,O),D+=3}c.addGroup(f,D,v===!0?1:2),f+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ii extends qt{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ii(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Rt extends Ot{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=e/o,u=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const b=f*u-a;for(let x=0;x<c;x++){const v=x*d-s;g.push(v,-b,0),_.push(0,0,1),m.push(x/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){const x=b+c*f,v=b+c*(f+1),C=b+1+c*(f+1),A=b+1+c*f;p.push(x,v,A),p.push(v,C,A)}this.setIndex(p),this.setAttribute("position",new St(g,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rt(e.width,e.height,e.widthSegments,e.heightSegments)}}class fs extends Ot{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new P,u=new P,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const b=[],x=f/n;let v=0;f===0&&a===0?v=.5/t:f===n&&l===Math.PI&&(v=-.5/t);for(let C=0;C<=t;C++){const A=C/t;d.x=-e*Math.cos(i+A*s)*Math.sin(a+x*o),d.y=e*Math.cos(a+x*o),d.z=e*Math.sin(i+A*s)*Math.sin(a+x*o),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(A+v,1-x),b.push(c++)}h.push(b)}for(let f=0;f<n;f++)for(let b=0;b<t;b++){const x=h[f][b+1],v=h[f][b],C=h[f+1][b],A=h[f+1][b+1];(f!==0||a>0)&&p.push(x,v,A),(f!==n-1||l<Math.PI)&&p.push(v,C,A)}this.setIndex(p),this.setAttribute("position",new St(g,3)),this.setAttribute("normal",new St(_,3)),this.setAttribute("uv",new St(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class bs extends Ot{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new P,d=new P,u=new P;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*s,m=p/n*Math.PI*2;d.x=(e+t*Math.cos(m))*Math.cos(_),d.y=(e+t*Math.cos(m))*Math.sin(_),d.z=t*Math.sin(m),o.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,f=(i+1)*(p-1)+g,b=(i+1)*p+g;a.push(_,m,b),a.push(m,f,b)}this.setIndex(a),this.setAttribute("position",new St(o,3)),this.setAttribute("normal",new St(l,3)),this.setAttribute("uv",new St(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new bs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ee extends an{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nc,this.normalScale=new De(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class un extends Ee{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new De(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return He(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Iu extends an{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Pu extends an{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function tr(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Lu(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Du(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Ll(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function eh(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class Ts{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Nu extends Ts{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yo,endingEnd:Yo}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case qo:s=e,o=2*t-n;break;case jo:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case qo:a=e,l=2*n-t;break;case jo:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,f=-u*m+2*u*_-u*g,b=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*g+1,x=(-1-p)*m+(1.5+p)*_+.5*g,v=p*m-p*_;for(let C=0;C!==o;++C)s[C]=f*a[h+C]+b*a[c+C]+x*a[l+C]+v*a[d+C];return s}}class Uu extends Ts{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),d=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*d+a[l+u]*h;return s}}class Fu extends Ts{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class on{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=tr(t,this.TimeBufferType),this.values=tr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:tr(e.times,Array),values:tr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Fu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Uu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Nu(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case xs:t=this.InterpolantFactoryMethodDiscrete;break;case ys:t=this.InterpolantFactoryMethodLinear;break;case Lr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return xs;case this.InterpolantFactoryMethodLinear:return ys;case this.InterpolantFactoryMethodSmooth:return Lr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Lu(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Lr,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const d=o*n,u=d-n,p=d+n;for(let g=0;g!==n;++g){const _=t[d+g];if(_!==t[u+g]||_!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const d=o*n,u=a*n;for(let p=0;p!==n;++p)t[u+p]=t[d+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}on.prototype.ValueTypeName="";on.prototype.TimeBufferType=Float32Array;on.prototype.ValueBufferType=Float32Array;on.prototype.DefaultInterpolation=ys;class Wi extends on{constructor(e,t,n){super(e,t,n)}}Wi.prototype.ValueTypeName="bool";Wi.prototype.ValueBufferType=Array;Wi.prototype.DefaultInterpolation=xs;Wi.prototype.InterpolantFactoryMethodLinear=void 0;Wi.prototype.InterpolantFactoryMethodSmooth=void 0;class th extends on{constructor(e,t,n,i){super(e,t,n,i)}}th.prototype.ValueTypeName="color";class Hi extends on{constructor(e,t,n,i){super(e,t,n,i)}}Hi.prototype.ValueTypeName="number";class Bu extends Ts{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Vn.slerpFlat(s,0,a,c-o,a,c,l);return s}}class zi extends on{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Bu(this.times,this.values,this.getValueSize(),e)}}zi.prototype.ValueTypeName="quaternion";zi.prototype.InterpolantFactoryMethodSmooth=void 0;class Xi extends on{constructor(e,t,n){super(e,t,n)}}Xi.prototype.ValueTypeName="string";Xi.prototype.ValueBufferType=Array;Xi.prototype.DefaultInterpolation=xs;Xi.prototype.InterpolantFactoryMethodLinear=void 0;Xi.prototype.InterpolantFactoryMethodSmooth=void 0;class Gi extends on{constructor(e,t,n,i){super(e,t,n,i)}}Gi.prototype.ValueTypeName="vector";class Ou{constructor(e="",t=-1,n=[],i=_d){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=rn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Hu(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=n.length;s!==a;++s)t.push(on.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Du(l);l=Ll(l,1,h),c=Ll(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new Hi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const d=h[1];let u=i[d];u||(i[d]=u=[]),u.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(d,u,p,g,_){if(p.length!==0){const m=[],f=[];eh(p,m,f,g),m.length!==0&&_.push(new d(u,m,f))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const u=c[d].keys;if(!(!u||u.length===0))if(u[0].morphTargets){const p={};let g;for(g=0;g<u.length;g++)if(u[g].morphTargets)for(let _=0;_<u[g].morphTargets.length;_++)p[u[g].morphTargets[_]]=-1;for(const _ in p){const m=[],f=[];for(let b=0;b!==u[g].morphTargets.length;++b){const x=u[g];m.push(x.time),f.push(x.morphTarget===_?1:0)}i.push(new Hi(".morphTargetInfluence["+_+"]",m,f))}l=p.length*a}else{const p=".bones["+t[d].name+"]";n(Gi,p+".position",u,"pos",i),n(zi,p+".quaternion",u,"rot",i),n(Gi,p+".scale",u,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function ku(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Hi;case"vector":case"vector2":case"vector3":case"vector4":return Gi;case"color":return th;case"quaternion":return zi;case"bool":case"boolean":return Wi;case"string":return Xi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Hu(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=ku(r.type);if(r.times===void 0){const t=[],n=[];eh(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const On={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class zu{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const Gu=new zu;class $i{constructor(e){this.manager=e!==void 0?e:Gu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}$i.DEFAULT_MATERIAL_NAME="__DEFAULT";const yn={};class Vu extends Error{constructor(e,t){super(e),this.response=t}}class nh extends $i{constructor(e){super(e),this.mimeType="",this.responseType=""}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=On.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(yn[e]!==void 0){yn[e].push({onLoad:t,onProgress:n,onError:i});return}yn[e]=[],yn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=yn[e],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=u?parseInt(u):0,g=p!==0;let _=0;const m=new ReadableStream({start(f){b();function b(){d.read().then(({done:x,value:v})=>{if(x)f.close();else{_+=v.byteLength;const C=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:p});for(let A=0,R=h.length;A<R;A++){const D=h[A];D.onProgress&&D.onProgress(C)}f.enqueue(v),b()}},x=>{f.error(x)})}}});return new Response(m)}else throw new Vu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(u);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{On.add(e,c);const h=yn[e];delete yn[e];for(let d=0,u=h.length;d<u;d++){const p=h[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{const h=yn[e];if(h===void 0)throw this.manager.itemError(e),c;delete yn[e];for(let d=0,u=h.length;d<u;d++){const p=h[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class Wu extends $i{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=Ms("img");function l(){h(),On.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(d){h(),i&&i(d),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class Xu extends $i{constructor(e){super(e)}load(e,t,n,i){const s=new vt,a=new Wu(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Tr extends ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class ih extends Tr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const sa=new Ne,Dl=new P,Nl=new P;class So{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new De(512,512),this.map=null,this.mapPass=null,this.matrix=new Ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yo,this._frameExtents=new De(1,1),this._viewportCount=1,this._viewports=[new Ze(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Dl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Dl),Nl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nl),t.updateMatrixWorld(),sa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(sa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class $u extends So{constructor(){super(new Ct(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Oi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Yu extends Tr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new $u}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Ul=new Ne,as=new P,ra=new P;class qu extends So{constructor(){super(new Ct(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new De(4,2),this._viewportCount=6,this._viewports=[new Ze(2,1,1,1),new Ze(0,1,1,1),new Ze(3,1,1,1),new Ze(1,1,1,1),new Ze(3,0,1,1),new Ze(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),as.setFromMatrixPosition(e.matrixWorld),n.position.copy(as),ra.copy(n.position),ra.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ra),n.updateMatrixWorld(),i.makeTranslation(-as.x,-as.y,-as.z),Ul.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ul)}}class ju extends Tr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new qu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class bo extends Vc{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ku extends So{constructor(){super(new bo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Sr extends Tr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ot.DEFAULT_UP),this.updateMatrix(),this.target=new ot,this.shadow=new Ku}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ps{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class Zu extends $i{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{i&&i(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return On.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),On.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});On.add(e,l),s.manager.itemStart(e)}}class Ju extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}const Eo="\\[\\]\\.:\\/",Qu=new RegExp("["+Eo+"]","g"),To="[^"+Eo+"]",ef="[^"+Eo.replace("\\.","")+"]",tf=/((?:WC+[\/:])*)/.source.replace("WC",To),nf=/(WCOD+)?/.source.replace("WCOD",ef),sf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",To),rf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",To),af=new RegExp("^"+tf+nf+sf+rf+"$"),of=["material","materials","bones","map"];class lf{constructor(e,t,n){const i=n||nt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class nt{constructor(e,t,n){this.path=t,this.parsedPath=n||nt.parseTrackName(t),this.node=nt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new nt.Composite(e,t,n):new nt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Qu,"")}static parseTrackName(e){const t=af.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);of.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=nt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}nt.Composite=lf;nt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};nt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};nt.prototype.GetterByBindingType=[nt.prototype._getValue_direct,nt.prototype._getValue_array,nt.prototype._getValue_arrayElement,nt.prototype._getValue_toArray];nt.prototype.SetterByBindingTypeAndVersioning=[[nt.prototype._setValue_direct,nt.prototype._setValue_direct_setNeedsUpdate,nt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_array,nt.prototype._setValue_array_setNeedsUpdate,nt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_arrayElement,nt.prototype._setValue_arrayElement_setNeedsUpdate,nt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[nt.prototype._setValue_fromArray,nt.prototype._setValue_fromArray_setNeedsUpdate,nt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function Fl(r,e,t,n){const i=cf(n);switch(t){case Ac:return r*e;case Cc:return r*e;case Ic:return r*e*2;case fo:return r*e/i.components*i.byteLength;case po:return r*e/i.components*i.byteLength;case Pc:return r*e*2/i.components*i.byteLength;case mo:return r*e*2/i.components*i.byteLength;case Rc:return r*e*3/i.components*i.byteLength;case Kt:return r*e*4/i.components*i.byteLength;case go:return r*e*4/i.components*i.byteLength;case cr:case hr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case dr:case ur:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ca:case Pa:return Math.max(r,16)*Math.max(e,8)/4;case Ra:case Ia:return Math.max(r,8)*Math.max(e,8)/2;case La:case Da:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Na:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ua:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Fa:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Ba:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Oa:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case ka:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Ha:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case za:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Ga:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Va:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Wa:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Xa:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case $a:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Ya:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case qa:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case fr:case ja:case Ka:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Lc:case Za:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Ja:case Qa:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cf(r){switch(r){case An:case Ec:return{byteLength:1,components:1};case ms:case Tc:case Es:return{byteLength:2,components:1};case ho:case uo:return{byteLength:2,components:4};case ai:case co:case sn:return{byteLength:4,components:1};case wc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function sh(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function hf(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=r.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var df=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ff=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_f=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,yf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ef=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Nf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Uf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ff=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Bf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Of=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ep=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,np=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ip=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ap=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,hp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,dp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,up=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_p=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ep=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ap=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Np=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Up=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Bp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Op=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,kp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Hp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$p=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,jp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Kp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,im=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,dm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_m=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Em=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Tm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Am=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Im=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Pm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Lm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Um=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Om=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,km=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:df,alphahash_pars_fragment:uf,alphamap_fragment:ff,alphamap_pars_fragment:pf,alphatest_fragment:mf,alphatest_pars_fragment:gf,aomap_fragment:_f,aomap_pars_fragment:vf,batching_pars_vertex:xf,batching_vertex:yf,begin_vertex:Mf,beginnormal_vertex:Sf,bsdfs:bf,iridescence_fragment:Ef,bumpmap_pars_fragment:Tf,clipping_planes_fragment:wf,clipping_planes_pars_fragment:Af,clipping_planes_pars_vertex:Rf,clipping_planes_vertex:Cf,color_fragment:If,color_pars_fragment:Pf,color_pars_vertex:Lf,color_vertex:Df,common:Nf,cube_uv_reflection_fragment:Uf,defaultnormal_vertex:Ff,displacementmap_pars_vertex:Bf,displacementmap_vertex:Of,emissivemap_fragment:kf,emissivemap_pars_fragment:Hf,colorspace_fragment:zf,colorspace_pars_fragment:Gf,envmap_fragment:Vf,envmap_common_pars_fragment:Wf,envmap_pars_fragment:Xf,envmap_pars_vertex:$f,envmap_physical_pars_fragment:ip,envmap_vertex:Yf,fog_vertex:qf,fog_pars_vertex:jf,fog_fragment:Kf,fog_pars_fragment:Zf,gradientmap_pars_fragment:Jf,lightmap_pars_fragment:Qf,lights_lambert_fragment:ep,lights_lambert_pars_fragment:tp,lights_pars_begin:np,lights_toon_fragment:sp,lights_toon_pars_fragment:rp,lights_phong_fragment:ap,lights_phong_pars_fragment:op,lights_physical_fragment:lp,lights_physical_pars_fragment:cp,lights_fragment_begin:hp,lights_fragment_maps:dp,lights_fragment_end:up,logdepthbuf_fragment:fp,logdepthbuf_pars_fragment:pp,logdepthbuf_pars_vertex:mp,logdepthbuf_vertex:gp,map_fragment:_p,map_pars_fragment:vp,map_particle_fragment:xp,map_particle_pars_fragment:yp,metalnessmap_fragment:Mp,metalnessmap_pars_fragment:Sp,morphinstance_vertex:bp,morphcolor_vertex:Ep,morphnormal_vertex:Tp,morphtarget_pars_vertex:wp,morphtarget_vertex:Ap,normal_fragment_begin:Rp,normal_fragment_maps:Cp,normal_pars_fragment:Ip,normal_pars_vertex:Pp,normal_vertex:Lp,normalmap_pars_fragment:Dp,clearcoat_normal_fragment_begin:Np,clearcoat_normal_fragment_maps:Up,clearcoat_pars_fragment:Fp,iridescence_pars_fragment:Bp,opaque_fragment:Op,packing:kp,premultiplied_alpha_fragment:Hp,project_vertex:zp,dithering_fragment:Gp,dithering_pars_fragment:Vp,roughnessmap_fragment:Wp,roughnessmap_pars_fragment:Xp,shadowmap_pars_fragment:$p,shadowmap_pars_vertex:Yp,shadowmap_vertex:qp,shadowmask_pars_fragment:jp,skinbase_vertex:Kp,skinning_pars_vertex:Zp,skinning_vertex:Jp,skinnormal_vertex:Qp,specularmap_fragment:em,specularmap_pars_fragment:tm,tonemapping_fragment:nm,tonemapping_pars_fragment:im,transmission_fragment:sm,transmission_pars_fragment:rm,uv_pars_fragment:am,uv_pars_vertex:om,uv_vertex:lm,worldpos_vertex:cm,background_vert:hm,background_frag:dm,backgroundCube_vert:um,backgroundCube_frag:fm,cube_vert:pm,cube_frag:mm,depth_vert:gm,depth_frag:_m,distanceRGBA_vert:vm,distanceRGBA_frag:xm,equirect_vert:ym,equirect_frag:Mm,linedashed_vert:Sm,linedashed_frag:bm,meshbasic_vert:Em,meshbasic_frag:Tm,meshlambert_vert:wm,meshlambert_frag:Am,meshmatcap_vert:Rm,meshmatcap_frag:Cm,meshnormal_vert:Im,meshnormal_frag:Pm,meshphong_vert:Lm,meshphong_frag:Dm,meshphysical_vert:Nm,meshphysical_frag:Um,meshtoon_vert:Fm,meshtoon_frag:Bm,points_vert:Om,points_frag:km,shadow_vert:Hm,shadow_frag:zm,sprite_vert:Gm,sprite_frag:Vm},ne={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new De(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new De(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},ln={basic:{uniforms:Lt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Lt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new Me(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Lt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Lt([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Lt([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new Me(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Lt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Lt([ne.points,ne.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Lt([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Lt([ne.common,ne.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Lt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Lt([ne.sprite,ne.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Lt([ne.common,ne.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Lt([ne.lights,ne.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};ln.physical={uniforms:Lt([ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new De(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new De},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new De},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const nr={r:0,b:0,g:0},Kn=new hn,Wm=new Ne;function Xm(r,e,t,n,i,s,a){const o=new Me(0);let l=s===!0?0:1,c,h,d=null,u=0,p=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function _(x){let v=!1;const C=g(x);C===null?f(o,l):C&&C.isColor&&(f(C,1),v=!0);const A=r.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(x,v){const C=g(v);C&&(C.isCubeTexture||C.mapping===br)?(h===void 0&&(h=new ee(new Pe(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:ki(ln.backgroundCube.uniforms),vertexShader:ln.backgroundCube.vertexShader,fragmentShader:ln.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Kn.copy(v.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Wm.makeRotationFromEuler(Kn)),h.material.toneMapped=Xe.getTransfer(C.colorSpace)!==it,(d!==C||u!==C.version||p!==r.toneMapping)&&(h.material.needsUpdate=!0,d=C,u=C.version,p=r.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new ee(new Rt(2,2),new Gn({name:"BackgroundMaterial",uniforms:ki(ln.background.uniforms),vertexShader:ln.background.vertexShader,fragmentShader:ln.background.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(C.colorSpace)!==it,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(d!==C||u!==C.version||p!==r.toneMapping)&&(c.material.needsUpdate=!0,d=C,u=C.version,p=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function f(x,v){x.getRGB(nr,Gc(r)),n.buffers.color.setClear(nr.r,nr.g,nr.b,v,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),l=v,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,f(o,l)},render:_,addToRenderList:m,dispose:b}}function $m(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null);let s=i,a=!1;function o(S,w,N,O,V){let X=!1;const W=d(O,N,w);s!==W&&(s=W,c(s.object)),X=p(S,O,N,V),X&&g(S,O,N,V),V!==null&&e.update(V,r.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(S,w,N,O),V!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return r.createVertexArray()}function c(S){return r.bindVertexArray(S)}function h(S){return r.deleteVertexArray(S)}function d(S,w,N){const O=N.wireframe===!0;let V=n[S.id];V===void 0&&(V={},n[S.id]=V);let X=V[w.id];X===void 0&&(X={},V[w.id]=X);let W=X[O];return W===void 0&&(W=u(l()),X[O]=W),W}function u(S){const w=[],N=[],O=[];for(let V=0;V<t;V++)w[V]=0,N[V]=0,O[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:N,attributeDivisors:O,object:S,attributes:{},index:null}}function p(S,w,N,O){const V=s.attributes,X=w.attributes;let W=0;const K=N.getAttributes();for(const G in K)if(K[G].location>=0){const de=V[G];let xe=X[G];if(xe===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(xe=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(xe=S.instanceColor)),de===void 0||de.attribute!==xe||xe&&de.data!==xe.data)return!0;W++}return s.attributesNum!==W||s.index!==O}function g(S,w,N,O){const V={},X=w.attributes;let W=0;const K=N.getAttributes();for(const G in K)if(K[G].location>=0){let de=X[G];de===void 0&&(G==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),G==="instanceColor"&&S.instanceColor&&(de=S.instanceColor));const xe={};xe.attribute=de,de&&de.data&&(xe.data=de.data),V[G]=xe,W++}s.attributes=V,s.attributesNum=W,s.index=O}function _(){const S=s.newAttributes;for(let w=0,N=S.length;w<N;w++)S[w]=0}function m(S){f(S,0)}function f(S,w){const N=s.newAttributes,O=s.enabledAttributes,V=s.attributeDivisors;N[S]=1,O[S]===0&&(r.enableVertexAttribArray(S),O[S]=1),V[S]!==w&&(r.vertexAttribDivisor(S,w),V[S]=w)}function b(){const S=s.newAttributes,w=s.enabledAttributes;for(let N=0,O=w.length;N<O;N++)w[N]!==S[N]&&(r.disableVertexAttribArray(N),w[N]=0)}function x(S,w,N,O,V,X,W){W===!0?r.vertexAttribIPointer(S,w,N,V,X):r.vertexAttribPointer(S,w,N,O,V,X)}function v(S,w,N,O){_();const V=O.attributes,X=N.getAttributes(),W=w.defaultAttributeValues;for(const K in X){const G=X[K];if(G.location>=0){let se=V[K];if(se===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(se=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(se=S.instanceColor)),se!==void 0){const de=se.normalized,xe=se.itemSize,ke=e.get(se);if(ke===void 0)continue;const st=ke.buffer,Y=ke.type,te=ke.bytesPerElement,ge=Y===r.INT||Y===r.UNSIGNED_INT||se.gpuType===co;if(se.isInterleavedBufferAttribute){const re=se.data,Te=re.stride,Ke=se.offset;if(re.isInstancedInterleavedBuffer){for(let Ae=0;Ae<G.locationSize;Ae++)f(G.location+Ae,re.meshPerAttribute);S.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Ae=0;Ae<G.locationSize;Ae++)m(G.location+Ae);r.bindBuffer(r.ARRAY_BUFFER,st);for(let Ae=0;Ae<G.locationSize;Ae++)x(G.location+Ae,xe/G.locationSize,Y,de,Te*te,(Ke+xe/G.locationSize*Ae)*te,ge)}else{if(se.isInstancedBufferAttribute){for(let re=0;re<G.locationSize;re++)f(G.location+re,se.meshPerAttribute);S.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let re=0;re<G.locationSize;re++)m(G.location+re);r.bindBuffer(r.ARRAY_BUFFER,st);for(let re=0;re<G.locationSize;re++)x(G.location+re,xe/G.locationSize,Y,de,xe*te,xe/G.locationSize*re*te,ge)}}else if(W!==void 0){const de=W[K];if(de!==void 0)switch(de.length){case 2:r.vertexAttrib2fv(G.location,de);break;case 3:r.vertexAttrib3fv(G.location,de);break;case 4:r.vertexAttrib4fv(G.location,de);break;default:r.vertexAttrib1fv(G.location,de)}}}}b()}function C(){D();for(const S in n){const w=n[S];for(const N in w){const O=w[N];for(const V in O)h(O[V].object),delete O[V];delete w[N]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;const w=n[S.id];for(const N in w){const O=w[N];for(const V in O)h(O[V].object),delete O[V];delete w[N]}delete n[S.id]}function R(S){for(const w in n){const N=n[w];if(N[S.id]===void 0)continue;const O=N[S.id];for(const V in O)h(O[V].object),delete O[V];delete N[S.id]}}function D(){E(),a=!0,s!==i&&(s=i,c(s.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:D,resetDefaultState:E,dispose:C,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function Ym(r,e,t){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,d){d!==0&&(r.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];t.update(p,n,1)}function l(c,h,d,u){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];t.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function qm(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==Kt&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const D=R===Es&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==An&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==sn&&!D)}function l(R){if(R==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),b=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),x=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:C,maxSamples:A}}function jm(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new ei,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||i;return i=u,n=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=r.get(d);if(!i||g===null||g.length===0||s&&!m)s?h(null):c();else{const b=s?0:n,x=b*4;let v=f.clippingState||null;l.value=v,v=h(g,u,x,p);for(let C=0;C!==x;++C)v[C]=t[C];f.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,b=u.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,v=p;x!==_;++x,v+=4)a.copy(d[x]).applyMatrix4(b,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Km(r){let e=new WeakMap;function t(a,o){return o===wa?a.mapping=Ui:o===Aa&&(a.mapping=Fi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===wa||o===Aa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new _u(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const Ci=4,Bl=[.125,.215,.35,.446,.526,.582],si=20,aa=new bo,Ol=new Me;let oa=null,la=0,ca=0,ha=!1;const ti=(1+Math.sqrt(5))/2,Ri=1/ti,kl=[new P(-ti,Ri,0),new P(ti,Ri,0),new P(-Ri,0,ti),new P(Ri,0,ti),new P(0,ti,-Ri),new P(0,ti,Ri),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],Zm=new P;class Hl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=Zm}=s;oa=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(oa,la,ca),this._renderer.xr.enabled=ha,e.scissorTest=!1,ir(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ui||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oa=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:Es,format:Kt,colorSpace:Ut,depthBuffer:!1},i=zl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zl(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jm(s)),this._blurMaterial=Qm(s,e,t)}return i}_compileMaterial(e){const t=new ee(this._lodPlanes[0],e);this._renderer.compile(t,aa)}_sceneToCubeUV(e,t,n,i,s){const l=new Ct(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Ol),d.toneMapping=zn,d.autoClear=!1;const g=new pt({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1}),_=new ee(new Pe,g);let m=!1;const f=e.background;f?f.isColor&&(g.color.copy(f),e.background=null,m=!0):(g.color.copy(Ol),m=!0);for(let b=0;b<6;b++){const x=b%3;x===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[b],s.y,s.z)):x===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[b]));const v=this._cubeSize;ir(i,x*v,b>2?v:0,v,v),d.setRenderTarget(i),m&&d.render(_,l),d.render(e,l)}_.geometry.dispose(),_.material.dispose(),d.toneMapping=p,d.autoClear=u,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ui||e.mapping===Fi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gl());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new ee(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ir(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,aa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=kl[(i-s-1)%kl.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new ee(this._lodPlanes[i],c),u=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*si-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):si;m>si&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${si}`);const f=[];let b=0;for(let R=0;R<si;++R){const D=R/_,E=Math.exp(-D*D/2);f.push(E),R===0?b+=E:R<m&&(b+=2*E)}for(let R=0;R<f.length;R++)f[R]=f[R]/b;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const v=this._sizeLods[i],C=3*v*(i>x-Ci?i-x+Ci:0),A=4*(this._cubeSize-v);ir(t,C,A,3*v,2*v),l.setRenderTarget(t),l.render(d,aa)}}function Jm(r){const e=[],t=[],n=[];let i=r;const s=r-Ci+1+Bl.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>r-Ci?l=Bl[a-r+Ci-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,_=3,m=2,f=1,b=new Float32Array(_*g*p),x=new Float32Array(m*g*p),v=new Float32Array(f*g*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,D=A>2?0:-1,E=[R,D,0,R+2/3,D,0,R+2/3,D+1,0,R,D,0,R+2/3,D+1,0,R,D+1,0];b.set(E,_*g*A),x.set(u,m*g*A);const S=[A,A,A,A,A,A];v.set(S,f*g*A)}const C=new Ot;C.setAttribute("position",new Nt(b,_)),C.setAttribute("uv",new Nt(x,m)),C.setAttribute("faceIndex",new Nt(v,f)),e.push(C),i>Ci&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function zl(r,e,t){const n=new oi(r,e,t);return n.texture.mapping=br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ir(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function Qm(r,e,t){const n=new Float32Array(si),i=new P(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function Gl(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function Vl(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Hn,depthTest:!1,depthWrite:!1})}function wo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function eg(r){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===wa||l===Aa,h=l===Ui||l===Fi;if(c||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new Hl(r)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&i(p)?(t===null&&(t=new Hl(r)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function tg(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&pr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function ng(r,e,t,n){const i={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete i[u.id];const p=s.get(u);p&&(e.remove(p),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)e.update(u[p],r.ARRAY_BUFFER)}function c(d){const u=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const b=p.array;_=p.version;for(let x=0,v=b.length;x<v;x+=3){const C=b[x+0],A=b[x+1],R=b[x+2];u.push(C,A,A,R,R,C)}}else if(g!==void 0){const b=g.array;_=g.version;for(let x=0,v=b.length/3-1;x<v;x+=3){const C=x+0,A=x+1,R=x+2;u.push(C,A,A,R,R,C)}}else return;const m=new(Fc(u)?zc:Hc)(u,1);m.version=_;const f=s.get(d);f&&e.remove(f),s.set(d,m)}function h(d){const u=s.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function ig(r,e,t){let n;function i(u){n=u}let s,a;function o(u){s=u.type,a=u.bytesPerElement}function l(u,p){r.drawElements(n,p,s,u*a),t.update(p,n,1)}function c(u,p,g){g!==0&&(r.drawElementsInstanced(n,p,s,u*a,g),t.update(p,n,g))}function h(u,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function d(u,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/a,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,u,0,_,0,g);let f=0;for(let b=0;b<g;b++)f+=p[b]*_[b];t.update(f,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function sg(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function rg(r,e,t){const n=new WeakMap,i=new Ze;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let S=function(){D.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var p=S;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let C=o.attributes.position.count*v,A=1;C>e.maxTextureSize&&(A=Math.ceil(C/e.maxTextureSize),C=e.maxTextureSize);const R=new Float32Array(C*A*4*d),D=new Bc(R,C,A,d);D.type=sn,D.needsUpdate=!0;const E=v*4;for(let w=0;w<d;w++){const N=f[w],O=b[w],V=x[w],X=C*A*4*w;for(let W=0;W<N.count;W++){const K=W*E;g===!0&&(i.fromBufferAttribute(N,W),R[X+K+0]=i.x,R[X+K+1]=i.y,R[X+K+2]=i.z,R[X+K+3]=0),_===!0&&(i.fromBufferAttribute(O,W),R[X+K+4]=i.x,R[X+K+5]=i.y,R[X+K+6]=i.z,R[X+K+7]=0),m===!0&&(i.fromBufferAttribute(V,W),R[X+K+8]=i.x,R[X+K+9]=i.y,R[X+K+10]=i.z,R[X+K+11]=V.itemSize===4?i.w:1)}}u={count:d,texture:D,size:new De(C,A)},n.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function ag(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const rh=new vt,Wl=new Qc(1,1),ah=new Bc,oh=new eu,lh=new Wc,Xl=[],$l=[],Yl=new Float32Array(16),ql=new Float32Array(9),jl=new Float32Array(4);function Yi(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=Xl[i];if(s===void 0&&(s=new Float32Array(i),Xl[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function xt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function yt(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function wr(r,e){let t=$l[e];t===void 0&&(t=new Int32Array(e),$l[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function og(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function lg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;r.uniform2fv(this.addr,e),yt(t,e)}}function cg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(xt(t,e))return;r.uniform3fv(this.addr,e),yt(t,e)}}function hg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;r.uniform4fv(this.addr,e),yt(t,e)}}function dg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;jl.set(n),r.uniformMatrix2fv(this.addr,!1,jl),yt(t,n)}}function ug(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;ql.set(n),r.uniformMatrix3fv(this.addr,!1,ql),yt(t,n)}}function fg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(xt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(xt(t,n))return;Yl.set(n),r.uniformMatrix4fv(this.addr,!1,Yl),yt(t,n)}}function pg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function mg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;r.uniform2iv(this.addr,e),yt(t,e)}}function gg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;r.uniform3iv(this.addr,e),yt(t,e)}}function _g(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;r.uniform4iv(this.addr,e),yt(t,e)}}function vg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function xg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(xt(t,e))return;r.uniform2uiv(this.addr,e),yt(t,e)}}function yg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(xt(t,e))return;r.uniform3uiv(this.addr,e),yt(t,e)}}function Mg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(xt(t,e))return;r.uniform4uiv(this.addr,e),yt(t,e)}}function Sg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Wl.compareFunction=Uc,s=Wl):s=rh,t.setTexture2D(e||s,i)}function bg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||oh,i)}function Eg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||lh,i)}function Tg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||ah,i)}function wg(r){switch(r){case 5126:return og;case 35664:return lg;case 35665:return cg;case 35666:return hg;case 35674:return dg;case 35675:return ug;case 35676:return fg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return _g;case 5125:return vg;case 36294:return xg;case 36295:return yg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return Sg;case 35679:case 36299:case 36307:return bg;case 35680:case 36300:case 36308:case 36293:return Eg;case 36289:case 36303:case 36311:case 36292:return Tg}}function Ag(r,e){r.uniform1fv(this.addr,e)}function Rg(r,e){const t=Yi(e,this.size,2);r.uniform2fv(this.addr,t)}function Cg(r,e){const t=Yi(e,this.size,3);r.uniform3fv(this.addr,t)}function Ig(r,e){const t=Yi(e,this.size,4);r.uniform4fv(this.addr,t)}function Pg(r,e){const t=Yi(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function Lg(r,e){const t=Yi(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Dg(r,e){const t=Yi(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function Ng(r,e){r.uniform1iv(this.addr,e)}function Ug(r,e){r.uniform2iv(this.addr,e)}function Fg(r,e){r.uniform3iv(this.addr,e)}function Bg(r,e){r.uniform4iv(this.addr,e)}function Og(r,e){r.uniform1uiv(this.addr,e)}function kg(r,e){r.uniform2uiv(this.addr,e)}function Hg(r,e){r.uniform3uiv(this.addr,e)}function zg(r,e){r.uniform4uiv(this.addr,e)}function Gg(r,e,t){const n=this.cache,i=e.length,s=wr(t,i);xt(n,s)||(r.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||rh,s[a])}function Vg(r,e,t){const n=this.cache,i=e.length,s=wr(t,i);xt(n,s)||(r.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||oh,s[a])}function Wg(r,e,t){const n=this.cache,i=e.length,s=wr(t,i);xt(n,s)||(r.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||lh,s[a])}function Xg(r,e,t){const n=this.cache,i=e.length,s=wr(t,i);xt(n,s)||(r.uniform1iv(this.addr,s),yt(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||ah,s[a])}function $g(r){switch(r){case 5126:return Ag;case 35664:return Rg;case 35665:return Cg;case 35666:return Ig;case 35674:return Pg;case 35675:return Lg;case 35676:return Dg;case 5124:case 35670:return Ng;case 35667:case 35671:return Ug;case 35668:case 35672:return Fg;case 35669:case 35673:return Bg;case 5125:return Og;case 36294:return kg;case 36295:return Hg;case 36296:return zg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return Xg}}class Yg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=wg(t.type)}}class qg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$g(t.type)}}class jg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function Kl(r,e){r.seq.push(e),r.map[e.id]=e}function Kg(r,e,t){const n=r.name,i=n.length;for(da.lastIndex=0;;){const s=da.exec(n),a=da.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Kl(t,c===void 0?new Yg(o,r,e):new qg(o,r,e));break}else{let d=t.map[o];d===void 0&&(d=new jg(o),Kl(t,d)),t=d}}}class mr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),a=e.getUniformLocation(t,s.name);Kg(s,a,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Zl(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const Zg=37297;let Jg=0;function Qg(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Jl=new Fe;function e0(r){Xe._getMatrix(Jl,Xe.workingColorSpace,r);const e=`mat3( ${Jl.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(r)){case _r:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Ql(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),i=r.getShaderInfoLog(e).trim();if(n&&i==="")return"";const s=/ERROR: 0:(\d+)/.exec(i);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+i+`

`+Qg(r.getShaderSource(e),a)}else return i}function t0(r,e){const t=e0(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function n0(r,e){let t;switch(e){case hd:t="Linear";break;case dd:t="Reinhard";break;case ud:t="Cineon";break;case lo:t="ACESFilmic";break;case pd:t="AgX";break;case md:t="Neutral";break;case fd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const sr=new P;function i0(){Xe.getLuminanceCoefficients(sr);const r=sr.x.toFixed(4),e=sr.y.toFixed(4),t=sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s0(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hs).join(`
`)}function r0(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function a0(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function hs(r){return r!==""}function ec(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const o0=/^[ \t]*#include +<([\w\d./]+)>/gm;function so(r){return r.replace(o0,c0)}const l0=new Map;function c0(r,e){let t=Oe[e];if(t===void 0){const n=l0.get(e);if(n!==void 0)t=Oe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return so(t)}const h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nc(r){return r.replace(h0,d0)}function d0(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function ic(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function u0(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===xc?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===yc?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Mn&&(e="SHADOWMAP_TYPE_VSM"),e}function f0(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Ui:case Fi:e="ENVMAP_TYPE_CUBE";break;case br:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p0(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Fi:e="ENVMAP_MODE_REFRACTION";break}return e}function m0(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Mc:e="ENVMAP_BLENDING_MULTIPLY";break;case ld:e="ENVMAP_BLENDING_MIX";break;case cd:e="ENVMAP_BLENDING_ADD";break}return e}function g0(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function _0(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=u0(t),c=f0(t),h=p0(t),d=m0(t),u=g0(t),p=s0(t),g=r0(s),_=i.createProgram();let m,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hs).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hs).join(`
`),f.length>0&&(f+=`
`)):(m=[ic(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hs).join(`
`),f=[ic(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==zn?"#define TONE_MAPPING":"",t.toneMapping!==zn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==zn?n0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,t0("linearToOutputTexel",t.outputColorSpace),i0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hs).join(`
`)),a=so(a),a=ec(a,t),a=tc(a,t),o=so(o),o=ec(o,t),o=tc(o,t),a=nc(a),o=nc(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Zo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=b+m+a,v=b+f+o,C=Zl(i,i.VERTEX_SHADER,x),A=Zl(i,i.FRAGMENT_SHADER,v);i.attachShader(_,C),i.attachShader(_,A),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(w){if(r.debug.checkShaderErrors){const N=i.getProgramInfoLog(_).trim(),O=i.getShaderInfoLog(C).trim(),V=i.getShaderInfoLog(A).trim();let X=!0,W=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(X=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,C,A);else{const K=Ql(i,C,"vertex"),G=Ql(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+N+`
`+K+`
`+G)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(O===""||V==="")&&(W=!1);W&&(w.diagnostics={runnable:X,programLog:N,vertexShader:{log:O,prefix:m},fragmentShader:{log:V,prefix:f}})}i.deleteShader(C),i.deleteShader(A),D=new mr(i,_),E=a0(i,_)}let D;this.getUniforms=function(){return D===void 0&&R(this),D};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=i.getProgramParameter(_,Zg)),S},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=C,this.fragmentShader=A,this}let v0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new y0(e),t.set(e,n)),n}}class y0{constructor(e){this.id=v0++,this.code=e,this.usedTimes=0}}function M0(r,e,t,n,i,s,a){const o=new Oc,l=new x0,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,S,w,N,O){const V=N.fog,X=O.geometry,W=E.isMeshStandardMaterial?N.environment:null,K=(E.isMeshStandardMaterial?t:e).get(E.envMap||W),G=K&&K.mapping===br?K.image.height:null,se=g[E.type];E.precision!==null&&(p=i.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const de=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xe=de!==void 0?de.length:0;let ke=0;X.morphAttributes.position!==void 0&&(ke=1),X.morphAttributes.normal!==void 0&&(ke=2),X.morphAttributes.color!==void 0&&(ke=3);let st,Y,te,ge;if(se){const et=ln[se];st=et.vertexShader,Y=et.fragmentShader}else st=E.vertexShader,Y=E.fragmentShader,l.update(E),te=l.getVertexShaderID(E),ge=l.getFragmentShaderID(E);const re=r.getRenderTarget(),Te=r.state.buffers.depth.getReversed(),Ke=O.isInstancedMesh===!0,Ae=O.isBatchedMesh===!0,ft=!!E.map,ct=!!E.matcap,Ge=!!K,I=!!E.aoMap,Vt=!!E.lightMap,$e=!!E.bumpMap,Ve=!!E.normalMap,ye=!!E.displacementMap,at=!!E.emissiveMap,ve=!!E.metalnessMap,T=!!E.roughnessMap,y=E.anisotropy>0,B=E.clearcoat>0,q=E.dispersion>0,Z=E.iridescence>0,$=E.sheen>0,_e=E.transmission>0,ae=y&&!!E.anisotropyMap,ue=B&&!!E.clearcoatMap,Ye=B&&!!E.clearcoatNormalMap,Q=B&&!!E.clearcoatRoughnessMap,fe=Z&&!!E.iridescenceMap,we=Z&&!!E.iridescenceThicknessMap,Ce=$&&!!E.sheenColorMap,pe=$&&!!E.sheenRoughnessMap,We=!!E.specularMap,Be=!!E.specularColorMap,rt=!!E.specularIntensityMap,L=_e&&!!E.transmissionMap,oe=_e&&!!E.thicknessMap,z=!!E.gradientMap,j=!!E.alphaMap,ce=E.alphaTest>0,le=!!E.alphaHash,Ue=!!E.extensions;let ht=zn;E.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(ht=r.toneMapping);const Et={shaderID:se,shaderType:E.type,shaderName:E.name,vertexShader:st,fragmentShader:Y,defines:E.defines,customVertexShaderID:te,customFragmentShaderID:ge,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Ae,batchingColor:Ae&&O._colorsTexture!==null,instancing:Ke,instancingColor:Ke&&O.instanceColor!==null,instancingMorph:Ke&&O.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:re===null?r.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:Ut,alphaToCoverage:!!E.alphaToCoverage,map:ft,matcap:ct,envMap:Ge,envMapMode:Ge&&K.mapping,envMapCubeUVHeight:G,aoMap:I,lightMap:Vt,bumpMap:$e,normalMap:Ve,displacementMap:u&&ye,emissiveMap:at,normalMapObjectSpace:Ve&&E.normalMapType===Md,normalMapTangentSpace:Ve&&E.normalMapType===Nc,metalnessMap:ve,roughnessMap:T,anisotropy:y,anisotropyMap:ae,clearcoat:B,clearcoatMap:ue,clearcoatNormalMap:Ye,clearcoatRoughnessMap:Q,dispersion:q,iridescence:Z,iridescenceMap:fe,iridescenceThicknessMap:we,sheen:$,sheenColorMap:Ce,sheenRoughnessMap:pe,specularMap:We,specularColorMap:Be,specularIntensityMap:rt,transmission:_e,transmissionMap:L,thicknessMap:oe,gradientMap:z,opaque:E.transparent===!1&&E.blending===Pi&&E.alphaToCoverage===!1,alphaMap:j,alphaTest:ce,alphaHash:le,combine:E.combine,mapUv:ft&&_(E.map.channel),aoMapUv:I&&_(E.aoMap.channel),lightMapUv:Vt&&_(E.lightMap.channel),bumpMapUv:$e&&_(E.bumpMap.channel),normalMapUv:Ve&&_(E.normalMap.channel),displacementMapUv:ye&&_(E.displacementMap.channel),emissiveMapUv:at&&_(E.emissiveMap.channel),metalnessMapUv:ve&&_(E.metalnessMap.channel),roughnessMapUv:T&&_(E.roughnessMap.channel),anisotropyMapUv:ae&&_(E.anisotropyMap.channel),clearcoatMapUv:ue&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Ye&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:fe&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:we&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:pe&&_(E.sheenRoughnessMap.channel),specularMapUv:We&&_(E.specularMap.channel),specularColorMapUv:Be&&_(E.specularColorMap.channel),specularIntensityMapUv:rt&&_(E.specularIntensityMap.channel),transmissionMapUv:L&&_(E.transmissionMap.channel),thicknessMapUv:oe&&_(E.thicknessMap.channel),alphaMapUv:j&&_(E.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Ve||y),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!X.attributes.uv&&(ft||j),fog:!!V,useFog:E.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Te,skinning:O.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:ke,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:r.shadowMap.enabled&&w.length>0,shadowMapType:r.shadowMap.type,toneMapping:ht,decodeVideoTexture:ft&&E.map.isVideoTexture===!0&&Xe.getTransfer(E.map.colorSpace)===it,decodeVideoTextureEmissive:at&&E.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(E.emissiveMap.colorSpace)===it,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===cn,flipSided:E.side===Bt,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ue&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&E.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Et.vertexUv1s=c.has(1),Et.vertexUv2s=c.has(2),Et.vertexUv3s=c.has(3),c.clear(),Et}function f(E){const S=[];if(E.shaderID?S.push(E.shaderID):(S.push(E.customVertexShaderID),S.push(E.customFragmentShaderID)),E.defines!==void 0)for(const w in E.defines)S.push(w),S.push(E.defines[w]);return E.isRawShaderMaterial===!1&&(b(S,E),x(S,E),S.push(r.outputColorSpace)),S.push(E.customProgramCacheKey),S.join()}function b(E,S){E.push(S.precision),E.push(S.outputColorSpace),E.push(S.envMapMode),E.push(S.envMapCubeUVHeight),E.push(S.mapUv),E.push(S.alphaMapUv),E.push(S.lightMapUv),E.push(S.aoMapUv),E.push(S.bumpMapUv),E.push(S.normalMapUv),E.push(S.displacementMapUv),E.push(S.emissiveMapUv),E.push(S.metalnessMapUv),E.push(S.roughnessMapUv),E.push(S.anisotropyMapUv),E.push(S.clearcoatMapUv),E.push(S.clearcoatNormalMapUv),E.push(S.clearcoatRoughnessMapUv),E.push(S.iridescenceMapUv),E.push(S.iridescenceThicknessMapUv),E.push(S.sheenColorMapUv),E.push(S.sheenRoughnessMapUv),E.push(S.specularMapUv),E.push(S.specularColorMapUv),E.push(S.specularIntensityMapUv),E.push(S.transmissionMapUv),E.push(S.thicknessMapUv),E.push(S.combine),E.push(S.fogExp2),E.push(S.sizeAttenuation),E.push(S.morphTargetsCount),E.push(S.morphAttributeCount),E.push(S.numDirLights),E.push(S.numPointLights),E.push(S.numSpotLights),E.push(S.numSpotLightMaps),E.push(S.numHemiLights),E.push(S.numRectAreaLights),E.push(S.numDirLightShadows),E.push(S.numPointLightShadows),E.push(S.numSpotLightShadows),E.push(S.numSpotLightShadowsWithMaps),E.push(S.numLightProbes),E.push(S.shadowMapType),E.push(S.toneMapping),E.push(S.numClippingPlanes),E.push(S.numClipIntersection),E.push(S.depthPacking)}function x(E,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),E.push(o.mask)}function v(E){const S=g[E.type];let w;if(S){const N=ln[S];w=fu.clone(N.uniforms)}else w=E.uniforms;return w}function C(E,S){let w;for(let N=0,O=h.length;N<O;N++){const V=h[N];if(V.cacheKey===S){w=V,++w.usedTimes;break}}return w===void 0&&(w=new _0(r,S,E,s),h.push(w)),w}function A(E){if(--E.usedTimes===0){const S=h.indexOf(E);h[S]=h[h.length-1],h.pop(),E.destroy()}}function R(E){l.remove(E)}function D(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:v,acquireProgram:C,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:D}}function S0(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function b0(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function sc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function rc(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d,u,p,g,_,m){let f=r[e];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},r[e]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),e++,f}function o(d,u,p,g,_,m){const f=a(d,u,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?i.push(f):t.push(f)}function l(d,u,p,g,_,m){const f=a(d,u,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?i.unshift(f):t.unshift(f)}function c(d,u){t.length>1&&t.sort(d||b0),n.length>1&&n.sort(u||sc),i.length>1&&i.sort(u||sc)}function h(){for(let d=e,u=r.length;d<u;d++){const p=r[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:h,sort:c}}function E0(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new rc,r.set(n,[a])):i>=s.length?(a=new rc,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function T0(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Me};break;case"SpotLight":t={position:new P,direction:new P,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new P,halfWidth:new P,halfHeight:new P};break}return r[e.id]=t,t}}}function w0(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new De,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let A0=0;function R0(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function C0(r){const e=new T0,t=w0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,s=new Ne,a=new Ne;function o(c){let h=0,d=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,b=0,x=0,v=0,C=0,A=0,R=0;c.sort(R0);for(let E=0,S=c.length;E<S;E++){const w=c[E],N=w.color,O=w.intensity,V=w.distance,X=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=N.r*O,d+=N.g*O,u+=N.b*O;else if(w.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(w.sh.coefficients[W],O);R++}else if(w.isDirectionalLight){const W=e.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const K=w.shadow,G=t.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,n.directionalShadow[p]=G,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=w.shadow.matrix,b++}n.directional[p]=W,p++}else if(w.isSpotLight){const W=e.get(w);W.position.setFromMatrixPosition(w.matrixWorld),W.color.copy(N).multiplyScalar(O),W.distance=V,W.coneCos=Math.cos(w.angle),W.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),W.decay=w.decay,n.spot[_]=W;const K=w.shadow;if(w.map&&(n.spotLightMap[C]=w.map,C++,K.updateMatrices(w),w.castShadow&&A++),n.spotLightMatrix[_]=K.matrix,w.castShadow){const G=t.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,n.spotShadow[_]=G,n.spotShadowMap[_]=X,v++}_++}else if(w.isRectAreaLight){const W=e.get(w);W.color.copy(N).multiplyScalar(O),W.halfWidth.set(w.width*.5,0,0),W.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=W,m++}else if(w.isPointLight){const W=e.get(w);if(W.color.copy(w.color).multiplyScalar(w.intensity),W.distance=w.distance,W.decay=w.decay,w.castShadow){const K=w.shadow,G=t.get(w);G.shadowIntensity=K.intensity,G.shadowBias=K.bias,G.shadowNormalBias=K.normalBias,G.shadowRadius=K.radius,G.shadowMapSize=K.mapSize,G.shadowCameraNear=K.camera.near,G.shadowCameraFar=K.camera.far,n.pointShadow[g]=G,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=w.shadow.matrix,x++}n.point[g]=W,g++}else if(w.isHemisphereLight){const W=e.get(w);W.skyColor.copy(w.color).multiplyScalar(O),W.groundColor.copy(w.groundColor).multiplyScalar(O),n.hemi[f]=W,f++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ne.LTC_FLOAT_1,n.rectAreaLTC2=ne.LTC_FLOAT_2):(n.rectAreaLTC1=ne.LTC_HALF_1,n.rectAreaLTC2=ne.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const D=n.hash;(D.directionalLength!==p||D.pointLength!==g||D.spotLength!==_||D.rectAreaLength!==m||D.hemiLength!==f||D.numDirectionalShadows!==b||D.numPointShadows!==x||D.numSpotShadows!==v||D.numSpotMaps!==C||D.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=v+C-A,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,D.directionalLength=p,D.pointLength=g,D.spotLength=_,D.rectAreaLength=m,D.hemiLength=f,D.numDirectionalShadows=b,D.numPointShadows=x,D.numSpotShadows=v,D.numSpotMaps=C,D.numLightProbes=R,n.version=A0++)}function l(c,h){let d=0,u=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){const x=c[f];if(x.isDirectionalLight){const v=n.directional[d];v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),d++}else if(x.isSpotLight){const v=n.spot[p];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(x.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const v=n.point[u];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),u++}else if(x.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function ac(r){const e=new C0(r),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function I0(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new ac(r),e.set(i,[o])):s>=a.length?(o=new ac(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const P0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,L0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function D0(r,e,t){let n=new yo;const i=new De,s=new De,a=new Ze,o=new Iu({depthPacking:yd}),l=new Pu,c={},h=t.maxTextureSize,d={[wn]:Bt,[Bt]:wn,[cn]:cn},u=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new De},radius:{value:4}},vertexShader:P0,fragmentShader:L0}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ot;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ee(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xc;let f=this.type;this.render=function(A,R,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const E=r.getRenderTarget(),S=r.getActiveCubeFace(),w=r.getActiveMipmapLevel(),N=r.state;N.setBlending(Hn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const O=f!==Mn&&this.type===Mn,V=f===Mn&&this.type!==Mn;for(let X=0,W=A.length;X<W;X++){const K=A[X],G=K.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const se=G.getFrameExtents();if(i.multiply(se),s.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/se.x),i.x=s.x*se.x,G.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/se.y),i.y=s.y*se.y,G.mapSize.y=s.y)),G.map===null||O===!0||V===!0){const xe=this.type!==Mn?{minFilter:Dt,magFilter:Dt}:{};G.map!==null&&G.map.dispose(),G.map=new oi(i.x,i.y,xe),G.map.texture.name=K.name+".shadowMap",G.camera.updateProjectionMatrix()}r.setRenderTarget(G.map),r.clear();const de=G.getViewportCount();for(let xe=0;xe<de;xe++){const ke=G.getViewport(xe);a.set(s.x*ke.x,s.y*ke.y,s.x*ke.z,s.y*ke.w),N.viewport(a),G.updateMatrices(K,xe),n=G.getFrustum(),v(R,D,G.camera,K,this.type)}G.isPointLightShadow!==!0&&this.type===Mn&&b(G,D),G.needsUpdate=!1}f=this.type,m.needsUpdate=!1,r.setRenderTarget(E,S,w)};function b(A,R){const D=e.update(_);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new oi(i.x,i.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(R,null,D,u,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(R,null,D,p,_,null)}function x(A,R,D,E){let S=null;const w=D.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(w!==void 0)S=w;else if(S=D.isPointLight===!0?l:o,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const N=S.uuid,O=R.uuid;let V=c[N];V===void 0&&(V={},c[N]=V);let X=V[O];X===void 0&&(X=S.clone(),V[O]=X,R.addEventListener("dispose",C)),S=X}if(S.visible=R.visible,S.wireframe=R.wireframe,E===Mn?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:d[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,D.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const N=r.properties.get(S);N.light=D}return S}function v(A,R,D,E,S){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Mn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,A.matrixWorld);const O=e.update(A),V=A.material;if(Array.isArray(V)){const X=O.groups;for(let W=0,K=X.length;W<K;W++){const G=X[W],se=V[G.materialIndex];if(se&&se.visible){const de=x(A,se,E,S);A.onBeforeShadow(r,A,R,D,O,de,G),r.renderBufferDirect(D,null,O,de,A,G),A.onAfterShadow(r,A,R,D,O,de,G)}}}else if(V.visible){const X=x(A,V,E,S);A.onBeforeShadow(r,A,R,D,O,X,null),r.renderBufferDirect(D,null,O,X,A,null),A.onAfterShadow(r,A,R,D,O,X,null)}}const N=A.children;for(let O=0,V=N.length;O<V;O++)v(N[O],R,D,E,S)}function C(A){A.target.removeEventListener("dispose",C);for(const D in c){const E=c[D],S=A.target.uuid;S in E&&(E[S].dispose(),delete E[S])}}}const N0={[xa]:ya,[Ma]:Ea,[Sa]:Ta,[Ni]:ba,[ya]:xa,[Ea]:Ma,[Ta]:Sa,[ba]:Ni};function U0(r,e){function t(){let L=!1;const oe=new Ze;let z=null;const j=new Ze(0,0,0,0);return{setMask:function(ce){z!==ce&&!L&&(r.colorMask(ce,ce,ce,ce),z=ce)},setLocked:function(ce){L=ce},setClear:function(ce,le,Ue,ht,Et){Et===!0&&(ce*=ht,le*=ht,Ue*=ht),oe.set(ce,le,Ue,ht),j.equals(oe)===!1&&(r.clearColor(ce,le,Ue,ht),j.copy(oe))},reset:function(){L=!1,z=null,j.set(-1,0,0,0)}}}function n(){let L=!1,oe=!1,z=null,j=null,ce=null;return{setReversed:function(le){if(oe!==le){const Ue=e.get("EXT_clip_control");le?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),oe=le;const ht=ce;ce=null,this.setClear(ht)}},getReversed:function(){return oe},setTest:function(le){le?re(r.DEPTH_TEST):Te(r.DEPTH_TEST)},setMask:function(le){z!==le&&!L&&(r.depthMask(le),z=le)},setFunc:function(le){if(oe&&(le=N0[le]),j!==le){switch(le){case xa:r.depthFunc(r.NEVER);break;case ya:r.depthFunc(r.ALWAYS);break;case Ma:r.depthFunc(r.LESS);break;case Ni:r.depthFunc(r.LEQUAL);break;case Sa:r.depthFunc(r.EQUAL);break;case ba:r.depthFunc(r.GEQUAL);break;case Ea:r.depthFunc(r.GREATER);break;case Ta:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}j=le}},setLocked:function(le){L=le},setClear:function(le){ce!==le&&(oe&&(le=1-le),r.clearDepth(le),ce=le)},reset:function(){L=!1,z=null,j=null,ce=null,oe=!1}}}function i(){let L=!1,oe=null,z=null,j=null,ce=null,le=null,Ue=null,ht=null,Et=null;return{setTest:function(et){L||(et?re(r.STENCIL_TEST):Te(r.STENCIL_TEST))},setMask:function(et){oe!==et&&!L&&(r.stencilMask(et),oe=et)},setFunc:function(et,Zt,fn){(z!==et||j!==Zt||ce!==fn)&&(r.stencilFunc(et,Zt,fn),z=et,j=Zt,ce=fn)},setOp:function(et,Zt,fn){(le!==et||Ue!==Zt||ht!==fn)&&(r.stencilOp(et,Zt,fn),le=et,Ue=Zt,ht=fn)},setLocked:function(et){L=et},setClear:function(et){Et!==et&&(r.clearStencil(et),Et=et)},reset:function(){L=!1,oe=null,z=null,j=null,ce=null,le=null,Ue=null,ht=null,Et=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,b=null,x=null,v=null,C=null,A=null,R=new Me(0,0,0),D=0,E=!1,S=null,w=null,N=null,O=null,V=null;const X=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const G=r.getParameter(r.VERSION);G.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(G)[1]),W=K>=1):G.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),W=K>=2);let se=null,de={};const xe=r.getParameter(r.SCISSOR_BOX),ke=r.getParameter(r.VIEWPORT),st=new Ze().fromArray(xe),Y=new Ze().fromArray(ke);function te(L,oe,z,j){const ce=new Uint8Array(4),le=r.createTexture();r.bindTexture(L,le),r.texParameteri(L,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(L,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ue=0;Ue<z;Ue++)L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY?r.texImage3D(oe,0,r.RGBA,1,1,j,0,r.RGBA,r.UNSIGNED_BYTE,ce):r.texImage2D(oe+Ue,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ce);return le}const ge={};ge[r.TEXTURE_2D]=te(r.TEXTURE_2D,r.TEXTURE_2D,1),ge[r.TEXTURE_CUBE_MAP]=te(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),ge[r.TEXTURE_2D_ARRAY]=te(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),ge[r.TEXTURE_3D]=te(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(r.DEPTH_TEST),a.setFunc(Ni),$e(!1),Ve(Go),re(r.CULL_FACE),I(Hn);function re(L){h[L]!==!0&&(r.enable(L),h[L]=!0)}function Te(L){h[L]!==!1&&(r.disable(L),h[L]=!1)}function Ke(L,oe){return d[L]!==oe?(r.bindFramebuffer(L,oe),d[L]=oe,L===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=oe),L===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=oe),!0):!1}function Ae(L,oe){let z=p,j=!1;if(L){z=u.get(oe),z===void 0&&(z=[],u.set(oe,z));const ce=L.textures;if(z.length!==ce.length||z[0]!==r.COLOR_ATTACHMENT0){for(let le=0,Ue=ce.length;le<Ue;le++)z[le]=r.COLOR_ATTACHMENT0+le;z.length=ce.length,j=!0}}else z[0]!==r.BACK&&(z[0]=r.BACK,j=!0);j&&r.drawBuffers(z)}function ft(L){return g!==L?(r.useProgram(L),g=L,!0):!1}const ct={[ni]:r.FUNC_ADD,[Xh]:r.FUNC_SUBTRACT,[$h]:r.FUNC_REVERSE_SUBTRACT};ct[Yh]=r.MIN,ct[qh]=r.MAX;const Ge={[jh]:r.ZERO,[Kh]:r.ONE,[Zh]:r.SRC_COLOR,[_a]:r.SRC_ALPHA,[id]:r.SRC_ALPHA_SATURATE,[td]:r.DST_COLOR,[Qh]:r.DST_ALPHA,[Jh]:r.ONE_MINUS_SRC_COLOR,[va]:r.ONE_MINUS_SRC_ALPHA,[nd]:r.ONE_MINUS_DST_COLOR,[ed]:r.ONE_MINUS_DST_ALPHA,[sd]:r.CONSTANT_COLOR,[rd]:r.ONE_MINUS_CONSTANT_COLOR,[ad]:r.CONSTANT_ALPHA,[od]:r.ONE_MINUS_CONSTANT_ALPHA};function I(L,oe,z,j,ce,le,Ue,ht,Et,et){if(L===Hn){_===!0&&(Te(r.BLEND),_=!1);return}if(_===!1&&(re(r.BLEND),_=!0),L!==Wh){if(L!==m||et!==E){if((f!==ni||v!==ni)&&(r.blendEquation(r.FUNC_ADD),f=ni,v=ni),et)switch(L){case Pi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Vo:r.blendFunc(r.ONE,r.ONE);break;case Wo:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xo:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Pi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Vo:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case Wo:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Xo:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}b=null,x=null,C=null,A=null,R.set(0,0,0),D=0,m=L,E=et}return}ce=ce||oe,le=le||z,Ue=Ue||j,(oe!==f||ce!==v)&&(r.blendEquationSeparate(ct[oe],ct[ce]),f=oe,v=ce),(z!==b||j!==x||le!==C||Ue!==A)&&(r.blendFuncSeparate(Ge[z],Ge[j],Ge[le],Ge[Ue]),b=z,x=j,C=le,A=Ue),(ht.equals(R)===!1||Et!==D)&&(r.blendColor(ht.r,ht.g,ht.b,Et),R.copy(ht),D=Et),m=L,E=!1}function Vt(L,oe){L.side===cn?Te(r.CULL_FACE):re(r.CULL_FACE);let z=L.side===Bt;oe&&(z=!z),$e(z),L.blending===Pi&&L.transparent===!1?I(Hn):I(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),s.setMask(L.colorWrite);const j=L.stencilWrite;o.setTest(j),j&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),at(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?re(r.SAMPLE_ALPHA_TO_COVERAGE):Te(r.SAMPLE_ALPHA_TO_COVERAGE)}function $e(L){S!==L&&(L?r.frontFace(r.CW):r.frontFace(r.CCW),S=L)}function Ve(L){L!==Gh?(re(r.CULL_FACE),L!==w&&(L===Go?r.cullFace(r.BACK):L===Vh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Te(r.CULL_FACE),w=L}function ye(L){L!==N&&(W&&r.lineWidth(L),N=L)}function at(L,oe,z){L?(re(r.POLYGON_OFFSET_FILL),(O!==oe||V!==z)&&(r.polygonOffset(oe,z),O=oe,V=z)):Te(r.POLYGON_OFFSET_FILL)}function ve(L){L?re(r.SCISSOR_TEST):Te(r.SCISSOR_TEST)}function T(L){L===void 0&&(L=r.TEXTURE0+X-1),se!==L&&(r.activeTexture(L),se=L)}function y(L,oe,z){z===void 0&&(se===null?z=r.TEXTURE0+X-1:z=se);let j=de[z];j===void 0&&(j={type:void 0,texture:void 0},de[z]=j),(j.type!==L||j.texture!==oe)&&(se!==z&&(r.activeTexture(z),se=z),r.bindTexture(L,oe||ge[L]),j.type=L,j.texture=oe)}function B(){const L=de[se];L!==void 0&&L.type!==void 0&&(r.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function q(){try{r.compressedTexImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{r.compressedTexImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{r.texSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _e(){try{r.texSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ae(){try{r.compressedTexSubImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ue(){try{r.compressedTexSubImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ye(){try{r.texStorage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Q(){try{r.texStorage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function fe(){try{r.texImage2D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function we(){try{r.texImage3D(...arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ce(L){st.equals(L)===!1&&(r.scissor(L.x,L.y,L.z,L.w),st.copy(L))}function pe(L){Y.equals(L)===!1&&(r.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function We(L,oe){let z=c.get(oe);z===void 0&&(z=new WeakMap,c.set(oe,z));let j=z.get(L);j===void 0&&(j=r.getUniformBlockIndex(oe,L.name),z.set(L,j))}function Be(L,oe){const j=c.get(oe).get(L);l.get(oe)!==j&&(r.uniformBlockBinding(oe,j,L.__bindingPointIndex),l.set(oe,j))}function rt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},se=null,de={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,b=null,x=null,v=null,C=null,A=null,R=new Me(0,0,0),D=0,E=!1,S=null,w=null,N=null,O=null,V=null,st.set(0,0,r.canvas.width,r.canvas.height),Y.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:re,disable:Te,bindFramebuffer:Ke,drawBuffers:Ae,useProgram:ft,setBlending:I,setMaterial:Vt,setFlipSided:$e,setCullFace:Ve,setLineWidth:ye,setPolygonOffset:at,setScissorTest:ve,activeTexture:T,bindTexture:y,unbindTexture:B,compressedTexImage2D:q,compressedTexImage3D:Z,texImage2D:fe,texImage3D:we,updateUBOMapping:We,uniformBlockBinding:Be,texStorage2D:Ye,texStorage3D:Q,texSubImage2D:$,texSubImage3D:_e,compressedTexSubImage2D:ae,compressedTexSubImage3D:ue,scissor:Ce,viewport:pe,reset:rt}}function F0(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new De,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,y){return p?new OffscreenCanvas(T,y):Ms("canvas")}function _(T,y,B){let q=1;const Z=ve(T);if((Z.width>B||Z.height>B)&&(q=B/Math.max(Z.width,Z.height)),q<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const $=Math.floor(q*Z.width),_e=Math.floor(q*Z.height);d===void 0&&(d=g($,_e));const ae=y?g($,_e):d;return ae.width=$,ae.height=_e,ae.getContext("2d").drawImage(T,0,0,$,_e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+$+"x"+_e+")."),ae}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){r.generateMipmap(T)}function b(T){return T.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?r.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function x(T,y,B,q,Z=!1){if(T!==null){if(r[T]!==void 0)return r[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let $=y;if(y===r.RED&&(B===r.FLOAT&&($=r.R32F),B===r.HALF_FLOAT&&($=r.R16F),B===r.UNSIGNED_BYTE&&($=r.R8)),y===r.RED_INTEGER&&(B===r.UNSIGNED_BYTE&&($=r.R8UI),B===r.UNSIGNED_SHORT&&($=r.R16UI),B===r.UNSIGNED_INT&&($=r.R32UI),B===r.BYTE&&($=r.R8I),B===r.SHORT&&($=r.R16I),B===r.INT&&($=r.R32I)),y===r.RG&&(B===r.FLOAT&&($=r.RG32F),B===r.HALF_FLOAT&&($=r.RG16F),B===r.UNSIGNED_BYTE&&($=r.RG8)),y===r.RG_INTEGER&&(B===r.UNSIGNED_BYTE&&($=r.RG8UI),B===r.UNSIGNED_SHORT&&($=r.RG16UI),B===r.UNSIGNED_INT&&($=r.RG32UI),B===r.BYTE&&($=r.RG8I),B===r.SHORT&&($=r.RG16I),B===r.INT&&($=r.RG32I)),y===r.RGB_INTEGER&&(B===r.UNSIGNED_BYTE&&($=r.RGB8UI),B===r.UNSIGNED_SHORT&&($=r.RGB16UI),B===r.UNSIGNED_INT&&($=r.RGB32UI),B===r.BYTE&&($=r.RGB8I),B===r.SHORT&&($=r.RGB16I),B===r.INT&&($=r.RGB32I)),y===r.RGBA_INTEGER&&(B===r.UNSIGNED_BYTE&&($=r.RGBA8UI),B===r.UNSIGNED_SHORT&&($=r.RGBA16UI),B===r.UNSIGNED_INT&&($=r.RGBA32UI),B===r.BYTE&&($=r.RGBA8I),B===r.SHORT&&($=r.RGBA16I),B===r.INT&&($=r.RGBA32I)),y===r.RGB&&B===r.UNSIGNED_INT_5_9_9_9_REV&&($=r.RGB9_E5),y===r.RGBA){const _e=Z?_r:Xe.getTransfer(q);B===r.FLOAT&&($=r.RGBA32F),B===r.HALF_FLOAT&&($=r.RGBA16F),B===r.UNSIGNED_BYTE&&($=_e===it?r.SRGB8_ALPHA8:r.RGBA8),B===r.UNSIGNED_SHORT_4_4_4_4&&($=r.RGBA4),B===r.UNSIGNED_SHORT_5_5_5_1&&($=r.RGB5_A1)}return($===r.R16F||$===r.R32F||$===r.RG16F||$===r.RG32F||$===r.RGBA16F||$===r.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(T,y){let B;return T?y===null||y===ai||y===gs?B=r.DEPTH24_STENCIL8:y===sn?B=r.DEPTH32F_STENCIL8:y===ms&&(B=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===ai||y===gs?B=r.DEPTH_COMPONENT24:y===sn?B=r.DEPTH_COMPONENT32F:y===ms&&(B=r.DEPTH_COMPONENT16),B}function C(T,y){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Dt&&T.minFilter!==Gt?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function A(T){const y=T.target;y.removeEventListener("dispose",A),D(y),y.isVideoTexture&&h.delete(y)}function R(T){const y=T.target;y.removeEventListener("dispose",R),S(y)}function D(T){const y=n.get(T);if(y.__webglInit===void 0)return;const B=T.source,q=u.get(B);if(q){const Z=q[y.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&E(T),Object.keys(q).length===0&&u.delete(B)}n.remove(T)}function E(T){const y=n.get(T);r.deleteTexture(y.__webglTexture);const B=T.source,q=u.get(B);delete q[y.__cacheKey],a.memory.textures--}function S(T){const y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let Z=0;Z<y.__webglFramebuffer[q].length;Z++)r.deleteFramebuffer(y.__webglFramebuffer[q][Z]);else r.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)r.deleteFramebuffer(y.__webglFramebuffer[q]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const B=T.textures;for(let q=0,Z=B.length;q<Z;q++){const $=n.get(B[q]);$.__webglTexture&&(r.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(B[q])}n.remove(T)}let w=0;function N(){w=0}function O(){const T=w;return T>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),w+=1,T}function V(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function X(T,y){const B=n.get(T);if(T.isVideoTexture&&ye(T),T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){const q=T.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(B,T,y);return}}t.bindTexture(r.TEXTURE_2D,B.__webglTexture,r.TEXTURE0+y)}function W(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Y(B,T,y);return}t.bindTexture(r.TEXTURE_2D_ARRAY,B.__webglTexture,r.TEXTURE0+y)}function K(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){Y(B,T,y);return}t.bindTexture(r.TEXTURE_3D,B.__webglTexture,r.TEXTURE0+y)}function G(T,y){const B=n.get(T);if(T.version>0&&B.__version!==T.version){te(B,T,y);return}t.bindTexture(r.TEXTURE_CUBE_MAP,B.__webglTexture,r.TEXTURE0+y)}const se={[Bi]:r.REPEAT,[Bn]:r.CLAMP_TO_EDGE,[gr]:r.MIRRORED_REPEAT},de={[Dt]:r.NEAREST,[bc]:r.NEAREST_MIPMAP_NEAREST,[ls]:r.NEAREST_MIPMAP_LINEAR,[Gt]:r.LINEAR,[lr]:r.LINEAR_MIPMAP_NEAREST,[bn]:r.LINEAR_MIPMAP_LINEAR},xe={[Sd]:r.NEVER,[Rd]:r.ALWAYS,[bd]:r.LESS,[Uc]:r.LEQUAL,[Ed]:r.EQUAL,[Ad]:r.GEQUAL,[Td]:r.GREATER,[wd]:r.NOTEQUAL};function ke(T,y){if(y.type===sn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Gt||y.magFilter===lr||y.magFilter===ls||y.magFilter===bn||y.minFilter===Gt||y.minFilter===lr||y.minFilter===ls||y.minFilter===bn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(T,r.TEXTURE_WRAP_S,se[y.wrapS]),r.texParameteri(T,r.TEXTURE_WRAP_T,se[y.wrapT]),(T===r.TEXTURE_3D||T===r.TEXTURE_2D_ARRAY)&&r.texParameteri(T,r.TEXTURE_WRAP_R,se[y.wrapR]),r.texParameteri(T,r.TEXTURE_MAG_FILTER,de[y.magFilter]),r.texParameteri(T,r.TEXTURE_MIN_FILTER,de[y.minFilter]),y.compareFunction&&(r.texParameteri(T,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(T,r.TEXTURE_COMPARE_FUNC,xe[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Dt||y.minFilter!==ls&&y.minFilter!==bn||y.type===sn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const B=e.get("EXT_texture_filter_anisotropic");r.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function st(T,y){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",A));const q=y.source;let Z=u.get(q);Z===void 0&&(Z={},u.set(q,Z));const $=V(y);if($!==T.__cacheKey){Z[$]===void 0&&(Z[$]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,B=!0),Z[$].usedTimes++;const _e=Z[T.__cacheKey];_e!==void 0&&(Z[T.__cacheKey].usedTimes--,_e.usedTimes===0&&E(y)),T.__cacheKey=$,T.__webglTexture=Z[$].texture}return B}function Y(T,y,B){let q=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=r.TEXTURE_3D);const Z=st(T,y),$=y.source;t.bindTexture(q,T.__webglTexture,r.TEXTURE0+B);const _e=n.get($);if($.version!==_e.__version||Z===!0){t.activeTexture(r.TEXTURE0+B);const ae=Xe.getPrimaries(Xe.workingColorSpace),ue=y.colorSpace===Fn?null:Xe.getPrimaries(y.colorSpace),Ye=y.colorSpace===Fn||ae===ue?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let Q=_(y.image,!1,i.maxTextureSize);Q=at(y,Q);const fe=s.convert(y.format,y.colorSpace),we=s.convert(y.type);let Ce=x(y.internalFormat,fe,we,y.colorSpace,y.isVideoTexture);ke(q,y);let pe;const We=y.mipmaps,Be=y.isVideoTexture!==!0,rt=_e.__version===void 0||Z===!0,L=$.dataReady,oe=C(y,Q);if(y.isDepthTexture)Ce=v(y.format===vs,y.type),rt&&(Be?t.texStorage2D(r.TEXTURE_2D,1,Ce,Q.width,Q.height):t.texImage2D(r.TEXTURE_2D,0,Ce,Q.width,Q.height,0,fe,we,null));else if(y.isDataTexture)if(We.length>0){Be&&rt&&t.texStorage2D(r.TEXTURE_2D,oe,Ce,We[0].width,We[0].height);for(let z=0,j=We.length;z<j;z++)pe=We[z],Be?L&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,we,pe.data):t.texImage2D(r.TEXTURE_2D,z,Ce,pe.width,pe.height,0,fe,we,pe.data);y.generateMipmaps=!1}else Be?(rt&&t.texStorage2D(r.TEXTURE_2D,oe,Ce,Q.width,Q.height),L&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Q.width,Q.height,fe,we,Q.data)):t.texImage2D(r.TEXTURE_2D,0,Ce,Q.width,Q.height,0,fe,we,Q.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Be&&rt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,oe,Ce,We[0].width,We[0].height,Q.depth);for(let z=0,j=We.length;z<j;z++)if(pe=We[z],y.format!==Kt)if(fe!==null)if(Be){if(L)if(y.layerUpdates.size>0){const ce=Fl(pe.width,pe.height,y.format,y.type);for(const le of y.layerUpdates){const Ue=pe.data.subarray(le*ce/pe.data.BYTES_PER_ELEMENT,(le+1)*ce/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,le,pe.width,pe.height,1,fe,Ue)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,0,pe.width,pe.height,Q.depth,fe,pe.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,z,Ce,pe.width,pe.height,Q.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?L&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,z,0,0,0,pe.width,pe.height,Q.depth,fe,we,pe.data):t.texImage3D(r.TEXTURE_2D_ARRAY,z,Ce,pe.width,pe.height,Q.depth,0,fe,we,pe.data)}else{Be&&rt&&t.texStorage2D(r.TEXTURE_2D,oe,Ce,We[0].width,We[0].height);for(let z=0,j=We.length;z<j;z++)pe=We[z],y.format!==Kt?fe!==null?Be?L&&t.compressedTexSubImage2D(r.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,pe.data):t.compressedTexImage2D(r.TEXTURE_2D,z,Ce,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?L&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,pe.width,pe.height,fe,we,pe.data):t.texImage2D(r.TEXTURE_2D,z,Ce,pe.width,pe.height,0,fe,we,pe.data)}else if(y.isDataArrayTexture)if(Be){if(rt&&t.texStorage3D(r.TEXTURE_2D_ARRAY,oe,Ce,Q.width,Q.height,Q.depth),L)if(y.layerUpdates.size>0){const z=Fl(Q.width,Q.height,y.format,y.type);for(const j of y.layerUpdates){const ce=Q.data.subarray(j*z/Q.data.BYTES_PER_ELEMENT,(j+1)*z/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,j,Q.width,Q.height,1,fe,we,ce)}y.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,fe,we,Q.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ce,Q.width,Q.height,Q.depth,0,fe,we,Q.data);else if(y.isData3DTexture)Be?(rt&&t.texStorage3D(r.TEXTURE_3D,oe,Ce,Q.width,Q.height,Q.depth),L&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,fe,we,Q.data)):t.texImage3D(r.TEXTURE_3D,0,Ce,Q.width,Q.height,Q.depth,0,fe,we,Q.data);else if(y.isFramebufferTexture){if(rt)if(Be)t.texStorage2D(r.TEXTURE_2D,oe,Ce,Q.width,Q.height);else{let z=Q.width,j=Q.height;for(let ce=0;ce<oe;ce++)t.texImage2D(r.TEXTURE_2D,ce,Ce,z,j,0,fe,we,null),z>>=1,j>>=1}}else if(We.length>0){if(Be&&rt){const z=ve(We[0]);t.texStorage2D(r.TEXTURE_2D,oe,Ce,z.width,z.height)}for(let z=0,j=We.length;z<j;z++)pe=We[z],Be?L&&t.texSubImage2D(r.TEXTURE_2D,z,0,0,fe,we,pe):t.texImage2D(r.TEXTURE_2D,z,Ce,fe,we,pe);y.generateMipmaps=!1}else if(Be){if(rt){const z=ve(Q);t.texStorage2D(r.TEXTURE_2D,oe,Ce,z.width,z.height)}L&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,fe,we,Q)}else t.texImage2D(r.TEXTURE_2D,0,Ce,fe,we,Q);m(y)&&f(q),_e.__version=$.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function te(T,y,B){if(y.image.length!==6)return;const q=st(T,y),Z=y.source;t.bindTexture(r.TEXTURE_CUBE_MAP,T.__webglTexture,r.TEXTURE0+B);const $=n.get(Z);if(Z.version!==$.__version||q===!0){t.activeTexture(r.TEXTURE0+B);const _e=Xe.getPrimaries(Xe.workingColorSpace),ae=y.colorSpace===Fn?null:Xe.getPrimaries(y.colorSpace),ue=y.colorSpace===Fn||_e===ae?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const Ye=y.isCompressedTexture||y.image[0].isCompressedTexture,Q=y.image[0]&&y.image[0].isDataTexture,fe=[];for(let j=0;j<6;j++)!Ye&&!Q?fe[j]=_(y.image[j],!0,i.maxCubemapSize):fe[j]=Q?y.image[j].image:y.image[j],fe[j]=at(y,fe[j]);const we=fe[0],Ce=s.convert(y.format,y.colorSpace),pe=s.convert(y.type),We=x(y.internalFormat,Ce,pe,y.colorSpace),Be=y.isVideoTexture!==!0,rt=$.__version===void 0||q===!0,L=Z.dataReady;let oe=C(y,we);ke(r.TEXTURE_CUBE_MAP,y);let z;if(Ye){Be&&rt&&t.texStorage2D(r.TEXTURE_CUBE_MAP,oe,We,we.width,we.height);for(let j=0;j<6;j++){z=fe[j].mipmaps;for(let ce=0;ce<z.length;ce++){const le=z[ce];y.format!==Kt?Ce!==null?Be?L&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,0,0,le.width,le.height,Ce,le.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,We,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,0,0,le.width,le.height,Ce,pe,le.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce,We,le.width,le.height,0,Ce,pe,le.data)}}}else{if(z=y.mipmaps,Be&&rt){z.length>0&&oe++;const j=ve(fe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,oe,We,j.width,j.height)}for(let j=0;j<6;j++)if(Q){Be?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,fe[j].width,fe[j].height,Ce,pe,fe[j].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,fe[j].width,fe[j].height,0,Ce,pe,fe[j].data);for(let ce=0;ce<z.length;ce++){const Ue=z[ce].image[j].image;Be?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,0,0,Ue.width,Ue.height,Ce,pe,Ue.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,We,Ue.width,Ue.height,0,Ce,pe,Ue.data)}}else{Be?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ce,pe,fe[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,Ce,pe,fe[j]);for(let ce=0;ce<z.length;ce++){const le=z[ce];Be?L&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,0,0,Ce,pe,le.image[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,ce+1,We,Ce,pe,le.image[j])}}}m(y)&&f(r.TEXTURE_CUBE_MAP),$.__version=Z.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function ge(T,y,B,q,Z,$){const _e=s.convert(B.format,B.colorSpace),ae=s.convert(B.type),ue=x(B.internalFormat,_e,ae,B.colorSpace),Ye=n.get(y),Q=n.get(B);if(Q.__renderTarget=y,!Ye.__hasExternalTextures){const fe=Math.max(1,y.width>>$),we=Math.max(1,y.height>>$);Z===r.TEXTURE_3D||Z===r.TEXTURE_2D_ARRAY?t.texImage3D(Z,$,ue,fe,we,y.depth,0,_e,ae,null):t.texImage2D(Z,$,ue,fe,we,0,_e,ae,null)}t.bindFramebuffer(r.FRAMEBUFFER,T),Ve(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,q,Z,Q.__webglTexture,0,$e(y)):(Z===r.TEXTURE_2D||Z>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,q,Z,Q.__webglTexture,$),t.bindFramebuffer(r.FRAMEBUFFER,null)}function re(T,y,B){if(r.bindRenderbuffer(r.RENDERBUFFER,T),y.depthBuffer){const q=y.depthTexture,Z=q&&q.isDepthTexture?q.type:null,$=v(y.stencilBuffer,Z),_e=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=$e(y);Ve(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ae,$,y.width,y.height):B?r.renderbufferStorageMultisample(r.RENDERBUFFER,ae,$,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,$,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,_e,r.RENDERBUFFER,T)}else{const q=y.textures;for(let Z=0;Z<q.length;Z++){const $=q[Z],_e=s.convert($.format,$.colorSpace),ae=s.convert($.type),ue=x($.internalFormat,_e,ae,$.colorSpace),Ye=$e(y);B&&Ve(y)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ye,ue,y.width,y.height):Ve(y)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ye,ue,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,ue,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Te(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(y.depthTexture);q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),X(y.depthTexture,0);const Z=q.__webglTexture,$=$e(y);if(y.depthTexture.format===_s)Ve(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Z,0,$):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Z,0);else if(y.depthTexture.format===vs)Ve(y)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Z,0,$):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function Ke(T){const y=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const q=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){const Z=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",Z)};q.addEventListener("dispose",Z),y.__depthDisposeCallback=Z}y.__boundDepthTexture=q}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(B)throw new Error("target.depthTexture not supported in Cube render targets");Te(y.__webglFramebuffer,T)}else if(B){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=r.createRenderbuffer(),re(y.__webglDepthbuffer[q],T,!1);else{const Z=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,$=y.__webglDepthbuffer[q];r.bindRenderbuffer(r.RENDERBUFFER,$),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,$)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=r.createRenderbuffer(),re(y.__webglDepthbuffer,T,!1);else{const q=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Z),r.framebufferRenderbuffer(r.FRAMEBUFFER,q,r.RENDERBUFFER,Z)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ae(T,y,B){const q=n.get(T);y!==void 0&&ge(q.__webglFramebuffer,T,T.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),B!==void 0&&Ke(T)}function ft(T){const y=T.texture,B=n.get(T),q=n.get(y);T.addEventListener("dispose",R);const Z=T.textures,$=T.isWebGLCubeRenderTarget===!0,_e=Z.length>1;if(_e||(q.__webglTexture===void 0&&(q.__webglTexture=r.createTexture()),q.__version=y.version,a.memory.textures++),$){B.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer[ae]=[];for(let ue=0;ue<y.mipmaps.length;ue++)B.__webglFramebuffer[ae][ue]=r.createFramebuffer()}else B.__webglFramebuffer[ae]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){B.__webglFramebuffer=[];for(let ae=0;ae<y.mipmaps.length;ae++)B.__webglFramebuffer[ae]=r.createFramebuffer()}else B.__webglFramebuffer=r.createFramebuffer();if(_e)for(let ae=0,ue=Z.length;ae<ue;ae++){const Ye=n.get(Z[ae]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=r.createTexture(),a.memory.textures++)}if(T.samples>0&&Ve(T)===!1){B.__webglMultisampledFramebuffer=r.createFramebuffer(),B.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let ae=0;ae<Z.length;ae++){const ue=Z[ae];B.__webglColorRenderbuffer[ae]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,B.__webglColorRenderbuffer[ae]);const Ye=s.convert(ue.format,ue.colorSpace),Q=s.convert(ue.type),fe=x(ue.internalFormat,Ye,Q,ue.colorSpace,T.isXRRenderTarget===!0),we=$e(T);r.renderbufferStorageMultisample(r.RENDERBUFFER,we,fe,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ae,r.RENDERBUFFER,B.__webglColorRenderbuffer[ae])}r.bindRenderbuffer(r.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=r.createRenderbuffer(),re(B.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if($){t.bindTexture(r.TEXTURE_CUBE_MAP,q.__webglTexture),ke(r.TEXTURE_CUBE_MAP,y);for(let ae=0;ae<6;ae++)if(y.mipmaps&&y.mipmaps.length>0)for(let ue=0;ue<y.mipmaps.length;ue++)ge(B.__webglFramebuffer[ae][ue],T,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ue);else ge(B.__webglFramebuffer[ae],T,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(y)&&f(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let ae=0,ue=Z.length;ae<ue;ae++){const Ye=Z[ae],Q=n.get(Ye);t.bindTexture(r.TEXTURE_2D,Q.__webglTexture),ke(r.TEXTURE_2D,Ye),ge(B.__webglFramebuffer,T,Ye,r.COLOR_ATTACHMENT0+ae,r.TEXTURE_2D,0),m(Ye)&&f(r.TEXTURE_2D)}t.unbindTexture()}else{let ae=r.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ae=T.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ae,q.__webglTexture),ke(ae,y),y.mipmaps&&y.mipmaps.length>0)for(let ue=0;ue<y.mipmaps.length;ue++)ge(B.__webglFramebuffer[ue],T,y,r.COLOR_ATTACHMENT0,ae,ue);else ge(B.__webglFramebuffer,T,y,r.COLOR_ATTACHMENT0,ae,0);m(y)&&f(ae),t.unbindTexture()}T.depthBuffer&&Ke(T)}function ct(T){const y=T.textures;for(let B=0,q=y.length;B<q;B++){const Z=y[B];if(m(Z)){const $=b(T),_e=n.get(Z).__webglTexture;t.bindTexture($,_e),f($),t.unbindTexture()}}}const Ge=[],I=[];function Vt(T){if(T.samples>0){if(Ve(T)===!1){const y=T.textures,B=T.width,q=T.height;let Z=r.COLOR_BUFFER_BIT;const $=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,_e=n.get(T),ae=y.length>1;if(ae)for(let ue=0;ue<y.length;ue++)t.bindFramebuffer(r.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ue,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,_e.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ue,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let ue=0;ue<y.length;ue++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Z|=r.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Z|=r.STENCIL_BUFFER_BIT)),ae){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,_e.__webglColorRenderbuffer[ue]);const Ye=n.get(y[ue]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ye,0)}r.blitFramebuffer(0,0,B,q,0,0,B,q,Z,r.NEAREST),l===!0&&(Ge.length=0,I.length=0,Ge.push(r.COLOR_ATTACHMENT0+ue),T.depthBuffer&&T.resolveDepthBuffer===!1&&(Ge.push($),I.push($),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,I)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Ge))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ae)for(let ue=0;ue<y.length;ue++){t.bindFramebuffer(r.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ue,r.RENDERBUFFER,_e.__webglColorRenderbuffer[ue]);const Ye=n.get(y[ue]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,_e.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ue,r.TEXTURE_2D,Ye,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const y=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function $e(T){return Math.min(i.maxSamples,T.samples)}function Ve(T){const y=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ye(T){const y=a.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function at(T,y){const B=T.colorSpace,q=T.format,Z=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==Ut&&B!==Fn&&(Xe.getTransfer(B)===it?(q!==Kt||Z!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",B)),y}function ve(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=N,this.setTexture2D=X,this.setTexture2DArray=W,this.setTexture3D=K,this.setTextureCube=G,this.rebindTextures=Ae,this.setupRenderTarget=ft,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=Vt,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=Ve}function B0(r,e){function t(n,i=Fn){let s;const a=Xe.getTransfer(i);if(n===An)return r.UNSIGNED_BYTE;if(n===ho)return r.UNSIGNED_SHORT_4_4_4_4;if(n===uo)return r.UNSIGNED_SHORT_5_5_5_1;if(n===wc)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Ec)return r.BYTE;if(n===Tc)return r.SHORT;if(n===ms)return r.UNSIGNED_SHORT;if(n===co)return r.INT;if(n===ai)return r.UNSIGNED_INT;if(n===sn)return r.FLOAT;if(n===Es)return r.HALF_FLOAT;if(n===Ac)return r.ALPHA;if(n===Rc)return r.RGB;if(n===Kt)return r.RGBA;if(n===Cc)return r.LUMINANCE;if(n===Ic)return r.LUMINANCE_ALPHA;if(n===_s)return r.DEPTH_COMPONENT;if(n===vs)return r.DEPTH_STENCIL;if(n===fo)return r.RED;if(n===po)return r.RED_INTEGER;if(n===Pc)return r.RG;if(n===mo)return r.RG_INTEGER;if(n===go)return r.RGBA_INTEGER;if(n===cr||n===hr||n===dr||n===ur)if(a===it)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===cr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===dr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ur)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===cr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===hr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===dr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ur)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ra||n===Ca||n===Ia||n===Pa)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ra)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ca)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ia)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Pa)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===La||n===Da||n===Na)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===La||n===Da)return a===it?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Na)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ua||n===Fa||n===Ba||n===Oa||n===ka||n===Ha||n===za||n===Ga||n===Va||n===Wa||n===Xa||n===$a||n===Ya||n===qa)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Ua)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ba)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ka)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ha)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===za)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ga)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Va)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===$a)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ya)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===qa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fr||n===ja||n===Ka)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===fr)return a===it?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ja)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ka)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Lc||n===Za||n===Ja||n===Qa)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===fr)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Za)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ja)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qa)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gs?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const O0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,k0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class H0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new vt,s=e.properties.get(i);s.__webglTexture=t.texture,(t.depthNear!==n.depthNear||t.depthFar!==n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gn({vertexShader:O0,fragmentShader:k0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ee(new Rt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class z0 extends Vi{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null;const _=new H0,m=t.getContextAttributes();let f=null,b=null;const x=[],v=[],C=new De;let A=null;const R=new Ct;R.viewport=new Ze;const D=new Ct;D.viewport=new Ze;const E=[R,D],S=new Ju;let w=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let te=x[Y];return te===void 0&&(te=new Jr,x[Y]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Y){let te=x[Y];return te===void 0&&(te=new Jr,x[Y]=te),te.getGripSpace()},this.getHand=function(Y){let te=x[Y];return te===void 0&&(te=new Jr,x[Y]=te),te.getHandSpace()};function O(Y){const te=v.indexOf(Y.inputSource);if(te===-1)return;const ge=x[te];ge!==void 0&&(ge.update(Y.inputSource,Y.frame,c||a),ge.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",X);for(let Y=0;Y<x.length;Y++){const te=v[Y];te!==null&&(v[Y]=null,x[Y].disconnect(te))}w=null,N=null,_.reset(),e.setRenderTarget(f),p=null,u=null,d=null,i=null,b=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(f=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",V),i.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(C),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,re=null,Te=null;m.depth&&(Te=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=m.stencil?vs:_s,re=m.stencil?gs:ai);const Ke={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:s};d=new XRWebGLBinding(i,t),u=d.createProjectionLayer(Ke),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),b=new oi(u.textureWidth,u.textureHeight,{format:Kt,type:An,depthTexture:new Qc(u.textureWidth,u.textureHeight,re,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const ge={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,t,ge),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new oi(p.framebufferWidth,p.framebufferHeight,{format:Kt,type:An,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),st.setContext(i),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function X(Y){for(let te=0;te<Y.removed.length;te++){const ge=Y.removed[te],re=v.indexOf(ge);re>=0&&(v[re]=null,x[re].disconnect(ge))}for(let te=0;te<Y.added.length;te++){const ge=Y.added[te];let re=v.indexOf(ge);if(re===-1){for(let Ke=0;Ke<x.length;Ke++)if(Ke>=v.length){v.push(ge),re=Ke;break}else if(v[Ke]===null){v[Ke]=ge,re=Ke;break}if(re===-1)break}const Te=x[re];Te&&Te.connect(ge)}}const W=new P,K=new P;function G(Y,te,ge){W.setFromMatrixPosition(te.matrixWorld),K.setFromMatrixPosition(ge.matrixWorld);const re=W.distanceTo(K),Te=te.projectionMatrix.elements,Ke=ge.projectionMatrix.elements,Ae=Te[14]/(Te[10]-1),ft=Te[14]/(Te[10]+1),ct=(Te[9]+1)/Te[5],Ge=(Te[9]-1)/Te[5],I=(Te[8]-1)/Te[0],Vt=(Ke[8]+1)/Ke[0],$e=Ae*I,Ve=Ae*Vt,ye=re/(-I+Vt),at=ye*-I;if(te.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(at),Y.translateZ(ye),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const ve=Ae+ye,T=ft+ye,y=$e-at,B=Ve+(re-at),q=ct*ft/T*ve,Z=Ge*ft/T*ve;Y.projectionMatrix.makePerspective(y,B,q,Z,ve,T),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function se(Y,te){te===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(te.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let te=Y.near,ge=Y.far;_.texture!==null&&(_.depthNear>0&&(te=_.depthNear),_.depthFar>0&&(ge=_.depthFar)),S.near=D.near=R.near=te,S.far=D.far=R.far=ge,(w!==S.near||N!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),w=S.near,N=S.far),R.layers.mask=Y.layers.mask|2,D.layers.mask=Y.layers.mask|4,S.layers.mask=R.layers.mask|D.layers.mask;const re=Y.parent,Te=S.cameras;se(S,re);for(let Ke=0;Ke<Te.length;Ke++)se(Te[Ke],re);Te.length===2?G(S,R,D):S.projectionMatrix.copy(R.projectionMatrix),de(Y,S,re)};function de(Y,te,ge){ge===null?Y.matrix.copy(te.matrixWorld):(Y.matrix.copy(ge.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(te.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Oi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Y){l=Y,u!==null&&(u.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(S)};let xe=null;function ke(Y,te){if(h=te.getViewerPose(c||a),g=te,h!==null){const ge=h.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let re=!1;ge.length!==S.cameras.length&&(S.cameras.length=0,re=!0);for(let Ae=0;Ae<ge.length;Ae++){const ft=ge[Ae];let ct=null;if(p!==null)ct=p.getViewport(ft);else{const I=d.getViewSubImage(u,ft);ct=I.viewport,Ae===0&&(e.setRenderTargetTextures(b,I.colorTexture,I.depthStencilTexture),e.setRenderTarget(b))}let Ge=E[Ae];Ge===void 0&&(Ge=new Ct,Ge.layers.enable(Ae),Ge.viewport=new Ze,E[Ae]=Ge),Ge.matrix.fromArray(ft.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(ft.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(ct.x,ct.y,ct.width,ct.height),Ae===0&&(S.matrix.copy(Ge.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),re===!0&&S.cameras.push(Ge)}const Te=i.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&d){const Ae=d.getDepthInformation(ge[0]);Ae&&Ae.isValid&&Ae.texture&&_.init(e,Ae,i.renderState)}}for(let ge=0;ge<x.length;ge++){const re=v[ge],Te=x[ge];re!==null&&Te!==void 0&&Te.update(re,te,c||a)}xe&&xe(Y,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}const st=new sh;st.setAnimationLoop(ke),this.setAnimationLoop=function(Y){xe=Y},this.dispose=function(){}}}const Zn=new hn,G0=new Ne;function V0(r,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Gc(r)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,b,x,v){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,v)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),_(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,b,x):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Bt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Bt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const b=e.get(f),x=b.envMap,v=b.envMapRotation;x&&(m.envMap.value=x,Zn.copy(v),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),m.envMapRotation.value.setFromMatrix4(G0.makeRotationFromEuler(Zn)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,b,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=x*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Bt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const b=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function W0(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,x){const v=x.program;n.uniformBlockBinding(b,v)}function c(b,x){let v=i[b.id];v===void 0&&(g(b),v=h(b),i[b.id]=v,b.addEventListener("dispose",m));const C=x.program;n.updateUBOMapping(b,C);const A=e.render.frame;s[b.id]!==A&&(u(b),s[b.id]=A)}function h(b){const x=d();b.__bindingPointIndex=x;const v=r.createBuffer(),C=b.__size,A=b.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,C,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,x,v),v}function d(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(b){const x=i[b.id],v=b.uniforms,C=b.__cache;r.bindBuffer(r.UNIFORM_BUFFER,x);for(let A=0,R=v.length;A<R;A++){const D=Array.isArray(v[A])?v[A]:[v[A]];for(let E=0,S=D.length;E<S;E++){const w=D[E];if(p(w,A,E,C)===!0){const N=w.__offset,O=Array.isArray(w.value)?w.value:[w.value];let V=0;for(let X=0;X<O.length;X++){const W=O[X],K=_(W);typeof W=="number"||typeof W=="boolean"?(w.__data[0]=W,r.bufferSubData(r.UNIFORM_BUFFER,N+V,w.__data)):W.isMatrix3?(w.__data[0]=W.elements[0],w.__data[1]=W.elements[1],w.__data[2]=W.elements[2],w.__data[3]=0,w.__data[4]=W.elements[3],w.__data[5]=W.elements[4],w.__data[6]=W.elements[5],w.__data[7]=0,w.__data[8]=W.elements[6],w.__data[9]=W.elements[7],w.__data[10]=W.elements[8],w.__data[11]=0):(W.toArray(w.__data,V),V+=K.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,N,w.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(b,x,v,C){const A=b.value,R=x+"_"+v;if(C[R]===void 0)return typeof A=="number"||typeof A=="boolean"?C[R]=A:C[R]=A.clone(),!0;{const D=C[R];if(typeof A=="number"||typeof A=="boolean"){if(D!==A)return C[R]=A,!0}else if(D.equals(A)===!1)return D.copy(A),!0}return!1}function g(b){const x=b.uniforms;let v=0;const C=16;for(let R=0,D=x.length;R<D;R++){const E=Array.isArray(x[R])?x[R]:[x[R]];for(let S=0,w=E.length;S<w;S++){const N=E[S],O=Array.isArray(N.value)?N.value:[N.value];for(let V=0,X=O.length;V<X;V++){const W=O[V],K=_(W),G=v%C,se=G%K.boundary,de=G+se;v+=se,de!==0&&C-de<K.storage&&(v+=C-de),N.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=v,v+=K.storage}}}const A=v%C;return A>0&&(v+=C-A),b.__size=v,b.__cache={},this}function _(b){const x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function m(b){const x=b.target;x.removeEventListener("dispose",m);const v=a.indexOf(x.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(i[x.id]),delete i[x.id],delete s[x.id]}function f(){for(const b in i)r.deleteBuffer(i[b]);a=[],i={},s={}}return{bind:l,update:c,dispose:f}}class ch{constructor(e={}){const{canvas:t=Xd(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const b=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let C=!1;this._outputColorSpace=ut;let A=0,R=0,D=null,E=-1,S=null;const w=new Ze,N=new Ze;let O=null;const V=new Me(0);let X=0,W=t.width,K=t.height,G=1,se=null,de=null;const xe=new Ze(0,0,W,K),ke=new Ze(0,0,W,K);let st=!1;const Y=new yo;let te=!1,ge=!1;const re=new Ne,Te=new Ne,Ke=new P,Ae=new Ze,ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ct=!1;function Ge(){return D===null?G:1}let I=n;function Vt(M,U){return t.getContext(M,U)}try{const M={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${oo}`),t.addEventListener("webglcontextlost",j,!1),t.addEventListener("webglcontextrestored",ce,!1),t.addEventListener("webglcontextcreationerror",le,!1),I===null){const U="webgl2";if(I=Vt(U,M),I===null)throw Vt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let $e,Ve,ye,at,ve,T,y,B,q,Z,$,_e,ae,ue,Ye,Q,fe,we,Ce,pe,We,Be,rt,L;function oe(){$e=new tg(I),$e.init(),Be=new B0(I,$e),Ve=new qm(I,$e,e,Be),ye=new U0(I,$e),Ve.reverseDepthBuffer&&u&&ye.buffers.depth.setReversed(!0),at=new sg(I),ve=new S0,T=new F0(I,$e,ye,ve,Ve,Be,at),y=new Km(v),B=new eg(v),q=new hf(I),rt=new $m(I,q),Z=new ng(I,q,at,rt),$=new ag(I,Z,q,at),Ce=new rg(I,Ve,T),Q=new jm(ve),_e=new M0(v,y,B,$e,Ve,rt,Q),ae=new V0(v,ve),ue=new E0,Ye=new I0($e),we=new Xm(v,y,B,ye,$,p,l),fe=new D0(v,$,Ve),L=new W0(I,at,Ve,ye),pe=new Ym(I,$e,at),We=new ig(I,$e,at),at.programs=_e.programs,v.capabilities=Ve,v.extensions=$e,v.properties=ve,v.renderLists=ue,v.shadowMap=fe,v.state=ye,v.info=at}oe();const z=new z0(v,I);this.xr=z,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const M=$e.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=$e.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(M){M!==void 0&&(G=M,this.setSize(W,K,!1))},this.getSize=function(M){return M.set(W,K)},this.setSize=function(M,U,k=!0){if(z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=M,K=U,t.width=Math.floor(M*G),t.height=Math.floor(U*G),k===!0&&(t.style.width=M+"px",t.style.height=U+"px"),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(W*G,K*G).floor()},this.setDrawingBufferSize=function(M,U,k){W=M,K=U,G=k,t.width=Math.floor(M*k),t.height=Math.floor(U*k),this.setViewport(0,0,M,U)},this.getCurrentViewport=function(M){return M.copy(w)},this.getViewport=function(M){return M.copy(xe)},this.setViewport=function(M,U,k,H){M.isVector4?xe.set(M.x,M.y,M.z,M.w):xe.set(M,U,k,H),ye.viewport(w.copy(xe).multiplyScalar(G).round())},this.getScissor=function(M){return M.copy(ke)},this.setScissor=function(M,U,k,H){M.isVector4?ke.set(M.x,M.y,M.z,M.w):ke.set(M,U,k,H),ye.scissor(N.copy(ke).multiplyScalar(G).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(M){ye.setScissorTest(st=M)},this.setOpaqueSort=function(M){se=M},this.setTransparentSort=function(M){de=M},this.getClearColor=function(M){return M.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,k=!0){let H=0;if(M){let F=!1;if(D!==null){const J=D.texture.format;F=J===go||J===mo||J===po}if(F){const J=D.texture.type,ie=J===An||J===ai||J===ms||J===gs||J===ho||J===uo,he=we.getClearColor(),me=we.getClearAlpha(),Ie=he.r,Re=he.g,Se=he.b;ie?(g[0]=Ie,g[1]=Re,g[2]=Se,g[3]=me,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ie,_[1]=Re,_[2]=Se,_[3]=me,I.clearBufferiv(I.COLOR,0,_))}else H|=I.COLOR_BUFFER_BIT}U&&(H|=I.DEPTH_BUFFER_BIT),k&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",j,!1),t.removeEventListener("webglcontextrestored",ce,!1),t.removeEventListener("webglcontextcreationerror",le,!1),we.dispose(),ue.dispose(),Ye.dispose(),ve.dispose(),y.dispose(),B.dispose(),$.dispose(),rt.dispose(),L.dispose(),_e.dispose(),z.dispose(),z.removeEventListener("sessionstart",Ao),z.removeEventListener("sessionend",Ro),Wn.stop()};function j(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function ce(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const M=at.autoReset,U=fe.enabled,k=fe.autoUpdate,H=fe.needsUpdate,F=fe.type;oe(),at.autoReset=M,fe.enabled=U,fe.autoUpdate=k,fe.needsUpdate=H,fe.type=F}function le(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Ue(M){const U=M.target;U.removeEventListener("dispose",Ue),ht(U)}function ht(M){Et(M),ve.remove(M)}function Et(M){const U=ve.get(M).programs;U!==void 0&&(U.forEach(function(k){_e.releaseProgram(k)}),M.isShaderMaterial&&_e.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,k,H,F,J){U===null&&(U=ft);const ie=F.isMesh&&F.matrixWorld.determinant()<0,he=uh(M,U,k,H,F);ye.setMaterial(H,ie);let me=k.index,Ie=1;if(H.wireframe===!0){if(me=Z.getWireframeAttribute(k),me===void 0)return;Ie=2}const Re=k.drawRange,Se=k.attributes.position;let qe=Re.start*Ie,Je=(Re.start+Re.count)*Ie;J!==null&&(qe=Math.max(qe,J.start*Ie),Je=Math.min(Je,(J.start+J.count)*Ie)),me!==null?(qe=Math.max(qe,0),Je=Math.min(Je,me.count)):Se!=null&&(qe=Math.max(qe,0),Je=Math.min(Je,Se.count));const gt=Je-qe;if(gt<0||gt===1/0)return;rt.setup(F,H,he,k,me);let dt,je=pe;if(me!==null&&(dt=q.get(me),je=We,je.setIndex(dt)),F.isMesh)H.wireframe===!0?(ye.setLineWidth(H.wireframeLinewidth*Ge()),je.setMode(I.LINES)):je.setMode(I.TRIANGLES);else if(F.isLine){let be=H.linewidth;be===void 0&&(be=1),ye.setLineWidth(be*Ge()),F.isLineSegments?je.setMode(I.LINES):F.isLineLoop?je.setMode(I.LINE_LOOP):je.setMode(I.LINE_STRIP)}else F.isPoints?je.setMode(I.POINTS):F.isSprite&&je.setMode(I.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)pr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),je.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if($e.get("WEBGL_multi_draw"))je.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const be=F._multiDrawStarts,bt=F._multiDrawCounts,Qe=F._multiDrawCount,Jt=me?q.get(me).bytesPerElement:1,ci=ve.get(H).currentProgram.getUniforms();for(let kt=0;kt<Qe;kt++)ci.setValue(I,"_gl_DrawID",kt),je.render(be[kt]/Jt,bt[kt])}else if(F.isInstancedMesh)je.renderInstances(qe,gt,F.count);else if(k.isInstancedBufferGeometry){const be=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,bt=Math.min(k.instanceCount,be);je.renderInstances(qe,gt,bt)}else je.render(qe,gt)};function et(M,U,k){M.transparent===!0&&M.side===cn&&M.forceSinglePass===!1?(M.side=Bt,M.needsUpdate=!0,As(M,U,k),M.side=wn,M.needsUpdate=!0,As(M,U,k),M.side=cn):As(M,U,k)}this.compile=function(M,U,k=null){k===null&&(k=M),f=Ye.get(k),f.init(U),x.push(f),k.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),M!==k&&M.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(f.pushLight(F),F.castShadow&&f.pushShadow(F))}),f.setupLights();const H=new Set;return M.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const J=F.material;if(J)if(Array.isArray(J))for(let ie=0;ie<J.length;ie++){const he=J[ie];et(he,k,F),H.add(he)}else et(J,k,F),H.add(J)}),f=x.pop(),H},this.compileAsync=function(M,U,k=null){const H=this.compile(M,U,k);return new Promise(F=>{function J(){if(H.forEach(function(ie){ve.get(ie).currentProgram.isReady()&&H.delete(ie)}),H.size===0){F(M);return}setTimeout(J,10)}$e.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let Zt=null;function fn(M){Zt&&Zt(M)}function Ao(){Wn.stop()}function Ro(){Wn.start()}const Wn=new sh;Wn.setAnimationLoop(fn),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(M){Zt=M,z.setAnimationLoop(M),M===null?Wn.stop():Wn.start()},z.addEventListener("sessionstart",Ao),z.addEventListener("sessionend",Ro),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),z.enabled===!0&&z.isPresenting===!0&&(z.cameraAutoUpdate===!0&&z.updateCamera(U),U=z.getCamera()),M.isScene===!0&&M.onBeforeRender(v,M,U,D),f=Ye.get(M,x.length),f.init(U),x.push(f),Te.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(Te),ge=this.localClippingEnabled,te=Q.init(this.clippingPlanes,ge),m=ue.get(M,b.length),m.init(),b.push(m),z.enabled===!0&&z.isPresenting===!0){const J=v.xr.getDepthSensingMesh();J!==null&&Ar(J,U,-1/0,v.sortObjects)}Ar(M,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(se,de),ct=z.enabled===!1||z.isPresenting===!1||z.hasDepthSensing()===!1,ct&&we.addToRenderList(m,M),this.info.render.frame++,te===!0&&Q.beginShadows();const k=f.state.shadowsArray;fe.render(k,M,U),te===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,F=m.transmissive;if(f.setupLights(),U.isArrayCamera){const J=U.cameras;if(F.length>0)for(let ie=0,he=J.length;ie<he;ie++){const me=J[ie];Io(H,F,M,me)}ct&&we.render(M);for(let ie=0,he=J.length;ie<he;ie++){const me=J[ie];Co(m,M,me,me.viewport)}}else F.length>0&&Io(H,F,M,U),ct&&we.render(M),Co(m,M,U);D!==null&&R===0&&(T.updateMultisampleRenderTarget(D),T.updateRenderTargetMipmap(D)),M.isScene===!0&&M.onAfterRender(v,M,U),rt.resetDefaultState(),E=-1,S=null,x.pop(),x.length>0?(f=x[x.length-1],te===!0&&Q.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Ar(M,U,k,H){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)k=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Y.intersectsSprite(M)){H&&Ae.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Te);const ie=$.update(M),he=M.material;he.visible&&m.push(M,ie,he,k,Ae.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Y.intersectsObject(M))){const ie=$.update(M),he=M.material;if(H&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Ae.copy(M.boundingSphere.center)):(ie.boundingSphere===null&&ie.computeBoundingSphere(),Ae.copy(ie.boundingSphere.center)),Ae.applyMatrix4(M.matrixWorld).applyMatrix4(Te)),Array.isArray(he)){const me=ie.groups;for(let Ie=0,Re=me.length;Ie<Re;Ie++){const Se=me[Ie],qe=he[Se.materialIndex];qe&&qe.visible&&m.push(M,ie,qe,k,Ae.z,Se)}}else he.visible&&m.push(M,ie,he,k,Ae.z,null)}}const J=M.children;for(let ie=0,he=J.length;ie<he;ie++)Ar(J[ie],U,k,H)}function Co(M,U,k,H){const F=M.opaque,J=M.transmissive,ie=M.transparent;f.setupLightsView(k),te===!0&&Q.setGlobalState(v.clippingPlanes,k),H&&ye.viewport(w.copy(H)),F.length>0&&ws(F,U,k),J.length>0&&ws(J,U,k),ie.length>0&&ws(ie,U,k),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function Io(M,U,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[H.id]===void 0&&(f.state.transmissionRenderTarget[H.id]=new oi(1,1,{generateMipmaps:!0,type:$e.has("EXT_color_buffer_half_float")||$e.has("EXT_color_buffer_float")?Es:An,minFilter:bn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const J=f.state.transmissionRenderTarget[H.id],ie=H.viewport||w;J.setSize(ie.z*v.transmissionResolutionScale,ie.w*v.transmissionResolutionScale);const he=v.getRenderTarget();v.setRenderTarget(J),v.getClearColor(V),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),ct&&we.render(k);const me=v.toneMapping;v.toneMapping=zn;const Ie=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),f.setupLightsView(H),te===!0&&Q.setGlobalState(v.clippingPlanes,H),ws(M,k,H),T.updateMultisampleRenderTarget(J),T.updateRenderTargetMipmap(J),$e.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let Se=0,qe=U.length;Se<qe;Se++){const Je=U[Se],gt=Je.object,dt=Je.geometry,je=Je.material,be=Je.group;if(je.side===cn&&gt.layers.test(H.layers)){const bt=je.side;je.side=Bt,je.needsUpdate=!0,Po(gt,k,H,dt,je,be),je.side=bt,je.needsUpdate=!0,Re=!0}}Re===!0&&(T.updateMultisampleRenderTarget(J),T.updateRenderTargetMipmap(J))}v.setRenderTarget(he),v.setClearColor(V,X),Ie!==void 0&&(H.viewport=Ie),v.toneMapping=me}function ws(M,U,k){const H=U.isScene===!0?U.overrideMaterial:null;for(let F=0,J=M.length;F<J;F++){const ie=M[F],he=ie.object,me=ie.geometry,Ie=ie.group;let Re=ie.material;Re.allowOverride===!0&&H!==null&&(Re=H),he.layers.test(k.layers)&&Po(he,U,k,me,Re,Ie)}}function Po(M,U,k,H,F,J){M.onBeforeRender(v,U,k,H,F,J),M.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),F.onBeforeRender(v,U,k,H,M,J),F.transparent===!0&&F.side===cn&&F.forceSinglePass===!1?(F.side=Bt,F.needsUpdate=!0,v.renderBufferDirect(k,U,H,F,M,J),F.side=wn,F.needsUpdate=!0,v.renderBufferDirect(k,U,H,F,M,J),F.side=cn):v.renderBufferDirect(k,U,H,F,M,J),M.onAfterRender(v,U,k,H,F,J)}function As(M,U,k){U.isScene!==!0&&(U=ft);const H=ve.get(M),F=f.state.lights,J=f.state.shadowsArray,ie=F.state.version,he=_e.getParameters(M,F.state,J,U,k),me=_e.getProgramCacheKey(he);let Ie=H.programs;H.environment=M.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(M.isMeshStandardMaterial?B:y).get(M.envMap||H.environment),H.envMapRotation=H.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Ie===void 0&&(M.addEventListener("dispose",Ue),Ie=new Map,H.programs=Ie);let Re=Ie.get(me);if(Re!==void 0){if(H.currentProgram===Re&&H.lightsStateVersion===ie)return Do(M,he),Re}else he.uniforms=_e.getUniforms(M),M.onBeforeCompile(he,v),Re=_e.acquireProgram(he,me),Ie.set(me,Re),H.uniforms=he.uniforms;const Se=H.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Se.clippingPlanes=Q.uniform),Do(M,he),H.needsLights=ph(M),H.lightsStateVersion=ie,H.needsLights&&(Se.ambientLightColor.value=F.state.ambient,Se.lightProbe.value=F.state.probe,Se.directionalLights.value=F.state.directional,Se.directionalLightShadows.value=F.state.directionalShadow,Se.spotLights.value=F.state.spot,Se.spotLightShadows.value=F.state.spotShadow,Se.rectAreaLights.value=F.state.rectArea,Se.ltc_1.value=F.state.rectAreaLTC1,Se.ltc_2.value=F.state.rectAreaLTC2,Se.pointLights.value=F.state.point,Se.pointLightShadows.value=F.state.pointShadow,Se.hemisphereLights.value=F.state.hemi,Se.directionalShadowMap.value=F.state.directionalShadowMap,Se.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Se.spotShadowMap.value=F.state.spotShadowMap,Se.spotLightMatrix.value=F.state.spotLightMatrix,Se.spotLightMap.value=F.state.spotLightMap,Se.pointShadowMap.value=F.state.pointShadowMap,Se.pointShadowMatrix.value=F.state.pointShadowMatrix),H.currentProgram=Re,H.uniformsList=null,Re}function Lo(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=mr.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Do(M,U){const k=ve.get(M);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function uh(M,U,k,H,F){U.isScene!==!0&&(U=ft),T.resetTextureUnits();const J=U.fog,ie=H.isMeshStandardMaterial?U.environment:null,he=D===null?v.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Ut,me=(H.isMeshStandardMaterial?B:y).get(H.envMap||ie),Ie=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Re=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Se=!!k.morphAttributes.position,qe=!!k.morphAttributes.normal,Je=!!k.morphAttributes.color;let gt=zn;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(gt=v.toneMapping);const dt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,je=dt!==void 0?dt.length:0,be=ve.get(H),bt=f.state.lights;if(te===!0&&(ge===!0||M!==S)){const It=M===S&&H.id===E;Q.setState(H,M,It)}let Qe=!1;H.version===be.__version?(be.needsLights&&be.lightsStateVersion!==bt.state.version||be.outputColorSpace!==he||F.isBatchedMesh&&be.batching===!1||!F.isBatchedMesh&&be.batching===!0||F.isBatchedMesh&&be.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&be.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&be.instancing===!1||!F.isInstancedMesh&&be.instancing===!0||F.isSkinnedMesh&&be.skinning===!1||!F.isSkinnedMesh&&be.skinning===!0||F.isInstancedMesh&&be.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&be.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&be.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&be.instancingMorph===!1&&F.morphTexture!==null||be.envMap!==me||H.fog===!0&&be.fog!==J||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==Q.numPlanes||be.numIntersection!==Q.numIntersection)||be.vertexAlphas!==Ie||be.vertexTangents!==Re||be.morphTargets!==Se||be.morphNormals!==qe||be.morphColors!==Je||be.toneMapping!==gt||be.morphTargetsCount!==je)&&(Qe=!0):(Qe=!0,be.__version=H.version);let Jt=be.currentProgram;Qe===!0&&(Jt=As(H,U,F));let ci=!1,kt=!1,qi=!1;const lt=Jt.getUniforms(),Wt=be.uniforms;if(ye.useProgram(Jt.program)&&(ci=!0,kt=!0,qi=!0),H.id!==E&&(E=H.id,kt=!0),ci||S!==M){ye.buffers.depth.getReversed()?(re.copy(M.projectionMatrix),Yd(re),qd(re),lt.setValue(I,"projectionMatrix",re)):lt.setValue(I,"projectionMatrix",M.projectionMatrix),lt.setValue(I,"viewMatrix",M.matrixWorldInverse);const Ft=lt.map.cameraPosition;Ft!==void 0&&Ft.setValue(I,Ke.setFromMatrixPosition(M.matrixWorld)),Ve.logarithmicDepthBuffer&&lt.setValue(I,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&lt.setValue(I,"isOrthographic",M.isOrthographicCamera===!0),S!==M&&(S=M,kt=!0,qi=!0)}if(F.isSkinnedMesh){lt.setOptional(I,F,"bindMatrix"),lt.setOptional(I,F,"bindMatrixInverse");const It=F.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),lt.setValue(I,"boneTexture",It.boneTexture,T))}F.isBatchedMesh&&(lt.setOptional(I,F,"batchingTexture"),lt.setValue(I,"batchingTexture",F._matricesTexture,T),lt.setOptional(I,F,"batchingIdTexture"),lt.setValue(I,"batchingIdTexture",F._indirectTexture,T),lt.setOptional(I,F,"batchingColorTexture"),F._colorsTexture!==null&&lt.setValue(I,"batchingColorTexture",F._colorsTexture,T));const Xt=k.morphAttributes;if((Xt.position!==void 0||Xt.normal!==void 0||Xt.color!==void 0)&&Ce.update(F,k,Jt),(kt||be.receiveShadow!==F.receiveShadow)&&(be.receiveShadow=F.receiveShadow,lt.setValue(I,"receiveShadow",F.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Wt.envMap.value=me,Wt.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(Wt.envMapIntensity.value=U.environmentIntensity),kt&&(lt.setValue(I,"toneMappingExposure",v.toneMappingExposure),be.needsLights&&fh(Wt,qi),J&&H.fog===!0&&ae.refreshFogUniforms(Wt,J),ae.refreshMaterialUniforms(Wt,H,G,K,f.state.transmissionRenderTarget[M.id]),mr.upload(I,Lo(be),Wt,T)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(mr.upload(I,Lo(be),Wt,T),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&lt.setValue(I,"center",F.center),lt.setValue(I,"modelViewMatrix",F.modelViewMatrix),lt.setValue(I,"normalMatrix",F.normalMatrix),lt.setValue(I,"modelMatrix",F.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const It=H.uniformsGroups;for(let Ft=0,Rr=It.length;Ft<Rr;Ft++){const Xn=It[Ft];L.update(Xn,Jt),L.bind(Xn,Jt)}}return Jt}function fh(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function ph(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(M,U,k){const H=ve.get(M);H.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ve.get(M.texture).__webglTexture=U,ve.get(M.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){const k=ve.get(M);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0};const mh=I.createFramebuffer();this.setRenderTarget=function(M,U=0,k=0){D=M,A=U,R=k;let H=!0,F=null,J=!1,ie=!1;if(M){const me=ve.get(M);if(me.__useDefaultFramebuffer!==void 0)ye.bindFramebuffer(I.FRAMEBUFFER,null),H=!1;else if(me.__webglFramebuffer===void 0)T.setupRenderTarget(M);else if(me.__hasExternalTextures)T.rebindTextures(M,ve.get(M.texture).__webglTexture,ve.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Se=M.depthTexture;if(me.__boundDepthTexture!==Se){if(Se!==null&&ve.has(Se)&&(M.width!==Se.image.width||M.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");T.setupDepthRenderbuffer(M)}}const Ie=M.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(ie=!0);const Re=ve.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Re[U])?F=Re[U][k]:F=Re[U],J=!0):M.samples>0&&T.useMultisampledRTT(M)===!1?F=ve.get(M).__webglMultisampledFramebuffer:Array.isArray(Re)?F=Re[k]:F=Re,w.copy(M.viewport),N.copy(M.scissor),O=M.scissorTest}else w.copy(xe).multiplyScalar(G).floor(),N.copy(ke).multiplyScalar(G).floor(),O=st;if(k!==0&&(F=mh),ye.bindFramebuffer(I.FRAMEBUFFER,F)&&H&&ye.drawBuffers(M,F),ye.viewport(w),ye.scissor(N),ye.setScissorTest(O),J){const me=ve.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+U,me.__webglTexture,k)}else if(ie){const me=ve.get(M.texture),Ie=U;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,me.__webglTexture,k,Ie)}else if(M!==null&&k!==0){const me=ve.get(M.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,me.__webglTexture,k)}E=-1},this.readRenderTargetPixels=function(M,U,k,H,F,J,ie){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let he=ve.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ie!==void 0&&(he=he[ie]),he){ye.bindFramebuffer(I.FRAMEBUFFER,he);try{const me=M.texture,Ie=me.format,Re=me.type;if(!Ve.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-H&&k>=0&&k<=M.height-F&&I.readPixels(U,k,H,F,Be.convert(Ie),Be.convert(Re),J)}finally{const me=D!==null?ve.get(D).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,me)}}},this.readRenderTargetPixelsAsync=async function(M,U,k,H,F,J,ie){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let he=ve.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ie!==void 0&&(he=he[ie]),he)if(U>=0&&U<=M.width-H&&k>=0&&k<=M.height-F){ye.bindFramebuffer(I.FRAMEBUFFER,he);const me=M.texture,Ie=me.format,Re=me.type;if(!Ve.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Se=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Se),I.bufferData(I.PIXEL_PACK_BUFFER,J.byteLength,I.STREAM_READ),I.readPixels(U,k,H,F,Be.convert(Ie),Be.convert(Re),0);const qe=D!==null?ve.get(D).__webglFramebuffer:null;ye.bindFramebuffer(I.FRAMEBUFFER,qe);const Je=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await $d(I,Je,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Se),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,J),I.deleteBuffer(Se),I.deleteSync(Je),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,k=0){const H=Math.pow(2,-k),F=Math.floor(M.image.width*H),J=Math.floor(M.image.height*H),ie=U!==null?U.x:0,he=U!==null?U.y:0;T.setTexture2D(M,0),I.copyTexSubImage2D(I.TEXTURE_2D,k,0,0,ie,he,F,J),ye.unbindTexture()};const gh=I.createFramebuffer(),_h=I.createFramebuffer();this.copyTextureToTexture=function(M,U,k=null,H=null,F=0,J=null){J===null&&(F!==0?(pr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=F,F=0):J=0);let ie,he,me,Ie,Re,Se,qe,Je,gt;const dt=M.isCompressedTexture?M.mipmaps[J]:M.image;if(k!==null)ie=k.max.x-k.min.x,he=k.max.y-k.min.y,me=k.isBox3?k.max.z-k.min.z:1,Ie=k.min.x,Re=k.min.y,Se=k.isBox3?k.min.z:0;else{const Xt=Math.pow(2,-F);ie=Math.floor(dt.width*Xt),he=Math.floor(dt.height*Xt),M.isDataArrayTexture?me=dt.depth:M.isData3DTexture?me=Math.floor(dt.depth*Xt):me=1,Ie=0,Re=0,Se=0}H!==null?(qe=H.x,Je=H.y,gt=H.z):(qe=0,Je=0,gt=0);const je=Be.convert(U.format),be=Be.convert(U.type);let bt;U.isData3DTexture?(T.setTexture3D(U,0),bt=I.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(T.setTexture2DArray(U,0),bt=I.TEXTURE_2D_ARRAY):(T.setTexture2D(U,0),bt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,U.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,U.unpackAlignment);const Qe=I.getParameter(I.UNPACK_ROW_LENGTH),Jt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),ci=I.getParameter(I.UNPACK_SKIP_PIXELS),kt=I.getParameter(I.UNPACK_SKIP_ROWS),qi=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,dt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,dt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ie),I.pixelStorei(I.UNPACK_SKIP_ROWS,Re),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Se);const lt=M.isDataArrayTexture||M.isData3DTexture,Wt=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){const Xt=ve.get(M),It=ve.get(U),Ft=ve.get(Xt.__renderTarget),Rr=ve.get(It.__renderTarget);ye.bindFramebuffer(I.READ_FRAMEBUFFER,Ft.__webglFramebuffer),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,Rr.__webglFramebuffer);for(let Xn=0;Xn<me;Xn++)lt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ve.get(M).__webglTexture,F,Se+Xn),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ve.get(U).__webglTexture,J,gt+Xn)),I.blitFramebuffer(Ie,Re,ie,he,qe,Je,ie,he,I.DEPTH_BUFFER_BIT,I.NEAREST);ye.bindFramebuffer(I.READ_FRAMEBUFFER,null),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(F!==0||M.isRenderTargetTexture||ve.has(M)){const Xt=ve.get(M),It=ve.get(U);ye.bindFramebuffer(I.READ_FRAMEBUFFER,gh),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,_h);for(let Ft=0;Ft<me;Ft++)lt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Xt.__webglTexture,F,Se+Ft):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Xt.__webglTexture,F),Wt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,It.__webglTexture,J,gt+Ft):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,It.__webglTexture,J),F!==0?I.blitFramebuffer(Ie,Re,ie,he,qe,Je,ie,he,I.COLOR_BUFFER_BIT,I.NEAREST):Wt?I.copyTexSubImage3D(bt,J,qe,Je,gt+Ft,Ie,Re,ie,he):I.copyTexSubImage2D(bt,J,qe,Je,Ie,Re,ie,he);ye.bindFramebuffer(I.READ_FRAMEBUFFER,null),ye.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Wt?M.isDataTexture||M.isData3DTexture?I.texSubImage3D(bt,J,qe,Je,gt,ie,he,me,je,be,dt.data):U.isCompressedArrayTexture?I.compressedTexSubImage3D(bt,J,qe,Je,gt,ie,he,me,je,dt.data):I.texSubImage3D(bt,J,qe,Je,gt,ie,he,me,je,be,dt):M.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,J,qe,Je,ie,he,je,be,dt.data):M.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,J,qe,Je,dt.width,dt.height,je,dt.data):I.texSubImage2D(I.TEXTURE_2D,J,qe,Je,ie,he,je,be,dt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Qe),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Jt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ci),I.pixelStorei(I.UNPACK_SKIP_ROWS,kt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,qi),J===0&&U.generateMipmaps&&I.generateMipmap(bt),ye.unbindTexture()},this.copyTextureToTexture3D=function(M,U,k=null,H=null,F=0){return pr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,U,k,H,F)},this.initRenderTarget=function(M){ve.get(M).__webglFramebuffer===void 0&&T.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?T.setTextureCube(M,0):M.isData3DTexture?T.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?T.setTexture2DArray(M,0):T.setTexture2D(M,0),ye.unbindTexture()},this.resetState=function(){A=0,R=0,D=null,ye.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}function oc(r,e){if(e===vd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===eo||e===Dc){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===eo)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class X0 extends $i{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new K0(t)}),this.register(function(t){return new Z0(t)}),this.register(function(t){return new a_(t)}),this.register(function(t){return new o_(t)}),this.register(function(t){return new l_(t)}),this.register(function(t){return new Q0(t)}),this.register(function(t){return new e_(t)}),this.register(function(t){return new t_(t)}),this.register(function(t){return new n_(t)}),this.register(function(t){return new j0(t)}),this.register(function(t){return new i_(t)}),this.register(function(t){return new J0(t)}),this.register(function(t){return new r_(t)}),this.register(function(t){return new s_(t)}),this.register(function(t){return new Y0(t)}),this.register(function(t){return new c_(t)}),this.register(function(t){return new h_(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ps.extractUrlBase(e);a=ps.resolveURL(c,this.path)}else a=ps.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new nh(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===hh){try{a[ze.KHR_BINARY_GLTF]=new d_(e)}catch(d){i&&i(d);return}s=JSON.parse(a[ze.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new E_(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const d=s.extensionsUsed[h],u=s.extensionsRequired||[];switch(d){case ze.KHR_MATERIALS_UNLIT:a[d]=new q0;break;case ze.KHR_DRACO_MESH_COMPRESSION:a[d]=new u_(s,this.dracoLoader);break;case ze.KHR_TEXTURE_TRANSFORM:a[d]=new f_;break;case ze.KHR_MESH_QUANTIZATION:a[d]=new p_;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function $0(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Y0{constructor(e){this.parser=e,this.name=ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new Me(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ut);const d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Sr(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new ju(h),c.distance=d;break;case"spot":c=new Yu(h),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Sn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class q0{constructor(){this.name=ze.KHR_MATERIALS_UNLIT}getMaterialType(){return pt}extendParams(e,t,n){const i=[];e.color=new Me(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Ut),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,ut))}return Promise.all(i)}}class j0{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class K0{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new De(o,o)}return Promise.all(s)}}class Z0{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class J0{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}}class Q0{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new Me(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Ut)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,ut)),a.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}}class e_{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}}class t_{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new Me().setRGB(o[0],o[1],o[2],Ut),Promise.all(s)}}class n_{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class i_{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new Me().setRGB(o[0],o[1],o[2],Ut),a.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,ut)),Promise.all(s)}}class s_{constructor(e){this.parser=e,this.name=ze.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}}class r_{constructor(e){this.parser=e,this.name=ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}}class a_{constructor(e){this.parser=e,this.name=ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class o_{constructor(e){this.parser=e,this.name=ze.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,a.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class l_{constructor(e){this.parser=e,this.name=ze.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,a.source,l);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class c_{constructor(e){this.name=ze.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,d=i.byteStride,u=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,u,i.mode,i.filter).then(function(p){return p.buffer}):a.ready.then(function(){const p=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(p),h,d,u,i.mode,i.filter),p})})}else return null}}class h_{constructor(e){this.name=ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==Yt.TRIANGLES&&c.mode!==Yt.TRIANGLE_STRIP&&c.mode!==Yt.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),d=h.isGroup?h.children:[h],u=c[0].count,p=[];for(const g of d){const _=new Ne,m=new P,f=new Vn,b=new P(1,1,1),x=new Eu(g.geometry,g.material,u);for(let v=0;v<u;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&f.fromBufferAttribute(l.ROTATION,v),l.SCALE&&b.fromBufferAttribute(l.SCALE,v),x.setMatrixAt(v,_.compose(m,f,b));for(const v in l)if(v==="_COLOR_0"){const C=l[v];x.instanceColor=new no(C.array,C.itemSize,C.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);ot.prototype.copy.call(x,g),this.parser.assignFinalMaterial(x),p.push(x)}return h.isGroup?(h.clear(),h.add(...p),h):p[0]}))}}const hh="glTF",os=12,lc={JSON:1313821514,BIN:5130562};class d_{constructor(e){this.name=ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,os),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==hh)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-os,s=new DataView(e,os);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===lc.JSON){const c=new Uint8Array(e,os+a,o);this.content=n.decode(c)}else if(l===lc.BIN){const c=os+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class u_{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const d=ro[h]||h.toLowerCase();o[d]=a[h]}for(const h in e.attributes){const d=ro[h]||h.toLowerCase();if(a[h]!==void 0){const u=n.accessors[e.attributes[h]],p=Di[u.componentType];c[d]=p.name,l[d]=u.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(d,u){i.decodeDracoFile(h,function(p){for(const g in p.attributes){const _=p.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}d(p)},o,c,Ut,u)})})}}class f_{constructor(){this.name=ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class p_{constructor(){this.name=ze.KHR_MESH_QUANTIZATION}}class dh extends Ts{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,d=(n-t)/h,u=d*d,p=u*d,g=e*c,_=g-c,m=-2*p+3*u,f=p-u,b=1-m,x=f-u+d;for(let v=0;v!==o;v++){const C=a[_+v+o],A=a[_+v+l]*h,R=a[g+v+o],D=a[g+v]*h;s[v]=b*C+x*A+m*R+f*D}return s}}const m_=new Vn;class g_ extends dh{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return m_.fromArray(s).normalize().toArray(s),s}}const Yt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Di={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},cc={9728:Dt,9729:Gt,9984:bc,9985:lr,9986:ls,9987:bn},hc={33071:Bn,33648:gr,10497:Bi},ua={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},ro={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Un={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},__={CUBICSPLINE:void 0,LINEAR:ys,STEP:xs},fa={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function v_(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Ee({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:wn})),r.DefaultMaterial}function Jn(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Sn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function x_(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(i=!0),d.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const d=e[c];if(n){const u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):r.attributes.position;a.push(u)}if(i){const u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):r.attributes.normal;o.push(u)}if(s){const u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):r.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],d=c[1],u=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=d),s&&(r.morphAttributes.color=u),r.morphTargetsRelative=!0,r})}function y_(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function M_(r){let e;const t=r.extensions&&r.extensions[ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+pa(t.attributes):e=r.indices+":"+pa(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+pa(r.targets[n]);return e}function pa(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function ao(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function S_(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const b_=new Ne;class E_{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new $0,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new Xu(this.options.manager):this.textureLoader=new Zu(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new nh(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Jn(s,o,i),Sn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ze.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(ps.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=ua[i.type],o=Di[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Nt(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=ua[i.type],c=Di[i.componentType],h=c.BYTES_PER_ELEMENT,d=h*l,u=i.byteOffset||0,p=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,m;if(p&&p!==d){const f=Math.floor(u/p),b="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+f+":"+i.count;let x=t.cache.get(b);x||(_=new c(o,f*p,i.count*p/h),x=new $c(_,p/h),t.cache.add(b,x)),m=new Ss(x,l,u%p/h,g)}else o===null?_=new c(i.count*l):_=new c(o,u,i.count*l),m=new Nt(_,l,g);if(i.sparse!==void 0){const f=ua.SCALAR,b=Di[i.sparse.indices.componentType],x=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,C=new b(a[1],x,i.sparse.count*f),A=new c(a[2],v,i.sparse.count*l);o!==null&&(m=new Nt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,D=C.length;R<D;R++){const E=C[R];if(m.setX(E,A[R*l]),l>=2&&m.setY(E,A[R*l+1]),l>=3&&m.setZ(E,A[R*l+2]),l>=4&&m.setW(E,A[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(s.samplers||{})[a.sampler]||{};return h.magFilter=cc[u.magFilter]||Gt,h.minFilter=cc[u.minFilter]||bn,h.wrapS=hc[u.wrapS]||Bi,h.wrapT=hc[u.wrapT]||Bi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Dt&&h.minFilter!==Gt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;const u=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(u),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(d){return new Promise(function(u,p){let g=u;t.isImageBitmapLoader===!0&&(g=function(_){const m=new vt(_);m.needsUpdate=!0,u(m)}),t.load(ps.resolveURL(d,s.path),g,void 0,p)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),Sn(d,a),d.userData.mimeType=a.mimeType||S_(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Jc,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Zc,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ee}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[ze.KHR_MATERIALS_UNLIT]){const d=i[ze.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,s,t))}else{const d=s.pbrMetallicRoughness||{};if(o.color=new Me(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],Ut),o.opacity=u[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,ut)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=cn);const h=s.alphaMode||fa.OPAQUE;if(h===fa.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===fa.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==pt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new De(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;o.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&a!==pt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==pt){const d=s.emissiveFactor;o.emissive=new Me().setRGB(d[0],d[1],d[2],Ut)}return s.emissiveTexture!==void 0&&a!==pt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,ut)),Promise.all(c).then(function(){const d=new a(o);return s.name&&(d.name=s.name),Sn(d,s),t.associations.set(d,{materials:e}),s.extensions&&Jn(i,d,s),d})}createUniqueName(e){const t=nt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return dc(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=M_(c),d=i[h];if(d)a.push(d.promise);else{let u;c.extensions&&c.extensions[ze.KHR_DRACO_MESH_COMPRESSION]?u=s(c):u=dc(new Ot,c,t),i[h]={primitive:c,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?v_(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],d=[];for(let p=0,g=h.length;p<g;p++){const _=h[p],m=a[p];let f;const b=c[p];if(m.mode===Yt.TRIANGLES||m.mode===Yt.TRIANGLE_STRIP||m.mode===Yt.TRIANGLE_FAN||m.mode===void 0)f=s.isSkinnedMesh===!0?new Mu(_,b):new ee(_,b),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),m.mode===Yt.TRIANGLE_STRIP?f.geometry=oc(f.geometry,Dc):m.mode===Yt.TRIANGLE_FAN&&(f.geometry=oc(f.geometry,eo));else if(m.mode===Yt.LINES)f=new Au(_,b);else if(m.mode===Yt.LINE_STRIP)f=new Mo(_,b);else if(m.mode===Yt.LINE_LOOP)f=new Ru(_,b);else if(m.mode===Yt.POINTS)f=new Cu(_,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&y_(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),Sn(f,s),m.extensions&&Jn(i,f,m),t.assignFinalMaterial(f),d.push(f)}for(let p=0,g=d.length;p<g;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return s.extensions&&Jn(i,d[0],s),d[0];const u=new Le;s.extensions&&Jn(i,u,s),t.associations.set(u,{meshes:e});for(let p=0,g=d.length;p<g;p++)u.add(d[p]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ct(Qn.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new bo(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Sn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const d=a[c];if(d){o.push(d);const u=new Ne;s!==null&&u.fromArray(s.array,c*16),l.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new xo(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let d=0,u=i.channels.length;d<u;d++){const p=i.channels[d],g=i.samplers[p.sampler],_=p.target,m=_.node,f=i.parameters!==void 0?i.parameters[g.input]:g.input,b=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",f)),l.push(this.getDependency("accessor",b)),c.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(d){const u=d[0],p=d[1],g=d[2],_=d[3],m=d[4],f=[];for(let b=0,x=u.length;b<x;b++){const v=u[b],C=p[b],A=g[b],R=_[b],D=m[b];if(v===void 0)continue;v.updateMatrix&&v.updateMatrix();const E=n._createAnimationTracks(v,C,A,R,D);if(E)for(let S=0;S<E.length;S++)f.push(E[S])}return new Ou(s,void 0,f)})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],d=c[1],u=c[2];u!==null&&h.traverse(function(p){p.isSkinnedMesh&&p.bind(u,b_)});for(let p=0,g=d.length;p<g;p++)h.add(d[p]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new jc:c.length>1?h=new Le:c.length===1?h=c[0]:h=new ot,h!==c[0])for(let d=0,u=c.length;d<u;d++)h.add(c[d]);if(s.name&&(h.userData.name=s.name,h.name=a),Sn(h,s),s.extensions&&Jn(n,h,s),s.matrix!==void 0){const d=new Ne;d.fromArray(s.matrix),h.applyMatrix4(d)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new Le;n.name&&(s.name=i.createUniqueName(n.name)),Sn(s,n),n.extensions&&Jn(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,d=l.length;h<d;h++)s.add(l[h]);const c=h=>{const d=new Map;for(const[u,p]of i.associations)(u instanceof an||u instanceof vt)&&d.set(u,p);return h.traverse(u=>{const p=i.associations.get(u);p!=null&&d.set(u,p)}),d};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];Un[s.path]===Un.weights?e.traverse(function(u){u.morphTargetInfluences&&l.push(u.name?u.name:u.uuid)}):l.push(o);let c;switch(Un[s.path]){case Un.weights:c=Hi;break;case Un.rotation:c=zi;break;case Un.translation:case Un.scale:c=Gi;break;default:switch(n.itemSize){case 1:c=Hi;break;case 2:case 3:default:c=Gi;break}break}const h=i.interpolation!==void 0?__[i.interpolation]:ys,d=this._getArrayFromAccessor(n);for(let u=0,p=l.length;u<p;u++){const g=new c(l[u]+"."+Un[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ao(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof zi?g_:dh;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function T_(r,e,t){const n=e.attributes,i=new Rn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){const h=ao(Di[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new P,l=new P;for(let c=0,h=s.length;c<h;c++){const d=s[c];if(d.POSITION!==void 0){const u=t.json.accessors[d.POSITION],p=u.min,g=u.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),u.normalized){const _=ao(Di[u.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new dn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function dc(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=ro[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return Xe.workingColorSpace!==Ut&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),Sn(r,e),T_(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?x_(r,e.targets,t):r})}const uc=[{id:"ad_sponsor_slot",headline:"এখানে আপনার পেজের বিজ্ঞাপন দিন!",subline:"মিরপুর-গুলিস্তান রুটে দৈনিক লাখো ভিউ • স্পনসর হোন",bgHex:"#ffbe0b",accentHex:"#ef476f",textHex:"#1b1f2a"},{id:"ad_mama_cha",headline:"মামা স্পেশাল মালাই চা ☕",subline:"বাস থামায়ে ১ কাপ টানেন — ফার্মগেট ফুটওভারের নিচে",bgHex:"#06d6a0",accentHex:"#ffffff",textHex:"#102520"},{id:"ad_dholaikhal",headline:"ধোলাইখাল সুপার মিস্ত্রি 🔧",subline:"ব্রেক ফেল? ইন্ডিকেটর নাই? ২ মিনিটে মুড়ির টিন রকেট!",bgHex:"#1b1f2a",accentHex:"#ffbe0b",textHex:"#fffdf7"},{id:"ad_deshi_tesla",headline:"নয়া দেশি টেসলা শোরুম ⚡",subline:"কোনো হর্ন বা লুকিং গ্লাস ছাড়াই উল্টা পথে চালান!",bgHex:"#ef476f",accentHex:"#ffbe0b",textHex:"#ffffff"}],w_={low:.25,medium:.5,high:1,ultra:2};function rr(r,e,t,n,i){const s=Math.max(64,Math.round(r*t)),a=Math.max(32,Math.round(e*t)),o=document.createElement("canvas");o.width=s,o.height=a;const l=o.getContext("2d");l.scale(s/r,a/e),i(l,r,e);const c=new cs(o);return c.colorSpace=ut,c.anisotropy=Math.max(1,n),c}function Ii(r){const e=r.getObjectByName("rajdhani-livery");e&&(e.traverse(t=>{const n=t;if(n.isMesh){n.geometry.dispose();const i=n.material;i.map?.dispose(),i.dispose()}}),r.remove(e))}function A_(r,e,t){Ii(r);const n=w_[e]??1,i=e==="ultra"?t:e==="high"?Math.min(8,t):2,s=new Le;s.name="rajdhani-livery";const a=(f,b,x,v=.35)=>new ee(new Rt(f,b),new Ee({map:x,roughness:v,metalness:.08})),o=rr(1024,192,n,i,(f,b,x)=>{f.fillStyle="#d90429",f.fillRect(0,0,b,x*.72),f.fillStyle="#1d4ed8",f.fillRect(0,x*.72,b,x*.28),f.fillStyle="#ffffff",f.textAlign="center",f.font='bold 84px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("রাজধানী সুপার সার্ভিস লিঃ",b/2,102,b-40),f.fillStyle="#ffbe0b",f.font='bold 34px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("মিরপুর ১৪ • গাবতলী • সাভার • ঢাকা • কক্সবাজার",b/2,174,b-40)}),l=a(2.02,.36,o);l.position.set(0,2.22,-2.895),l.rotation.y=Math.PI,l.rotation.x=.14,s.add(l);const c=rr(384,160,n,i,(f,b,x)=>{f.fillStyle="#10b981",f.fillRect(0,0,b,x),f.strokeStyle="#064e3b",f.lineWidth=10,f.strokeRect(5,5,b-10,x-10),f.fillStyle="#062c22",f.textAlign="center",f.font='bold 46px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("ঢাকা মেট্রো-ব",b/2,68,b-24),f.font='bold 54px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("১৫-৪০২৫",b/2,132,b-24)}),h=a(.54,.22,c,.3);h.position.set(0,.5,-2.975),h.rotation.y=Math.PI;const d=a(.54,.22,c.clone(),.3);d.material.map.needsUpdate=!0,d.position.set(0,.5,2.965),s.add(h,d);const u=rr(1024,256,n,i,(f,b,x)=>{f.fillStyle="#b81d38",f.fillRect(0,0,b,x);const v=(C,A,R)=>{f.strokeStyle=C,f.lineWidth=R,f.beginPath(),f.moveTo(0,x-24-A),f.lineTo(b*.28,60-A),f.lineTo(b*.52,130-A),f.lineTo(b*.78,46-A),f.lineTo(b,x-30-A),f.stroke()};v("#1d4ed8",18,22),v("#ffbe0b",0,16),v("#06d6a0",-16,10),f.fillStyle="#ffbe0b",f.beginPath(),f.arc(b*.48,x*.54,44,0,Math.PI*2),f.fill(),f.fillStyle="#d90429",f.beginPath(),f.arc(b*.48,x*.54,30,0,Math.PI*2),f.fill(),f.font='900 58px "Segoe UI", sans-serif',f.textAlign="left",f.fillStyle="#22c55e",f.fillText("V",b*.16,x*.78),f.fillStyle="#ffbe0b",f.fillText("I",b*.21,x*.78),f.fillStyle="#38bdf8",f.fillText("P",b*.24,x*.78),f.fillStyle="#ffffff",f.textAlign="right",f.font='bold 42px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("রাজধানী সুপার সার্ভিস",b-34,58,420)}),p=a(5.38,.88,u);p.position.set(-1.164,.94,.1),p.rotation.y=-Math.PI/2;const g=a(5.38,.88,u.clone());g.material.map.needsUpdate=!0,g.position.set(1.164,.94,.1),g.rotation.y=Math.PI/2,s.add(p,g);const _=rr(1024,384,n,i,(f,b,x)=>{f.fillStyle="#b81d38",f.fillRect(0,0,b,x),f.fillStyle="#ffbe0b",f.beginPath(),f.moveTo(0,x*.65),f.lineTo(b*.5,x*.25),f.lineTo(b,x*.65),f.lineTo(b,x*.8),f.lineTo(b*.5,x*.4),f.lineTo(0,x*.8),f.closePath(),f.fill(),f.fillStyle="#1d4ed8",f.fillRect(0,0,b,92),f.fillStyle="#ffffff",f.textAlign="center",f.font='bold 58px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("রাজধানী সুপার সার্ভিস লিঃ",b/2,66,b-40),f.fillStyle="#fffdf7",f.font='bold 42px "Hind Siliguri", "Segoe UI", sans-serif',f.fillText("দূরত্ব বজায় রাখুন • ব্রেক নাই!",b/2,x-38,b-60)}),m=a(2.14,.8,_);m.position.set(0,1.02,2.895),s.add(m),r.add(s)}const R_={jamuna:{main:"#e9c46a",accent:"#f4a261",water:"#0077b6"},padma:{main:"#1d6fa5",accent:"#48cae4",water:"#0077b6"},meghna:{main:"#2a9d8f",accent:"#e9ecef",water:"#0096c7"},gumti:{main:"#c1121f",accent:"#ffb703",water:"#0077b6"},karnaphuli:{main:"#f8f9fa",accent:"#ffbe0b",water:"#023e8a"}};class C_{constructor(e){this.container=e,this.renderer=new ch({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=yc,this.renderer.toneMapping=lo,this.renderer.toneMappingExposure=1.08,this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.touchAction="none",e.appendChild(this.renderer.domElement),this.scene=new Xc,this.scene.background=this.cMorning.clone(),this.scene.fog=new xr("#ffe5b4",48,165),this.camera=new Ct(56,1,.2,240),this.hemiLight=new ih("#fff4df","#5a4e43",1.28),this.scene.add(this.hemiLight),this.sunLight=new Sr("#fff2d6",1.85),this.sunLight.position.set(16,28,18),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(1024,1024),this.sunLight.shadow.camera.near=2,this.sunLight.shadow.camera.far=90,this.sunLight.shadow.camera.left=-22,this.sunLight.shadow.camera.right=22,this.sunLight.shadow.camera.top=25,this.sunLight.shadow.camera.bottom=-25,this.scene.add(this.sunLight),this.underTerrainGroup.add(this.northBengalGroup,this.dhakaCityGroup,this.hillsGroup,this.marineDriveGroup),this.scene.add(this.underTerrainGroup,this.roadGroup,this.bridgeGroup,this.flyoverGroup,this.railTrackGroup,this.trainGroup,this.trafficGroup,this.remoteRacersGroup,this.finishArchGroup,this.particlesGroup,this.playerGroup,this.rainGroup),this.buildRoadDeck(),this.buildFinishArch(),this.buildNorthBengalBiome(),this.buildDhakaCityBiome(),this.buildHillsBiome(),this.buildMarineDriveBiome(),this.buildBridges(),this.buildFlyover(),this.buildRailwayAndTrain(),this.buildRainPool(),this.bridgeGroup.visible=!1,this.flyoverGroup.visible=!1,this.trainGroup.visible=!1,this.rainGroup.visible=!1,this.resize()}renderer;scene;camera;hemiLight;sunLight;loader=new X0;templates=new Map;entityMeshes=new Map;particles=[];particleGeo=new Pe(.24,.24,.24);playerGroup=new Le;playerBusBody=null;roofRidersGroup=new Le;nitroFlames=new Le;headlightBeams=new Le;roadGroup=new Le;underTerrainGroup=new Le;northBengalGroup=new Le;dhakaCityGroup=new Le;hillsGroup=new Le;marineDriveGroup=new Le;bridgeGroup=new Le;flyoverGroup=new Le;railTrackGroup=new Le;trainGroup=new Le;rainGroup=new Le;trafficGroup=new Le;particlesGroup=new Le;remoteRacersGroup=new Le;finishArchGroup=new Le;remoteRacerNodes=new Map;laneDashes=[];railSleepers=[];metroPillars=[];billboards=[];trees=[];buildings=[];paddyPatches=[];hillMeshes=[];coconutPalms=[];bridgeSpans=[];flyoverPosts=[];rainDrops=[];championBillboardMat=null;bridgeMainMat;bridgeAccentMat;bridgeWaterMat;cableTowerParts=[];skyScratch=new Me;cMorning=new Me("#ffe5b4");cNoon=new Me("#bde0fe");cDhaka=new Me("#ffd9a0");cStorm=new Me("#64748b");cSunset=new Me("#f4845f");cNight=new Me("#132238");cameraShake=0;currentSkinId="classic_mirpur";currentPreset="high";renderedRiderCount=0;cameraMode="chase";activeRainLimit=90;applyGraphicsPreset(e){this.currentPreset=e;const t=window.devicePixelRatio||1;let n=1024;e==="low"?(this.renderer.setPixelRatio(.75),this.renderer.shadowMap.enabled=!1,this.activeRainLimit=30):e==="medium"?(this.renderer.setPixelRatio(1),this.renderer.shadowMap.enabled=!0,n=512,this.activeRainLimit=60):e==="high"?(this.renderer.setPixelRatio(Math.min(t,1.5)),this.renderer.shadowMap.enabled=!0,n=1024,this.activeRainLimit=100):(this.renderer.setPixelRatio(Math.min(t,2)),this.renderer.shadowMap.enabled=!0,n=2048,this.activeRainLimit=140),this.sunLight.shadow.mapSize.width!==n&&(this.sunLight.shadow.mapSize.set(n,n),this.sunLight.shadow.map?.dispose(),this.sunLight.shadow.map=null),this.templates.has("murir_tin_bus")&&this.rebuildPlayerBus(this.currentSkinId),this.resize()}setCameraMode(e){this.cameraMode=e}async preloadModels(){const e=["murir_tin_bus","rajdhani_bus","plastic_sedan","deshi_tesla_auto","cng_rickshaw","cargo_truck","sergeant_npc","passenger_npc"];await Promise.all(e.map(async t=>{try{const n=await this.loader.loadAsync(`./models/${t}.glb`);n.scene.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.templates.set(t,n.scene)}catch{this.templates.set(t,this.createFallbackBox(t))}})),this.rebuildPlayerBus(this.currentSkinId)}createFallbackBox(e){const t=new Le,n=e.includes("bus")?"#06b888":e.includes("tesla")?"#ffbe0b":"#ffffff",i=new ee(new Pe(1.6,1.4,3.2),new Ee({color:n}));return i.position.y=.8,t.add(i),t}setBusSkin(e){this.currentSkinId=e,this.templates.has("murir_tin_bus")&&this.rebuildPlayerBus(e)}buildBusPreviewClone(e){const t=At.find(s=>s.id===e)??At[0],i=(this.templates.get(t.modelName)??this.templates.get("murir_tin_bus")??this.createFallbackBox(t.modelName)).clone(!0);if(t.modelName==="rajdhani_bus")i.traverse(s=>{if(s.isMesh){const a=s,o=a.material.clone();this.currentPreset==="ultra"&&(o.roughness=Math.max(.12,o.roughness*.85)),a.material=o}}),A_(i,this.currentPreset,this.renderer.capabilities.getMaxAnisotropy());else{let s=0;i.traverse(a=>{if(a.isMesh){const o=a,l=o.material.clone();s===0&&l.color.set(t.bodyHex),s===1&&l.color.set(t.stripeHex),o.material=l,s++}})}return i}rebuildPlayerBus(e){this.playerBusBody&&(Ii(this.playerBusBody),this.playerGroup.remove(this.playerBusBody));const t=this.buildBusPreviewClone(e);if(this.playerBusBody=t,this.playerGroup.add(t),this.nitroFlames.children.length===0&&(this.nitroFlames=this.createNitroFlamesGroup(),this.playerGroup.add(this.nitroFlames)),this.headlightBeams.children.length===0){const n=new pt({color:"#fff3b0",transparent:!0,opacity:.24,depthWrite:!1});for(const i of[-.68,.68]){const s=new ee(new ii(1.75,16,12,1,!0),n);s.rotation.x=-Math.PI/2,s.position.set(i,.72,-10.8),this.headlightBeams.add(s)}this.headlightBeams.visible=!1,this.playerGroup.add(this.headlightBeams)}this.roofRidersGroup.parent||this.playerGroup.add(this.roofRidersGroup)}buildRoadDeck(){const e=new ee(new Rt(13.8,290),new Ee({color:"#2b303a",roughness:.9}));e.rotation.x=-Math.PI/2,e.position.set(0,0,-90),e.receiveShadow=!0,this.roadGroup.add(e);const t=new Ee({color:"#e9ecef",roughness:.7});for(const o of[-1,1]){const l=new ee(new Pe(.7,.22,290),t);l.position.set(o*7.25,.11,-90),l.receiveShadow=!0,this.roadGroup.add(l)}const n=new pt({color:"#ffbe0b"}),i=new ee(new Rt(.24,290),n);i.rotation.x=-Math.PI/2,i.position.set(0,.015,-90),this.roadGroup.add(i);const s=new Rt(.18,3.8),a=new pt({color:"#f8f9fa"});for(const o of[-3,3])for(let l=0;l<16;l++){const c=new ee(s,a);c.rotation.x=-Math.PI/2,c.position.set(o,.015,16-l*11),this.roadGroup.add(c),this.laneDashes.push(c)}}buildNorthBengalBiome(){const e=new Ee({color:"#588157",roughness:.95});for(const a of[-1,1]){const o=new ee(new Rt(90,290),e);o.rotation.x=-Math.PI/2,o.position.set(a*52,-.05,-90),this.northBengalGroup.add(o)}const t=new Ee({color:"#9ef01a",roughness:.9}),n=new Ee({color:"#ffbe0b",roughness:.85});for(let a=0;a<10;a++){const o=new ee(new Rt(18,18),a%3===0?n:t);o.rotation.x=-Math.PI/2,o.position.set(a%2===0?-18:20,-.02,8-a*20),this.northBengalGroup.add(o),this.paddyPatches.push(o)}const i=new Ee({color:"#7f4f24",roughness:.85}),s=new Ee({color:"#38b000",roughness:.7});for(let a=0;a<12;a++){const o=new Le,l=new ee(new qt(.22,.3,2.5,8),i);l.position.y=1.25;const c=new ee(new fs(1.4,10,8),s);c.position.y=3.1,o.add(l,c),o.position.set(a%2===0?-11.5:14.5,0,8-a*16),this.northBengalGroup.add(o),this.trees.push(o)}for(let a=0;a<4;a++){const o=uc[a%uc.length],l=this.createBillboardMesh(o,a===0);l.position.set(-9.6,0,-20-a*44),this.roadGroup.add(l),this.billboards.push(l)}}buildDhakaCityBiome(){const e=new Ee({color:"#6b9080",roughness:.95});for(const s of[-1,1]){const a=new ee(new Rt(90,290),e);a.rotation.x=-Math.PI/2,a.position.set(s*52,-.04,-90),this.dhakaCityGroup.add(a)}const t=new Ee({color:"#adb5bd",roughness:.75}),n=new ee(new Pe(3.2,1.3,290),t);n.position.set(9.2,8.6,-90),this.dhakaCityGroup.add(n);for(let s=0;s<8;s++){const a=new Le,o=new ee(new qt(.65,.78,8.2,12),t);o.position.y=4.1,o.castShadow=!0;const l=new ee(new Pe(3.6,.75,1.6),t);l.position.y=7.8,a.add(o,l),a.position.set(9.2,0,12-s*24),this.dhakaCityGroup.add(a),this.metroPillars.push(a)}const i=["#e07a5f","#f2cc8f","#81b29a","#a8dadc","#f4a261"];for(let s=0;s<10;s++){const a=new Le,o=8+s%4*4.5,l=6+s%3*1.8,c=new ee(new Pe(l,o,8.5),new Ee({color:i[s%i.length],roughness:.8}));c.position.y=o/2,a.add(c),a.position.set(s%2===0?-20:21,0,10-s*19),this.dhakaCityGroup.add(a),this.buildings.push(a)}}buildHillsBiome(){const e=new Ee({color:"#4a7c59",roughness:.95});for(const n of[-1,1]){const i=new ee(new Rt(90,290),e);i.rotation.x=-Math.PI/2,i.position.set(n*52,-.05,-90),this.hillsGroup.add(i)}const t=new Ee({color:"#2d6a4f",roughness:.9});for(let n=0;n<10;n++){const i=new ee(new ii(8+n%3*3,14+n%4*4,7),t);i.position.set(n%2===0?-22:24,6,10-n*20),this.hillsGroup.add(i),this.hillMeshes.push(i)}}buildMarineDriveBiome(){const e=new Ee({color:"#f4d35e",roughness:.9}),t=new ee(new Rt(80,290),new Ee({color:"#2d6a4f"}));t.rotation.x=-Math.PI/2,t.position.set(-47,-.05,-90);const n=new ee(new Rt(6,290),e);n.rotation.x=-Math.PI/2,n.position.set(10.5,-.04,-90);const i=new ee(new Rt(140,290),new Ee({color:"#0077b6",roughness:.2,metalness:.3}));i.rotation.x=-Math.PI/2,i.position.set(82,-.15,-90),this.marineDriveGroup.add(t,n,i);const s=new Ee({color:"#8d5524",roughness:.85}),a=new Ee({color:"#38b000",roughness:.7});for(let o=0;o<10;o++){const l=new Le,c=new ee(new qt(.18,.28,4.8,7),s);c.position.y=2.4,c.rotation.z=-.12;const h=new ee(new ii(2.1,1.4,7),a);h.position.set(.3,4.9,0),l.add(c,h),l.position.set(9.2,0,8-o*19),this.marineDriveGroup.add(l),this.coconutPalms.push(l)}}buildBridges(){this.bridgeMainMat=new Ee({color:"#1d6fa5",metalness:.55,roughness:.38}),this.bridgeAccentMat=new Ee({color:"#48cae4",metalness:.4,roughness:.45}),this.bridgeWaterMat=new Ee({color:"#0077b6",roughness:.22,metalness:.28});const e=new ee(new Rt(260,290),this.bridgeWaterMat);e.rotation.x=-Math.PI/2,e.position.set(0,-4.6,-90),this.bridgeGroup.add(e);const t=new Ee({color:"#dee2e6",roughness:.65});for(const i of[-1,1]){const s=new ee(new Pe(.45,.95,290),t);s.position.set(i*7.65,.5,-90),this.bridgeGroup.add(s)}const n=new pt({color:"#ffd166"});for(let i=0;i<8;i++){const s=new Le;for(const l of[-7.8,7.8]){const c=new ee(new Pe(.55,7.6,.65),this.bridgeMainMat);c.position.set(l,3.8,0),s.add(c);const h=new ee(new Pe(.32,9.2,.35),this.bridgeMainMat);h.position.set(l,3.8,-6),h.rotation.x=.62;const d=new ee(new Pe(.32,9.2,.35),this.bridgeMainMat);d.position.set(l,3.8,-6),d.rotation.x=-.62,s.add(h,d);const u=new ee(new Pe(.45,.45,24),this.bridgeAccentMat);u.position.set(l,7.4,-12),s.add(u);const p=new ee(new Pe(.5,.22,.5),n);p.position.set(l*.88,5.4,-12),s.add(p)}const a=new ee(new Pe(16.2,.6,.7),this.bridgeAccentMat);a.position.set(0,7.4,0),s.add(a);const o=new Le;for(const l of[-7.8,7.8]){const c=new ee(new Pe(.8,14,.9),this.bridgeMainMat);c.position.set(l,11,0);const h=new ee(new qt(.06,.06,15,5),this.bridgeAccentMat);h.position.set(l,8.2,-5.2),h.rotation.x=.72,o.add(c,h)}o.visible=!1,s.add(o),this.cableTowerParts.push(o),s.position.set(0,0,12-i*24),this.bridgeGroup.add(s),this.bridgeSpans.push(s)}}buildFlyover(){const e=new Ee({color:"#e9ecef",roughness:.6}),t=new Ee({color:"#ef233c"}),n=new Ee({color:"#495057",metalness:.5}),i=new pt({color:"#ffbe0b"});for(const s of[-1,1]){const a=new ee(new Pe(.45,1.15,290),e);a.position.set(s*7.6,.58,-90);const o=new ee(new Pe(.48,.24,290),t);o.position.set(s*7.6,.95,-90),this.flyoverGroup.add(a,o)}for(let s=0;s<8;s++){const a=new Le;for(const o of[-7.7,7.7]){const l=new ee(new qt(.12,.16,4.8,6),n);l.position.set(o,2.4,0);const c=new ee(new Pe(1.1,.16,.25),i);c.position.set(o>0?o-.5:o+.5,4.75,0),a.add(l,c)}a.position.set(0,0,10-s*24),this.flyoverGroup.add(a),this.flyoverPosts.push(a)}}buildRailwayAndTrain(){const e=new Ee({color:"#6c757d",metalness:.7,roughness:.3}),t=new Ee({color:"#5c4033",roughness:.9});for(const h of[9.95,11.25]){const d=new ee(new Pe(.14,.16,290),e);d.position.set(h,.12,-90),this.railTrackGroup.add(d)}const n=new Pe(2.1,.1,.36);for(let h=0;h<36;h++){const d=new ee(n,t);d.position.set(10.6,.05,16-h*5.2),this.railTrackGroup.add(d),this.railSleepers.push(d)}const i=new Ee({color:"#d90429",roughness:.45}),s=new Ee({color:"#007f5f",roughness:.5}),a=new Ee({color:"#dee2e6",roughness:.5}),o=new ee(new Pe(2.5,3.1,10.5),i);o.position.set(10.6,1.65,0);const l=new ee(new Pe(2.55,.55,10.55),s);l.position.set(10.6,1.4,0);const c=new ee(new fs(.32,8,8),new pt({color:"#fff3b0"}));c.position.set(10.6,2.1,5.3),this.trainGroup.add(o,l,c);for(let h=1;h<=5;h++){const d=-h*11.4,u=new ee(new Pe(2.4,2.9,10.2),s);u.position.set(10.6,1.55,d);const p=new ee(new Pe(2.44,.45,10.24),i);p.position.set(10.6,1.55,d);const g=new ee(new Pe(2.3,.25,10.1),a);g.position.set(10.6,3.05,d),this.trainGroup.add(u,p,g)}}buildRainPool(){const e=new Pe(.04,1.6,.04),t=new pt({color:"#caf0f8",transparent:!0,opacity:.45});for(let n=0;n<140;n++){const i=new ee(e,t);i.position.set((Math.random()-.5)*26,1+Math.random()*14,12-Math.random()*65),i.rotation.z=.14,this.rainGroup.add(i),this.rainDrops.push(i)}}paintBillboardCanvas(e){const t=document.createElement("canvas");t.width=512,t.height=256;const n=t.getContext("2d");n.fillStyle=e.bgHex,n.fillRect(0,0,512,256),n.strokeStyle=e.accentHex,n.lineWidth=14,n.strokeRect(10,10,492,236),n.fillStyle=e.textHex,n.textAlign="center",n.font='bold 34px "Hind Siliguri", "Segoe UI", sans-serif',n.fillText(e.headline,256,112,460),n.font='600 21px "Hind Siliguri", "Segoe UI", sans-serif',n.fillText(e.subline,256,168,460);const i=new cs(t);return i.colorSpace=ut,i}createBillboardMesh(e,t){const n=new Le,i=new Ee({color:"#495057",metalness:.5}),s=new ee(new qt(.18,.22,4.4,8),i);s.position.y=2.2;const a=this.paintBillboardCanvas(e),o=new Ee({map:a,roughness:.4});t&&(this.championBillboardMat=o);const l=new ee(new Pe(5.6,2.8,.25),o);return l.position.set(0,5.2,0),l.rotation.y=.35,l.castShadow=!0,n.add(s,l),n}updateChampionBillboard(e,t){if(!this.championBillboardMat)return;const n=this.championBillboardMat.map;this.championBillboardMat.map=this.paintBillboardCanvas({id:"champion_live",headline:`👑 #1 ওস্তাদ: ${e}`,subline:`লাইভ বিশ্ব রেকর্ড: ${t.toLocaleString()} pts!`,bgHex:"#1b1f2a",accentHex:"#ffbe0b",textHex:"#ffbe0b"}),this.championBillboardMat.needsUpdate=!0,n?.dispose()}createTollGateMesh(e){const t=new Le,n=new Ee({color:"#f8f9fa",roughness:.5}),i=new Ee({color:"#0077b6",roughness:.4});for(const d of[-6.9,-3,0,3,6.9]){const u=new ee(new Pe(.55,4.8,1.4),n);if(u.position.set(d,2.4,0),t.add(u),Math.abs(d)<4){const p=new ee(new Pe(.7,2.3,2.2),i);p.position.set(d,1.15,0),t.add(p)}}const s=document.createElement("canvas");s.width=1024,s.height=192;const a=s.getContext("2d");a.fillStyle="#023e8a",a.fillRect(0,0,1024,192),a.strokeStyle="#ffbe0b",a.lineWidth=10,a.strokeRect(8,8,1008,176),a.fillStyle="#ffbe0b",a.textAlign="center",a.font='bold 50px "Hind Siliguri", "Segoe UI", sans-serif',a.fillText(`🌉 ${e.tollLabel??"সেতু"} টোল প্লাজা • ৳${e.tollFee??250}`,512,86,960),a.fillStyle="#06d6a0",a.font='bold 32px "Hind Siliguri", "Segoe UI", sans-serif',a.fillText("ক্যাশ দিয়ে পাস করুন অথবা 🔥 নাইট্রো দিয়ে ব্যারিকেড উড়ান!",512,148,960);const o=new cs(s);o.colorSpace=ut;const l=new ee(new Pe(14.8,2.3,1.2),new Ee({map:o,roughness:.35}));l.position.set(0,5.2,0),t.add(l);const c=new Le;c.position.set(-6.4,1.15,.85);const h=new ee(new Pe(12.8,.22,.18),new Ee({color:"#ef233c",emissive:"#6a040f",emissiveIntensity:.3}));return h.position.x=6.4,c.add(h),t.add(c),t.userData.barrierArm=c,t}createBlueGearWrenchMesh(){const e=new Le,t=new Ee({color:"#2196f3",emissive:"#0d47a1",emissiveIntensity:.35,metalness:.35,roughness:.3}),n=new Ee({color:"#e2e8f0",emissive:"#94a3b8",emissiveIntensity:.2,metalness:.7,roughness:.25}),i=new ee(new bs(.45,.14,8,18),t);e.add(i);const s=new Pe(.18,.24,.22);for(let l=0;l<8;l++){const c=l/8*Math.PI*2,h=new ee(s,t);h.position.set(Math.cos(c)*.62,Math.sin(c)*.62,0),h.rotation.z=c+Math.PI/2,e.add(h)}const a=new ee(new Pe(.18,1.18,.14),n);a.position.set(-.08,-.06,.16),a.rotation.z=-.68;const o=new ee(new bs(.18,.06,6,12,Math.PI*1.4),n);return o.position.set(.26,.3,.16),o.rotation.z=-.4,e.add(a,o),e.position.y=1.05,e}triggerCrashBurst(){this.cameraShake=1,this.spawnBurst(this.playerGroup.position,22,"#ffbe0b",1.3),this.spawnBurst(this.playerGroup.position,14,"#ef476f",1.1)}triggerSparkBurst(e,t,n="#ffbe0b"){this.spawnBurst(new P(e,.85,t),10,n,.75)}triggerMinorShake(){this.cameraShake=Math.max(this.cameraShake,.6)}resetEffects(){this.cameraShake=0;for(const e of this.particles)this.particlesGroup.remove(e.mesh),e.mesh.material.dispose();this.particles.length=0}spawnBurst(e,t,n,i=1){for(let s=0;s<t;s++){const a=new pt({color:n,transparent:!0,opacity:1}),o=new ee(this.particleGeo,a);o.scale.setScalar(i),o.position.copy(e).add(new P((Math.random()-.5)*1.2,.8,(Math.random()-.5)*1.5)),this.particlesGroup.add(o),this.particles.push({mesh:o,vel:new P((Math.random()-.5)*9,4+Math.random()*6,(Math.random()-.5)*8),life:0,maxLife:.7+Math.random()*.35})}}syncRoofRiders(e){const t=Math.min(10,Math.max(0,Math.floor((e-4)/2)));if(t===this.renderedRiderCount)return;for(this.renderedRiderCount=t;this.roofRidersGroup.children.length>0;)this.roofRidersGroup.remove(this.roofRidersGroup.children[0]);const n=this.templates.get("passenger_npc");if(n)for(let i=0;i<t;i++){const s=n.clone(!0);if(s.scale.setScalar(.65),i%3===0)s.position.set(-1.32,.45,-1.35+i%2*.5),s.rotation.z=.22;else{const a=Math.floor(i/2),o=i%2===0?-.48:.48;s.position.set(o,2.38,-1.4+a*.75)}this.roofRidersGroup.add(s)}}createEntityVisual(e){if(e.kind==="toll_gate")return this.createTollGateMesh(e);if(e.kind==="wrench_pickup")return this.createBlueGearWrenchMesh();const t={plastic_sedan:"plastic_sedan",deshi_tesla:"deshi_tesla_auto",cng:"cng_rickshaw",cargo_truck:"cargo_truck",rival_bus:"murir_tin_bus",sergeant:"sergeant_npc",bus_stop:"passenger_npc",wasa_pit:"",wrench_pickup:"",nitro_pickup:"",toll_gate:""},n=new Le,i=t[e.kind];if(i&&this.templates.has(i)){const s=this.templates.get(i).clone(!0);if(e.kind==="deshi_tesla"){s.rotation.y=Math.PI;const a=new ee(new fs(.24,8,8),new pt({color:"#ff0054"}));a.position.y=2.15,n.add(a)}else if(e.kind==="rival_bus"){let a=0;s.traverse(o=>{if(o.isMesh){const l=o.material.clone();a===0&&l.color.set("#3a86ff"),a===1&&l.color.set("#ffbe0b"),o.material=l,a++}})}else if(e.kind==="bus_stop"){const a=new ee(new qt(1.6,1.6,.08,20),new pt({color:"#06d6a0",transparent:!0,opacity:.6}));a.position.y=.05,n.add(a);const o=s.clone(!0);o.position.x=-.55,s.position.x=.45,n.add(o)}n.add(s)}else if(e.kind==="wasa_pit"){const s=new ee(new Pe(2.3,.14,2),new Ee({color:"#4a3219",roughness:.95}));s.position.y=.07;const a=new ee(new Pe(2.4,.95,.25),new Ee({color:"#ef233c",roughness:.4}));a.position.y=.65;const o=new ee(new Pe(2.44,.26,.28),new Ee({color:"#ffbe0b"}));o.position.y=.72,n.add(s,a,o)}else if(e.kind==="nitro_pickup"){const s=new ee(new qt(.36,.36,1.1,12),new Ee({color:"#ffbe0b",emissive:"#fb5607",emissiveIntensity:.55}));s.position.y=.95,n.add(s)}return n}updateSkyAndLighting(e){const t=e.timeOfDay;t<.28?this.skyScratch.copy(this.cMorning).lerp(this.cNoon,t/.28):t<.58?this.skyScratch.copy(this.cNoon).lerp(this.cDhaka,(t-.28)/.3):t<.85?this.skyScratch.copy(this.cDhaka).lerp(this.cSunset,(t-.58)/.27):this.skyScratch.copy(this.cSunset).lerp(this.cNight,(t-.85)/.15),e.rainIntensity>.05&&this.skyScratch.lerp(this.cStorm,e.rainIntensity*.72);const n=Math.max(0,(t-.82)/.18);this.hemiLight.intensity=Qn.lerp(1.28,.65,n),this.sunLight.intensity=Qn.lerp(1.85,.55,n),this.scene.background=this.skyScratch,this.scene.fog instanceof xr&&this.scene.fog.color.copy(this.skyScratch)}sync(e,t){const n=e.crashed?0:e.speed*t,i=(x,v,C)=>{x.position.z+=n,x.position.z>24?x.position.z-=v:x.position.z<C&&(x.position.z+=v)};for(const x of this.laneDashes)i(x,176,-160);for(const x of this.railSleepers)i(x,187.2,-171);for(const x of this.metroPillars)i(x,192,-180);for(const x of this.billboards)i(x,176,-160);for(const x of this.trees)i(x,192,-180);for(const x of this.buildings)i(x,190,-176);for(const x of this.paddyPatches)i(x,200,-180);for(const x of this.hillMeshes)i(x,200,-180);for(const x of this.coconutPalms)i(x,190,-175);for(const x of this.bridgeSpans)i(x,192,-180);for(const x of this.flyoverPosts)i(x,192,-180);const s=e.bridgeBlend>.18,a=!s&&e.flyoverBlend>.2;if(this.bridgeGroup.visible=s,this.flyoverGroup.visible=a,s&&e.activeBridgeStyle){const x=R_[e.activeBridgeStyle];this.bridgeMainMat.color.set(x.main),this.bridgeAccentMat.color.set(x.accent),this.bridgeWaterMat.color.set(x.water);const v=e.activeBridgeStyle==="karnaphuli";for(const C of this.cableTowerParts)C.visible=v}const o=e.bridgeBlend<.78;if(this.northBengalGroup.visible=o&&(e.currentBiome==="north_bengal"||e.currentBiome==="rain_highway"||e.currentBiome==="flyover"),this.dhakaCityGroup.visible=o&&e.currentBiome==="dhaka_city",this.hillsGroup.visible=o&&e.currentBiome==="hills",this.marineDriveGroup.visible=o&&e.currentBiome==="marine_drive",this.railTrackGroup.visible=!!(e.currentSegment.hasParallelRail||e.trainActive),this.trainGroup.visible=e.trainActive,e.trainActive&&this.trainGroup.position.set(0,0,e.trainZ),this.underTerrainGroup.position.y=-e.elevationY,this.updateSkyAndLighting(e),this.rainGroup.visible=e.rainIntensity>.12,this.rainGroup.visible)for(let x=0;x<this.rainDrops.length;x++){const v=this.rainDrops[x];v.visible=x<this.activeRainLimit,v.visible&&(v.position.y-=28*t,v.position.z+=n*.55,(v.position.y<0||v.position.z>14)&&v.position.set((Math.random()-.5)*26,12+Math.random()*5,10-Math.random()*65))}if(this.playerGroup.position.set(e.playerX,0,0),this.playerGroup.rotation.z=e.tiltAngle,this.playerGroup.rotation.y=-e.playerVx*.025,this.playerGroup.rotation.x=Qn.lerp(this.playerGroup.rotation.x,e.slopePitch,Math.min(1,t*8)),this.playerGroup.visible=e.invulnTimer<=0||Math.floor(e.invulnTimer*16)%2===0,this.nitroFlames.visible=e.nitroActive&&!e.crashed,this.nitroFlames.visible){const x=.85+Math.random()*.45;this.nitroFlames.scale.set(1,1,x)}this.headlightBeams.visible=e.headlightsOn&&!e.crashed,this.syncRoofRiders(e.passengers);const l=new Set;for(const x of e.entities){l.add(x.id);let v=this.entityMeshes.get(x.id);if(v||(v=this.createEntityVisual(x),this.trafficGroup.add(v),this.entityMeshes.set(x.id,v)),v.position.set(x.x,0,x.z),(x.kind==="wrench_pickup"||x.kind==="nitro_pickup")&&(v.rotation.y+=t*3.2),x.kind==="toll_gate"&&v.userData.barrierArm){const C=v.userData.barrierArm,A=x.hitResolved?.52:0;C.rotation.z=Qn.lerp(C.rotation.z,A,Math.min(1,t*12))}}for(const[x,v]of this.entityMeshes.entries())l.has(x)||(this.trafficGroup.remove(v),this.entityMeshes.delete(x));for(let x=this.particles.length-1;x>=0;x--){const v=this.particles[x];if(v.life+=t,v.life>=v.maxLife){this.particlesGroup.remove(v.mesh),v.mesh.material.dispose(),this.particles.splice(x,1);continue}v.vel.y-=14*t,v.mesh.position.addScaledVector(v.vel,t),v.mesh.rotation.x+=8*t,v.mesh.rotation.y+=8*t;const C=1-v.life/v.maxLife;v.mesh.material.opacity=C}const c=this.cameraMode==="wide"?64:this.cameraMode==="close"?50:56,h=e.nitroActive?c+10:e.feverActive?c+4:c;this.camera.fov=Qn.lerp(this.camera.fov,h,Math.min(1,t*6)),this.camera.updateProjectionMatrix(),this.cameraShake=Math.max(0,this.cameraShake-t*2.5);const d=(Math.random()-.5)*this.cameraShake*.45,u=(Math.random()-.5)*this.cameraShake*.35,p=this.camera.aspect,g=this.cameraMode==="close"?4.4:this.cameraMode==="wide"?6.8:5.6,_=this.cameraMode==="close"?7.6:this.cameraMode==="wide"?11.8:9.8,m=(p<.85?g+1.5:g)-e.slopePitch*7,f=p<.85?_+2.8:_,b=Qn.lerp(this.camera.position.x,e.playerX*.52,Math.min(1,t*7));this.camera.position.set(b+d,m+u,f),this.camera.lookAt(e.playerX*.45,1.35+e.slopePitch*12,-14),this.renderer.render(this.scene,this.camera)}createNitroFlamesGroup(){const e=new Le,t=new pt({color:"#00f5d4",transparent:!0,opacity:.9}),n=new pt({color:"#ffbe0b"});for(const i of[-.65,.65]){const s=new ee(new ii(.28,1.4,10),t);s.rotation.x=Math.PI/2,s.position.set(i,.58,3.35);const a=new ee(new ii(.16,.9,8),n);a.rotation.x=Math.PI/2,a.position.set(i,.58,3.15),e.add(s,a)}return e.visible=!1,e}buildFinishArch(){const e=new Ee({color:"#ffbe0b",roughness:.45}),t=new Ee({color:"#1b1f2a",roughness:.5});for(const l of[-6.9,6.9]){const c=new ee(new Pe(.65,6.6,.65),e);c.position.set(l,3.3,0);const h=new ee(new Pe(1.1,.6,1.1),t);h.position.set(l,.3,0),this.finishArchGroup.add(c,h)}const n=document.createElement("canvas");n.width=512,n.height=128;const i=n.getContext("2d"),s=32;for(let l=0;l<4;l++)for(let c=0;c<16;c++)i.fillStyle=(c+l)%2===0?"#ffffff":"#111827",i.fillRect(c*s,l*s,s,s);i.fillStyle="rgba(239, 71, 111, 0.92)",i.fillRect(110,22,292,84),i.strokeStyle="#ffbe0b",i.lineWidth=6,i.strokeRect(110,22,292,84),i.fillStyle="#fffdf7",i.textAlign="center",i.font='bold 42px "Hind Siliguri", "Segoe UI", sans-serif',i.fillText("🏁 FINISH 🏁",256,78);const a=new cs(n);a.colorSpace=ut;const o=new ee(new Pe(14.6,2.2,.5),new pt({map:a}));o.position.set(0,6,0),this.finishArchGroup.add(o),this.finishArchGroup.visible=!1}createNameplateSprite(e,t){const n=document.createElement("canvas");n.width=320,n.height=76;const i=n.getContext("2d");i.fillStyle="rgba(15, 20, 32, 0.88)",i.beginPath(),i.roundRect(10,10,300,56,28),i.fill(),i.strokeStyle=t,i.lineWidth=4,i.stroke(),i.fillStyle=t,i.beginPath(),i.arc(38,38,10,0,Math.PI*2),i.fill(),i.fillStyle="#fffdf7",i.textAlign="left",i.font='bold 26px "Hind Siliguri", "Segoe UI", sans-serif',i.fillText(e.slice(0,16),58,47,236);const s=new cs(n);s.colorSpace=ut;const a=new Yc({map:s,transparent:!0,depthTest:!1}),o=new xu(a);return o.scale.set(3.8,.9,1),o.position.set(0,3.65,0),o}syncRemoteRacers(e,t,n){const i=new Set;for(const s of t){i.add(s.id);let a=this.remoteRacerNodes.get(s.id);if(a){if(a.busId!==s.busId){Ii(a.busGroup),a.root.remove(a.busGroup);const c=this.buildBusPreviewClone(s.busId);a.root.add(c),a.busGroup=c,a.busId=s.busId}}else{const c=new Le,h=this.buildBusPreviewClone(s.busId),d=this.createNameplateSprite(s.name,s.color),u=this.createNitroFlamesGroup();c.add(h,d,u),this.remoteRacersGroup.add(c),a={root:c,busGroup:h,busId:s.busId,nameSprite:d,flames:u},this.remoteRacerNodes.set(s.id,a)}const o=e.distanceM-s.distanceM,l=o>-185&&o<32;a.root.visible=l,l&&(a.root.position.set(s.x,0,o),a.root.rotation.z=s.tiltAngle,a.flames.visible=s.nitroActive,a.flames.visible&&a.flames.scale.set(1,1,.85+Math.random()*.45))}for(const[s,a]of this.remoteRacerNodes.entries())if(!i.has(s)){Ii(a.busGroup);const o=a.nameSprite.material;o.map?.dispose(),o.dispose(),this.remoteRacersGroup.remove(a.root),this.remoteRacerNodes.delete(s)}if(n!==null){const s=e.distanceM-n,a=s>-185&&s<28;this.finishArchGroup.visible=a,a&&this.finishArchGroup.position.set(0,0,s)}else this.finishArchGroup.visible=!1}clearRemoteRacers(){for(const e of this.remoteRacerNodes.values()){Ii(e.busGroup);const t=e.nameSprite.material;t.map?.dispose(),t.dispose(),this.remoteRacersGroup.remove(e.root)}this.remoteRacerNodes.clear(),this.finishArchGroup.visible=!1}resize(){const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}}const ar=738,or=1024;class I_{constructor(e,t){this.container=e,this.onFastTravel=t,this.renderBaseMap()}zoom=1;panX=0;panY=0;dragging=!1;lastX=0;lastY=0;selectedSegId=null;svgViewport;progressPath;busMarker;infoCard;pinEls=new Map;lastSim=null;lastUnlocked=["thakurgaon"];renderBaseMap(){const e=mt.map(s=>`${s.mapX},${s.mapY}`).join(" ");this.container.innerHTML=`
      <div class="bd-map-shell">
        <div class="bd-map-stage">
          <svg class="bd-map-svg" viewBox="0 0 ${ar} ${or}" role="img" aria-label="বাংলাদেশের আসল মানচিত্র — ঠাকুরগাঁও থেকে কক্সবাজার">
            <rect width="${ar}" height="${or}" fill="#0b1d33" />
            <text x="275" y="965" fill="#48cae4" font-size="24" font-weight="700" opacity="0.72" text-anchor="middle">বঙ্গোপসাগর (Bay of Bengal)</text>

            <g class="bd-viewport">
              <image href="./bd-map.png" x="0" y="0" width="${ar}" height="${or}" preserveAspectRatio="xMidYMid meet" />

              <!-- High-contrast halo behind route line -->
              <polyline
                points="${e}"
                fill="none"
                stroke="#0b1d33"
                stroke-width="11"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0.75"
              />
              <polyline
                class="bd-route-remaining"
                points="${e}"
                fill="none"
                stroke="#7c3aed"
                stroke-width="6.5"
                stroke-dasharray="13 9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                class="bd-route-done"
                points=""
                fill="none"
                stroke="#10b981"
                stroke-width="8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <g class="bd-pins"></g>
              <g class="bd-bus-pin">
                <circle r="16" fill="#ffbe0b" stroke="#0b1d33" stroke-width="4"></circle>
                <text y="6" text-anchor="middle" font-size="18">🚌</text>
              </g>
            </g>

            <!-- Crisp Compass Rose -->
            <g transform="translate(658, 72)" opacity="0.9">
              <circle r="34" fill="rgba(11, 29, 51, 0.78)" stroke="#ffbe0b" stroke-width="2" />
              <polygon points="0,-24 6,-4 0,-8 -6,-4" fill="#ef476f" />
              <polygon points="0,24 6,4 0,8 -6,4" fill="#cbd5e1" />
              <text y="-26" text-anchor="middle" fill="#ffbe0b" font-size="13" font-weight="800">N</text>
            </g>
          </svg>

          <div class="bd-map-zoom">
            <button type="button" class="btn-outline" data-zoom="in" aria-label="জুম ইন">+</button>
            <button type="button" class="btn-outline" data-zoom="out" aria-label="জুম আউট">−</button>
            <button type="button" class="btn-outline" data-zoom="reset" aria-label="রিসেট ভিউ">⌖</button>
          </div>
        </div>

        <aside class="bd-map-info" aria-live="polite"></aside>
      </div>
    `;const t=this.container.querySelector(".bd-map-svg");this.svgViewport=this.container.querySelector(".bd-viewport"),this.progressPath=this.container.querySelector(".bd-route-done"),this.busMarker=this.container.querySelector(".bd-bus-pin"),this.infoCard=this.container.querySelector(".bd-map-info");const n=this.container.querySelector(".bd-pins"),i="http://www.w3.org/2000/svg";for(const s of mt){if(!s.isHub&&s.biome!=="river_bridge")continue;const a=document.createElementNS(i,"g");a.setAttribute("class","bd-pin"),a.setAttribute("transform",`translate(${s.mapX}, ${s.mapY})`),a.style.cursor="pointer";const o=s.biome==="river_bridge",l=document.createElementNS(i,"circle");l.setAttribute("r",o?"10":"8.5"),l.setAttribute("fill",o?"#0ea5e9":"#ffbe0b"),l.setAttribute("stroke","#0b1d33"),l.setAttribute("stroke-width","3");const c=o?`🌉 ${s.enName.replace(" Bridge","").replace(" Setu","")}`:s.name.split(" ")[0],h=s.labelAnchor??"right",d=s.labelDy??0,u=h==="left"?-14:14,p=Math.max(58,c.length*8.5+14),g=h==="left"?u-p+4:u-4,_=document.createElementNS(i,"rect");_.setAttribute("x",String(g)),_.setAttribute("y",String(d-12)),_.setAttribute("width",String(p)),_.setAttribute("height","22"),_.setAttribute("rx","6"),_.setAttribute("fill","rgba(11, 29, 51, 0.88)"),_.setAttribute("stroke",o?"#38bdf8":"#ffbe0b"),_.setAttribute("stroke-width","1.4");const m=document.createElementNS(i,"text");m.setAttribute("x",String(u)),m.setAttribute("y",String(d+4)),m.setAttribute("text-anchor",h==="left"?"end":"start"),m.setAttribute("fill","#fffdf7"),m.setAttribute("font-size","14"),m.setAttribute("font-weight","700"),m.textContent=c,a.append(l,_,m),a.addEventListener("click",f=>{f.stopPropagation(),this.selectedSegId=s.id,this.lastSim&&this.lastUnlocked&&this.renderInfoCard(s,this.lastSim,this.lastUnlocked)}),n.appendChild(a),this.pinEls.set(s.id,a)}this.container.querySelectorAll(".bd-map-zoom button").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.zoom;a==="in"?this.zoom=Math.min(3.5,this.zoom+.4):a==="out"?this.zoom=Math.max(1,this.zoom-.4):(this.zoom=1,this.panX=0,this.panY=0),this.applyTransform()})}),t.addEventListener("wheel",s=>{s.preventDefault();const a=s.deltaY<0?.25:-.25;this.zoom=Math.max(1,Math.min(3.5,this.zoom+a)),this.applyTransform()}),t.addEventListener("pointerdown",s=>{this.dragging=!0,this.lastX=s.clientX,this.lastY=s.clientY}),window.addEventListener("pointermove",s=>{this.dragging&&(this.panX+=(s.clientX-this.lastX)*1.4,this.panY+=(s.clientY-this.lastY)*1.4,this.lastX=s.clientX,this.lastY=s.clientY,this.applyTransform())}),window.addEventListener("pointerup",()=>{this.dragging=!1})}applyTransform(){const e=ar/2,t=or/2;this.svgViewport.setAttribute("transform",`translate(${e+this.panX}, ${t+this.panY}) scale(${this.zoom}) translate(${-e}, ${-t})`)}sync(e,t){this.lastSim=e,this.lastUnlocked=t;const n=e.distanceM%kn,i=[];for(const a of mt)a.startM<=n&&i.push(`${a.mapX},${a.mapY}`);i.push(`${e.mapX.toFixed(1)},${e.mapY.toFixed(1)}`),this.progressPath.setAttribute("points",i.join(" ")),this.busMarker.setAttribute("transform",`translate(${e.mapX.toFixed(1)}, ${e.mapY.toFixed(1)})`);const s=mt.find(a=>a.id===this.selectedSegId)??e.currentSegment;this.renderInfoCard(s,e,t)}renderInfoCard(e,t,n){const i=t.distanceM%kn,s=ri(e.startM),a=Math.max(0,Math.round(e.startM-i)),o=e.id==="thakurgaon"||n.includes(e.id);this.infoCard.innerHTML=`
      <div class="bd-info-head">
        <strong>${e.name}</strong>
        <span class="bd-info-km">${s} / 840 km</span>
      </div>
      <p>${e.tagline}</p>
      <div class="bd-info-stats">
        <span>অবস্থা: <strong>${i>=e.startM?"✅ অতিক্রান্ত / চলমান":`আর ${ri(a)} km বাকি`}</strong></span>
        ${e.tollFee?`<span>টোল: <strong>৳${e.tollFee}</strong></span>`:""}
      </div>
      <div class="bd-info-actions">
        ${e.isHub?`<button type="button" class="btn-secondary" id="btn-fast-travel-hub" ${o?"":"disabled"}>
                ${o?"🚌 এখান থেকে ট্রিপ শুরু করুন":"🔒 লকড (আগে এখানে পৌঁছান)"}
              </button>`:""}
      </div>
    `;const l=this.infoCard.querySelector("#btn-fast-travel-hub");l&&o&&l.addEventListener("click",()=>this.onFastTravel(e))}}function P_(){const r=document.querySelectorAll("dialog");for(const e of r)e.addEventListener("close",()=>{e.returnValue=""});if(!("closedBy"in HTMLDialogElement.prototype)){const e=(t,n)=>{const i=n.getBoundingClientRect();return t.clientX<i.left||t.clientX>i.right||t.clientY<i.top||t.clientY>i.bottom};for(const t of document.querySelectorAll('dialog[closedby="any"]')){let n=!1;t.addEventListener("pointerdown",i=>{n=e(i,t)}),t.addEventListener("pointerup",i=>{n&&e(i,t)&&t.close()})}}}function fc(r){const e=document.activeElement,t=Object.assign(document.createElement("textarea"),{value:r});t.setAttribute("readonly",""),t.style.cssText="position:fixed;inset-block-start:0;opacity:0",document.body.append(t),t.select();try{return document.execCommand("copy")}finally{t.remove(),e?.focus({preventScroll:!0})}}function L_(){const r=new WeakMap;let e="";const t=(i,s)=>{const a=i.nextElementSibling;if(!(a instanceof HTMLElement))return;window.clearTimeout(r.get(i)),i.removeAttribute("data-copied"),i.removeAttribute("data-failed");let o=s?"কপি হয়েছে!":"কপি ব্যর্থ";o===e&&(o+=" "),e=o,a.textContent="",i.offsetWidth,i.setAttribute(s?"data-copied":"data-failed",""),requestAnimationFrame(()=>{a.textContent=o}),r.set(i,window.setTimeout(()=>{i.removeAttribute("data-copied"),i.removeAttribute("data-failed"),a.textContent=""},2e3))},n=async(i,s)=>{const a=s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement?s.value.trim():s.innerText.trim();if(a)try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(a);else if(!fc(a))throw new Error("Copy failed");t(i,!0)}catch{fc(a)?t(i,!0):t(i,!1)}};"CommandEvent"in window?document.addEventListener("command",i=>{const s=i;s.command==="--copy"&&s.source instanceof HTMLElement&&i.target instanceof HTMLElement&&n(s.source,i.target)},!0):document.addEventListener("click",i=>{if(i.defaultPrevented)return;const s=i.target?.closest?.('button[command="--copy"]');if(!(s instanceof HTMLElement))return;const a=s.getAttribute("commandfor"),o=a?document.getElementById(a):null;o&&n(s,o)})}class D_{constructor(e){this.container=e,this.renderer=new ch({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.toneMapping=lo,this.renderer.toneMappingExposure=1.15,this.renderer.domElement.style.display="block",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.touchAction="none",this.renderer.domElement.style.cursor="grab",e.appendChild(this.renderer.domElement),this.scene=new Xc,this.camera=new Ct(42,16/9,.2,60),this.camera.position.set(0,2.35,7.2),this.camera.lookAt(0,1.15,0);const t=new ih("#ffffff","#1e293b",1.35),n=new Sr("#fff5db",2.1);n.position.set(5,8,6);const i=new Sr("#38bdf8",1.15);i.position.set(-6,4,-5),this.scene.add(t,n,i);const s=new ee(new qt(3.35,3.6,.22,48),new Ee({color:"#141926",metalness:.45,roughness:.32}));s.position.y=-.11;const a=new ee(new bs(3.36,.05,10,48),new pt({color:"#ffbe0b"}));a.rotation.x=Math.PI/2,a.position.y=.01,this.turntable.add(s,a),this.scene.add(this.turntable),this.bindDrag(),this.resize()}renderer;scene;camera;turntable=new Le;currentBus=null;rafId=0;isRunning=!1;lastTime=0;yaw=-.58;dragging=!1;lastX=0;bindDrag(){const e=this.renderer.domElement;e.addEventListener("pointerdown",t=>{this.dragging=!0,this.lastX=t.clientX,e.style.cursor="grabbing"}),window.addEventListener("pointermove",t=>{if(!this.dragging||!this.isRunning)return;const n=t.clientX-this.lastX;this.lastX=t.clientX,this.yaw+=n*.012}),window.addEventListener("pointerup",()=>{this.dragging=!1,e.style.cursor="grab"})}showBus(e){this.currentBus&&(Ii(this.currentBus),this.turntable.remove(this.currentBus)),this.currentBus=e,this.turntable.add(e),this.yaw=-.58}start(){if(this.isRunning)return;this.isRunning=!0,this.resize(),this.lastTime=performance.now();const e=t=>{if(!this.isRunning)return;this.rafId=requestAnimationFrame(e);const n=Math.min(.05,(t-this.lastTime)/1e3);this.lastTime=t,this.dragging||(this.yaw+=n*.46),this.turntable.rotation.y=this.yaw,this.renderer.render(this.scene,this.camera)};this.rafId=requestAnimationFrame(e)}stop(){this.isRunning=!1,cancelAnimationFrame(this.rafId)}resize(){const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}}function N_(r,e,t,n=[],i=null){const s=r.getContext("2d");if(!s)return;const a=r.width,o=r.height;s.clearRect(0,0,a,o),e.isOnBridge?s.fillStyle="#023e8a":e.currentBiome==="marine_drive"?s.fillStyle="#1b4332":s.fillStyle="#141a24",s.fillRect(0,0,a,o),e.currentBiome==="marine_drive"&&(s.fillStyle="#0077b6",s.fillRect(a*.68,0,a*.32,o));const l=a*.24,c=a*.52;s.fillStyle="#2b303a",s.fillRect(l,0,c,o),s.strokeStyle="#ffbe0b",s.lineWidth=1.5,s.beginPath(),s.moveTo(a/2,0),s.lineTo(a/2,o),s.stroke(),s.strokeStyle="rgba(255,255,255,0.4)",s.lineWidth=1,s.strokeRect(l,0,c,o);const h=o*.76,d=g=>a/2+g/ga*(c*.46),u=g=>h+g*.62;if(e.trainActive){const g=u(e.trainZ);s.fillStyle="#d90429",s.fillRect(l+c+5,g-16,6,32),s.fillStyle="#06d6a0",s.fillRect(l+c+5,g-6,6,12)}for(const g of e.entities){const _=u(g.z);if(_<-10||_>o+10)continue;const m=d(g.x);g.kind==="toll_gate"?(s.fillStyle="#ffbe0b",s.fillRect(l,_-2.5,c,5)):g.kind==="deshi_tesla"?(s.fillStyle="#ef476f",s.beginPath(),s.moveTo(m,_+5),s.lineTo(m-4,_-4),s.lineTo(m+4,_-4),s.closePath(),s.fill()):g.kind==="bus_stop"?(s.fillStyle="#06d6a0",s.beginPath(),s.arc(m,_,4.5,0,Math.PI*2),s.fill()):g.kind==="sergeant"?(s.fillStyle=Math.floor(t/180)%2===0?"#3a86ff":"#ef233c",s.beginPath(),s.arc(m,_,4,0,Math.PI*2),s.fill()):g.kind==="rival_bus"?(s.fillStyle="#ffbe0b",s.fillRect(m-3.5,_-6,7,12)):g.kind==="wrench_pickup"||g.kind==="nitro_pickup"?(s.fillStyle=g.kind==="wrench_pickup"?"#38bdf8":"#fb8500",s.fillRect(m-3,_-3,6,6)):(s.fillStyle="#e2e8f0",s.fillRect(m-2.5,_-4,5,8))}if(i!==null){const g=u(i);if(g>=-8&&g<=o+8){s.fillStyle="#ffffff",s.fillRect(l,g-3,c,6),s.fillStyle="#1b1f2a";for(let _=0;_<6;_+=2)s.fillRect(l+_*(c/6),g-3,c/6,6)}}for(const g of n){const _=Math.max(7,Math.min(o-7,u(g.z))),m=d(g.x);s.fillStyle=g.color,s.strokeStyle="#111827",s.lineWidth=1.6,s.beginPath(),s.arc(m,_,5,0,Math.PI*2),s.fill(),s.stroke()}const p=d(e.playerX);s.fillStyle="#ffbe0b",s.strokeStyle="#1b1f2a",s.lineWidth=1.5,s.beginPath(),s.moveTo(p,h-8),s.lineTo(p+6,h+6),s.lineTo(p,h+3),s.lineTo(p-6,h+6),s.closePath(),s.fill(),s.stroke()}function pc(r,e){const t=r.getContext("2d");if(!t)return;const n=760,i=470;r.width=n,r.height=i;const s=t.createLinearGradient(0,0,n,i);s.addColorStop(0,"#181c28"),s.addColorStop(1,"#2c1b3b"),t.fillStyle=s,t.fillRect(0,0,n,i),t.strokeStyle="#ffbe0b",t.lineWidth=10,t.strokeRect(10,10,n-20,i-20),t.strokeStyle="#ef476f",t.lineWidth=4,t.strokeRect(20,20,n-40,i-40),t.fillStyle="#ffbe0b",t.textAlign="center",t.font='bold 29px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText("🚌 মুড়ির টিন এক্সপ্রেস — রিপোর্ট কার্ড",n/2,62,n-80);const a=e.playerName?.trim(),o=kh(e.score);a?(t.fillStyle="#fffdf7",t.font='bold 20px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`ওস্তাদ: ${a}`,n/2,94,n-90),t.fillStyle="#06d6a0",t.font='bold 22px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`খেতাব: ${o}`,n/2,124,n-90)):(t.fillStyle="#06d6a0",t.font='bold 24px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`খেতাব: ${o}`,n/2,108,n-90));const l=[["🏆 মোট পয়েন্ট",`${e.score.toLocaleString()} pts`],["📍 শেষ লোকেশন ও দূরত্ব",`${e.stopName} (${ri(e.distanceM)} km)`],["🌉 সেতু ও টোল",`${e.padmaCrossings} টি সেতু • টোল ৳${e.totalTollPaid.toLocaleString()}`],["💥 চাপানি ও টেসলা ডজ",`ঘষা ${e.plasticScrapes}টি • ডজ ${e.teslaDodges}টি`],["👥 বাদুড়ঝোলা যাত্রী",`${e.passengers} জন`],["💵 নিট ভাড়া আদায়",`৳ ${e.takaEarned.toLocaleString()}`]],c=326,h=68,d=44,u=20,p=148,g=14;l.forEach(([_,m],f)=>{const b=f%2,x=Math.floor(f/2),v=d+b*(c+u),C=p+x*(h+g);t.fillStyle="rgba(255, 255, 255, 0.08)",t.fillRect(v,C,c,h),t.strokeStyle="rgba(255, 255, 255, 0.14)",t.lineWidth=1.5,t.strokeRect(v,C,c,h),t.textAlign="left",t.fillStyle="#cbd5e1",t.font='600 15px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(_,v+14,C+24,c-28),t.fillStyle="#ffbe0b",t.font='bold 20px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(m,v+14,C+53,c-28)}),t.textAlign="center",t.fillStyle="#ffb3c6",t.font='bold 17px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText("ঠাকুরগাঁও ➔ কক্সবাজার! সাহস থাকলে murirtin-express.vercel.app-এ ভাঙ্গো! 🔥",n/2,434,n-80)}function U_(r,e){const t=r.getContext("2d");if(!t)return;const n=760,i=470;r.width=n,r.height=i;const s=t.createLinearGradient(0,0,n,i);s.addColorStop(0,"#10212b"),s.addColorStop(1,"#1d1b38"),t.fillStyle=s,t.fillRect(0,0,n,i),t.strokeStyle="#06d6a0",t.lineWidth=10,t.strokeRect(10,10,n-20,i-20),t.strokeStyle="#ffbe0b",t.lineWidth=4,t.strokeRect(20,20,n-40,i-40),t.fillStyle="#ffbe0b",t.textAlign="center",t.font='bold 28px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`🏁 মুড়ির টিন বন্ধু রেস — ${e.routeLabel}`,n/2,62,n-80),t.fillStyle="#72efdd",t.font='bold 18px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`রুম কোড: ${e.roomCode} • ${e.standings.length} জন ওস্তাদ`,n/2,94,n-80);const a=e.standings[0]?.finishMs??null,o=e.standings.slice(0,6),l=118,c=46,h=6;o.forEach((d,u)=>{const p=l+u*(c+h),g=d.id===e.localPlayerId;t.fillStyle=g?"rgba(6, 214, 160, 0.22)":"rgba(255, 255, 255, 0.08)",t.fillRect(46,p,n-92,c),t.strokeStyle=g?"#06d6a0":"rgba(255, 255, 255, 0.16)",t.lineWidth=g?2:1.2,t.strokeRect(46,p,n-92,c);const _=u===0?"🥇 #1":u===1?"🥈 #2":u===2?"🥉 #3":`#${u+1}`;t.textAlign="left",t.fillStyle="#ffbe0b",t.font='bold 20px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(_,62,p+29,68),t.fillStyle=d.color,t.beginPath(),t.arc(140,p+23,7,0,Math.PI*2),t.fill(),t.fillStyle="#fffdf7",t.font='bold 19px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(`${d.name}${g?" (আপনি)":""}`,158,p+23,255),t.fillStyle="#cbd5e1",t.font='600 13px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText(d.busName,158,p+40,255),t.textAlign="right",t.fillStyle=d.finishMs!==null?"#72efdd":"#ffd166",t.font='bold 19px "Hind Siliguri", "Segoe UI", sans-serif';let m=d.finishMs!==null?ma(d.finishMs):`${ri(d.distanceM)} km`;u>0&&d.finishMs!==null&&a!==null&&(m+=` (+${((d.finishMs-a)/1e3).toFixed(1)}s)`),t.fillText(m,n-62,p+29,250)}),t.textAlign="center",t.fillStyle="#ffd166",t.font='bold 17px "Hind Siliguri", "Segoe UI", sans-serif',t.fillText("বন্ধুদের সাথে রেস করতে ভিজিট করুন: murirtin-express.vercel.app 🔥",n/2,438,n-80)}const F_='<svg class="gear-life-svg" viewBox="0 0 64 64" aria-hidden="true"><path fill="#2196f3" d="M36 6h-8l-1.8 6.4a19 19 0 0 0-5.4 2.2l-5.8-3.4-5.6 5.6 3.4 5.8a19 19 0 0 0-2.2 5.4L6 28v8l6.4 1.8a19 19 0 0 0 2.2 5.4l-3.4 5.8 5.6 5.6 5.8-3.4a19 19 0 0 0 5.4 2.2L28 58h8l1.8-6.4a19 19 0 0 0 5.4-2.2l5.8 3.4 5.6-5.6-3.4-5.8a19 19 0 0 0 2.2-5.4L58 36v-8l-6.4-1.8a19 19 0 0 0-2.2-5.4l3.4-5.8-5.6-5.6-5.8 3.4a19 19 0 0 0-5.4-2.2z"/><circle cx="32" cy="32" r="11" fill="#e2e8f0"/><path fill="#cbd5e1" stroke="#1b1f2a" stroke-width="2.5" d="M41 18a9 9 0 0 0-11 11L14 45a4 4 0 0 0 5.6 5.6L35.5 35A9 9 0 0 0 46 23l-4.5 4.5-4-4z"/></svg>',mc={left:"বামে চাপানো",right:"ডানে চাপানো",accelerate:"গতি বাড়ানো",brake:"ব্রেক ধরা",horn:"হাইড্রোলিক হর্ন",nitro:"নাইট্রো টান",map:"বাংলাদেশ ম্যাপ",pause:"পজ মেনু"};class B_{store=new zh;audio=new vh;world;sim;bdMap;showroom;showroomIndex=0;isPlaying=!1;isPaused=!1;modalPaused=!1;lastTime=0;calloutTimeout=0;flashTimeout=0;fpsFrames=0;fpsAccum=0;currentFps=60;bankedTakaInRun=0;isSubmittingScore=!1;scoreSubmittedForRun=!1;activeStartM=0;waitingForRebind=null;challenge=null;activeRoom=null;mpPlayerId=null;mpMode=!1;mpCountdownActive=!1;mpCountdownLastTick="";mpServerOffsetMs=0;mpRaceStartedAt=0;mpRaceRand=Math.random;mpPollTimer=0;mpSyncInFlight=!1;mpSyncAccum=0;mpRewardBanked=!1;reopenMpAfterGarage=!1;opponentInterp=new Fh;keys=new Set;touchSteer=0;touchBrake=!1;touchNitro=!1;dragPointerId=null;dragLastX=0;dragSteerVelocity=0;gamepad=new wh((e,t)=>{this.onGamepadConnectionChange(e,t)});lastGamepadState=null;stageEl=document.getElementById("game-stage");screenFlashEl=document.getElementById("screen-flash");floatingFxEl=document.getElementById("floating-fx");titleOverlay=document.getElementById("title-overlay");driveControls=document.getElementById("drive-controls");minimapWidget=document.getElementById("minimap-widget");minimapCanvas=document.getElementById("minimap-canvas");mmHealthFill=document.getElementById("mm-health-fill");mmNitroFill=document.getElementById("mm-nitro-fill");helperCallout=document.getElementById("helper-callout");helperCalloutText=document.getElementById("helper-callout-text");hudTaka=document.getElementById("hud-taka");hudScore=document.getElementById("hud-score");hudHealth=document.getElementById("hud-health");hudPax=document.getElementById("hud-pax");hudStopLabel=document.getElementById("hud-stop-label");hudKm=document.getElementById("hud-km");hudSpeed=document.getElementById("hud-speed");hudCombo=document.getElementById("hud-combo");hudWanted=document.getElementById("hud-wanted");hudFps=document.getElementById("hud-fps");hudGamepad=document.getElementById("hud-gamepad");gamepadStatusPill=document.getElementById("gamepad-status-pill");hudNitroFill=document.getElementById("hud-nitro-fill");hudMission=document.getElementById("hud-mission");hudChallenge=document.getElementById("hud-challenge");titleNameInput=document.getElementById("input-player-name-title");startHubSelect=document.getElementById("select-start-hub");gameoverNameInput=document.getElementById("input-player-name-gameover");submitStatusEl=document.getElementById("leaderboard-submit-status");submitBtn=document.getElementById("btn-submit-score");reviveBtn=document.getElementById("btn-revive-mistry");pauseDialog=document.getElementById("pause-dialog");garageDialog=document.getElementById("garage-dialog");gameoverDialog=document.getElementById("gameover-dialog");leaderboardDialog=document.getElementById("leaderboard-dialog");mpDialog=document.getElementById("multiplayer-dialog");raceResultDialog=document.getElementById("race-result-dialog");raceHudStrip=document.getElementById("race-hud-strip");raceProgressBar=document.getElementById("race-progress-bar");raceCountdownEl=document.getElementById("race-countdown");raceCountdownNumEl=document.getElementById("race-countdown-num");raceCountdownSubEl=document.getElementById("race-countdown-sub");racePodiumCanvas=document.getElementById("race-podium-canvas");scorecardCanvas=document.getElementById("scorecard-canvas");async init(){P_(),L_();const e=this.parseChallengeParams();this.world=new C_(this.stageEl),this.showroom=new D_(document.getElementById("showroom-stage")),this.applySavedVisualAudioSettings(),this.bdMap=new I_(document.getElementById("bd-map-mount"),t=>{this.mpMode||(this.activeStartM=t.startM,this.pauseDialog.close(),this.startNewRun(t.startM))}),this.createSimulationFromSave(0),this.populateHubSelector(),this.populateMultiplayerSelectors(),this.bindPauseTabs(),this.bindGarageControls(),this.bindMultiplayerControls(),this.bindControls(),this.setupLifecycleAndBackHandler(),this.syncNameInputs(),this.refreshTitleStats(),this.refreshHud(),await this.world.preloadModels(),this.world.setBusSkin(this.store.get().selectedSkin),this.world.sync(this.sim,.016),this.syncLiveChampionBillboard(),window.addEventListener("resize",()=>this.world.resize()),window.addEventListener("beforeunload",()=>{this.activeRoom&&this.mpPlayerId&&Oo(this.activeRoom.code,this.mpPlayerId)}),e&&this.openMultiplayerDialog("mptab-join",e),this.startLoop()}parseChallengeParams(){const e=new URLSearchParams(window.location.search),t=e.get("vs")?.trim(),n=Number(e.get("target")||0),i=e.get("stop")?.trim()||"";if(t&&Number.isFinite(n)&&n>0){this.challenge={challenger:t.slice(0,24),targetScore:Math.round(n),stopName:i,beaten:!1};const s=document.getElementById("title-challenge-banner");s.textContent=`⚔️ ${this.challenge.challenger} আপনাকে চ্যালেঞ্জ করেছে! টার্গেট: ${this.challenge.targetScore.toLocaleString()} pts`,s.classList.remove("hidden")}return(e.get("room")||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8)}async syncLiveChampionBillboard(){try{const e=await Uo();if(e.entries.length>0){const t=e.entries[0];this.world.updateChampionBillboard(t.name,t.score)}}catch{}}applySavedVisualAudioSettings(){const e=this.store.get();this.audio.setPreferences(e.soundEnabled,e.sfxVolume,e.engineVolume),this.world.applyGraphicsPreset(e.graphicsPreset),this.world.setCameraMode(e.cameraMode),this.hudFps.classList.toggle("hidden",!e.showFps)}createSimulationFromSave(e=0){const t=this.store.get(),n=At.find(i=>i.id===t.selectedSkin)??At[0];this.sim=new Hh(t.engineLevel,t.armorLevel,t.nitroLevel,n.bonusSpeed,n.bonusArmor),this.sim.reset(e),this.bankedTakaInRun=0,this.scoreSubmittedForRun=!1,this.challenge&&(this.challenge.beaten=!1),this.audio.setPreferences(t.soundEnabled,t.sfxVolume,t.engineVolume)}populateHubSelector(){const e=this.store.get().unlockedHubs;this.startHubSelect.innerHTML="";for(const t of yh){const n=document.createElement("option"),i=t.id==="thakurgaon"||e.includes(t.id);n.value=String(t.startM),n.disabled=!i,n.textContent=i?`শুরু: ${t.name.replace(" 🌉","").replace(" 🏖️","")}`:`🔒 ${t.name.replace(" 🌉","").replace(" 🏖️","")}`,this.startHubSelect.appendChild(n)}this.startHubSelect.value=String(this.activeStartM)}clearActiveInputs(){this.keys.clear(),this.touchSteer=0,this.touchBrake=!1,this.touchNitro=!1,this.dragPointerId=null,this.dragSteerVelocity=0}anyDialogOpen(){return this.pauseDialog.open||this.garageDialog.open||this.gameoverDialog.open||this.leaderboardDialog.open||this.mpDialog.open||this.raceResultDialog.open}isTypingInInput(){const e=document.activeElement;return e instanceof HTMLInputElement||e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement}syncNameInputs(){const e=this.store.get().playerName;this.titleNameInput.value!==e&&(this.titleNameInput.value=e),this.gameoverNameInput.value!==e&&(this.gameoverNameInput.value=e);const t=document.getElementById("mp-name-create"),n=document.getElementById("mp-name-join");t&&t.value!==e&&(t.value=e),n&&n.value!==e&&(n.value=e)}savePlayerName(e){const t=e.replace(/[\u0000-\u001F\u007F<>]/g,"").replace(/\s+/g," ").trim().slice(0,24);return this.store.update(n=>{n.playerName=t}),this.syncNameInputs(),t}startNewRun(e=0){this.titleNameInput.value.trim()&&this.savePlayerName(this.titleNameInput.value),this.activeStartM=e,this.audio.unlock(),this.audio.playHydraulicHorn(),this.clearActiveInputs(),this.world.resetEffects(),this.createSimulationFromSave(e),this.world.setBusSkin(this.store.get().selectedSkin),this.titleOverlay.classList.add("hidden"),this.driveControls.classList.remove("hidden"),this.minimapWidget.classList.remove("hidden"),this.isPlaying=!0;try{window.history.pushState({murirTinPlaying:!0},"")}catch{}this.showCallout(`ওস্তাদ ${this.sim.getCurrentStopName()} থেকে টান দেন! টোল জমাবেন!`),this.refreshHud()}openPauseMenu(e="tab-map"){this.gameoverDialog.open||(this.modalPaused=!0,this.clearActiveInputs(),this.syncPauseControlsFromSave(),this.selectPauseTab(e),this.bdMap.sync(this.sim,this.store.get().unlockedHubs),this.pauseDialog.open||this.pauseDialog.showModal())}selectPauseTab(e){const t=Array.from(this.pauseDialog.querySelectorAll('[role="tab"]')),n=Array.from(this.pauseDialog.querySelectorAll('[role="tabpanel"]'));for(const i of t){const s=i.id===e;i.setAttribute("aria-selected",String(s)),s&&i.scrollIntoView({block:"nearest",inline:"nearest"})}for(const i of n){const s=i.getAttribute("aria-labelledby")===e;i.hidden=!s}e==="tab-map"&&this.bdMap.sync(this.sim,this.store.get().unlockedHubs)}bindPauseTabs(){const e=Array.from(this.pauseDialog.querySelectorAll('[role="tab"]'));for(const t of e)t.addEventListener("click",()=>{this.selectPauseTab(t.id)}),t.addEventListener("keydown",n=>{const i=e.indexOf(t);if(n.key==="ArrowRight"){const s=e[(i+1)%e.length];s.focus(),this.selectPauseTab(s.id)}else if(n.key==="ArrowLeft"){const s=e[(i-1+e.length)%e.length];s.focus(),this.selectPauseTab(s.id)}})}syncPauseControlsFromSave(){const e=this.store.get();document.getElementById("toggle-sfx").checked=e.soundEnabled,document.getElementById("range-sfx-vol").value=String(Math.round(e.sfxVolume*100)),document.getElementById("range-engine-vol").value=String(Math.round(e.engineVolume*100)),document.getElementById("range-steer-sens").value=String(Math.round(e.steerSensitivity*100)),document.getElementById("select-camera-mode").value=e.cameraMode,document.getElementById("select-graphics").value=e.graphicsPreset,document.getElementById("toggle-fps").checked=e.showFps,document.getElementById("toggle-gamepad-vib").checked=e.gamepadVibration,this.renderKeymapList()}renderKeymapList(){const e=this.store.get().keymap,t=document.getElementById("keymap-list");t.innerHTML="",Object.keys(mc).forEach(n=>{const i=document.createElement("div");i.className="keymap-row";const s=document.createElement("span");s.textContent=mc[n];const a=document.createElement("button");a.type="button",a.className=this.waitingForRebind===n?"btn-primary":"btn-outline",a.textContent=this.waitingForRebind===n?"চাপুন...":e[n],a.addEventListener("click",()=>{this.waitingForRebind=n,this.renderKeymapList()}),i.append(s,a),t.appendChild(i)})}setupLifecycleAndBackHandler(){const e=t=>{this.isPaused=t,t?(this.clearActiveInputs(),this.audio.pauseAll()):(this.lastTime=performance.now(),this.audio.resumeAll())};"contentVisibility"in document.documentElement.style?this.stageEl.addEventListener("contentvisibilityautostatechange",t=>{e(t.skipped)}):"IntersectionObserver"in window&&new IntersectionObserver(n=>{for(const i of n)e(!i.isIntersecting)},{rootMargin:"200px"}).observe(this.stageEl),document.addEventListener("visibilitychange",()=>e(document.hidden)),window.addEventListener("blur",()=>this.clearActiveInputs()),window.addEventListener("popstate",()=>{if(this.isPlaying&&!this.sim.crashed&&!this.pauseDialog.open){this.openPauseMenu("tab-map");try{window.history.pushState({murirTinPlaying:!0},"")}catch{}}})}bindControls(){const e=document.getElementById("btn-mode-solo"),t=document.getElementById("btn-mode-multiplayer");e.addEventListener("click",()=>{e.classList.add("is-selected"),t.classList.remove("is-selected"),document.getElementById("btn-start-drive")?.focus()}),t.addEventListener("click",()=>{this.titleNameInput.value.trim()&&this.savePlayerName(this.titleNameInput.value),this.openMultiplayerDialog((this.activeRoom,"mptab-create"))}),document.getElementById("btn-start-drive").addEventListener("click",()=>{const l=Number(this.startHubSelect.value)||0;this.startNewRun(l)}),this.titleNameInput.addEventListener("change",()=>{this.savePlayerName(this.titleNameInput.value)}),document.getElementById("btn-open-pause-title").addEventListener("click",()=>{this.openPauseMenu("tab-map")}),document.getElementById("btn-pause").addEventListener("click",()=>{this.openPauseMenu("tab-map")}),this.minimapWidget.addEventListener("click",()=>{this.openPauseMenu("tab-map")});const n=()=>{this.modalPaused=!0,this.clearActiveInputs();const l=At.findIndex(c=>c.id===this.store.get().selectedSkin);this.showroomIndex=l>=0?l:0,this.selectGarageTab("gtab-showroom"),this.renderGarage(),this.garageDialog.showModal(),this.showroom.start()};document.getElementById("btn-open-garage-title").addEventListener("click",n),document.getElementById("btn-garage").addEventListener("click",n);const i=()=>{this.modalPaused=!0,this.clearActiveInputs(),this.leaderboardDialog.showModal(),this.loadAndRenderLeaderboard()};document.getElementById("btn-leaderboard").addEventListener("click",i),document.getElementById("btn-open-leaderboard-title").addEventListener("click",i),document.getElementById("btn-open-lb-gameover").addEventListener("click",()=>{this.leaderboardDialog.showModal(),this.loadAndRenderLeaderboard()}),document.getElementById("btn-refresh-lb").addEventListener("click",()=>{this.loadAndRenderLeaderboard()}),document.getElementById("btn-pause-resume").addEventListener("click",()=>{this.pauseDialog.close()}),document.getElementById("btn-pause-restart").addEventListener("click",()=>{if(this.pauseDialog.close(),this.mpMode){this.exitMultiplayerCleanly();return}this.startNewRun(this.activeStartM)}),document.getElementById("btn-pause-home").addEventListener("click",()=>{if(this.pauseDialog.close(),this.mpMode){this.exitMultiplayerCleanly();return}this.isPlaying=!1,this.clearActiveInputs(),this.driveControls.classList.add("hidden"),this.minimapWidget.classList.add("hidden"),this.titleOverlay.classList.remove("hidden"),this.populateHubSelector()});const s=()=>{this.waitingForRebind=null,this.modalPaused=this.anyDialogOpen(),!this.isPlaying&&!this.mpCountdownActive&&(this.createSimulationFromSave(this.activeStartM),this.refreshHud()),this.lastTime=performance.now()};this.pauseDialog.addEventListener("close",s),this.garageDialog.addEventListener("close",()=>{if(this.showroom.stop(),this.reopenMpAfterGarage&&this.activeRoom&&this.mpPlayerId){this.reopenMpAfterGarage=!1;const l=this.activeRoom.players.find(c=>c.id===this.mpPlayerId);Bo(this.activeRoom.code,this.mpPlayerId,l?.ready??!1,this.store.get().selectedSkin).then(c=>{this.activeRoom=c.room,this.renderLobbyRoom()}).catch(()=>{}),this.mpDialog.showModal()}s()}),this.leaderboardDialog.addEventListener("close",s),this.mpDialog.addEventListener("close",()=>{!this.mpCountdownActive&&!this.mpMode&&this.stopMpPolling(),s()}),this.raceResultDialog.addEventListener("close",s),window.addEventListener("keydown",l=>{if(this.waitingForRebind){l.preventDefault();const h=this.waitingForRebind;this.waitingForRebind=null,this.store.update(d=>{d.keymap[h]=l.code}),this.renderKeymapList();return}if(this.isTypingInInput())return;const c=this.store.get().keymap;if(l.code===c.pause||l.code==="Escape"){if(this.pauseDialog.open){this.pauseDialog.close();return}if(!this.anyDialogOpen()&&this.isPlaying&&!this.sim.crashed){l.preventDefault(),this.openPauseMenu("tab-map");return}}if(l.code===c.map&&!this.anyDialogOpen()){l.preventDefault(),this.openPauseMenu("tab-map");return}this.anyDialogOpen()||(this.keys.add(l.code),l.code===c.horn&&this.isPlaying&&!this.sim.crashed&&(l.preventDefault(),this.triggerHorn()))}),window.addEventListener("keyup",l=>{this.keys.delete(l.code)});const a=(l,c,h)=>{const d=document.getElementById(l);d.addEventListener("pointerdown",u=>{u.preventDefault(),this.audio.unlock(),c()}),d.addEventListener("pointerup",h),d.addEventListener("pointercancel",h),d.addEventListener("pointerleave",h)};a("btn-left",()=>this.touchSteer=-1,()=>{this.touchSteer===-1&&(this.touchSteer=0)}),a("btn-right",()=>this.touchSteer=1,()=>{this.touchSteer===1&&(this.touchSteer=0)}),a("btn-brake",()=>this.touchBrake=!0,()=>this.touchBrake=!1),a("btn-nitro",()=>this.touchNitro=!0,()=>this.touchNitro=!1),document.getElementById("btn-horn").addEventListener("click",()=>this.triggerHorn()),this.stageEl.addEventListener("pointerdown",l=>{!this.isPlaying||this.sim.crashed||this.anyDialogOpen()||(this.audio.unlock(),this.dragPointerId=l.pointerId,this.dragLastX=l.clientX)}),this.stageEl.addEventListener("pointermove",l=>{if(this.dragPointerId!==l.pointerId||!this.isPlaying)return;const c=l.clientX-this.dragLastX;this.dragLastX=l.clientX,this.dragSteerVelocity=Math.max(-1,Math.min(1,this.dragSteerVelocity+c*.045))});const o=l=>{this.dragPointerId===l.pointerId&&(this.dragPointerId=null)};this.stageEl.addEventListener("pointerup",o),this.stageEl.addEventListener("pointercancel",o),document.getElementById("toggle-sfx").addEventListener("change",l=>{const c=l.target.checked;this.store.update(h=>{h.soundEnabled=c}),this.applySavedVisualAudioSettings()}),document.getElementById("range-sfx-vol").addEventListener("input",l=>{const c=Number(l.target.value)/100;this.store.update(h=>{h.sfxVolume=c}),this.applySavedVisualAudioSettings()}),document.getElementById("range-engine-vol").addEventListener("input",l=>{const c=Number(l.target.value)/100;this.store.update(h=>{h.engineVolume=c}),this.applySavedVisualAudioSettings()}),document.getElementById("range-steer-sens").addEventListener("input",l=>{const c=Number(l.target.value)/100;this.store.update(h=>{h.steerSensitivity=c})}),document.getElementById("select-camera-mode").addEventListener("change",l=>{const c=l.target.value;this.store.update(h=>{h.cameraMode=c}),this.applySavedVisualAudioSettings()}),document.getElementById("select-graphics").addEventListener("change",l=>{const c=l.target.value;this.store.update(h=>{h.graphicsPreset=c}),this.applySavedVisualAudioSettings()}),document.getElementById("toggle-fps").addEventListener("change",l=>{const c=l.target.checked;this.store.update(h=>{h.showFps=c}),this.applySavedVisualAudioSettings()}),document.getElementById("toggle-gamepad-vib").addEventListener("change",l=>{const c=l.target.checked;this.store.update(h=>{h.gamepadVibration=c}),c&&this.gamepad.rumble("horn",!0)}),document.getElementById("btn-reset-keymap").addEventListener("click",()=>{this.waitingForRebind=null,this.store.update(l=>{l.keymap=vc()}),this.renderKeymapList()}),document.getElementById("btn-reset-save").addEventListener("click",()=>{const l=this.store.reset();this.syncNameInputs(),this.applySavedVisualAudioSettings(),this.populateHubSelector(),this.world.setBusSkin(l.selectedSkin),this.world.resetEffects(),this.createSimulationFromSave(0),this.refreshTitleStats(),this.refreshHud(),this.pauseDialog.close()}),document.getElementById("btn-retry-now").addEventListener("click",()=>{this.gameoverDialog.close(),this.startNewRun(this.activeStartM)}),this.reviveBtn.addEventListener("click",()=>{this.sim.revive()&&(this.gameoverDialog.close(),this.clearActiveInputs(),this.isPlaying=!0,this.audio.playWrenchRepair(),this.showCallout("ধোলাইখাল মিস্ত্রি ঠিক করে দিছে! আবার চালান!"))}),document.getElementById("leaderboard-submit-form").addEventListener("submit",l=>{l.preventDefault(),this.submitCurrentScore(!1)}),document.getElementById("btn-download-card").addEventListener("click",()=>{const l=document.createElement("a");l.download=`murir-tin-score-${this.sim.score}.png`,l.href=this.scorecardCanvas.toDataURL("image/png"),l.click(),document.getElementById("share-feedback").textContent="মিম কার্ড ডাউনলোড হয়েছে!"}),document.getElementById("btn-copy-flex").addEventListener("click",async()=>{const l=this.store.get().playerName||"ওস্তাদ",c=this.sim.getCurrentStopName(),h=`https://murirtin-express.vercel.app/?vs=${encodeURIComponent(l)}&target=${this.sim.score}&stop=${encodeURIComponent(c)}`,d=`🚌 ${l} তোমাকে চ্যালেঞ্জ করেছে! মুড়ির টিন 3D-তে স্কোর ${this.sim.score} (${c}, ${this.sim.bridgesCrossed} সেতু পার)!
সাহস থাকলে এই লিংকে ঢুকে রেকর্ড ভাঙো 👉 ${h}`;try{await navigator.clipboard.writeText(d),document.getElementById("share-feedback").textContent="⚔️ বন্ধু চ্যালেঞ্জ লিংক কপি হয়েছে!"}catch{document.getElementById("share-feedback").textContent=h}})}onGamepadConnectionChange(e,t){this.hudGamepad.classList.toggle("hidden",!e),e?(this.hudGamepad.title=`${t} যুক্ত`,this.gamepadStatusPill.textContent=`🟢 ${t} যুক্ত`,this.gamepadStatusPill.classList.add("is-connected"),this.showCallout(`🎮 ${t} কানেক্ট হয়েছে! টান দেন ওস্তাদ!`),this.gamepad.rumble("horn",this.store.get().gamepadVibration)):(this.gamepadStatusPill.textContent="⚪ যুক্ত নেই — যেকোনো বাটন চাপুন",this.gamepadStatusPill.classList.remove("is-connected"),this.showCallout("🎮 কন্ট্রোলার ডিসকানেক্ট হয়েছে"))}cycleCameraMode(){const e=["chase","close","wide"],t={chase:"ক্লাসিক চেজ",close:"ক্লোজ অ্যাকশন",wide:"ওয়াইড হাইওয়ে"},n=this.store.get().cameraMode,i=e[(e.indexOf(n)+1)%e.length];this.store.update(s=>{s.cameraMode=i}),this.applySavedVisualAudioSettings(),this.showCallout(`📷 ক্যামেরা: ${t[i]}`)}handleGamepadEdgeActions(e){if(!(!e.connected||this.isTypingInInput())){if(this.gameoverDialog.open){e.confirmPressed&&document.getElementById("btn-retry-now")?.click();return}if(this.pauseDialog.open){e.pausePressed||e.cancelPressed?this.pauseDialog.close():e.mapPressed&&this.selectPauseTab("tab-map");return}if(this.garageDialog.open||this.leaderboardDialog.open||this.mpDialog.open){e.cancelPressed&&(this.garageDialog.open?this.garageDialog.close():this.leaderboardDialog.open?this.leaderboardDialog.close():this.mpDialog.open&&this.mpDialog.close());return}if(!this.isPlaying&&!this.mpCountdownActive&&!this.titleOverlay.classList.contains("hidden")){e.confirmPressed?document.getElementById("btn-start-drive")?.click():e.mapPressed&&this.openPauseMenu("tab-map");return}this.isPlaying&&!this.sim.crashed&&!this.modalPaused&&(e.hornPressed&&this.triggerHorn(),e.cameraPressed&&this.cycleCameraMode(),(e.pausePressed||e.mapPressed)&&this.openPauseMenu("tab-map"))}}triggerHorn(){this.audio.playHydraulicHorn(),this.gamepad.rumble("horn",this.store.get().gamepadVibration);const e=this.sim.blastHorn();for(const t of e)this.showCallout(t.callout),this.spawnFloatPop("+৳35 সাইড!","pop-green")}readInput(e){const t=this.store.get().keymap,n=this.lastGamepadState;let i=this.touchSteer;n?.connected&&Math.abs(n.steer)>.01&&i===0&&(i=n.steer),Math.abs(this.dragSteerVelocity)>.01&&(i=this.dragSteerVelocity,this.dragSteerVelocity*=Math.pow(.004,e)),(this.keys.has("ArrowLeft")||this.keys.has(t.left))&&(i=-1),(this.keys.has("ArrowRight")||this.keys.has(t.right))&&(i=1);const s=this.keys.has("ArrowUp")||this.keys.has(t.accelerate)||!!n?.accelerate,a=this.touchBrake||this.keys.has("ArrowDown")||this.keys.has(t.brake)||!!n?.brake,o=this.touchNitro||this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")||this.keys.has(t.nitro)||!!n?.nitro;return{steer:i,accelerate:s,brake:a,nitro:o}}startLoop(){this.lastTime=performance.now();const e=t=>{if(requestAnimationFrame(e),this.isPaused)return;const n=this.gamepad.poll();this.lastGamepadState=n,this.handleGamepadEdgeActions(n);const i=Math.min(.05,Math.max(.001,(t-this.lastTime)/1e3));if(this.lastTime=t,this.fpsFrames++,this.fpsAccum+=i,this.fpsAccum>=.4&&(this.currentFps=Math.round(this.fpsFrames/this.fpsAccum),this.fpsFrames=0,this.fpsAccum=0,this.store.get().showFps&&(this.hudFps.textContent=`${this.currentFps} FPS`)),this.mpCountdownActive){this.updateMpCountdown(t),this.world.sync(this.sim,i);return}if(this.isPlaying&&!this.sim.crashed&&!this.modalPaused){const s=this.readInput(i),a=this.mpMode?this.mpRaceRand:Math.random,o=this.sim.step(i,s,a,this.store.get().steerSensitivity);this.audio.updateEngineRumble(this.sim.speed,!0,this.sim.nitroActive);for(const h of o)this.handleSimEvent(h);!this.mpMode&&this.challenge&&!this.challenge.beaten&&this.sim.score>this.challenge.targetScore&&(this.challenge.beaten=!0,this.audio.playMilestoneFanfare(),this.triggerFlash("flash-fever"),this.showCallout(`👑 ${this.challenge.challenger}-এর ${this.challenge.targetScore} রেকর্ড ভেঙে দিয়েছেন!`),this.spawnFloatPop("⚔️ RECORD BROKEN!","pop-gold"));let l=[],c=null;if(this.mpMode&&this.activeRoom&&this.mpPlayerId){const h=this.opponentInterp.sample(i,t);this.world.syncRemoteRacers(this.sim,h,this.activeRoom.route.finishM),l=h.map(d=>({x:d.x,z:this.sim.distanceM-d.distanceM,color:d.color})),c=this.sim.distanceM-this.activeRoom.route.finishM,this.refreshRaceHud(h),this.mpSyncAccum+=i,this.mpSyncAccum>=.25&&!this.mpSyncInFlight&&(this.mpSyncAccum=0,this.pushRaceSync(!1))}this.refreshHud(),N_(this.minimapCanvas,this.sim,t,l,c)}else if(this.audio.updateEngineRumble(0,!1,!1),this.mpMode&&this.activeRoom&&this.mpPlayerId){const s=this.opponentInterp.sample(i,t);this.world.syncRemoteRacers(this.sim,s,this.activeRoom.route.finishM)}this.world.sync(this.sim,i)};requestAnimationFrame(e)}spawnFloatPop(e,t="pop-gold"){this.floatingFxEl.childElementCount>6&&this.floatingFxEl.firstElementChild?.remove();const n=document.createElement("div");n.className=`float-pop ${t}`,n.textContent=e,this.floatingFxEl.appendChild(n),window.setTimeout(()=>n.remove(),1100)}triggerFlash(e){this.screenFlashEl.className=`screen-flash ${e}`,window.clearTimeout(this.flashTimeout),this.flashTimeout=window.setTimeout(()=>{this.screenFlashEl.className="screen-flash"},240)}handleSimEvent(e){this.showCallout(e.callout);const t=this.store.get().gamepadVibration;e.type==="chapani"||e.type==="tesla_dodge"||e.type==="pit_smash"?(this.audio.playChapaniSparks(this.sim.chapaniCombo),this.gamepad.rumble("chapani",t),this.world.triggerSparkBurst(e.x??this.sim.playerX,e.z??0,"#ffbe0b"),this.spawnFloatPop(`+৳${e.takaDelta}`,"pop-gold")):e.type==="fever_mode"||e.type==="mission_complete"||e.type==="wanted_cleared"||e.type==="route_complete"?(this.audio.playMilestoneFanfare(),this.gamepad.rumble("bridge",t),this.triggerFlash("flash-fever"),this.spawnFloatPop(e.type==="mission_complete"?"🎯 মিশন ডান!":"🔥 বোনাস!","pop-gold")):e.type==="passenger_pickup"||e.type==="rival_win"?(this.audio.playHelperDoorSlap(),e.takaDelta>0&&this.spawnFloatPop(`+৳${e.takaDelta}`,"pop-green")):e.type==="wrench_heal"?(this.audio.playWrenchRepair(),this.spawnFloatPop("+১ ⚙️ লাইফ!","pop-green")):e.type==="toll_paid"?(this.audio.playTollPaid(),this.spawnFloatPop("🌉 টোল ক্লিয়ার!","pop-green")):e.type==="toll_smash"?(this.audio.playBarrierSmash(),this.audio.playPoliceSiren(),this.gamepad.rumble("crash",t),this.world.triggerSparkBurst(this.sim.playerX,0,"#00f5d4"),this.world.triggerMinorShake(),this.spawnFloatPop("🔥 ব্যারিকেড উড়াল!","pop-gold")):e.type==="wanted_up"?this.audio.playPoliceSiren():e.type==="train_passing"?this.audio.playTrainHorn():e.type==="hub_unlocked"&&e.hubId?(this.store.update(n=>{n.unlockedHubs.includes(e.hubId)||n.unlockedHubs.push(e.hubId)}),this.populateHubSelector(),this.audio.playMilestoneFanfare()):e.type==="bridge_complete"?(this.audio.playMilestoneFanfare(),this.gamepad.rumble("bridge",t),this.triggerFlash("flash-fever"),this.spawnFloatPop("🌉 সেতু পার +৳300!","pop-green")):e.type==="toll_fine"||e.type==="crash"?(this.audio.playCrash(),this.gamepad.rumble("crash",t),this.triggerFlash("flash-crash"),this.world.triggerMinorShake(),this.world.triggerSparkBurst(this.sim.playerX,0,"#ef476f"),this.spawnFloatPop("💥 -১ লাইফ","pop-crimson")):e.type==="race_finish"?(this.audio.playMilestoneFanfare(),this.gamepad.rumble("bridge",t),this.triggerFlash("flash-fever"),this.spawnFloatPop("🏁 FINISH!","pop-gold"),this.onLocalRaceFinished()):e.type==="gameover"&&(this.audio.playCrash(),this.gamepad.rumble("crash",t),this.triggerFlash("flash-crash"),this.world.triggerCrashBurst(),this.onGameOver())}onGameOver(){this.isPlaying=!1,this.clearActiveInputs();const e=Math.max(0,this.sim.takaEarned-this.bankedTakaInRun);this.bankedTakaInRun+=e,this.store.update(n=>{n.taka+=e,n.bestScore=Math.max(n.bestScore,this.sim.score),n.bestDistanceM=Math.max(n.bestDistanceM,Math.floor(this.sim.distanceM))}),this.refreshTitleStats(),this.refreshHud();const t=this.store.get().playerName;this.gameoverNameInput.value=t,this.reviveBtn.disabled=this.sim.revivesUsed>=1,this.reviveBtn.textContent=this.sim.revivesUsed>=1?"🔧 ফ্রি রিভাইভ ব্যবহার হয়েছে":"🔧 ধোলাইখাল ফ্রি রিভাইভ (Keep Score!)",pc(this.scorecardCanvas,{playerName:t,score:this.sim.score,distanceM:this.sim.distanceM,takaEarned:this.sim.takaEarned,plasticScrapes:this.sim.plasticScrapes,teslaDodges:this.sim.teslaDodges,passengers:this.sim.passengers,stopName:this.sim.getCurrentStopName(),padmaCrossings:this.sim.bridgesCrossed,totalTollPaid:this.sim.totalTollPaid}),document.getElementById("share-feedback").textContent="",t&&!this.scoreSubmittedForRun?(this.submitStatusEl.textContent="লাইভ পয়েন্ট টেবিলে স্কোর সেভ হচ্ছে...",this.submitCurrentScore(!0)):(this.submitStatusEl.textContent="নাম লিখে 💾 সেভ চাপলেই বিশ্ব লাইভ টেবিলে উঠবে!",this.submitBtn.disabled=!1),window.setTimeout(()=>{this.gameoverDialog.open||this.gameoverDialog.showModal()},480)}async submitCurrentScore(e){if(this.isSubmittingScore)return;const t=this.gameoverNameInput.value,n=this.savePlayerName(t);if(!n){e||(this.submitStatusEl.textContent="দয়া করে আপনার নাম লিখুন!",this.gameoverNameInput.focus());return}this.isSubmittingScore=!0,this.submitBtn.disabled=!0,this.submitStatusEl.textContent="সেভ হচ্ছে...",pc(this.scorecardCanvas,{playerName:n,score:this.sim.score,distanceM:this.sim.distanceM,takaEarned:this.sim.takaEarned,plasticScrapes:this.sim.plasticScrapes,teslaDodges:this.sim.teslaDodges,passengers:this.sim.passengers,stopName:this.sim.getCurrentStopName(),padmaCrossings:this.sim.bridgesCrossed,totalTollPaid:this.sim.totalTollPaid});try{const i=await Rh({name:n,score:this.sim.score,distanceM:Math.floor(this.sim.distanceM),stopName:this.sim.getCurrentStopName(),padmaCrossings:this.sim.bridgesCrossed});this.scoreSubmittedForRun=!0;const s=i.rank?`#${i.rank}`:"টপ ৫০";this.submitStatusEl.textContent=i.isNewBest?`✅ লাইভ টেবিলে সেভ হয়েছে! আপনার র‍্যাংক: ${s} 🎉`:`✅ র‍্যাংক ${s} (আপনার আগের বেস্ট স্কোর আরও বেশি!)`,i.entries.length>0&&this.world.updateChampionBillboard(i.entries[0].name,i.entries[0].score)}catch(i){this.submitStatusEl.textContent=i instanceof Error?`⚠️ সেভ ব্যর্থ: ${i.message}`:"⚠️ নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন"}finally{this.isSubmittingScore=!1,this.submitBtn.disabled=!1}}async loadAndRenderLeaderboard(){const e=document.getElementById("lb-meta"),t=document.getElementById("lb-tbody"),n=document.getElementById("lb-json-link");e.textContent="লাইভ ডাটা আনা হচ্ছে...",t.innerHTML="";try{const i=await Uo(),s=this.store.get().playerName.trim().toLowerCase();if(e.textContent=`মোট ${i.entries.length} জন ওস্তাদ • আপডেট: ${new Date(i.updatedAt).toLocaleTimeString("bn-BD")}`,i.jsonUrl?(n.href=i.jsonUrl,n.classList.remove("hidden")):n.classList.add("hidden"),i.entries.length>0&&this.world.updateChampionBillboard(i.entries[0].name,i.entries[0].score),i.entries.length===0){const a=document.createElement("tr"),o=document.createElement("td");o.colSpan=5,o.textContent="এখনো কেউ স্কোর সেভ করেনি — আপনিই প্রথম ওস্তাদ হোন!",a.appendChild(o),t.appendChild(a);return}i.entries.forEach((a,o)=>{const l=document.createElement("tr");s&&a.name.toLowerCase()===s&&l.classList.add("is-self");const c=document.createElement("td");c.textContent=o===0?"🥇 #1":o===1?"🥈 #2":o===2?"🥉 #3":`#${o+1}`;const h=document.createElement("th");h.scope="row",h.textContent=a.name;const d=document.createElement("td");d.className="lb-score-cell",d.textContent=`${a.score.toLocaleString()} pts`;const u=document.createElement("td");u.textContent=`${a.stopName} (${ri(a.distanceM)} km)`;const p=document.createElement("td");p.textContent=a.padmaCrossings>0?`🌉 ${a.padmaCrossings} টি`:"—",l.append(c,h,d,u,p),t.appendChild(l)})}catch{e.textContent="লাইভ পয়েন্ট টেবিল লোড করা যায়নি।"}}showCallout(e){this.helperCalloutText.textContent=e,this.helperCallout.classList.remove("hidden"),window.clearTimeout(this.calloutTimeout),this.calloutTimeout=window.setTimeout(()=>{this.helperCallout.classList.add("hidden")},2400)}selectGarageTab(e){const t=Array.from(this.garageDialog.querySelectorAll('[role="tab"]')),n=Array.from(this.garageDialog.querySelectorAll('[role="tabpanel"]'));for(const i of t)i.setAttribute("aria-selected",String(i.id===e));for(const i of n)i.hidden=i.getAttribute("aria-labelledby")!==e;e==="gtab-showroom"&&this.showroom.resize()}bindGarageControls(){document.getElementById("gtab-showroom").addEventListener("click",()=>{this.selectGarageTab("gtab-showroom")}),document.getElementById("gtab-upgrades").addEventListener("click",()=>{this.selectGarageTab("gtab-upgrades")}),document.getElementById("btn-bus-prev").addEventListener("click",()=>{this.showroomIndex=(this.showroomIndex-1+At.length)%At.length,this.renderShowroomBus()}),document.getElementById("btn-bus-next").addEventListener("click",()=>{this.showroomIndex=(this.showroomIndex+1)%At.length,this.renderShowroomBus()}),document.getElementById("btn-bus-action").addEventListener("click",()=>{const e=At[this.showroomIndex],t=this.store.get(),n=t.unlockedSkins.includes(e.id);if(t.selectedSkin!==e.id){if(n)this.audio.playHelperDoorSlap(),this.store.update(i=>{i.selectedSkin=e.id});else{if(t.taka<e.cost)return;this.audio.playHydraulicHorn(),this.store.update(i=>{i.taka-=e.cost,i.unlockedSkins.push(e.id),i.selectedSkin=e.id})}this.world.setBusSkin(e.id),this.refreshTitleStats(),this.refreshHud(),this.renderGarage()}})}renderShowroomBus(){const e=this.store.get(),t=At[this.showroomIndex]??At[0],n=e.unlockedSkins.includes(t.id),i=e.selectedSkin===t.id;document.getElementById("showroom-bus-name").textContent=t.name,document.getElementById("showroom-bus-route").textContent=t.routeBadge,document.getElementById("showroom-bus-tagline").textContent=t.tagline;const s=[["⚡ টপ স্পিড",t.stats.speed],["🛡️ বাম্পার হেলথ",t.stats.armor],["🔥 নাইট্রো পাওয়ার",t.stats.nitro],["👥 যাত্রী ক্ষমতা",t.stats.capacity]],a=document.getElementById("showroom-stats");a.innerHTML=s.map(([c,h])=>`
        <div class="stat-bar-row">
          <span>${c} (${h}%)</span>
          <div class="stat-bar-track"><span class="stat-bar-fill" style="width:${h}%"></span></div>
        </div>
      `).join("");const o=document.getElementById("btn-bus-action");i?(o.className="btn-secondary",o.textContent="সিলেক্টেড ✓",o.disabled=!0):n?(o.className="btn-outline",o.textContent="সিলেক্ট করুন",o.disabled=!1):(o.className="btn-primary",o.textContent=`কিনুন ৳ ${t.cost}`,o.disabled=e.taka<t.cost);const l=document.getElementById("showroom-dots");l.innerHTML="",At.forEach((c,h)=>{const d=document.createElement("button");d.type="button",d.className=`showroom-dot ${h===this.showroomIndex?"active":""}`,d.setAttribute("aria-label",c.name),d.addEventListener("click",()=>{this.showroomIndex=h,this.renderShowroomBus()}),l.appendChild(d)}),this.showroom.showBus(this.world.buildBusPreviewClone(t.id))}renderGarage(){const e=this.store.get();document.getElementById("garage-taka").textContent=`৳ ${e.taka}`,this.renderShowroomBus();const t=document.getElementById("upgrade-list");t.innerHTML="";for(const n of Mh){const i=n.id==="engine"?e.engineLevel:n.id==="armor"?e.armorLevel:e.nitroLevel,s=i>=n.maxLevel,a=Sh(n,i),o=document.createElement("div");o.className="garage-card",o.innerHTML=`
        <strong>${n.emoji} ${n.name} (Lv ${i}/${n.maxLevel})</strong>
        <p>${n.description}</p>
      `;const l=document.createElement("button");l.type="button",l.className=s?"btn-outline":"btn-primary",l.textContent=s?"ম্যাক্সড ✓":`আপগ্রেড ৳ ${a}`,l.disabled=s||e.taka<a,l.addEventListener("click",()=>{s||this.store.get().taka<a||(this.audio.playHelperDoorSlap(),this.store.update(c=>{c.taka-=a,n.id==="engine"?c.engineLevel++:n.id==="armor"?c.armorLevel++:c.nitroLevel++}),this.refreshTitleStats(),this.refreshHud(),this.renderGarage())}),o.appendChild(l),t.appendChild(o)}}refreshTitleStats(){const e=this.store.get();document.getElementById("title-best-score").textContent=String(e.bestScore),document.getElementById("title-total-taka").textContent=`৳ ${e.taka}`}refreshHud(){const e=Math.max(0,this.sim.takaEarned-this.bankedTakaInRun),t=this.store.get().taka+(this.isPlaying?e:0);this.hudTaka.textContent=String(t),this.hudScore.textContent=String(this.sim.score),this.hudPax.textContent=String(this.sim.passengers);const n=Math.max(0,this.sim.health);this.hudHealth.innerHTML=n>0?F_.repeat(n):"💥",this.hudStopLabel.textContent=`📍 ${this.sim.getCurrentStopName()} ➔ ${this.sim.getNextStopName()}`,this.hudKm.textContent=`${ri(this.sim.distanceM)} / 840 km`,this.hudSpeed.textContent=`${this.sim.speedKmh} km/h`,this.sim.chapaniCombo>=2?(this.hudCombo.textContent=this.sim.feverActive?`🔥 FEVER x${this.sim.chapaniCombo}`:`⚡ x${this.sim.chapaniCombo}`,this.hudCombo.classList.remove("hidden")):this.hudCombo.classList.add("hidden"),this.sim.wantedLevel>0?(this.hudWanted.textContent="⭐".repeat(this.sim.wantedLevel),this.hudWanted.classList.remove("hidden")):this.hudWanted.classList.add("hidden");const i=`${Math.round(this.sim.nitroCharge)}%`;if(this.hudNitroFill.style.width=i,this.mmNitroFill.style.width=i,this.mmHealthFill.style.width=`${Math.round(n/Math.max(1,this.sim.maxHealth)*100)}%`,this.isPlaying&&!this.mpMode){const s=this.sim.activeMission;this.hudMission.textContent=`🎯 ${s.title} (${s.progress}/${s.target})`,this.hudMission.classList.remove("hidden"),this.challenge&&(this.hudChallenge.textContent=this.challenge.beaten?`👑 ${this.challenge.challenger}-কে হারিয়েছেন!`:`⚔️ vs ${this.challenge.challenger}: ${this.sim.score}/${this.challenge.targetScore}`,this.hudChallenge.classList.remove("hidden"))}else this.hudMission.classList.add("hidden"),this.hudChallenge.classList.add("hidden")}populateMultiplayerSelectors(){const e=document.getElementById("mp-route-select"),t=document.getElementById("mp-lobby-route-select"),n=document.getElementById("mp-custom-start"),i=document.getElementById("mp-custom-end");e.innerHTML="",t.innerHTML="";for(const s of ji){const a=new Option(`${s.label}`,s.id),o=new Option(`${s.label}`,s.id);e.add(a),t.add(o)}e.add(new Option("🛠️ কাস্টম রুট তৈরি করুন","custom")),n.innerHTML="",i.innerHTML="";for(const s of mt){const a=s.name.replace(" 🌉","").replace(" 🏖️","");n.add(new Option(a,s.id)),i.add(new Option(a,s.id))}n.value="bogura",i.value="sirajganj"}readSelectedCreateRoute(){const e=document.getElementById("mp-route-select");if(e.value==="custom"){const t=document.getElementById("mp-custom-start").value,n=document.getElementById("mp-custom-end").value,i=ko(t,n);if(i)return i}return ji.find(t=>t.id===e.value)??ji[0]}selectMpTab(e){const t=Array.from(document.querySelectorAll('#mp-setup-view [role="tab"]')),n=Array.from(document.querySelectorAll('#mp-setup-view [role="tabpanel"]'));for(const i of t)i.setAttribute("aria-selected",String(i.id===e));for(const i of n)i.hidden=i.getAttribute("aria-labelledby")!==e}openMultiplayerDialog(e="mptab-create",t=""){this.modalPaused=!0,this.clearActiveInputs(),this.syncNameInputs(),document.getElementById("mp-setup-error").textContent="";const n=document.getElementById("mp-setup-view"),i=document.getElementById("mp-lobby-view");this.activeRoom&&this.mpPlayerId&&this.activeRoom.status==="lobby"?(n.classList.add("hidden"),i.classList.remove("hidden"),this.renderLobbyRoom(),this.startMpLobbyPolling()):(n.classList.remove("hidden"),i.classList.add("hidden"),this.selectMpTab(e),t&&(document.getElementById("mp-join-code").value=t)),this.mpDialog.open||this.mpDialog.showModal()}bindMultiplayerControls(){const e=Array.from(document.querySelectorAll('#mp-setup-view [role="tab"]'));for(const l of e)l.addEventListener("click",()=>{this.selectMpTab(l.id)}),l.addEventListener("keydown",c=>{if(c.key==="ArrowRight"||c.key==="ArrowLeft"){const h=e[0]===l?e[1]:e[0];h.focus(),this.selectMpTab(h.id)}});const t=document.getElementById("mp-route-select"),n=document.getElementById("mp-custom-route-row");t.addEventListener("change",()=>{n.classList.toggle("hidden",t.value!=="custom")});const i=document.getElementById("mp-name-create"),s=document.getElementById("mp-name-join"),a=document.getElementById("mp-join-code"),o=document.getElementById("mp-setup-error");document.getElementById("btn-mp-create").addEventListener("click",async()=>{const l=this.savePlayerName(i.value||this.titleNameInput.value||"হোস্ট ওস্তাদ"),c=this.readSelectedCreateRoute();if(t.value==="custom"){const h=document.getElementById("mp-custom-start").value,d=document.getElementById("mp-custom-end").value;if(!ko(h,d)){o.textContent="শুরুর স্টপেজ অবশ্যই শেষের স্টপেজের আগে হতে হবে!";return}}o.textContent="রুম তৈরি হচ্ছে...";try{const h=await Ch(l||"হোস্ট ওস্তাদ",this.store.get().selectedSkin,c);this.activeRoom=h.room,this.mpPlayerId=h.playerId??h.room.hostId,this.mpServerOffsetMs=h.serverTime-performance.now(),o.textContent="",this.enterLobbyView()}catch(h){o.textContent=h instanceof Error?h.message:"রুম তৈরি করা যায়নি।"}}),document.getElementById("btn-mp-join").addEventListener("click",async()=>{const l=a.value.trim().toUpperCase();if(l.length<4){o.textContent="বন্ধুর রুম কোড লিখুন!",a.focus();return}const c=this.savePlayerName(s.value||this.titleNameInput.value||"বন্ধু ওস্তাদ");o.textContent="রুমে ঢোকা হচ্ছে...";try{const h=await Ih(l,c||"বন্ধু ওস্তাদ",this.store.get().selectedSkin);this.activeRoom=h.room,this.mpPlayerId=h.playerId??null,this.mpServerOffsetMs=h.serverTime-performance.now(),o.textContent="",this.enterLobbyView()}catch(h){o.textContent=h instanceof Error?h.message:"রুমে ঢোকা যায়নি।"}}),document.getElementById("btn-mp-ready").addEventListener("click",async()=>{if(!this.activeRoom||!this.mpPlayerId)return;const c=!(this.activeRoom.players.find(h=>h.id===this.mpPlayerId)?.ready??!1);try{const h=await Bo(this.activeRoom.code,this.mpPlayerId,c,this.store.get().selectedSkin);this.activeRoom=h.room,this.renderLobbyRoom()}catch(h){document.getElementById("mp-lobby-status").textContent=h instanceof Error?h.message:"আপডেট করা যায়নি"}}),document.getElementById("mp-lobby-route-select").addEventListener("change",async l=>{if(!this.activeRoom||!this.mpPlayerId)return;const c=l.target.value,h=ji.find(d=>d.id===c);if(h)try{const d=await Ph(this.activeRoom.code,this.mpPlayerId,h);this.activeRoom=d.room,this.renderLobbyRoom()}catch(d){document.getElementById("mp-lobby-status").textContent=d instanceof Error?d.message:"রুট পাল্টানো যায়নি"}}),document.getElementById("btn-mp-start").addEventListener("click",async()=>{if(!(!this.activeRoom||!this.mpPlayerId)){document.getElementById("mp-lobby-status").textContent="রেস শুরু হচ্ছে...";try{const l=await Lh(this.activeRoom.code,this.mpPlayerId);this.activeRoom=l.room,this.mpServerOffsetMs=l.serverTime-performance.now(),this.beginRaceCountdown(l.room,l.serverTime)}catch(l){document.getElementById("mp-lobby-status").textContent=l instanceof Error?l.message:"রেস শুরু করা যায়নি"}}}),document.getElementById("btn-mp-garage").addEventListener("click",()=>{this.reopenMpAfterGarage=!0,this.mpDialog.close(),document.getElementById("btn-garage")?.click()}),document.getElementById("btn-mp-leave").addEventListener("click",()=>{this.exitMultiplayerCleanly()}),document.getElementById("btn-race-rematch").addEventListener("click",async()=>{if(!this.activeRoom||!this.mpPlayerId)return;const l=document.getElementById("race-result-status");if(this.activeRoom.hostId!==this.mpPlayerId){l.textContent="হোস্ট রি-ম্যাচ শুরু করার জন্য অপেক্ষা করুন...";return}try{const c=await Nh(this.activeRoom.code,this.mpPlayerId);this.activeRoom=c.room,this.raceResultDialog.close(),this.world.clearRemoteRacers(),this.raceHudStrip.classList.add("hidden"),this.mpMode=!1,this.isPlaying=!1,this.openMultiplayerDialog("mptab-create")}catch(c){l.textContent=c instanceof Error?c.message:"রি-ম্যাচ শুরু করা যায়নি"}}),document.getElementById("btn-race-download").addEventListener("click",()=>{const l=document.createElement("a");l.download=`murir-tin-race-${this.activeRoom?.code??"podium"}.png`,l.href=this.racePodiumCanvas.toDataURL("image/png"),l.click(),document.getElementById("race-result-status").textContent="পোডিয়াম কার্ড ডাউনলোড হয়েছে!"}),document.getElementById("btn-race-copy-result").addEventListener("click",async()=>{if(!this.activeRoom)return;const c=Pr(this.activeRoom.players).map((d,u)=>`${u+1}. ${d.name} — ${d.finishMs!==null?ma(d.finishMs):"চলছে"}`),h=`🏁 মুড়ির টিন 3D রেস (${this.activeRoom.route.label}):
${c.join(`
`)}
খেলতে আসো 👉 https://murirtin-express.vercel.app/`;try{await navigator.clipboard.writeText(h),document.getElementById("race-result-status").textContent="রেজাল্ট কপি হয়েছে! গ্রুপে পেস্ট করুন!"}catch{document.getElementById("race-result-status").textContent=h}}),document.getElementById("btn-race-home").addEventListener("click",()=>{this.exitMultiplayerCleanly()})}enterLobbyView(){document.getElementById("mp-setup-view").classList.add("hidden"),document.getElementById("mp-lobby-view").classList.remove("hidden"),this.renderLobbyRoom(),this.startMpLobbyPolling()}renderLobbyRoom(){const e=this.activeRoom;if(!e)return;const t=e.hostId===this.mpPlayerId;document.getElementById("mp-room-code-display").textContent=e.code,document.getElementById("mp-lobby-route-label").textContent=e.route.label,document.getElementById("mp-lobby-route-sub").textContent=e.route.subtitle,document.getElementById("mp-invite-url").value=Uh(e.code),document.getElementById("mp-host-route-wrap").classList.toggle("hidden",!t);const i=document.getElementById("mp-lobby-route-select");ji.some(h=>h.id===e.route.id)&&(i.value=e.route.id);const s=document.getElementById("mp-player-list");s.innerHTML="";for(const h of e.players){const d=document.createElement("div");d.className=`mp-player-row ${h.id===this.mpPlayerId?"is-self":""}`;const u=document.createElement("div");u.className="mp-player-left";const p=document.createElement("span");p.className="mp-color-dot",p.style.background=h.color;const g=document.createElement("div"),_=document.createElement("strong");_.textContent=`${h.name}${h.id===e.hostId?" 👑":""}${h.id===this.mpPlayerId?" (আপনি)":""}`;const m=At.find(x=>x.id===h.busId)??At[0],f=document.createElement("span");f.className="mp-player-bus",f.textContent=m.name,g.append(_,f),u.append(p,g);const b=document.createElement("span");b.className=`mp-ready-badge ${h.ready?"is-ready":""}`,b.textContent=h.ready?"✅ রেডি":"⏳ অপেক্ষা...",d.append(u,b),s.appendChild(d)}const a=e.players.find(h=>h.id===this.mpPlayerId),o=document.getElementById("btn-mp-ready");o.textContent=a?.ready?"⏳ আন-রেডি":"✅ আমি রেডি!";const l=document.getElementById("btn-mp-start");l.classList.toggle("hidden",!t);const c=e.players.length>=2&&e.players.every(h=>h.ready);l.disabled=e.players.length<1,document.getElementById("mp-lobby-status").textContent=e.players.length<2?"লিংক কপি করে বন্ধুদের পাঠান (একাই টেস্ট করতে চাইলে হোস্ট এখনই শুরু করতে পারেন!)":c?"সবাই রেডি! হোস্ট এখন রেস শুরু করতে পারেন!":"সবাই ✅ রেডি হলে হোস্ট রেস শুরু করবে..."}startMpLobbyPolling(){this.stopMpPolling();const e=async()=>{if(!(!this.activeRoom||!this.mpPlayerId)){try{const t=await Fo(this.activeRoom.code);if(this.activeRoom=t.room,this.mpServerOffsetMs=t.serverTime-performance.now(),t.room.status==="countdown"||t.room.status==="racing"){this.stopMpPolling(),this.beginRaceCountdown(t.room,t.serverTime);return}this.mpDialog.open&&this.renderLobbyRoom()}catch{}this.mpPollTimer=window.setTimeout(()=>void e(),950)}};this.mpPollTimer=window.setTimeout(()=>void e(),950)}stopMpPolling(){this.mpPollTimer&&(window.clearTimeout(this.mpPollTimer),this.mpPollTimer=0)}beginRaceCountdown(e,t){this.stopMpPolling(),this.mpServerOffsetMs=t-performance.now(),this.activeRoom=e,this.mpMode=!0,this.mpRewardBanked=!1,this.mpCountdownActive=!0,this.mpCountdownLastTick="",this.isPlaying=!1,this.mpRaceRand=Bh(e.seed),this.opponentInterp.clear(),this.opponentInterp.updateFromRoom(e,this.mpPlayerId,performance.now()),this.mpDialog.open&&this.mpDialog.close(),this.raceResultDialog.open&&this.raceResultDialog.close(),this.audio.unlock(),this.clearActiveInputs(),this.world.resetEffects(),this.world.clearRemoteRacers(),this.createSimulationFromSave(e.route.startM);const n=e.players.find(i=>i.id===this.mpPlayerId);this.sim.startRace(e.route.startM,e.route.finishM,n?.laneIndex??0),this.world.setBusSkin(this.store.get().selectedSkin),this.world.syncRemoteRacers(this.sim,this.opponentInterp.sample(.016,performance.now()),e.route.finishM),this.titleOverlay.classList.add("hidden"),this.driveControls.classList.remove("hidden"),this.minimapWidget.classList.remove("hidden"),this.raceHudStrip.classList.remove("hidden"),this.raceCountdownEl.classList.remove("hidden"),this.raceCountdownSubEl.textContent=`${e.route.label} • রেডি হন!`,this.refreshHud(),this.refreshRaceHud(this.opponentInterp.sample(.016,performance.now()))}updateMpCountdown(e){if(!this.activeRoom)return;const t=e+this.mpServerOffsetMs,n=this.activeRoom.startAt-t,i=n>2e3?"3":n>1e3?"2":n>0?"1":"GO!";i!==this.mpCountdownLastTick&&(this.mpCountdownLastTick=i,this.raceCountdownNumEl.textContent=i,i==="GO!"?this.audio.playHydraulicHorn():this.audio.playHelperDoorSlap()),n<=-420&&(this.mpCountdownActive=!1,this.raceCountdownEl.classList.add("hidden"),this.isPlaying=!0,this.mpRaceStartedAt=e,this.mpSyncAccum=.2,this.showCallout(`🏁 রেস শুরু! গন্তব্য: ${this.activeRoom.route.label}`))}async pushRaceSync(e,t){if(!(!this.activeRoom||!this.mpPlayerId)&&!(!e&&this.mpSyncInFlight)){this.mpSyncInFlight=!0;try{const n=await Dh(this.activeRoom.code,this.mpPlayerId,{x:this.sim.playerX,distanceM:this.sim.distanceM,speed:this.sim.speed,elevationY:this.sim.elevationY,tiltAngle:this.sim.tiltAngle,nitroActive:this.sim.nitroActive,crashed:this.sim.raceSlowdownTimer>0,busId:this.store.get().selectedSkin,score:this.sim.score,finished:e,finishMs:t});this.activeRoom=n.room,this.opponentInterp.updateFromRoom(n.room,this.mpPlayerId,performance.now())}catch{}finally{this.mpSyncInFlight=!1}}}refreshRaceHud(e){const t=this.activeRoom;if(!t)return;const n=t.route.startM,i=t.route.finishM,s=Math.max(100,i-n),a=[{id:this.mpPlayerId||"self",dist:this.sim.distanceM,color:"#ffffff",isSelf:!0},...e.map(h=>({id:h.id,dist:h.distanceM,color:h.color,isSelf:!1}))];a.sort((h,d)=>d.dist-h.dist);const o=Math.max(1,a.findIndex(h=>h.isSelf)+1),l=o===1?"🥇":o===2?"🥈":o===3?"🥉":"🚌";document.getElementById("race-rank-badge").textContent=`${l} #${o} / ${a.length}`,document.getElementById("race-route-badge").textContent=t.route.label;const c=Math.max(0,(i-this.sim.distanceM)/100).toFixed(1);document.getElementById("race-remain-badge").textContent=`বাকি ${c} km`,this.raceProgressBar.innerHTML="";for(const h of a){const d=Math.max(2,Math.min(98,(h.dist-n)/s*100)),u=document.createElement("span");u.className=`race-progress-dot ${h.isSelf?"is-self":""}`,u.style.left=`${d}%`,u.style.background=h.color,this.raceProgressBar.appendChild(u)}}async onLocalRaceFinished(){if(!this.activeRoom||!this.mpPlayerId)return;const e=Math.max(500,Math.round(performance.now()-this.mpRaceStartedAt));this.isPlaying=!1,this.clearActiveInputs(),await this.pushRaceSync(!0,e);const t=Pr(this.activeRoom.players),n=Math.max(1,t.findIndex(i=>i.id===this.mpPlayerId)+1);if(!this.mpRewardBanked){this.mpRewardBanked=!0;const i=n===1?400:n===2?250:n===3?150:100,s=Math.max(0,this.sim.takaEarned-this.bankedTakaInRun);this.bankedTakaInRun+=s,this.store.update(a=>{a.taka+=s+i}),this.refreshTitleStats(),document.getElementById("race-reward-banner").textContent=`🏆 আপনি #${n} হয়েছেন! রেস পুরস্কার +৳${i} + ট্রিপ ভাড়া ৳${s} জমা হয়েছে!`}this.renderRaceResultDialog(),this.raceResultDialog.open||this.raceResultDialog.showModal(),this.startRaceResultPolling()}renderRaceResultDialog(){const e=this.activeRoom;if(!e||!this.mpPlayerId)return;const t=Pr(e.players);U_(this.racePodiumCanvas,{routeLabel:e.route.label,roomCode:e.code,localPlayerId:this.mpPlayerId,standings:t.map(s=>({id:s.id,name:s.name,color:s.color,finishMs:s.finishMs,distanceM:s.distanceM,busName:(At.find(a=>a.id===s.busId)??At[0]).name}))});const n=document.getElementById("race-standings-list");n.innerHTML="",t.forEach((s,a)=>{const o=document.createElement("div");o.className=`mp-player-row ${s.id===this.mpPlayerId?"is-self":""}`;const l=document.createElement("strong");l.textContent=`${a+1}. ${s.name}${s.id===this.mpPlayerId?" (আপনি)":""}`;const c=document.createElement("span");c.textContent=s.finishMs!==null?`🏁 ${ma(s.finishMs)}`:`🚌 ${ri(s.distanceM)} km`,o.append(l,c),n.appendChild(o)});const i=document.getElementById("btn-race-rematch");i.textContent=e.hostId===this.mpPlayerId?"🔄 আরেক ম্যাচ দে! (Rematch)":"⏳ হোস্টের রি-ম্যাচের অপেক্ষায়..."}startRaceResultPolling(){this.stopMpPolling();const e=async()=>{if(!(!this.activeRoom||!this.mpPlayerId||!this.raceResultDialog.open)){try{const t=await Fo(this.activeRoom.code);if(this.activeRoom=t.room,t.room.status==="lobby"){this.stopMpPolling(),this.raceResultDialog.close(),this.world.clearRemoteRacers(),this.raceHudStrip.classList.add("hidden"),this.mpMode=!1,this.openMultiplayerDialog("mptab-create");return}this.renderRaceResultDialog()}catch{}this.mpPollTimer=window.setTimeout(()=>void e(),1200)}};this.mpPollTimer=window.setTimeout(()=>void e(),1200)}async exitMultiplayerCleanly(){this.stopMpPolling(),this.activeRoom&&this.mpPlayerId&&await Oo(this.activeRoom.code,this.mpPlayerId),this.activeRoom=null,this.mpPlayerId=null,this.mpMode=!1,this.mpCountdownActive=!1,this.isPlaying=!1,this.reopenMpAfterGarage=!1,this.opponentInterp.clear(),this.world.clearRemoteRacers(),this.clearActiveInputs(),this.mpDialog.open&&this.mpDialog.close(),this.raceResultDialog.open&&this.raceResultDialog.close(),this.raceCountdownEl.classList.add("hidden"),this.raceHudStrip.classList.add("hidden"),this.driveControls.classList.add("hidden"),this.minimapWidget.classList.add("hidden"),this.titleOverlay.classList.remove("hidden"),this.createSimulationFromSave(this.activeStartM),this.refreshHud()}}const O_=new B_;O_.init();
