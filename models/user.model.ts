import mongoose from "mongoose";

// Определяем схему для пользователя
const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

// Создаем модель пользователя на основе схемы
const User = mongoose.model("User", userSchema);

export default User;
