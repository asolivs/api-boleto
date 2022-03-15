import { isValidDate, toDateString } from "../../src/utils/date";

describe("date", () => {
  describe("isValidDate", () => {
    it("valid date", async () => {
      const test = isValidDate("2020-01-01");
      expect(test).toBe(true);
    });

    it("invalid date", async () => {
      const test = isValidDate("2020-02-31");
      expect(test).toBe(false);
    });

    it("invalid date range error", async () => {
      const test = isValidDate("2020-00-31");
      expect(test).toBe(false);
    });
  });

  describe("toDateString", () => {
    it("Converter Date para formato DD/MM/YYYY", () => {
      const date = new Date(1603829350485); // Tue, 27 Oct 2020 20:09:10 GMT

      const fullDate = toDateString(date, "DD/MM/YYYY");
      expect(fullDate).toEqual("27/10/2020");
    });

    it("Converter Date para formato MM/YYYY", () => {
      const date = new Date(1603829350485); // Tue, 27 Oct 2020 20:09:10 GMT

      const fullDate = toDateString(date, "MM/YYYY");
      expect(fullDate).toEqual("10/2020");
    });

    it("Converter Date para formato YYYY-MM-DD", () => {
      const date = new Date(1603829350485); // Tue, 27 Oct 2020 20:09:10 GMT

      const fullDate = toDateString(date);
      expect(fullDate).toEqual("2020-10-27");
    });

    it("Converter Date para formato YYYY-MM", () => {
      const date = new Date(1603829350485); // Tue, 27 Oct 2020 20:09:10 GMT

      const fullDate = toDateString(date, "YYYY-MM");
      expect(fullDate).toEqual("2020-10");
    });

    it("Converter Date para formato ISO", () => {
      const date = new Date(1603829350485); // Tue, 27 Oct 2020 20:09:10 GMT

      const iso = toDateString(date, "ISO");
      expect(iso).toEqual("2020-10-27T17:09:10.485");
    });
  });
});
