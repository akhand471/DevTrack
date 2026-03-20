const mongoose = require('mongoose')

/**
 * Topic Schema
 * Master list of all study topics (seeded from dsaTopics data)
 */
const topicSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Topic name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['DSA', 'Core CS', 'Tech Stack'],
        },
        subcategory: {
            type: String,
            required: [true, 'Subcategory is required'],
            trim: true,
        },
        icon: {
            type: String,
            default: '📝',
        },
    },
    {
        timestamps: true,
    }
)

// Prevent duplicate topics within the same subcategory
topicSchema.index({ name: 1, subcategory: 1 }, { unique: true })

module.exports = mongoose.model('Topic', topicSchema)
