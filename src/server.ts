import express from 'express'


const app = express()
const port = Number(process.env.PORT ?? 4000);


app.listen(port,()=>{
    console.log("Functioning")
})
