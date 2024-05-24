const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk');

const app = express();
const port = 3000;
let users = [];


//Registro de usuario (/register):
app.get('/register', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const userData = response.data.results[0];
        // Genera un ID único para el usuario con uuid.
        const user = {
            id: uuidv4(),
            name: userData.name.first,
            surname: userData.name.last,
            gender: userData.gender,
            email: userData.email,
            // Formatea la fecha de registro con moment.
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        // Almacena al usuario en el arreglo users.
        users.push(user);
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Error en el registro');
    }
});

// Consulta de usuarios (/users):
app.get('/users', (req, res) => {
    // Divide el arreglo de usuarios por sexo usando lodash.
    const usersByGender = _.partition(users, { gender: 'male' });
    // Imprime la lista en la consola con fondo blanco y texto azul usando chalk.
    console.log(chalk.bgWhite.blue(JSON.stringify(usersByGender, null, 2)));
    // Devuelve la lista al cliente.
    res.status(200).send(usersByGender);
});

app.listen(port, () => {
    console.log(`servidor en el puerto http://localhost:${port}`);
});
