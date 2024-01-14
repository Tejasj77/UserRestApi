import config from "./config/config";
import { Db } from "./models/db";
import { app } from "./app";
import logger from "./logger";

const NAMESPACE = "SERVER";

const main = async () => {
  await Db.init();
  /* Creating a server */
  app.listen(config.server.port, () => {
    logger.info(
      NAMESPACE,
      `Server is running on ${config.server.host}:${config.server.port}`
    );
  });
};

main()
  .then(() => {
    logger.info(`${NAMESPACE}`, "Starting");
  })
  .catch((err) => console.error(`${NAMESPACE}`, `${err}`, "App Crashed"));
