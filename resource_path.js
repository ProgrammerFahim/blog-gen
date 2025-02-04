/****************************************
 *
 * Copyright (c) 2025 Fahim Faisal
 *
 ****************************************/

const jsYaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function getResourcePath(filePath, src) {
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

        // if `url_path` variable is available in metadata block,
        // use it directory. Assume it is well-structured URL
        fileName = yamlData["url_path"];
    } else if ("title" in yamlData) {

        // If not `url_path`, repurpose the `title` to be the URL
        fileName = yamlData["title"];
        fileName = fileName.match(permCharsRe)[0]
                    .trim().toLowerCase().replaceAll(/  */g, '-');
    } else {

        // If not `url_path` AND `title`, try using the name
        // of the file itself
        filePathParts = path.parse(filePath);
        fileName = filePathParts.name;

        // If name of the file is `index`, use name of the directory
        // in which it resides (unless it is directly in the src directory)
        filePathRelative = path.parse(path.relative(src, filePathParts.dir));
        if (fileName == 'index' && filePathRelative.name != '')
            fileName = filePathRelative.name;

        fileName = fileName.match(permCharsRe)[0]
                    .trim().toLowerCase().replaceAll(/  */g, '-');
    }

    return fileName;
}

module.exports = getResourcePath;
