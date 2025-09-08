import { createLogger, format, transports } from "winston";
const { combine, prettyPrint, timestamp } = format;

export const logger = createLogger({
  format: combine(timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), prettyPrint()),
  transports: [new transports.Console()],
});
