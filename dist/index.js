var PositionObserver=function(){"use strict";const _=e=>e!=null&&typeof e=="object"||!1,f=e=>_(e)&&typeof e.nodeType=="number"&&[1,2,3,4,5,6,7,8,9,10,11].some(t=>e.nodeType===t)||!1,c=e=>f(e)&&e.nodeType===1||!1,b=e=>typeof e=="function"||!1,m="1.0.6",h="PositionObserver Error";class v{entries;static version=m;_tick;_root;_callback;constructor(t,i){if(!b(t))throw new Error(`${h}: ${t} is not a function.`);this.entries=new Map,this._callback=t,this._root=c(i?.root)?i.root:document?.documentElement,this._tick=0}observe=t=>{if(!c(t))throw new Error(`${h}: ${t} is not an instance of Element.`);this._root.contains(t)&&this._new(t).then(({boundingClientRect:i})=>{if(i&&!this.getEntry(t)){const{clientWidth:s,clientHeight:n}=this._root;this.entries.set(t,{target:t,boundingClientRect:i,clientWidth:s,clientHeight:n})}this._tick||(this._tick=requestAnimationFrame(this._runCallback))})};unobserve=t=>{this.entries.has(t)&&this.entries.delete(t)};_runCallback=()=>{if(!this.entries.size)return;const{clientWidth:t,clientHeight:i}=this._root,s=new Promise(n=>{const r=[];this.entries.forEach(({target:o,boundingClientRect:u,clientWidth:w,clientHeight:k})=>{this._root.contains(o)&&this._new(o).then(({boundingClientRect:l,isIntersecting:p})=>{if(!p)return;const{left:d,top:y}=l;if(u.top!==y||u.left!==d||w!==t||k!==i){const a={target:o,boundingClientRect:l,clientHeight:i,clientWidth:t};this.entries.set(o,a),r.push(a)}})}),n(r)});this._tick=requestAnimationFrame(async()=>{const n=await s;n.length&&this._callback(n,this),this._runCallback()})};_new=t=>new Promise(i=>{new IntersectionObserver(([n],r)=>{r.disconnect(),i(n)}).observe(t)});getEntry=t=>this.entries.get(t);disconnect=()=>{cancelAnimationFrame(this._tick),this.entries.clear(),this._tick=0}}return v}();
//# sourceMappingURL=index.js.map
