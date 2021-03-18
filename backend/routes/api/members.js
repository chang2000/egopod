const express = require('express')
const router = express.Router()
const members = require('../../Members')
const uuid = require('uuid')

// gets all members
router.get('/', (req, res) => res.json(members));

// Get single member information
router.get('/:id', (req, res) =>{
    const found = members.some(member=>member.id === parseInt(req.params.id))
    if (found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)))
    } else {
        res.status(400).json({msg:'member not found'})
    }
})


// create memeber
router.post('/', (req, res)=>{
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        status: 'active'
    }
    if (!newMember.name || !newMember.email) {
        return res.status(400).json({msg:"please include name and email"})
    } 
    members.push(newMember)
    res.json(members)
})

// update member
router.put('/:id', (req, res) =>{
    const found = members.some(member=>member.id === parseInt(req.params.id))
    if (found) {
        const updMember = req.body
        members.forEach(member => {
            if(member.id === parseInt(req.params.id)) {
                member.name = updMember.name ? updMember.name : req.body.name
                member.email = updMember.email ? updMember.email : req.body.email
                res.json({msg: 'Member updated', member})
            }
        })
    } else {
        res.status(400).json({msg:'member not found'})
    }
})


module.exports = router