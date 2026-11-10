(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KdramaTime=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  function parse(value){
    const text=String(value??'').trim();if(!text)return null;
    if(!/^\d+(?::\d{2}){0,2}$/.test(text))throw Error('时间请输入秒数、分:秒（12:34）或时:分:秒（01:12:34）。');
    const parts=text.split(':').map(Number);
    if(parts.slice(1).some(n=>n>59))throw Error('冒号后的分钟或秒数应为 00–59。');
    const seconds=parts.reduce((total,n)=>total*60+n,0);
    if(!Number.isInteger(seconds)||seconds>100000)throw Error('播放时间应在 0–100000 秒之间。');
    return seconds;
  }
  function format(value){if(value==null||value==='')return '';const n=Number(value);if(!Number.isInteger(n)||n<0)return String(value);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
  function filename(name){
    // Only explicit timestamps: mm:ss, hh:mm:ss, or hh.mm.ss / hh_mm_ss / hh-mm-ss.
    const stem=String(name).replace(/\.(png|jpe?g|webp)$/i,'');
    const match=stem.match(/(?:^|[^\d])((\d{1,2})([:._-])(\d{2})\3(\d{2}))(?!\d)/);
    if(match){if(Number(match[2])>27)return null;try{return parse(`${match[2]}:${match[4]}:${match[5]}`);}catch{return null;}}
    const short=stem.match(/(?:^|[^\d])(\d{1,3}:\d{2})(?!\d)/);try{return short?parse(short[1]):null;}catch{return null;}
  }
  return {parse,format,filename};
});
