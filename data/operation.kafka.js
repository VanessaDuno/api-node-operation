const {findSchemaBySubjectAndVersion, sendMessageToTopic} = require('./kafka');


const writeOperationDataToKafka = async (payload, topic, version, subject) => {
    try{
        const encodePayloadId = await findSchemaBySubjectAndVersion({version, subject});

        console.log(`Topic: ${topic}; subject: ${subject}; id: ${encodePayloadId}`)

        await sendMessageToTopic ({payload, topic, encodePayloadId})
    }catch(err){
        console.error(err)
    }
}


module.exports.writeOperationDataToKafka =  writeOperationDataToKafka;
