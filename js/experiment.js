

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

function load_break_screen(page, next_block) {
  load_page(page, function() {
    $('#score').html('<div id="score">51</div>')
    document.getElementById('next').onclick =  function(){
      run_block(next_block);
    };
  });
}

function start_block_one() {
  load_page('./static/templates/canvas_stage.html', function () {
    run_block(block_l1_trials, function() {
      load_break_screen('./static/templates/break_one.html', block_h1_trials);
    });
  })
}


