var $ = require('jquery');

// legacy loading for bootstrap
window.jQuery = window.$ = $;
require('bootstrap');

import _ from 'underscore';
import Backbone from 'backbone';
import Handlebars from 'handlebars';
import lscache from 'lscache';
import listTemplate from 'templates/accountList.html';
import createTemplate from 'templates/createAccount.html';


// Model 

var accountModelConfigObject = {
  defaults: {
    accounts: []
  },
  save: function() {
    var data = this.get('accounts'); // returns empty array first time around
    lscache.set('accounts', data);
  },
  fetch: function() {
    var data = lscache.get('accounts');
    data = data || [];
    this.set('accounts', data);
  }
};
var AccountModel = Backbone.Model.extend(accountModelConfigObject);
var accountModel = new AccountModel();

// Controller
var controllerConfigObject = {
  el: '.page-container',
  model: accountModel,
  events: {
    'click .btn-create': 'createNewAccount'
  },
  initialize: function(){
    this.model.fetch();
  },
  render: function(){
    var listView = new ListView();
    this.$el.find('.view-container').html(listView.$el); 
  },
  createNewAccount: function(){
    var createView = new CreateView();
    this.$el.find('.view-container').html(createView.$el);
  }
};
var AccountControllerView = Backbone.View.extend(controllerConfigObject);

// Views

var listViewConfig = {
  tagName: 'div',
  events: {},
  template: Handlebars.compile(listTemplate),
  initialize: function(){
    this.render();
  },
  render: function(){
    var renderedTemplate = this.template({});
    this.$el.html(renderedTemplate);
  }
};
var ListView = Backbone.View.extend(listViewConfig);

var createViewConfig = {
  tagName: 'div',
  events: {    
    'click .btn-done': 'submitForm'
  },
  template: Handlebars.compile(createTemplate),
  initialize: function(){
    this.render();
  },
  render: function(){
    var renderedTemplate = this.template({});
    this.$el.html(renderedTemplate);
  },
  submitForm: function(){
    accountControllerView.render();
  }
};
var CreateView = Backbone.View.extend(createViewConfig);

var accountControllerView = new AccountControllerView();


module.exports = accountControllerView;


