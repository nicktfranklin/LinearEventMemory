
// here, I'm just manually defining and event that will be read in for a single trial
var init_x = 180;
var init_y = 150;
var trial_sequence = {
  posX : [init_x, init_x-15, init_x-25, init_x-60, init_x-110, init_x-170],
  posY : [init_y, init_y-13, init_y-31, init_y-56, init_y-85,  init_y-130],
  color_sequence : palette('tol-rainbow', 6),
  // color_sequence  : [
  //   [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50], [0, 50, 50]
  // ] // defined in hsluv space
}

function run_all_trials(){
  trial(trial_sequence);
}

function trial(trial_sequence, dot_duration=300, mask_duration=1000, canvas_size=350) {

  // define an object to contain the properties of a
  // the cues
  var props = new Object();
  props.width = 20;
  props.height = 20;
  props.duration = dot_duration; // in ms

  // define an object to contain the properties
  // of the prope. Properties defined here don't change
  var props_probe = new Object();
  props_probe.width = props.width;
  props_probe.height = props.height;
  props_probe.duration = props.duration;
  props_probe.posX = 0;
  props_probe.posY = 0;

  var isi = 500;
  var sequence_time = dot_duration * trial_sequence.posX.length;

  var dots_placed = new Object();
  dots_placed.posX = new Array();
  dots_placed.posY = new Array();
  dots_placed.n = 0;

  var canvas = document.getElementById('task_box');
  var canvas_probe = document.getElementById('probe_box');

  if (canvas.getContext) {
    var ctx_task = canvas.getContext('2d');
    var ctx_probe = canvas_probe.getContext('2d');


    // animate the squares
    var i=0;
    function animate_sequence(){
      var display = "<br>Remember all of the dots!<br>";
      $('#trial_text').html(display);
      ctx_task.clearRect(0,0,500,500);

      props.posX = trial_sequence.posX[i];
      props.posY = trial_sequence.posY[i];
      props.fillStyle = "#" + trial_sequence.color_sequence[i];
      // props.fillStyle = hsluv.hsluvToHex(trial_sequence.color_sequence[i]);
      var square = vanishing_square(ctx_task, props);
      square.draw();
      i++;
      if (i < trial_sequence.posX.length){
        setTimeout(animate_sequence, props.duration)
      } else {
        setTimeout(function(){ctx_task.clearRect(0,0,500,500)}, props.duration)
      }
    };
    setTimeout(animate_sequence, props.duration);
  }

  setTimeout(make_mask, sequence_time + isi, ctx_task, mask_duration);
  
  // The click listener detects where the dots have been placed
  var total_score = 0;
  function add_listener() {
    var dots_remaining = trial_sequence.posX.length;
    var display =  "<br>Place the dots on the screen, in the order in which you saw them."
      + '<br>You have <span style="font-size:115%"><span style="font-weight: bold">' 
      + String(dots_remaining) + '</span></span> '
      + 'left to place! Next dot to place:';

    $('#trial_text').html(display);

    // draw the first dot to place
    // place the memory probe
    props_probe.fillStyle = "#" + trial_sequence.color_sequence[dots_placed.n];
    vanishing_square(ctx_probe, props_probe).draw();
    
    canvas.addEventListener('click', function clickListener(evt) {
      // increment/decrement counters
      dots_remaining--;
      dots_placed.n++;

      // place the dot
      var cursor_pos = getMousePos(canvas, evt);

      props.posX = cursor_pos['x'] - (props.width / 2);
      props.posY = cursor_pos['y'] - (props.height / 2);
      props.fillStyle = "#" + trial_sequence.color_sequence[dots_placed.n - 1];
      vanishing_square(ctx_task, props).draw();

      if (dots_remaining > 0) {
        props_probe.fillStyle = "#" + trial_sequence.color_sequence[dots_placed.n];
        vanishing_square(ctx_probe, props_probe).draw();
      } else {
        ctx_probe.clearRect(0,0,20,20);
      };
  

      // cache the placed locations
      dots_placed.posX.push(props.posX);
      dots_placed.posY.push(props.posY);

      // calculate the error in euclidean distance
      var i = dots_placed.posX.length;
      var squared_error = 0;
      // this squared error term is scalled linearlly, 
      // so it works as an equivalent loss function
      squared_error +=  
        Math.pow((props.posX - trial_sequence.posX[i-1])/(canvas_size/4), 2) + 
        Math.pow((props.posY - trial_sequence.posY[i-1])/(canvas_size/4), 2);
      console.log(squared_error);
      // total_score is an average
      total_score += (1-squared_error)*100 / trial_sequence.posX.length;
      console.log(total_score);


      // cancel condition for the listener
      if (dots_remaining <= 0) {
        canvas.removeEventListener('click', clickListener, false);
        display = "<br>Great! You've placed all of the dots<br>You scored " 
        + '<span style="font-size:115%"><span style="font-weight: bold">'
        + String(Math.max(Math.round(total_score),0)) + '</span></span> points!';
        $('#trial_text_bottom').html(
          '<div class="col-xs-3"><button type="button" id="next" value="next" '
          + 'class="btn btn-primary btn-lg continue"> Next Trial '
          + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>');
        ctx_probe.clearRect(0,0,20,20);
        document.getElementById('next').onclick = function() {location.reload()};
      } else {
        display = "<br>Place the dots on the screen, in the order in which you saw them."
        + '<br>You have <span style="font-size:115%"><span style="font-weight: bold">' 
        + String(dots_remaining) + '</span></span> '
        + 'left to place! Next dot to place:';
      }
      $('#trial_text').html(display);
    }, false)
  }

  setTimeout(add_listener, sequence_time + isi + mask_duration + isi);
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
  // turn of directions
  $('#trial_text').html("");
  
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