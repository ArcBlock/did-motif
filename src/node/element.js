export default class Element {
  constructor(name, attrs = {}, children = []) {
    const { style = {}, ...rest } = attrs;
    this.name = name;
    this.attrs = rest;
    this.style = style;
    this.children = Array.isArray(children) ? children : [children];
  }

  appendChild(child) {
    this.children.push(child);
  }

  getAttribute() {}

  setAttribute(key, value) {
    this.attrs[key] = value;
  }

  kebabize(str) {
    return str
      .split('')
      .map((letter, idx) => {
        return letter.toUpperCase() === letter
          ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
          : letter;
      })
      .join('');
  }

  getAttrsStr() {
    return Object.keys(this.attrs)
      .filter(key => this.attrs[key] !== undefined)
      .map(key => `${key}="${this.attrs[key]}"`)
      .join(' ');
  }

  getStyleStr() {
    if (Object.keys(this.style).length === 0) {
      return '';
    }
    return `style="${Object.keys(this.style)
      .filter(key => this.style[key] !== undefined)
      .map(key => `${this.kebabize(key)}:${this.style[key]}`)
      .join(';')}"`;
  }

  toString() {
    return `<${this.name} ${this.getAttrsStr()} ${this.getStyleStr()}>${this.children
      .map(item => item.toString())
      .join('')}</${this.name}>`;
  }
}
