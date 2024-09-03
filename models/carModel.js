const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
    date: {
        type: Date,
        required: true,
        validate: [
            {
                validator: function(v) {
                    return v < new Date();
                },
                message: props => `${props.value} is not a valid date or is in the future.`
            }
        ]
    },
    plate: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                const year = this.date ? this.date.getFullYear() : new Date().getFullYear();
                const plateRegex = getPlateRegex(year);
                return plateRegex.test(v);
            },
            message: props => `${props.value} is not a valid plate number for the given date.`
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    }
});

function getPlateRegex(year) {
    const patterns = {
        'pre1992': /^[A-Za-z]{2}-\d{2}-\d{2}$/,
        '1992to2005': /^\d{2}-\d{2}-[A-Za-z]{2}$/,
        '2005to2020': /^\d{2}-[A-Za-z]{2}-\d{2}$/,
        'post2020': /^[A-Za-z]{2}-\d{2}-[A-Za-z]{2}$/
    };

    if (year < 1992) {
        return patterns.pre1992;
    } else if (year >= 1992 && year <= 2005) {
        return patterns['1992to2005'];
    } else if (year > 2005 && year <= 2020) {
        return patterns['2005to2020'];
    } else {
        return patterns.post2020;
    }
}

module.exports = mongoose.model('Car', CarSchema);