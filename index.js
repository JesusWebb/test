const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log('=======================')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('=======================')
  next()
}

const BASE_URL = "/api/v1"
const notes = [
  {
    id: 1,
    text: "Pruena 1",
    status: true,
    important: true,
  },
  {
    id: 2,
    text: "Prueba 2",
    status: false,
    important: false,
  },
  {
    id: 3,
    text: "Prueba 3",
    status: false,
    important: false,
  },
  {
    id: 4,
    text: "Prueba 4",
    status: false,
    important: true,
  },
]

app.use(requestLogger)

app.get(`/`, (request, response) => {
  response
    .status(200)
    .end("Prueba de Servidor")
})

app.get(`${ BASE_URL }/notes`, (request, response) => {
  response
    .status(200)
    .json(notes)
})

app.get(`${ BASE_URL }/notes/:id`, (request, response) => {
  const { id } = request.params
  const note = notes.find((note) => note.id === Number(id))

  if(!note) {
    return response
      .status(404)
      .json({ error: true, msg: "Nota no encontrada" })
  }

  response
    .json(note)
})

app.post(`${ BASE_URL }/notes`, (request, response) => {
  const { body } = request

  if(!body || Object.entries(body).length === 0) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la nota" })
  }

  const {id, text, status, important } = body

  if(id == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la propiedad 'id'" })
  }
  if(important == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la propiedad 'important'" })
  }

  const isNote = notes.some((note) => note.id === id)

  if (isNote) {
    return response
      .status(409)
      .json({ error: true, msg: "La nota ya existe" })
  }

  const note = {
    id,
    text: text || '',
    status: status || false,
    important
  };
  notes.push(note);

  response
    .status(201)
    .json({
      error: false,
      msg: "Nota creada correctamente",
      note
    })
})

app.delete(`${ BASE_URL }/notes/:id`, (request, response) => {
  const { id } = request.params

  if(id == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta Por indicar la nota que deseas eliminar" })
  }

  const indexNote = notes.findIndex((note) => note.id === Number(id))

  if (indexNote === -1) {
    return response
      .status(404)
      .json({ error: true, msg: "La nota no existe" })
  }

  notes.splice(indexNote, 1);

  response
    .status(200)
    .json({
      error: false,
      msg: "Nota eliminada correctamente"
    })
})

const PORT = process.env.PORT || 3001
app.listen(3001, () => {
  console.log(`Server running on port ${PORT}`)
})