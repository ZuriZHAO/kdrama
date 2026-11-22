document.addEventListener('error',event=>{
  const img=event.target;if(!(img instanceof HTMLImageElement))return;
  const failed=img.getAttribute('src');if(!failed)return;
  const original=img.dataset.fallback;
  if(original&&original!==failed){img.src=original;return;}
  img.removeAttribute('src');img.alt='图片暂不可用';img.classList.add('image-unavailable');
},true);
