import { Router } from 'express';
import { SessionController } from './session.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../../middlewares/rbac.middleware.js';
import { tenantMiddleware } from '../../middlewares/tenant.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
    createSessionSchema,
    updateSessionSchema,
    createTermSchema,
    updateTermSchema,
    sessionIdParamSchema,
} from './session.validators.js';

const router = Router();
const controller = new SessionController();

// All routes require authentication and tenant
router.use(authMiddleware, tenantMiddleware);

// ============ Session Routes ============
router.post(
    '/sessions',
    rbacMiddleware(['school_admin']),
    validate(createSessionSchema),
    controller.createSession.bind(controller)
);

router.get(
    '/sessions/active',
    controller.getActiveSession.bind(controller)
);

router.get(
    '/sessions',
    controller.getAllSessions.bind(controller)
);

router.get(
    '/sessions/:id',
    validate(updateSessionSchema),
    controller.getSessionById.bind(controller)
);

router.put(
    '/sessions/:id',
    rbacMiddleware(['school_admin']),
    validate(updateSessionSchema),
    controller.updateSession.bind(controller)
);

router.delete(
    '/sessions/:id',
    rbacMiddleware(['school_admin']),
    validate(updateSessionSchema),
    controller.deleteSession.bind(controller)
);

// ============ Term Routes ============
router.post(
    '/terms',
    rbacMiddleware(['school_admin']),
    validate(createTermSchema),
    controller.createTerm.bind(controller)
);

router.get(
    '/sessions/:sessionId/terms',
    validate(sessionIdParamSchema),
    controller.getTermsBySession.bind(controller)
);

router.get(
    '/sessions/:sessionId/terms/active',
    validate(sessionIdParamSchema),
    controller.getActiveTerm.bind(controller)
);

router.get(
    '/terms/:id',
    controller.getTermById.bind(controller)
);

router.put(
    '/terms/:id',
    rbacMiddleware(['school_admin']),
    validate(updateTermSchema),
    controller.updateTerm.bind(controller)
);

router.delete(
    '/terms/:id',
    rbacMiddleware(['school_admin']),
    validate(updateTermSchema),
    controller.deleteTerm.bind(controller)
);

export default router;