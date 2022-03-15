type DateFormat =
  | "DD/MM/YYYY"
  | "MM/YYYY"
  | "YYYY-MM-DD"
  | "YYYY-MM"
  | "DD/MM/YYYY HH:mm:ss"
  | "DD/MM/YYYY HH:mm"
  | "ISO";

export function beginningOfDay(data: string): string {
  return data.concat("T00:00:00.000");
}

export function endingOfDay(data: string): string {
  return data.concat("T23:59:59.999");
}

export const toDateString = (dateInput: Date, format: DateFormat = "YYYY-MM-DD"): string => {
  const date = `00${dateInput.getDate()}`.slice(-2);
  const month = `00${dateInput.getMonth() + 1}`.slice(-2);
  const year = `0000${dateInput.getFullYear()}`.slice(-4);

  const hours = dateInput.getHours().toString().padStart(2, "0");
  const minutes = dateInput.getMinutes().toString().padStart(2, "0");
  const seconds = dateInput.getSeconds().toString().padStart(2, "0");
  const milliseconds = (dateInput.getMilliseconds() / 1000).toFixed(3).slice(2, 5);

  switch (format) {
    case "DD/MM/YYYY":
      return date + "/" + month + "/" + year;
    case "MM/YYYY":
      return month + "/" + year;
    case "YYYY-MM-DD":
      return year + "-" + month + "-" + date;
    case "YYYY-MM":
      return year + "-" + month;
    case "ISO":
      return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
};

export const isValidDate = (date: string): boolean => {
  if (date === toDateString(new Date(beginningOfDay(date)))) return true;
  return false;
};
