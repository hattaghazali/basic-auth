import { Router } from 'express';
import {
    adminCreateUserAccount,
    adminLogin,
    adminLoginNew,
    adminGetInfo,
    handleRefreshToken
} from '../controllers/controller-admin';
import verifyToken from '../middleware/auth2';

// START ADMIN ROUTING
const router: Router = Router();

router.post('/login', adminLogin);

router.post('/v2/login', adminLoginNew);
router.post('/refresh', verifyToken, handleRefreshToken);
router.get('/info', verifyToken, adminGetInfo);
router.post('/user-create', verifyToken, adminCreateUserAccount);

export default router;
