#!/bin/bash

declare -a categories=("engines")

for category in "${categories[@]}"
do
  data_file="./conf/dbpedia-refs-$category.txt"
  mkdir -p "./stage/data/$category/"
  while read -r line; do
    echo "Fetching $category JSON data for $line ..."
    curl "http://dbpedia.org/data/$line.rdf" --silent --output "./stage/data/$category/$line.rdf"
  done < "$data_file"
done
