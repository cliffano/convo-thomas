ci: clean tools deps lint config gen package

# deps-local is called twice here because the first one is needed to generate the agent and middleware
# while the second one is used for overwriting the node modules resolved from the generated middleware
gen-local: clean deps-local gen deps-local deploy

clean:
	rm -rf generated stage

stage:
	mkdir -p generated/dialogflow-agent/ stage/data/engines/

deps:
	npm install async@2.6.1 mustache@3.0.1 rdf-parser-rdfxml@0.3.1 wget-improved@3.0.2
	npm install convo-node@0.0.3 convo-jenkins-helper@0.0.2 generator-convo@0.0.4

deps-local:
	cd ../convo-node && npm link
	cd ../convo-jenkins-helper && npm link
	cd ../convo-generator && npm link
	npm link convo-node
	npm link convo-jenkins-helper
	npm link generator-convo

tools:
	npm install -g jshint@2.9.7 mustache@3.0.1 yaml-lint@1.2.4 yo@2.0.5

lint:
	jshint scripts/*.js

config: stage
	scripts/fetch-dbpedia-resources.js
	scripts/gen-engines-summary.js
	scripts/gen-mustache-view.js
	mustache generated/mustache-view.json specifications/convo-thomas-template.mustache > specifications/convo-thomas.yaml

gen: gen-agent

deploy: deploy-agent

package: package-agent

gen-agent:
	mkdir -p generated/dialogflow-agent
	cd generated/dialogflow-agent && yo convo dialogflow-agent ../../conf/env.yaml ../../specifications/convo-thomas.yaml --force

deploy-agent:
	dialogflow-cli import --credentials ./conf/credentials.json generated/dialogflow-agent/

package-agent: stage gen-agent
	cd generated/dialogflow-agent/ && zip ../../stage/convo-thomas-dialogflow-agent.zip -r .

.PHONY: ci gen-local clean stage deps deps-local tools lint config gen deploy package gen-agent deploy-agent package-agent
