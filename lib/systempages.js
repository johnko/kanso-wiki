module.exports = [
    {
        "_id": "FrontPage",
        "body": "# Welcome to your new wiki! :)\n\nWell done, it looks like your new wiki is up and running. This is the first page which users will see when coming to the wiki, unless they follow a link to a specific page. The wiki is a quick and simple way of sharing information between people.\n\n## Features\n\nWith your new wiki you can:\n* Easily [add pages](#NewPage) to store notes or any information\n* Anyone can __Edit__ pages so the information is easier to maintain\n* Use [Markdown](#HelpOnFormatting) formatting to decorate your text while focusing on the content\n* Make use of [CouchDB](#HelpOnCouchDB) features such as replication to allow users to take the wiki offline\n* Use [macros](#HelpOnMacros) to list and include other wiki page content\n* Create page templates to provide a quick starting point for new pages (any page with a name starting with __PageTemplate__ will become a template!)\n* You can view previous versions of a page using the __History__ button.\n* Upload files / attachments for a page. For example, you can upload a picture for your page.\n\n## Recent changes\n\nHere's what's new for this wiki.\n{recentChanges}\n\n{include:HelpOnGettingStarted}\n\n## Need more help?\n\nYou can get more help here [Help](#Help)",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:28:39 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "Help",
        "body": "# Help! Help! Help!\n\nThe following pages provide some useful information for using the wiki. \n\n{topic:HelpOn}\n\nYou can add to these pages by creating a new page called [HelpOnBlah](#HelpOnBlah)!",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:40:02 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnAttachments",
        "body": "# Attachments\n\nYou can upload attachments (files) to any page. This lets you store images and other files alongside your wiki pages. If you are using the [replication](#HelpOnReplication) feature, the attachments will also be replicated with your wiki, so any users will automatically get any new attachments and have files available offline (assuming that's where there wiki is!)\n\n## Uploading an attachment\n\n* Click the __Attachments__ button when viewing a page\n* There you will see a list of existing attachments (or none)\n* Click __Browse File__ and choose a file to attach\n* Click __Upload File__ to attach.\n\nWhen you next click the __Attachments__ button, you will see a list of previously uploaded attachments.\n\nHave a look at [HelpOnFormatting](#HelpOnFormatting) to see how to include an image in your page.\n",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:33:02 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnCouchDB",
        "body": "# CouchDB\n\n## Location of server config file\n\nOn Mac OS X:\n```\n~/Library/Application\\ Support/CouchDB/etc/couchdb/local.ini\n```\n\nOn FreeBSD:\n```\n/usr/local/etc/couchdb/local.ini\n```\n\n## Disable secure rewrites\n\nTo allow for rewrites like `../../..` run\n\n```\ncurl -X PUT -d '\"false\"' http://localhost:5984/_config/httpd/secure_rewrites\n```\n\nor add to the server config file:\n\n```\n[httpd]\nsecure_rewrites\t= false\n```\n\n## Next steps\n\nSee [HelpOnCouchDBKanso](#HelpOnCouchDBKanso)",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:26:13 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnCouchDBKanso",
        "body": "# CouchDB Kanso\n\nDeployment of johnko's Kanso apps 8-)\n\n## 1. Install dependencies\n\n1. Download and install `couchdb` from http://couchdb.apache.org/\n2. Download and install `node` from https://nodejs.org\n3. Then to install `kanso`, run:\n\n```\n#!/bin/sh\nsudo npm install -g kanso\n```\n\n## 2. Clone the code\n\nUsing `git`:\n\n```\n#!/bin/sh\ngit clone https://github.com/johnko/kanso-example.git\ngit clone https://github.com/johnko/kanso-movies.git\ngit clone https://github.com/johnko/kanso-music.git\ngit clone https://github.com/johnko/kanso-wiki.git\n```\n\n## 3. Script the install\n\n```\n#!/bin/sh\n\nCOUCHURL=http://localhost:5984/\n\nAPPFOLDER=kanso-example\nkanso install ${APPFOLDER}\nkanso push    ${APPFOLDER}  ${COUCHURL}/example\n\nAPPFOLDER=kanso-movies/couchapp\nkanso install ${APPFOLDER}\nkanso push    ${APPFOLDER}  ${COUCHURL}/movies\n\nAPPFOLDER=kanso-music/couchapp\nkanso install ${APPFOLDER}\nkanso push    ${APPFOLDER}  ${COUCHURL}/music\n\nAPPFOLDER=kanso-wiki\nkanso install ${APPFOLDER}\nkanso push    ${APPFOLDER}  ${COUCHURL}/wiki\n```\n\n## 4. Fix the Admin Party (create an admin user)\n\n## 5. Set database permissions\n\nIn\n\n* `${COUCHURL}/_utils/database.html?movies/_all_docs`\n* `${COUCHURL}/_utils/database.html?music/_all_docs`\n\nYou should set security `Admin.Roles` so only users with the listed roles can access your database.\n",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:31:15 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnFormatting",
        "body": "# Markdown Format\n\nClick the __Edit__ button to see what typed text turns into the following formatting.\n\n---\n\nFrom https://markdown-it.github.io/\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n\"Smartypants, double quotes\" and 'single quotes'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code \"fences\"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ \"title text!\")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg \"The Stormtroopocat\")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  \"The Dojocat\"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts \"HTML\", but keep intact partial entries like \"xxxHTMLyyy\" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:35:15 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnGettingStarted",
        "body": "# Getting started\n\n##  Edit this page\n\nYou probably want to edit [FrontPage](#FrontPage) so you have your own content there. You can do that using the __Edit__ button near the top. You can put whatever you want on this page. As you __Save__ pages, TapirWiki will record your changes. You can use the page __History__ to view previous versions of each page.\n\n## New page\n\nYou can create a new page by following a link to a [PageWhichDoesNotExist](#PageWhichDoesNotExist). For ease of use, a link to a page called [NewPage](#NewPage) is in the main navigation at the top of each page. \n\n## Help\n\nThere are a few other useful bits of help, and you can add your own as you go.\n{topic:HelpOn}\n\n## Advanced settings\n\nAdvanced settings for the wiki are stored in a document in Couch - the doc id is __TAPIRWIKISETTINGS__. This sets the following:\n* The wiki name (e.g. TapirWiki)\n* The default page (e.g. [FrontPage](#FrontPage))\n* The default username for new / unknown users (e.g. Anon.)\n* The pages which are linked to in the main navigation\n\nEdit this document (using [Futon](/_utils/)) to change these settings. There is no built in admin functionality in TapirWiki (yet!)",
        "edited_by": "system",
        "edited_on": "2016-01-14 07:06:49 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnMacros",
        "body": "# Macros\n\nMacros are functions you can call in a wiki page. There are a few simple macros in TapirWiki, this page tells you how to use them. Looking at this page will show each macro in use. If you __Edit__ the page, you will see how to call them so that you can use them in your own pages.\n\n## Using a macro\nTo use a macro, simply include it in the markup for your page. Try editing this page to see how the macros are invoked. The macros are contained in curly braces {macro} and some take an additional argument {macro:argument}\n\n### Index\nThe index macro lists all pages in the wiki. The macro name is __index__ and it takes no arguments. Use it as follows:\n{index}\n\n### Topic List\nThe topic list macro finds all pages whose names begin with a given string. The macro name is __topic__ and the argument is the first part of the page name which must match to be listed. For example, find all help pages in the Wiki:\n{topic:HelpOn}\n\n### Recent Changes\nYou can provide a list of the 5 most recent page edits which have occurred using the recent changes macro. It's a nice one to include on your FrontPage so people know what's going on. The macro name is __recentChanges__ and it takes no arguments. Use it as follows:\n{recentChanges}\n\n### Includes\nYou can include the content from any page within the body of any other page. Use this macro to reduce duplication in your wiki. The macro name is __include__ and the argument is the page name to include. For example, to include the Help page:\n{include:Help}\n\nIf the page you include cannot be found, you will get an error message and a link to the page. Following the link should enable you to edit the page.\n{include:PageWhichDoesNotExistYet}\n",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:37:30 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "HelpOnReplication",
        "body": "# Help on replication\n\n## CouchDB replication where doc.type==page\n\nAssuming you already have a localhost wiki design doc\n\n### server to localhost\n\n```\ncurl -H 'Content-Type: application/json' -X POST http://localhost:5984/_replicate -d '{\"source\": \"https://username:password@remote.server.address/database\", \"target\": \"wiki\", \"filter\":\"wiki/pages\", \"create_target\": false, \"continuous\": false}'\n```\n\n### localhost to server\n\n```\ncurl -H 'Content-Type: application/json' -X POST http://localhost:5984/_replicate -d '{\"source\": \"wiki\", \"target\": \"https://username:password@remote.server.address/database\", \"filter\":\"wiki/pages\", \"create_target\": false, \"continuous\": false}'\n```\n\n## TapirWiki replication\n\nTwo-way replication is also supported through the wiki UI. However, it is disabled by default. Replication __needs testing and may contain bugs or simply not work as you expect__. Please let me know if this is the case by raising an issue at https://github.com/johnko/kanso-wiki/issues\n\n### Enable replication\n\nEnabling replication requires editing the __TAPIRWIKISETTINGS__ document.\n\n* Open [Futon](/_utils/)\n* Open the database containing your wiki (e.g. 'wiki')\n* Open the __TAPIRWIKISETTINGS__ document - this contains a number of settings for the wiki\n* Change the __replicationEnabled__ field to true\n* change the __replicationEndPoint__ field to be a URL to the central node in your wiki (e.g. http://remotehost:5984/tapirwiki)\n* __Save__ the changes to the document and refresh your wiki\n\nIf the changes are successful, a new __Synchronize__ button should appear in the wiki navigation menu. \n\n`Note: The synchronize button will not be show if you are viewing the wiki from the URL of the replicationEndPoint. For example, if you are browsing the wiki at http://remotehost:5984/wiki, the button will not be shown.`\n\n### How replication works\n\nThe replication in TapirWiki is a thin layer over the support for replication provided by CouchDB. When you press the synchronize button, the following occurs:\n\n* The remote wiki's changes are replicated to your local wiki\n* Your local wiki's changes are replicated to the remote wiki\n\nReplication only transfers the latest version of any page, so if you have a page which you have edited a lot on one computer, the historic version of the pages will remain on that computer - only the latest will be synchronized.\n\n### Conflicts\n\nConflicts occur when two or more changes are made to the same wiki page on two different instances. Any conflicts which occur should be visible through the page __History__. You can view the conflicting edit form here, and if you wish this version to become the most recent again, you can simply edit from that point.",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:57:34 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "Index",
        "body": "# Index\n\nBelow is a list of all pages in your wiki:\n\n{index}",
        "edited_by": "system",
        "edited_on": "2016-01-14 06:24:32 GMT+0000 (UTC)",
        "type": "page"
    },
    {
        "_id": "TAPIRWIKISETTINGS",
        "defaultPage": "FrontPage",
        "defaultUserName": "Anon.",
        "edited_by": "system",
        "mainMenu": [
          "FrontPage",
          "Index",
          "NewPage",
          "Help"
        ],
        "replicationEnabled": false,
        "replicationEndPoint": "http://hostname:5984/dbname",
        "wikiName": "Wiki"
    }
];
