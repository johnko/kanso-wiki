function maketapirwikiparseandreplace() {
    // all the macros should either appear here or be imported here
    var pageContent = "";

    function includePage(id) {
        //console.log('includePage(' + id + ')');
        $.ajax({
            type: 'get',
            url: '../../' + id,
            async: false,
            success: function(data) {
                var page = JSON.parse(data);
                pageContent = convert(page.body);
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "\n\n***INCLUDE ERROR: [" + id + "](#" + id + ") does not exist yet...***";
            }
        });
        return pageContent;
    }

    function index() {
        //console.log('index()');
        var pages;

        $.ajax({
            type: 'get',
            url: '_view/pages',
            async: false,
            success: function(data) {
                var results = JSON.parse(data);
                pages = results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "Error!";
            }
        });

        var html = "Title | Last edited on | By\n---|---|---\n";
        for (var x = 0; x < pages.total_rows; x++) {
            var p = pages.rows[x];
            html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
        }
        return html;
    }


    function recentChanges() {
        //console.log('recentChanges()');
        var pages;

        $.ajax({
            type: 'get',
            url: '_view/pages',
            async: false,
            success: function(data) {
                var results = JSON.parse(data);
                pages = results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "Error!";
            }
        });

        pages.rows.sort(function(a, b) {
            var dateA = Date.parse(a.value.edited_on);
            var dateB = Date.parse(b.value.edited_on);
            if (dateA < dateB) {
                return 1;
            } else {
                return -1;
            }
        });


        var html = "Title | Last edited on | By\n---|---|---\n";
        var recentPages = 5;
        if (pages.rows.lenght < recentPages) {
            recentPages = pages.rows.length;
        }
        for (var x = 0; x < recentPages; x++) {
            var p = pages.rows[x];
            html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
        }
        return html;
    }



    function topicList(title) {
        //console.log('topicList(' + title + ')');
        var pages;

        $.ajax({
            type: 'get',
            url: '_view/pages',
            async: false,
            success: function(data) {
                var results = JSON.parse(data);
                pages = results;
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "INCLUDE ERROR: [" + id + "](#" + id + ") does not exist yet...";
            }
        });

        var html = "Title | Last edited on | By\n---|---|---\n";
        for (var x = 0; x < pages.total_rows; x++) {
            var p = pages.rows[x];
            if (p.id.substring(title.length, 0) == title) {
                html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
            }
        }
        return html;
    }

    // regexes
    var tokens = {
        indexMacro: {
            re: /\{index\}/,
            sub: index
        },
        topicMacro: {
            re: /\{topic:(\S.*?)\}/g,
            sub: topicList
        },
        recentChangesMacro: {
            re: /\{recentChanges\}/,
            sub: recentChanges
        },
        includeMacro: {
            re: /\{include:(.*?)\}/g,
            sub: includePage
        }
    }; // end tapirwikitokens


    function parseandreplace(text) {
        text = text.replace(tokens.indexMacro.re, tokens.indexMacro.sub());
        var topicMatches = text.match(tokens.topicMacro.re);
        //console.log(topicMatches);
        for (match in topicMatches) {
            var stripped = topicMatches[match].replace(/^\{topic:/, "").replace(/\}$/, "");
            text = text.replace(topicMatches[match], tokens.topicMacro.sub(stripped));
        }
        text = text.replace(tokens.recentChangesMacro.re, tokens.recentChangesMacro.sub());
        var includeMatches = text.match(tokens.includeMacro.re);
        //console.log(includeMatches);
        for (match in includeMatches) {
            var stripped2 = includeMatches[match].replace(/^\{include:/, "").replace(/\}$/, "");
            text = text.replace(includeMatches[match], tokens.includeMacro.sub(stripped2));
        }
        return text;
        // end parseandreplace()
    }


    return function(tree) {
        return parseandreplace(tree);
    };

    // end maketapirwikiparserandreplace()
}
