import { Request, Response } from "express";
import { BoletoInvalidRow } from "../../src/errors/tickerErrors";
import { BoletoService } from "../../src/services/boletoService";
import { BoletoController } from "../../src/controller/boletoController";

jest.mock("express");

describe("userController", () => {
  const boletoService = {} as BoletoService;
  const boletoController = new BoletoController(boletoService);

  const req = {} as Request;
  const res = {} as jest.Mocked<Response>;

  beforeAll(() => {
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.sendStatus = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.setHeader = jest.fn().mockReturnThis();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTicket", () => {
    it("should ticker and response 200", async () => {
      boletoService.getTicket = jest.fn().mockResolvedValue({});
      req.params = { code: "21290001192110001210904475617405975870000002000" };

      await boletoController.getTicket(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });
    it("should ticker and response 400", async () => {
      const mockErro = new BoletoInvalidRow("Invalid checker type");
      boletoService.getTicket = jest.fn().mockRejectedValue(mockErro);
      req.params = { code: "21290001192110001210904475617405975870000002000" };

      await boletoController.getTicket(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid checker type" });
    });
    it("should erro ", async () => {
      const mockError = new Error("Erro");
      boletoService.getTicket = jest.fn().mockRejectedValue(mockError);
      await expect(boletoController.getTicket(req, res)).rejects.toBe(mockError);
    });
  });
});
