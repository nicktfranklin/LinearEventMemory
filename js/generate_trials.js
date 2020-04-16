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


// generate a list of trials of each type, and insert the probe trials into the two conditions.
// [code goes here]

var n_trials = 25; // number of trials per block
var n_probes = 10; // these are the number of unique probe trials (subject sees the twice across four blocks)
var probe_trials = [];

var block_1_trials = [];
var block_2_trials = [];
var block_3_trials = [];
var block_4_trials = [];

for (var ii=0; ii < n_trials; ii ++){ 
  block_1_trials.push(
      generate_trial_parameters(
        A_l, process_init_l, process_noise_l, observ_noise, observ_scale,
        )
    )
  };

// for now, to keep the code running.
var queue_trials = block_1_trials;