'use strict';

import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import EmojisBar from './EmojisBar';
import Sheet from './Sheet';
import SheetHeading from './SheetHeading';

import { Ratings } from '../../libs/collections/Ratings';

const getAverageRating = () => {
  let items = Ratings.find({}).map(item => item.mark);
  if (items.length === 0) { return 0; }

  let sum = items.reduce((memo, current) => memo + items.mark, 0);
  return sum / items.length;
}

const makeOnRate = container => mark => () => Meteor.call('rate', { mark }, function(err, res) {
  if (res) {
    container.setState({ myMark: mark, rating: getAverageRating() });
  }
}.bind(container));

export default class Raiting extends Component {
  constructor(props) {
    super(props);
    this.state = { rating: 0 };

    Meteor.call('getMyMark', (err, mark) => {
      if (!err) {
        this.state = { myMark: mark, rating: 0 }
      }
    });

    Tracker.autorun(function(){
      Meteor.subscribe('rating');
    });
  }

  componenWillUnmount() {
    Meteor.unsubscribe('rating');
  }
  
  render() {
    return (
      <div className="flex-container">
        <Sheet type="twisted" />
        <Sheet type="straight" >
          <SheetHeading />
          <EmojisBar
            myMark={ this.state.myMark }
            rating={ this.state.rating }
            makeOnRate={ makeOnRate(this) }
          />
        </Sheet>
      </div>
    );
  }
}
