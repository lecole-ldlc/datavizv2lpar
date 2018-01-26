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
        console.log(options);

        $("#place_direct").click(function () {
            var txt = $("#directors").val();
            $("#svg").html("");
            var font = "sans-serif"
            d3.select("svg").append("text")
                .attr("x", 100)
                .attr("y", 100)
                .text(txt)
                .attr("font-family", font)
                .attr("font-size", "30px")
        });

    }
    window.addEventListener('DOMContentLoaded', init);// JavaScript Document