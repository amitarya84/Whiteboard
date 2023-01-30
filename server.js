const mongoose = require('mongoose');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { Server } = require("socket.io");
const io = new Server(server);

require('dotenv').config()

const PORT = process.env.PORT || 5000;

const Boards = require('./models/Boards');

app.use(cors({
    'Access-Control-Allow-Origin': '*'
}))
app.use(express.json());

app.use(express.static('Frontend/dist'))

app.get('/whitebaords', async (req, res) => {
    // console.log(req)

    try {
        const boards = await Boards.find();
        // console.log(boards)
        res.json(boards)
    } catch (error) {
        console.log(error)
        res.end('500', { message: 'Something went wrong!' })
    }
})
app.get('/whitebaord/:id', async (req, res) => {
    console.log('single_board', req.params)
    let id = req.params.id;

    try {
        const board = await Boards.findById(id);
        console.log(board)
        res.json(board)
    } catch (error) {
        console.log(error)
        res.end('500', { message: 'Something went wrong!' })
    }
})

app.patch('/whitebaord', async (req, res) => {
    // console.log(req.body)
    // console.log('shapes', req.body.shapes)
    const board = req.body;

    // res.json({ yo: 'boyyy', board: req.body})
    try {
        const updatedBoard = await Boards.updateOne(
            { _id: board._id },
            { $set: { shapes: board.shapes } }
        );

        // console.log(req.body)
        // console.log("updated", updatedBoard)

        res.json(updatedBoard)
    } catch (err) {
        res.json({ message: err })
    }
})

app.post('/createWhiteboard', async (req, res) => {
    console.log(req.body)
    let boardName = req.body.boardName;

    if (boardName) {
        try {
            let savedBoard = await Boards.create({
                name: boardName,
                shapes: []
            });
            console.log('Added to database..', savedBoard)
            res.json(savedBoard)
            // const savedBoard = await board.save();
        } catch (err) {
            console.log(err)
            res.end(500, { message: 'Something went wrong!' })
        }
    } else {
        res.status(500).json('Something went wrong!')
    }
})

let BoardUsers = [];

io.on('connection', (socket) => {
    console.log('Socket id', socket.id);
    socket.join(socket.handshake.query.roomId);
    BoardUsers.push(socket.id);
    console.log(BoardUsers);

    socket.emit('New_User', {BoardUsers})

    socket.on('board_updated', ({ roomId, userId }) => {
        // console.log('scoket', socket)
        console.log('boardUpdateEmit', userId)
        console.log(BoardUsers)
        socket.broadcast.to(roomId).emit('board_updated', { userId, BoardUsers })
        // socket.broadcast.emit('board_updated', {userId})
    })
    socket.on('disconnect', () => {
        BoardUsers = BoardUsers.filter((BoardUser) => {
            console.log(BoardUser, socket.id)
            return BoardUser !== socket.id;
        });
        socket.broadcast.emit('User_Disconnect', {BoardUsers})

        console.log('disconnected', BoardUsers, socket.id);
    })
});


//Connect to database
try {
    mongoose.connect(process.env.MONGO_URI)
} catch (err) {
    console.log(err)
}

server.listen(PORT, () => {
    console.log('Server running on port 5000')
})