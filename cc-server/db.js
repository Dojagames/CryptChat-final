const mongoose = require('mongoose'); // Import mongoose for MongoDB

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    uuid: { type: String, required: true },
    publicKey: { type: String, required: true },
});

const userSettingsSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    privacySettings: {
        online: { type: Boolean, default: true, },
        lastOnline: { type: Boolean, default: true, },
        typingIndicator: { type: Boolean, default: true, },
        profilePicture: { type: String, default: '' },
        bio: { type: String, default: '' },
        blockedContacts: { type: [String], default: [] },
    },
});

const userOfflineMessages = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    message: { type: [{
            msg: {type: String, default: ''},
            from: {type: String, default: ''}
        }
        ], default: [] },
});

const User = mongoose.model('User', userSchema);
const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
const UserOfflineMessages = mongoose.model("UserOfflineMessages", userOfflineMessages);

async function connectDB(){
    mongoose.connect('mongodb://localhost:27017/cc2')
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.error('MongoDB connection error:', err));
}


async function loadUser(username){
    try {
        let user = await User.findOne({ username });
        if (user){
            return user;
        } else {
            return null
        }
    } catch (e){
        return null;
    }
}

async function loadUserSettings(username){
    try {
        let user = await UserSettings.findOne({ username });
        if (user){
            return user;
        } else {
            return null
        }
    } catch (e){
        return null;
    }
}

async function SaveOfflineMessages(username, message, from){
    try{
        const user = await UserOfflineMessages.findOneAndUpdate(
            { username: username },
            { $push: {message: {msg: message, from}}},
            {new: true, upsert: true}
        );
        if(!user){
            return null;
        }
        return true
    } catch (e){
        return null
    }
}

async function LoadOfflineMessages(username){
    try {
        let UserOfflineMessges = await UserOfflineMessages.findOne({username});
        if(!UserOfflineMessges){
            return [];
        }

        const msg = [];
        UserOfflineMessges.message.forEach((_msg) => {
            console.log(_msg);
            msg.push(_msg);
        });

        await UserOfflineMessages.findOneAndUpdate(
            { username: username },
            { $set: { message: [] } },
            { new: true } // Return the updated document after modification
        );

        return msg;

    } catch (e){
        return []
    }
}


async function createUser(username, uuid, publicKey, callback){
    try {
        const user = new User({
            username,
            uuid,
            publicKey
        });
        const userSettings = new UserSettings({
            username
        });
        const userMessage = new UserOfflineMessages({
            username
        })
        await user.save();
        await userSettings.save();
        await userMessage.save();
        callback(true);
    } catch (e){
        callback(null)
    }
}

module.exports = {
    connectDB,
    loadUser,
    createUser,
    loadUserSettings,
    SaveOfflineMessages,
    LoadOfflineMessages
}