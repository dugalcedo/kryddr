const användare = [
    {
        username: 'dug',
        password: 'binted'
    },
    {
        username: 'sundraz',
        password: 'aja'
    }
]

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
const app = express()

import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 4321

import { Kategori } from './models/Kategori.js'
import { Objekt } from './models/Objekt.js'

app.set('view engine', 'pug')
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.json())
import cookieParser from 'cookie-parser'
app.use(cookieParser())

app.use(async (req, res, next) => {
    const token = req.cookies['krydd-token']
    if (token) {
        const parsed = jwt.verify(token, process.env.SECRET)
        req.user = användare.find(u => u.password===parsed.password && u.username===parsed.username)
    }
    next()
})

app.get('/', async (req, res) => {
    const kategorier = req.user ? await Kategori.find({}).populate('objekter').exec() : []
    res.render('pages/home', {kategorier, user: req.user})
})

app.put('/api/kryddstatus', async (req, res) => {
    try {
        await Objekt.findOneAndUpdate({_id: req.body.oid}, {status: req.body.status})
        console.log('Changed status')
        res.json({ error: false })
    } catch (error) {
        console.log(error)
        res.json({ error: true })
    }
})

app.get('/api/login', async (req, res) => {
    const match = användare.find(u => u.password===req.query.password && u.username===req.query.username)

    if (!match) {
        res.json({ error: true })
        return
    }

    const token = jwt.sign(req.query, process.env.SECRET, { expiresIn: '365d' })
    res.json({token})
})

start()
async function start() {
    try {
        const conn = await mongoose.connect(process.env.DBURI)
        app.listen(PORT, ()=>{
            console.log(`http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}