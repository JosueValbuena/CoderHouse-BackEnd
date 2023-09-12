const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const prodctsRouter = require('./routes/products');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', prodctsRouter)

app.listen(port, () => console.log(`Server ON in port ${port}`))