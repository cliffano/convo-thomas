#!/usr/bin/env node
const async = require('async');
const fs = require('fs');
const p = require('path');
const readline = require('readline');
const wget = require('wget-improved');

const categories = ['engines'];

fetchDbpedia(categories);

function fetchDbpedia(categories) {
  let tasks = [];
  categories.forEach(function (category) {
    const confFile = p.join('conf', 'dbpedia-resources-' + category + '.txt');
    var lines = fs
        .readFileSync(confFile, 'utf-8')
        .split('\n')
        .filter(Boolean);
    lines.forEach(function (line) {
      function task(cb) {
        console.log('Downloading DBpedia resource %s...', line);
        const sourceUrl = 'http://dbpedia.org/data/' + line + '.rdf';
        const outFile = 'stage/data/' + category + '/' + line + '.rdf';
        let download = wget.download(sourceUrl, outFile, {});
        download.on('error', function (err) {
          console.error(err);
        });
        download.on('start', function (fileSize) {
        });
        download.on('end', function (message) {
          console.log('Finished downloading resource %s', line);
        });
        download.on('progress', function (progress) {
        });
      }
      tasks.push(task);
    });
  });
  function doneCb(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.log('Finished fetching DBpedia resources');
    }
  }
  async.parallel(tasks, doneCb);
}
