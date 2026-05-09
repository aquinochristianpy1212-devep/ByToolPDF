
function qs(id){return document.getElementById(id)}
function showMessage(text,type="ok"){const m=qs("message");if(!m)return;m.textContent=text;m.className="message "+type}
function clearResults(){const d=qs("downloads");const m=qs("message");if(d)d.innerHTML="";if(m){m.textContent="";m.className="message"}}
function cleanFileName(name){return (name||"archivo").trim().replace(/\.[^/.]+$/,"").replace(/[\\/:*?"<>|]/g,"-").replace(/\s+/g,"-").toLowerCase()||"archivo"}
function addDownload(url,fileName,text){const d=qs("downloads");const a=document.createElement("a");a.href=url;a.download=fileName;a.textContent=text;d.appendChild(a)}
function createPdfUrl(bytes){return URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}))}
function setLoading(btn,loading,text){btn.disabled=loading;btn.textContent=text}
const API = "https://bytoolpdf-backend.onrender.com";
