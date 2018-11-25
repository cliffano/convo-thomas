#!/usr/bin/env node
const async = require('async');
const fs = require('fs');
const p = require('path');
const RdfXmlParser = require('rdf-parser-rdfxml');
const rdfParser = new RdfXmlParser();
const topics = require('../conf/topics');
const enginesDir = './stage/data/engines/';
const enginesFile = p.join('.', 'generated', 'engines.json');

genEngines(enginesDir);

function genEngines(enginesDir) {
  let tasks = [];
  fs.readdirSync(enginesDir).forEach(file => {
    const engineFile = p.join('.', enginesDir, file);
    const engineData = fs.readFileSync(engineFile).toString();

    function task(cb) {
      console.log('Processing engine file %s ...', engineFile);
      let triples = [];
      function rdfDataCb(triple) {
        triples.push(triple);
        // console.debug('Processed %s %s', triple.subject.nominalValue, triple.predicate.nominalValue);
      }
      function rdfDoneCb() {
        console.log('Finished processing engine file %s', engineFile);
        cb(null, rdfTriplesToEngineFacts(triples));
      }
      function rdfErrorCb(err) {
        cb(err);
      }
      rdfParser.process(engineData, rdfDataCb).then(rdfDoneCb).catch(rdfErrorCb);
    }
    tasks.push(task);
  });
  function doneCb(err, enginesFacts) {
    if (err) {
      console.error(err);
    } else {
      console.log('Writing config file %s ...', enginesFile);
      let facts = {};
      enginesFacts.forEach(function (engineFacts) {
        facts[engineFacts.name] = engineFacts;
      });
      fs.writeFile(enginesFile, JSON.stringify(facts, null, 2), 'utf8', function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log('Finished writing engines file %s', enginesFile);
        }
      });
    }
  }
  async.parallel(tasks, doneCb);
}

function rdfTriplesToEngineFacts(triples) {
  let facts = {};
  function addValue(key, value) {
    if (facts[key] === undefined) {
      facts[key] = [];
    }
    facts[key].push(value);
  }
  Object.keys(topics).forEach(function (topic) {
    triples.forEach(function (triple) {
      const property = topics[topic].dbpedia.property;
      if (triple.predicate.nominalValue === property) {
        if ((triple.object.language && triple.object.language === 'en') || !triple.object.language) {
          let value = triple.object.nominalValue;
          if (value.match(/dbpedia.org/)) {
            value = getName(topic, value.replace(/^http\:\/\/dbpedia.org\/resource\//, ''));
          }
          addValue(topic, value);
        }
      }
    });
  });
  console.log(facts.label)
  let name = facts.label[0].split(' ')[0];
  facts.name = name;
  return facts;
}

function getName(topic, ref) {
  return ref.replace(/\._/g, '.').replace(/_/g, ' ');
}
