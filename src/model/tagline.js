import mongoose from 'mongoose';

const taglineSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true,
    },
    paragraph: {
        type: String,
        required: true,
        trim: true,
    },
    isActive:{
        type:Boolean,
        default:false,
    }

}, { timestamps: true });



export const TaglineModel = mongoose.model('Tagline', taglineSchema);

