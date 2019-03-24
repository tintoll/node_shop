## mysql과 몽고db 비교 
- https://www.slideshare.net/WooYeongChoe1/slidshare-mongodbmysqlcrud

|        | 속도비교                                          |
| ------ | ------------------------------------------------- |
| Insert | MongoDB > Mysql 근소하게                          |
| Select | MongoDB > Mysql 연산속도 빠르다                   |
| Update | MongoDB > Mysql 최초 쿼리이후 MongoDB가 더 빠르다 |
| Delete | MongoDB > Mysql                                   |



## mongodb 설치 (Mac)

- https://nesoy.github.io/articles/2017-04/MongoDB

### Collection 생성 및 삭제 

```shell
> use exercise // excercise 라는 Database를 생성또는 사용ㄴ
> db // 현재 사용하는 사용중인 DB확인
> show dbs // Database 리스트 확인

// person collection이 생성되고 한줄이 삽입됨.
> db.person.insert({"name":"fastcamplus","lecture":"nodejs"});
// Databse 제거
> db.dropDatabase()

// collection 생성
> db.createCollection('test', {capped:true, size:204700});
// capped : true이면 용량 초과시 오래된 데이터를 덮어버림.size입력필수

// collection 리스트 확인 
> show collections

// collection 삭제
> db.test.drop();
```

### 조회

```shell
// 데이터를 조회
> db.test.find();
// 보기 좋게 해주어 조회
> db.test.find().pretty();

// writer가 admin인것만 조회
> db.board.find({"writer":"admin"}).pretty();
// writer가 admin이고 title이 Hello인거 조회
> db.board.find({"writer":"admin", "title" : "Hello"}).pretty();

// 조회수 > 20 조회
> db.board.find({"hit":{$gt:20}}).pretty();
// 5 < 조회수 < 20
> db.board.find({"hit":{$gt:5,  $lt:20}}).pretty();

// admin 이면서 조회수가 10아래인 값
> db.board.find({$and : [ {"writer":"admin"}, {"hit":{$lt : 10}} ]}).pretty();


// 원하는 필드만 출력  Projection
> db.board.find({}, {"_id":false,"title":true,"content":true});
// 카운트 가져오기 
> db.board.find({}, {"_id":false,"title":true,"content":true}).count();

// 정렬 1은 오름차순, -1은 내림차순
> db.board.find().sort({"hit" : -1});

// 출력 개수 제한
> db.board.find().limit(2)

// 데이터의 시작부분 지정. 1번째 부터 출력
> db.board.find().skip(1)
```

| 연산자 | 설명                     |
| ------ | ------------------------ |
| $eq    | = 일치하는값             |
| $gt    | > 큰값                   |
| $gte   | >= 크거나 같은           |
| $lt    | < 작은                   |
| $lte   | <= 작거나 같은           |
| $ne    | != 일치하지 않는값       |
| $in    | 배열안에 속하는경우      |
| $nin   | 배열안에 속하지 않는경우 |

### Data Update, Delete

```shell
// 글 제목이 test인 경우 글내용 수정
> db.board.update(
... {"title" : "test"},
... { $set : {"content" : "content update!"}
... });


// 글작성자가 test2일경우 삭제
> db.board.remove({"writer": "test2"});
```

