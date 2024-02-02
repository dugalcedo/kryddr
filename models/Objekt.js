import { Schema, model } from 'mongoose'

const ObjektSchema = new Schema({
    namn: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: {
            values: [
                '???',
                'Slut',
                'Nästan slut',
                'Finns',
                'Finns mycket'
            ]
        },
        default: '???'
    },
    // kategoriId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'kategori'
    // }
})

const Objekt = model('objekt', ObjektSchema, 'objekter')

export {
    Objekt,
    ObjektSchema
}