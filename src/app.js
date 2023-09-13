const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const prodctsRouter = require('./routes/products');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', prodctsRouter)

app.get('/', (req, res) => {
    res.send('Hola desde Express')
})

app.listen(port, () => console.log(`Server TURNED ON in the port ${port}`))