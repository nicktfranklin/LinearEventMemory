// the recency bias (low noise) condition
var A_l = [[ 1.08561432 , 0.23139049], [-0.23139049,  1.08561432]];
var process_init_l = 3.5;
var process_noise_l = 0.02;

// the high noise control condition
var A_h = [[ 0.89887523,  0.04498125], [-0.04498125,  0.89887523]];
var process_init_h = 6.0;
var process_noise_h = 1.0;

// the test condition
var A_test = [[ 1.0358622 , 0.17172509], [-0.17172509,  1.0358622]];
var process_init_test = 3.71428571;
var process_noise_test = 0.29714286;


var observ_noise = 10.0
var observ_scale = 20.0
var p = 0.25
var t_max = 8;
var t_min = 2;

function generate_trial_parameters(A_l, process_init, process_noise, observ_noise, observ_scale) {
    var duration = truncated_geometric(p, t_max - t_min) + t_min;;
    var x = sample_lds_states(A_l, process_init, process_noise, duration);
    var z = make_observations(x, observ_noise, observ_scale);
    
    // convert the sampled values to pixel space and present in usable format
    var posX = [];
    var posY = [];
    for (var ii=0; ii < z.length; ii ++){ 
      posX.push(z[ii][0] + 350/2);
      posY.push(z[ii][1] + 350/2);
    }
    return {posX : posX, posY: posY,  color_sequence: palette('tol', t_max + 1)}
  };


// generate a list of trials of each type, and insert the probe trials into the two conditions.
// [code goes here]

var n_trials = 25; // number of trials per block
var n_probes = 10; // these are the number of unique probe trials (subject sees the twice across four blocks)
var probe_trials = [];

var block_l1_trials = [];
var block_l2_trials = [];
var block_h1_trials = [];
var block_h2_trials = [];


// randomly sample trial from the distributions
for (var ii=0; ii < n_trials; ii ++){ 
  
  // sample block l1
  block_l1_trials.push(
      generate_trial_parameters(
        A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
        )
    )

  // sample block l2
  block_l2_trials.push(
    generate_trial_parameters(
      A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
      )
  )
  
  // sample block h1
  block_h1_trials.push(
    generate_trial_parameters(
      A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
      )
  )

  // sample block l2
  block_h2_trials.push(
    generate_trial_parameters(
      A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
      )
  )
};

// interleave the probe trials with the block trials.  This
// needs to be a function call b/c it has to be evaluated 
// after the success of $.getJSON call
function interleave_probes(block_trials, probe_trials){
  var new_block = [];
  


}

// load pre-sampled probe trials from file
  var jqxhr = $.getJSON('./static/json/probe_trials.json', function(data) {
    var posX;
    var posY;
    var temp_probes = [];
    for (var ii = 0; ii < data.length; ii ++) {
      posX = data[ii].posX;
      posY = data[ii].posY;
      temp_probes[ii] = {posX : posX, posY: posY,  color_sequence: palette('tol', t_max + 1)}
    }

    // randomly re-order the array;
    var index = new Array(data.length);
    for (var ii = 0; ii < data.length; ii ++) {index[ii] = ii};
    shuffle(index);
    var p
    for (var ii = 0; ii < data.length; ii ++) {
      probe_trials[ii] = temp_probes[index[ii]];
    }
  });


// add probe trials to the end of the 


function right_naviagtion_button(button_label) {
  var html = 
  '<button type="button" id="next" value="next" class="btn btn-primary btn-lg continue">'
  + button_label
  + '<span class="glyphicon glyphicon-arrow-right"></span>'
  + '</button>'
  return html
};

/************************
* Experiment Parameters *
*************************/
// for clarity, these are seperate from the code to advance a trial 
// default parameters
var dot_duration = 500;
var mask_duration = 500;
var canvas_size = 350;
var isi = 500;
var iti_duration = 1500;
var dot_width = 25;
var dot_height = 25;
// 

// function to run a block of trials
function run_block(queue_trials, end_function) {
  // var block_total_score = 0;

  // end condition => no trials left in the queue.
  if (queue_trials.length > 0) {
    
    // function takes in a set of parameters and creates the trial
    trial_parameters = queue_trials.shift();
    run_trial(trial_parameters, function() {run_block(queue_trials, end_function)});
  } else {
    end_function()
  }
}

function run_trial(trial_parameters, next) {
    
  // define an object to contain the properties of a
  // the cues
  var props = new Object();
  props.width = dot_width;
  props.height = dot_height;
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

    // prep for the next trail
    ctx_task.clearRect(0,0,500,500);
    iti_screen();

    // animate the squares
    function animate_sequence(){
      // prepare the stage
      var display = "<br>Remember all of these squares!<br>";
      $('#trial_text').html(display);
      $('#button_right').html('');
      ctx_task.clearRect(0,0,500,500);


      var jj = 0;
      function next_square() {
        if (jj < trial_parameters.posX.length) {
          // clear the previous square
          ctx_task.clearRect(0,0,500,500);

          // draw the next square
          props.posX = trial_parameters.posX[jj];
          props.posY = trial_parameters.posY[jj];
          props.fillStyle = "#" + trial_parameters.color_sequence[jj];
          draw_square(ctx_task, props)
          setTimeout(function () {jj++; next_square()}, props.duration);
        } else {
          // clear the last dot after presentation.
          ctx_task.clearRect(0,0,500,500);
        }
      }

      console.log(trial_parameters.posX.length);
      
      // start the sequence by calling the recursive inner function
      next_square()
    };
    
    
  }

  // have the mask come on after the animation
  var animation_duration = dot_duration * trial_parameters.posX.length;
  

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
      total_score += (1-squared_error*2)*100 / trial_parameters.posX.length;

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
        var button = right_naviagtion_button('Next Trial')
        $('#button_right').html(button);
        // $('#trial_text_bottom').html(
          // '<div class="col-xs-3"><button type="button" id="next" value="next" '
          // + 'class="btn btn-primary btn-lg continue"> Next Trial '
          // + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>');
        
        document.getElementById('next').onclick = next; // click listener
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

  // Start the trial by running the trial functions 
  setTimeout(animate_sequence, iti_duration);
  setTimeout(make_mask, animation_duration + iti_duration + isi, canvas, mask_duration);
  setTimeout(add_listener, animation_duration + iti_duration + mask_duration + isi + isi);
};


function iti_screen(){
  var display = "<br>Get ready for the next trial!<br>";
  $('#trial_text').html(display);
  $('#button_right').html("");
};

function animate_stims() {

};

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
  $('#trial_text').html('<div style="color:#808080"></br>(please wait)</div>');
  
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