/* Editor visual: menyimpan content.json dan foto langsung ke GitHub. Vercel menerbitkan ulang otomatis. */
const GH_DEF={owner:'hamfirrdauss',repo:'portfolio',branch:'main',token:''};
const ghCfg=()=>{try{return Object.assign({},GH_DEF,JSON.parse(localStorage.getItem('gh-cfg')||'{}'))}catch(e){return {...GH_DEF}}};
const ghSet=c=>{try{localStorage.setItem('gh-cfg',JSON.stringify(c))}catch(e){}};
let saving=false,lastSaved='';

/* ---------- overrides of the shared core ---------- */
function toolbar(){const c=ghCfg();
  return `<div class="tb"><b>Editor Portofolio</b><small class="hm">${c.token?`Terhubung ke ${esc(c.owner)}/${esc(c.repo)}`:'Belum terhubung ke GitHub'}${lastSaved?' · terakhir disimpan '+lastSaved:''}</small><span class="sp"></span>
  <div class="seg" role="group" aria-label="Tampilan editor"><button class="${document.body.classList.contains('prev')?'':'on'}" data-a="pane" data-v="ed">Edit</button><button class="${document.body.classList.contains('prev')?'on':''}" data-a="pane" data-v="prev">Pratinjau</button></div>
  <a class="btn hm" href="/" target="_blank" rel="noopener">Lihat situs ↗</a><button class="btn" data-a="ghcfg">GitHub</button><button class="btn pri" data-a="ghsave">${saving?'Menyimpan…':'Simpan & terbitkan'}</button></div>`}
function editorHTML(){const c=ghCfg();const full=window.__origEditor();const cut=full.indexOf('<details');
  return `<div class="ed-top"><p>${c.token?'Perubahan tampil langsung di pratinjau dan tersimpan sebagai draf di browser ini. Klik <b>Simpan & terbitkan</b>; situs diperbarui sekitar 30 detik kemudian.':'Hubungkan editor ke GitHub sekali saja agar tombol <b>Simpan & terbitkan</b> bisa langsung memperbarui situs.'}</p>
   <div class="row">${c.token?'':'<button class="btn pri" data-a="ghcfg">Hubungkan GitHub</button>'}<button class="btn" data-a="dljson">Unduh content.json</button><button class="btn" data-a="reload">Muat versi terbit</button></div></div>`+full.slice(cut)}
function exit(){}
async function publish(){ghSave()}

/* ---------- GitHub ---------- */
async function gh(path,opt={}){const c=ghCfg();const r=await fetch('https://api.github.com/repos/'+c.owner+'/'+c.repo+path,{...opt,headers:{'Accept':'application/vnd.github+json','Authorization':'Bearer '+c.token,'X-GitHub-Api-Version':'2022-11-28',...(opt.body?{'Content-Type':'application/json'}:{})}});
  if(!r.ok){let m='';try{m=(await r.json()).message}catch(e){}const err=new Error(m||('HTTP '+r.status));err.status=r.status;throw err}return r.json()}
const b64=s=>{const u=new TextEncoder().encode(s);let b='';for(let i=0;i<u.length;i+=0x8000)b+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(b)};
const rid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const LOCAL=new Map();
document.addEventListener('error',e=>{const t=e.target;if(t&&t.tagName==='IMG'){const k=t.getAttribute('src');if(LOCAL.has(k)){t.classList.remove('broken');t.src=LOCAL.get(k)}}},true);
function collectImages(d){const files=[];const fix=s=>{if(typeof s!=='string'||!s.startsWith('data:image/'))return s;const ext=s.startsWith('data:image/png')?'png':'jpg';const p='images/'+rid()+'.'+ext;files.push({path:p,b64:s.split(',')[1]});LOCAL.set('/'+p,s);return '/'+p};
  d.photo=fix(d.photo);(d.projects||[]).forEach(p=>p.images=(p.images||[]).map(fix));(d.works||[]).forEach(w=>w.image=fix(w.image));(d.gallery||[]).forEach(g=>g.src=fix(g.src));return files}
async function ghSave(){const c=ghCfg();if(!c.token){openCfg();return}if(saving)return;saving=true;render();
  try{const d=JSON.parse(JSON.stringify(norm(D)));d.builder=false;const imgs=collectImages(d);
    const ref=await gh('/git/ref/heads/'+c.branch);const base=ref.object.sha;const cm=await gh('/git/commits/'+base);
    const tree=[];for(const f of imgs){const bl=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:f.b64,encoding:'base64'})});tree.push({path:f.path,mode:'100644',type:'blob',sha:bl.sha})}
    const jb=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:b64(JSON.stringify(d,null,2)+'\n'),encoding:'base64'})});tree.push({path:'content.json',mode:'100644',type:'blob',sha:jb.sha});
    const nt=await gh('/git/trees',{method:'POST',body:JSON.stringify({base_tree:cm.tree.sha,tree})});
    const nc=await gh('/git/commits',{method:'POST',body:JSON.stringify({message:'Perbarui portofolio dari editor'+(imgs.length?` (+${imgs.length} foto)`:''),tree:nt.sha,parents:[base]})});
    await gh('/git/refs/heads/'+c.branch,{method:'PATCH',body:JSON.stringify({sha:nc.sha})});
    D=norm(d);try{localStorage.setItem('pf-owner-draft',JSON.stringify(D))}catch(e){}
    const n=new Date();lastSaved=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0');
    toast('Tersimpan di GitHub. Situs diperbarui dalam sekitar 30 detik.')}
  catch(e){toast(e.status===401?'Token GitHub tidak valid atau kedaluwarsa. Perbarui di menu GitHub.':e.status===403||e.status===404?'Token tidak punya akses tulis ke repositori ini. Periksa izin Contents: Read and write.':e.status===409||e.status===422?'Ada perubahan baru di GitHub. Klik Simpan sekali lagi.':'Gagal menyimpan: '+e.message)}
  finally{saving=false;render()}}
