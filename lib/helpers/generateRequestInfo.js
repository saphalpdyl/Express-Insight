import { v4 as uuidv4 } from "uuid";

export function generateRequestInfo(req) {
  const requestId = uuidv4();

  const requestInfo = {
    requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    queryParams: req.query,
    headers: {
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
      referer: req.get('Referer'),
      xForwardedFor: req.get('X-Forwarded-For'),
    },
    clientIp: req.ip,
    requestBody: req.method === 'GET' ? undefined : JSON.stringify(req.body),
  };

  const requestStart = Date.now();

  return { requestId, requestInfo, requestStart };
}