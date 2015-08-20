

$(function(){
  console.log("hey");
  navigator.getUserMedia = navigator.getUserMedia
                        || navigator.webkitGetUserMedia
                        || navigator.mozGetUserMedia;

  navigator.getUserMedia({audio: false, video: true}, function(stream){
    mystream = stream;
    $('video').prop('src', URL.createObjectURL(stream));
    $('video')[0].addEventListener("playing", function(){
      var strength = Number($('#strength').val());
      takeMosaic(strength);
    }, false);
  }, function(){ alert("please allow permission And reload");});

  $('#shot').on("click",function(e){
    var strength = Number($('#strength').val());
    takeMosaic(strength);
  });

  $('#strength').on('input',function(object){
    var strength = Number(object.target.value);
    takeMosaic(strength);
  });

});

function takeMosaic(strength){
  var video = $('video')[0];

  var canvas = $('#shot_image')[0];
  canvas.setAttribute('width',video.videoWidth);
  canvas.setAttribute('height',video.videoHeight);

  var ctx = canvas.getContext('2d');

  ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight,
  0,0,canvas.width,canvas.height);

  var canvas2 = $('#shot_image2')[0];
  canvas2.setAttribute('width',video.videoWidth);
  canvas2.setAttribute('height',video.videoHeight);

  var ctx2 = canvas2.getContext('2d');
  var before = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var after = ctx.createImageData(before);
  mosaic(before.data, after.data, before.width, before.height, strength);
  ctx2.putImageData(after, 0, 0);
}

function mosaic(beforeData, afterData, width, height, strength){
  console.log(strength);
  for (var y = 0; y < height; y += strength) {
    var yLimit = ((y + strength) > height) ? height - y : strength;
    var offsetY = y * width;
    for (var x = 0; x < width; x += strength) {
      var xLimit = ((x + strength) > width) ? width - x : strength;
      var offsetXY = (offsetY + x) * 4;
      var r = beforeData[offsetXY + 0];
      var g = beforeData[offsetXY + 1];
      var b = beforeData[offsetXY + 2];
      for (var yy = 0; yy < yLimit ; yy++){
        var offsetYY = (offsetY + x) + yy * width;
        for(var xx = 0; xx < xLimit ; xx++){
          var offset = (offsetYY + xx) * 4;
          afterData[offset + 0] = r;
          afterData[offset + 1] = g;
          afterData[offset + 2] = b;
          afterData[offset + 3] = 255;
        }
      }
    }
  }
}
