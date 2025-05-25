import { Router } from 'express';
import {
    adminCreateUserAccount,
    adminLogin,
    adminGetInfo
} from '../controllers/controller-admin';
import verifyToken from '../middleware/auth2';

// START ADMIN ROUTING
const router: Router = Router();

router.post('/login', adminLogin);
router.get('/info/:id', verifyToken, adminGetInfo);
router.post('/user-create', adminCreateUserAccount);

export default router;
