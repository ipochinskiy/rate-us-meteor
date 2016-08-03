import { Meteor } from 'meteor/meteor';

import { Ratings } from '../../libs/collections/Ratings';

Meteor.publish('rating', () => Ratings.find({}, { sort: { 'ratedAt': 1 } }));
