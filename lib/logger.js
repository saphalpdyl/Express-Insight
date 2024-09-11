import {
  DEFAULT_LOG_FOLDER,
} from "./constants/index.js";

const logger = function(settings) {
  if ( !settings ) throw new Error("[settings.missing] Please send a configuration as an argument.")
  
  const basePath = settings.basePath || process.cwd();
  const logFolderName = settings.logFolderName || DEFAULT_LOG_FOLDER;
  
  return {

  };
}

export default logger;