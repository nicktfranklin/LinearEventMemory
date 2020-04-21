
function stage_instructions() {
  var html = '' + 
  '<div id="container-exp">' +
    '<div id="trial_text_container">' +
      '<div id="trial_text"></div>' +
      '<div id="trial_text_instructions"></div>' +
      '<div id="trial_text_bottom">' +
    '</div>'
  $('#container-exp').html(html);
}

function stage_exp() {
  var html = '' + 
  '<div id="container-exp">' +
    '<div id="trial_text_container">' + 
      '<div id="trial_text"></div>' +
        '<canvas id="probe_box" width="20" height="20"></canvas>' +
        '<br>' +
        '<div id = "experiment">' + 
            '<div id="task_display">' + 
              '<canvas id="task_box" width="425" height="400"></canvas>' +
            '</div>' +
          '</div>' +
        '<div id="trial_text_bottom"><br><br></div>' + 
      '</div>' + 
    '</div>'
  $('#container-exp').html(html);
}


function show_instruction_1() {
  stage_instructions();
  $('#trial_text').html('<h1>Welcome!</h1>');
  var text = ""
  var text = text + 'You will be playing a game where you will have to remember '
  var text = text + 'the locations sequences of squares on the screen.'
  var text = text + '</br></br>The game is pretty simple. '
  var text = text + 'You will see sequences of small colored squares moving across the screen.'
  var text = text + 'Your job is to remember the location and order of these squares, as we will ' 
  var text = text + 'ask you to indicate where you saw them on the screen using your mouse.  '
  var text = text + 'Each square will appear briefely, and you will see one square at a time. '
  var text = text + 'After you see each sequence, there will be a brief delay with lots of dots '
  var text = text + 'blinking on and off, '
  var text = text + 'and then we will ask you to remember where you saw the squares.'
  var text = text + '</br></br>When instructed, please click on the screen where you saw each square, '
  var text = text + 'in the order that you saw them.'
  $('#trial_text_instructions').html(text);

  var text = '<div class="col-xs-3"><button type="button" id="next" value="next" '
      + 'class="btn btn-primary btn-lg continue"> Next '
      + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>';
  $('#trial_text_bottom').html(text);
  
  document.getElementById('next').onclick =  function(){
      show_instruction_2();
    };
}

function show_instruction_2() {

  var text = 'On each trial, we will let you know how well you did by awarding ' 
  var text = text + 'you points for how accurate you were!  The closer you place each square'  
  var text = text + ' to its original location, the more points you will earn!'
  var text = text + '</br> </br>Please do as best as you can, as this will help us better understand '
  var text = text + 'how people learn and remember.'
  var text = text + '</br> </br>The task has four section. In each section, there is a pattern to '
  var text = text + 'the order of the squares on the screen. If you learn this pattern, it should help'
  var text = text + ' you remember where the dots are.  While the pattern in each section is similar, '
  var text = text + "they are different.  Between each section, there will be a short break, and we'll"
  var text = text + ' remind you of the rules.'
  var text = text + '</br> </br>Please click "Start!" when you are ready to start the game.'
  $('#trial_text_instructions').html(text);

  var text = '<div class="col-xs-3"><button type="button" id="next" value="next" '
      + 'class="btn btn-primary btn-lg continue"> Start! '
      + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>';
  $('#trial_text_bottom').html(text);

    document.getElementById('next').onclick =  function(){
      stage_exp();
      run_block(block_1_trials);
    };
}

function show_break() {
  var text = '<h1>Section Complete!</h1></br>'
  var text = text+ '</br></br></br></br>'
  var text = text+ '<div class="col-xs-3"><button type="button" id="next" value="next" '
  + 'class="btn btn-primary btn-lg continue"> Continue '
  + '<span class="glyphicon glyphicon-arrow-right"></span></button></div>';
  $('#trial_text').html(text);

    document.getElementById('next').onclick =  function(){
      stage_exp();
      run_block(block_1_trials);
    };
}



function start_experiment() {
  show_instruction_1();
  // run_block(block_1_trials);
  // for now, the experiment just runs the first block of trials
  ;
}

