require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/noteModel')

const BASE_URL = "/api/v1"
const password = process.argv[2]
const url = `mongodb+srv://jesusCasEsl:${ password }@notescluster.edvm8.mongodb.net/notesApp?retryWrites=true&w=majority&appName=NotesCluster`

const requestLoggerMidd = (request, response, next) => {
  console.log('=======================')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('=======================')
  next()
}
const unknownEndpointMIdd = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());

app.use(requestLoggerMidd)


app.get(`${ BASE_URL }/`, (request, response) => {
  response
    .status(200)
    .end("Prueba de Servidor")
})

app.get(`${ BASE_URL }/notes`, (request, response) => {
  Note
    .find({})
    .then((notes) => {
      response
        .status(200)
        .json(notes)
    })
  
})

app.get(`${ BASE_URL }/notes/:id`, (request, response) => {
  const { id } = request.params

  Note
    .find({ id: Number(id) })
      .then((note) => {
        if(note.length === 0) {
          return response
            .status(404)
            .json({ error: true, msg: "Nota no encontrada" })
        }

        response
          .json(note)
      })
    .catch((error) => {
      response
        .status(500)
        .json({ error: true, msg: `Erro: ${error}` })
    })
})

app.post(`${ BASE_URL }/notes`, (request, response) => {
  const { body } = request

  if(!body || Object.entries(body).length === 0) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la nota" })
  }

  const {id, text, status, important } = body
  const idNote = Number(id)

  if(idNote == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la propiedad 'id'" })
  }
  if(important == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la propiedad 'important'" })
  }

  Note
    .find({ id: idNote })
    .then((result) => {
      if(result.length > 0) {
        return response
          .status(409)
          .json({ error: true, msg: "La nota ya existe" })
      }

      const note = new Note({
        id: idNote,
        text: text || '',
        status: status || false,
        important: important || false
      });
      note
        .save()
        .then(() => {
          console.log('note saved!')
          response
            .status(201)
            .json({
              error: false,
              msg: "Nota creada correctamente",
              note
            })
      })
  })
  .catch((error) => {
    console.log(error)
    response
      .status(500)
      .json({ error: true, msg: `Erro: ${error}` })
  })
})

app.put(`${ BASE_URL }/notes/:id`, (request, response) => {
  const { body } = request
  const { id } = request.params

  if(!body || Object.entries(body).length === 0) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la nota" })
  }

  const { text } = body
  const idNote = Number(id)

  if(idNote == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta la propiedad 'id'" })
  }

  Note
    .find({ id: idNote })
    .then((result) => {
      if(result.length === 0) {
        return response
          .status(409)
          .json({ error: true, msg: "La nota no existe" })
      }

      Note
        .findOneAndUpdate({ id: idNote }, { text }, { new: true, runValidators: true })
        .then((note) => {
          response
            .status(201)
            .json({
              error: false,
              msg: "Nota modificada correctamente",
              note
            })
        })
        .catch((error) => {
          response
            .status(500)
            .json({ error: true, msg: `Erro: ${error}` })
        })
  })
  .catch((error) => {
    response
      .status(500)
      .json({ error: true, msg: `Erro: ${error}` })
  })
})

app.delete(`${ BASE_URL }/notes/:id`, (request, response) => {
  const { id } = request.params

  if(id == null) {
    return response
      .status(400)
      .json({ error: true, msg: "Falta Por indicar la nota que deseas eliminar" })
  }

  const idNote = Number(id)

  Note
    .find({ id: idNote })
    .then((note) => {
      if(note.length === 0) {
        return response
          .status(404)
          .json({ error: true, msg: "Nota no encontrada" })
      }

      Note.findOneAndDelete({ id: idNote })
        .then((result) => {
          if (!result) {
            return response
              .status(404)
              .json({ error: 'Nota not found' })
          }

          response
            .status(204)
            .json({
              error: false,
              msg: "Nota eliminada correctamente",
              note
            })
        })
    })
    .catch((error) => {
      response
        .status(500)
        .json({ error: true, msg: `Erro: ${error}` })
    })
})

app.use(unknownEndpointMIdd)

const PORT = process.env.PORT
app.listen(3001, () => {
  console.log(`Server running on port ${PORT}`)
})