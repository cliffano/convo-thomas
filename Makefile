ci: clean deps lint config build package

clean:
	rm -rf generated stage

stage:
	mkdir -p stage/data/engines/

deps:
	npm install async rdf-parser-rdfxml wget-improved
	npm install -g jshint mustache yaml-lint yo

lint:
	jshint scripts/*.js

config: stage
	mkdir -p generated
	scripts/fetch-dbpedia-resources.js
	scripts/gen-engines-summary.js
	scripts/gen-mustache-view.js
	mustache generated/mustache-view.json specifications/convo-thomas-template.mustache > specifications/convo-thomas.yaml

build:
	mkdir -p generated/dialogflow-agent
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-thomas.yaml --force

package:
	mkdir -p stage
	cd generated/dialogflow-agent && zip ../../stage/convo-thomas-dialogflow-agent.zip -r .

.PHONY: ci clean deps lint config build package stage
