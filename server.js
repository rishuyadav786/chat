const bodyParser = require("body-parser");
const path = require("path")
const mongo = require("mongoose");
const nodemailer = require("nodemailer");//for email send...
var port = process.env.PORT || 8000;
var myModule = require('./model.js');
const Chats = myModule.Chats;
const Users = myModule.Users;
const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

// mongo.set('useNewUrlParser', true);
// mongo.set('useFindAndModify', false);
// mongo.set('useCreateIndex', true);
// mongo.set('useUnifiedTopology', true);
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// ---------
// const mongoPath = 'mongodb+srv://SenderChats:Rishu12345@cluster0.rwtbnbi.mongodb.net/?retryWrites=true&w=majority';
const mongoPath = 'mongodb+srv://chatmaster:Rishu12345@cluster0.dwucphr.mongodb.net/?retryWrites=true&w=majority';
var db = mongo.connect(mongoPath, function (err, response) {
    if (err) {
        console.log("connection faild...." + err)
    }
    else {
        console.log("connected to" + db, "+", response);
    }
})



// ----------
app.get('/', (req, res) => {
    res.send('Heello world');
})
app.use(express.static('./dist/sender'));

app.get('/*', (req, res) =>{

    console.log(`rishu server is running on port ${port}`);
    res.sendFile('index.html', {root: 'dist/sender/'})
}
);
let userList = new Map();

io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    var activeUser=userName;
    addUser(userName, socket.id);
    socket.broadcast.emit('user-list', [...userList.keys()]);
    socket.emit('user-list', [...userList.keys()]);
  
    Chats.find().then(result => {
        // socket.emit('message-broadcast', result)
        io.emit('message-broadcast', result)
    })


    socket.on('message', (msg) => {
        let currentTime=new Date();
        let trimTime=currentTime.toString().slice(4,21)
        console.log("add appi = " + JSON.stringify(msg))
        const message = new Chats({ message: msg, sender_id: userName ,time:trimTime})
        message.save().then(() => {
            // io.emit('message-broadcast', msg);
            Chats.find().then(result => {
                io.emit('message-broadcast', result)
            })
            // socket.emit('message-broadcast', {message: msg, sender_id: userName});
        })
        //socket.emit('message-broadcast', {message: msg, userName: userName});
    })


    // socket.on('message', (msg) => {
    //     socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
    // })
    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    })
});

function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
  
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size == 0) {
            userList.delete(userName);
        }
    }
}

http.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running ${process.env.PORT || 8000}`);
});


// app.post("/api/deleteAllChat", function (req, res) {
//     // model2.remove( { } );
//     Chats.remove({ }, function (err) {
//         if (err) {
//             res.send(err);
//         }
//         else {
//             res.send({ data: "Record has been Deleted" })
//         }
//     })
// })

app.post("/api/deleteAllChat", function (req, res) {


    var dbo = db.db("test");
  dbo.collection("chats").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
    db.close();
  });



    var mod = new Chats(req.body);
    console.log("id"+JSON.stringify(req.body))
    mod.remove( { }, true );
    // mod.deleteOne({ _id: mod._id }, function (err) {
    //     if (err) {
    //         res.send(err);
    //     }
    //     else {
    //         res.send({ data: "Record has been Deleted" })
    //     }
    // })
})


app.post("/api/removeData", function (req, res) {
    var mod = new Chats(req.body);
    console.log("id ="+JSON.stringify(mod))
//   mod.remove( { } );

Chats.remove({}, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted" })
        }
    })
})





// io.on('connection', (socket) => {
//     let userName = socket.handshake.query.userName;
//     addUser(userName, socket.id);

//     socket.broadcast.emit('user-list', [...userList.keys()]);
//     socket.emit('user-list', [...userList.keys()]);

//     socket.on('message', (msg) => {
//         socket.broadcast.emit('message-broadcast', {message: msg, userName: userName});
//     })

//     socket.on('disconnect', (reason) => {
//         removeUser(userName, socket.id);
//     })
// });
