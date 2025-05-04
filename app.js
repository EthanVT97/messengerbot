// app.js - Express server with Messenger Webhook
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Parse application/json
app.use(bodyParser.json());

// Verification endpoint for Facebook webhook verification
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Handle webhook POST requests
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {
    try {
      // Store received data for debugging/monitoring in Supabase
      const { data, error } = await supabase
        .from('webhook_logs')
        .insert({
          timestamp: new Date(),
          payload: body
        });
      
      if (error) console.error('Error logging to Supabase:', error);

      // Process each entry (there might be multiple entries/events)
      body.entry.forEach(async (entry) => {
        // Get the messaging event
        const webhookEvent = entry.messaging ? entry.messaging[0] : null;
        
        if (webhookEvent) {
          const senderId = webhookEvent.sender.id;
          
          // Check if this is a message event with text
          if (webhookEvent.message && webhookEvent.message.text) {
            const messageText = webhookEvent.message.text;
            console.log(
              `Received message from sender ${senderId}: ${messageText}`
            );
            
            // Get config data from Supabase
            const { data: configData, error: configError } = await supabase
              .from('configs')
              .select('*')
              .eq('active', true)
              .single();
            
            if (configError) {
              console.error('Error fetching config:', configError);
            } else {
              // Process message with the config
              handleMessage(senderId, messageText, configData);
            }
          }
        }
      });
      
      // Return a '200 OK' response to Facebook
      res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('ERROR_PROCESSING');
    }
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Handle messages
async function handleMessage(senderId, messageText, config) {
  try {
    // Process message according to config settings
    console.log(`Processing message with config: ${JSON.stringify(config)}`);
    
    // Send a response back to the sender
    await sendTextMessage(senderId, `Echo: ${messageText}`);
    
    // Log the interaction in Supabase
    const { error } = await supabase
      .from('message_logs')
      .insert({
        sender_id: senderId,
        message: messageText,
        timestamp: new Date(),
        config_id: config.id
      });
    
    if (error) console.error('Error logging message to Supabase:', error);
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

// Send message back to the user
async function sendTextMessage(recipientId, messageText) {
  try {
    const requestBody = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };

    // Use Facebook's Send API
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    const responseData = await response.json();
    console.log('Message sent:', responseData);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Messenger Webhook Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
