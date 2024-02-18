/*const port = 3000,
express = require("express"),
app = express();
app.get("/", (req, res) => {
res.send("Hello, Universe!");
})
.listen(port, () => {console.log(`The Express.js server has started and is listening
➥ on port number: ${port}`);
});*/

const
port = 3000,
express = require("express"),
app = express();

app.use(express.urlencoded({extended: false}));
    
app.use(express.json());

    app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
    })

.listen(port, ()=>{console.log(`Listen on port: ${port}`)})

