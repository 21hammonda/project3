// Global event bus (very small but very powerful)
export const Events = new EventTarget();

export function emit(name, detail = {}) {
  Events.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on(name, handler) {
  Events.addEventListener(name, handler);
}
