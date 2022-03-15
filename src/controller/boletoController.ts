import { Request, Response } from "express";
import { Inject, Service } from "typedi";
import { BoletoService } from "../services/boletoService";
import { BoletoInvalidRow } from "../errors/tickerErrors";

@Service("boletoController")
export class BoletoController {
  private boletoService: BoletoService;

  public constructor(@Inject("boletoService") boletoService: BoletoService) {
    this.boletoService = boletoService;
  }

  public async getTicket(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const ticker = await this.boletoService.getTicket(code);

      res.status(200).json(ticker);
    } catch (e) {
      if (e instanceof BoletoInvalidRow) {
        res.status(400).json({ message: e.message });
      } else {
        throw e;
      }
    }
  }
}
