"use strict";const _=i=>i!=null&&typeof i=="object"||!1,f=i=>_(i)&&typeof i.nodeType=="number"&&[1,2,3,4,5,6,7,8,9,10,11].some(t=>i.nodeType===t)||!1,b=i=>f(i)&&i.nodeType===1||!1,d=i=>typeof i=="function"||!1,g="PositionObserver Error";class m{entries;_tick;_root;_callback;constructor(t,n){if(!d(t))throw new Error(`${g}: ${t} is not a function.`);this.entries=[],this._callback=t,this._root=b(n?.root)?n.root:document?.documentElement,this._tick=0}observe=t=>{if(!b(t))throw new Error(`${g}: ${t} is not an instance of HTMLElement.`);if(!this._root.contains(t))return;const n=this._getTargetEntry(t);this.entries.push(n),this._tick||(this._tick=requestAnimationFrame(this._runCallback))};unobserve=t=>{const n=this.entries.findIndex(e=>e.target===t);this.entries.splice(n,1)};_runCallback=()=>{if(!this.entries.length)return;const t=[];this.entries.forEach((n,e)=>{const{target:o,boundingBox:s}=n;if(!this._root.contains(o))return;const{boundingBox:r,isVisible:c}=this._getTargetEntry(o),{left:u,top:h,bottom:l,right:a}=r;(s.left!==u||s.top!==h||s.right!==a||s.bottom!==l)&&(this.entries[e].boundingBox=r,this.entries[e].isVisible=c,t.push({target:o,boundingBox:r,isVisible:c}))}),t.length&&this._callback(t),requestAnimationFrame(this._runCallback)};_getTargetEntry=t=>{const{clientWidth:n,clientHeight:e}=this._root,o=t.getBoundingClientRect(),{left:s,top:r,bottom:c,right:u,width:h,height:l}=o,a=r>1-l&&s>1-h&&c<=e+l-1&&u<=n+h-1;return{target:t,isVisible:a,boundingBox:o}};disconnect=()=>{cancelAnimationFrame(this._tick),this.entries.length=0,this._tick=0}}module.exports=m;
//# sourceMappingURL=index.cjs.map
