import {
  DEFAULT_LOG_FOLDER,
  
} from "./constants/index.js";

export const DEFAULT_SETTINGS = {
  projectName: undefined,
  adminURL: "/express_insight",
  basePath: process.cwd(),
  logFolderName: DEFAULT_LOG_FOLDER,
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
  }
}