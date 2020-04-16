import mongoose from 'mongoose'

const { String } = mongoose.Schema.Types

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: [
            "user",
            "author",
            "patron",
            "admin",
            "root",
        ]
    },
    // avatar: {
    //     type: String,
    // },
    // bio: {
    //     type: String,
    // },
    // games: {
    //     type: [String],
    // },
    // social: {
    //     patreon: {
    //         type: String
    //     },
    //     twitch: {
    //         type: String
    //     },
    //     youtube: {
    //         type: String
    //     },
    //     twitter: {
    //         type: String
    //     },
    //     facebook: {
    //         type: String
    //     },
    //     instagram: {
    //         type: String
    //     }
    // },
    // subscriptions: [
    //     {
    //         author: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'books'
    //         }
    //     }
    // ],
    // subscribers: [
    //     {
    //         user: {
    //             type: Schema.Types.ObjectId,
    //             ref: 'users'
    //         }
    //     }
    // ],
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model("User", UserSchema)