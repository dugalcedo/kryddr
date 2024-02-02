import { Schema, model } from 'mongoose'

const KategoriSchema = new Schema({
    namn: {
        type: String,
        unique: true
    },
    objekter: {
        type: [Schema.Types.ObjectId],
        ref: 'objekt'
    }
})

const Kategori = model('kategori', KategoriSchema, 'kategorier')

export {
    Kategori,
    KategoriSchema
}