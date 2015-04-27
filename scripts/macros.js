function maketapirwikiparseandreplace() {
    // all the macros should either appear here or be imported here
    var pageContent = "";
    var viewpages = {
        total_rows: 0,
        rows: []
    };

    function refreshViewPages() {
        $.ajax({
            type: 'get',
            url: '_view/pages',
            async: false,
            success: function(data) {
                var results = JSON.parse(data);
                viewpages = results;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "Error!";
            }
        });
    }
    refreshViewPages();

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
        var pages = viewpages;

        var html = "";
        if (pages.total_rows > 0) {
            html += "Title | Last edited on | By\n---|---|---\n";
            for (var x = 0; x < pages.total_rows; x++) {
                var p = pages.rows[x];
                html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
            }
        }
        return html;
    }


    function recentChanges() {
        //console.log('recentChanges()');
        var pages = viewpages;

        pages.rows.sort(function(a, b) {
            // reverse sort
            var aw = (
                a.value.edited_on === undefined
            ) ? '' : a.value.edited_on.toLowerCase();
            var bw = (
                b.value.edited_on === undefined
            ) ? '' : b.value.edited_on.toLowerCase();
            return ((aw > bw) ? -1 : ((aw < bw) ? 1 : 0));
        });


        var html = "";
        if (pages.total_rows > 0) {
            html += "Title | Last edited on | By\n---|---|---\n";
            var recentPages = 5;
            if (pages.rows.lenght < recentPages) {
                recentPages = pages.rows.length;
            }
            for (var x = 0; x < recentPages; x++) {
                var p = pages.rows[x];
                html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
            }
        }
        return html;
    }



    function topicList(title) {
        //console.log('topicList(' + title + ')');
        var pages = viewpages;

        var html = "";
        if (pages.total_rows > 0) {
            html += "Title | Last edited on | By\n---|---|---\n";
            for (var x = 0; x < pages.total_rows; x++) {
                var p = pages.rows[x];
                if (p.id.substring(title.length, 0) == title) {
                    html += "[" + p.id + "](#" + p.id + ") | " + p.value.edited_on + " | " + p.value.edited_by + "\n";
                }
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

        // maybe shouldn't refresh all the time?
        //refreshViewPages();

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
