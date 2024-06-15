'use strict';

import bcryptjs from 'bcryptjs';
import { createToken } from '../services/jwt.js';
import User from '../models/user.model.js';
import mongodb from 'mongodb';
import { getDatabase } from '../index.js';

const { compare, hashSync } = bcryptjs;
const { ObjectId } = mongodb;

export const registerUser = async (req, res) => {
    try {
        const params = req.body;

        if (params.name && params.phone && params.user && params.password, params.type) {
            const user = new User(
                params.name,
                params.phone,
                params.user,
                params.password,
                params.type,
                '',
                'ACTIVE',
            );


            const existingUser = await getDatabase().collection('users').findOne({ user: user.user.toLowerCase() });


            if (existingUser) {
                return res.status(200).send({ message: 'El usuario que intentas registrar ya existe' });
            }

            const hashedPassword = hashSync(params.password, 10);

            user.password = hashedPassword;

            const userStored = await getDatabase().collection('users').insertOne(user);

            if (userStored) {
                registerUser.password = undefined;
                return res.status(200).send({ message: 'Usuario registrado exitosamente', user: registerUser });

            } else {
                return res.status(404).send({ message: 'No se ha registrado el usuario' });
            }

        } else {
            return res.status(400).send({ message: 'Envía todos los campos necesarios' });

        }
    } catch (error) {

        return res.status(500).send({ message: 'Error en la petición' });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const params = req.body;
        const user = params.user;
        const password = params.password;

        if (user && password) {

            const userRegister = await getDatabase().collection('users').findOne({ user: user });

            if (userRegister) {
                const passwordMatch = await compare(password, userRegister.password);

                if (passwordMatch) {
                    const token = createToken(userRegister);

                    if (params.gettoken) {
                        return res.status(200).send({ token });
                    } else {
                        userRegister.password = undefined;
                        return res.status(200).send({ user, token });
                    }
                } else {
                    return res.status(500).send({ message: 'La contraseña es incorrecta' });
                }
            } else {
                return res.status(404).send({ message: 'El email ingresado no se encuentra registrado' });
            }
        } else {
            return res.status(404).send({ message: 'Debe completar todos los campos' });
        }
    } catch (error) {
        console.error('Error al ingresar usuario:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({ message: 'ID de usuario no válido' });
        }

        const user = await getDatabase().collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).send({ message: 'El usuario no esta registrado' });
        }

        user.password = undefined;

        return res.status(200).send({ user });
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await getDatabase().collection('users').find().toArray();

        users.forEach((user) => {
            user.password = undefined;
        });

        return res.status(200).send({ users });
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        return res.status(500).send({ message: 'Error en la petición' });
    }
};


export default {
    registerUser,
    loginUser,
    getUser,
    getUsers
};

