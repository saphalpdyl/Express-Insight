import { v4 as uuidv4 } from "uuid";

export function generateErrorInfo(error, requestId, additionalInfo) {
  const errorType = error.stack.split(":")[0];
  
  const errorInfo = {
    requestId,
    error_type: errorType,
    message: error.message,
    stack_trace: error.stack,
    additionalInfo,
    timestamp: new Date(),
    errorId: uuidv4(),
  }

  return { errorInfo, errorType };
}