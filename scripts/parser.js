/***************************************
 *
 *	Javascript Textile->HTML conversion
 *       jeroen vet jvet.info
 *
 * Differences from textile 2.0 'standard' as published on :
 * - block quote and block code are ended with double newline, if you want more than one empty line put a space on the line.
 * - all newlines within elements are substituted by <br /> even for notextile or whatnot. If you don't want newlines then
 *   enter it without newlines
 * - single newlines are generally allowed (also in 'inline' elements) for some reason not allowed in standard
 * - lists can be mixed (bug in 'standard')
 * -
 ****************************************/




function makeTextileParser() {
    // This is the "module" which, after initialization returns the parser function
    // do this in user code: textileParser=makeTextileParser(); then call with: textileParser(text);

    // Define content arrays. Ensure that routine only looks for possible content to spurious matches
    var phrase = ["bold", "italics", "emphasis", "strong", "citation", "superscript", "subscript", "span",
        "deleted", "inserted", "code", "notextilein", "image", "acronym", "footref",
        "linetoken"
    ];
    var inline = phrase.concat(["texlinkurl", "wikilink", "aliaslink"]);
    var headings = ["heading1", "heading2", "heading3", "heading4", "heading5", "heading6"];
    var blocks = headings.concat(["para", "bulletlist", "numberlist", "blockcode", "blockcodec", "blockquote", "blockquotec",
        "table", "blockhtml", "notextilebl", "pre", "footnote", "linkalias", "blocktoken"
    ]);
    var flow = blocks.concat(inline);
    // precontent = inline but no img


    // define the object holding the names, regular expressions, and content it can have (to check for)
    // since JavaScript does not support lookbehind we sometimes need to match more than we need, therefore we adopt
    // the following convention: $1 = real match $2 = attributes $3 = payload $4 etc. are optionals
    // this object must be a closure so that it is initialized only once
    var markup = { //block
        // textile does not allow bare text in body -> converted to paragraph so if root only look for blocks (not flow)
        root: {
            re: "",
            ct: blocks
        },
        heading1: {
            re: /(^h1(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        }, //newlines are allowed but no doubles
        heading2: {
            re: /(^h2(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        heading3: {
            re: /(^h3(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        heading4: {
            re: /(^h4(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        heading5: {
            re: /(^h5(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        heading6: {
            re: /(^h6(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        para: {
            re: /(^p(\S*)\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        }, //explicit paragraph
        // for html just taking $0 as the match
        blockhtml: {
            re: /(<(p|h[1-6]|div|ul|ol|dl|pre|blockquote|address|fieldset|table|ins|del|script|noscript)(?:"[^"]*"|'[^']*'|[^'">])*?>)((?:.|\n)*)<\/\2>(?:\n|\r\n)?/,
            ct: []
        },

        // lists - payload is $3, attributes $2, level $1 - do not have to end with double newline, one is ok
        // list is ended by double newline or
        // we allow newlines in list.
        // list ends when: 1. double newline encountered 2. end of string ->
        // this way you can mix bullet and number lists and allow new lines in list items.
        bulletlist: {
            re: /(^\*((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\s*((?:.|\n(?!\n))*)(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: ["listitemb"]
        },
        numberlist: {
            re: /(^#((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\s*((?:.|\n(?!\n))*)(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: ["listitemn"]
        },

        listitemb: {
            re: /(^((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)((?:.|\n(?!\*)|\n\*\*)*)(?:\n|$))/,
            ct: flow
        }, //
        listitemn: {
            re: /(^((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)((?:.|\n(?!#)|\n##)*)(?:\n|$))/,
            ct: flow
        }, //
        // blockcode  is ended by double newline if you want more newlines in between use a space on line, same goes for blockquote
        blockcode: {
            re: /(^bc([()]*(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\.\s+((?:.|\n)*?)(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: []
        },
        blockcodec: {
            re: /(^bc([()]*(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\.\.\s+((?:.|\n(?!^(?:h[1-6]|p|pre|bc|fn\d+|bq)\S*\.))*))/m,
            ct: []
        },
        blockquote: {
            re: /(^bq([()]*(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\.\s+((?:.|\n)*?)(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: flow
        },
        blockquotec: {
            re: /(^bq([()]*(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\.\.\s+((?:.|\n(?!^(?:h[1-6]|p|pre|bc|fn\d+|bq)\S*\.))*))/m,
            ct: flow
        },
        table: {
            re: /(^(?:table((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{.*\})?)\.(?:\n|\r\n))?(\|(?:.|\n)*?\|)\s*(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: ["tablerow"]
        },
        tablerow: {
            re: /(^(?:((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)\.)?(\|(?:.|\n)*?\|)\s*(?:\n|\r\n|$(?!\n)))/m,
            ct: ["headercell", "datacell"]
        },
        // attributes data cell in this order: colspan, rowspan, alignment, class/id, language, explicit style (all before the dot)
        headercell: {
            re: /(^\|_((?:\\\d+)?(?:\/\d+)?[()]*(?:[<>=^~]|<>)?(?:\/\d+)?(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{.*\})?)?\.([^\|]*)(?:\|$)?)/,
            ct: flow
        },
        datacell: {
            re: /(^\|(?:((?:\\\d+)?(?:\/\d+)?[()]*(?:[<>=^~]|<>)?(?:\/\d+)?(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{.*\})?)\.)?([^\|]*)(?:\|$)?)/,
            ct: flow
        },
        bold: {
            re: /(?:^|\W)(\*\*((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^\*\s](?:.|\n)+?[^\*\s])\*\*)(?=$|\W)/,
            ct: inline
        },
        italics: {
            re: /\b(__((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^_\s](?:.|\n)+?[^_\s])__)\b/,
            ct: inline
        },
        emphasis: {
            re: /\b(_((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^_\s](?:.|\n)+?[^_\s])_)\b/,
            ct: inline
        },
        strong: {
            re: /(?:^|\W)(\*((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^\*\s](?:.|\n)+?[^\*\s])\*)(?=$|\W)/,
            ct: inline
        }, // whereas the textile 2.0 standard does not seem to allow this for some
        citation: {
            re: /(?:^|\W)(\?\?((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^\?\s](?:.|\n)+?[^\?\s])\?\?)(?=$|\W)/,
            ct: inline
        }, // reason.
        superscript: {
            re: /(\^((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)((?:.|\n)+?)\^)(?=$|\W)/,
            ct: inline
        }, // we allow superscript to start at non word boundery for footnotes etc.
        subscript: {
            re: /(~((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)((?:.|\n)+?)~)(?=$|\W)/,
            ct: inline
        }, // subscript likewise
        span: {
            re: /(?:^|\W)(%((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^%\s](?:.|\n)+?[^%\s])%)(?=$|\W)/,
            ct: inline
        },
        deleted: {
            re: /(?:^|\W)(-((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^\-\s](?:.|\n)+?[^\-\s])-)(?=$|\W)/,
            ct: inline
        }, // you can only insert or strike whole words
        code: {
            re: /(?:^|\W)(@((?:\([\w-]*(?:#[-\w]+)?\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)((?:.|\n)+?)@)(?=$|\W)/,
            ct: []
        },
        inserted: {
            re: /(?:^|\W)(\+((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^+\s](?:.|\n)+?[^+\s])\+)(?=$|\W)/,
            ct: inline
        },
        acronym: {
            re: /(?:^|\W)(()([A-Z]+)\((.*?)\))/,
            ct: []
        },
        //footref no payload (no m[3])
        footref: {
            re: /(?:^|\W)\w+(\[()()(\d+)\])/,
            ct: []
        },
        // footnote no class/id attributes as assigned automatically
        footnote: {
            re: /(^fn(\d+)((?:<|>|=|<>)?[()]*(?:\[[a-z][a-z]\])?(?:\{\S*\})?)?\.\s+((?:.|\n)*?)(?:\n\s*\n|\r\n\s*\r\n|$(?!\n)))/m,
            ct: inline
        },
        texlinkurl: {
            re: /("((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^"]+)":((?:http|https|ftp|git):\/\/(?:[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?\.)+[a-z]{2,6}(?::\d{1,5})?(?:\/\S*)?))/i,
            ct: phrase
        },
        // image $3 is empty $4 is src file $5 is title $6 is link if any
        image: {
            re: /(!((?:[<>()]*)?(?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)?()(\S+?)(\(.*\))?!(?::((?:http|https|ftp):\/\/(?:[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?\.)+[a-z]{2,6}(?::\d{1,5})?(?:\/\S*)?))?)/i,
            ct: []
        },
        pre: {
            re: /(^pre\.\s()((?:.|\n)*?)(?:\n\n|\r\n\r\n|$(?!\n)))/m,
            ct: []
        }, // pre has a different meaning in textile. It is really the same as bc. but without the code formatting.
        // link alias name m[2] value m[4]
        linkalias: {
            re: /(^\[(\w+?)\]()((?:http|https|ftp|git):\/\/(?:[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?\.)+[a-z]{2,6}(?::\d{1,5})?(?:\/\S*)?))/m,
            ct: []
        },
        aliaslink: {
            re: /("((?:\(\S*\))?(?:\[[a-z][a-z]\])?(?:\{\S*\})?)([^"]+)":(\w+))/i,
            ct: phrase
        },
        // below muchachos get special nodes the payload is put in value (m[2])
        notextilebl: {
            re: /(^notextile\.\s((?:.|\n)*?(?:\n\n|\r\n\r\n|$(?!\n))))/m,
            ct: []
        },
        notextilein: {
            re: /(?:^|\s)(==((?:.|\n)+?)==(?=(?:$|\s)))/m,
            ct: []
        },
        wikilink: {
            re: /(?:^|[^A-Za-z0-9!:\>\/])(([A-Z](?:[A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*))/m,
            ct: []
        },
        blocktoken: {
            re: /(^(\{\S.*?\})\s*$)/m,
            ct: []
        },
        linetoken: {
            re: /(?:^|[^!])((\{\S*?\}(?!\.)|\[\S*\](?!\{)))/m,
            ct: []
        }
        //no node created for below guys the escape "!" is simply stripped
        // texlinkmail : {re : /(?:^|\W)("([^"]+)":((http|https|ftp|git):/{0,2}[^\w+)/i, tag : "a"},
    };

    // TODO:
    // var rfn = /^fn(\d+)\.\s*(.*)/;
    // var bq = /^bq\.(\.)?\s*/;
    // var table=/^table\s*\{(.*)\}\..*/;
    // var trstyle = /^\{(\S+)\}\.\s*\|/;




    function Node(type, value, parent) {
        // Define a node object that can be of type element type (type = "tag", or text type="#text")
        this.type = type; // element textile name or "#text" or #htmlblock
        this.value = value; // in case of element the string with attributes and values, in case text the text string, in case of root contains dictionary aliases
        this.parent = parent;
        this.siblings = []; // in case of text this is null
    }

    var escwikilink = /!((?:[A-Z](?:[A-Z0-9]*[a-z][a-z0-9]*[A-Z]|[a-z0-9]*[A-Z][A-Z0-9]*[a-z])[A-Za-z0-9]*))/g;
    var esctoken = /!(\{\S*?\}(?!\.)|\[\S*\](?!\{))/g;

    function RemoveEscSign(text) {
        text = text.replace(escwikilink, "$1");
        text = text.replace(esctoken, "$1");
        return text;
    }

    // define a parse function. Constructs a tree of nodes
    // regeexes we need in the loop
    var rb = new RegExp("^\\*\\s*", "mg");
    var rn = new RegExp("^#\\s*", "mg");
    var parsetext = function(text, parent) {
        // call this function repeatedly until no matches no
        // for now logic about which tags not to test (no testing for link if parent is link for example)
        // we have to find the first outer match. Strip in three parts. Text before the match.
        // The match. And text-still to be parsed after the match.
        while (text.length > 0) {
            var first = {
                markup: "",
                m: []
            };
            first.m.index = text.length;
            //find first match
            for (var count = 0; count < markup[parent.type].ct.length && first.m.index > 0; count++) {
                var found = markup[markup[parent.type].ct[count]].re.exec(text);
                if (found && found.index < first.m.index) {
                    first.markup = markup[parent.type].ct[count];
                    first.m = found;
                }

            }
            if (first.markup !== "") {
                // correct here exceptions in match order
                if (first.markup == "footnote") {
                    var temp = first.m[2];
                    first.m[2] = first.m[3];
                    first.m[3] = first.m[4];
                    first.m[4] = temp;
                }
                var realindex = first.m.index + first.m[0].indexOf(first.m[1]);
                if (realindex > 0) { // deal with text before match
                    if (parent.type !== "root") {
                        parent.siblings.push(new Node("#text", RemoveEscSign(text.substring(0, realindex)), parent));
                    } else { // no orphaned text under root -> convert to paragraphs unless special code [] or {}
                        var paragraphs = text.substring(0, realindex).split(/(?:\n\n|\r\n\r\n)/);
                        for (var i = 0; i < paragraphs.length; i++) {
                            var nwsibling = new Node("para", "", parent);
                            parent.siblings.push(nwsibling);
                            parsetext(paragraphs[i], nwsibling);
                        }
                    }
                }
                // special treatments
                if (first.markup == "blockhtml") {
                    // just create a html node
                    // as regex is greedy first make sure you get only the first outer block (indicated by an unmatched closing tag)
                    var retago = new RegExp("<" + first.m[2] + '(?:"[^"]*"|' + "'[^']*'|[^'" + '">])*?>', "g"); // opening tag
                    var retagc = new RegExp("</" + first.m[2] + ">(\\n|\\r\\n)?", "g"); // closing tag
                    var resulto, resultc;
                    if ((resultc = retagc.exec(first.m[3])) !== null) { // block is nested found a closing tag
                        do {
                            if ((resulto = retago.exec(first.m[3])) !== null) { // found an opening tag
                                if (retagc.lastIndex < retago.lastIndex) { // there are several outer blocks, first one found
                                    first.m[0] = first.m[0].substring(0, first.m[1].length + retagc.lastIndex); // correct match for first outer block only
                                    break;
                                }
                            }
                        } while ((resultc = retagc.exec(first.m[3])) !== null);
                    }
                    parent.siblings.push(new Node("#html", first.m[0], parent));
                } else if (first.markup == "notextilebl" || first.markup == "notextilein") {
                    parent.siblings.push(new Node("#html", first.m[2], parent));
                } else if (first.markup == "wikilink") {
                    parent.siblings.push(new Node("#wikilink", first.m[2], parent));
                } else if (first.markup == "linetoken") {
                    parent.siblings.push(new Node("#linetoken", first.m[2], parent));
                } else if (first.markup == "blocktoken") {
                    parent.siblings.push(new Node("#blocktoken", first.m[2], parent));
                } else if (first.markup == "linkalias" && parent.type == "root") { // only allowed on root level
                    parent.value[first.m[2]] = first.m[4];
                } else {
                    // create a regular node that can have siblings
                    //var nwsibling2=new Node(first.markup, makeattributestring(first.m[2]), parent);
                    var nwsibling2 = new Node(first.markup, [first.m[2]], parent);
                    // do special case lists (normalize nested lists):
                    if (first.markup == "listitemb") {
                        first.m[3] = first.m[3].replace(rb, "");
                    }
                    if (first.markup == "listitemn") {
                        first.m[3] = first.m[3].replace(rn, "");
                    }
                    // in case more attributes append to value array
                    for (var i2 = 4; i2 < first.m.length; i2++) {
                        nwsibling2.value.push(first.m[i2]);
                    }
                    parent.siblings.push(nwsibling2);
                    if (first.m[3].length > 0) {
                        parsetext(first.m[3], nwsibling2);
                    }
                }
                // chop of text before and matched text from string
                text = text.substr(first.m.index + first.m[0].length);
            } else { // no match so everything is regular text -> leaf node (#)
                if (parent.type != "root") {
                    parent.siblings.push(new Node("#text", RemoveEscSign(text), parent));
                } else { // orphaned text at the end of document is converted to paragraphs2
                    var paragraphs2 = text.split(/(?:\n\n|\r\n\r\n)/);
                    for (var i3 = 0; i3 < paragraphs2.length; i3++) {
                        var nwsibling3 = new Node("para", "", parent);
                        parent.siblings.push(nwsibling3);
                        parsetext(paragraphs2[i3], nwsibling3);
                    }
                }
                text = ""; //same as break
            }
        }
    };


    // this is the function returned
    return function(text) { // actual parser function to return
        var p = new Node("root", {}, null);
        parsetext(text, p);
        return p;
    };
}
