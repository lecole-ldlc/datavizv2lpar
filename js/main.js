function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

var font = "Arial";
//import données depuis gsheet
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1EtGVW0KmbFtQruyAgCMaFYFCcenqRsBLTgJcPwcsszc/edit?usp=sharing';

function init() {
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: showInfo,
        simpleSheet: true
    })
}

function showInfo(data, tabletop) {
    //console.log('Successfully processed!')
    //console.log(data);

    var places = [];
    data.forEach(function (d) {
        if (d["type"] == "places") {
            places.push(d);
        }
    });

    var options = d3.select("#places").selectAll("option")
        .data(places)
        .enter()
        .append("option")
        .text(function (d) {
            return d.elements;
        })
        .attr("value", function (d) {
            return d.images_url;

        })
        .attr("data-sf", function (d) {
            return d.scoresf;
        });

    var actors = [];
    data.forEach(function (d) {
        if (d["type"] == "actors") {
            actors.push(d);
        }
    });

    d3.select("#actor_cb1").selectAll("option")
        .data(actors)
        .enter()
        .append("option")
        .text(function (d) {
            return d.elements;
        })
        .attr("value", function (d) {
            return d.actorsimages;

        })
        .attr("data-sf", function (d) {
            return d.scoresf;
        });

    d3.select("#actor_cb2").selectAll("option")
        .data(actors)
        .enter()
        .append("option")
        .text(function (d) {
            return d.elements;
        })
        .attr("value", function (d) {
            return d.actorsimages;
        })
        .attr("data-sf", function (d) {
            return d.scoresf;

        });


    var directors = [];
    data.forEach(function (d) {
        if (d["type"] == "directors") {
            directors.push(d);
        }
    });

    var options = d3.select("#directors").selectAll("option")
        .data(directors)
        .enter()
        .append("option")
        .text(function (d) {
            return d.elements;
        })
        .attr("value", function (d) {
            return d.elements;

        })
        .attr("data-sf", function (d) {
            return d.scoresf;
        });

    $("#directors").on("change", function () {
        update_picture();
    });

    $("#places").on("change", function () {
        update_picture();
    });
    $("#place_text").click(function () {
        update_picture();
    });

    $(".actor").on("change", function () {
        update_picture()
    });


}

function dragstarted(d) {
    d3.select(this).raise().classed("active", true);
}

function dragged(d) {
    d3.select("text").attr("x", d3.event.x).attr("y", d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("active", false);
}

function update_picture() {
    $("#svg").html('');

    console.log("update picture");
    // Background
    var img = $("#places").val();
    if (img != "") {
        d3.select("svg").append("svg:image")
            .attr("xlink:href", img)
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", "640")
            .attr("height", "833");

    }

    //actor 1
    var actor1_img = $("#actor_cb1 :selected").val();
    var actor1_name = $("#actor_cb1 option:selected").text();
    console.log("Actor1 " + actor2_img);
    if (actor1_img != "") {
        imageAnimation.init(0, "#svg", actor1_img, "1");

        d3.select("svg").append("text")
            .attr("x", 100)
            .attr("y", 400)
            .text(actor1_name)
            .attr("id", "actor1_txt")
            .attr("class", "actor_txt")
            .attr("font-family", "Arial")
            .attr("font-size", "30px")
    }
    //actor 2
    var actor2_img = $("#actor_cb2 :selected").val();
    var actor2_name = $("#actor_cb2 option:selected").text();
    console.log("Actor2 " + actor2_img);

    if (actor2_img != "") {
        imageAnimation.init(0, "#svg", actor2_img, "2");

        d3.select("svg").append("text")
            .attr("x", 400)
            .attr("y", 400)
            .text(actor2_name)
            .attr("id", "actor2_txt")
            .attr("class", "actor2_txt")
            .attr("font-family", "Arial")
            .attr("font-size", "30px")
    }

    // Title
    var txt = $("#title").val();

    //TODO: get font from another combo box
    var font = "sans-serif";

    d3.select("svg").append("text")
        .attr("x", 100)
        .attr("y", 100)
        .text(txt)
        .attr("font-family", font)
        .attr("font-size", "30px")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    // Director
    $("#director_txt").remove();
    var txtdirect = $("#directors").val();
    console.log(txtdirect);
    var font = "sans-serif";
    d3.select("svg").append("text")
        .attr("x", 100)
        .attr("y", 100)
        .text(txtdirect)
        .attr("id", "director_txt")
        .attr("font-family", font)
        .attr("font-size", "30px");

}

var imageAnimation = new function () {

    var instances = {};
    this.init = function (id, baseId, img, num, text) {
        console.log("init", img);
        instances[id] = new ImageAnimation(baseId, img, num, text);
    };

    function ImageAnimation(id, img, num, text) {
        var drag, dgrop;

        $("#actor" + num).remove();

        drag = d3.drag()
            .on("drag", function (d, i) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.select(this).attr("transform", function (d, i) {
                    return "translate(" + [d.x, d.y] + "),rotate(" + d.r + ",160, 160),scale(" + d.scale + "," + d.scale + ")";
                })
            });

        console.log("append g", id);


        dgrop = d3.select(id).append("g")
            .data([{"x": 20, "y": 20, "r": 1, "scale": 1}])
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(0,0)")
            .append('image')
            .attr("x", num == '1' ? 0 : 400)
            .attr("y", 0)
            .attr("id", "actor" + num)
            .attr("width", 300)
            .attr("height", 300)
            .attr("xlink:href", img)
            .call(drag);

        $("#wheel" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.r = d.r - 30;
                return "translate(" + [d.x, d.y] + "),rotate(" + d.r + " ,160, 160),scale(" + d.scale + "," + d.scale + ")";
            });
        });

        $("#big" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.scale = d.scale * 1.2;
                return "translate(" + [d.x, d.y] + "),rotate(" + d.r + " 160 160),scale(" + d.scale + "," + d.scale + ")";
            });
        });

        $("#small" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.scale = d.scale * 0.8;
                return "translate(" + [d.x, d.y] + "),rotate(" + d.r + " 160 160),scale(" + d.scale + "," + d.scale + ")";
            });
        });
    }

};
$('select').change(function () {
    var sum = 0;
    $('select :selected').each(function () {
        //console.log($(this), parseFloat($(this).attr("data-sf")));
        sum += parseInt($(this).attr("data-sf"));
    });
    $("#sum").html("SUM " + sum);
});
window.addEventListener('DOMContentLoaded', init);
