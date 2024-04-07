export const getDate = (daysBack: number): string => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const timestamp = today.getTime() - oneDay * daysBack
    const result = dateToString(new Date(timestamp))
    return result
}

function dateToString(date: Date) {
    return `${date.getFullYear()}-${
      date.getMonth().toLocaleString().length === 1
        ? "0" + (date.getMonth() + 1)
        : date.getMonth()
    }-${
      date.getDate().toLocaleString().length === 1
        ? "0" + date.getDate()
        : date.getDate()
    }`;
  }