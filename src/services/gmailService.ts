import {google} from 'googleapis'


export const getGmailMessages = async (auth:any) => {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.list({userId: 'me', maxResults: 10})
    return res.data.messages || []
};

export const getGmailMessageDetail = async (auth:any, messageId: string) => {
    const gmail = google.gmail({version: 'v1', auth});
    const res = await gmail.users.messages.get({userId: 'me',  id: messageId})
    return res.data; 
}