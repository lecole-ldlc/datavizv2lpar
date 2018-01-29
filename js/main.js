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
        console.log('Successfully processed!')
        console.log(data);


        var places = [];
        data.forEach(function (d) {
            if (d["type"] == "places") {
                places.push(d);
            }
        });

        var dropDown = d3.select("#places");

        var options = dropDown.selectAll("option")
            .data(places)
            .enter()
            .append("option")
            .text(function (d) {
                return d.elements;
            })
            .attr("value", function (d) {
                return d.images_url;

            });
        //console.log(options);


        var directors = [];
        data.forEach(function (d) {
            if (d["type"] == "directors") {
                directors.push(d);
            }
        });
        var dropDown = d3.select("#directors");

        var options = dropDown.selectAll("option")
            .data(directors)
            .enter()
            .append("option")
            .text(function (d) {
                return d.elements;
            })
            .attr("value", function (d) {
                return d.elements;

            });

        $("#directors").on("change", function () {
            var txt = $("#directors").val();
            console.log(txt);
            var font = "sans-serif"
            d3.select("svg").append("text")
                .attr("x", 100)
                .attr("y", 100)
                .text(txt)
                .attr("font-family", font)
                .attr("font-size", "30px")
            $("#txt").remove();
        });

        $("#places").on("change", function () {
            var img = $("#places").val()    ;
            console.log(img);
            d3.select("svg").append("svg:image")
                .attr("xlink:href", img)
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", "640")
                .attr("height", "833");

            d3.select("svg").append("text")
                .attr("x", 100)
                .attr("y", 100)
                .attr("font-family", "Arial")
                .attr("font-size", "30px")
        });
            $("#place_text").click(function () {
                var txt = $("#title").val();
                console.log(txt);
                //$("#svg").html("");

                //TODO: get font from another combo box
                var font = "sans-serif"

                d3.select("svg").append("text")
                    .attr("x", 100 + Math.random() * 100)
                    .attr("y", 100 + Math.random() * 100)
                    .text(txt)
                    .attr("font-family", font)
                    .attr("font-size", "30px")




            });
        var actors = [];
        data.forEach(function (d) {
            if (d["type"] == "actors") {
                actors.push(d);
            }
        });

        var dropDown = d3.select("#actors");

        var options = dropDown.selectAll("option")
            .data(actors)
            .enter()
            .append("option")
            .text(function (d) {
                return d.elements;
            })
            .attr("value", function (d) {
                return d.actorsimages;

            });
        console.log(options);

        var dropDown2 = d3.select("#actors2");

        var options2 = dropDown2.selectAll("option")
            .data(actors)
            .enter()
            .append("option")
            .text(function (d) {
                return d.elements;
            })
            .attr("value", function (d) {
                return d.actorsimages;

            });


        $(".actor").on("change", function () {
            var img = $(this).val();
            var num = $(this).attr("data-number");
            var actor_name = $("#" + $(this).attr("id")  + " option:selected").text();
            console.log(actor_name);

            console.log(img, num);
            imageAnimation.init(0, "#svg", img, num);
            /*d3.select("svg").append("svg:image")
             .attr("xlink:href", img)
             .attr("x", "0")
             .attr("y", "0")
             .attr("width", "640")
             .attr("height", "833");
             */
            d3.select("svg").append("text")
                .attr("x", 100)
                .attr("y", 100)
                .text(actor_name)
                .attr("font-family", "Arial")
                .attr("font-size", "30px")
        });



    }
    var imageAnimation = new function () {

        var instances = {};
        this.init = function (id, baseId, img, num) {
            console.log("init", img);
            instances[id] = new ImageAnimation(baseId, img, num);
        };
        function ImageAnimation(id, img, num) {
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
                .attr("x", 0)
                .attr("id", "actor" + num)
                .attr("y", 0)
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
    window.addEventListener('DOMContentLoaded', init);
