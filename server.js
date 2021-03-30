/*const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// fake DB
const messages = {
  chat1: [],
  chat2: [],
};

// socket.io server
io.on("connection", (socket) => {
  socket.on("message.chat1", (data) => {
    messages["chat1"].push(data);
    socket.broadcast.emit("message.chat1", data);
  });
  socket.on("message.chat2", (data) => {
    messages["chat2"].push(data);
    socket.broadcast.emit("message.chat2", data);
  });
});

nextApp.prepare().then(() => {
  app.get("/messages/:chat", (req, res) => {
    res.json(messages[req.params.chat]);
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});*/

const express = require('express');
const bodyParser = require('body-parser');
const port = parseInt(process.env.PORT, 10) || 3001;
const app = express();

// fake DB
const messages = {
    chat1: [],
    chat2: [],
};

var users = [];

// ajout de socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname});
});

app.get('/json', function (req, res) {
    res.status(200).json({message: 'ok'});
});

// établissement de la connexion
io.on('connection', socket => {
    console.log(`Connecté au client ${socket.id}`);

    socket.on('pseudo', data => {
        //messages["chat1"].push(data);

        var found = containIdSocket(socket.id);

        if (found) return;

        var userFound = userExists(data);
        if (userFound) {
            socket.emit('pseudo.error');
            return;
        }

        const user = {
            pseudo: data,
            id: socket.id,
        };

        users.push(user);

        io.emit('user.connect', users);
    });
    socket.on('message.chat1', data => {
        messages['chat1'].push(data);
        socket.broadcast.emit('message.chat1', data);
    });
    socket.on('message.chat2', data => {
        messages['chat2'].push(data);
        socket.broadcast.emit('message.chat2', data);
    });
    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected !`);

        let index = -1;
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.id === socket.id) {
                index = i;
                break;
            }
        }
        users.splice(index, 1);
        socket.broadcast.emit('user.connect', users);
    });
});

function userExists(username) {
    return users.some(function (el) {
        return el.pseudo === username;
    });
}

function containIdSocket(socketId) {
    return users.some(function (el) {
        return el.id === socketId;
    });
}

// on change app par server
server.listen(port, function () {
    console.log(`Votre app est disponible sur localhost:${port}`);
});
