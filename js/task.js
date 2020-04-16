
function show_instruction() {
  $('#trial_text').html('<h1>Welcome!</h1></br>You are about to play a game!');
  $('#trial_text_bottom').html(
    '<div class="col-xs-3"><button type="button" id="next" value="next" '
    + 'class="btn btn-primary btn-lg continue"> Continue '
    + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>');
    document.getElementById('next').onclick =  function(){
      add_task_display();
      run_block(block_1_trials);
    };
}

function add_task_display(){
  $('#task_display').html('<canvas id="task_box" width="425" height="400">Box goes here</canvas>')
}


function start_experiment() {
  show_instruction();
  // run_block(block_1_trials);
  // for now, the experiment just runs the first block of trials
  ;
}

