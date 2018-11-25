ci: clean lint config build

clean:
	rm -rf generated stage

deps:
	npm install async rdf-parser-rdfxml
	npm install -g mustache yaml-lint yo

lint:
	shellcheck scripts/*.sh

config:
	mkdir -p generated
	scripts/fetch-dbpedia.sh
	scripts/gen-engines.js
	scripts/gen-view.js
	mustache generated/convo-thomas-view.json specifications/convo-thomas.mustache > specifications/convo-thomas.yaml

build:
	mkdir -p generated/dialogflow-agent
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-thomas.yaml --force

package:
	mkdir -p stage
	cd generated/dialogflow-agent && zip ../../stage/convo-thomas-dialogflow-agent.zip -r .

.PHONY: ci clean deps lint config build package
