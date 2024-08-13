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
  }
});

const UserProgress = mongoose.model('Anytap', UserSchema);

module.exports = UserProgress;
