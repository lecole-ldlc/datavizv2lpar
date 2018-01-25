function SVG(tag) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    $(function () {
        $("#place_text").click(function () {
            var txt = $("#title").val();
            console.log(txt);
            $("#svg").html("");

            //TODO: get font from another combo box
            var font = "sans-serif"

            d3.select("svg").append("text")
                .attr("x", 100 + Math.random() * 100)
                .attr("y", 100 + Math.random() * 100)
                .text(txt)
                .attr("font-family", font)
                .attr("font-size", "30px")


        });

    });
