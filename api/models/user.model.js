import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://imgs.search.brave.com/MsKR-QxhzIliSLyRKaih3jDuBR8G0LxkV7peK8A9Jtc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8xMS82OS9i/bGFuay1hdmF0YXIt/cHJvZmlsZS1waWN0/dXJlLXZlY3Rvci00/NTE2MTE2OS5qcGchttps://images.unsplash.com/photo-1583243552802-94ccb4200150?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
export default user;
