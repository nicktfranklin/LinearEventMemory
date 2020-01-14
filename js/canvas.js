
// here, I'm just manually defining and event that will be read in for a single trial
var init_x = 180;
var init_y = 150;
var trial_sequence = {
  posX : [init_x, init_x-10, init_x-25, init_x-60, init_x-110, init_x-170],
  posY : [init_y, init_y-13, init_y-31, init_y-56, init_y-85,  init_y-130],
  color_sequence  : [
    [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50]
  ] // defined in hsluv space
}

function run_all_trials(){
  trial(trial_sequence);
}


function trial(trial_sequence, dot_duration=300, mask_duration=1000, canvas_size=350) {

  var props = new Object();
  props.width = 20;
  props.height = 20;
  props.duration = dot_duration; // in ms

  var canvas = document.getElementById('canvas_id');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');


    // animate the squares
    var i=0;
    function animate_sequence(){
      ctx.clearRect(0,0,500,500);

      props.posX = trial_sequence.posX[i];
      props.posY = trial_sequence.posY[i];
      props.fillStyle = hsluv.hsluvToHex(trial_sequence.color_sequence[i]);
      var square = vanishing_square(ctx, props);
      square.draw();
      i++;
      if (i < trial_sequence.posX.length){
        setTimeout(animate_sequence, duration)
      } else {
        setTimeout(function(){ctx.clearRect(0,0,500,500)}, duration)
      }
    };
    animate_sequence();
  }

  setTimeout(make_mask, duration * trial_sequence.posX.length + 500, ctx, mask_duration);
  
  var dots_placed = 0;
  // The click listener detects where the dots have been placed
  function add_listener() {canvas.addEventListener('click', (evt) => {
      // ctx.clearRect(0,0,500,500); // Don't allow multiple clicks to appear at one time.
      var cursor_pos = getMousePos(canvas, evt);

      props.posX = cursor_pos['x'] - (props.width / 2);
      props.posY = cursor_pos['y'] - (props.height / 2);
      var square = vanishing_square(ctx, props);
      square.draw();
      // square.clear();
    }, true)
  }

  setTimeout(add_listener, duration * trial_sequence.posX)
}


function vanishing_square(ctx, props){
  this.posX = props.posX;
  this.posY = props.posY;

  this.width = props.width;
  this.height = props.height;
  this.fillStyle = props.fillStyle;

  this.duration = props.duration;

  this.draw = function(){
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  }
  this.clear = function(){
    setTimeout(function() {
      ctx.clearRect(this.posX-1, this.posY-1, this.width+2, this.height+2);
    }, this.duration);
  }
  return this;
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function draw_random_color(){
    var h = getRandomInt(max=360).toString();
    var s = getRandomInt(max=100).toString();
    var l = getRandomInt(max=100).toString();
    return hsluv.hsluvToHex([h, s, l]);
};

function make_mask(ctx, duration=1000, height=20, width=20, dot_duration=20, canvas_size=350){
  
  // how many times does the mask flicker on and off?
  var n_squares = duration / dot_duration;

  // define the shared properties
  var _props = new Object();
  _props.height = height;
  _props.width = width;
  _props.duration = duration;

  // define the properties of the random draws
  var x_locs = new Array();
  var y_locs = new Array();
  var fillStyles = new Array();

  for (i = 0; i < n_squares * 5; i++){
    x_locs.push(getRandomInt(max=canvas_size));
    y_locs.push(getRandomInt(max=canvas_size));
    fillStyles.push(draw_random_color());
  };
  // console.log(fillStyles);
  
  
  var i = 0;
  function animate(){
    ctx.clearRect(0,0,500,500);

    function add_square(k){
      _props.posX = x_locs[k];
      _props.posY = y_locs[k];

      _props.fillStyle = fillStyles[k];
      square = vanishing_square(ctx, _props);
      square.draw();
    }

    i++;
    if (i < n_squares){

      add_square(i);
      add_square(i + n_squares);
      add_square(i + n_squares * 2);
      add_square(i + n_squares * 3);
      add_square(i + n_squares * 4);

      setTimeout(animate, dot_duration)
    } else {
      setTimeout(function(){ctx.clearRect(0,0,500,500)}, dot_duration)
    }
  };
  animate();

}