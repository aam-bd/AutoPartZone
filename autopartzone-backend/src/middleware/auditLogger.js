import AuditLog from "../models/AuditLog.js";

const auditLogger = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    let auditData = {
      userId: req.user?.id || null,
      action,
      resource,
      resourceId: req.params.id || req.body.id || null,
      details: {
        method: req.method,
        url: req.originalUrl,
        body: sanitizeRequestBody(req.body),
        params: req.params,
        query: req.query
      },
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown',
      success: false,
      errorMessage: null
    };

    // Override res.send to capture response
    res.send = function(data) {
      auditData.success = res.statusCode < 400;
      
      if (!auditData.success) {
        try {
          const parsedData = JSON.parse(data);
          auditData.errorMessage = parsedData.message || 'Unknown error';
        } catch (e) {
          auditData.errorMessage = 'Server error';
        }
      }

      // Log asynchronously without blocking response
      if (auditData.userId || action === 'REGISTER' || action === 'LOGIN') {
        AuditLog.create(auditData).catch(err => {
          console.error('Audit log error:', err);
        });
      }

      originalSend.call(this, data);
    };

    next();
  };
};

// Helper function to sanitize request body (remove sensitive data)
function sanitizeRequestBody(body) {
  if (!body) return {};
  
  const sensitiveFields = ['password', 'token', 'creditCard', 'ssn'];
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

export default auditLogger;