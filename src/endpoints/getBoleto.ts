import { BoletoController } from "../controller/boletoController";
import { Container } from "typedi";

const controller = Container.get<BoletoController>("boletoController");
exports.handler = controller.getTicket.bind(controller);
