const express = require('express');
const PORT = 3000;
const path = require('path');

const db = require('./db.js');
const app = express();

app.get('/', (req, res, next) => {
	res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/api/offerings', async(req,res,next)=>{
    res.send(await db.Offering.findAll())
});

app.get('/api/products', async(req,res,next)=>{
    res.send(await db.Product.findAll())
});
app.get('/api/companies', async(req,res,next)=>{
    res.send(await db.Company.findAll())
});

db.syncAndSeed().then(()=>{
    app.listen(PORT, () => {
        console.log(`we are in localhost${PORT}`);
    });
})
