const path = require('path');
const process = require('process');
const fs = require('fs');

// 1. node에 인자로 전달 받은 test 폴더 경로를 알아낸다.
// 2. test 폴더의 파일 목록을 읽는다. 
// 3. 파일들의 확장자 별로 필요한 폴더를 만든다. 해당하는 폴더로 파일을 옮긴다. (이미 폴더가 존재한다면 파일을 옮겨주기만 한다.)

const testPath = path.resolve(`../pictures/${process.argv[2]}`);
console.log(`🙌 testPath is ${testPath}`);

const moveFile = (file, mediatype) => {
  const fileName = path.basename(file);
  const newPath = testPath + path.sep + mediatype + path.sep + fileName;

  fs.promises.rename(file, newPath)
  .catch(console.error)
}

const makeDir = (file, mediatype) => {
  const dirPath  = testPath + path.sep + mediatype;
  
  if(fs.existsSync(dirPath)) {
    console.log(`🙌 '${dirPath}' already exists!! The file will be transferred.`)
    moveFile(file, mediatype)
  } else {
    // 폴더가 만들어지면 파일이 옮겨져야 하는데 비동기적으로 작성했더니 오류가 난다.
    fs.promises.mkdir(dirPath)
      .then(() => {
        moveFile(file, mediatype)
        console.log(`🙌 '${dirPath}' is created!! The file will be transferred.`)
      })
      .catch(console.error)
  }
}

const classify = (fileList) => {
  fileList.forEach((file) => {
    const fileExtension = path.extname(file);

    switch (fileExtension) {
      case '.mov':
      case '.mp4':
        makeDir(file, 'videos');
        break;
      case '.aae':
      case '.png':
        makeDir(file, 'captured');
        break;
      case '.jpg':
        if(path.basename(file, '.jpg').includes('E')) {
          makeDir(file, 'duplicated');
        }
    }
  })
}

const readFileList = (testPath) => {
  const fileList = [];

  fs.promises.readdir(testPath)
  .then((items) => {
    items.forEach((item) => fileList.push(testPath + path.sep + item))
    console.log(`🙌 file list in testPath :`);
    console.log(fileList);
    
    classify(fileList);
  })
  .catch(console.error);
}

readFileList(testPath);






