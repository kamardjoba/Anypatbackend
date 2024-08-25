const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const path = require('path');
const cron = require('node-cron');


const UserProgress = require('./models/userProgress');
//const axios = require('axios');
MONGODB_URL = 'mongodb+srv://nazarlymar152:Nazar5002Nazar@cluster0.ht9jvso.mongodb.net/Clicker_bot?retryWrites=true&w=majority&appName=Cluster0';
const app = express();
const port = process.env.PORT || 3001;
const token = '7124930288:AAGttBe0D8AlxtViWrzECUgQts3-QM1DHus';
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
        return `https://t.me/AnyTap_bot?start=${referralCode}`;
      };

      const cron = require('node-cron');

      // Запускаем задачу каждую минуту для тестирования
      cron.schedule('* * * * *', async () => {
          try {
              await UserProgress.updateMany({}, { $set: { TonTran_val: false } });
              console.log('Сброс TonTran_val выполнен (тестирование каждую минуту)');
          } catch (error) {
              console.error('Ошибка при сбросе TonTran_val:', error);
          }
      });
      

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
    
    app.post('/wallet-connected', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            console.log('Запрос на начисление монет получен для пользователя с ID:', telegramId);
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                console.error('Пользователь не найден:', telegramId);
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            // Добавляем 500 монет пользователю
            user.coins += 500;
            await user.save();
    
            console.log('500 монет успешно добавлены пользователю:', telegramId);
            res.json({ success: true, coins: user.coins });
        } catch (error) {
            console.error('Ошибка при обновлении монет:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
        }
    });
    
    
    app.post('/mint-start-nft', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            console.log('Запрос на начисление монет получен для пользователя с ID:', telegramId);
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            // Добавляем 1000 монет пользователю
            user.coins += 1000;
            await user.save();
            
            console.log('1000 монет успешно добавлены пользователю:', telegramId);
            res.json({ success: true, coins: user.coins });
        } catch (error) {
            console.error('Ошибка при обновлении монет:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
        }
    });

    app.post('/mint-weekly-nft', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            console.log('Запрос на начисление монет получен для пользователя с ID:', telegramId);
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            // Добавляем 2500 монет пользователю
            user.coins += 2500;
            await user.save();
            
            console.log('2500 монет успешно добавлены пользователю:', telegramId);
            res.json({ success: true, coins: user.coins });
        } catch (error) {
            console.error('Ошибка при обновлении монет:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
        }
    });

    app.post('/mint-friend-nft', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            console.log('Запрос на начисление монет получен для пользователя с ID:', telegramId);
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            // Добавляем 5000 монет пользователю
            user.coins += 5000;
            await user.save();
            
            console.log('5000 монет успешно добавлены пользователю:', telegramId);
            res.json({ success: true, coins: user.coins });
        } catch (error) {
            console.error('Ошибка при обновлении монет:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
        }
    });

    app.post('/make-ton-transaction', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            console.log('Запрос на начисление монет получен для пользователя с ID:', telegramId);
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            // Добавляем 5000 монет пользователю
            user.coins += 5000;
            await user.save();
            
            console.log('5000 монет успешно добавлены пользователю:', telegramId);
            res.json({ success: true, coins: user.coins });
        } catch (error) {
            console.error('Ошибка при обновлении монет:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
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

    app.post('/check-subscription', async (req, res) => {
        const { telegramId } = req.body;
        
        const channelId = -1002246870197; // ID первого канала
        const octiesChannelId = -1002088709942; // ID второго канала
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            
            // Проверка подписки на первый канал
            const chatMemberChannel = await bot.getChatMember(channelId, telegramId);
            if (chatMemberChannel.status === 'member' || chatMemberChannel.status === 'administrator' || chatMemberChannel.status === 'creator') {
                if (user && !user.isSubscribedToChannel) {
                    user.coins += 200; // начисляем 200 монет за подписку на первый канал
                    user.isSubscribedToChannel = true; // помечаем, что пользователь подписан на первый канал
                }
            }
    
            // Проверка подписки на второй канал
            const chatMemberOctiesChannel = await bot.getChatMember(octiesChannelId, telegramId);
            if (chatMemberOctiesChannel.status === 'member' || chatMemberOctiesChannel.status === 'administrator' || chatMemberOctiesChannel.status === 'creator') {
                if (user && !user.isSubscribedToOctiesChannel) {
                    user.coins += 200; // начисляем 100 монет за подписку на второй канал
                    user.isSubscribedToOctiesChannel = true; // помечаем, что пользователь подписан на второй канал
                }
            }

           
    
            if (user) {
                await user.save(); // сохраняем изменения в базе данных
            }
    
            return res.json({ 
                success: true, 
                isSubscribedToChannel: user.isSubscribedToChannel, 
                isSubscribedToOctiesChannel: user.isSubscribedToOctiesChannel, 
                isSubscribedToTwitter: user.isSubscribedToTwitter,
                isSubscribedToInstagram: user.isSubscribedToInstagram,
                coins: user.coins 
            });
    
        } catch (error) {
            console.error('Ошибка при проверке подписки:', error);
            res.status(500).json({ success: false, message: 'Ошибка при проверке подписки.' });
        }
    });
    

    app.post('/update-twitter-subscription', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToTwitter) {
                user.coins += 200; // Начисляем 200 монет за подписку на Twitter
                user.isSubscribedToTwitter = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToTwitter: user.isSubscribedToTwitter, coins: user.coins });
    
        } catch (error) {
            console.error('Ошибка при обновлении подписки на Twitter:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении подписки на Twitter.' });
        }
    });
    
    app.post('/update-instagram-subscription', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToInstagram) {
                user.coins += 200; // Начисляем 200 монет за подписку на Twitter
                user.isSubscribedToInstagram = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToInstagram: user.isSubscribedToInstagram, coins: user.coins });
    
        } catch (error) {
            console.error('Ошибка при обновлении подписки на Twitter:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении подписки на Twitter.' });
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
          const referredUserPhoto = await getUserProfilePhotoUrl(referredId); // Получаем фото нового пользователя
          newUser.photoUrl = referredUserPhoto; // Устанавливаем фото для нового пользователя
          await newUser.save();
   
          const referralBonus = Math.floor(newUser.coins * 0.1);
   
          referrer.referredUsers.push({
              nickname: `user_${referredId}`,
              earnedCoins: referralBonus,
              photoUrl: referredUserPhoto // Сохраняем фото нового пользователя у реферера
          });
   
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

