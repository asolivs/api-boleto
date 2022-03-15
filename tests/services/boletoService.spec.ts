import { BoletoInvalidRow } from "../../src/errors/tickerErrors";
import { BoletoService } from "../../src/services/boletoService";

jest.mock("express");

describe("boletoServices", () => {
  const boletoService = new BoletoService();

  beforeAll(() => {});

  beforeEach(() => {});

  describe("getTicket", () => {
    it("validate banking", async () => {
      const digitableLine = "21290001192110001210904475617405975870000002000";
      const response = await boletoService.getTicket(digitableLine);
      expect(response.barCode).toBe("21299758700000020000001121100012100447561740");
      expect(response.amount).toBe("20.00");
      expect(response.expirationDate).toBe("2018-07-16");
    });

    it("validate banking code", async () => {
      const digitableLine = "00190500954014481606906809350314337370000000100";
      const response = await boletoService.getTicket(digitableLine);
      expect(response.barCode).toBe("00193373700000001000500940144816060680935031");
      expect(response.amount).toBe("1.00");
      expect(response.expirationDate).toBe("2007-12-31");
    });

    it("Should get erro return Invalid checker type", async () => {
      const mockErro = new BoletoInvalidRow("Invalid checker type");
      const digitableLine = "212900001112110001210904475617405975870000002000";
      await expect(boletoService.getTicket(digitableLine)).rejects.toEqual(mockErro);
    });
    it("Should get erro return length != 44", async () => {
      const mockErro = new BoletoInvalidRow("length != 44");
      const digitableLine = "212910001192110001210904475617405975870000002";
      await expect(boletoService.getTicket(digitableLine)).rejects.toEqual(mockErro);
    });

    it("Should get return validate covenant modulo 10", async () => {
      const digitableLine = "826100000007313137422025202200301200005234350014";
      const response = await boletoService.getTicket(digitableLine);
      expect(response.barCode).toBe("82610000000313137422022022003012000523435001");
      expect(response.amount).toBe("31.31");
      expect(response.expirationDate).toBe("2022-02-20");
    });

    it("validate covenant modulo 11", async () => {
      const digitableLine = "858700000014812401312024204081250610859526077000";
      const response = await boletoService.getTicket(digitableLine);
      expect(response.barCode).toBe("85870000001812401312022040812506185952607700");
      expect(response.amount).toBe("181.24");
      expect(response.expirationDate).toBe("2022-04-08");
    });

    it("thorw erro return Invalid checker type - module 11", async () => {
      const mockErro = new BoletoInvalidRow("Invalid checker type");
      const digitableLine = "858600000014812401312024204081250610859526077000";
      await expect(boletoService.getTicket(digitableLine)).rejects.toEqual(mockErro);
    });

    it("validate covenant not have date", async () => {
      const digitableLine = "836400000011331201380002812884627116080136181551";
      const response = await boletoService.getTicket(digitableLine);
      expect(response.barCode).toBe("83640000001331201380008128846271108013618155");
      expect(response.amount).toBe("133.12");
      expect(response.expirationDate).toBe("");
    });
  });
});
