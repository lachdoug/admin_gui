// Make links open with target=href, to cause open in new tab (or window)

var renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
    var link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace("<a","<a target='" + href + "' ");
};

marked.setOptions({
    renderer: renderer
});
