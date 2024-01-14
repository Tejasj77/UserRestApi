export function keyToCamelCase(str: string) {
  return str.replace(/_([a-z])/g, (chars) => chars[1].toUpperCase());
}
