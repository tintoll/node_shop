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

### 생성 및 삭제 

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


```

