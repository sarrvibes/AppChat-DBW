var express = require('express')
var bodyParser = require('body-parser')
var app = express() //set reference variable
var http = require('http').Server(app)
var io = require('socket.io')(http)
var monggose = require('mongoose')
const { error, Console } = require('console')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb://127.0.0.1:27017/belajar_nodejs'

monggose.connect(dbUrl).then(()=> {
    console.log('koneksi ke mongodb berhasil')
}).catch((error) =>{
    console.log (error)
})

var Message = monggose.model('Message', {
    nama:String,
    pesan: String
})


// var pesan = []

app.get('/pesan', function(req, res){
    Message.find({}).then((pesan)=> {
        res.send(pesan)
    })
})

app.post('/pesan', function(req, res){

    var message = new Message(req.body)

    message.save().then(function(error){
        if(error){
            console.log(error)
        }
        Message.findOne({pesan:'badword'}).then((sensor)=>{
            if (sensor){
                console.log('ditemukan kata badword', sensor)
                Message.deleteMany({_id:sensor.id}).then(()=>{
                    console.log('badword sudah di hapus')
                })
            }
        })
            // pesan.push(req.body)
            io.emit('pesan', req.body)
            res.sendStatus(200)
        
    })
})

io.on('connection', function(socket){
    console.log('a user connected')
})

var server = http.listen(3000, function(){
    console.log("port server adalah", server.address().port)
})
