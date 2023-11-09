const express = require("express");

const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")

const app = express();

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(console.log("Mongodb connected"))

app.use(express.json());

app.use("/url", urlRoute);
app.use("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    }
    );
    res.redirect(entry.redirectURL)
});

const PORT = 8001;

app.listen(PORT, () => console.log(`Server Started at:http://localhost:${PORT}`))