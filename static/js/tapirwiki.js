/* Tapir Wiki JS
  A wiki system which is hosted by CouchDB...
  Original work: Joshua Knight
*/


// JV: make the functions needed for rendering

var md = require('lib/markdown-it.min')({
        html: true,
        linkify: true,
        typographer: true
    }).use(require('lib/markdown-it-abbr.min'))
    .use(require('lib/markdown-it-container.min'), 'warning')
    .use(require('lib/markdown-it-deflist.min'))
    .use(require('lib/markdown-it-emoji.min'))
    .use(require('lib/markdown-it-footnote.min'))
    .use(require('lib/markdown-it-ins.min'))
    .use(require('lib/markdown-it-mark.min'))
    .use(require('lib/markdown-it-sub.min'))
    .use(require('lib/markdown-it-sup.min'));
tapirparseandreplace = maketapirwikiparseandreplace();


function convert(text) {
    return md.render(tapirparseandreplace(text));
}

function clearPreview() {
    $("#md-preview").html('');
}

String.prototype.toCamelCase = function() {
    return this.toString()
        .replace(/([A-Z]+)/g, function(m, l) {
            return l.substr(0, 1).toUpperCase() + l.toLowerCase().substr(1, l.length);
        })
        .replace(/[\-_\s](.)/g, function(m, l) {
            return l.toUpperCase();
        });
};

function timeLongFormatDate(timeString) {
    var localdate = new Date(Date.parse(timeString));
    var year = localdate.getFullYear();
    var month = (
        localdate.getMonth() < 9
    ) ? '0' + (localdate.getMonth() + 1) : (localdate.getMonth() + 1);
    var day = (
        localdate.getDate() < 10
    ) ? '0' + localdate.getDate() : localdate.getDate();
    return year + '-' + month + '-' + day;
}

function timeLongFormatTime(timeString) {
    var localdate = new Date(Date.parse(timeString));
    return localdate.toTimeString();
}

function timeLongFormat(timeString) {
    return timeLongFormatDate(timeString) + ' ' +
        timeLongFormatTime(timeString);
}

//Set some settings...
var settings;

wiki = {};

//wiki page properties
wiki._id = "";
wiki._rev = "";
wiki.body = "";
wiki.edited_by = "";
wiki.edited_on = "";
wiki.type = "page";


