interface SingleParamQueryBuilderType {
  (param: string | null | undefined): string,
}
const useSOQLBuilder = () => {
  const getQueryForAssignmentsByEngagement: SingleParamQueryBuilderType = (engagementId) => {
    const soqlLines = [
      'SELECT',
      ' Id,',
      ' KimbleOne__ResourcedActivity__r.Name,',
      ' KimbleOne__ActivityAssignmentType__r.Name,',
      ' KimbleOne__Resource__r.Name,',
      ' KimbleOne__StartDate__c,',
      ' KimbleOne__ForecastP3EndDate__c',
      'FROM KimbleOne__ActivityAssignment__c',
      'WHERE',
      ` KimbleOne__ResourcedActivity__r.KimbleOne__DeliveryGroup__c = '${engagementId}'`,
      'ORDER BY',
      ' KimbleOne__ResourcedActivity__r.Name,',
      ' KimbleOne__Resource__r.Name,',
      ' KimbleOne__StartDate__c',
    ];

    return soqlLines.join('\n');
  };

  const getQueryForTimeEntriesByEngagement: SingleParamQueryBuilderType = (engagementId) => {
    const soqlLines = [
      'SELECT',
      ' Id,',
      ' KimbleOne__ActivityAssignment__r.KimbleOne__ResourcedActivity__r.Name,',
      ' KimbleOne__Resource__r.Name,',
      ' KimbleOne__TimePeriod__r.KimbleOne__StartDate__c,',
      ' KimbleOne__EntryUnits__c,',
      ' KimbleOne__Status__r.KimbleOne__Enum__c,',
      ' CreatedDate,',
      ' LastModifiedDate,',
      ' LastModifiedBy.Name',
      'FROM KimbleOne__TimeEntry__c',
      'WHERE',
      ` KimbleOne__ActivityAssignment__r.KimbleOne__ResourcedActivity__r.KimbleOne__DeliveryElement__r.KimbleOne__DeliveryGroup__c = '${engagementId}'`,
      'ORDER BY',
      ' KimbleOne__ActivityAssignment__r.KimbleOne__ResourcedActivity__r.Name,',
      ' KimbleOne__TimePeriod__r.KimbleOne__StartDate__c',
    ];

    return soqlLines.join('\n');
  };

  const getQueryForResourcePeriodsByResource: SingleParamQueryBuilderType = (resourceId) => {
    const soqlLines = [
      'SELECT',
      ' Id,',
      ' KimbleOne__TimePeriod__r.Name,',
      ' KimbleOne__TimePeriod__r.KimbleOne__PeriodType__r.Name,',
      ' KimbleOne__ForecastP1TrackedUsage__c,',
      ' KimbleOne__ExpectedHours__c,',
      ' KimbleOne__ActualUtilisationIncludedUsage__c,',
      ' KimbleOne__ActualUtilisationExcludedUsage__c,',
      ' KimbleOne__ActualUsage__c,',
      ' KimbleOne__ActualHours__c',
      'FROM KimbleOne__ResourcePeriod__c',
      'WHERE',
      ` KimbleOne__Resource__r.Name = '${resourceId}'`,
      'ORDER BY',
      ' KimbleOne__TimePeriod__r.KimbleOne__StartDate__c',
    ];

    return soqlLines.join('\n');
  };
  
  const getQueryForForecastingTimePeriodUnactualizedPA: SingleParamQueryBuilderType = (timePeriodId) => {
    const soqlLines = [
      'SELECT',
      ' Id,',
      ' KimbleOne__BusinessUnit__r.KimbleOne__BusinessUnitGroup__r.Name,',
      ' KimbleOne__DeliveryGroup__r.Name,',
      ' KimbleOne__DeliveryElement__r.Name,',
      ' KimbleOne__ResourcedActivity__r.Name,',
      ' KimbleOne__DomainClass__r.Name,',
      ' Kimbleone__AnalysisFact__r.Name,',
      ' Kimbleone__Resource__r.Name,',
      ' Kimbleone__Actual__c,',
      ' Kimbleone__ActualAmount__c,',
      ' KimbleOne__P3Forecast__c,',
      ' KimbleOne__P3ForecastAmount__c,',
      ' KimbleOne__P3Unactualised__c,',
      ' KimbleOne__P3UnactualisedAmount__c',
      'FROM KimbleOne__PerformanceAnalysis__c',
      'WHERE',
      ' KimbleOne__TimePeriodUnactualised__c IN (',
      `  SELECT KimbleOne__ForecastingTimePeriod__c FROM KimbleOne__TimePeriod__c WHERE Id = ${timePeriodId}`,
      ' )',
      ' AND (',
      "  (Kimbleone__AnalysisFact__r.name IN ('Cost','Revenue','RevenueInternal','CostInternal','ContractedValue')",
      '   AND (KimbleOne__P3Unactualised__c != 0 OR KimbleOne__P3Unactualised__c != null))',
      "  OR (Kimbleone__AnalysisFact__r.name IN ('ResourceUsage','FactoredResourceUsage')",
      '   AND (KimbleOne__P3UnactualisedAmount__c != 0 OR KimbleOne__P3UnactualisedAmount__c != null))',
      ' )',
      'ORDER BY KimbleOne__DeliveryElement__r.Name, KimbleOne__DeliveryGroup__c',
    ];

    return soqlLines.join('\n');
  };
  
  return ({
    getQueryForAssignmentsByEngagement,
    getQueryForTimeEntriesByEngagement,
    getQueryForResourcePeriodsByResource,
    getQueryForForecastingTimePeriodUnactualizedPA,
  });
};

export default useSOQLBuilder;
