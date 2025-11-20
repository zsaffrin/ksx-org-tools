interface ToggleFunction {
  (val?: boolean): void,
}
type AppStateContextType = {
  isUnpackagedOrg?: boolean,
  toggleUnpackagedOrg?: ToggleFunction,
};

export {
  AppStateContextType,
};