async function loadContent(){const c=ghCfg();
  if(c.token){try{const f=await gh('/contents/content.json?ref='+c.branch);const txt=new TextDecoder().decode(Uint8Array.from(atob(f.content.replace(/\n/g,'')),ch=>ch.charCodeAt(0)));return JSON.parse(txt)}catch(e){}}
  const r=await fetch('/content.json',{cache:'no-store'});return r.json()}
function openCfg(){const c=ghCfg();
  modal('Hubungkan ke GitHub',`<p>Editor menyimpan perubahan langsung ke repositori GitHub Anda memakai token akses pribadi. Token hanya disimpan di browser ini.</p>
   <ol class="steps"><li>Buka <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com/settings/personal-access-tokens/new</a></li><li>Token name: <b>portfolio-editor</b>. Expiration: pilih sesuai kebutuhan, misalnya 1 tahun.</li><li>Repository access: <b>Only select repositories</b>, lalu pilih <b>${esc(c.repo)}</b>.</li><li>Permissions → Repository permissions → <b>Contents: Read and write</b>.</li><li>Klik Generate token, salin, lalu tempel di bawah.</li></ol>
   <label class="fl" for="ghTok">Token<input type="text" id="ghTok" value="${esc(c.token)}" placeholder="github_pat_…" autocomplete="off" spellcheck="false"></label>
   <div style="display:grid;grid-template-columns:1fr 1fr 110px;gap:10px"><label class="fl" for="ghOw">Pemilik<input type="text" id="ghOw" value="${esc(c.owner)}"></label><label class="fl" for="ghRe">Repositori<input type="text" id="ghRe" value="${esc(c.repo)}"></label><label class="fl" for="ghBr">Branch<input type="text" id="ghBr" value="${esc(c.branch)}"></label></div>`,
   `${c.token?'<button class="btn" data-a="ghout" style="margin-right:auto">Putuskan</button>':''}<button class="btn" data-a="close">Batal</button><button class="btn pri" data-a="ghok">Simpan & uji</button>`)}
async function cfgSave(){const c={owner:$('#ghOw').value.trim(),repo:$('#ghRe').value.trim(),branch:$('#ghBr').value.trim()||'main',token:$('#ghTok').value.trim()};ghSet(c);
  try{const r=await gh('');if(!r.permissions||!r.permissions.push)throw Object.assign(new Error('x'),{status:403});closeModal();render();toast('Terhubung ke '+c.owner+'/'+c.repo)}
  catch(e){toast(e.status===401?'Token tidak valid.':e.status===404||e.status===403?'Token tidak punya akses tulis ke repositori ini.':'Gagal terhubung: '+e.message)}}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-a]');if(!b)return;
  switch(b.dataset.a){
   case 'ghcfg':openCfg();break;
   case 'ghok':cfgSave();break;
   case 'ghout':ghSet({...ghCfg(),token:''});closeModal();render();toast('Token dihapus dari browser ini.');break;
   case 'ghsave':ghSave();break;
   case 'dljson':{const d=JSON.parse(JSON.stringify(norm(D)));const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);break}
   case 'reload':try{D=norm(await loadContent());localStorage.removeItem('pf-owner-draft');rerenderEditor();toast('Versi terbit dimuat. Draf dibuang.')}catch(x){toast('Gagal memuat versi terbit.')}break;
  }});

/* ---------- boot ---------- */
(async()=>{const app=document.createElement('div');app.id='app';document.body.appendChild(app);
  mode='edit';canEdit=false;document.body.classList.add('editing');app.innerHTML='<div class="tb"><b>Editor Portofolio</b><span class="sp"></span><small>Memuat…</small></div>';
  let pub;try{pub=await loadContent()}catch(e){pub={}}
  let draft=null;try{draft=JSON.parse(localStorage.getItem('pf-owner-draft')||'null')}catch(e){}
  D=norm(draft||pub);render();if(draft)toast('Draf terakhir dimuat. Klik Muat versi terbit untuk membuangnya.');
  if(!ghCfg().token)setTimeout(openCfg,400)})();
