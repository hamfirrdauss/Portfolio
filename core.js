const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FONTS={ceria:'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
 klasik:'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
 modern:'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
 teknis:'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap'};
const FONTN={ceria:['Ceria','Kekinian & ramah','Bricolage Grotesque,system-ui,sans-serif',800],klasik:['Klasik','Serif laporan','Newsreader,Georgia,serif',500],modern:['Modern','Sans tegas','Plus Jakarta Sans,system-ui,sans-serif',800],teknis:['Teknis','Ringkas & data','IBM Plex Sans Condensed,Arial Narrow,sans-serif',600]};
const ACC=[['#2A4DD0','Kobalt'],['#0E6377','Petrol'],['#2347C5','Biru'],['#17734A','Hijau'],['#A8432B','Bata'],['#5B3FB5','Ungu'],['#D9480F','Jingga'],['#1F2937','Grafit']];
const IC={mail:'<path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="m21 7-9 6-9-6"/>',link:'<path d="M7 17 17 7M9 7h8v8"/>',dl:'<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',up:'<path d="M12 20V9m0 0-4 4m4-4 4 4M5 4h14"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',spark:'<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>'};
const ico=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const LISTS=['metrics','experience','projects','works','gallery','skills','education','certs','awards','activities'];
function norm(d){d=Object.assign({},d||{});for(const k of LISTS)if(!Array.isArray(d[k]))d[k]=[];if(!FONTS[d.font])d.font='ceria';d.projects=d.projects.map(p=>({...p,images:Array.isArray(p.images)?p.images:[],links:Array.isArray(p.links)?p.links:[]}));if(!/^#[0-9a-f]{6}$/i.test(d.accent||''))d.accent='#0E6377';if(d.builder===undefined)d.builder=true;if(d.lang!=='id')d.lang='en';return d}
const url=u=>!u?'':/^https?:\/\//i.test(u)?u:'https://'+u;
const short=u=>String(u||'').replace(/^https?:\/\/(www\.)?/i,'').replace(/\/$/,'');
const ini=n=>String(n||'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const lines=a=>(a||[]).map(x=>String(x).trim()).filter(Boolean);

/* ---------- timeline figure ---------- */
const MI={jan:0,feb:1,mar:2,apr:3,mei:4,may:4,jun:5,jul:6,agu:7,ags:7,aug:7,sep:8,okt:9,oct:9,nov:10,des:11,dec:11};
function parseP(p){const s=String(p||'').toLowerCase();const re=/(?:([a-z]{3})[a-z]*\.?\s+)?((?:19|20)\d{2})/g;const pts=[];let m;
  while((m=re.exec(s)))pts.push({y:+m[2],m:m[1]&&MI[m[1]]!=null?MI[m[1]]:null});if(!pts.length)return null;
  const now=new Date();const st=pts[0].y*12+(pts[0].m??0);let en;
  if(/sekarang|present|kini|saat ini|now|berjalan/.test(s))en=now.getFullYear()*12+now.getMonth()+1;
  else if(pts[1])en=pts[1].y*12+(pts[1].m??11)+1;else en=pts[0].y*12+(pts[0].m!=null?pts[0].m+1:12);
  return {st,en:Math.max(en,st+1),now:/sekarang|present|kini|saat ini|now|berjalan/.test(s)}}
function gantt(d,t){t=t||STR.en;const rows=d.experience.map(e=>({e,p:parseP(e.period)})).filter(r=>r.p).sort((a,b)=>a.p.st-b.p.st);if(rows.length<2)return '';
  const y0=Math.floor(rows[0].p.st/12),y1=Math.max(...rows.map(r=>Math.ceil(r.p.en/12)));const span=(y1-y0)*12||12;const yw=100/(y1-y0||1);
  const lab=e=>String(e.org||e.role).replace(/Kantor Perwakilan Bank Indonesia/i,'KPw BI').replace(/Bank Indonesia Representative Office/i,'BI Rep. Office').replace(/^(PT|CV)\.?\s+/i,'').replace(/\s*\((Persero|Tbk)\)|\s+Tbk\.?/gi,'');
  return `<figure class="fig"><div class="fig-h"><span>${t.tl}</span><span>${y0}–${rows.some(r=>r.p.now)?t.now:y1}</span></div><div class="gt" style="--yw:${yw}%">${rows.map(r=>`<div class="gt-r"><span title="${esc(r.e.role+' · '+r.e.org)}">${esc(lab(r.e))}</span><div class="gt-t"><i class="${r.p.now?'now':''}" style="left:${(r.p.st-y0*12)/span*100}%;width:${Math.max(1.5,(r.p.en-r.p.st)/span*100)}%"></i></div></div>`).join('')}
   <div class="gt-ax"><span></span><div style="grid-template-columns:repeat(${y1-y0},1fr)">${Array.from({length:y1-y0},(_,i)=>`<span>${y0+i}</span>`).join('')}</div></div></div>
   <figcaption>${t.cap(rows.length,y0)}</figcaption></figure>`}

/* ---------- site ---------- */
const STR={
 id:{figs:'Angka',xp:'Pengalaman',proj:'Proyek',work:'Bukti Karya',gal:'Galeri',skills:'Keahlian',edu:'Pendidikan',contact:'Kontak',hire:'Hubungi',copyEmail:'Salin email',sendEmail:'Kirim email',dlcv:'Unduh CV',photoOf:'Foto',uploadHint:'Unggah foto di editor, bagian Identitas',
  focus:'Fokus',loc:'Lokasi',lang:'Bahasa',figK:n=>n+' indikator',figH:'Angka Kunci',figP:'Hasil terukur dari pekerjaan, riset, dan studi. Setiap angka mencantumkan sumbernya.',src:'Sumber',
  xpK:n=>n+' peran',now:'kini',xpP:'Riwayat kerja dan magang, dari yang terbaru.',projK:n=>n+' studi kasus',projH:'Proyek Pilihan',projP:'Masalah yang dihadapi, pendekatan yang dipakai, dan hasil yang dicapai, lengkap dengan bukti bila tersedia.',
  prob:'Masalah',appr:'Pendekatan',res:'Hasil',morePh:n=>'+'+n+' foto',workK:n=>n+' tautan',workP:'Laporan, dashboard, aplikasi, dan publikasi yang bisa dibuka langsung.',galK:n=>n+' foto',galP:'Momen dari pekerjaan, riset lapangan, presentasi, dan kegiatan.',
  skK:n=>n+' keahlian',skH:'Keahlian & Tools',skP:'Metode, perangkat lunak, dan bahasa yang dipakai sehari-hari.',credK:'Kredensial',credH:'Pendidikan & Pencapaian',certs:'Sertifikasi',org:'Organisasi',awards:'Penghargaan',viewCert:'Lihat sertifikat',
  ctaT:'Mari berdiskusi.',ctaP:'Terbuka untuk diskusi peluang kerja, kolaborasi riset, dan proyek analisis. Saya biasanya membalas dalam satu hingga dua hari kerja.',site:'Situs',phone:'Telepon',fullCv:'Unduh CV lengkap',copy:'salin',open:'buka ↗',send:'kirim',
  build:'Buat portofolio Anda sendiri',made:'Dibuat dengan Portofolio Karier',tl:'Lini masa karier',cap:(n,y)=>`Gambar 1. ${n} peran sejak ${y}, diurutkan menurut waktu mulai.`,copied:'Disalin: ',title:n=>'Portofolio '+n},
 en:{figs:'Figures',xp:'Experience',proj:'Projects',work:'Proof of Work',gal:'Gallery',skills:'Skills',edu:'Education',contact:'Contact',hire:'Get in touch',copyEmail:'Copy email',sendEmail:'Send email',dlcv:'Download CV',photoOf:'Photo of',uploadHint:'Upload a photo in the editor, under Identitas',
  focus:'Focus',loc:'Location',lang:'Languages',figK:n=>n+' figures',figH:'Key Figures',figP:'Measurable results from work, research, and study. Every number lists its source.',src:'Source',
  xpK:n=>n+' roles',now:'now',xpP:'Work and internship history, most recent first.',projK:n=>n+' case studies',projH:'Selected Projects',projP:'The challenge, the approach, and the result, with proof where available.',
  prob:'Challenge',appr:'Approach',res:'Result',morePh:n=>'+'+n+' photos',workK:n=>n+' links',workP:'Reports, dashboards, apps, and publications you can open directly.',galK:n=>n+' photos',galP:'Moments from work, field research, presentations, and events.',
  skK:n=>n+' skills',skH:'Skills & Tools',skP:'Methods, software, and languages I use every day.',credK:'Credentials',credH:'Education & Achievements',certs:'Certifications',org:'Leadership',awards:'Awards',viewCert:'View certificate',
  ctaT:"Let's talk.",ctaP:'Open to conversations about roles, research collaborations, and analysis projects. I usually reply within one or two business days.',site:'Website',phone:'Phone',fullCv:'Download full CV',copy:'copy',open:'open ↗',send:'send',
  build:'Build your own portfolio',made:'Made with Career Portfolio',tl:'Career timeline',cap:(n,y)=>`Figure 1. ${n} roles since ${y}, ordered by start date.`,copied:'Copied: ',title:n=>n+' Portfolio'}};
const L=d=>STR[d&&d.lang==='id'?'id':'en'];
function hl(t){return esc(t).replace(/\*(.+?)\*/g,'<mark>$1</mark>')}
const host=u=>short(u).split('/')[0];
const img=(src,alt,cls,cap)=>`<img src="${esc(src)}" alt="${esc(alt||'')}" loading="lazy"${cls?` class="${cls}"`:''} data-zoom data-cap="${esc(cap||alt||'')}">`;
function photoCard(d,o,t){const st=d.sticker===undefined?(d.lang==='id'?'Halo!':'Hi there!'):d.sticker;
  return `<div class="phw"><figure class="ph ${d.photo?'':'ph-ini'}">${d.photo?img(d.photo,t.photoOf+' '+d.name,'',d.name):`<b>${esc(d.initials||ini(d.name))}</b>${o.edit?`<small>${t.uploadHint}</small>`:''}`}</figure>${st?`<span class="stk s1">${esc(st)}</span>`:''}${d.status?`<span class="stk s2"><i></i>Open to work</span>`:''}</div>`}
function linksHTML(ls){return (ls||[]).filter(l=>l&&l.url).map(l=>`<a class="lk" href="${esc(url(l.url))}" target="_blank" rel="noopener">${esc(l.label||host(l.url))}<span aria-hidden="true">↗</span></a>`).join('')}
function renderSite(d,o={}){d=norm(d);const ex=!!o.exp;const t=L(d);
  const sec=[['profil','',1],['angka',t.figs,d.metrics.length],['pengalaman',t.xp,d.experience.length],['proyek',t.proj,d.projects.length],['bukti',t.work,d.works.length],['galeri',t.gal,d.gallery.length],['keahlian',t.skills,d.skills.length],['kredensial',t.edu,d.education.length+d.certs.length+d.awards.length+d.activities.length],['kontak',t.contact,1]].filter(s=>s[2]);
  const em=d.email?(ex?`<a class="btn pri" href="mailto:${esc(d.email)}">${ico('mail')}<span>${t.sendEmail}</span></a>`:`<button class="btn pri" data-a="copy" data-v="${esc(d.email)}">${ico('mail')}<span>${t.copyEmail}</span></button>`):'';
  const facts=[[t.focus,d.focus],[t.loc,d.location],[t.lang,d.languages]].filter(x=>x[1]);const gt=gantt(d,t);
  const xpYears=(()=>{const ps=d.experience.map(e=>parseP(e.period)).filter(Boolean);if(!ps.length)return '';const a=Math.floor(Math.min(...ps.map(p=>p.st))/12);return ps.some(p=>p.now)?`${a}–${t.now}`:`${a}–${Math.floor(Math.max(...ps.map(p=>p.en-1))/12)}`})();
  const cts=[d.email&&['Email',d.email,ex?`mailto:${d.email}`:'',t.copy],d.linkedin&&['LinkedIn',short(d.linkedin),url(d.linkedin),t.open],d.website&&[t.site,short(d.website),url(d.website),t.open],d.showPhone&&d.phone&&[t.phone,d.phone,'',t.copy],d.cvUrl&&['CV',t.fullCv,url(d.cvUrl),t.open]].filter(Boolean);
  return `<div class="pf" lang="${d.lang==='id'?'id':'en'}" data-font="${esc(d.font)}" style="--acc:${esc(d.accent)}">
<nav class="nav" aria-label="${t.contact}"><div class="w"><a class="brand" href="#profil"><span class="mark">${esc(d.initials||ini(d.name))}</span><span>${esc(d.name)}</span></a>
 <div class="links">${sec.slice(1,-1).map(s=>`<a href="#${s[0]}">${s[1]}</a>`).join('')}</div><a class="btn sm pri" href="#kontak">${t.hire}</a></div></nav>
<section class="hero" id="profil"><div class="w hero-g"><div style="min-width:0">
 <p class="eye">${esc([d.role,d.location].filter(Boolean).join(' · '))}</p><h1>${esc(d.name)}</h1>
 ${d.tagline?`<p class="tag">${hl(d.tagline)}</p>`:''}${d.about?`<p class="about">${esc(d.about)}</p>`:''}
 <div class="cta">${em}${d.linkedin?`<a class="btn" href="${esc(url(d.linkedin))}" target="_blank" rel="noopener">${ico('link')}<span>LinkedIn</span></a>`:''}${d.cvUrl?`<a class="btn" href="${esc(url(d.cvUrl))}" target="_blank" rel="noopener">${ico('dl')}<span>${t.dlcv}</span></a>`:''}</div>
 ${d.status?`<p class="status"><i></i>${esc(d.status)}</p>`:''}</div>
 <div class="hero-r">${photoCard(d,o,t)}</div></div></section>
${gt||facts.length?`<section class="glance"><div class="w gl-g ${gt&&facts.length?'two':''}">${gt}${facts.length?`<dl class="facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:''}</div></section>`:''}
${d.metrics.length?`<section class="sec figs" id="angka"><div class="w"><div class="sec-h"><div><span class="kick">${t.figK(d.metrics.length)}</span><h2>${t.figH}</h2></div><p>${t.figP}</p></div>
 <div class="fg" style="--cols:${(n=>n<=4?n:n%3===0?3:n%4===0?4:3)(d.metrics.length)}">${d.metrics.map(m=>`<div class="fgi"><b>${esc(m.v)}</b><span>${esc(m.l)}</span>${m.s?`<small>${t.src}: ${esc(m.s)}</small>`:''}</div>`).join('')}</div></div></section>`:''}
${d.experience.length?`<section class="sec" id="pengalaman"><div class="w"><div class="sec-h"><div><span class="kick">${t.xpK(d.experience.length)}${xpYears?' · '+xpYears:''}</span><h2>${t.xp}</h2></div><p>${esc(d.xpIntro||t.xpP)}</p></div>
 <div class="xp">${d.experience.map(e=>`<article class="xpi"><div class="xp-m"><span class="mono">${esc(e.period)}</span>${e.city?`<small>${esc(e.city)}</small>`:''}</div><div style="min-width:0"><h3>${esc(e.role)}</h3><p class="org">${esc(e.org)}</p>${lines(e.points).length?`<ul>${lines(e.points).map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}</div></article>`).join('')}</div></div></section>`:''}
${d.projects.length?`<section class="sec" id="proyek"><div class="w"><div class="sec-h"><div><span class="kick">${t.projK(d.projects.length)}</span><h2>${t.projH}</h2></div><p>${t.projP}</p></div>
 <div class="cases">${d.projects.map(p=>{const im=lines(p.images);return `<article class="case">${im.length?`<div class="cover">${img(im[0],p.title,'',p.title)}${im.length>1?`<span class="more mono">${t.morePh(im.length-1)}</span>`:''}</div>`:''}<span class="mono">${esc([p.org,p.year].filter(Boolean).join(' · '))}</span><h3>${esc(p.title)}</h3><dl>${p.problem?`<div><dt>${t.prob}</dt><dd>${esc(p.problem)}</dd></div>`:''}${p.approach?`<div><dt>${t.appr}</dt><dd>${esc(p.approach)}</dd></div>`:''}${p.result?`<div class="res"><dt>${t.res}</dt><dd>${esc(p.result)}</dd></div>`:''}</dl>${im.length>1?`<div class="thumbs">${im.slice(1).map((s,i)=>img(s,p.title+' '+(i+2),'',p.title)).join('')}</div>`:''}${lines(p.tags).length?`<div class="tags">${lines(p.tags).map(x=>`<span class="tg">${esc(x)}</span>`).join('')}</div>`:''}${(p.links||[]).some(l=>l&&l.url)?`<div class="lks">${linksHTML(p.links)}</div>`:''}</article>`}).join('')}</div></div></section>`:''}
${d.works.length?`<section class="sec" id="bukti"><div class="w"><div class="sec-h"><div><span class="kick">${t.workK(d.works.length)}</span><h2>${t.work}</h2></div><p>${t.workP}</p></div>
 <div class="works">${d.works.map(w=>{const inner=`${w.image?`<div class="w-cover">${img(w.image,w.title,'',w.title)}</div>`:''}<div class="w-b">${w.label?`<span class="w-lbl">${esc(w.label)}</span>`:''}<h3>${esc(w.title)}</h3>${w.desc?`<p>${esc(w.desc)}</p>`:''}${w.url?`<span class="w-u mono">${esc(host(w.url))} ↗</span>`:''}</div>`;return w.url?`<a class="work" href="${esc(url(w.url))}" target="_blank" rel="noopener">${inner}</a>`:`<div class="work">${inner}</div>`}).join('')}</div></div></section>`:''}
${d.gallery.length?`<section class="sec gal-s" id="galeri"><div class="w"><div class="sec-h"><div><span class="kick">${t.galK(d.gallery.length)}</span><h2>${t.gal}</h2></div><p>${t.galP}</p></div>
 <div class="gal">${d.gallery.filter(g=>g.src).map(g=>`<figure class="pol">${img(g.src,g.caption||t.gal,'',g.caption)}<figcaption>${g.url?`<a href="${esc(url(g.url))}" target="_blank" rel="noopener">${esc(g.caption||host(g.url))} ↗</a>`:esc(g.caption||'')}</figcaption></figure>`).join('')}</div></div></section>`:''}
${d.skills.length?`<section class="sec" id="keahlian"><div class="w"><div class="sec-h"><div><span class="kick">${t.skK(d.skills.reduce((n,s)=>n+lines(s.items).length,0))}</span><h2>${t.skH}</h2></div><p>${t.skP}</p></div>
 <div class="sk">${d.skills.map(s=>`<div class="sk-r"><h3>${esc(s.name)}</h3><div class="tags">${lines(s.items).map(x=>`<span class="tg">${esc(x)}</span>`).join('')}</div></div>`).join('')}</div></div></section>`:''}
${d.education.length+d.certs.length+d.awards.length+d.activities.length?`<section class="sec" id="kredensial"><div class="w"><div class="sec-h"><div><span class="kick">${t.credK}</span><h2>${t.credH}</h2></div><p></p></div><div class="cred">
 ${d.education.length?`<div><h3>${t.edu}</h3><ul class="cl">${d.education.map(e=>`<li><b>${esc(e.school)}</b><span class="mono">${esc(e.period)}</span><small>${esc([e.degree,e.note].filter(Boolean).join(' · '))}</small></li>`).join('')}</ul></div>`:''}
 ${d.certs.length?`<div><h3>${t.certs}</h3><ul class="cl">${d.certs.map(e=>`<li><b>${esc(e.name)}</b><span class="mono">${esc(e.date)}</span>${e.issuer||e.url?`<small>${esc(e.issuer||'')}${e.url?`${e.issuer?' · ':''}<a href="${esc(url(e.url))}" target="_blank" rel="noopener">${t.viewCert} ↗</a>`:''}</small>`:''}</li>`).join('')}</ul></div>`:''}
 ${d.activities.length?`<div><h3>${t.org}</h3><ul class="cl">${d.activities.map(e=>`<li><b>${esc(e.role)}</b><span class="mono">${esc(e.period)}</span><small>${esc([e.org,e.note].filter(Boolean).join(' · '))}</small></li>`).join('')}</ul></div>`:''}
 ${d.awards.length?`<div><h3>${t.awards}</h3><ul class="cl">${d.awards.map(e=>`<li><b>${esc(e.name)}</b><span class="mono">${esc(e.date)}</span></li>`).join('')}</ul></div>`:''}</div></div></section>`:''}
<section class="sec contact" id="kontak"><div class="w ct-g"><div><span class="kick">${t.contact}</span><h2>${esc(d.ctaTitle||t.ctaT)}</h2><p>${esc(d.ctaText||t.ctaP)}</p></div>
 <div class="ct-l">${cts.map(([k,v,h,act])=>h?`<a class="ct-i" href="${esc(h)}"${h.startsWith('mailto:')?'':' target="_blank" rel="noopener"'}><small>${k}</small><b>${esc(v)}</b><em>${h.startsWith('mailto:')?t.send:act}</em></a>`:`<button class="ct-i" data-a="copy" data-v="${esc(v)}"><small>${k}</small><b>${esc(v)}</b><em>${act}</em></button>`).join('')}</div></div></section>
<footer class="pf-f"><div class="w"><span>© ${new Date().getFullYear()} ${esc(d.name)}</span>${!ex&&d.builder&&!o.noBuilder?`<button data-a="build">${t.build}</button>`:`<span>${t.made}</span>`}</div></footer>
</div>`}

/* ---------- state ---------- */
const OWNER=norm(JSON.parse(($('#pf-data')||{}).textContent||'{}'));
const TEMPLATE={name:'Nama Anda',initials:'',role:'Peran yang Anda tuju',tagline:'Satu kalimat yang merangkum nilai yang Anda tawarkan kepada pemberi kerja.',about:'Tulis dua atau tiga kalimat tentang latar belakang, keahlian utama, dan jenis peran yang Anda cari.',location:'Kota, Indonesia',status:'Terbuka untuk peluang baru',focus:'Bidang 1 · Bidang 2',languages:'Indonesia, Inggris',email:'nama@email.com',linkedin:'',website:'',cvUrl:'',phone:'',showPhone:false,
  metrics:[{v:'30%',l:'Contoh: efisiensi proses yang Anda capai',s:'Nama organisasi · tahun'},{v:'120+',l:'Contoh: jumlah responden atau pengguna',s:'Nama organisasi · tahun'}],
  experience:[{role:'Peran terakhir',org:'Nama organisasi',period:'Jan 2024 – sekarang',city:'Kota',points:['Pencapaian utama, sebaiknya disertai angka.','Pencapaian kedua.']},{role:'Peran sebelumnya',org:'Nama organisasi',period:'Jul 2022 – Des 2023',city:'Kota',points:['Pencapaian utama.']}],
  projects:[{title:'Judul proyek',org:'Organisasi',year:'2025',problem:'Masalah yang dihadapi.',approach:'Apa yang Anda lakukan dan alat apa yang dipakai.',result:'Hasil yang terukur.',tags:['Tag 1','Tag 2']}],
  skills:[{name:'Keahlian inti',items:['Keahlian 1','Keahlian 2','Keahlian 3']},{name:'Tools',items:['Excel','Power BI']}],
  education:[{school:'Nama universitas',degree:'Sarjana · Jurusan',period:'2020 – 2024',note:''}],certs:[],awards:[],activities:[],works:[{title:'Judul karya',label:'Laporan',desc:'Ceritakan singkat isi karya ini dan peran Anda.',url:'',image:''}],gallery:[],photo:'',sticker:'Halo!',font:'ceria',accent:'#2A4DD0',builder:true,lang:'id'};
let D=OWNER,mode='view',caps={user:null,artifact:null,sample:null,downloads:null,assets:null},canEdit=false,openSec=new Set([0]),busy=false,aiCtl=null;
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const DRAFT=()=>mode==='edit'?'pf-owner-draft':'pf-build-draft';

/* ---------- editor schema ---------- */
const SCHEMA=[
 {sec:'Identitas',fields:[['photo','Foto profil','img'],['sticker','Stiker di foto','text','mis. Hi there! atau Halo! Kosongkan untuk menyembunyikan.'],['name','Nama lengkap'],['initials','Inisial (logo)'],['role','Peran atau jabatan'],['tagline','Kalimat positioning','area','Apit kata dengan *bintang* untuk efek stabilo.'],['about','Tentang saya','area'],['status','Status (kosongkan bila tidak perlu)'],['location','Lokasi'],['focus','Bidang fokus'],['languages','Bahasa']]},
 {sec:'Kontak',fields:[['email','Email'],['linkedin','LinkedIn'],['website','Situs atau portofolio lain'],['cvUrl','Tautan unduh CV (Google Drive, dll.)'],['phone','Telepon'],['showPhone','Tampilkan nomor telepon di situs','bool'],['ctaTitle','Judul bagian kontak'],['ctaText','Teks bagian kontak','area']]},
 {sec:'Angka Kunci',list:'metrics',name:'v',item:[['v','Angka (mis. 93,59% atau 900+)'],['l','Keterangan'],['s','Sumber (organisasi · tahun)']]},
 {sec:'Pengalaman',list:'experience',name:'role',item:[['role','Peran'],['org','Organisasi'],['period','Periode','text','mis. Jan 2025 – sekarang'],['city','Kota'],['points','Pencapaian','lines','Satu pencapaian per baris']]},
 {sec:'Proyek Pilihan',list:'projects',name:'title',item:[['title','Judul'],['org','Organisasi'],['year','Tahun'],['problem','Masalah','area'],['approach','Pendekatan','area'],['result','Hasil','area'],['images','Foto atau tangkapan layar','imgs','Foto pertama menjadi sampul kartu.'],['links','Tautan bukti','links','Satu per baris: Label | https://…'],['tags','Tag','csv','Pisahkan dengan koma']]},
 {sec:'Bukti Karya',list:'works',name:'title',item:[['title','Judul'],['label','Jenis','text','mis. Laporan, Dashboard, Aplikasi, Artikel'],['desc','Keterangan','area'],['url','Tautan'],['image','Gambar sampul','img']]},
 {sec:'Galeri Foto',list:'gallery',name:'caption',item:[['src','Foto','img'],['caption','Keterangan'],['url','Tautan (opsional)']]},
 {sec:'Keahlian',list:'skills',name:'name',item:[['name','Kelompok'],['items','Item','csv','Pisahkan dengan koma']]},
 {sec:'Pendidikan',list:'education',name:'school',item:[['school','Institusi'],['degree','Gelar dan program'],['period','Periode'],['note','Catatan (IPK, organisasi, dll.)']]},
 {sec:'Sertifikasi',list:'certs',name:'name',item:[['name','Nama sertifikasi'],['issuer','Penerbit'],['date','Tanggal'],['url','Tautan sertifikat (opsional)']]},
 {sec:'Organisasi',list:'activities',name:'role',item:[['role','Peran'],['org','Organisasi'],['period','Periode'],['note','Catatan']]},
 {sec:'Penghargaan',list:'awards',name:'name',item:[['name','Penghargaan'],['date','Tanggal']]},
 {sec:'Tampilan',theme:true}];
function fieldHTML([k,l,t,h],path,val){const id='f-'+path.replace(/\./g,'-');t=t||'text';
  if(t==='img')return `<div class="fl">${l}<div class="imf">${val?`<img src="${esc(val)}" alt="">`:'<span class="imf-e">Belum ada</span>'}<div class="imf-a"><button class="btn sm" data-a="upimg" data-p="${path}">${val?'Ganti':'Unggah'}</button>${val?`<button class="btn sm" data-a="rmimg" data-p="${path}">Hapus</button>`:''}</div></div>${h?`<small>${h}</small>`:''}</div>`;
  if(t==='imgs'){const a=val||[];return `<div class="fl">${l}<div class="imgs">${a.map((s,i)=>`<span class="imt"><img src="${esc(s)}" alt=""><button data-a="rmimgs" data-p="${path}" data-i="${i}" aria-label="Hapus foto">✕</button></span>`).join('')}<button class="imt add-i" data-a="upimgs" data-p="${path}" aria-label="Tambah foto">+</button></div>${h?`<small>${h}</small>`:''}</div>`}
  if(t==='bool')return `<label class="ck"><input type="checkbox" id="${id}" data-p="${path}" data-t="bool" ${val?'checked':''}>${l}</label>`;
  const v=t==='links'?(val||[]).map(x=>x.label&&x.label!==host(x.url)?x.label+' | '+x.url:x.url).join('\n'):t==='lines'?(val||[]).join('\n'):t==='csv'?(val||[]).join(', '):(val??'');
  return `<label class="fl" for="${id}">${l}${t==='area'||t==='lines'||t==='links'?`<textarea id="${id}" data-p="${path}" data-t="${t}"${t!=='area'?' style="min-height:84px"':''}>${esc(v)}</textarea>`:`<input type="text" id="${id}" data-p="${path}" data-t="${t}" value="${esc(v)}">`}${h?`<small>${h}</small>`:''}</label>`}
function editorHTML(){const own=mode==='edit';
  return `<div class="ed-top"><p>${own?'Perubahan tampil langsung di pratinjau dan tersimpan sebagai draf di browser ini. Klik Terbitkan agar semua pengunjung melihatnya.':'Isi data Anda atau unggah CV. Draf tersimpan di browser ini; unduh HTML untuk dipasang di hosting gratis.'}</p>
   <div class="row"><button class="btn" data-a="cv">${ico('up')}Unggah CV</button><button class="btn" data-a="dlHtml">${ico('dl')}Unduh HTML</button>${own?'<button class="btn" data-a="discard">Buang draf</button>':'<button class="btn" data-a="reset">Mulai ulang</button>'}</div></div>
  ${SCHEMA.map((s,i)=>`<details class="ed-s" data-sec="${i}" ${openSec.has(i)?'open':''}><summary>${s.sec}${s.list?`<span>${D[s.list].length}</span>`:''}</summary><div class="ed-b">${s.fields?s.fields.map(f=>fieldHTML(f,f[0],D[f[0]])).join(''):s.list?listHTML(s):themeHTML()}</div></details>`).join('')}`}
function listHTML(s){const arr=D[s.list];return arr.map((it,i)=>`<div class="li"><div class="li-h">${s.list==='gallery'&&it.src?`<img class="li-th" src="${esc(it.src)}" alt="">`:''}<span>${esc(it[s.name]||(s.list==='gallery'?'Foto tanpa keterangan':'(kosong)'))}</span><button class="ib" data-a="mv" data-l="${s.list}" data-i="${i}" data-v="-1" ${i?'':'disabled'} aria-label="Naikkan">↑</button><button class="ib" data-a="mv" data-l="${s.list}" data-i="${i}" data-v="1" ${i<arr.length-1?'':'disabled'} aria-label="Turunkan">↓</button><button class="ib" data-a="rm" data-l="${s.list}" data-i="${i}" aria-label="Hapus">✕</button></div>${s.item.map(f=>fieldHTML(f,s.list+'.'+i+'.'+f[0],it[f[0]])).join('')}</div>`).join('')+(s.list==='gallery'?`<button class="add" data-a="upgal">+ Unggah beberapa foto sekaligus</button>`:`<button class="add" data-a="add" data-l="${s.list}">+ Tambah ${s.sec.toLowerCase()}</button>`)}
function themeHTML(){return `<label class="fl" for="f-lang">Bahasa situs<select id="f-lang" data-p="lang" data-t="text"><option value="en"${D.lang!=='id'?' selected':''}>English</option><option value="id"${D.lang==='id'?' selected':''}>Bahasa Indonesia</option></select><small>Mengubah judul bagian dan label. Isi tulisan Anda tetap seperti yang Anda ketik.</small></label><div class="fl">Gaya huruf<div class="fonts">${Object.entries(FONTN).map(([k,[n,s,f,w]])=>`<button class="${D.font===k?'on':''}" data-a="font" data-v="${k}"><b style="font-family:${f};font-weight:${w}">Aa</b><span style="font-weight:700;font-size:13px">${n}</span><small>${s}</small></button>`).join('')}</div></div>
  <div class="fl">Warna aksen<div class="sw">${ACC.map(([c,n])=>`<button class="${D.accent.toLowerCase()===c.toLowerCase()?'on':''}" style="background:${c}" data-a="acc" data-v="${c}" title="${n}" aria-label="${n}"></button>`).join('')}<input type="color" id="accPick" value="${esc(D.accent)}" aria-label="Warna khusus"></div></div>
  ${fieldHTML(['builder','Tampilkan tautan "Buat portofolio Anda sendiri" di footer','bool'],'builder',D.builder)}`}

/* ---------- render ---------- */
function setFont(f){let l=document.getElementById('pf-font');if(!l){l=document.createElement('link');l.rel='stylesheet';l.id='pf-font';document.body.appendChild(l)}if(l.getAttribute('href')!==FONTS[f])l.setAttribute('href',FONTS[f]);
  if(f!=='klasik'&&!document.getElementById('pf-ui')){const u=document.createElement('link');u.rel='stylesheet';u.id='pf-ui';u.href=FONTS.klasik;document.body.appendChild(u)}}
function render(){const app=$('#app');const ed=mode!=='view';document.body.classList.toggle('editing',ed);
  app.innerHTML=(ed?toolbar()+`<aside class="ed" id="ed" aria-label="Editor portofolio">${editorHTML()}</aside>`:'')+`<div id="site">${renderSite(D,{noBuilder:mode==='build',edit:ed})}</div>`+(!ed&&canEdit&&location.hash!=='#lihat'?`<button class="fab" data-a="edit">${ico('edit')} Edit portofolio</button>`:'');
  setFont(D.font)}
function toolbar(){const own=mode==='edit';return `<div class="tb"><b>${own?'Mode edit':'Pembuat portofolio'}</b><small class="hm">${own?'Draf tersimpan di browser ini':'Draf Anda tidak terlihat oleh orang lain'}</small><span class="sp"></span>
  <div class="seg" role="group" aria-label="Tampilan editor"><button class="${document.body.classList.contains('prev')?'':'on'}" data-a="pane" data-v="ed">Edit</button><button class="${document.body.classList.contains('prev')?'on':''}" data-a="pane" data-v="prev">Pratinjau</button></div>
  ${own?`<button class="btn pri" data-a="publish">${busy?'Menerbitkan…':'Terbitkan'}</button><button class="btn" data-a="exit">Selesai</button>`:`<button class="btn pri hm" data-a="dlHtml">Unduh HTML</button><button class="btn" data-a="exit">Keluar</button>`}</div>`}
let pT;function preview(){clearTimeout(pT);pT=setTimeout(()=>{const s=$('#site');if(s)s.innerHTML=renderSite(D,{noBuilder:mode==='build',edit:mode!=='view'});setFont(D.font);try{localStorage.setItem(DRAFT(),JSON.stringify(D))}catch(e){if(!preview.warned){preview.warned=1;toast('Draf terlalu besar untuk disimpan di browser. Unduh HTML agar tidak hilang.')}}},180)}
function rerenderEditor(){const ed=$('#ed');if(!ed)return;const st=ed.scrollTop;ed.innerHTML=editorHTML();ed.scrollTop=st;preview()}
function toast(m){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,3600)}
function modal(title,body,foot){let m=$('#modal');if(!m){m=document.createElement('div');m.id='modal';document.body.appendChild(m)}
  m.innerHTML=`<div class="modal-s" data-scrim><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h4>${esc(title)}</h4><button class="ib" data-a="close" aria-label="Tutup">✕</button></div><div class="modal-b">${body}</div>${foot?`<div class="modal-f" id="mf">${foot}</div>`:''}</div></div>`}
const closeModal=()=>{const m=$('#modal');if(m)m.innerHTML=''};

/* ---------- modes ---------- */
function enter(m){mode=m;let dr=ls.get(DRAFT());let d=null;try{d=dr?JSON.parse(dr):null}catch(e){}
  if(m==='edit'){D=norm(d||JSON.parse(JSON.stringify(OWNER)));if(d)toast('Draf sebelumnya dimuat')}
  else{D=norm(d||JSON.parse(JSON.stringify(TEMPLATE)))}
  document.body.classList.remove('prev');scrollTo(0,0);render();if(m==='build'&&!d)setTimeout(openCV,60)}
function exit(){if(mode==='edit'&&JSON.stringify(D)!==JSON.stringify(OWNER))toast('Draf disimpan di browser ini. Klik Edit portofolio untuk melanjutkan.');mode='view';D=OWNER;render()}
function setPath(path,val){const ks=path.split('.');let o=D;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=val}
const BLANK={metrics:{v:'',l:'',s:''},experience:{role:'',org:'',period:'',city:'',points:[]},projects:{title:'',org:'',year:'',problem:'',approach:'',result:'',images:[],links:[],tags:[]},skills:{name:'',items:[]},education:{school:'',degree:'',period:'',note:''},certs:{name:'',issuer:'',date:'',url:''},works:{title:'',label:'',desc:'',url:'',image:''},gallery:{src:'',caption:'',url:''},awards:{name:'',date:''},activities:{role:'',org:'',period:'',note:''}};

/* ---------- publish & export ---------- */
const safeJSON=d=>JSON.stringify(d).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function headReset(){const st=[...document.head.querySelectorAll('style')];const s=st.find(x=>/safe-area/.test(x.textContent))||st[0];return s?s.textContent:''}
function pageContent(d){const S='script';return `<title>${esc(L(d).title(d.name||''))}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" id="pf-font" href="${esc(FONTS[d.font])}">\n<style id="pf-css">${$('#pf-css').textContent}</style>\n<div id="app"><div id="site">${renderSite(d)}</div></div>\n<${S} type="application/json" id="pf-data">${safeJSON(d)}</${S}>\n<${S} id="pf-app">${$('#pf-app').textContent}</${S}>\n`}
function docHTML(d){return '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'+headReset()+'</style></head><body>'+pageContent(d)+'</body></html>'}
async function publish(){if(busy)return;if(!caps.artifact){toast('Penerbitan tidak tersedia di tampilan ini. Unduh HTML sebagai gantinya.');return}
  busy=true;render();const d=norm(D);
  try{await caps.artifact.publish(docHTML(d));ls.del('pf-owner-draft');toast('Diterbitkan. Halaman dimuat ulang ke versi baru.')}
  catch(e){const c=e&&e.code;toast(c==='conflict'?'Ada versi lebih baru yang diterbitkan dari tempat lain. Draf Anda tetap tersimpan di browser ini.':c==='not_granted'||c==='not_writer'?'Akun ini tidak punya akses edit halaman.':'Gagal menerbitkan. Coba lagi.')}
  finally{busy=false;if(mode==='edit')render()}}
async function inlineImgs(d){d=JSON.parse(JSON.stringify(d));const cache={};const conv=async s=>{if(!s||/^data:/.test(s))return s;if(cache[s])return cache[s];try{const b=await (await fetch(s)).blob();cache[s]=await blobURL(b)}catch(e){cache[s]=s}return cache[s]};
  d.photo=await conv(d.photo);for(const p of d.projects||[])p.images=await Promise.all((p.images||[]).map(conv));for(const w of d.works||[])w.image=await conv(w.image);for(const g of d.gallery||[])g.src=await conv(g.src);return d}
function exportHTML(d){d=norm(d);return `<!doctype html>\n<html lang="${d.lang==='id'?'id':'en'}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>${esc(L(d).title(d.name||''))}</title>\n<meta name="description" content="${esc([d.role,d.tagline].filter(Boolean).join('. '))}">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="${esc(FONTS[d.font])}">\n<style>body{margin:0}${$('#pf-css').textContent}</style>\n</head>\n<body>\n${renderSite(d,{exp:true})}\n</body>\n</html>\n`}
async function save(name,data){if(caps.downloads){try{await caps.downloads.save({filename:name,data});return}catch(e){if(e&&(e.code==='declined'||e.code==='cancelled'))return}}
  modal('Salin isi '+name,`<p>Unduhan tidak tersedia di tampilan ini. Salin teks berikut, lalu simpan sebagai <b>${esc(name)}</b>.</p><label class="fl">Isi file<textarea id="cpT" readonly style="min-height:260px;font:12px ui-monospace,Menlo,monospace">${esc(data)}</textarea></label>`,`<button class="btn" data-a="close">Tutup</button><button class="btn pri" data-a="cpT">Salin</button>`)}
async function dlHtml(){toast('Menyiapkan file…');const d=await inlineImgs(D);const slug=String(D.name||'portofolio').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'portofolio';
  save('portofolio-'+slug+'.html',exportHTML(d));if(mode==='build')setTimeout(()=>toast('Unggah file ini ke Netlify Drop atau GitHub Pages untuk mendapatkan tautan publik.'),900)}

/* ---------- CV import ---------- */
function loadScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`))return res();const s=document.createElement('script');s.src=src;s.onload=()=>res();s.onerror=()=>rej(new Error('load'));document.head.appendChild(s)})}
const PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
async function readCV(f){const n=f.name.toLowerCase();
  if(n.endsWith('.pdf')){await loadScript(PDFJS+'pdf.worker.min.js');await loadScript(PDFJS+'pdf.min.js');const lib=window.pdfjsLib;lib.GlobalWorkerOptions.workerSrc=PDFJS+'pdf.worker.min.js';
    const doc=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer()),isEvalSupported:false}).promise;let t='';for(let i=1;i<=Math.min(doc.numPages,8);i++){const pg=await doc.getPage(i);const tc=await pg.getTextContent();t+=tc.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('')+'\n'}return t.replace(/[ \t]+/g,' ').replace(/\n\s*\n+/g,'\n').trim()}
  if(n.endsWith('.docx')){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');return (await window.mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value.trim()}
  if(/\.(txt|md)$/.test(n))return (await f.text()).trim();throw new Error('format')}
let cvRes=null;
function openCV(){cvRes=null;modal('Isi Portofolio dari CV',`<p>${caps.sample?'Claude menyusun profil, angka kunci, pengalaman, studi kasus, dan keahlian dari CV Anda. Anda tetap bisa menyunting semuanya.':'Nama dan kontak diambil otomatis dari CV; bagian lain bisa Anda isi di editor.'} File hanya dibaca di browser.</p>
  <label class="drop" id="cvDrop"><input type="file" id="cvFile" accept=".pdf,.docx,.txt,.md" hidden><b>Pilih file CV</b><span>atau seret ke sini · PDF, DOCX, TXT</span></label>
  <label class="fl" for="cvT">Teks CV<textarea id="cvT" style="min-height:140px" placeholder="Teks CV muncul di sini setelah file dibaca. Anda juga bisa menempelkannya langsung."></textarea></label><div id="cvOut"></div>`,cvFoot());
  const inp=$('#cvFile'),dr=$('#cvDrop');inp.addEventListener('change',()=>inp.files[0]&&cvLoad(inp.files[0]));
  dr.addEventListener('dragover',e=>{e.preventDefault();dr.classList.add('over')});dr.addEventListener('dragleave',()=>dr.classList.remove('over'));dr.addEventListener('drop',e=>{e.preventDefault();dr.classList.remove('over');e.dataTransfer.files[0]&&cvLoad(e.dataTransfer.files[0])})}
function cvFoot(){if(aiCtl)return `<span class="busy"><span class="spin"></span>Claude menyusun portofolio…</span><button class="btn" data-a="stopAI">Hentikan</button>`;
  if(cvRes)return `<button class="btn" data-a="cvAgain">Ulangi</button><button class="btn pri" data-a="cvApply">Terapkan ke portofolio</button>`;
  return `<button class="btn" data-a="close">Batal</button><button class="btn ${caps.sample?'':'pri'}" data-a="cvBasic">Ambil data dasar</button>${caps.sample?`<button class="btn pri" data-a="cvAI">${ico('spark')}Susun dengan Claude</button>`:''}`}
function paintCV(){const f=$('#mf');if(f)f.innerHTML=cvFoot();const o=$('#cvOut');if(!o)return;if(!cvRes){o.innerHTML='';return}const r=cvRes;
  o.innerHTML=`<div class="res-box"><b>${esc(r.name||'Nama belum terbaca')}</b><span style="color:var(--muted)">${esc(r.role||'')}</span><span style="font-size:13px">${[[r.metrics.length,'angka kunci'],[r.experience.length,'pengalaman'],[r.projects.length,'proyek'],[r.skills.reduce((n,s)=>n+s.items.length,0),'keahlian']].map(([n,l])=>`<b class="mono" style="font-size:13px">${n}</b> ${l}`).join(' · ')}</span><small style="color:var(--faint)">Terapkan mengganti isi portofolio di editor. Gaya huruf dan warna tetap.</small></div>`}
async function cvLoad(f){const dr=$('#cvDrop');const b=dr.querySelector('b'),s=dr.querySelector('span');b.textContent='Membaca '+f.name+'…';
  try{const t=await readCV(f);if(!t||t.length<80)throw new Error('empty');$('#cvT').value=t;b.textContent=f.name+' terbaca';s.textContent=t.length.toLocaleString('id-ID')+' karakter'}
  catch(e){b.textContent='Pilih file CV';s.textContent='atau seret ke sini · PDF, DOCX, TXT';toast(e.message==='format'?'Gunakan file PDF, DOCX, atau TXT.':e.message==='empty'?'Teks tidak terbaca. CV hasil pindaian belum didukung; tempel teksnya manual.':'File gagal dibaca. Tempel teks CV secara manual.')}}
function promptCV(t){return `Ubah CV berikut menjadi isi situs portofolio karier. Balas hanya dengan satu objek JSON berbentuk:
{"name":"","initials":"","role":"","tagline":"","about":"","location":"","status":"","focus":"","languages":"","email":"","linkedin":"","website":"","phone":"","metrics":[{"v":"","l":"","s":""}],"experience":[{"role":"","org":"","period":"","city":"","points":[]}],"projects":[{"title":"","org":"","year":"","problem":"","approach":"","result":"","tags":[]}],"skills":[{"name":"","items":[]}],"education":[{"school":"","degree":"","period":"","note":""}],"certs":[{"name":"","issuer":"","date":""}],"awards":[{"name":"","date":""}],"activities":[{"role":"","org":"","period":"","note":""}]}
Aturan:
- Hanya fakta yang tertulis di CV; kosongkan yang tidak ada. Jangan mengarang angka.
- ${D.lang==='id'?'Tulis dalam bahasa Indonesia formal, kecuali nama organisasi, nama tools, dan istilah teknis.':'Write every text value in natural, professional English (keep organisation names as written). Use English month abbreviations in periods, e.g. "Aug 2024 – Dec 2024" or "Jan 2025 – present"; status should read "Open to … roles".'}
- role: maksimal 6 kata. tagline: satu kalimat maksimal 18 kata tentang nilai yang ditawarkan. about: 2-3 kalimat, orang pertama.
- status: "Terbuka untuk peran ..." sesuai profil. focus: 2-3 bidang dipisah " · ".
- metrics: 3-6 angka paling kuat dari CV. v singkat (mis. "93,59%", "900+", "25 jam"), l maksimal 9 kata, s berupa "Organisasi · tahun".
- experience: terbaru di atas, maksimal 4 poin per peran, pertahankan angka. period berformat "Agu 2024 – Des 2024" atau "Jan 2025 – sekarang".
- projects: 2-4 proyek atau pencapaian terbesar, masing-masing problem, approach, result satu kalimat.
- skills: 3-5 kelompok, istilah singkat.

CV:
${t.slice(0,16000)}`}
function normCV(r){r=r&&typeof r==='object'?r:{};const s=x=>String(x??'').trim();const A=x=>Array.isArray(x)?x.filter(y=>y&&typeof y==='object'):[];const L=x=>Array.isArray(x)?x.map(s).filter(Boolean):[];
  const o={};for(const k of ['name','initials','role','tagline','about','location','status','focus','languages','email','linkedin','website','phone'])o[k]=s(r[k]);
  o.initials=(o.initials||ini(o.name)).toUpperCase().slice(0,3);
  o.metrics=A(r.metrics).map(m=>({v:s(m.v),l:s(m.l),s:s(m.s)})).filter(m=>m.v).slice(0,6);
  o.experience=A(r.experience).map(e=>({role:s(e.role),org:s(e.org),period:s(e.period),city:s(e.city),points:L(e.points).slice(0,5)})).filter(e=>e.role||e.org);
  o.projects=A(r.projects).map(p=>({title:s(p.title),org:s(p.org),year:s(p.year),problem:s(p.problem),approach:s(p.approach),result:s(p.result),tags:L(p.tags)})).filter(p=>p.title).slice(0,6);
  o.skills=A(r.skills).map(g=>({name:s(g.name)||'Keahlian',items:L(g.items)})).filter(g=>g.items.length);
  o.education=A(r.education).map(e=>({school:s(e.school),degree:s(e.degree),period:s(e.period),note:s(e.note)})).filter(e=>e.school);
  o.certs=A(r.certs).map(e=>({name:s(e.name),issuer:s(e.issuer),date:s(e.date)})).filter(e=>e.name);
  o.awards=A(r.awards).map(e=>({name:s(e.name),date:s(e.date)})).filter(e=>e.name);
  o.activities=A(r.activities).map(e=>({role:s(e.role),org:s(e.org),period:s(e.period),note:s(e.note)})).filter(e=>e.role||e.org);return o}
function basicCV(t){const ln=t.split('\n').map(x=>x.trim()).filter(Boolean);const name=ln.find(l=>l.length<50&&!/[@\d|:]/.test(l))||'';
  return normCV({name,email:(t.match(/[\w.+-]+@[\w-]+\.[\w.]+/)||[''])[0],phone:((t.match(/(\+62|0)[\d\s-]{8,16}\d/)||[''])[0]).trim(),linkedin:(t.match(/linkedin\.com\/in\/[\w-]+/i)||[''])[0]})}
async function cvAI(){const t=($('#cvT')||{}).value||'';if(t.trim().length<200){toast('Teks CV terlalu pendek. Unggah file atau tempel teks CV lengkap.');return}
  aiCtl=new AbortController();paintCV();
  try{const r=await caps.sample.json(promptCV(t),{signal:aiCtl.signal});cvRes=normCV(r)}catch(e){const c=e&&e.code;if(c!=='cancelled')toast(c==='rate_limited'?'Batas penggunaan Claude tercapai. Coba lagi nanti.':c==='not_granted'?'Claude tidak diizinkan di halaman ini. Gunakan Ambil data dasar.':'Claude gagal memproses CV. Coba lagi.');if(c==='not_granted')caps.sample=null}
  finally{aiCtl=null;paintCV()}}
function cvApply(){if(!cvRes)return;const keep={lang:D.lang,font:D.font,accent:D.accent,builder:D.builder,showPhone:D.showPhone,cvUrl:D.cvUrl,ctaTitle:D.ctaTitle,ctaText:D.ctaText,photo:D.photo,sticker:D.sticker,gallery:D.gallery,works:D.works};
  const basicOnly=!cvRes.experience.length&&!cvRes.skills.length;D=norm(basicOnly?{...D,...Object.fromEntries(Object.entries(cvRes).filter(([k,v])=>typeof v==='string'&&v))}:{...cvRes,...keep});
  cvRes=null;closeModal();rerenderEditor();toast(basicOnly?'Nama dan kontak diisi. Lengkapi bagian lain di editor.':'Portofolio disusun dari CV. Periksa dan sesuaikan isinya.')}

/* ---------- images ---------- */
const blobURL=b=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(b)});
async function shrink(file,max,q){const u=URL.createObjectURL(file);try{const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=u});
  const sc=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*sc));c.height=Math.max(1,Math.round(im.naturalHeight*sc));
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);return await new Promise(r=>c.toBlob(r,'image/jpeg',q))}finally{URL.revokeObjectURL(u)}}
async function storeImg(file,max){const own=mode==='edit';const b=await shrink(file,own?max:Math.min(max,1100),own?.84:.74);if(!b)throw new Error('img');
  if(own&&caps.assets){try{const r=await caps.assets.upload(b);return '/_blob/'+r.id}catch(e){}}return await blobURL(b)}
function pickFiles(multi){return new Promise(res=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;i.onchange=()=>res([...i.files]);i.click()})}
async function uploadTo(cb,multi,max){const fs=await pickFiles(multi);if(!fs.length)return;toast(fs.length>1?`Mengunggah ${fs.length} foto…`:'Mengunggah foto…');let ok=0;
  for(const f of fs){if(!/^image\//.test(f.type)){continue}try{cb(await storeImg(f,max));ok++}catch(e){toast('Foto '+f.name+' gagal diproses. Gunakan JPG atau PNG.')}}
  rerenderEditor();if(ok)toast(ok+' foto ditambahkan')}
const getPath=p=>p.split('.').reduce((o,k)=>o==null?o:o[k],D);
function lightbox(src,cap){modal(cap||'Foto',`<img class="lb" src="${esc(src)}" alt="${esc(cap||'')}">`);const m=$('#modal .modal');if(m)m.classList.add('wide')}
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG')t.classList.add('broken')},true);

/* ---------- events ---------- */
document.addEventListener('click',e=>{if(e.target.matches('[data-scrim]')){closeModal();return}
  const z=e.target.closest('#site img[data-zoom]');if(z&&!z.classList.contains('broken')){e.preventDefault();lightbox(z.currentSrc||z.src,z.dataset.cap);return}
  const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,v=b.dataset.v;
  switch(a){
   case 'upimg':uploadTo(src=>setPath(b.dataset.p,src),false,b.dataset.p==='photo'?1000:1600);break;
   case 'rmimg':setPath(b.dataset.p,'');rerenderEditor();break;
   case 'upimgs':uploadTo(src=>{const a=getPath(b.dataset.p)||[];a.push(src);setPath(b.dataset.p,a)},true,1600);break;
   case 'rmimgs':{const a=getPath(b.dataset.p)||[];a.splice(+b.dataset.i,1);rerenderEditor();break}
   case 'upgal':uploadTo(src=>D.gallery.push({src,caption:'',url:''}),true,1600);break;
   case 'copy':navigator.clipboard.writeText(v).then(()=>toast((mode==='view'?L(D).copied:'Disalin: ')+v)).catch(()=>toast('Salin manual: '+v));break;
   case 'edit':if(location.hash==='#edit')enter('edit');else location.hash='edit';break;
   case 'build':enter('build');break;
   case 'exit':if(mode==='edit'&&location.hash==='#edit')location.hash='';else exit();break;
   case 'publish':publish();break;
   case 'pane':document.body.classList.toggle('prev',v==='prev');const sg=$('.tb .seg');if(sg)sg.innerHTML=`<button class="${v==='prev'?'':'on'}" data-a="pane" data-v="ed">Edit</button><button class="${v==='prev'?'on':''}" data-a="pane" data-v="prev">Pratinjau</button>`;scrollTo(0,0);break;
   case 'add':{const l=b.dataset.l;D[l].push(JSON.parse(JSON.stringify(BLANK[l])));rerenderEditor();const items=document.querySelectorAll(`[data-p^="${l}.${D[l].length-1}."]`);if(items[0])items[0].focus();break}
   case 'rm':{const l=b.dataset.l,i=+b.dataset.i;if(b.dataset.ok){D[l].splice(i,1);rerenderEditor()}else{b.dataset.ok='1';b.textContent='Hapus?';b.style.width='auto';b.style.padding='0 8px';b.style.color='var(--bad)';setTimeout(()=>{if(b.isConnected){delete b.dataset.ok;b.textContent='✕';b.style.cssText=''}},2500)}break}
   case 'mv':{const l=b.dataset.l,i=+b.dataset.i,j=i+(+v);if(j<0||j>=D[l].length)break;[D[l][i],D[l][j]]=[D[l][j],D[l][i]];rerenderEditor();break}
   case 'font':D.font=v;rerenderEditor();break;
   case 'acc':D.accent=v;rerenderEditor();break;
   case 'discard':ls.del('pf-owner-draft');D=norm(JSON.parse(JSON.stringify(OWNER)));rerenderEditor();toast('Draf dibuang. Isi kembali ke versi terbit.');break;
   case 'reset':ls.del('pf-build-draft');D=norm(JSON.parse(JSON.stringify(TEMPLATE)));rerenderEditor();toast('Editor kembali ke templat.');break;
   case 'dlHtml':dlHtml();break;
   case 'cv':openCV();break;
   case 'cvAI':cvAI();break;
   case 'cvBasic':{const t=($('#cvT')||{}).value||'';if(t.trim().length<40){toast('Unggah file atau tempel teks CV terlebih dahulu.');break}cvRes=basicCV(t);paintCV();break}
   case 'cvAgain':cvRes=null;paintCV();break;
   case 'cvApply':cvApply();break;
   case 'stopAI':if(aiCtl)aiCtl.abort();break;
   case 'close':closeModal();break;
   case 'cpT':{const ta=$('#cpT');navigator.clipboard.writeText(ta.value).then(()=>toast('Disalin')).catch(()=>{ta.select();toast('Teks dipilih, tekan Ctrl/⌘ C')});break}
  }});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='accPick'){D.accent=t.value;preview();return}const p=t.dataset&&t.dataset.p;if(!p)return;const ty=t.dataset.t;
  const v=ty==='bool'?t.checked:ty==='links'?t.value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const i=x.lastIndexOf('|');return i>0?{label:x.slice(0,i).trim(),url:x.slice(i+1).trim()}:{label:'',url:x}}):ty==='lines'?t.value.split('\n'):ty==='csv'?t.value.split(',').map(x=>x.trim()).filter(Boolean):t.value;setPath(p,v);
  if(/^\w+\.\d+\.\w+$/.test(p)){const li=t.closest('.li');const s=SCHEMA.find(x=>x.list===p.split('.')[0]);if(li&&s&&p.endsWith('.'+s.name))li.querySelector('.li-h span').textContent=t.value||'(kosong)'}
  preview()});
document.addEventListener('change',e=>{if(e.target.id==='accPick')rerenderEditor()});
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('.ed-s')){const i=+d.dataset.sec;d.open?openSec.add(i):openSec.delete(i)}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

/* ---------- boot ---------- */
async function boot(){render();
  const use=n=>window.claude&&claude.use?claude.use(n).catch(()=>null):Promise.resolve(null);
  const [u,ar,sa,dl,as]=await Promise.all([use('user'),use('artifact'),use('sample'),use('downloads'),use('assets')]);caps={user:u,artifact:ar,sample:sa,downloads:dl,assets:as};
  try{canEdit=!!(u&&(await u.canEdit()))&&!!ar}catch(e){canEdit=false}
  routeHash(true)}
function routeHash(first){const h=location.hash.slice(1);
  if(h==='edit'){if(canEdit&&mode!=='edit')enter('edit');else if(!canEdit&&first&&caps.user)toast('Hanya pemilik yang bisa mengedit. Anda melihat versi publik.')}
  else if(mode==='edit'&&(h===''||h==='lihat'))exit();
  else if(first||h==='lihat')render()}
if(typeof window!=='undefined')window.addEventListener('hashchange',()=>routeHash(false));
if(typeof document!=='undefined'&&document.getElementById('app'))boot();
