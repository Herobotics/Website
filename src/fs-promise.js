const fs = require('fs');
exports.fs = fs;
const path = require('path');

//List all files in dir and sub dir
exports.walk = function(dir, base){
  //TODO: error handling
  if(base == undefined){
    base = dir;
  }
  return new Promise((res, rej) => {
    function checkFile(file){
      return new Promise((resolve, reject) => {
        fs.stat(path.join(dir, file), (err, stats) => {
          //if we get an error throw it
          if(err){
            reject(err);
          }
          else{
            if(stats.isFile()){
              //Save file names
              resolve([path.join(dir, file)]);
            }
            else{
              //Walk through folders
              exports.walk(path.join(dir, file), base)
              .then((files) => {
                resolve(files);
              });
            }
          }
        });
      })
    }

    new Promise((resolve, reject) => {

      var filePromises = [];

      fs.readdir(dir, (err, dirFiles) => {
        for(var f in dirFiles){
          filePromises.push(checkFile(dirFiles[f]));
        };

        Promise.all(filePromises)
        .then((folders) => {
          var files = [];

          for(var f in folders){
            files = files.concat(folders[f])
          }

          // files = files.map((f) => {f.substring(dir.length)});
          resolve(files);
        });
      });
    })
    .then((files) => {
      for(var f in files){
        files[f] = files[f].replace(base, '');
      }
      res(files);
    })
  })
}

exports.readFile = function(file, encoding){
	return new Promise((resolve, reject) => {
		fs.readFile(file, encoding, (err, data) => {
      if(err){
				reject(err);
			};
      resolve(data);
		});
	});
};

exports.writeFile = function(file, data, encoding){
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, encoding, (err) => {
      if(err){
				reject(err);
			};
      resolve(undefined);
		});
	});
};

exports.readdir = function(dir){
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, data) => {
      if(err){
				reject(err);
			};
      resolve(data);
		});
	});
};

exports.mkdir = function(dir){
	return new Promise((resolve,reject) => {
		fs.mkdir(dir, (err) => {
			if(err){
				reject(err)
			}
			resolve(undefined)
		})
	});
};

exports.mkdirs = function(dir){
	return new Promise((resolve,reject) => {
		function callNextFolder(folders, i){
			if(i == folders.length){
				return
			};

			var folder = "";

			while(folders.length != 0){
				folder = path.join(folder, folders.shift());
			}

			exports.mkdir(folder)
			.then(() => {
				callNextFolder(folders, i + 1);
			})
			.catch(() => {
				callNextFolder(folders, i + 1);
			});
		};

		callNextFolder(dir.split(/\/[^\/]+$/), 0);
		resolve(undefined)
	});
};
