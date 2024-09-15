import express from 'express';
import cokpar from 'cookie-parser'
import passport from 'passport'
import emailRoutes from './routes/emailRoutes';
import dotenv from 'dotenv';


const port = 3000;

dotenv.config();

const app = express();
app.use(cokpar())
app.use(express.json())

app.use(passport.initialize())


app.use('/emails', emailRoutes);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});