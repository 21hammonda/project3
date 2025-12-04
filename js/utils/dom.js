export function qs(sel, parent=document) {
    return parent.querySelector(sel);
}
  
export function qsa(sel, parent=document) {
    return [...parent.querySelectorAll(sel)];
}
  