ci: clean deps lint config build package

clean:
	rm -rf generated stage

stage:
	mkdir -p generated/ stage/data/engines/

deps:
	npm install async mustache rdf-parser-rdfxml wget-improved
	npm install -g dialogflow-cli generator-convo jshint mustache yaml-lint yo

lint:
	jshint scripts/*.js

config: stage
	scripts/fetch-dbpedia-resources.js
	scripts/gen-engines-summary.js
	scripts/gen-mustache-view.js
	mustache generated/mustache-view.json specifications/convo-thomas-template.mustache > specifications/convo-thomas.yaml

build:
	mkdir -p generated/dialogflow-agent
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-thomas.yaml --force

package: stage
	cd generated/dialogflow-agent/ && zip ../../stage/convo-thomas-dialogflow-agent.zip -r .

publish:
	mkdir -p stage/dialogflow-agent/
	cd stage/dialogflow-agent/ && unzip ../convo-thomas-dialogflow-agent.zip
	dialogflow-cli import --credentials ./conf/credentials.json stage/dialogflow-agent/

.PHONY: ci clean deps lint config build package stage
