(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const ot=t=>t!=null&&typeof t=="object"||!1,Q=t=>ot(t)&&typeof t.nodeType=="number"&&[1,2,3,4,5,6,7,8,9,10,11].some(e=>t.nodeType===e)||!1,U=t=>Q(t)&&t.nodeType===1||!1,mt=t=>typeof t=="string"||!1,bt=t=>ot(t)&&t.constructor.name==="Window"||!1,gt=t=>Q(t)&&t.nodeType===9||!1,wt=t=>bt(t)?t.document:gt(t)?t:Q(t)?t.ownerDocument:globalThis.document,yt=(t,...e)=>Object.assign(t,...e),vt=(t,e)=>{const n=getComputedStyle(t),i=e.replace("webkit","Webkit").replace(/([A-Z])/g,"-$1").toLowerCase();return n.getPropertyValue(i)},xt=t=>Object.entries(t),V=(t,e)=>{xt(e).forEach(([n,i])=>{if(i&&mt(n)&&n.includes("--"))t.style.setProperty(n,i);else{const o={};o[n]=i,yt(t.style,o)}})},nt=t=>U(t)&&"offsetWidth"in t||!1,Et=(t,e)=>{const{width:n,height:i,top:o,right:r,bottom:c,left:l}=t.getBoundingClientRect();let a=1,h=1;if(nt(t)){const{offsetWidth:f,offsetHeight:s}=t;a=f>0?Math.round(n)/f:1,h=s>0?Math.round(i)/s:1}return{width:n/a,height:i/h,top:o/h,right:r/a,bottom:c/h,left:l/a,x:l/a,y:o/h}},_t=t=>wt(t).documentElement,Lt=t=>typeof t=="function"||!1,qt="1.0.2",tt="PositionObserver Error";class st{entries;static version=qt;_tick;_root;_callback;constructor(e,n){if(!Lt(e))throw new Error(`${tt}: ${e} is not a function.`);this.entries=new Map,this._callback=e,this._root=U(n?.root)?n.root:document?.documentElement,this._tick=0}observe=e=>{if(!U(e))throw new Error(`${tt}: ${e} is not an instance of Element.`);/* istanbul ignore else @preserve - a guard must be set */this._root.contains(e)&&this._new(e).then(n=>{/* istanbul ignore else @preserve - don't allow duplicate entries */this.getEntry(e)||this.entries.set(e,n);/* istanbul ignore else @preserve */this._tick||(this._tick=requestAnimationFrame(this._runCallback))})};unobserve=e=>{/* istanbul ignore else @preserve */this.entries.has(e)&&this.entries.delete(e)};_runCallback=()=>{/* istanbul ignore if @preserve - a guard must be set */if(!this.entries.size)return;const e=new Promise(n=>{const i=[];this.entries.forEach(({target:o,boundingClientRect:r})=>{/* istanbul ignore if @preserve - a guard must be set when target has been removed */this._root.contains(o)&&this._new(o).then(({boundingClientRect:c,isVisible:l})=>{const{left:a,top:h,bottom:f,right:s}=c;if(r.top!==h||r.left!==a||r.right!==s||r.bottom!==f){const b={target:o,boundingClientRect:c,isVisible:l};this.entries.set(o,b),i.push(b)}})}),n(i)});this._tick=requestAnimationFrame(async()=>{const n=await e;/* istanbul ignore else @preserve */n.length&&this._callback(n,this),this._runCallback()})};_new=e=>{const{clientWidth:n,clientHeight:i}=this._root;return new Promise(o=>{new IntersectionObserver(([{boundingClientRect:c}],l)=>{l.disconnect();const{left:a,top:h,bottom:f,right:s,width:b,height:T}=c,X=h>1-T&&a>1-b&&f<=i+T-1&&s<=n+b-1;o({target:e,isVisible:X,boundingClientRect:c})}).observe(e)})};getEntry=e=>this.entries.get(e);disconnect=()=>{cancelAnimationFrame(this._tick),this.entries.clear(),this._tick=0}}const Ct={top:"top",bottom:"bottom",left:"start",right:"end"},it=t=>{const e=/\b(top|bottom|start|end)+/,{element:n,tooltip:i,container:o,arrow:r}=t;if(!i)return;V(i,{top:"",left:"",right:"",bottom:""});const{offsetWidth:c,offsetHeight:l}=i,{clientWidth:a,clientHeight:h,offsetWidth:f}=_t(n);let s="top";const{clientWidth:b,offsetWidth:T}=o,ut=vt(o,"position")==="fixed",ft=Math.abs(ut?b-T:a-f),Y=0,R=a-ft-1,B=t?._observer?.getEntry(n),{width:g,height:u,left:L,right:pt,top:x}=B?B.boundingClientRect:Et(n),{x:k,y:q}={x:L,y:x};V(r,{top:"",left:"",right:"",bottom:""});let w=0,C="",p=0,j="",E="",A="",z="";const O=r.offsetWidth||0,_=r.offsetHeight||0,I=O/2;let P=x-l-_<0,S=x+l+u+_>=h,W=L-c-O<Y,$=L+c+g+O>=R;const M=["left","right"],K=["top","bottom"];P=M.includes(s)?x+u/2-l/2-_<0:P,S=M.includes(s)?x+l/2+u/2+_>=h:S,W=K.includes(s)?L+g/2-c/2<Y:W,$=K.includes(s)?L+c/2+g/2>=R:$,s=M.includes(s)&&W&&$?"top":s,s=s==="top"&&P?"bottom":s,s=s==="bottom"&&S?"top":s,s=s==="left"&&W?"right":s,s=s==="right"&&$?"left":s,i.className.includes(s)||(i.className=i.className.replace(e,Ct[s]));// istanbul ignore else @preserve
M.includes(s)?(s==="left"?p=k-c-0:p=k+g+0,P&&S?(w=0,C=0,E=x+u/2-_/2):P?(w=q,C="",E=u/2-O):S?(w=q-l+u,C="",E=l-u/2-O):(w=q-l/2+u/2,E=l/2-_/2)):K.includes(s)&&(s==="top"?w=q-l-0:w=q+u+0,W?(p=0,A=k+g/2-I):$?(p="auto",j=0,z=g/2+R-pt-I):(p=k-c/2+g/2,A=c/2-I)),V(i,{top:`${w}px`,bottom:C===""?"":`${C}px`,left:p==="auto"?p:`${p}px`,right:j!==""?`${j}px`:""});// istanbul ignore else @preserve
nt(r)&&(E!==""&&(r.style.top=`${E}px`),A!==""?r.style.left=`${A}px`:z!==""&&(r.style.right=`${z}px`))},Ot=t=>{console.log(void 0,t);const e=t.target.closest("button");if(e){const n=e.textContent?.trim(),i=e.dataset.cli,[o]=n.split(/\s/);navigator.clipboard.writeText(i),alert(`${o} installation CLI was copied to clipboard`)}};window.PositionObserver=st;const Z=document.querySelector('[data-test="tooltip1"]'),rt=document.querySelector('[data-test="tooltip2"]'),Pt=document.querySelector(".bench-average1"),St=document.querySelector(".bench-max1"),Wt=document.querySelector(".bench-average2"),$t=document.querySelector(".bench-max2"),y=document.querySelector(".tooltip.first"),Tt=y.querySelector(".tooltip-arrow"),v=document.querySelector(".tooltip.second"),kt=v.querySelector(".tooltip-arrow"),ct=document.body;let m=null,F=0,H=0;const d=[],lt=()=>{const t=d.length;let e=0;for(let o=0;o<t;o+=1)e+=d[o];const n=(e/t*1e3).toFixed(2),i=(Math.max(...d)*1e3).toFixed(2);return{average:n,max:i}},at=t=>{t.classList.remove("d-none"),t.classList.add("show")},N=t=>{t.classList.add("d-none"),t.classList.remove("show")},G=t=>{const e=t?"addEventListener":"removeEventListener";window[e]("scroll",et,{passive:!0}),window[e]("resize",et,{passive:!0})},ht=()=>it({element:Z,container:ct,tooltip:y,arrow:Tt,_observer:J}),dt=()=>it({element:rt,container:ct,tooltip:v,arrow:kt,_observer:null}),et=t=>{if(F=window.performance.now(),requestAnimationFrame(dt),d.length<500)H=window.performance.now(),d.push(H-F);else{m=null,N(v),G();const{average:e,max:n}=lt();Wt.textContent=e+"µ",$t.textContent=n+"µ",d.length=0}},J=new st((t,e)=>{if(F=window.performance.now(),requestAnimationFrame(ht),d.length<500)H=window.performance.now(),d.push(H-F);else{m=null,N(y),e.disconnect();const{average:n,max:i}=lt();Pt.textContent=n+"µ",St.textContent=i+"µ",d.length=0}});Z.addEventListener("click",t=>{m===y?(J.disconnect(),N(y),d.length=0,m=null):(m=y,at(y),ht(),J.observe(Z))});rt.addEventListener("click",t=>{m===v?(G(),N(v),d.length=0,m=null):(m=v,at(v),dt(),G(!0))});const At=document.querySelector(".navbar-toggler"),Mt=document.querySelector(".navbar-collapse");let D=!1;const Ft=()=>{Mt.classList.toggle("show",!D),D=!D};At.addEventListener("click",Ft);document.querySelectorAll(".btn.font-monospace").forEach(t=>t.addEventListener("click",Ot));