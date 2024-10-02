import util from "util";
import { DEFAULT_LOG_IDENTIFIERS } from "../../../constants/index.js";

export function saveLogErrorEntry(errorInfo, requestInfo, logFileStream) {
  const {
    errorId,
    requestId,
    errorType,
    stackTrace,
    additionalInfo,
    timestamp,
    message,
  } = errorInfo;
  
  const {
    url,
  } = requestInfo;

  const mainLine = util.format(
    '\n<<<%s>>>\n[%s] %s %s %s', 
    DEFAULT_LOG_IDENTIFIERS.ERROR,
    timestamp,
    errorId,
    errorType,
    url,         
  );

  const details = [
    `type=error`,
    `request=${requestId}`,
    `errorType=${errorType}`,
    `message=${message}`,
    `stack=${stackTrace}`,
    additionalInfo ? `INFO: ${additionalInfo}` : "",
  ];
 
  const log = `${mainLine}\n${details.join('\n')}`;

  logFileStream.write(log + "\n");
}