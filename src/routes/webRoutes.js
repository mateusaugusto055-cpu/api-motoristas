import { Router } from 'express';
import WebController from '../controllers/webController.js';

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/drivers-view');
});

router.get('/drivers-view', WebController.listDriversPage);
router.get('/passengers-view', WebController.listPassengersPage);

export default router;