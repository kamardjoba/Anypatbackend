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
    referredUsers: [{
      nickname: String,
      earnedCoins: Number
    }],
    photoUrl: {
      type: String,
      required: false
    } // Новый путь для фото
});

const UserProgress = mongoose.model('Anytap', UserSchema);

module.exports = UserProgress;
