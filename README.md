<img align="right" src="https://raw.github.com/cliffano/convo-thomas/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/convo-thomas.svg)](http://travis-ci.org/cliffano/convo-thomas)

Convo Thomas
------------

Convo Thomas is a [Convo](https://github.com/cliffano/convo) agent for Thomas the Tank Engine Facts, an application which provides facts on the engines from [Thomas & Friends](https://www.thomasandfriends.com/en-us) children books and TV series.

This application is an interactive voice interface for children to learn about words, numbers, and names from Thomas & Friends universe.

For example, the children can ask the question:

    What is Thomas' number?

and Google Assistant would answer:

    Thomas' number is 1.

[![Architecture Diagram](https://raw.github.com/cliffano/convo-thomas/master/docs/architecture.jpg)](https://raw.github.com/cliffano/convo-thomas/master/docs/architecture.jpg)

Usage
-----

Download all dependencies:

    make deps

Fetch Convo Thomas data from DBpedia and generate Mustache configuration file:

    make config

Build Convo Dialogflow agent and create a package:

    make build package

Publish the package to Dialogflow:

    make publish

Configuration
-------------

The engines along with the questions and answers can be tweaked by modifying the following configuration files:

### DBpedia resources

The DBpedia resource names for the engines in Thomas & Friends are configured in [conf/dbpedia-resources-engines]() , which is a plain text file with a single resource name on each line.

For example, for [http://dbpedia.org/page/Thomas_the_Tank_Engine](http://dbpedia.org/page/Thomas_the_Tank_Engine) DBpedia resource, the name that you have to supply in the configuration file is `Thomas_the_Tank_Engine` .

The resource names listed in this configuration files will then be used as the source of Convo Thomas facts.

### Convo Thomas topics

The topics for Convo Thomas are configured in [conf/topics.json]() .

| Key | Description |
|-----|-------------|
| `<topic>.dbpedia.property` | The DBpedia resource's triple predicate's nominal value |
| `<topic>.convo.queries.messages.<lang>` | A list of messages which Dialogflow agent will respond to for a given topic |
| `<topic>.convo.queries.replies.<lang>` | A list of responses which Dialogflow agent will use to respond to the corresponding message for a given topic |

Colophon
--------

Related Projects:

* [Convo](http://github.com/cliffano/convo) - Specification based voice and text conversation app
* [Convo Generator](http://github.com/cliffano/convo-generator) - Convo agent and middleware generator
