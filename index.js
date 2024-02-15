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

const sani = str => str.replaceAll(/\s+/gm,' ').trim().toLowerCase()
const eq = (s1, s2) => sani(s1) === sani(s2)

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

app.get('/add', async (req, res) => {
    const kategorier = req.user ? await Kategori.find({}).populate('objekter').exec() : []
    res.render('pages/add', {kategorier, user: req.user})
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

app.get('/api/add', async (req, res) => {
    let namn = req.query.namn
    namn = namn[0].toUpperCase() + namn.slice(1).toLowerCase()

    const objekter = Objekt.find({})
    const objektMatch = objekter.some(o => eq(o.namn, namn))

    if (objektMatch) {
        res.json({ error: true, message: `Det finns redan en vara som kallas "${namn}"` })
        return
    }

    try {
        var nyObjekt = new Objekt({namn: sani(namn)})
        await nyObjekt.save()
    } catch (error) {
        res.json({ error: true, message: `Något gick fel.` })
        return
    }

    const kategoriMatch = Kategori.findOne({_id: req.query.kid})

    if (!kategoriMatch) {
        res.json({ error: true, message: `Kategori id var fel.` })
        return
    }

    kategoriMatch.objekter.push(nyObjekt._id)
    await kategoriMatch.save()

    res.json({})
})

start()
async function start() {
    try {
        const conn = await mongoose.connect(process.env.DBURI)
        app.listen(PORT, async ()=>{
            const kategorier = await Kategori.find({})
            console.log(kategorier)
            console.log(`http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}