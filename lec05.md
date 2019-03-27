## XSS (Cross Site Scripting)
- 글 등록시 <script>location.href</script> 와 같이 페이지를 이동하게 하거나 매 초마다 목표사이트를 공격하게 하는 스크립트 삽입, 또는 사이트 쿠키를 가로채고 전송

### XSS 방어법
1. DB에 저장 전 특수문자를 필터링한다.
2. <, >, 을 html 특수문자 코드로 변환한다.
3. 그 밖의 문자열은 지운다.

```javascript
// npm install xss

var xss = require('xss');
var html = xss('<script>location.href</script>');
console.log(html);
```

## CSRF (Cross-Site Request forgery)
- 사용자가 자신의 의지와 무관하게 글 등록, 수정,삭제를 서버에 요청

### CSRF 방어법
1. 토큰 발행
  - 글작성전 서버에서 토큰 확인후 저장

#### node.js에서 csurf를 이용함. 
```shell
npm install csurf
```

```javascript
<form><input type="hidden" name="_csrf" value="aFQ25j8Y-jw16md0R2xnGLhnuIY8r10VCQNw"></form>
// router에서 토큰 일치확인
if(_csrf !==csrf) error;
```



## 파일업로드 

```shell
npm install --save multer
```

### Multer 설정

```javascript
// multer 설정
var multer = require('multer');
var storage = multer.diskStorage({
  destination : function(req, file, callback) { // 이미지가 저장되는 도착지 지정
    callback(null, uploadDir);
  },
  filename : function(req, file, callback) {
    callback(null, 'products-'+Date.now()+'.'+file.mimetype.split('/')[1]);
  }
});
var upload = multer({storage : storage});
```

### Router에 적용 

```javascript
// thumbnail 명으로 들어오는 파일을 받는다. 
admin.post("/products/write", upload.single('thumbnail'), csrfProtection, function(req, res) {
	...
}
```



### 파일삭제

```javascript
var fs = require('fs');
// 비동기 방식
fs.unlink(경로, function(err) => {
	// 콜백          
});
// 동기 방식 
fs.unlinkSync(경로);
```



