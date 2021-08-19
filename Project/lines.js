const fs = require("fs")

(async () => {let lines = 0
    let letters = 0
    var walk = function(dir) {
      var results = [];
      var list = fs.readdirSync(dir);
      list.forEach(function(file) {
          file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) { 
                results = results.concat(walk(file));
            } else { 
                results.push(file);
            }
      });
      return results;
    }
    for(const source of walk(process.cwd())){
      let data = await fs.readFileSync(source, 'utf8')
      letters += await data.length;
      lines += await data.split('\n').length;
    }
console.log(letters + " LETTERS")
console.log(lines + " LINES")})(); 