app.get('/user-rank', async (req, res) => {
  const { telegramId } = req.query;
  console.log(`Получен запрос для telegramId: ${telegramId}`); // Добавьте этот лог

  try {
      const users = await UserProgress.find().sort({ coins: -1 });
      const userIndex = users.findIndex(user => user.telegramId == telegramId); // Проверьте также, чтобы был правильный тип сравнения

      if (userIndex === -1) {
          console.log(`Пользователь с telegramId: ${telegramId} не найден`); // И этот лог
          return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
      }

      const user = users[userIndex];
      const rank = userIndex + 1; // Ранг пользователя

      res.json({ success: true, user, rank });
  } catch (error) {
      console.error('Ошибка при получении ранга пользователя:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении ранга пользователя.' });
  }
});

  // Функция для обновления монет у реферала в массиве referredUsers
async function updateReferralCoins(telegramId, newCoinAmount) {
  try {
      // Находим всех пользователей, которые имеют этого реферала
      const users = await UserProgress.find({ "referredUsers.telegramId": telegramId });

      users.forEach(async (user) => {
          // Обновляем количество монет у реферала
          const referral = user.referredUsers.find(r => r.telegramId === telegramId);
          if (referral) {
              referral.coins = newCoinAmount;
              await user.save();
          }
      });
  } catch (error) {
      console.error('Ошибка при обновлении монет у реферала:', error);
  }
}

// Пример использования
app.post('/update-coins', async (req, res) => {
  const { telegramId, coins } = req.body;

  try {
      const user = await UserProgress.findOne({ telegramId: telegramId });
      if (!user) {
          return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
      }

      // Обновляем количество монет у самого пользователя
      user.coins = coins;
      await user.save();

      // Обновляем количество монет у всех рефералов
      await updateReferralCoins(telegramId, coins);

      res.json({ success: true, message: 'Монеты обновлены.' });
  } catch (error) {
      console.error('Ошибка при обновлении монет:', error);
      res.status(500).json({ success: false, message: 'Ошибка при обновлении монет.' });
  }
});




app.get('/user-referrals', async (req, res) => {
  const { telegramId } = req.query;

  try {
      const user = await UserProgress.findOne({ telegramId: telegramId });
      if (!user) {
          return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
      }

      const referralsWithCoins = await Promise.all(user.referredUsers.map(async (referral) => {
          const referralUser = await UserProgress.findOne({ telegramId: referral.telegramId });
          return {
              nickname: referral.nickname,
              earnedCoins: referral.earnedCoins,
              photoUrl: referral.photoUrl,
              coins: referralUser ? referralUser.coins : referral.coins
          };
      }));

      res.json({
          success: true,
          referrals: referralsWithCoins,
          referralCode: user.referralCode,
          photoUrl: user.photoUrl
      });
  } catch (error) {
      console.error('Ошибка при получении списка рефералов:', error);
      res.status(500).json({ success: false, message: 'Ошибка при получении списка рефералов.' });
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
                      earnedCoins: referralBonus,
                      photoUrl: photoUrl // Сохраняем фото нового пользователя у реферера
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