

// helper function
function load_page(page, callback) {
  $('#container-exp').load(page, function(responseTxt, statusTxt, xhr){
   if(statusTxt == "success")
     callback();
   if(statusTxt == "error")
     alert("Error: " + xhr.status + ": " + xhr.statusText);
 });
}


// instructions
function load_welcome() {
  load_page('./static/templates/instructions_intro.html', function() {
    document.getElementById('next').onclick =  function(){
      load_instructions_2();
    };
  });
}


function load_instructions_2() {
  load_page('./static/templates/instructions_intro2.html', function() {
    document.getElementById('next').onclick =  function(){
      start_block_one();
    };
  });
}

function start_block_one() {
  console.log(posX_probe);
  load_page('./static/templates/canvas_stage.html', function () {
    run_block(block_1_trials)
  })
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

    document.getElementById('previous').onclick = show_instruction_2;
}
