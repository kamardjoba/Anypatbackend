const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const path = require('path');
const cron = require('node-cron');

const AWS = require('aws-sdk');
const axios = require('axios');

// Настройка AWS SDK с использованием ваших ключей и региона
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  

const s3 = new AWS.S3();


const uploadToS3 = async (fileBuffer, fileName) => {
    const params = {
        Bucket: 'anytap.user.photo', // Имя вашего S3 бакета
        Key: fileName, // Имя файла, которое будет в S3
        Body: fileBuffer,
        //ACL: 'public-read' // Делаем файл публичным
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Возвращаем URL загруженного файла
    } catch (error) {
        console.error('Ошибка при загрузке файла в S3:', error);
        throw error;
    }
};

const getUserProfilePhotoUrl = async (userId) => {
    try {
        const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
        if (photos.total_count > 0) {
            const fileId = photos.photos[0][0].file_id;
            const file = await bot.getFile(fileId);
            const telegramFileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

            // Загрузка файла из Telegram в S3
            const response = await axios.get(telegramFileUrl, { responseType: 'arraybuffer' });
            const s3Url = await uploadToS3(response.data, `user_photos/${userId}.jpg`);

            return s3Url; // Возвращаем URL из S3
        }
        return null; // Если у пользователя нет фото, возвращаем null
    } catch (error) {
        console.error('Ошибка при получении фотографии пользователя:', error);
        return null;
    }
};

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



      // Запускаем задачу каждую минуту для тестирования
      cron.schedule('0 0 * * 1', async () => {
          try {
              await UserProgress.updateMany({}, { $set: { TonTran_val: false, WeeklyNft_val: false } });
              console.log('Сброс TonTran_val выполнен (тестирование каждую минуту)');
          } catch (error) {
              console.error('Ошибка при сбросе TonTran_val:', error);
          }
      });

      cron.schedule('0 0 * * 1', async () => {
        try {
            await UserProgress.updateMany({}, { $set: { WeeklyNft_val: false } });
            console.log('Сброс TWeeklyNft_val выполнен (тестирование каждую минуту)');
        } catch (error) {
            console.error('Ошибка при сбросе WeeklyNft_val:', error);
        }
    });

    cron.schedule('0 0 * * *', async () => {
        try {
            await UserProgress.updateMany({}, { $set: { adsWatched: 0 } });
            console.log('adsWatched reset to 0 for all users.');
        } catch (error) {
            console.error('Error resetting adsWatched:', error);
        }
    });
    

    app.post('/update-ads-watched', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
    
            // Increment the number of ads watched
            user.adsWatched += 1;
            await user.save();
    
            res.json({ success: true, adsWatched: user.adsWatched });
        } catch (error) {
            console.error('Error updating ads watched:', error);
            res.status(500).json({ success: false, message: 'Error updating ads watched.' });
        }
    });

    app.get('/get-ads-watched', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
    
            res.json({ success: true, adsWatched: user.adsWatched });
        } catch (error) {
            console.error('Error retrieving ads watched:', error);
            res.status(500).json({ success: false, message: 'Error retrieving ads watched.' });
        }
    });
      
      
      app.get('/get-ton-tran-val', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            res.json({ success: true, TonTran_val: user.TonTran_val });
        } catch (error) {
            console.error('Ошибка при получении TonTran_val:', error);
            res.status(500).json({ success: false, message: 'Ошибка при получении TonTran_val.' });
        }
    });
    
    app.get('/get-weekly-nft-val', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            res.json({ success: true, WeeklyNft_val: user.WeeklyNft_val });
        } catch (error) {
            console.error('Ошибка при получении WeeklyNft_val:', error);
            res.status(500).json({ success: false, message: 'Ошибка при получении WeeklyNft_val.' });
        }
    });
    
    app.get('/get-friend-nft-val', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
            }
    
            res.json({ success: true, Frends_val: user.Frends_val });
        } catch (error) {
            console.error('Ошибка при получении Frends_val:', error);
            res.status(500).json({ success: false, message: 'Ошибка при получении Frends_val.' });
        }
    });
    


    app.get('/user-info', async (req, res) => {
        const { telegramId } = req.query;
    
        try {
            let user = await UserProgress.findOne({ telegramId });
    
            // Если пользователя нет, создаем его с начальными значениями
            if (!user) {
                console.log(`Пользователь с telegramId ${telegramId} не найден, создаем нового пользователя.`);
                const nickname = `user_${telegramId}`;
                const firstName = 'Anonymous';  // Или возьмите это значение из запроса, если оно передается
                const coins = 500;  // Начальные монеты
                const referralCode = generateReferralCode();
    
                user = new UserProgress({
                    telegramId,
                    nickname,
                    firstName,
                    coins,
                    referralCode
                });
    
                await user.save();
                console.log(`Новый пользователь с telegramId ${telegramId} успешно создан.`);
            }
    
            // Возвращаем информацию о пользователе
            res.json({
                success: true,
                StartNft_val: user.StartNft_val,
                firstName: user.firstName,
                coins: user.coins,
                isSubscribedToBot: user.isSubscribedToBot,
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
            user.coins += 10000;
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
        
        const channelId = -1002208556196; // ID первого канала
        const octiesChannelId = -1002234145528; // ID второго канала
    
        try {
            const user = await UserProgress.findOne({ telegramId });
            
            // Проверка подписки на первый канал
            const chatMemberChannel = await bot.getChatMember(channelId, telegramId);
            if (chatMemberChannel.status === 'member' || chatMemberChannel.status === 'administrator' || chatMemberChannel.status === 'creator') {
                if (user && !user.isSubscribedToChannel) {
                    user.coins += 200; // начисляем 200 монет за подписку на первый канал
                    user.isSubscribedToChannel = true; // помечаем, что пользователь подписан на первый канал
                }

            }else {
            if (user && user.isSubscribedToChannel) {
                user.coins -= 200;
                user.isSubscribedToChannel = false; // помечаем, что пользователь отписался от первого канала
                // Здесь можно отнять монеты или выполнить другие действия при отписке, если нужно
            }
        }
    
            // Проверка подписки на второй канал
            const chatMemberOctiesChannel = await bot.getChatMember(octiesChannelId, telegramId);
            if (chatMemberOctiesChannel.status === 'member' || chatMemberOctiesChannel.status === 'administrator' || chatMemberOctiesChannel.status === 'creator') {
                if (user && !user.isSubscribedToOctiesChannel) {
                    user.coins += 200; // начисляем 100 монет за подписку на второй канал
                    user.isSubscribedToOctiesChannel = true; // помечаем, что пользователь подписан на второй канал
                }
            }else {
                if (user && user.isSubscribedToOctiesChannel) {
                    user.coins -= 200;
                    user.isSubscribedToOctiesChannel = false; // помечаем, что пользователь отписался от второго канала
                    // Здесь можно отнять монеты или выполнить другие действия при отписке, если нужно
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
                isSubscribedToBot: user.isSubscribedToBot,
                isSubscribedToBourekas: user.isSubscribedToBourekas,
                Frends_val: user.Frends_val,
                isSubscribedToFox: user.isSubscribedToFox,
                isSubscribedToCenter: user.isSubscribedToCenter,
                isSubscribedToCenterapp: user.isSubscribedToCenterapp,
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

    app.post('/update-telegram-fox', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToFox) {
                user.coins += 1000; // Начисляем 200 монет за подписку на Twitter
                user.isSubscribedToFox = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToFox: user.isSubscribedToFox, coins: user.coins });
    
        } catch (error) {
            console.error('Ошибка при обновлении подписки на Twitter:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении подписки на Twitter.' });
        }
    });
    

    app.post('/update-telegram-center', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToCenter) {
                user.coins += 1000; // Начисляем 200 монет за подписку на Twitter
                user.isSubscribedToCenter = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToCenter: user.isSubscribedToCenter, coins: user.coins });
    
        } catch (error) {
            console.error('Ошибка при обновлении подписки на Twitter:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении подписки на Twitter.' });
        }
    });
    
    app.post('/update-telegram-App-center', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToCenterapp) {
                user.coins += 1000; // Начисляем 200 монет за подписку на Twitter
                user.isSubscribedTisSubscribedToCenterappoFox = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToCenterapp: user.isSubscribedToCenterapp, coins: user.coins });
    
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

    app.post('/update-bot-subscription', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToBot) {
                user.coins += 250; // Начисляем 500 монет за подписку на Twitter
                user.isSubscribedToBot = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToBot: user.isSubscribedToBot, coins: user.coins });
    
        } catch (error) {
            console.error('Ошибка при обновлении подписки на Twitter:', error);
            res.status(500).json({ success: false, message: 'Ошибка при обновлении подписки на Twitter.' });
        }
    });
    

    app.post('/update-bourekas-subscription', async (req, res) => {
        const { telegramId } = req.body;
    
        try {
            const user = await UserProgress.findOne({ telegramId });
    
            if (user && !user.isSubscribedToBourekas) {
                user.coins += 250; // Начисляем 500 монет за подписку на Twitter
                user.isSubscribedToBourekas = true; // Помечаем, что пользователь подписан на Twitter
                await user.save(); // Сохраняем изменения в базе данных
            }
    
            return res.json({ success: true, isSubscribedToBourekas: user.isSubscribedToBourekas, coins: user.coins });
    
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
            const referredUserPhoto = await getUserProfilePhotoUrl(referredId);
            newUser.photoUrl = referredUserPhoto;
            await newUser.save();
    
            const referralBonus = Math.floor(newUser.coins * 0.1);
    
            referrer.referredUsers.push({
                telegramId: referredId, // Записываем Telegram ID реферала
                nickname: `user_${referredId}`,
                earnedCoins: referralBonus,
                photoUrl: referredUserPhoto,
                coins: newUser.coins
            });
    
            referrer.coins += referralBonus;
            await referrer.save();
    
            res.json({ success: true, message: 'Реферал добавлен и монеты начислены.' });
        } catch (error) {
            console.error('Ошибка при добавлении реферала:', error);
            res.status(500).json({ success: false, message: 'Ошибка при добавлении реферала.' });
        }
    });
    
