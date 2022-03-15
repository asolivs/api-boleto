import { Service } from "typedi";
import { BoletoInvalidRow } from "../errors/tickerErrors";
import { BoletoResponsDto } from "../dto/boletoResponseDto";
import { strrev } from "../../src/utils/utils";
import { toDateString, isValidDate, endingOfDay } from "../utils/date";

@Service("boletoService")
export class BoletoService {
  public constructor() {}

  private modulo10(barCodeNotDv: string | string[], dv: number) {
    barCodeNotDv = strrev(barCodeNotDv as string);
    barCodeNotDv = barCodeNotDv.split("");

    let summation = 0;

    barCodeNotDv.forEach((value, index) => {
      let resultToBeAdded: number = Number(value) * (index % 2 == 0 ? 2 : 1);
      if (resultToBeAdded > 9) {
        resultToBeAdded = Number(
          resultToBeAdded
            .toString()
            .split("")
            .reduce((add, current) => (Number(add) + Number(current)).toString())
        );
        summation += resultToBeAdded;
      } else {
        summation += resultToBeAdded;
      }
    });

    let remainderUpperTen = summation % 10;

    const DAC = remainderUpperTen !== 0 ? 10 - remainderUpperTen : remainderUpperTen;
    if (dv !== DAC) {
      throw new BoletoInvalidRow("Invalid checker type");
    }
  }
  private modulo11(barCode: string | string[], dv: number, type: "banking" | "covenant") {
    barCode = strrev(barCode as string);
    barCode = barCode.split("");

    let summation = 0;
    let count = 2;
    barCode.forEach((number) => {
      summation += Number(number) * count;
      count = count > 8 ? 2 : (count += 1);
    });
    let DAC = summation % 11;
    if (type === "banking") {
      DAC = 11 - DAC;
      DAC = [0, 10, 11].includes(DAC) ? 1 : DAC;
    }
    if (type === "covenant") {
      if (DAC == 0 || DAC == 1) DAC = 0;
      else if (DAC == 10) DAC = 1;
      else DAC = 11 - DAC;
    }
    if (dv !== DAC) {
      throw new BoletoInvalidRow("Invalid checker type");
    }
  }

  convertDigitavelToBarCode(barCode: string[]): string {
    barCode.splice(11, 1);
    barCode.splice(22, 1);
    barCode.splice(33, 1);
    barCode.splice(44, 1);
    return barCode.join("");
  }

  validateModuleConvenio(type: string, dv: number, barCodeSemDv: string) {
    var isModulo10 = ["6", "7"].indexOf(type) != -1;
    if (isModulo10) {
      this.modulo10(barCodeSemDv, dv);
    } else {
      this.modulo11(barCodeSemDv, dv, "covenant");
    }
  }
  covenant(barCode: string) {
    barCode = this.convertDigitavelToBarCode(barCode.split(""));
    const barCodeSemDv = barCode.split("");
    barCodeSemDv.splice(3, 1);

    this.validateModuleConvenio(barCode[2], Number(barCode[3]), barCodeSemDv.join(""));

    const year = barCode.substr(19, 4);
    const mouth = barCode.substr(23, 2);
    const day = barCode.substr(25, 2);
    const data = `${year}-${mouth}-${day}`;
    return {
      barCode: barCode,
      amount: (Number(barCode.substr(4, 11)) / 100).toFixed(2),
      expirationDate: isValidDate(data) ? toDateString(new Date(endingOfDay(data)), "YYYY-MM-DD") : "",
    };
  }

  banking(code: string) {
    var barCode =
      code.substr(0, 4) +
      code.substr(32, 1) +
      code.substr(33, 14) +
      code.substr(4, 5) +
      code.substr(10, 10) +
      code.substr(21, 10);
    var blocos0 = code.substr(0, 10);
    var blocos1 = code.substr(10, 11);
    var blocos2 = code.substr(21, 11);
    if (barCode.length != 44) {
      throw new BoletoInvalidRow("length != 44");
    }
    var barCode43: string | string[] = barCode.substr(0, 4) + barCode.substr(5, 39);
    this.modulo10(blocos0.substr(0, 9), Number(blocos0[blocos0.length - 1]));
    this.modulo10(blocos1.substr(0, 10), Number(blocos1[blocos1.length - 1]));
    this.modulo10(blocos2.substr(0, 10), Number(blocos2[blocos2.length - 1]));

    this.modulo11(barCode43, Number(barCode[4]), "banking");

    const dateBase = new Date(1997, 9, 7);
    const dueDate = Number(code.substr(33, 4));

    dateBase.setDate(dateBase.getDate() + dueDate);

    return {
      barCode,
      amount: (Number(code.substr(37, 10)) / 100).toFixed(2),
      expirationDate: toDateString(dateBase, "YYYY-MM-DD"),
    };
  }

  public async getTicket(code: string): Promise<BoletoResponsDto> {
    const barCode = code[0] !== "8" ? this.banking(code) : this.covenant(code);
    return barCode as BoletoResponsDto;
  }
}
