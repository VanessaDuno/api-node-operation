var bodyParser = require('body-parser');
const {writeOperationDataToKafka} =  require ('../data/operation.kafka');
var uuid = require('uuid');
const OperationsState =  require('../models/OperationStatesEnum')
const topicConfig = require ('../commons/Constants')


module.exports = async function(app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded ({ extended : true}));

    

    app.post('/operations',  async (req, res) => {
        const id = uuid.v4()
        await writeOperationDataToKafka({
            id : id, 
            owner_id: req.body.ownerId, 
            type_id: req.body.typeId,
            payload: JSON.stringify(req.body.payload),
            metadata: JSON.stringify(req.body.metadata),
            channel: req.headers.channel,
            state: OperationsState.INTAKE, 
            createdDate: '09/12/2021', 
            modifiedDate: '09/12/2021' }, 
            topicConfig.create.topic,
            topicConfig.create.version,
            topicConfig.create.subject)
      
        res.send({'operationId' : id})
      })

    app.get('/operation', async (req, resp) => {
        res.send('operation by parameters')
    })

    app.get('/operation/:operation_id', async (req, resp) => {
        res.send('operation by id')
    })

    app.patch('/operation/:operation_id/payload', async (req, res) => {
        await writeOperationDataToKafka({
            operation_id : req.params.operation_id,
            payload: JSON.stringify(req.body.payload)}, 
            topicConfig.payload.topic,
            topicConfig.payload.version,
            topicConfig.payload.subject)
        res.send('payload state')
    })

    app.put('/operation/:operation_id/state', async (req, res) => {
        await writeOperationDataToKafka({
            operation_id : req.params.operation_id,
            metadata: JSON.stringify(req.body.metadata),
            state: req.body.state }, 
            topicConfig.state.topic,
            topicConfig.state.version,
            topicConfig.state.subject)
        res.send('update state')
    })

}

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
  
    if (bearerHeader) {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }