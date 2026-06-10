/* ============================================================
   tools.js — Neural Network Builder: slot machine, network viz, training sim
   ============================================================ */
(function () {
  'use strict';
  const state = { project:'image-classifier', layers:3, neurons:64, activation:'relu', learningRate:0.01, epochs:50, datasetSize:5000, training:false, trainingTimer:null, currentEpoch:0, accuracyHistory:[], lossHistory:[], params:0 };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const dom = {
    slotMachine:$('#slotMachine'), btnRandomize:$('#btnRandomize'), btnBuild:$('#btnBuild'),
    activation:$('#activation'), learningRate:$('#learningRate'), epochs:$('#epochs'), datasetSize:$('#datasetSize'),
    lrValue:$('#lrValue'), epochValue:$('#epochValue'), datasetValue:$('#datasetValue'),
    networkSvg:$('#networkSvg'), networkOverlay:$('#networkOverlay'), archStatus:$('#archStatus'), trainStatus:$('#trainStatus'),
    metricAccuracy:$('#metricAccuracy'), metricLoss:$('#metricLoss'), metricEpoch:$('#metricEpoch'), metricTotalEpochs:$('#metricTotalEpochs'), metricParams:$('#metricParams'),
    progressWrap:$('#progressWrap'), progressFill:$('#progressFill'), progressText:$('#progressText'), trainingLog:$('#trainingLog'), chartCanvas:$('#chartCanvas'),
    configSummary:{ project:$('#summaryProject'), layers:$('#summaryLayers'), neurons:$('#summaryNeurons'), activation:$('#summaryActivation'), lr:$('#summaryLR') }
  };
  const columnState = {};
  const projectNames = { 'image-classifier':'Image Classifier','text-generator':'Text Generator','speech-recognizer':'Speech Recognizer','sentiment-analyzer':'Sentiment Analyzer','anomaly-detector':'Anomaly Detector','recommendation-engine':'Recommendation Engine','object-detector':'Object Detector','style-transfer':'Style Transfer' };

  function initSlotColumns() {
    $$('.slot-column').forEach((col) => {
      const key = col.dataset.column;
      const track = col.querySelector('.slot-track');
      const items = track.querySelectorAll('.slot-item');
      let idx = 0;
      items.forEach((item,i) => { const v=item.dataset.value; if(key==='project'&&v===state.project)idx=i; if(key==='layers'&&parseInt(v)===state.layers)idx=i; if(key==='neurons'&&parseInt(v)===state.neurons)idx=i; });
      columnState[key] = { track, items, idx, col, win: col.querySelector('.slot-window') };
      columnState[key].itemHeight = columnState[key].items[0] ? columnState[key].items[0].offsetHeight : 46;
      columnState[key].windowH = columnState[key].win.offsetHeight;
      positionColumn(key);
      col.querySelectorAll('.slot-arrow').forEach((btn) => { btn.addEventListener('click',()=>{ const d=parseInt(btn.dataset.dir); const cs=columnState[key]; cs.idx=(cs.idx+d+cs.items.length)%cs.items.length; positionColumn(key); updateStateFromColumn(key); updateSummary(); }); });
      col.querySelector('.slot-window').addEventListener('wheel',(e)=>{ e.preventDefault(); const cs=columnState[key]; const d=e.deltaY>0?1:-1; cs.idx=(cs.idx+d+cs.items.length)%cs.items.length; positionColumn(key); updateStateFromColumn(key); updateSummary(); },{passive:false});
    });
  }
  function positionColumn(key) { const cs=columnState[key]; if(!cs)return; const offset=cs.windowH/2-cs.itemHeight/2; cs.track.style.transform=`translateY(${offset-cs.idx*cs.itemHeight}px)`; cs.items.forEach((item,i)=>item.classList.toggle('active',i===cs.idx)); }
  function updateStateFromColumn(key) { const cs=columnState[key]; if(!cs)return; const v=cs.items[cs.idx].dataset.value; if(key==='project')state.project=v; else if(key==='layers')state.layers=parseInt(v); else if(key==='neurons')state.neurons=parseInt(v); }
  function randomizeColumns() { ['project','layers','neurons'].forEach((key)=>{ const cs=columnState[key]; if(!cs)return; cs.idx=Math.floor(Math.random()*cs.items.length); positionColumn(key); updateStateFromColumn(key); }); updateSummary(); dom.slotMachine.style.animation='none'; dom.slotMachine.offsetHeight; dom.slotMachine.style.animation='slotShake 0.4s ease'; setTimeout(()=>{dom.slotMachine.style.animation='';},400); }
  function updateSummary() { dom.configSummary.project.textContent=projectNames[state.project]||state.project; dom.configSummary.layers.textContent=state.layers; dom.configSummary.neurons.textContent=state.neurons; dom.configSummary.activation.textContent=state.activation; dom.configSummary.lr.textContent=state.learningRate.toFixed(3); }
  function readAdvancedSettings() { state.activation=dom.activation.value; state.learningRate=parseFloat(dom.learningRate.value); state.epochs=parseInt(dom.epochs.value); state.datasetSize=parseInt(dom.datasetSize.value); updateSummary(); }

  function getOutputSize() { switch(state.project){case'image-classifier':return 10; case'text-generator':return 50; case'speech-recognizer':return 30; case'sentiment-analyzer':return 3; case'anomaly-detector':return 2; case'recommendation-engine':return 20; case'object-detector':return 15; case'style-transfer':return 10; default:return 10;} }
  function computeTotalParams(iN,hL,nH,oN){ let t=0,p=iN; for(let l=0;l<hL;l++){t+=p*nH+nH;p=nH;} t+=p*oN+oN; return t; }
  function formatParams(n){ if(n>=1000000)return(n/1000000).toFixed(1)+'M'; if(n>=1000)return(n/1000).toFixed(1)+'K'; return n.toString(); }

  function drawNetwork() {
    const svg=dom.networkSvg; svg.innerHTML='';
    const iN=10,hL=state.layers,nH=Math.min(state.neurons/8,16),oN=getOutputSize(),tL=1+hL+1;
    const lX=[],mX=100,mY=50,uW=800-mX*2,uH=500-mY*2;
    for(let l=0;l<tL;l++)lX.push(mX+(uW/(tL-1))*l);
    for(let l=0;l<tL-1;l++){ const lC=l===0?iN:nH,rC=l===tL-2?oN:nH; for(let i=0;i<lC;i++){ const y1=mY+(uH/(lC+1))*(i+1); for(let j=0;j<rC;j++){ const y2=mY+(uH/(rC+1))*(j+1),line=document.createElementNS('http://www.w3.org/2000/svg','line'); line.setAttribute('x1',lX[l]); line.setAttribute('y1',y1); line.setAttribute('x2',lX[l+1]); line.setAttribute('y2',y2); line.classList.add('connection-line'); line.dataset.fromLayer=l; line.dataset.fromIdx=i; line.dataset.toIdx=j; svg.appendChild(line); } } }
    const nEls=[];
    for(let l=0;l<tL;l++){ const cnt=l===0?iN:l===tL-1?oN:nH,cls=l===0?'input-layer':l===tL-1?'output-layer':'hidden-layer'; for(let i=0;i<cnt;i++){ const y=mY+(uH/(cnt+1))*(i+1),c=document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx',lX[l]); c.setAttribute('cy',y); c.setAttribute('r',l===0||l===tL-1?10:8); c.classList.add('neuron-circle',cls); c.dataset.layer=l; c.dataset.index=i; svg.appendChild(c); nEls.push(c); } }
    const lbls=['Input',...Array(hL).fill('Hidden'),'Output'];
    for(let l=0;l<tL;l++){ const t=document.createElementNS('http://www.w3.org/2000/svg','text'); t.setAttribute('x',lX[l]); t.setAttribute('y',485); t.classList.add('layer-label'); t.textContent=lbls[l]+(l>0&&l<tL-1?' '+l:''); svg.appendChild(t); }
    state._networkData={neuronEls:nEls,layerXs:lX,totalLayers:tL,inputNeurons:iN,neuronsPerHidden:nH,outputNeurons:oN,marginX:mX,marginY:mY,usableW:uW,usableH:uH,svg};
    state.params=computeTotalParams(iN,hL,nH,oN);
  }
  function fireNeuron(li,ni,d=600){ const nd=state._networkData; if(!nd)return; const n=nd.neuronEls.find(el=>parseInt(el.dataset.layer)===li&&parseInt(el.dataset.index)===ni); if(!n)return; n.classList.add('firing'); setTimeout(()=>n.classList.remove('firing'),d); }
  function fireLayer(li,cnt=4){ const nd=state._networkData; if(!nd)return; let tot; if(li===0)tot=nd.inputNeurons; else if(li===nd.totalLayers-1)tot=nd.outputNeurons; else tot=nd.neuronsPerHidden; const f=new Set(); for(let c=0;c<cnt;c++){ const ni=Math.floor(Math.random()*tot); if(!f.has(ni)){f.add(ni); fireNeuron(li,ni,300+Math.random()*400);} } }
  function fireForwardPass(){ const nd=state._networkData; if(!nd)return; for(let l=0;l<nd.totalLayers;l++)setTimeout(()=>fireLayer(l,l===nd.totalLayers-1?3:5),l*150); }
  function animateConnections(lf,intensity=0.3){ const nd=state._networkData; if(!nd)return; nd.svg.querySelectorAll(`.connection-line[data-from-layer="${lf}"]`).forEach(line=>{ if(Math.random()<intensity){line.classList.add('active'); setTimeout(()=>line.classList.remove('active'),400+Math.random()*300);} }); }
  function fireAllConnections(){ const nd=state._networkData; if(!nd)return; for(let l=0;l<nd.totalLayers-1;l++)setTimeout(()=>animateConnections(l,0.4),l*200); }

  function drawChart(){
    const c=dom.chartCanvas; if(!c)return; const ctx=c.getContext('2d'),W=c.width,H=c.height,pad={top:20,right:20,bottom:30,left:45},pW=W-pad.left-pad.right,pH=H-pad.top-pad.bottom;
    ctx.clearRect(0,0,W,H); ctx.strokeStyle='#2a2a2a'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(pad.left,pad.top); ctx.lineTo(pad.left,pad.top+pH); ctx.lineTo(pad.left+pW,pad.top+pH); ctx.stroke();
    ctx.fillStyle='#888'; ctx.font='9px "IBM Plex Mono", monospace'; ctx.textAlign='right';
    for(let v=0;v<=1;v+=0.25){ const y=pad.top+pH-v*pH; ctx.fillText(v.toFixed(2),pad.left-6,y+3); ctx.strokeStyle='#1f1f1f'; ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(pad.left+pW,y); ctx.stroke(); }
    function dL(data,color,w){ ctx.strokeStyle=color; ctx.lineWidth=w; ctx.beginPath(); const tot=state.epochs; data.forEach((val,i)=>{ const x=pad.left+(i/(tot-1))*pW,y=pad.top+pH-val*pH; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); }
    if(state.accuracyHistory.length>1)dL(state.accuracyHistory,'#ffd700',2);
    if(state.lossHistory.length>1)dL(state.lossHistory,'#c9c9c9',1.5);
    ctx.font='9px "IBM Plex Mono", monospace'; const lx=pad.left+8,ly=pad.top+14; ctx.fillStyle='#ffd700'; ctx.fillText('Accuracy',lx+14,ly); ctx.fillStyle='#c9c9c9'; ctx.fillText('Loss',lx+90,ly);
    ctx.fillStyle='#ffd700'; ctx.beginPath(); ctx.arc(lx+6,ly-3,3,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#c9c9c9'; ctx.beginPath(); ctx.arc(lx+82,ly-3,3,0,Math.PI*2); ctx.fill();
  }
  function resetChart(){ state.accuracyHistory=[]; state.lossHistory=[]; if(dom.chartCanvas){ dom.chartCanvas.getContext('2d').clearRect(0,0,dom.chartCanvas.width,dom.chartCanvas.height); drawChart(); } }
  function addLog(msg){ const l=document.createElement('div'); l.className='log-line'; l.innerHTML=`<i class="fas fa-chevron-right"></i> ${msg}`; dom.trainingLog.appendChild(l); dom.trainingLog.scrollTop=dom.trainingLog.scrollHeight; }

  function buildNetwork(){
    readAdvancedSettings(); state.currentEpoch=0; state.accuracyHistory=[]; state.lossHistory=[]; drawNetwork(); resetChart();
    dom.networkOverlay.classList.add('hidden'); dom.archStatus.textContent='Built'; dom.trainStatus.textContent='Idle';
    dom.metricAccuracy.textContent='--'; dom.metricLoss.textContent='--'; dom.metricEpoch.textContent='0'; dom.metricTotalEpochs.textContent=`/ ${state.epochs}`;
    dom.metricParams.textContent=formatParams(state.params); dom.progressWrap.style.display='flex'; dom.progressFill.style.width='0%'; dom.progressText.textContent='0%';
    dom.trainingLog.innerHTML=`<div class="log-line"><i class="fas fa-check-circle"></i> Network built — ${formatParams(state.params)} parameters</div>`;
    setTimeout(()=>startTraining(),600);
  }
  function startTraining(){
    if(state.training)return; state.training=true; state.currentEpoch=0; state.accuracyHistory=[]; state.lossHistory=[];
    dom.btnBuild.disabled=true; dom.btnRandomize.disabled=true; dom.trainStatus.textContent='Training'; dom.trainStatus.classList.add('training');
    const bAcc=0.35+Math.random()*0.15,bLoss=1.2+Math.random()*0.4;
    function step(){
      if(!state.training||state.currentEpoch>=state.epochs){finishTraining();return;}
      state.currentEpoch++; const p=state.currentEpoch/state.epochs;
      const acc=bAcc+(0.97-bAcc)*(1-1/(1+Math.exp(-12*(p-0.3)))),aN=(Math.random()-0.5)*0.04*(1-p),cAcc=Math.min(0.995,Math.max(0,acc+aN));
      const loss=bLoss*Math.exp(-3.5*p)+0.02,lN=(Math.random()-0.5)*0.06*(1-p),cLoss=Math.max(0.02,loss+lN);
      state.accuracyHistory.push(cAcc); state.lossHistory.push(cLoss);
      dom.metricAccuracy.textContent=(cAcc*100).toFixed(1)+'%'; dom.metricAccuracy.classList.add('improving'); dom.metricLoss.textContent=cLoss.toFixed(4); dom.metricEpoch.textContent=state.currentEpoch;
      dom.progressFill.style.width=(p*100).toFixed(1)+'%'; dom.progressText.textContent=(p*100).toFixed(0)+'%';
      if(state.currentEpoch%3===0){fireForwardPass(); fireAllConnections();}
      if(state.currentEpoch===1)addLog('Training started — '+state.epochs+' epochs');
      if(state.currentEpoch===Math.floor(state.epochs*0.25))addLog(`Epoch ${state.currentEpoch}: accuracy ${(cAcc*100).toFixed(0)}%, loss ${cLoss.toFixed(4)}`);
      if(state.currentEpoch===Math.floor(state.epochs*0.5))addLog(`Epoch ${state.currentEpoch}: accuracy ${(cAcc*100).toFixed(0)}%, loss ${cLoss.toFixed(4)} — halfway there`);
      if(state.currentEpoch===Math.floor(state.epochs*0.75))addLog(`Epoch ${state.currentEpoch}: accuracy ${(cAcc*100).toFixed(0)}%, loss ${cLoss.toFixed(4)} — converging`);
      if(state.currentEpoch%5===0||state.currentEpoch===state.epochs)drawChart();
      state.trainingTimer=setTimeout(step,20+p*40);
    }
    step();
  }
  function finishTraining(){
    state.training=false; dom.btnBuild.disabled=false; dom.btnRandomize.disabled=false; dom.trainStatus.textContent='Complete'; dom.trainStatus.classList.remove('training');
    dom.progressFill.style.width='100%'; dom.progressText.textContent='100%';
    if(state.accuracyHistory.length>0){ const fA=state.accuracyHistory[state.accuracyHistory.length-1],fL=state.lossHistory[state.lossHistory.length-1]; dom.metricAccuracy.textContent=(fA*100).toFixed(1)+'%'; dom.metricLoss.textContent=fL.toFixed(4); dom.metricEpoch.textContent=state.epochs; addLog('Training complete — final accuracy: '+(fA*100).toFixed(1)+'%, loss: '+fL.toFixed(4)); }
    drawChart(); fireForwardPass(); fireAllConnections();
    dom.btnBuild.style.animation='none'; dom.btnBuild.offsetHeight; dom.btnBuild.style.animation='btnVictory 0.6s ease'; setTimeout(()=>{dom.btnBuild.style.animation='';},600);
  }
  function stopTraining(){ state.training=false; if(state.trainingTimer){clearTimeout(state.trainingTimer); state.trainingTimer=null;} dom.btnBuild.disabled=false; dom.btnRandomize.disabled=false; dom.trainStatus.textContent='Stopped'; dom.trainStatus.classList.remove('training'); }

  dom.btnRandomize.addEventListener('click',randomizeColumns);
  dom.btnBuild.addEventListener('click',()=>{ if(state.training){stopTraining(); dom.btnBuild.innerHTML='<i class="fas fa-hammer"></i> Build & Train'; return; } dom.btnBuild.innerHTML='<i class="fas fa-stop"></i> Stop Training'; buildNetwork(); });
  dom.activation.addEventListener('change',()=>{ readAdvancedSettings(); updateSummary(); });
  dom.learningRate.addEventListener('input',()=>{ state.learningRate=parseFloat(dom.learningRate.value); dom.lrValue.textContent=state.learningRate.toFixed(3); updateSummary(); });
  dom.epochs.addEventListener('input',()=>{ state.epochs=parseInt(dom.epochs.value); dom.epochValue.textContent=state.epochs; dom.metricTotalEpochs.textContent=`/ ${state.epochs}`; updateSummary(); });
  dom.datasetSize.addEventListener('input',()=>{ state.datasetSize=parseInt(dom.datasetSize.value); dom.datasetValue.textContent=state.datasetSize.toLocaleString(); });

  function refreshColumnDimensions(){
    Object.keys(columnState).forEach((key) => {
      const cs = columnState[key];
      if (!cs || !cs.items[0]) return;
      cs.itemHeight = cs.items[0].offsetHeight;
      cs.windowH = cs.win.offsetHeight;
      positionColumn(key);
    });
  }

  let resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(refreshColumnDimensions, 150);
  });

  function init(){ initSlotColumns(); updateSummary(); dom.progressWrap.style.display='none'; drawChart(); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
