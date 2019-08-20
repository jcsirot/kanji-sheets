var Kanji = function (code, id, svgData) {
    this.id = id
    this.code = code
    this.svgData = svgData
    this.strokeCount = this.countStrokes()
    for (var i = 1; i <= this.strokeCount; i++) {
        this.step(i)
    }
}

Kanji.prototype.load = function (id, svgData) {
    component = svg(svgData)
    strokeNumbers = SVG.get("kvg:StrokeNumbers_" + this.code)
    strokeNumbers.hide()
}

Kanji.prototype.countStrokes = function () {
    var component = SVG("buffer")
    component.svg(this.svgData)
    paths = component.select(`path[id^="kvg:${this.code}-s"]`)
    return paths.length()
}

Kanji.prototype.step = function (step) {
    var elt = $("#kanji1-1");
    $(`<div id="${this.id}-step-${step}" class="col-lg-2 my-auto" style="text-align:center; display: block;border: 1px solid;">`).appendTo(elt);
    var component = SVG(`${this.id}-step-${step}`);
    component.svg(this.svgData);
    component.size(120, 120);
    strokeNumbers = component.select(`g[id="kvg:StrokeNumbers_${this.code}"]`);
    strokeNumbers.hide()
    strokes = component.select(`g[id="kvg:StrokePaths_${this.code}"]`);
    strokes.first().style('stroke: #ccc;stroke-width: 5;');
    for (var i = 1; i <= step; i++) {
        var stroke = component.select(`path[id="kvg:${this.code}-s${i}"]`)
        var copy = component.use(stroke.first())
        //copy.style('stroke: #000;')
        copy.addClass('highlight')
    }
}


function getParameters() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('kanji').split(",").map(function (item) {
        return item.trim();
    });
}

function processKanji(code, svgData) {
    k = new Kanji(code, "kanji1", svgData)
}

$(function () {
    var kanjis = getParameters();
    var code = '0' + kanjis[0].codePointAt(0).toString(16);
    var file = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/' + code + '.svg';
    $.ajax({
        url: file,
        success: function (data) {
            processKanji(code, data)
        }
    });

})

