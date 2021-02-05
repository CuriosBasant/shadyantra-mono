interface String {
  isLowerCase(): boolean;
  isUpperCase(): boolean;
  isNumber(): boolean;
  toCamelCase(): string;
}

String.prototype.isLowerCase = function () {
  return this === this.toLowerCase();
};
String.prototype.isUpperCase = function () {
  return !this.isLowerCase();
};
String.prototype.isNumber = function () {
  return !isNaN(+this);
};
String.prototype.toCamelCase = function () {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g,
    (ltr, idx) => idx == 0 ? ltr.toLowerCase() : ltr.toUpperCase()
  ).replace(/\s+|-/g, '');
};