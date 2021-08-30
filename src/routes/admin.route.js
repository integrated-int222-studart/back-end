const express = require('express')
const router = new express.Router()
const Admin = require('../models/admin/Admin.model')
const adminToken = require('../models/admin/AdminTokens.model')
const jwt = require('jsonwebtoken')
const { authAdmin } = require('../middleware/auth.middleware')
require('dotenv').config()

router.get('/getAll', async(req, res) => {
    try {
        const admins = await Admin.findAll({
            include: [adminToken]
        })
        if (!admins) {
            throw new Error()
        }
        res.send(admins)
    } catch (error) {
        res.status(404).send('Admin only!')
    }
})

router.post('/login', async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        if (!admin) {
            throw new Error()
        }
        const token = jwt.sign({ adminID: admin.adminID }, process.env.JWT_SECRET)
        const generateTokenID = await new adminToken({
            adminID: admin.adminID,
            token: token,
        })
        await generateTokenID.save()
        res.send({ admin, token })
    } catch (error) {
        res.status(400).send('Email or Password is wrong!')
    }
})

//logout one session 
router.delete('/logout', authAdmin, async(req, res) => {
    try {
        await adminToken.destroy({ where: { token: req.token }, force: true })
        res.status(200).send('Logout!')
    } catch (error) {
        res.send(error)
    }
})

//logout every session
router.delete('/logoutAll', authAdmin, async(req, res) => {
    try {
        await adminToken.destroy({ where: { adminID: req.admin.adminID }, force: true })
        res.status(200).send('Logout!')
    } catch (error) {
        res.send(error)
    }
})

router.get('/profile', authAdmin, (req, res) => {
    res.send({ admin: req.admin, token: req.token })
})

router.get('/tokens', async(req, res) => {
    try {
        const token = await adminToken.findAll()
        if (token) {
            res.send(token)
        } else {
            res.status(500).send()
        }
    } catch (error) {
        res.send(error)
    }
})



module.exports = router