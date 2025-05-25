import dotenv from "dotenv";
dotenv.config();

export const SERVER_HOSTNAME = "localhost";
export const SERVER_PORT = process.env.SERVER_PORT;

export const MONGO_URL = process.env.MONGO_URL;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

export const server = {
  SERVER_HOSTNAME,
  SERVER_PORT,
};

export const mongo = {
  MONGO_URL,
  MONGO_CONNECTION: `mongodb://${MONGO_URL}/${MONGO_DB_NAME}`,
};
