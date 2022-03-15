import "reflect-metadata";
import { config } from "dotenv";
config();
import { createConnection } from "typeorm";
import bodyParser from "body-parser";
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import monitor from "express-status-monitor";
import { expressMiddleware, id } from "cls-rtracer";
import morgan from "morgan";
import cors from "cors";

morgan.token("reqId", (req: Request) => req.get("X-Request-Id") || String(id()));

class App {
  public async configure(): Promise<void> {
    //await createConnection();//Desativado conexão com banco

    require("./dependencias");

    const app = express();
    app.use(
      cors({
        exposedHeaders: ["forbbiden-reason"],
      })
    );
    app.use(monitor());

    const swaggerDocument = YAML.load("./api-spec.yaml");
    app.use("/test-api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.use(bodyParser.json({ limit: "5mb" }));
    app.use(expressMiddleware({ useHeader: true }));
    app.use(
      morgan(
        `:reqId :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
      )
    );

    // const middleware = Container.get<LoggerMiddleware>("loggerMiddleware");
    // app.use(middleware.registrarLog.bind(middleware));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerRoutes = require("swagger-routes");
    swaggerRoutes(app, {
      api: "./api-spec.yaml",
      handlers: {
        path: "./build/src/endpoints",
        template: "templates/controller.mustache",
        generate: false,
        group: false,
      },
    });

    app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
      if (error && (error as any).statusCode) {
        res.status((error as any).statusCode).json({ error: error.message });
      } else if (error) {
        res.status(500).json({ error: error.message });
      } else {
        next(error);
      }
    });

    app.listen(8000);
  }
}

const initializer = new App();
initializer
  .configure()
  .then(() => {
    console.log("Running ...");
  })
  .catch((error) => {
    console.log("Unexpected error", error);
    process.exit(1);
  });
