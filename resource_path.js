/****************************************
 *
 * Copyright (c) 2025 Fahim Faisal
 *
 ****************************************/

const jsYaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function getResourcePath(filePath) {
	file = fs.readFileSync(filePath, "utf-8");

	re = /^(---\n)([\s\S]*?)(\.\.\.\n|---\n)/gm
	yamlBlocks = file.matchAll(re);

	yamlData = {} 
	for (const yamlBlock of yamlBlocks) {
		yaml = yamlBlock[2];
		yaml = jsYaml.load(yaml);	
		yamlData = {...yamlData, ...yaml};
	}

	let fileName = "";
	let permCharsRe = /^[\w- ]*/g
	if ("url_path" in yamlData) {
		fileName = yamlData["url_path"];
	} else if ("title" in yamlData) {
		fileName = yamlData["title"];
		fileName = fileName.match(permCharsRe)[0]
					.trim().toLowerCase().replaceAll(/  */g, '-');
	} else {
		filePathParts = path.parse(filePath);		
		fileName = filePathParts.name;
		fileName = fileName.match(permCharsRe)[0]
					.trim().toLowerCase().replaceAll(/  */g, '-');
	}

	return fileName;
}

module.exports = getResourcePath;
