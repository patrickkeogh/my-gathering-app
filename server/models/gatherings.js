var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//var Category = require('./model-category');

var eventTypeSchema = new Schema({
    _id: { type: String }
});

var eventTopicSchema = new Schema({
    _id: { type: String }
});

// var categorySchema = new Schema({
//     _id: { type: String },
//     parent: {
//         type: String,
//         ref: 'Category'
//     },
//     ancestors: [{
//         type: String,
//         ref: 'Category'
//     }]
// });


// create a schema
var gatheringSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type:[eventTypeSchema],
    topic:[eventTopicSchema],
    location: {
        location: { 'type': {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
        // loc: {
        //     type: [Number],  // [<longitude>, <latitude>]
        //     index: '2d'      // create the geospatial index
        // },
        country: {
            type: String
        },
        country_short: {
            type: String
        },
        formatted_address: {
            type: String
        },
        locality: {
            type: String
        },
        postal_code: {
            type: String
        },
        state_prov: {
            type: String
        },
        name: {
            type: String
        },
        notes: {
            type: String
        }
    },
    directions: {
        type: String
    },
    reviews: {
        type: Number
    },
    stars: {
        type: Number
    },
    notes: {
        type: String
    },
    status: {
        type: String
    },
    banner: {type: Schema.Types.Mixed},
    gathering_start_date_time: {
        type: Date,
        required: true
    },
    gathering_end_date_time: {
        type: Date
    },
    access: {
        type: String,
        default: 'public'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
        username: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
      
    
});

// Sets the createdAt parameter equal to the current time
gatheringSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});


gatheringSchema.index({name: 'text', 'location.locality': 'text'});
gatheringSchema.index({'location.location': '2dsphere'}); // Ensures 2dsphere index for location


// the schema is useless so far
// we need to create a model using it
var Gathering = mongoose.model('Gathering', gatheringSchema);

// make this available to our Node applications
module.exports = Gathering;