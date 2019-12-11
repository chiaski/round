require('./style.css');

import domtoimage from 'dom-to-image';



runTest('test-1');
runTest('test-2');
runTest('test-3');

function runTest(nodeName){
  domtoimage.toPng(document.getElementById(nodeName))
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.getElementById('result').appendChild(img);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}