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
const token = '6970022144:AAHELhZhCMW5dqzB-MzkiVOwxnCVtzCJLTA';
const bot = new TelegramBot(token, { polling: true });

const corsOptions = {
    origin: '*', // Разрешить запросы с любых доменов
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(MONGODB_URL,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
    
    const generateReferralCode = () => Math.random().toString(36).substr(2, 9);
    const generateTelegramLink = (referralCode) => {
        return `https://t.me/Anytap_FrontTest_bot?start=${referralCode}`;
      };


      app.get('/user-info', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            const user = await UserProgress.findOne({ telegramId: telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            res.json({
                success: true,
                firstName: user.firstName,
                coins: user.coins,
                photoUrl: user.photoUrl // добавляем URL фото из базы данных
            });
        } catch (error) {
            console.error('Ошибка при получении информации о пользователе:', error);
            res.status(500).json({ success: false, message: 'Ошибка при получении информации о пользователе.' });
        }
    });
    
    app.post('/generate-referral', async (req, res) => {
      const { userId } = req.body;
    
      try {
        const user = await UserProgress.findOne({ telegramId: userId });
        if (!user) {
          return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }
    
        let referralCode = user.referralCode;
        if (!referralCode) {
          referralCode = generateReferralCode();
          user.referralCode = referralCode;
          await user.save();
        }
    
        res.json({ success: true, referralCode });
      } catch (error) {
        console.error('Ошибка при генерации реферального кода:', error);
        res.status(500).json({ success: false, message: 'Ошибка при генерации реферального кода.' });
      }
    });
    
    app.post('/add-referral', async (req, res) => {
      const { referrerCode, referredId } = req.body;
    
      try {
        const referrer = await UserProgress.findOne({ referralCode: referrerCode });
        if (!referrer) {
          return res.status(404).json({ success: false, message: 'Пригласивший пользователь не найден.' });
        }
    
        const referredUser = await UserProgress.findOne({ telegramId: referredId });
        if (referredUser) {
          return res.status(400).json({ success: false, message: 'Пользователь уже зарегистрирован.' });
        }
    
        const newUser = new UserProgress({ telegramId: referredId, coins: 500 });
        await newUser.save();
    
        const referralBonus = Math.floor(newUser.coins * 0.1);
    
        referrer.referredUsers.push({ nickname: `user_${referredId}`, earnedCoins: referralBonus });
        referrer.coins += referralBonus;
        await referrer.save();
    
        res.json({ success: true, message: 'Реферал добавлен и монеты начислены.' });
      } catch (error) {
        console.error('Ошибка при добавлении реферала:', error);
        res.status(500).json({ success: false, message: 'Ошибка при добавлении реферала.' });
      }
    });
    
 
    const getUserProfilePhotoUrl = async (userId) => {
      try {
          const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
          if (photos.total_count > 0) {
              const fileId = photos.photos[0][0].file_id;
              const file = await bot.getFile(fileId);
              return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
          }
          return null; // Если у пользователя нет фото, возвращаем null
      } catch (error) {
          console.error('Ошибка при получении фотографии пользователя:', error);
          return null;
      }
  };
  
  app.get('/leaderboard', async (req, res) => {
    try {
        const users = await UserProgress.find().sort({ coins: -1 }).limit(10); // Находим топ-10 пользователей
        res.json(users);
    } catch (error) {
        console.error('Ошибка при получении лидерборда:', error);
        res.status(500).json({ success: false, message: 'Ошибка при получении лидерборда.' });
    }
});


  bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const referrerCode = match[1]; // Реферальный код из ссылки, если он есть
    
      const nickname = msg.from.username || `user_${userId}`;
      const firstName = msg.from.first_name || 'Anonymous';
  
      try {
          let user = await UserProgress.findOne({ telegramId: userId });
          const isNewUser = !user;
  
          // Получаем URL фотографии пользователя
          const photoUrl = await getUserProfilePhotoUrl(userId);
  
          if (isNewUser) {
              const coins = 500;
              const referralCode = generateReferralCode();
  
              user = new UserProgress({
                  telegramId: userId,
                  nickname,
                  firstName,
                  coins,
                  referralCode,
                  photoUrl // Сохраняем URL фотографии пользователя
              });
  
              await user.save();
  
              // Обработка реферального кода, если он есть
              if (referrerCode) {
                  const referrer = await UserProgress.findOne({ referralCode: referrerCode });
  
                  if (referrer) {
                      const referralBonus = Math.floor(coins * 0.1); // 10% бонус от начальных монет нового пользователя
  
                      referrer.referredUsers.push({
                          nickname: nickname,
                          earnedCoins: referralBonus
                      });
  
                      referrer.coins += referralBonus; // Начисляем бонус пригласившему пользователю
                      await referrer.save();
  
                      bot.sendMessage(chatId, `Вы приглашены пользователем ${referrer.nickname}. Вы получили 500 монет!`);
                  } else {
                      bot.sendMessage(chatId, 'Некорректный реферальный код.');
                  }
              } else {
                  bot.sendMessage(chatId, 'Добро пожаловать! Вы получили 500 монет.');
              }
  
              // Генерация уникальной ссылки с реферальным кодом для нового пользователя
              const telegramLink = generateTelegramLink(referralCode);
              bot.sendMessage(chatId, `Поделитесь этой ссылкой с друзьями, чтобы пригласить их в бот и получать бонусы: ${telegramLink}`);
  
          } else {
              // Если пользователь уже зарегистрирован
              bot.sendMessage(chatId, `С возвращением, ${firstName}!`);
          }
  
          const appUrl = `https://gleaming-semifreddo-896ccf.netlify.app/?telegramId=${userId}`;
          const channelUrl = `https://t.me/your_channel_name`;
  
          const imagePath = path.join(__dirname, 'images', 'Octies_bot_logo.png');
  
          await bot.sendPhoto(chatId, imagePath, {
              caption: "Welcome to AnyTap! Explore our world of simple and exciting onchain tasks and unique NFT collections. Start your journey into cryptocurrency with us!",
              reply_markup: {
                  inline_keyboard: [
                      [
                          { text: "Go!", web_app: { url: appUrl } },
                          { text: 'Channel!', url: channelUrl }
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





