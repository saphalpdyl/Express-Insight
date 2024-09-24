import { v4 as uuidv4 } from "uuid";

export function generateErrorInfo(error, requestId, additionalInfo) {
  const errorType = error.stack.split(":")[0];
  
  const errorInfo = {
    requestId,
    errorType,
    message: error.message,
    stackTrace: error.stack,
    additionalInfo,
    timestamp: (new Date()).toISOString(),
    errorId: uuidv4(),
  }

  return { errorInfo, errorType };
}