import { v4 as uuidv4 } from "uuid";

export function generateResponseInfo(requestId, requestStart, req, res, buffers) {
  const responseId = uuidv4();

  // Size of buffers
  const totalSize = buffers.map(bf => Buffer.byteLength(bf)).reduce((a,b) => a + b, 0)
      
  const responseInfo = {
    requestId,
    responseId,
    timestamp: new Date().toISOString(),
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime: Date.now() - requestStart,
    responseBody: JSON.stringify(res.body),
    responseHeaders: res.getHeaders(),
    headers: {
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
      referer: req.get('Referer'),
      xForwardedFor: req.get('X-Forwarded-For'),
    },
    responseSize: totalSize,
  }

  return { responseId, responseInfo };
}