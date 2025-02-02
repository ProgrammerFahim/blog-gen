BlogGen
-------

**BlogGen** is a script that takes a folder of Markdown files meant to be blog posts and generates HTML pages for a minimal blog. It can handle both code-rendering and math-typesetting, and does not produce any page requiring JavaScript. The styles that come out of the box should be suitable for most people's taste, and can be changed by tinkering with the `styles.html` file in the `template` directory.

Usage
-----

This project is essentially all JavaScript scripts, so you'll need to have [Node](https://nodejs.org/en) installed. You'll also need to have [Pandoc](https://pandoc.org/) on your system. On Debian-based Linux distros, you can install it with:

```bash
sudo apt install pandoc
```

Once you have done that, clone the repository and install the required node packages:

```bash
git clone https://github.com/ProgrammerFahim/blog-gen.git
cd blog-gen
npm install
```

Inside the file `config.json`, you should set both the `src` folder (the directory where your markdown files reside) and the `tgt` folder (the directory where the generated blog pages should be placed). Once that's done, simply run the script with:

```bash
npm run gen
```

Markdown Pointers
-----------------

The Markdown files should follow [Pandoc's markdown format](https://pandoc.org/MANUAL.html#pandocs-markdown), which is just an extension of ordinary markdown. To expect reasonable defaults for your blog's URLs, you should put a metadata block on top of every Markdown page with at least a `title` variable. By default, **BlogGen** will take that title, remove non-alphanumeric characters, lowercase it, and replace every sequence of spaces with single dashes to create the URL for each blog post. If you have a URL in mind, you can override this behavior by putting a `url_path` variable in the metadata.

```
---
title: 'My Fantastic Blog!'
url_path: 'my-preferred-url'
---
```
