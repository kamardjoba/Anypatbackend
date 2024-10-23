const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: { 
      type: Number, 
      required: true, 
      unique: true 
    },
    nickname: { 
      type: String, 
      required: true 
    },
    firstName: { 
      type: String, 
      required: true 
    },
    coins: { 
      type: Number, 
      required: true, 
      default: 500 
    },
    referralCode: { 
      type: String, 
      unique: true 
    },
    adsWatched: {
      type: Number,
      default: 0,
  },
    isSubscribedToChannel: {  // Новое поле для проверки подписки
      type: Boolean,
      default: false
    },
    isSubscribedToOctiesChannel: {  // Новое поле для второго канала
      type: Boolean,
      default: false
    },
    isSubscribedToTwitter: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToInstagram: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToBot: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToBourekas: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToFox: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToCenter: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToCenterapp: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToMushroom: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToPixel: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToChat: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToGaspump: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    isSubscribedToCaptcha: {  // Новое поле для подписки на Twitter
      type: Boolean,
      default: false
    },
    TonTran_val: { 
      type: Boolean, 
      default: false 
  },
  StartNft_val: { 
    type: Boolean, 
    default: false 
  },
  Frends_val: { 
    type: Boolean, 
    default: false 
  },
  WeeklyNft_val: { 
    type: Boolean, 
    default: false 
  },
  TonTran_val: { 
    type: Boolean, 
    default: false 
  },
  walletAddress: { 
    type: String, 
    required: false 
  },
  clickId: String,
  referredUsers: [{
    telegramId: { // Добавляем поле для хранения telegramId реферала
        type: Number,
        required: true
    },
    nickname: String,
    firstName: String,
    earnedCoins: Number,
    photoUrl: String,
    coins: { 
        type: Number,
        required: true,
        default: 500 
    }
  }],
    photoUrl: {
      type: String,
      required: false
    }
});

const UserProgress = mongoose.model('Anytap', UserSchema);

module.exports = UserProgress;


