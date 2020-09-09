import { Handler } from "aws-lambda";
import "source-map-support/register";

export const appInfo: Handler = async (event, _context) => {
  return {
    name: "taskboard-backend",
    version: "0.0.1",
  };
};