wiki.save = function() {

    if (wiki._rev === null || wiki._rev === "" || wiki._rev === undefined) {
        wiki._id = $("#title").val();
        //console.log('wiki._id: ' + wiki._id);
    }

    if (wiki._id === "") {
        error("Please enter a page title!");
    } else {
        wiki.body = $("#body").val();
        wiki.edited_on = timeLongFormat(Date().toString());
        wiki.edited_by = settings.defaultUserName;

        $.ajax({
            url: './_couchdb/_session',
            async: false,
            success: function(data) {
                var response = JSON.parse(data);
                if (response.userCtx.name !== null) wiki.edited_by = response.userCtx.name;
            }
        });

        $.ajax({
            type: 'put',
            url: './_db/' + this._id,
            data: JSON.stringify(this),
            async: false,
            success: function(data) {
                var response = JSON.parse(data);
                wiki._rev = response._rev;
                wiki.open(wiki._id);
                $.jGrowl("Your page has been saved...", {
                    header: "Cool!"
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
            }
        });
    }

};

wiki.display = function() {
    var n = $("<div id='page-body'>" + convert(this.body) + "</div>").hide();
    $("#inner-content").html(n);
    n.fadeIn("fast");
    $("#pageTitle").html(this._id);
    $("#page-menu").html("");
    $('<li class="pageSpecific"><a href="Javascript: wiki.edit()">Edit</a></li>').appendTo("#page-menu");
    $('<li class="pageSpecific"><a href="Javascript: wiki.history()">History</a></li>').appendTo("#page-menu");
    $('<li class="pageSpecific"><a href="Javascript: wiki.attachments()">Attachments</a></li>').appendTo("#page-menu");
    $('<li class="pageSpecific"><a href="Javascript: wiki.remove()">Delete</a></li>').appendTo("#page-menu");
    window.location = "#" + this._id;
    document.title = $('#wikiName').html() + " : " + this._id;
    $.tapirWiki.pageChangeReset(this._id);
};

wiki.init = function() {
    clearPreview();
    wiki._id = "";
    delete wiki._rev;
    delete wiki._revisions;
    delete wiki._attachments;
    wiki.body = "";
    wiki.edited_on = "";
    wiki.edited_by = "";
};

wiki.remove = function() {
    if (confirm("Really delete this page?")) {
        $.ajax({
            type: 'delete',
            url: './_db/' + wiki._id + '?rev=' + wiki._rev,
            success: function() {
                $.jGrowl("Page has been deleted...", {
                    header: "Cool!"
                });
                $("#page-body").fadeOut("slow", wiki.open('FrontPage'));
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
            }
        });
    }
};


wiki.open = function(id) {
    wiki.init();
    $.ajax({
        type: 'get',
        url: './_db/' + id + "?revs=true",
        success: function(data) {
            var page = JSON.parse(data);
            wiki._id = page._id;
            wiki._rev = page._rev;
            wiki.body = page.body;
            wiki._revisions = page._revisions;
            wiki.edited_on = page.edited_on;
            wiki.edited_by = page.edited_by;
            wiki._attachments = page._attachments;
            wiki.display();
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            wiki._id = id;
            wiki.edit();
        }
    });
};

wiki.edit = function() {
    $.tapirWiki.pageChangeReset(this._id);
    $("#inner-content").html("");

    var form = $("<form id='addNote'></form>").hide().appendTo("#inner-content").fadeIn("slow");

    if (wiki._rev) {
        //if there is a revision, it is an existing page and the title should be displayed read only
        $("<h1 id='title'> </h1>").appendTo(form);
    } else {
        //if no revision, it's a new page and we should let the user enter a page name
        $("#pageTitle").html("New page");
        document.title = $('#wikiName').html() + " : " + this._id;

        $("<h1><input id='title' type='text' /></h1>").appendTo(form);
        $("#title").focus();

        $("#title").blur(function() {
            var newTitle = $("#title").val().toCamelCase();
            $("#title").val(newTitle);
        });

        var pages;
        $.ajax({
            type: 'get',
            url: './_ddoc/_view/pages?include_docs=true',
            async: false,
            success: function(data) {
                var results = JSON.parse(data);
                pages = results;
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                pageContent = "INCLUDE ERROR!" + id + " does not exist yet...";
            }
        });
        //create the templates region.
        var templatesDiv = $("<div id='templates'>Page templates:<a id='shower'>Show</a></div>").appendTo(form);
        var templatesList = $("<ul id='templatesList'></ul>").hide().appendTo(templatesDiv);
        $("#shower").click(function() {

            if ($("#shower").html() == "Show") {
                $("#shower").html("Hide");
                $(templatesList).slideDown("slow");
            } else {
                $("#shower").html("Show");
                $(templatesList).slideUp("slow");
            }
        });

        var anyTemplates = false;

        for (var x = 0; x < pages.total_rows; x++) {
            var template = pages.rows[x].doc;
            if (template._id.substring(12, 0) == "PageTemplate") {
                $("<li><a onClick='Javascript: wiki.applyTemplate(\"" + template._id + "\")'>" + template._id.replace("PageTemplate", "") + "</a></li>").appendTo(templatesList);
                anyTemplates = true;
            }
        }
        if (anyTemplates === false) {
            //$("<p>No templates found. Create a page with a name starting TEMPLATE_ to get it listed here (e.g TEMPLATE_MyTemplate)</p>").appendTo(templatesList);
            $(templatesDiv).hide();
        }

    }
    $("#md-preview").html(convert(this.body));
    $("<textarea id='body'>" + this.body + "</textarea>").on('mouseup keyup', function(e) {
        $("#md-preview").html(convert($("#body").val()));
    }).appendTo(form);


    $("#page-menu").html("");
    $('<li><a href="Javascript: wiki.save();">Save</a></li>').appendTo("#page-menu").fadeIn("slow");

};

wiki.applyTemplate = function(id) {
    $.ajax({
        type: 'get',
        url: './_db/' + id,
        success: function(data) {
            var template = JSON.parse(data);
            $("#body").val(template.body);
            $("#shower").html("Show");
            $("#templatesList").slideUp("slow");
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error("Error!");
        }
    });
};


wiki.history = function() {
    //This function creates a history list for the current page, showing previous revisions (which occur through editing the page) and conflicts (which occur through replication)

    //create a holder for the history list
    $('#page-body').html('<h2>Page history</h2><p>This page shows all stored historical versions of this page.</p><ul id="history"></ul>').hide().fadeIn("slow");
    //get the current rev number
    var rev = this._revisions.start;

    //create an array to hold the merged list of revisions and conflicts
    var oldPages = [];

    //iterate through the revisions for the current page
    for (var x in this._revisions.ids) {
        $.ajax({
            type: 'GET',
            url: './_db/' + this._id + '?rev=' + rev + '-' + this._revisions.ids[x],
            async: false,
            success: function(data) {
                var page = JSON.parse(data);
                oldPages.push(page);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
            }
        });
        rev--;
    }

    //get conflicts for the current page, tag any pages as a conflict so we can identify them as such later
    $.ajax({
        type: 'GET',
        url: './_db/' + this._id + '?conflicts=true',
        async: false,
        success: function(data) {
            var conflicts = JSON.parse(data);
            for (rev in conflicts._conflicts) {
                $.ajax({
                    type: 'GET',
                    url: './_db/' + wiki._id + '?rev=' + conflicts._conflicts[rev],
                    async: false,
                    success: function(data) {
                        page = JSON.parse(data);
                        page.conflict = true;
                        oldPages.push(page);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
                    }
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
        }
    });

    //now we sort by date so that we have a nice chronological list to show the user
    oldPages.sort(function(a, b) {
        var dateA = Date.parse(a.edited_on);
        var dateB = Date.parse(b.edited_on);
        if (dateA < dateB) {
            return 1;
        } else {
            return -1;
        }
    });

    //remember previous versions in an array so we can view a historic version
    wiki.previousVersions = [];

    for (var page in oldPages) {
        var event = "Edited ";
        if (oldPages[page].conflict) {
            event = "Conflict ";
        }

        wiki.previousVersions[oldPages[page]._rev] = oldPages[page];

        $('<li>' + event + ' on ' + oldPages[page].edited_on + ' by ' + oldPages[page].edited_by + ' <a class="btn btn-default" id="' + oldPages[page]._rev + '"> View</a></li>').appendTo('#history');
        $('#' + oldPages[page]._rev).click(function() {
            wiki.body = wiki.previousVersions[this.id].body;
            wiki.display();
        });
    }
};

wiki.sync = function() {
    localDBArr = location.toString().split("/", 4);
    localDB = localDBArr[3];
    var repA = {
        "source": settings.replicationEndPoint,
        "target": localDB
    };
    var repB = {
        "source": localDB,
        "target": settings.replicationEndPoint
    };

    //replicate remote to local
    $.ajax({
        type: 'POST',
        url: './_couchdb/_replicate',
        data: JSON.stringify(repA),
        success: function(data) {
            $('#page-body').html("Synchronisation complete!");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
        }
    });
    //and local to remote
    $.ajax({
        type: 'POST',
        url: './_couchdb/_replicate',
        data: JSON.stringify(repB),
        success: function(data) {
            $('#page-body').html("Synchronisation complete!");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
        }
    });
};

wiki.load = function() {
    //I'm pretty sure this is horrible...need to wait for the location to be updated before opening the page
    setTimeout(function() {
        var requestedPage = location.hash.substring(1);
        wiki.open(requestedPage);
    }, 200);
};


wiki.attachments = function() {
    $('#page-body').html('<h2>Attachments</h2><ul id="attachment-list"></ul><div id="upload-form-holder"></div>').hide().fadeIn("slow");

    $("<h3>New attachment</h3><input id='_attachments' type='file' name='_attachments'/><button class='btn btn-primary' id='upload-button'>Upload File</button>").appendTo('#page-body');

    $("#upload-button").click(function() {
        $.each($('#_attachments')[0].files, function(index, file) {
            if (file instanceof Blob) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(e) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 201) {
                            wiki.open(wiki._id);
                            $.jGrowl("Attachment was uploaded...", {
                                header: "Cool!"
                            });
                        } else {
                            error("Ooooops!, request failed with status: " + xhr.status + ' ' + xhr.responseText);
                        }
                    }
                };
                xhr.open("PUT", "_db/" + wiki._id + "/" + file.name + "?rev=" + wiki._rev, true);
                //xhr.setRequestHeader("X_FILENAME", file.name);
                xhr.send(file);
            }
        });
    });

    for (f in wiki._attachments) {
        $("<li><a href='./_db/" + wiki._id + "/" + f + "'>" + f + "</a></li>").appendTo("#attachment-list");
    }
};

//Finally, some miscellaneous useful functions

function error(msg) {
    $.jGrowl(msg, {
        header: "Uh Oh!"
    });
}

var pageContent = "";


function getNavOffset() {
    // use .length to test if selector exists
    if ($("#title").length) return $("#title").offset().top + $("#title").height() + 10;
    else return 0;
}

function getDefaultHeight() {
    return 'height:' + (window.innerHeight - (getNavOffset() * 1.5)) + 'px;';
}

function getWindowHeight() {
    return 'height:' + (window.innerHeight - ($("footer").height() * 3)) + 'px;';
}

//And finally...when the document is ready...

$(document).ready(function() {

    if (window.location.href.match(/\/_rewrite$/) !== null) location.href += '/';

    require('kanso-topbar').init();

    $(window).on('scroll', function() {
        if (window.scrollY > getNavOffset()) {
            $("#body").attr('style', 'top:10px;' + getWindowHeight());
        } else {
            $("#body").attr('style', 'top:' + getNavOffset() + 'px;' + getDefaultHeight());
        }
    });

    //To start, we need the settings for the wiki...
    $.ajax({
        type: 'get',
        url: './_db/TAPIRWIKISETTINGS',
        async: false,
        success: function(data) {
            var result = JSON.parse(data);
            settings = result;
            //Set the wiki name
            $('#wikiName').html(settings.wikiName);

            //And get the menu items
            for (item in settings.mainMenu) {
                var m = settings.mainMenu[item];
                $("<li><a href='#" + m + "' onClick='Javascript: wiki.open(\"" + m + "\")'>" + m + "</a></li>").appendTo("#main-menu");
            }

            //and if replication is enabled show the sync menu item
            if (settings.replicationEnabled && location.toString().match(settings.replicationEndPoint).length < 1) {
                $("<li><a href='#' onClick='Javascript: wiki.sync()'>Synchronise</a></li>").appendTo("#main-menu");
            }

            var requestedPage = location.hash.substring(1);
            if (requestedPage === "") {
                //If it's blank, lets get it from settings
                requestedPage = settings.defaultPage;
            }
            // JV: set it as the base page for pathfinder


            //Now let's open the page
            wiki.open(requestedPage);


        },

        error: function(xhr, statusText) {
            if (xhr.status == 404) {
                //  If we get a 404 from the settings, assume this is a first time install. Lets create some objects in the DB for us
                //and a place to show progress
                $("#container").html("<h1>Installing TapirWiki</h1><p>Before you use TapirWiki for the first time, a few default pages need to be loaded:</p><ul id='install-log'></ul><div id='install-result'></div>");
                $.ajax({
                    type: 'GET',
                    url: './_ddoc/_show/systempages/_design%2Fwiki',
                    async: false,
                    success: function(data) {
                        var pages = JSON.parse(data);
                        var result = true;
                        for (p in pages) {
                            if (result == true) {
                                // continue
                                result = pop(pages[p]);
                            }
                        }
                        if (result == true) {
                            $("#install-result").html("<h2>Installation complete</h2><p>Congratulations, TapirWiki has been set up correctly. Please refresh this page to access your new wiki or click <a href='./'>here</a>.</p>");
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
                    }
                });
            }
        }
    });
});

function pop(obj) {
    var result = false;
    $.ajax({
        type: 'put',
        url: './_db/' + obj._id,
        async: false,
        data: JSON.stringify(obj),
        success: function(data) {
            $("#install-log").append("<li>" + obj._id + " loaded...</li>");
            result = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            error("Ooooops!, request failed with status: " + XMLHttpRequest.status + ' ' + XMLHttpRequest.responseText);
            $("#install-log").append('<li style="color:#f00">' + obj._id + ' failed. Please add the role "wikieditor" to your user, delete this database and try again. If the problem persists, please log an issue <a href="https://github.com/johnko/kanso-wiki/issues">here</a>.</li>');
        }
    });
    return result;
}


//JV trial
// $(document).bind("openwiki", function (e, params) { wiki.open(params.id);}); this is nonsense we don't want a click event
//$(document).pathbinder(wiki.open,":id");
