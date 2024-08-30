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
    TonTran_val: { 
      type: Boolean, 
      default: false 
  },
  StartNft_val: { 
    type: Boolean, 
    default: false 
},
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


