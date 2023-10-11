import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import OpenAI from 'openai';


dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async(req,res) => {
    res.status(200).send({
        message: "This is chatgpt AI App",
    });
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

app.post("/", async(req,res) => {
    try {
        const response = await openai.completions.create({
            model : "text-davinci-003",
            prompt: req.body.input ,
            temperature: 0.3 , 
            max_tokens: 4000 ,
            top_p:1,
            frequency_penalty:0.5 ,
            presence_penalty:0,
        });
        console.log("PASSED : ", req.body.input)

        res.status(200).send({
            bot : response.choices[0].text,
        });
    } catch (err) {
        console.log("FAILED : ", req.body.input)
        console.error(err)
        res.status(500).send(err)
    }
})

app.listen(4000,() => console.log("Server is running on port 4000 "));       // 4000 is localhost port 