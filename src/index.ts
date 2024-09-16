import express, { Request, Response  } from 'express';
import dotenv from 'dotenv';
import ollama from 'ollama'



dotenv.config();


const app = express();
const port = process.env.PORT || 8000;
app.use(express.json())






app.get('/msg', async (req: Request, res: Response) => {
  // const {query} = req.body()

  const response = await ollama.chat({
      model: 'mailtool',
      messages: [{ role: 'user', content: "what's the color of sky"}],
  })  
  res.send({reply:response.message.content})
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
