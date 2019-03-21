## npm

```javasciprt
- package.json

"dependencies": {
    "body-parser": "~1.15.2",
    …….  
   }
```

### npm 버전 표기 방법 
- url : https://docs.npmjs.com/misc/semver

| 기호     | 의미                            |
| -------- | ------------------------------- |
| 1.15.2   | 완전히 일치                     |
| =1.15.2  | 완전히 일치                     |
| >1.15.2  | 큰버전                          |
| >=1.15.2 | 크거나 같은버전                 |
| <1.15.2  | 작은버전                        |
| <=1.15.2 | 작거나 같은 버전                |
| ~1.15.2  | 범위(1.15.2 ~ 1.15.3 보다 작음) |

```shell
// 설치된 모듈 확인
npm list 
npm list -depth=0

// 글로벌 모듈 확인 
npm list -g
```

