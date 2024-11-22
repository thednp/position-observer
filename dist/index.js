var PositionObserver=function(){"use strict";const a=e=>e!=null&&typeof e=="object"||!1,f=e=>a(e)&&typeof e.nodeType=="number"&&[1,2,3,4,5,6,7,8,9,10,11].some(t=>e.nodeType===t)||!1,o=e=>f(e)&&e.nodeType===1||!1,_=e=>typeof e=="function"||!1,b="1.0.3",c="PositionObserver Error";class l{entries;static version=b;_tick;_root;_callback;constructor(t,i){if(!_(t))throw new Error(`${c}: ${t} is not a function.`);this.entries=new Map,this._callback=t,this._root=o(i?.root)?i.root:document?.documentElement,this._tick=0}observe=t=>{if(!o(t))throw new Error(`${c}: ${t} is not an instance of Element.`);this._root.contains(t)&&this._new(t).then(i=>{i&&!this.getEntry(t)&&this.entries.set(t,i),this._tick||(this._tick=requestAnimationFrame(this._runCallback))})};unobserve=t=>{this.entries.has(t)&&this.entries.delete(t)};_runCallback=()=>{if(!this.entries.size)return;const t=new Promise(i=>{const r=[];this.entries.forEach(({target:s,boundingClientRect:n})=>{this._root.contains(s)&&this._new(s).then(({boundingClientRect:h,isIntersecting:m})=>{if(!m)return;const{left:v,top:w,bottom:k,right:p}=h;if(n.top!==w||n.left!==v||n.right!==p||n.bottom!==k){const u={target:s,boundingClientRect:h};this.entries.set(s,u),r.push(u)}})}),i(r)});this._tick=requestAnimationFrame(async()=>{const i=await t;i.length&&this._callback(i,this),this._runCallback()})};_new=t=>new Promise(i=>{new IntersectionObserver(([s],n)=>{n.disconnect(),i(s)}).observe(t)});getEntry=t=>this.entries.get(t);disconnect=()=>{cancelAnimationFrame(this._tick),this.entries.clear(),this._tick=0}}return l}();
//# sourceMappingURL=index.js.map
