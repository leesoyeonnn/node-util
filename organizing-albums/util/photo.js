/**
 * 자동으로 사진 폴더를 정리하는 스크립트 만들어 보기 - node APIs 활용
 * 상황!
 * 매달 pictures라는 폴더 안에 달 별로 폴더를 만들고 사진을 백업할거다.
 * 폴더 안에 android, iphone에서 촬영한 사진, 동영상을 한 번에 업로드 한다.
 * 그리고 폴더에 있는 사진을 구글 포토에 업로드 할 떄 사진과 동영상을 분리해서 개별적으로 업로드 하고싶다.
 * 
 * 핸드폰에서 사진과 동영상을 가지고 오면 업로드 하고 싶지 않은 파일도 포함되어 있다.
 * android, iphone 모두 스크린 샷을 하면 .png 타입으로 파일이 저장된다. iphone에서는 사진을 편집하면 .aae 타입의 파일도 생성된다.
 * phone에서 사진을 편집하거나 보정하게 되면 원본 파일은 유지하면서, 파일 이름에 E가 붙으면서 보정한 사진이 개별적으로 저장된다.
 * e.g. 원본(IMG_0710) 보정된 사진(IMG_E0710)
 * 편집한 사진만 보관하고 싶고, 원본 사진은 백업하고 싶지 않다. 
 * 
 * 해결해야 할 점!
 * 1. .mp4, .mov 같은 동영상은 video 라는 폴더 안에 넣어주고
 * 2. .png, .aae 파일을 백업하고 싶지 않다. 이 파일들은 captured 폴더에 넣어준다.
 * 3. 보정 사진이 있는 원본 사진은 duplicated 폴더 안에 넣는다.
 * 
 * node에 '실행하려는 노드파일 이름'과 '정렬할 사진이 들어있는 폴더이름'을 인자로 전달하면 파일이 정리 되도록 하기
 * e.g. node photo test
 */


const path = require('path');
const process = require('process');
const fs = require('fs').promises;



// node에 인자로 전달 받은 test 폴더 경로를 알아낸다
const testPath = path.resolve(`../pictures/${process.argv[2]}`);
console.log(`🙌 testPath is ${testPath}`);


fs.readdir(testPath) // test 폴더 경로에 있는 사진, 동영상 파일들의 정보를 읽는다.
  .then((fileList) => {
    fileList.forEach((file) => {
      const filePath = `${testPath}/${file}`
      const extension = path.extname(filePath);

      switch (extension) {
        case '.mp4': // 동영상 .mp4, .mov 동영상은 video 폴더 안으로 넣어준다.
        case '.mov':
          fs.mkdir(`${testPath}/videos`)
          .then(
            fs.rename(filePath, `${testPath}/videos/${file}`)
          )
          .catch(console.error)
          break;
        case '.png': // test 폴더에 .png, .aae 파일이 있으면 captured 폴더를 만들고 넣는다.
        case '.aae':
          fs.mkdir(`${testPath}/captured`)
          .then(
            fs.rename(filePath, `${testPath}/captured/${file}`)
          )
          .catch(console.error)
          break;
        case '.jpg': // test 폴더에 보정된 파일이 있으면 (IMG_E1234) duplicated 폴더를 만들고 원본 파일을(IMG_1234) 넣는다.
          if(path.basename(filePath, '.jpg').includes('E')) {
            fs.mkdir(`${testPath}/duplicated`)
            .then(
              fs.rename(`${testPath}/${file.replace('E', '')}`, `${testPath}/duplicated/${file.replace('E', '')}`)
            )
            .catch(console.error)
          }
      }
    })
  })
  .catch(console.error)







