const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const path = require('path');
const UserProgress = require('./models/userProgress');
//const axios = require('axios');
MONGODB_URL = 'mongodb+srv://nazarlymar152:Nazar5002Nazar@cluster0.ht9jvso.mongodb.net/Clicker_bot?retryWrites=true&w=majority&appName=Cluster0';
const app = express();
const port = process.env.PORT || 3001;
const token = '7124930288:AAGttBe0D8AlxtViWrzECUgQts3-QM1DHus';
const bot = new TelegramBot(token, { polling: true });

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(MONGODB_URL,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    

    app.get('/api/user/:telegramId', async (req, res) => {
        try {
          const user = await UserProgress.findOne({ telegramId: req.params.telegramId });
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json(user);
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          res.status(500).json({ message: 'Server error' });
        }
      });
      

      bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const firstName = msg.from.first_name;
        const nickname = msg.from.username || ''; 
      
        try {
          let user = await UserProgress.findOne({ telegramId: userId });
      
          if (!user) {
            user = new UserProgress({
              telegramId: userId,
              firstName: firstName,
              nickname: nickname,
              coins: 500
            });
            await user.save();
            bot.sendMessage(chatId, `Добро пожаловать, ${firstName}! Ты получил 500 монет.`);
          } else {
            bot.sendMessage(chatId, `С возвращением, ${firstName}!`);
          }
      
          const appUrl = `https://gleaming-semifreddo-896ccf.netlify.app/?telegramId=${userId}`;
          const channelUrl = `https://t.me/octies_channel`;
      
          const imagePath = path.join(__dirname, 'images', 'Octies_bot_logo.png');
      
          await bot.sendPhoto(chatId, imagePath, {
            caption: "How cool is your Telegram profile? Check your rating and receive rewards 🐙",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "Let's Go!", web_app: { url: appUrl } },
                  { text: 'Join OCTIES Community', url: channelUrl }
                ]
              ]
            }
          });
      
        } catch (error) {
          console.error('Ошибка при создании пользователя:', error);
          bot.sendMessage(chatId, 'Произошла ошибка при создании пользователя.');
        }
      });
      
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
