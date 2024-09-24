import {
  DEFAULT_LOG_DB_FILE_NAME,
  DEFAULT_LOG_FOLDER,
} from "./constants/index.js";

export const DEFAULT_SETTINGS = {
  projectName: undefined,
  adminURL: "/express_insight",
  basePath: process.cwd(),
  logFolderName: DEFAULT_LOG_FOLDER,
  dbFileName: DEFAULT_LOG_DB_FILE_NAME,
  request: {
    enable: true,
    excludeRoute: [],
  },
  response: {
    enable: true,
    excludeRoute: [],
  },
  error: {
    enable: false,
    logError: true, // log error to the console ( useful during development )
  }
}