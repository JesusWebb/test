const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
// const password = process.argv[2]
// const url = `mongodb+srv://jesusCasEsl:${ password }@notescluster.edvm8.mongodb.net/notesApp?retryWrites=true&w=majority&appName=NotesCluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log("=========================================================================================================")
    console.log(`connected to MongoDB To ${url}`)
    console.log("=========================================================================================================")
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
  status: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)