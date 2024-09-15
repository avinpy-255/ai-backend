import { Response, Request } from 'express';
import { getGmailMessages, getGmailMessageDetail } from '../services/gmailService';


export const fetchEmails = async (req:Request, res:Response) => {
  const auth = req.user; // Google OAuth user token
  try {
    const emails = await getGmailMessages(auth);
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails', error });
  }
};

export const summarizeEmail = async (req:Request, res:Response) => {
    const { messageId } = req.params;
    const auth = req.user; // Google OAuth user token
    const openai = require('openai');
    try {
      const message = await getGmailMessageDetail(auth, messageId);
      const emailBody = message.snippet; // simplified, for demo purposes
      const summary = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Summarize this email: ${emailBody}`,
        max_tokens: 150,
      });
      res.json({ summary: summary.data.choices[0].text.trim() });
    } catch (error) {
      res.status(500).json({ message: 'Error summarizing email', error });
    }
  };