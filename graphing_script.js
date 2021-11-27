
const class_1_img = document.getElementById('class_1_img');
const class_2_img = document.getElementById('class_2_img');
const class_3_img = document.getElementById('class_3_img');
const red_class_1_block_img = document.getElementById('red_class_1_block_img');
const green_class_2_block_img = document.getElementById('green_class_2_block_img');
const blue_class_3_block_img = document.getElementById('blue_class_3_block_img');


NeuralNetGraph = (function() {

  let getDataPointFromMouseClickInGraph = function(e, canvas, graphData, pixelScaleToGraphScale) {
    if (e.offsetX >= graphData.xLeftMargin && e.offsetX <= canvas.width - graphData.xRightMargin && e.offsetY <= graphData.graphOrigin[1] && e.offsetY >= graphData.yMargin) {
      var xCoorInGraphOfCLick = (e.offsetX - graphData.xLeftMargin)*(1/pixelScaleToGraphScale.xScale);
      var yCoorInGraphOfCLick = (canvas.height - e.offsetY - graphData.yMargin)*(1/pixelScaleToGraphScale.yScale);
      //console.log('graph click x: ' + xCoorInGraphOfCLick + ' y: ' + yCoorInGraphOfCLick);
      return [xCoorInGraphOfCLick, yCoorInGraphOfCLick];
    }
  }

  let graph2DDataPoints = function(canvas, dataPointsArray, xDomain, yDomain, graphData) {

    //console.log('graphing start');
      if (canvas.width >= 300 && canvas.height >= 300) {

       const {xRightMargin, graphOrigin, classImagesWidth, markLength} = graphData;

       const halfClassImagesWidth = classImagesWidth/2;
       const yMargin = canvas.height - graphOrigin[1];
       const xLeftMargin = graphOrigin[0];
       const yAxisHeight = canvas.height - (2*yMargin);
       const xAxisWidth = canvas.width - xLeftMargin - xRightMargin;

       graphData.halfClassImagesWidth = halfClassImagesWidth;
       graphData.yMargin = yMargin;
       graphData.xLeftMargin = xLeftMargin;
       graphData.yAxisHeight = yAxisHeight;
       graphData.xAxisWidth = xAxisWidth;

        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'black';

        ctx.moveTo(graphOrigin[0], graphOrigin[1]);
        ctx.lineTo(canvas.width - 40, graphOrigin[1]); // x-axis
        ctx.stroke();
        ctx.moveTo(graphOrigin[0], graphOrigin[1]);
        ctx.lineTo(graphOrigin[0], 40); // y-axis
        ctx.stroke();
        ctx.font = '15px Arial';
        ctx.fillText('x1', canvas.width/2, canvas.height - 5);
        ctx.fillText('x2', graphOrigin[0] - 50, canvas.height/2);

        const xDomainWidth = xDomain[1] - xDomain[0];
        // make x-axis marks
        for (var i = 1; i < 11; i++) {
          var xDistanceToMark = graphOrigin[0] + ((i/10)*xAxisWidth);
          ctx.moveTo(xDistanceToMark, graphOrigin[1] + markLength);
          ctx.lineTo(xDistanceToMark, graphOrigin[1] - markLength); // y-axis
          ctx.stroke();
          var markValue = xDomain[0] + ((i/10)*xDomainWidth);
          var markValueString = markValue.toFixed(2);
          ctx.fillText(markValueString, xDistanceToMark - 20, graphOrigin[1] + 20);
        }

        const yDomainWidth = yDomain[1] - yDomain[0];
        // make y-axis marks
        for (var i = 1; i < 11; i++) {
          var xDistanceToMark = graphOrigin[0];
          var yDistanceToMark = graphOrigin[1] - ((i/10)*yAxisHeight);
          ctx.moveTo(xDistanceToMark - markLength, yDistanceToMark);
          ctx.lineTo(xDistanceToMark + markLength, yDistanceToMark); // y-axis
          ctx.stroke();
          var markValue = yDomain[0] + ((i/10)*yDomainWidth);
          var markValueString = markValue.toFixed(2);
          ctx.fillText(markValueString, xDistanceToMark - 40, yDistanceToMark + 5);
        }

        const pixelScaleToXGraphScale = xAxisWidth/xDomainWidth;
        const pixelScaleToYGraphScale = yAxisHeight/yDomainWidth;
        for (var i = 0; i < dataPointsArray.length; i++) {
          for (var j = 0; j < dataPointsArray[i].length; j++) {
            var classImage = i === 0 ? class_3_img : i === 1 ? class_2_img : class_1_img;
            ctx.drawImage(classImage,
              (xLeftMargin + (dataPointsArray[i][j][0]*pixelScaleToXGraphScale) - halfClassImagesWidth),
              (canvas.height - yMargin - (dataPointsArray[i][j][1]*pixelScaleToYGraphScale) - halfClassImagesWidth),
              classImagesWidth, classImagesWidth);
          }
        }

      } else {
        console.log('canvas must have a minimum height and width of 300px');
      }
  }

  let paintClassificationBackgroundOfModel = function(canvas, model, xDomain, yDomain, graphData, classPointSeparationDistance) {

      if (canvas.width >= 300 && canvas.height >= 300) {

       const {xRightMargin, graphOrigin, classImagesWidth, markLength} = graphData;

       const halfClassImagesWidth = classImagesWidth/2;
       const yMargin = canvas.height - graphOrigin[1];
       const xLeftMargin = graphOrigin[0];
       const yAxisHeight = canvas.height - (2*yMargin);
       const xAxisWidth = canvas.width - xLeftMargin - xRightMargin;
       const classBlockImagesWidth = classPointSeparationDistance - 2;

       graphData.halfClassImagesWidth = halfClassImagesWidth;
       graphData.yMargin = yMargin;
       graphData.xLeftMargin = xLeftMargin;
       graphData.yAxisHeight = yAxisHeight;
       graphData.xAxisWidth = xAxisWidth;

        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'black';

        var classPointsToPredict = [];

        const xDomainWidth = xDomain[1] - xDomain[0];
        const yDomainWidth = yDomain[1] - yDomain[0];
        const numberOfClassPointsForX = Math.floor(xAxisWidth/classPointSeparationDistance)+1;
        const numberOfClassPointsForY = Math.floor(yAxisHeight/classPointSeparationDistance)+1;
        const classPointSeparationDistanceXInGraphCoor = xDomainWidth*(classPointSeparationDistance/xAxisWidth);
        const classPointSeparationDistanceYInGraphCoor = yDomainWidth*(classPointSeparationDistance/yAxisHeight);


        for (var i = 0; i < numberOfClassPointsForX; i++) {
          for (var j = 0; j < numberOfClassPointsForY; j++) {
            classPointsToPredict.push([xDomain[0]+(i*classPointSeparationDistanceXInGraphCoor), yDomain[0]+(j*classPointSeparationDistanceYInGraphCoor)]);
          }
        }


        const classPointsToPredictTensor = tf.tensor2d(classPointsToPredict, [classPointsToPredict.length, 2]); // [# of inputs, # of variables per input]
        const classPredictionProbabilities = model.predict(classPointsToPredictTensor, [classPointsToPredict.length, 2]);

        //---------------------------------------

        const pixelScaleToXGraphScale = xAxisWidth/xDomainWidth;
        const pixelScaleToYGraphScale = yAxisHeight/yDomainWidth;

        // The Canvas coordinates of all the points which have been tested for a class
        var classPointsToPredictCanvasCoordinates = classPointsToPredict.map((graphPoint) => {
            var xPositionInCanvasOfPoint = (graphPoint[0]*pixelScaleToXGraphScale) + graphData.xLeftMargin;
            var yPositionInCanvasOfPoint = canvas.height  - graphData.yMargin - (graphPoint[1]*pixelScaleToYGraphScale);
            return [xPositionInCanvasOfPoint, yPositionInCanvasOfPoint];
        });

        // finds the indexes of the classes with the largest probabilities
        const classPredictionsOfPoints = classPredictionProbabilities.argMax(1);
        const classPredictionsForPointsArray = classPredictionsOfPoints.arraySync()

        for (var i = 0; i < classPointsToPredictCanvasCoordinates.length; i++) {
          var classImage = classPredictionsForPointsArray[i] === 0 ? blue_class_3_block_img : classPredictionsForPointsArray[i] === 1 ? green_class_2_block_img : red_class_1_block_img;
          ctx.drawImage(classImage, classPointsToPredictCanvasCoordinates[i][0] - (0.5*classBlockImagesWidth),
            classPointsToPredictCanvasCoordinates[i][1] - (0.5*classBlockImagesWidth),
            classBlockImagesWidth, classBlockImagesWidth);
        }

      } else {
        console.log('canvas must have a minimum height and width of 300px');
      }
  }

  return {
    getDataPointFromMouseClickInGraph: getDataPointFromMouseClickInGraph,
    graph2DDataPoints: graph2DDataPoints,
    paintClassificationBackgroundOfModel: paintClassificationBackgroundOfModel,
  }

}());
