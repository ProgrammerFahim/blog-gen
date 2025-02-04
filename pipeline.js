/****************************************
 *
 * Copyright (c) 2025 Fahim Faisal
 *
 ****************************************/

const fs = require("fs");
const path = require("path");

const getResourcePath = require("./resource_path");
const pandoc = require("node-pandoc");
const katex = require("katex");
const hljs = require("highlight.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function readDirectory(dir, fileList = []) {
	const listing = fs.readdirSync(dir, { withFileTypes: true });

	for (let file of listing) {
		let fullName = path.join(file.path, file.name);
		if (file.isFile()) {
			fileList.push(fullName);
		} else if (file.isDirectory()) {
			readDirectory(fullName, fileList);
		}
	}

	return fileList;
}

config = fs.readFileSync("config.json", "utf-8");
config = JSON.parse(config);

files = readDirectory(config.src);

for (const file of files) {
	let resourcePath = getResourcePath(file);
	let inputFileParts = path.parse(file);
	let inputDirRelative = path.relative(config.src, inputFileParts.dir);

	let outputDir = "";
	if (config.preserve_folder_hierarchy) {
		outputDir = path.join(config.tgt, inputDirRelative, resourcePath);
	} else {
		outputDir = path.join(config.tgt, resourcePath);
	}

	try {
		fs.mkdirSync(outputDir, { recursive: true });
	} catch(err) {
		if (err.code != 'EEXIST') {
			console.error(err);
			throw new Error("Problem with creating output folder");
		}
	}

	let outputFile = path.join(outputDir, "index.html");

	let args = "-s --katex --no-highlight --template=template/default.html";
	(function (outFile) {
		pandoc(file, args, function(err, res) {
			if (err) {
				console.error(err);
				console.log("Error occured when working on output file", outFile);
				return;
			}
			
			dom = new JSDOM(res);

			// format code
			codeBlocks = dom.window.document.querySelectorAll("pre code");
			if (codeBlocks.length > 0) {
				codeBlocks.forEach(hljs.highlightElement);

				// Insert link to code stylesheet
				codeLink = dom.window.document.createElement("link");
				codeLink.rel = "stylesheet";
				codeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css";
				dom.window.document.head.appendChild(codeLink);
			}

			// format math
			document = dom.window.document;
			mathElements = dom.window.document.getElementsByClassName("math");
			macros = [];
			for (var i = 0; i < mathElements.length; i++) {
				texText = mathElements[i].firstChild;
				if (mathElements[i].tagName == "SPAN") {
					katex.render(texText.data, mathElements[i], {
						displayMode:mathElements[i].classList.contains('display'),
						throwOnError: false,
						macros: macros,
						fleqn: false
					});
				}
			}

			// write file to output
			formattedHtml = dom.serialize();
			fs.writeFileSync(outFile, formattedHtml);
		});
	})(outputFile);
}
