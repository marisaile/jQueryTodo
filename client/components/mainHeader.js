import $ from 'jquery';
import header from 'templates/mainHeader.html';

var app = {
  init: function() {
    app.render();
  },
  render: function() {
    $('.main-header').html(header);
  }
};

module.exports = app;
