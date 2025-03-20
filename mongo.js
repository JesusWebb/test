const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
// PassMongoNotes88
const url = `mongodb+srv://jesusCasEsl:${ password }@notescluster.edvm8.mongodb.net/notesApp?retryWrites=true&w=majority&appName=NotesCluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

// MODELO DE DATO
const noteSchema = new mongoose.Schema({
  id: Number,
  text: String,
  important: Boolean,
  status: Boolean,
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Note = mongoose.model('Note', noteSchema)

// GET - TODDAS LAS NOTAS
// Note
//   .find({})
//   .then((result) => {
//     result.forEach((note) => {
//       console.log(note)
//     })
//   mongoose.connection.close()
// })

// GET - :ID
// Note
//   .find({ id: 1 })
//   .then((result) => {
//     console.log("=====")
//     console.log(result)
//     console.log("=====")
//     result.forEach((note) => {
//       console.log(note)
//     })
//   mongoose.connection.close()
// })
// GET - status true
Note
  .find({ status: true })
  .then((result) => {
    result.forEach((note) => {
      console.log(note)
    })
  mongoose.connection.close()
})

// POST - CREAR NOTE
// const note = new Note({
//   id: 5,
//   text: 'Prueba 5',
//   important: false,
//   status: false,
// })

// note
//   .save()
//   .then((result) => {
//     console.log('note saved!')
//     console.log(result)
//     mongoose.connection.close()
// })