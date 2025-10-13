const isSalesforceRecordId = (stringToEvaluate: string | null) => {
  console.log('isSalesforceRecordId evaluating ' + stringToEvaluate);

  const isCorrectLength = stringToEvaluate?.length == 15 || stringToEvaluate?.length == 18 || false;

  if (isCorrectLength) {
    return true;
  }
  
  return false;
};

export default isSalesforceRecordId;