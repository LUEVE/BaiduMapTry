const size = 20;


var g = new Array(size);
var shortest_length; // 最短路长度
var final_path; // 最终路径，第一项为起点，最后一项为终点

function handleData (evt) {
    //alert("fuck2")
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        var content = evt.target.result.split(" ");

        // alert(content);
        var cnt = 0;

        // ----------------- build graph
        for (var i = 0; i < g.length; ++i) {
            g[i] = new Array(size);
            g[i][i] = 0;
            for (var j = i + 1; j < g[i].length; ++j) {
                // TODO fill g[i][j] here
                g[i][j] = parseInt(content[cnt++]);
            }
        }
        for (var i = 0; i < g.length; ++i) {
            for (var j = i + 1; j < g[i].length; ++j) {
                g[j][i] = g[i][j];
            }
        }

        //shortest_path(4, [5, 6, 8], 11); // test here
    }
    reader.readAsText(file);
}

// once the file is uploaded, the graph will be built up
document.getElementById('data').addEventListener('change', handleData, false);



// **NOTE:** the shortest_path function should be only called after the graph has been built up, i.e. after the file has been uploaded.
function shortest_path(s, imd, t) {
    // s is a start point, t is an end point, imd is an array that contain all intermediate points
    // be sure imd doesn't contain any points that ain't intermediate points

    var len = new Array(size);
    var paths = new Array(size);
    var imd_p = new Array(size);

    var p = new Array(size);

    for (var i = 0; i < g.length; ++i) {
        len[i] = new Array(size);
        for (var j = 0; j < len[i].length; ++j) {
            len[i][j] = Number.MAX_VALUE;
        }
        paths[i] = new Array(size);
        for (var j = 0; j < paths[i].length; ++j) {
            paths[i][j] = 0;
        }
        imd_p[i] = new Array(size);
    }

    for (const u of imd) {
        len[0][u] = g[s][u];
        paths[0][u] = (1<<u);
        imd_p[0][u] = s;
    }
    // ---------------------- initialization above

    // dp here
    for (var i = 1; i < imd.length; ++i) {
        for (const u of imd) {
            for (const v of imd) {
                if ((paths[i - 1][u] & (1<<v)) === 0) {
                    var tmp = len[i - 1][u] + g[u][v];
                    if (len[i][v] > tmp) {
                        len[i][v] = tmp;
                        paths[i][v] = (paths[i - 1][u] | (1<<v));
                        imd_p[i][v] = u;
                    }
                }
            }
        }
    }

    // get the shortest length
    shortest_length = Number.MAX_VALUE;
    for (const u of imd) {
        if (len[imd.length - 1][u] + g[u][t] < shortest_length) {
            shortest_length = len[imd.length - 1][u] + g[u][t];
            p[imd.length - 1] = u;
        }
    }
    //alert(shortest_length);

    // backtrace the shortest path
    for (var i = imd.length - 2; i >= 0; --i) {
        p[i] = imd_p[i + 1][p[i + 1]];
    }

    // generate the final path array
    final_path = new Array();
    final_path.push(s);
    for (var i = 0; i < imd.length; ++i) {
        final_path.push(p[i]);
    }
    final_path.push(t);
    if (imd.length === 0) shortest_length = g[s][t];

    //alert(final_path);
}