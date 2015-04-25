function(doc, req){
    var pages=[];
    for (page in doc.systempages){
        pages.push(doc.systempages[page]);
    }
    return {
        json : pages,
    }
}
