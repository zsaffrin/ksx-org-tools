const isSalesforceRecordId = (stringToEvaluate: string | null) => {
  const isCorrectLength = stringToEvaluate?.length == 15 || stringToEvaluate?.length == 18 || false;

  if (isCorrectLength) {
    return true;
  }
  
  return false;
};

export default isSalesforceRecordId;