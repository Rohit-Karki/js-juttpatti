export class Card {
  x = 0;
  y = 0;
  color = null;
  type = null;
  value = null;

  constructor(type, value, color) {
    this.type = type;
    this.value = value;
    this.color = color;
  }

  animate(from, to) {
    this.x = to.x;
    this.y = to.y;
  }
}
