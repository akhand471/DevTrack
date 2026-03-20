const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Topic = require('../models/Topic')

// Load the DSA topics array from our frontend constants file
// Note: In a real monorepo we'd share this file, here we'll just import it using ES modules
// Since our server uses CommonJS, we'll read and eval it or just duplicate the structure here
// for simplicity if we can't easily import ES modules into CommonJS

// Since we know the exact structure of dsaSubcategories from the frontend, we'll parse it here
const fs = require('fs')
const path = require('path')

dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

const seedData = async () => {
    try {
        await connectDB()

        console.log('Clearing existing topics...')
        await Topic.deleteMany()

        console.log('Reading frontend DSA topics data...')
        const dataPath = path.join(__dirname, '../../src/data/dsaTopics.js')
        const fileContent = fs.readFileSync(dataPath, 'utf-8')

        // Extract the dsaSubcategories array using a simple regex/eval hack 
        // since we can't easily require ES modules in this commonjs script
        const match = fileContent.match(/export const dsaSubcategories = (\[[\s\S]*?\])\n\n\/\//)

        if (!match) {
            throw new Error('Could not parse dsaTopics.js')
        }

        // Evaluate the array string to get the JS object
        // Safe here because we know exactly what we're evaluating
        const dsaSubcategories = eval(match[1])

        const topicsToInsert = []

        dsaSubcategories.forEach(sub => {
            sub.topics.forEach(topicName => {
                topicsToInsert.push({
                    name: topicName,
                    category: 'DSA',
                    subcategory: sub.name,
                    icon: sub.icon
                })
            })
        })

        console.log(`Inserting ${topicsToInsert.length} topics...`)
        await Topic.insertMany(topicsToInsert)

        console.log('✅ Data Seeding Completed successfully!')
        process.exit()
    } catch (error) {
        console.error(`❌ Error seeding data: ${error}`)
        process.exit(1)
    }
}

seedData()
