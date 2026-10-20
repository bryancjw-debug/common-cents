export const STEP_MOTION_MS = 1100;

export function leaveStep(element: HTMLElement | null, direction: number) {
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const parent = element.parentElement!;
  const rect = element.getBoundingClientRect();
  const bounds = parent.getBoundingClientRect();
  const copy = element.cloneNode(true) as HTMLElement;
  copy.setAttribute('aria-hidden', 'true');
  copy.inert = true;
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
  Object.assign(copy.style, { position:'absolute', left:`${rect.left-bounds.left}px`, top:`${rect.top-bounds.top}px`, width:`${rect.width}px`, pointerEvents:'none', zIndex:'2' });
  parent.append(copy);
  const animation = copy.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:`translateY(${-80*direction}px)`}], {duration:STEP_MOTION_MS*.5,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});
  const timer = window.setTimeout(() => copy.remove(), STEP_MOTION_MS);
  return () => { clearTimeout(timer); animation.cancel(); copy.remove(); };
}

export function enterStep(element: HTMLElement | null, direction: number) {
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const animation = element.animate([{opacity:0,transform:`translateY(${80*direction}px)`},{opacity:0,transform:`translateY(${60*direction}px)`,offset:.2},{opacity:1,transform:'translateY(0)'}], {duration:STEP_MOTION_MS,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
  animation.onfinish = () => animation.cancel();
  return () => animation.cancel();
}
