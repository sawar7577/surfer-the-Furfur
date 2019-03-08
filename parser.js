
function parsemtl(str) {
    var dict = {};
    var lines = str.split("\n");
    for(var i = 0 ; i < lines.length; ++i) {
        var words = lines[i].split(" ");
        if(words[0] == "newmtl") {
            for(var j = i ; j < lines.length ; ++j) {
                var wd = lines[j].split(" ");
                if(wd[0] == "Kd") {
                    dict[words[1]] = [wd[1], wd[2], wd[3]];
                    console.log(words[1], wd[1], wd[2], wd[3]);
                    break;
                }
            }
        }
    }
    return dict;
}

function parseObj(str, str2) {
 
    var ret = parsemtl(str2);
    verts = [];
    norms = [];
    texts = [];

    vertices = [];
    colors = [];
    normals = [];
    textureCoords = [];

    var lines = str.split("\n");
    var cur;

    for(var i = 0 ; i < lines.length ; ++i) {
        var words = lines[i].split(" ");
        if(words[0] == "v") {
            for(var j = 1 ; j < 4 ; ++j) {
                // console.log(parseFloat(words[j]));
                verts.push(parseFloat(words[j]));
            }
        }
        if(words[0] == "vt") {
            for(var j = 1 ; j < 4 ; ++j) {
                texts.push(parseFloat(words[j]));
            }
        }
        if(words[0] == "vn") {
            for(var j = 1 ; j < 4 ; ++j) {
                norms.push(parseFloat(words[j]));
            }
        }
        if(words[0] == "f") {
            // console.log(verts);
            for(var j = 1 ; j < 4 ; ++j) {
                var nums = words[j].split("/");

                // console.log(parseInt(nums[0]) - 1);
                vertices.push(verts[3*(parseInt(nums[0]) - 1) ]);
                vertices.push(verts[3*(parseInt(nums[0]) - 1) +1 ]);
                vertices.push(verts[3*(parseInt(nums[0]) - 1) +2 ]);

                normals.push(norms[3*(parseInt(nums[1]) - 1) ]);
                normals.push(norms[3*(parseInt(nums[1]) - 1) +1 ]);
                normals.push(norms[3*(parseInt(nums[1]) - 1) +2 ]);

                // console.log(cur, parseFloat(ret[cur][0]), parseFloat(ret[cur][1]),  parseFloat(ret[cur][2]) );
                colors.push(parseFloat(ret[cur][0]));
                colors.push(parseFloat(ret[cur][1]));
                colors.push(parseFloat(ret[cur][2]));
                colors.push(1.0);

                textureCoords.push(texts[2*(parseInt(nums[2]) - 1) ]);
                textureCoords.push(texts[2*(parseInt(nums[2]) - 1) +1 ]);

            }
        }
        if(words[0] == "usemtl") {
            cur = words[1];
            console.log(words[1]);
        }
    }

    return {
        verticesObj : vertices,
        normalsObj : normals,
        texturesObj : textureCoords,
        colorsObj : colors, 
    };
};