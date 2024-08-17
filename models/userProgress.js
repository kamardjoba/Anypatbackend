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
      earnedCoins: Number,
      photoUrl: String // Добавляем поле для фото рефералов
    }],
    photoUrl: {
      type: String,
      required: false
    }
});

const UserProgress = mongoose.model('Anytap', UserSchema);

module.exports = UserProgress;
