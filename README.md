# api.storehouse
API server for storehouse

### Steps for deploy
1. Install PostgreSQL > 9.0
2. Deploy DB structure ([link](https://github.com/oneassasin/api.storehouse/blob/master/sql/storehouse.sql))
3. Deploy default params ([link](https://github.com/oneassasin/api.storehouse/blob/master/sql/storehouse.init.sql))
4. Install Node.js > 5.0
5. In colsole: 
``` 
npm install
```
6. Correct config.json file for your DB configuration 
7. In console: 
```
./run.sh
```