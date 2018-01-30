const router = require('express').Router()
const { Room } = require('../db/models')
const Sandbox = require('sandbox')
const s = new Sandbox()

module.exports = router

router.get('/all', (req, res, next) => {
  Room.findAll()
    .then(rooms => res.json(rooms))
    .catch(next)
})

router.get('/:roomHash', (req, res, next) => {
  Room.findOne({ where: { roomHash: req.params.roomHash  || null } })
    .then(room => res.json(room))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const f = req.body.fitnessFunc
  //run fitnessFunc in sandbox before adding to db
  s.run(`(() => { let fitFunc = eval("(" + ${f} + ")")
   return fitFunc()})()`, function(output){
    console.log('req.body: ' + req.body + 'result: ' + output.result)
  })
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next)
})

router.put('/:roomHash', (req, res, next) => {
  const f = req.body.fitnessFunc
  //run fitnessFunc in sandbox before adding to db
  s.run(`(() => { let fitFunc = eval("(" + ${f} + ")")
   return fitFunc()})()`, function(output){
    console.log(output.result)
  })
  Room.update(
    { fitnessFunc: req.body.fitnessFunc },
    {
      where: { roomHash: req.params.roomHash },
      returning: true, // needed for affectedRows to be populated
      plain: true // makes sure that the returned instances are just plain objects
    },
  )
    .spread((numberOfAffectedRows, affectedRows) => res.send(affectedRows))
    .catch(next)
})
