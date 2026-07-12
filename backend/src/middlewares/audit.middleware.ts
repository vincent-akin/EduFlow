import { Request, Response, NextFunction } from 'express';
import { createAuditLogFromRequest } from '../modules/audit/audit.service.js';
import { Types } from 'mongoose';

interface AuditOptions {
  action: string;
  entity: string;
  getEntityId?: (req: Request) => Types.ObjectId | string | null;
  getMetadata?: (req: Request) => any;
  skip?: (req: Request) => boolean;
}

export const auditMiddleware = (options: AuditOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip audit if condition is met
    if (options.skip && options.skip(req)) {
      next();
      return;
    }

    // Store original send function
    const originalSend = res.send;
    let responseBody: any;

    // Override send to capture response
    res.send = function (body: any): Response {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Log after response is sent
    res.on('finish', async () => {
      try {
        // Only log successful operations (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const entityId = options.getEntityId ? options.getEntityId(req) : null;
          const metadata = options.getMetadata ? options.getMetadata(req) : {};

          if (entityId) {
            await createAuditLogFromRequest(
              req,
              options.action,
              options.entity,
              typeof entityId === 'string' ? new Types.ObjectId(entityId) : entityId,
              {
                ...metadata,
                statusCode: res.statusCode,
                response: responseBody,
              }
            );
          }
        }
      } catch (error) {
        console.error('Audit log error:', error);
      }
    });

    next();
  };
};