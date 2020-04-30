

// helper functions
function load_page(page, callback) {
  $('#container-exp').load(page, function(responseTxt, statusTxt, xhr){
   if(statusTxt == "success")
     callback();
   if(statusTxt == "error")
     alert("Error: " + xhr.status + ": " + xhr.statusText);
 });
}

function set_next_onclick(clickfunction) {
  document.getElementById('next').onclick = clickfunction;
};


/************************
* Experiment *
*************************/

// these functions are executed linearlly
function load_welcome() {
  // this call back function is called once the html is loaded...
  var callback = function() { set_next_onclick(load_welcome2) };

  // load the html, run the callback function
  load_page('./static/templates/instructions_intro.html', callback);
}

function load_welcome2() {
  var callback = function() { set_next_onclick(start_block_one) };
  load_page('./static/templates/instructions_intro2.html', callback);
}

function start_block_one() {
  // run block one, and specify the break page to be shown after
  var callback = function() {run_block(block_l1_trials, break_one)};
  load_page('./static/templates/canvas_stage.html', callback);
}

function break_one() {
  var callback = function() { set_next_onclick(start_block_two) };
  load_page('./static/templates/break_one.html', callback);
}

function start_block_two() {
  // run block two, and specify the break page to be shown after
  var callback = function() {run_block(block_h1_trials, break_two)};
  load_page('./static/templates/canvas_stage.html', callback);
}

function break_two() {
  var callback = function() { set_next_onclick(start_block_three) };
  load_page('./static/templates/break_two.html', callback);
}

function start_block_three() {
  // run block two, and specify the break page to be shown after
  var callback = function() {run_block(block_l2_trials, break_three)};
  load_page('./static/templates/canvas_stage.html', callback);
}

function break_two() {
  var callback = function() { set_next_onclick(start_block_three) };
  load_page('./static/templates/break_two.html', callback);
}

function start_block_four() {
  var callback = function() {run_block(block_h2_trials, end)};
  load_page('./static/templates/canvas_stage.html', callback);
}

function end() {
  load_page('./static/templates/end.html', function(){});
}