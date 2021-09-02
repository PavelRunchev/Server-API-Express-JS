module.exports = {
    development: {
        port: process.env.PORT || 8000,
        // MongoDB Atlas
        dbPath: 'mongodb+srv://abobo:123@db-fcmym.mongodb.net/Cars-DB?retryWrites=true&w=majority'
        // Local database 
        //dbPath: 'mongodb://localhost:27017/SharedTripp-db'
    },
    production: {
        port: process.env.PORT || 8000,
        // MongoDB Atlas
        dbPath: 'mongodb+srv://abobo:123@db-fcmym.mongodb.net/Cars-DB?retryWrites=true&w=majority'
     }
};