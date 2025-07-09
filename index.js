const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let ledStatus = false; // Estado actual del LED

// Endpoint para Dialogflow CX webhook
app.post('/google-webhook', (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  console.log('Webhook recibido con tag:', tag);

  let responseText = 'No entendí el comando.';

  if (tag === 'ENCENDER_LED') {
    ledStatus = true;
    responseText = 'Encendiendo el LED';
  } else if (tag === 'APAGAR_LED') {
    ledStatus = false;
    responseText = 'Apagando el LED';
  }

  // Respuesta al agente CX
  res.json({
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [responseText],
          },
        },
      ],
    },
  });
});

// Endpoint para ESP32 (ver estado del LED)
app.get('/led-status', (req, res) => {
  res.json({ status: ledStatus });
});

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('✅ Backend ESP32 funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
