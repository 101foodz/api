const express = require('express')
const router = express.Router()
const SEA = require('gun/sea')

const Users = require('../models/users')

const PUBLEN = 87;

// create pub
router.post('/pub/create', async (req,res) => {
    try{
        try{
            const users = await Users.find();
            if(users.length >= 1)
                throw new Error("Not allowed.");
            let pubkey = req.body.pub;
            console.log('pubkey:', pubkey)
            if(!pubkey)
                throw new Error("No key provided.");
            if(pubkey.length != PUBLEN)
                throw new Error("Invalid key provided..");
            
            const user = new Users({
                pub: pubkey,
                isset: true
            });
            user.save().then(()=>{
                res.status(201).json({message: pubkey});
            })
        }catch(err){
            res.status(400).json({message: err.message});
        }       
    }catch(e){
        res.status(500).json({message: e.message ? e.message : e})
    }
})

// get pub
router.get('/pub', async (req,res) => {
    try{
        const users = await Users.find()
        if(users.length > 0){
            res.status(200).json({message: users[0].pub})
        }else{
            res.status(400).json({message: "Public key not configured."})
        }
    }catch(e){
        res.status(500).json({message: e.message ? e.message : e})
    }    
})

// delete all
// router.delete('/pub/delete', async (req,res) => {
//     try {
//         await Users.deleteMany({})
//         res.json({ message: 'Deleted users' })
//     }catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// })

// get all
// router.get('/pub/all', async (req,res) => {
//     try{
//         const users = await Users.find()
//         if(users.length > 0){
//             res.status(200).json({message: users})
//         }else{
//             res.status(400).json({message: "Public key not configured."})
//         }
//     }catch(e){
//         res.status(500).json({message: e.message ? e.message : e})
//     }    
// })

module.exports = router;