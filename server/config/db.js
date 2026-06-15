const mongoose = require('mongoose')
const logger = require('../utils/logger')

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/devtrack'

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    logger.warn(`⚠️  Could not connect to MongoDB at ${uri}: ${err.message}`)
    logger.info('📦 Starting in-memory MongoDB for local development...')

    try {
      // Dynamically require so it's optional in prod
      const { MongoMemoryServer } = require('mongodb-memory-server')
      const memServer = await MongoMemoryServer.create()
      const memUri = memServer.getUri()
      await mongoose.connect(memUri)
      logger.info(`✅ In-memory MongoDB running at ${memUri}`)
      logger.info('💡 Data will be lost when the server restarts (dev mode only)')
    } catch (memErr) {
      logger.error(`❌ In-memory MongoDB also failed: ${memErr.message}`)
      logger.error('Install mongodb-memory-server: cd server && npm install mongodb-memory-server')
      process.exit(1)
    }
  }
}

module.exports = connectDB
