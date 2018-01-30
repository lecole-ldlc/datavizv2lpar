function SVG(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

var font = "Arial";
//import données depuis gsheet
var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1EtGVW0KmbFtQruyAgCMaFYFCcenqRsBLTgJcPwcsszc/edit?usp=sharing';

var actor_rot = {
    "1": 0,
    "2": 0,
};

var actor_scale = {
    "1": 1.0,
    "2": 1.0,
}

var actor_pos_init = {
    "1": [0, 200],
    "2": [300, 200],
};

var actor_pos = {
    "1": [0, 0],
    "2": [0, 0],
};

var actor_title_pos = {
    "1": [100, 400],
    "2": [400, 400]
};

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

    $("#actor_cb1").on("change", function () {
        actor_pos["1"][0] = actor_pos_init["1"][0];
        actor_pos["1"][1] = actor_pos_init["1"][1];
        actor_rot["1"] = 0;
        update_picture()
    });
    $("#actor_cb2").on("change", function () {
        actor_pos["2"][0] = actor_pos_init["2"][0];
        actor_pos["2"][1] = actor_pos_init["2"][1];
        actor_rot["2"] = 0;
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
        d3.select("#svg").append("svg:image")
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

        d3.select("#svg").append("text")
            .attr("x", actor_title_pos["1"][0])
            .attr("y", actor_title_pos["1"][1])
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

        d3.select("#svg").append("text")
            .attr("x", actor_title_pos["2"][0])
            .attr("y", actor_title_pos["2"][1])
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
        instances[id] = new ImageAnimation(baseId, img, num, text);
    };

    function ImageAnimation(id, img, num, text) {
        var drag, dgrop;

        $("#actor" + num).remove();

        drag = d3.drag()
            .on("drag", function (d, i) {
                d3.select(this).attr("transform", function (d, i) {
                    actor_pos[d.num][0] += d3.event.dx;
                    actor_pos[d.num][1] += d3.event.dy;
                    return "translate(" + [actor_pos[d.num][0], actor_pos[d.num][1]] + ")," +
                        "rotate(" + d.r + " " + d.pivot_x + " " + d.pivot_y + ")," +
                        "scale(" + d.scale + "," + d.scale + ")";
                })
            });

        console.log(actor_pos[num][0], actor_pos[num][1]);
        dgrop = d3.select(id).append("g")
            .data([{"num": num, "x": 0, "y": 0, "r": actor_rot[num], "scale": actor_scale[num], "pivot_x": 160, "pivot_y": 160}])
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", function (d) {
                return "translate(0,0), rotate(0), scale(1)"
            })
            .append('image')
            .attr("x", 0)
            .attr("y", 0)
            .attr("id", "actor" + num)
            .attr("width", 320)
            .attr("height", 320)
            .attr("xlink:href", img)
            .attr("transform", function (d) {
                console.log(d);
                return "translate(" + actor_pos[num][0] + "," + actor_pos[num][1] + "), rotate(" + actor_rot[num] + " " + d.pivot_x + " " + d.pivot_y + "), scale(" + actor_scale[num] + ", " + actor_scale[num] + ")"
            })
            .call(drag);

        $("#wheel" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.r = d.r - 15;
                return "translate(" + [actor_pos[d.num][0], actor_pos[d.num][1]] + "),rotate(" + d.r + " " + d.pivot_x + " " + d.pivot_y + "),scale(" + d.scale + "," + d.scale + ")";
            });
        });

        $("#wheelccw" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.r = d.r + 15;
                actor_rot[num] = d.r;
                return "translate(" + [actor_pos[d.num][0], actor_pos[d.num][1]] + "),rotate(" + d.r + " " + d.pivot_x + " " + d.pivot_y + "),scale(" + d.scale + "," + d.scale + ")";
            });
        });

        $("#big" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.scale = d.scale * 1.2;
                actor_scale[num] = d.scale;
                return "translate(" + [actor_pos[d.num][0], actor_pos[d.num][1]] + "),rotate(" + d.r + " " + d.pivot_x + " " + d.pivot_y + "),scale(" + d.scale + "," + d.scale + ")";
            });
        });

        $("#small" + num).bind("click", function () {
            dgrop.attr("transform", function (d, i) {
                d.scale = d.scale * 0.8;
                actor_scale[num] = d.scale;
                return "translate(" + [d.x, d.y] + "),rotate(" + d.r + " " + d.pivot_x + " " + d.pivot_y + "),scale(" + d.scale + "," + d.scale + ")";
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
    draw_itsf(sum)
});

function draw_itsf(itsf_value) {
    $("#barchart").html("");
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 10, bottom: 0, left: 10},
        width = 50,
        height = 833;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0);
    var y = d3.scaleLinear()
        .range([height, 0]);


    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#barchart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // format the data

    // Scale the range of the data in the domains
    x.domain([0]);
    y.domain([0, 100]);

    // append the rectangles for the bar chart
    var c = svg.selectAll(".bar")
        .data([itsf_value])
        .enter()

    c.append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return 0;
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d);
        })
        .attr("fill", "#adadad")
        .attr("height", function (d) {
            return height - y(d);
        });
    c.append("text")
        .attr("x", 10)
        .attr("y", function (d) {
            return y(d)-5;
        })
        .transition()
        .duration(200)
        .attr("stroke", "#fff")
        .text(function(d){
            return d + " %";
        })
}

draw_itsf(0);
window.addEventListener('DOMContentLoaded', init);
