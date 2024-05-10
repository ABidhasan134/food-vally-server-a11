const express=require('express');
const cors=require('cors');

const app=express();
const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Resturent is high in the Rocket")
})

app.listen(port,()=>{
    console.log(`Resturent is high in the Rocket ${port}`)
});