/* GUN RELAY USING EXPRESS */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Gun = require('gun')
const mongoose = require('mongoose')


const port = process.env.PORT ? process.env.PORT : 8080;
const pubkey = process.env.GUN_PUB ? process.env.GUN_PUB : '';

const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => {
    console.log('Connected to db')

    /* 
     * NOTE: 
     * Inits with pubkey from external settings file
     * If no pubkey found, manually init one and add it to the settings file later on
     */
    if(pubkey.length > 0){
        const Users = require('./models/users')
        const user = new Users({
            pub: pubkey,
            isset: true
        });
        user.save().then(()=>{
            console.log("recovered: ", pubkey)
        })
    }
    /*
    else{
        console.log("no user to recover, create user by calling '/api/pub/create'")
    }
    */
})

app.use(cors())
app.use(express.json())

/* ROUTE / */
const router = express.Router();
app.use('/', router.get('/', async (req,res) => { res.status(200).json({message: 'ok'}) }))

/* ROUTE API */
const router_api = require('./routes/api')
app.use('/api', router_api)

app.use('gundb', Gun)

var server = app.listen(port, '0.0.0.0', ()=>{
    console.log('Server started on port ' + port + ' with /gun')
})

function getPeers(){
    let peers = process.env.GUN_PEERS
    try{
        if(peers != null && peers != undefined && peers.length > 0)
            return peers.split(',');
        throw "";
    }catch(_){ return ['']; }
}

const gun = Gun({
    // radisk: true, localStorage: false,
    peers: getPeers(),
    web: server,
    file: 'data',
    multicast: false,
    verify: {
        check: function(){
            console.log("peer connected");
            return true;
        }
    }
})

let init = gun.get('blog').get('init').put({value: 'yes'})
console.log('gun-init:\n',init);