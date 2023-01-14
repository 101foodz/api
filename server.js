/* GUN RELAY USING EXPRESS */

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Gun = require('gun')
const mongoose = require('mongoose')


const port = process.env.PORT ? process.env.PORT : 8080;
const pubkey = process.env.GUN_PUB ? process.env.GUN_PUB : '';
const rootmap = process.env.GUN_ROOT ? process.env.GUN_ROOT : undefined;
const dev = process.env.DEV ? true : false;

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
    let p = process.env.GUN_PEERS;
    let peers = [];
    try{
        if(p != null && p != undefined && p.length > 0){
            p.split(',').forEach((peer)=>{
                peers.push(peer.trim());
            })
            return peers;
        }
        throw "";
    }catch(_){ return ['']; }
}

if(dev) console.log(getPeers())
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

rootmap.split(',').forEach((rootnode)=>{
    const init = gun.get(rootnode.trim()).get('init').put({value: 'yes'})
    if(dev) console.log(init);
});