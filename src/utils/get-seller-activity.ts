export function getSellerActivityData(year: number) {
  if (year < 1) {
    return 'меньше года'
  }
  if (10 <= year % 100 && year % 100 <= 20) {
    return `${year} лет`
  }
  if (year % 10 === 1) {
    return `${year} год`
  }
  if ([2, 3, 4].includes(year % 10)) {
    return `${year} года`
  }
  return `${year} лет`
}
