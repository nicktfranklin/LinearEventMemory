
// here, I'm just manually defining and event that will be read in for a single trial
// var init_x = 180;
// var init_y = 150;
// var trial_parameters = {
//   posX : [init_x, init_x-15, init_x-25, init_x-60, init_x-110, init_x-170],
//   posY : [init_y, init_y-13, init_y-31, init_y-56, init_y-85,  init_y-130],
//   color_sequence : palette('tol', 6),
// }

// // treat the list of trials as a queue
// var queue_trials = [trial_parameters, trial_parameters];

// const matrixK = Math.matrix([[0, 1], [2, 3], [4, 5]]);
// const matrixL = Math.matrix([[2, 4], [6, 2]]);
// const matrixKL = Math.multiply(matrixK, matrixL);

// console.log(matrixKL);

// console.log(truncated_geometric(0.2, 25));
// console.log(isotropic_norm(6));
// var A_l = [[1.04867124, 0.21257618], [-0.21257618, 1.04867124]];

// the recency bias (low noise) condition
var A_l = [[ 1.08561432 , 0.23139049], [-0.23139049,  1.08561432]];
var process_init_l = 3.5;
var process_noise_l = 0.02;

// the high noise control condition
var A_l = [[ 0.89887523,  0.04498125], [-0.04498125,  0.89887523]];
var process_init_l = 6.0;
var process_noise_l = 1.0;

// the test condition
var A_l = [[ 1.0358622 , 0.17172509], [-0.17172509,  1.0358622]];
var process_init_l = 3.71428571;
var process_noise_l = 0.29714286;


var observ_noise = 10.0
var observ_scale = 20.0
var p = 0.25
var t_max = 8;
var t_min = 2;

function generate_trial_parameters(
  A_l, process_init, process_noise, observ_noise, observ_scale) {
    var duration = truncated_geometric(p, t_max) + t_min;;
    var x = sample_lds_states(A_l, process_init, process_noise, duration);
    var z = make_observations(x, observ_noise, observ_scale);
    
    // convert the sampled values to pixel space and present in usable format
    var posX = [];
    var posY = [];
    for (var ii=0; ii < z.length; ii ++){ 
      posX.push(z[ii][0] + 350/2);
      posY.push(z[ii][1] + 350/2);
    }
    return {posX : posX, posY: posY,  color_sequence: palette('tol', z.length)}
  };

var queue_trials = [];
for (var ii=0; ii < 10; ii ++){ 
    queue_trials.push(
      generate_trial_parameters(
        A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
        )
    )
  };
console.log(queue_trials);

