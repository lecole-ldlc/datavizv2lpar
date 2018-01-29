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

            })
            .attr("data-sf", function (d) {
                return d.scoresf;
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

            })
            .attr("data-sf", function (d) {
                return d.scoresf;
            });

        $("#place_direct").click(function () {
            var txt = $("#directors").val();
            var font = "sans-serif"
            d3.select("svg").append("text")
                .attr("x", 1000)
                .attr("y", 1000)
                .text(txt)
                .attr("font-family", font)
                .attr("font-size", "30px")
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




    }
    window.addEventListener('DOMContentLoaded', init);
