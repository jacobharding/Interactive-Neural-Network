// Create model
const model = tf.sequential();

// Relu requires a much smaller learning rate
model.add(tf.layers.dense({units: 80, inputShape: [2], activation:'relu'}));
model.add(tf.layers.dense({units: 3, activation:'softmax'}));

//categoricalCrossentropy
model.compile({loss: 'categoricalCrossentropy', optimizer: tf.train.adam(0.03), metrics: ['acc']});

// Prepare training data and labels for training data
const trainingData2dPointsInputs = model_2_class_1_data_points.concat(model_2_class_2_data_points).concat(model_2_class_3_data_points);
const trainingDataLabels = model_2_class_1_data_points_labels.concat(model_2_class_2_data_points_labels).concat(model_2_class_3_data_points_labels);
const xs = tf.tensor2d(trainingData2dPointsInputs, [trainingData2dPointsInputs.length, 2]); // [# of inputs, # of variables per input]
const ys = tf.tensor2d(trainingDataLabels, [trainingDataLabels.length, 3]);

const metrics = ['accuracy', 'loss', 'val_loss', 'val_acc', 'acc'];
const container = {name: 'Model Training Data', height:'800px'}

// ----- data and elements needed for graphing neural net model

var theCanvas = document.getElementById('drawing_surface');
const theCanvasContext = theCanvas.getContext('2d');
const statsPanel = document.getElementById('stats_panel');

const xRightMargin = 40;
const graphOrigin = [80, theCanvas.height - 40];
const classImagesWidth = 10;
const markLength = 5;

var graphData = {
   xRightMargin: xRightMargin,
   graphOrigin: graphOrigin,
   classImagesWidth: classImagesWidth,
   markLength: markLength,
}

const xDomain = [0, 2.5];
const yDomain = [0, 2];

// ------

//const trainingData2dPointsInputsGraphingPoints = [[], [], model_2_class_3_data_points];
const trainingData2dPointsInputsGraphingPoints = [model_2_class_1_data_points, model_2_class_2_data_points, model_2_class_3_data_points];
const classPointSeparationDistance = 15;

NeuralNetGraph.paintClassificationBackgroundOfModel(theCanvas, model, xDomain, yDomain, graphData, classPointSeparationDistance);
NeuralNetGraph.graph2DDataPoints(theCanvas, trainingData2dPointsInputsGraphingPoints, xDomain, yDomain, graphData);

const train_button = document.getElementById('train_button');
train_button.addEventListener('click', trainModel);

const model_accuracy_label = document.getElementById('model_accuracy_label');
const model_loss_label = document.getElementById('model_loss_label');
const number_of_epochs_trained = document.getElementById('number_of_epochs_trained');
var numberOfEpochsTrained = 0;


function trainModel() {

  // At the end of each epoch draw the model's classification predictions for the whole space that
  // contains the data set. This shows how the model is learning.
  function onEpochEnd(epoch, logs) {
    theCanvasContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    NeuralNetGraph.paintClassificationBackgroundOfModel(theCanvas, model, xDomain, yDomain, graphData, classPointSeparationDistance);

    //theCanvasContext.drawImage(graphImage, 0, 0);
    model_accuracy_label.innerText = logs.acc.toFixed(2);
    model_loss_label.innerText = logs.loss.toFixed(2);
    numberOfEpochsTrained = numberOfEpochsTrained + 1;
    number_of_epochs_trained.innerText = numberOfEpochsTrained;
  }

  function onTrainEnd(logs) {
    theCanvasContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    NeuralNetGraph.paintClassificationBackgroundOfModel(theCanvas, model, xDomain, yDomain, graphData, classPointSeparationDistance);
    NeuralNetGraph.graph2DDataPoints(theCanvas, trainingData2dPointsInputsGraphingPoints, xDomain, yDomain, graphData);
    //theCanvasContext.drawImage(graphImage, 0, 0);
  }

  // Train the model using the data.
  model.fit(xs, ys, {
    batchSize: 32,
    epochs: 10,
    shuffle: true,
    callbacks: {onEpochEnd: onEpochEnd, onTrainEnd: onTrainEnd},
  }
  ).then((info) => {
    //console.log('model fit done info: '+Object.getOwnPropertyNames(info.history));
    console.log('model loss: '+info.history.loss);
    console.log('model accuracy: '+info.history.acc);
  });
}