exports.contactCreate = async function (connection, inArgBody) {
  try {
    let response;
    if (inArgBody) {
      // NOTE: these fields can have other names (spelling options) in DataExtension (RecordTypeId, FirstName, LastName)
      const newContact = {
        ...inArgBody,
      };
      delete newContact.ContactKey;
      response = await connection.sobject("Contact").create(newContact);
    }

    if (!inArgBody || !response.success) {
      throw Error(`response is not success`);
    }
  } catch (err) {
    console.error(`Can't save contact: ${err.message}`);
    throw err;
  }
};

exports.getRecordTypes = async function (connection) {
  const queryResponse = await connection.query(
    `SELECT Id, Name FROM RecordType WHERE SObjectType = 'Contact'`
  );
  const records = queryResponse?.records || [];
  return records.map((record) => ({
    id: record.Id,
    name: record.Name,
  }));
};

/**
 * Controller + Service
 */
exports.getContactFields = function (connection) {
  const contactFieldsWhileListMap = {
    // FirstName: true, // required
    // LastName: true, // required
    Phone: true,
    Fax: true,
    MobilePhone: true,
    Newsletter__c: true,
    Events__c: true,
    Offers__c: true,
  };
  return async (req, res) => {
    try {
      const queryRes = await connection.sobject("Contact").describe();
      const outputFields = (queryRes?.fields || [])
        .filter(
          (item) => contactFieldsWhileListMap[item.name] && item.createable
        )
        .map((item) => ({
          name: item.name,
          label: item.label,
        }));
      return res.status(200).json(outputFields);
    } catch (err) {
      const error = `Can't find contact fields: ${err.message}`;
      console.error(error);
      res.status(401).json({ error });
    }
  };
};
