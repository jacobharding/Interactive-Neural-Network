
// For generating data sets

    var points = [];
    var data_set = "r";
    theCanvasContext.fillStyle = "#000000";
    
    var pixelScaleToGraphScale = {
        xScale: (theCanvas.width - graphOrigin[0] - xRightMargin)/2.5,
        yScale: (theCanvas.height-80)/2
    }
    
    if (false) {
        theCanvas.addEventListener("click", function(e) {
            var square_size = 10;
            theCanvasContext.fillRect(e.offsetX - (square_size/2), e.offsetY - (square_size/2), square_size, square_size);
        
            var new_point =  NeuralNetGraph.getDataPointFromMouseClickInGraph(e, theCanvas, graphData, pixelScaleToGraphScale);
            var x_coordinate = new_point[0];
            var y_coordinate = new_point[1];
            points.push([x_coordinate, y_coordinate]);    
        })
        
        window.addEventListener("keydown", function(e) {
            if (e.key == "a") {
                var points_data_string = "[";
        
                for (let i = 0; i < points.length - 1; i++) {
                    points_data_string += ("[" + points[i][0] + ", " + points[i][1] + "], ");
                }
                points_data_string += ("[" + points[points.length - 1][0] + ", " + points[points.length - 1][1] + "]");
                points_data_string += "]";
                console.log(points_data_string);
        
        
                var data_set_label_string = "";
        
                if (data_set == "r") { data_set_label_string = "[1, 0, 0]" }
                else if (data_set == "g") { data_set_label_string = "[0, 1, 0]" }
                else if (data_set == "b") { data_set_label_string = "[0, 0, 1]" }
        
                var points_data_label_string = "[";
                for (let i = 0; i < points.length - 1; i++) {
                    points_data_label_string += (data_set_label_string + ", ");
                }
                points_data_label_string += (data_set_label_string + "]");
                console.log(points_data_label_string);
            }
        
            if (e.key == "r") {
                theCanvasContext.fillStyle = "#ff0000";
                points = [];
                data_set = "r";
            } else if (e.key == "g") {
                theCanvasContext.fillStyle = "#00ff00";
                points = [];
                data_set = "g";
            } else if (e.key == "b") {
                theCanvasContext.fillStyle = "#0000ff";
                points = [];
                data_set = "b";
            }
        })    
    }
    