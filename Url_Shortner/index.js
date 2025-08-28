const express=require('express');
const app=express();
const PORT=8000;
const urlRoute =require('./routes/url')
const connectToMongoDb=require('./connect')
const URL=require("./models/url")

connectToMongoDb('').then(()=> console.log("MongoDB connected")
);

app.use(express.json());
app.use("/url",urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId.trim(); // Remove whitespace
    console.log("Received shortId:", shortId);

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId: shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
        );

        if (!entry || !entry.redirectUrl) {
            console.error("No entry found or redirectUrl missing for shortId:", shortId);
            return res.status(404).send("Short URL not found");
        }

        console.log("Redirecting to:", entry.redirectUrl);
        // Ensure redirectUrl has proper protocol (http:// or https://)
        let redirectUrl = entry.redirectUrl;
        if (!/^https?:\/\//.test(redirectUrl)) {
            redirectUrl = 'https://' + redirectUrl;
        }
        res.redirect(redirectUrl);

    } catch (err) {
        console.error("Error during database operation:", err);
        res.status(500).send("Internal server error");
    }
});




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})