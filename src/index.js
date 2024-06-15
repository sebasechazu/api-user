'use strict';
import { MongoClient, ServerApiVersion } from 'mongodb';

import app from './app.js';

const uri = `mongodb+srv://${process.env.APP_USERNAME}:${process.env.PASSWORD}@virosque.fpns6wb.mongodb.net/?retryWrites=true&w=majority&appName=virosque`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectDatabase() {
  try {
    await client.connect();
    console.log('Conexión exitosa a la base de datos');
    app.locals.db = client.db(process.env.DB_NAME);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error; 
  }
}

export function getApp() {
  return app;
}

export function getDatabase() {
  if (!app.locals.db) {
    throw new Error('La base de datos no está conectada. Asegúrate de llamar a connectDatabase antes de usar getDatabase.');
  }
  return app.locals.db;
}

export async function startServer() {
  try {
    await connectDatabase();

    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('Cerrando la conexión a la base de datos');
  await client.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
