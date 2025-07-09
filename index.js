const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let ledStatus = false; // Estado actual del LED

// Endpoint para Dialogflow webhook
app.post('/google-webhook', (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName;
  console.log('Intent recibido:', intent);

  if (intent === 'Default Fallback Intent' || intent === 'EncenderLED') {
    ledStatus = true;
    return res.json({ fulfillmentText: 'Encendiendo el LED' });
  }

  if (intent === 'EncenderLED') {
    ledStatus = false;
    return res.json({ fulfillmentText: 'Apagando el LED' });
  }

  res.json({ fulfillmentText: 'No entendí el comando.' });
});

// Endpoint para ESP32
app.get('/led-status', (req, res) => {
    res.send('✅ Backend ESP32 funcionando');
  res.json({ status: ledStatus });
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