function run_all_trials() {

  // end condition => no trials left in the queue.
  if (queue_trials.length == 0) {
    $('#trial_text').html('Great! You have finished the game!<br>Please click "continue"');
    $('#trial_text_bottom').html(
      '<div class="col-xs-3"><button type="button" id="next" value="next" '
      + 'class="btn btn-primary btn-lg continue"> Continue '
      + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>');
      document.getElementById('next').onclick = run_all_trials; 
  } else {
    // function takes in a set of parameters and creates the trial
    trial_parameters = queue_trials.shift();

    // default parameters
    var dot_duration = 500;
    var mask_duration = 500;
    var canvas_size = 350;
    var isi = 500;

    // 
    var sequence_time = dot_duration * trial_parameters.posX.length;


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

    // store the dots that the subject places in an object
    var dots_placed = new Object();
    dots_placed.posX = new Array();
    dots_placed.posY = new Array();
    dots_placed.n = 0;

    // canvas objects that show stim/probes
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

        props.posX = trial_parameters.posX[i];
        props.posY = trial_parameters.posY[i];
        props.fillStyle = "#" + trial_parameters.color_sequence[i];
        // props.fillStyle = hsluv.hsluvToHex(trial_sequence.color_sequence[i]);
        draw_square(ctx_task, props);

        i++;
        if (i < trial_parameters.posX.length){
          setTimeout(animate_sequence, props.duration)
        } else {
          setTimeout(function(){ctx_task.clearRect(0,0,500,500)}, props.duration)
        }
      };
      setTimeout(animate_sequence, props.duration);
    }

    setTimeout(make_mask, sequence_time + isi, canvas, mask_duration);

    // The click listener detects where the dots have been placed
    var total_score = 0;
    function add_listener() {
      
      var dots_remaining = trial_parameters.posX.length;

      var display =  "<br>Place the dots on the screen, in the order in which you saw them."
        + '<br>You have <span style="font-size:115%"><span style="font-weight: bold">' 
        + String(dots_remaining) + '</span></span> '
        + 'left to place! Next dot to place:';

      $('#trial_text').html(display);

      // draw the first dot to place
      // place the memory probe
      props_probe.fillStyle = "#" + trial_parameters.color_sequence[dots_placed.n];
      draw_square(ctx_probe, props_probe);
      
      // this click listener handles placing the dots on the canvas 
      canvas.addEventListener('click', function clickListener(evt) {
        // increment/decrement counters
        dots_remaining--;
        dots_placed.n++;

        // get the mouse cursor location at the click
        var cursor_pos = getMousePos(canvas, evt);

        // draw the square at the mouse location
        props.posX = cursor_pos['x'] - (props.width / 2);
        props.posY = cursor_pos['y'] - (props.height / 2);
        props.fillStyle = "#" + trial_parameters.color_sequence[dots_placed.n - 1];
        draw_square(ctx_task, props);

      
        // cache the placed locations
        dots_placed.posX.push(props.posX);
        dots_placed.posY.push(props.posY);

        // calculate the error in terms of squared error loss
        // (N.b., this squared error term is scalled linearlly, 
        // so it works as an equivalent loss function)
        var i = dots_placed.posX.length;
        var squared_error = 0;
        squared_error +=  
          Math.pow((props.posX - trial_parameters.posX[i-1])/(canvas_size/4), 2) + 
          Math.pow((props.posY - trial_parameters.posY[i-1])/(canvas_size/4), 2);
        
        // total_score is an average over the trials
        total_score += (1-squared_error)*100 / trial_parameters.posX.length;

        // cancel condition for the listener
        if (dots_remaining <= 0) {
          // stop allowing clicks to place new dots
          canvas.removeEventListener('click', clickListener, false);
          
          // change the message at the top
          display = 
            "<br>Great! You've placed all of the dots<br>You scored " 
          + '<span style="font-size:115%"><span style="font-weight: bold">'
          + String(Math.max(Math.round(total_score),0)) + '</span></span> /100!';

          // remove the final probe 
          ctx_probe.clearRect(0,0,20,20);

          // add a button at the end to go to the next trial
          $('#trial_text_bottom').html(
            '<div class="col-xs-3"><button type="button" id="next" value="next" '
            + 'class="btn btn-primary btn-lg continue"> Next Trial '
            + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>');
            document.getElementById('next').onclick = run_all_trials; // click listener
            // call run_all_trials to advance to the next trial or end

        } else {
          // if trial is continuing

          // update the message at the top
          display = "<br>Place the dots on the screen, in the order in which you saw them."
          + '<br>You have <span style="font-size:115%"><span style="font-weight: bold">' 
          + String(dots_remaining) + '</span></span> '
          + 'left to place! Next dot to place:';

          // update the probe
          props_probe.fillStyle = "#" + trial_parameters.color_sequence[dots_placed.n];
          draw_square(ctx_probe, props_probe);
        }

        // push the updated message to the top display
        $('#trial_text').html(display);

      }, false)
    }

    setTimeout(add_listener, sequence_time + isi + mask_duration + isi);
  }
}

function draw_square(ctx, props){
  ctx.fillStyle = props.fillStyle;
  ctx.fillRect(props.posX, props.posY, props.width, props.height);
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

function make_mask(canvas, duration=1000, height=20, width=20, dot_duration=20){
  var ctx = canvas.getContext('2d');
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
    x_locs.push(getRandomInt(max=canvas.width));
    y_locs.push(getRandomInt(max=canvas.height));
    fillStyles.push(draw_random_color());
  };
  
  
  var i = 0;
  function animate(){
    ctx.clearRect(0,0,500,500);

    function add_square(k){
      _props.posX = x_locs[k];
      _props.posY = y_locs[k];

      _props.fillStyle = fillStyles[k];
      draw_square(ctx, _props);
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