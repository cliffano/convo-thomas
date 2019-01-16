#!/usr/bin/env node
const fs = require('fs');
const Mustache = require('mustache');
const p = require('path');
const engines = require('../generated/engines');
const topics = require('../conf/topics');
const viewFile = p.join('generated', 'mustache-view.json');

genView();

function genView() {
  let queries = [];
  Object.keys(engines).forEach(function (engine) {
    Object.keys(topics).forEach(function (topic) {
      queries = queries.concat(getQueries(engine, topic));
    });
  });
  fs.writeFileSync(viewFile, JSON.stringify({ queries: queries }, null, 2), 'utf8');
  console.log('Finished writing view file %s', viewFile);
}

function getQueries(engine, topic) {
  console.log('Processing queries for %s - %s ...', engine, topic);
  let queries = topics[topic].convo.queries;

  let messages = [];
  Object.keys(queries.messages).forEach(function (locale) {
    let message = {};
    message.locale = locale;
    message.texts = [];
    queries.messages[locale].forEach(function (template) {
      message.texts.push(Mustache.render(template, engines[engine]));
    });
    messages.push(message);
  });

  let replies = [];
  Object.keys(queries.replies).forEach(function (locale) {
    let reply = {};
    reply.locale = locale;
    reply.texts = [];
    queries.replies[locale].forEach(function (template) {
      reply.texts.push(Mustache.render(template, engines[engine]));
    });
    replies.push(reply);
  });

  return {
    name: engine + ' - ' + topic,
    messages: messages,
    replies: replies
  };
}
