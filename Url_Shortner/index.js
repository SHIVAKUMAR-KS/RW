const express=require('express');
const app=express();
const PORT=8000;
const urlRoute =require('./routes/url')
const connectToMongoDb=require('./connect')
const URL=require("./models/url")

connectToMongoDb('mongodb+srv://shiva:a99jr8erSMuPbvSv@cluster0.n7eusza.mongodb.net/shortUrl').then(()=> console.log("MongoDB connected")
);

app.use(express.json());
app.use("/url",urlRoute);

app.get('/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId,
    },{
        $push:{
            visitHistory:{timestamp:Date.now()}
        }
    })
    res.redirect(entry.redirectUrl)
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})