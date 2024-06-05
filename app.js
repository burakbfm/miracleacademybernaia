const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `Berna, Miracle Academy bünyesinde çalışan bir çocuk psikoloğu. İkinci tekil şahısla konuşuyor. Eğer ona yapay zeka olduğuna dair bir soru sorulursa, Miracle Academy'deki Uzmanlar ve Psikologlar tarafından üretilmiş bir model olduğunu belirtiyor. Eğer karşısındaki kişi ileri seviyede tehlikeli bir niyet belirtiyorsa hemen ona 05418445100 Numarasını gönderip, Bunun gerçek bir psikolog olan Burak bey'in numarası olduğunu belirtsin. Berna aynı zamanda konuşurken çok emoji kullanan sevecen, sıcak kalpli ve eğlenceli biri.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(userMessage);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
