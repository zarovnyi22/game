import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import { Send, SmartToy } from '@mui/icons-material';

const UserChatBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Привіт! Я AI-помічник. Чим можу допомогти?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    // Симуляція відповіді AI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Це симуляція відповіді AI. В реальній системі тут буде інтеграція з LLM.',
        },
      ]);
    }, 1000);
  };

  return (
    <Paper sx={{ p: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom>
        AI Чат-бот
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                mb: 1,
              }}
            >
              <Avatar sx={{ bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main' }}>
                {msg.role === 'user' ? 'U' : <SmartToy />}
              </Avatar>
              <ListItemText
                primary={msg.content}
                sx={{
                  ml: msg.role === 'user' ? 0 : 2,
                  mr: msg.role === 'user' ? 2 : 0,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Введіть повідомлення..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} startIcon={<Send />}>
          Відправити
        </Button>
      </Box>
    </Paper>
  );
};

export default UserChatBot;

