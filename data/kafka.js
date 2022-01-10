const { Kafka } = require('kafkajs');
const { SchemaRegistry } = require ('@kafkajs/confluent-schema-registry');

const userName = '';
const pass = '';
const brokers = ['localhost:9092'];
const host = 'http://localhost:8084';
const clientId = 'client-id-example';

const sasl = userName && pass ? { userName, pass, mechanism: 'plain'} : null
// sin autenticación
const ssl = !!sasl

const registry = new SchemaRegistry({host});
const kafka =  new Kafka ({ clientId, brokers /*ssl sasl*/})

const producer =  kafka.producer();

const findSchemaBySubjectAndVersion = ({version, subject}) => registry.getRegistryId(subject, version);

const sendMessageToTopic = async ({key, topic, encodePayloadId, payload}) => {
   try {
    await producer.connect(); 
    const encodePayload =  await registry.encode(encodePayloadId, payload); 

    const responses = await producer.send ({
        topic: topic,
        messages : [{key, value: encodePayload}]
    })
    console.info ('Successfull operation when writing data to kafka', responses);
   }catch(err) {
    console.error('Error trying to write data to Kafka', err)
   }
}



module.exports.findSchemaBySubjectAndVersion = findSchemaBySubjectAndVersion;
module.exports.sendMessageToTopic = sendMessageToTopic;