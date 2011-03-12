
function shlexresult(args, pos) { 
    this.args = args;
    this.pos = pos;
}
shlexresult.prototype.arg_at = function(idx) { 
    for( var i=0; i!= this.args.length; i++ ) { 
        if( idx >= this.pos[i].start && idx <= this.pos[i].end ) {
            return {index: i, offset: idx - this.pos[i].start};
        }
    }
    return null;
}


function shlex(opts) { 

    var exports = {
            split: function(text) { 
                var fwait = ' ',
                    farg = [''],
                    start = 0,
                    pos = [];
                    
                for( var i=0; i!=text.length; i++ ) { 
                    var ch = text[i];
                    if     ( ch == fwait ) { 
                        if( fwait === ' ' ) { 
                            if( farg[farg.length-1] ) { 
                                farg.push('');
                                pos.push({start: start, end: i});
                                start = i+1;
                            }
                        }
                        fwait = ' '; 
                    } else if( ch == '"' ) { 
                        fwait = '"'; 
                    } else if( ch == "'" ) { 
                        fwait = "'"; 
                    } else { 
                        farg[farg.length-1] += ch; 
                    }
                }
                pos.push({start: start, end: i});

                if( pos.length != farg.length ) { console.log('pos!=args?!'); }
                
                return new shlexresult(farg, pos);
            }
        };

    return exports;
}

function test_shlex() { 
    var sh = shlex();

    function compare_arr(a, b) { 
        if( a.length != b.length ) { return false; }
        for( var i =0; i!=a.length; i++ ) { 
            if( a[i] != b[i] ) { return false; }
        }
        return true;
    }

    var tests = [
        ['cmd'                  , ["cmd"]],
        ['cmd arg1'             , ["cmd", "arg1"]],
        ['cmd arg1 arg2'        , ["cmd", "arg1", "arg2"]],
        ['cmd "arg1 arg2"'      , ["cmd", "arg1 arg2"]],
        ['cmd "arg1 arg2"arg3'  , ["cmd", "arg1 arg2arg3"]],
        ['cmd "arg1 arg2" arg3' , ["cmd", "arg1 arg2", "arg3"]],
    ];

    console.log(tests);

    for( var i=0; i!= tests.length; i++ ) { 
        var args = tests[i][0],
            expected = tests[i][1],
            result = sh.split(args).args;
        console.log(compare_arr(expected, result), args.toString(), expected.toString(), result.toString());
    }
}

//test_shlex();
