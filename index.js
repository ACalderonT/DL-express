import express from "express";
import { writeFile, readFile } from "node:fs/promises";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());



const getRepertories = async () => {
    const fsResponse = await readFile("repertorio.json", "utf-8");
    const repertorio = JSON.parse(fsResponse);

    return repertorio;
}

app.get("/", (req, res) => {
    res.sendFile( __dirname + "/index.html");
})

app.get("/canciones", async (req, res) => {
    const repertorios = await getRepertories()
    res.json(repertorios)
})

app.post("/canciones", async (req, res) => {
    const { id, titulo, artista, tono } = req.body
    const newRepertory = {
        id,
        titulo,
        artista,
        tono
    }

    let repertories = await getRepertories();
    repertories.push(newRepertory);
    await writeFile("repertorio.json", JSON.stringify(repertories));

    res.status(201).json(newRepertory);
})

app.put("/canciones/:id", async (req, res) => {
    const { id } = req.params
    const { titulo, artista, tono} = req.body

    let repertories = await getRepertories();
    const repertory = await repertories.find((repertory) => repertory.id == id)

    if(!repertory){
        res.status(404).json({ message: "Song not found"})
    }

    repertories = repertories.map((repertory) => {
        if(repertory.id == id){
            return {
                ...repertory,
                titulo,
                artista,
                tono
            }
        }

        return repertory
    })

    await writeFile("repertorio.json", JSON.stringify(repertories))

    res.json(repertories);
})

app.delete("/canciones/:id", async (req, res) => {
    const { id } = req.params

    let repertories = await getRepertories();

    const repertory = repertories.find((repertory) => repertory.id === parseInt(id));

    if(!repertory){
        res.status(404).json({ message: "Song Not Found"})
    }

    repertories = repertories.filter((repertory) => repertory.id !== parseInt(id))

    await writeFile("repertorio.json", JSON.stringify(repertories))

    res.json(repertories);
})

app.listen(3000, console.log("¡Servidor encendido!"));