import express from 'express';
import { fetchEmails, summarizeEmail } from '../controllers/emailController';

const router = express.Router();

router.get('/fetch', fetchEmails);
router.post('/summarize/:messageId', summarizeEmail);

export default router;