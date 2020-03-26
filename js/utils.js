//standard normal using Box-Mueller algorithm
// algorithm checked 3/25/20
function univariate_norm() {
    var x1, x2, rad, c;
     do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad == 0);
     c = Math.sqrt(-2 * Math.log(rad) / rad);
     return (x1 * c);
 };

// truncated geometric distribution (i.e. normalized over valid domain)
function truncated_geometric(p, t_max) { 
    var t, X;
    t = 0;
    do {
        t++;
        X = Math.random();
        if (X < p) {
            return t;
        } else {
            if (t == t_max) {
                t = 0;
            }
        }
    } while(true);
};

function isotropic_norm(sigma, d=2) {
    var stdev = Math.sqrt(sigma);
    var x, ii;
    x = [];
    for (ii = 0; ii < d; ii++) {
        x.push(univariate_norm() * stdev)
    }
    return x;
}


function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

function make_column_vector(a) {
    var a0 = []
    for (var ii = 0; ii < a.length; ii ++ ){
        a0.push([a[ii]])
    }
    return a0
}

function sample_lds_states(A, process_init, process_noise, duration) {
    var x = [isotropic_norm(process_init)];
    var x0;
    for (var ii = 0; ii < duration; ii++) {
        x0 = multiply([x[x.length-1]], A);
        for (var jj = 0; jj < x0[0].length; jj ++ ) {
            x0[0][jj] = x0[0][jj] + univariate_norm() * Math.sqrt(process_noise);
        };
        x.push(x0[0]);
    }
    return x;
}

function make_observations(x, observ_noise, observ_scale) {
    var z = [];
    var z0;
    for (var ii = 0; ii < x.length; ii ++ ) {
        z0 = []
        for (var jj = 0; jj < x[0].length; jj ++ ) {
          z0.push(x[ii][jj] * observ_scale + univariate_norm() * Math.sqrt(observ_noise));
        }
        z.push(z0);
    }
    return(z)
}