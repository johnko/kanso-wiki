// this is the rendering part
function makehtmlrenderer(){
    // initialisation

    var align={'>':'right','<':'left','=':'center','<>':'justify','~':'bottom','^':'top'};
    // Helper  functions 

    // (borrowed from uncle Ben) function to parse and create an attribute string in this implementation everything can be put (), {} and []
    function qat(a,v){return ' '+a+'="'+v+'"';}
    // then the function
    function makeattributestring(s, tag){
	if(!s){return "";}
        // initialize
        var st="";var at="";
        // language (l) 
        var l=/\[(\w\w)\]/.exec(s);
	if(l !== null) {at += qat('lang',l[1]);}
        // class and id
        var ci=/\((\S+)\)/.exec(s);
        if(ci !== null) {
	    s = s.replace(/\((\S+)\)/,"");
	    at += ci[1].replace(/#(.*)$/,' id="$1"').replace(/^(\S+)/,' class="$1"');
	}
        // style attribute
          // alignment    
        if (tag === "img"){
            var ta= /(<|>)/.exec(s);if(ta){st +="float:"+align[ta[1]]+";";}
        }
        else{
	    var ta= /(<>|=|<|>)/.exec(s);if(ta){st +="text-align:"+align[ta[1]]+";";}
            var va= /(~|\^)/.exec(s);if(va){st +="vertical-align:"+align[va[1]]+";";}
        }
          // explicit styles
	var ss=/\{(.+)\}/.exec(s);if(ss){st += ss[1];if(!ss[1].match(/;$/)){st+= ";";}}
          // padding
	var pdl = /(\(+)/.exec(s);if(pdl){st+="padding-left:"+pdl[1].length+"em;";}
	var pdr = /(\)+)/.exec(s);if(pdr){st+="padding-right:"+pdr[1].length+"em;";}            
	if(st) {at += qat('style',st);}
        // col span and row span
        var colspan = /\\(\d+)/.exec(s);if(colspan){at+=qat('colspan',colspan[1]);}
        var rowspan = /\/(\d+)/.exec(s);if(rowspan){at+=qat('rowspan',rowspan[1]);}
	return at;
    }
  
    function replacechar(match){
        if (match=="<"){
           return "&lt;";
        }
        else if (match==">"){
           return "&gt;";
        }
        else if (match=="\""){
           return "&quot;";
        }
        else if (match=="'"){
           return "&#8217;";
        }
        else if (match=="&"){
          return "&amp;";
        }
    }

    function html2entities(sometext){
       var re=/[<>"'&]/g;
       return sometext.replace(re, function(m){return replacechar(m);});
    }
    
    // punctuation
    var ent={"'":"&#8217;"," - ":" &#8211; ","([^!])--([^>])":"$1&#8212;$2"," x ":" &#215; ","\\.\\.\\.":"&#8230;","\\(C\\)":"&#169;","\\(R\\)":"&#174;","\\(TM\\)":"&#8482;"};
    function punctuate(sometext){
        for(var i in ent) { 
            if (ent.hasOwnProperty(i)){
                sometext=sometext.replace(new RegExp(i,"g"),ent[i]);
            }
        }
        return sometext;
    }

    var map = {   heading1    : "h1",
                  heading2    : "h2",
                  heading3    : "h3",
                  heading4    : "h4",
                  heading5    : "h5",
                  heading6    : "h6",
                  para        : "p",
                  bulletlist  : "ul",
                  numberlist  : "ol",
                  listitemb   : "li",
                  listitemn   : "li",
                  bold        : "b",
                  italics     : "i",
                  emphasis    : "em",
                  strong      : "strong",
                  citation    : "cite",
                  superscript : "sup",
                  subscript   : "sub",
                  code        : "code",
                  span        : "span",
                  deleted     : "del",
                  inserted    : "ins",
                  texlinkurl  : "a",
                  aliaslink   : "a",
                  blockcode   : "pre",
                  blockcodec  : "pre",
                  blockquote  : "blockquote",
                  blockquotec : "blockquote",
                  table       : "table",
                  tablerow    : "tr",
                  headercell  : "th",
                  datacell    : "td",
                  image       : "img",
                  acronym     : "acronym",
                  footnote    : "p",
                  footref     : "sup"
              };
    var empty =  { image : true };


    function renderhtml(rootnode){
        // as we need to treat root specially because of dictionary with the linkaliases we need inner function
        // traverse the tree to build the html we assume that calling program inserts the tags for the 'root'
        function rhtml(tnode){
            if (tnode.type.charAt(0) != "#"){
                if (tnode.type != "root"){ // start tag
                    var tag ="<"+map[tnode.type];
                    tag +=tnode.type=="texlinkurl"?" href=\""+tnode.value.pop()+"\" ":"";
                    tag +=tnode.type=="aliaslink"?" href=\""+aliasdic[tnode.value.pop()]+"\" ":"";                  
                    tag +=tnode.type=="wikilink"?" href=\"#"+tnode.value.pop()+"\" onClick=\"javascript: wiki.load()\" ":"";
                    tag +=tnode.type=="acronym"?" title=\""+tnode.value.pop()+"\"":"";
                    tag +=makeattributestring(tnode.value[0], map[tnode.type]);
                    tag +=tnode.type=="footnote"?" id=\"fn"+tnode.value[1]+"\" class=\"footnote\"><sup>"+tnode.value[1]+"</sup":"";
                    tag +=tnode.type=="footref"?" class=\"footnote\"><a href=#fn"+tnode.value[1]+">"+tnode.value[1]+"</a":"";                
                    if (tnode.type=="image"){  // is the only empty tag in textile
                        tag +=" src=\""+tnode.value[1]+"\" "; 
                        tag +=tnode.value[2]!=""?" title=\""+tnode.value[2]+"\" alt=\""+tnode.value[2]+"\" ":"";
                        if (tnode.value[3]!=""){
                            tag = "<a href=\""+tnode.value[3]+"\">"+tag+"/></a>"; // not elegant but because of structure textile!
                        }
                        else {
                            tag +=" />";
                        }
                    } // image
                    else { // not an image
                        tag +=">";
                    }   
                    tag+=tnode.type.indexOf("blockcode")?"":"<code>";              
                    html+=tag;
                } // tnode.type != root 
                for (var i=0;i<tnode.siblings.length;i++) {rhtml(tnode.siblings[i]);}  // contents 
                if ((tnode.type != "root") && !empty[tnode.type]) { //ending tag
                    html +=tnode.type.indexOf("blockcode")?"":"</code>";
                    html += "</" + map[tnode.type] +">";}  
                }
            else if (tnode.type =="#text"){ 
                var snippet="";
                if ((tnode.parent.type !== "code") && (tnode.parent.type !== "blockcode") && (tnode.parent.type !== "pre") &&
                    (tnode.parent.type !=="blockcodec")){
                    snippet=punctuate(tnode.value);
                }
                else {
                    snippet=html2entities(tnode.value);
                } 
                html += snippet.replace(/\n(?!\n$)/g,"<br />"); // new lines everywhere (except for double newline at the end)! 
            }
            else { // all special leaf cases (# html, #wikilink, #linetoken, #blocktoken middleware should have changed last three to html
                html += tnode.value;
            }  

        } // end rhtml
        // initialisations 

        var html="";
        var aliasdic = rootnode.value;
        rhtml(rootnode);   
        return html;
    } // end renderhtml
    return function(tree){  // actual rendering function to return
                   return renderhtml(tree);
               };
} // end makehtmlrenderer  

