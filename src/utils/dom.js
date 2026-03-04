// File: src/utils/dom.js
export function $(id) { return document.getElementById(id); }
export function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

export function on(el, evt, fn) { el.addEventListener(evt, fn); return el; }

export function setVal(id, val) {
  const el = $(id);
  if (el) el.value = val;
}

export function getVal(id) {
  const el = $(id);
  return el ? el.value : null;
}

export function setChecked(id, v) {
  const el = $(id);
  if (el) el.checked = v;
}

export function getChecked(id) {
  const el = $(id);
  return el ? el.checked : false;
}

export function setText(id, txt) {
  const el = $(id);
  if (el) el.textContent = txt;
}
