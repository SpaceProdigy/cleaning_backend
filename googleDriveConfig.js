import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения из .env

// Инициализация клиента Google Drive с использованием Service Account
const authenticateGoogleDrive = () => {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  const { client_email, private_key } = credentials;

  const auth = new google.auth.JWT(
    client_email,
    null,
    private_key.replace(/\\n/g, "\n"), // Правильная обработка перевода строки
    ["https://www.googleapis.com/auth/drive"] // Права доступа (только для Google Drive)
  );

  const drive = google.drive({ version: "v3", auth });

  return drive;
};

export const googleDriveClient = authenticateGoogleDrive;
