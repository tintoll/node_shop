## 콜백헬 개선

1. Geneator 이용

   ```javascript
   // Geneator 사용법 
   function* iterFunc() {
     yield console.log('첫번째 출력');
     yield console.log('두번째 출력');
     yield console.log('세번째 출력');
     yield console.log('네번째 출력');
   }
   
   var iter = iterFunc();
   iter.next(); // 첫번째 출력
   iter.next(); // 두번째 출력
   
   
   // next()를 대신 해주고 return으로 한번에 반환해주는 함수가 없을까?
   // npm i --save co   -> https://github.com/tj/co
   var getData = co(function*() {
     var product = yield ProductsModel.findOne({ id: req.params.id }).exec();
     var comments = yield CommentsModel.find({
       prodocut_id: req.body.id
     }).exec();
     return {
       product: product,
       comments: comments
     };
   });
   getData.then(function(result) {
     res.render("admin/productDetail", {
       product: result.product,
       comments: result.comments
     });
   });
   ```

   

2. async/awat 이용 

   ```javascript
   var getDataByAsync = async () => ({
     product: await ProductsModel.findOne({ id: req.params.id }).exec(),
     comments: await CommentsModel.find({ prodocut_id: req.body.id }).exec()
   });
   getDataByAsync().then(function(result) {
     res.render("admin/productDetail", {
       product: result.product,
       comments: result.comments
     });
   });
   ```

   