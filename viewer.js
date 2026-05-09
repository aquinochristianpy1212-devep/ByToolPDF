
pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
let pdfObserver=null;
async function renderPdfViewer(pdfBytes,setPages){
  const wrap=qs("viewer"),pagesBox=qs("viewerPages"),current=qs("currentPage");
  wrap.style.display="block";pagesBox.innerHTML="";
  const pdf=await pdfjsLib.getDocument({data:pdfBytes.slice(0)}).promise;
  if(setPages)setPages(pdf.numPages);
  current.textContent=`Página 1 de ${pdf.numPages}`;
  for(let n=1;n<=pdf.numPages;n++){
    const page=await pdf.getPage(n);
    const vp1=page.getViewport({scale:1});
    const maxWidth=Math.min(850,pagesBox.clientWidth-40);
    const viewport=page.getViewport({scale:maxWidth/vp1.width});
    const box=document.createElement("div");box.className="pdf-page";box.dataset.page=n;
    const label=document.createElement("div");label.className="page-label";label.textContent=`Página ${n}`;
    const canvas=document.createElement("canvas");const ctx=canvas.getContext("2d");
    canvas.width=viewport.width;canvas.height=viewport.height;
    box.appendChild(label);box.appendChild(canvas);pagesBox.appendChild(box);
    await page.render({canvasContext:ctx,viewport}).promise;
  }
  if(pdfObserver)pdfObserver.disconnect();
  pdfObserver=new IntersectionObserver((entries)=>{
    let page=null,ratio=0;
    entries.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>ratio){ratio=e.intersectionRatio;page=e.target.dataset.page}});
    if(page)current.textContent=`Página ${page} de ${pdf.numPages}`;
  },{root:pagesBox,threshold:[.25,.5,.75]});
  document.querySelectorAll(".pdf-page").forEach(p=>pdfObserver.observe(p));
}
function clearViewer(){const p=qs("viewerPages"),w=qs("viewer");if(p)p.innerHTML="";if(w)w.style.display="none";if(pdfObserver){pdfObserver.disconnect();pdfObserver=null}}