//     const getUserProfilePhotoUrl = async (userId) => {
//       try {
//           const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
//           if (photos.total_count > 0) {
//               const fileId = photos.photos[0][0].file_id;
//               const file = await bot.getFile(fileId);
//               return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
//           }
//           return null; // Если у пользователя нет фото, возвращаем null
//       } catch (error) {
//           console.error('Ошибка при получении фотографии пользователя:', error);
//           return null;
//       }
//   };
  
  app.get('/leaderboard', async (req, res) => {
    try {
        const users = await UserProgress.find({}, { nickname: 1, coins: 1, photoUrl: 1 })
    .sort({ coins: -1 })
    .limit(50);
        res.json(users);
    } catch (error) {
        console.error('Ошибка при получении лидерборда:', error);
        res.status(500).json({ success: false, message: 'Ошибка при получении лидерборда.' });
    }
});


app.get('/user-rank', async (req, res) => {
    const { telegramId } = req.query;
    console.log(`Получен запрос для telegramId: ${telegramId}`);

    try {
        // Находим пользователя по его telegramId
        const user = await UserProgress.findOne({ telegramId });

        if (!user) {
            console.log(`Пользователь с telegramId: ${telegramId} не найден`);
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Используем агрегат для подсчета ранга
        const rankPipeline = [
            { $match: { coins: { $gt: user.coins } } }, // Считаем количество пользователей с большим количеством монет
            { $count: "rank" }
        ];

        const rankResult = await UserProgress.aggregate(rankPipeline);

        const rank = (rankResult[0]?.rank || 0) + 1; // +1 потому что сам пользователь не учитывается

        res.json({ success: true, user, rank });
    } catch (error) {
        console.error('Ошибка при получении ранга пользователя:', error);
        res.status(500).json({ success: false, message: 'Ошибка при получении ранга пользователя.' });
    }
});;


app.get('/get-ton-tran-val', async (req, res) => {
    const { telegramId } = req.query;

    try {
        // Поиск пользователя по telegramId в базе данных
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Возвращаем значение TonTran_val
        res.json({ success: true, TonTran_val: user.TonTran_val });
    } catch (error) {
        console.error('Ошибка при получении TonTran_val:', error);
        res.status(500).json({ success: false, message: 'Ошибка при получении TonTran_val.' });
    }
});


const updateReferrerCoins = async (referralId, newCoins) => {
    try {
        console.log(`Запуск функции updateReferrerCoins для referralId: ${referralId} с новыми монетами: ${newCoins}`);
        
        const referralUser = await UserProgress.findOne({ telegramId: referralId });
        if (referralUser) {
            console.log(`Найден реферал: ${referralUser.telegramId}, с текущими монетами: ${referralUser.coins}`);
            
            const referrer = await UserProgress.findOne({ 'referredUsers.telegramId': referralId });

            if (referrer) {
                console.log(`Найден реферер: ${referrer.telegramId}, с текущими монетами: ${referrer.coins}`);

                const previousCoins = referralUser.coins;  // Здесь берем сохраненные данные, а не просто переданные
                const bonusEarned = Math.floor((newCoins - previousCoins) * 0.1);

                console.log(`Предыдущие монеты реферала: ${previousCoins}, Новые монеты реферала: ${newCoins}, Начисленный бонус рефереру: ${bonusEarned}`);

                if (bonusEarned > 0) {
                    referrer.coins += bonusEarned;
                    console.log(`Обновленные монеты реферера: ${referrer.coins}`);

                    referrer.referredUsers = referrer.referredUsers.map(ref => {
                        if (ref.telegramId === referralId) {
                            ref.earnedCoins += bonusEarned;
                            console.log(`Обновленные earnedCoins у реферала ${ref.telegramId}: ${ref.earnedCoins}`);
                        }
                        return ref;
                    });

                    await referrer.save();
                    console.log(`Монеты реферера успешно обновлены и сохранены в базе данных. Текущие монеты реферера: ${referrer.coins}`);
                } else {
                    console.log('Бонус не начислен, так как нет увеличения монет.');
                }
            } else {
                console.log('Реферер не найден.');
            }
        } else {
            console.log('Реферал не найден.');
        }
    } catch (error) {
        console.error('Ошибка при обновлении монет реферера:', error);
    }
};



app.post('/add-coins-to-referral', async (req, res) => {
    const { telegramId, amount } = req.body;

    try {
        const newAmount = Number(amount);
        if (isNaN(newAmount)) {
            throw new Error('Invalid amount: value must be a number');
        }

        const referralUser = await UserProgress.findOne({ telegramId });
        if (referralUser) {
            referralUser.coins += newAmount;
            await referralUser.save();

            const newCoins = referralUser.coins + amount; // Здесь amount — это количество монет, которое добавляется
            await referralUser.save(); // Сначала сохраняем новые данные
            
            console.log('Вызов функции updateReferrerCoins');
            await updateReferrerCoins(referralUser.telegramId, newCoins)

            res.json({ success: true, coins: referralUser.coins });
        } else {
            res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }
    } catch (error) {
        console.error('Ошибка при добавлении монет рефералу:', error);
        res.status(500).json({ success: false, message: error.message });
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
              firstName: referral.firstName,
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

app.get('/total-users', async (req, res) => {
    try {
        const userCount = await UserProgress.countDocuments();
        res.json({ success: true, totalUsers: userCount });
    } catch (error) {
        console.error('Ошибка при подсчете пользователей:', error);
        res.status(500).json({ success: false, message: 'Ошибка при подсчете пользователей.' });
    }
});

app.post('/save-wallet-address', async (req, res) => {
    const { telegramId, walletAddress } = req.body;
  
    try {
      const user = await UserProgress.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
  
      user.walletAddress = walletAddress; // Сохраняем адрес кошелька
      await user.save();
  
      res.json({ success: true, message: 'Wallet address saved successfully!' });
    } catch (error) {
      console.error('Error saving wallet address:', error);
      res.status(500).json({ success: false, message: 'Error saving wallet address.' });
    }
  });

  app.post('/add-coins', async (req, res) => {
    const { telegramId, amount } = req.body;

    try {
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Добавляем указанное количество монет пользователю
        user.coins += amount;
        await user.save();

        res.json({ success: true, coins: user.coins });
    } catch (error) {
        console.error('Ошибка при добавлении монет:', error);
        res.status(500).json({ success: false, message: 'Ошибка при добавлении монет.' });
    }
});



app.post('/update-startnft-val', async (req, res) => {
    const { telegramId, StartNft_val } = req.body;

    try {
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.StartNft_val = StartNft_val; // Обновляем поле в базе данных
        await user.save();

        res.json({ success: true, message: 'StartNft_val updated successfully!' });
    } catch (error) {
        console.error('Error updating StartNft_val:', error);
        res.status(500).json({ success: false, message: 'Error updating StartNft_val.' });
    }
});

app.post('/update-ton-tran-val', async (req, res) => {
    const { telegramId } = req.body;

    try {
        // Поиск пользователя по telegramId
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Обновляем значение TonTran_val на true
        user.TonTran_val = true;
        await user.save();

        res.json({ success: true, message: 'TonTran_val обновлено успешно.' });
    } catch (error) {
        console.error('Ошибка при обновлении TonTran_val:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обновлении TonTran_val.' });
    }
});

app.post('/update-friend-nft-val', async (req, res) => {
    const { telegramId } = req.body;

    try {
        // Поиск пользователя по telegramId
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Обновляем значение Frends_val на true
        user.Frends_val = true;
        await user.save();

        res.json({ success: true, message: 'Frends_val обновлено успешно.' });
    } catch (error) {
        console.error('Ошибка при обновлении Frends_val:', error);
        res.status(500).json({ success: false, message: 'Ошибка при обновлении Frends_vall.' });
    }
});

app.post('/update-weekly-nft-val', async (req, res) => {
    const { telegramId } = req.body;

    try {
        // Поиск пользователя по telegramId
        const user = await UserProgress.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Пользователь не найден.' });
        }

        // Обновляем значение TonTran_val на true
        user.WeeklyNft_val = true;
        await user.save();

        res.json({ success: true, message: 'WeeklyNft_val  обновлено успешно.' });
    } catch (error) {
        console.error('Ошибка при обновлении WeeklyNft_val :', error);
        res.status(500).json({ success: false, message: 'Ошибка при обновлении WeeklyNft_val .' });
    }
});

const sendPostback = async (clickId, isOld = false) => {
    try {
      let postbackUrl = `https://wallapi.tappads.io/v1/tapp-cpa?click_id=${clickId}`;
      if (isOld) {
        postbackUrl += '&is_old=true';
      }
      const response = await axios.get(postbackUrl);
      console.log('Постбэк успешно отправлен:', response.data);
    } catch (error) {
      console.error('Ошибка при отправке постбэка:', error);
    }
  };

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const referrerCode = match[1]; // Реферальный код из ссылки, если он есть
  const startParam = match[1];

  const nickname = msg.from.username || `user_${userId}`;
  const firstName = msg.from.first_name || 'Anonymous';

  let clickId = null; // Инициализируем clickId как null

  if (startParam) { // Проверяем, что startParam существует
      if (startParam.includes('|')) {
          clickId = startParam.split('|')[1];
      } else if (startParam.includes(',')) {
          clickId = startParam.split(',')[1];
      } else if (startParam.includes(':')) {
          clickId = startParam.split(':')[1];
      } else {
          clickId = startParam; // Если это просто clickId без префикса
      }
  } else {
      console.error('Параметр start отсутствует');
  }

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
              clickId: clickId,
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
        
            if (referrerCode) {
                const referrer = await UserProgress.findOne({ referralCode: referrerCode });
                if (referrer) {
                    const referralBonus = Math.floor(coins * 0.1); // 10% бонус от начальных монет нового пользователя

                    referrer.referredUsers.push({
                        telegramId: userId, // Записываем Telegram ID реферала
                        nickname: nickname,
                        firstName: firstName, // Сохраняем firstName
                        earnedCoins: referralBonus,
                        photoUrl: photoUrl, // Сохраняем фото нового пользователя у реферера
                        coins: coins // Сохраняем стартовое количество монет
                    });

                    referrer.coins += referralBonus; // Начисляем бонус пригласившему пользователю
                    await referrer.save();
                }
                //else {
                //     bot.sendMessage(chatId, 'Некорректный реферальный код.');
                // }
            } else {
                bot.sendMessage(chatId, 'Добро пожаловать! Вы получили 500 монет.');
            }
        } 
        await sendPostback(clickId, !isNewUser); 
     
          // Генерация уникальной ссылки с реферальным кодом для нового пользователя
        //   const telegramLink = generateTelegramLink(referralCode);
        //   bot.sendMessage(chatId, `Поделитесь этой ссылкой с друзьями, чтобы пригласить их в бот и получать бонусы: ${telegramLink}`);

    //   } else {
    //       // Если пользователь уже зарегистрирован
    //       bot.sendMessage(chatId, `С возвращением, ${firstName}!`);
     }

      const appUrl = `https://anytap.org/?telegramId=${userId}`;
      const channelUrl = `https://t.me/any_tap`;

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





