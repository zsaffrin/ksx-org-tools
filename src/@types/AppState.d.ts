interface ToggleFunction {
  (val?: boolean): void,
}
type AppStateContextType = {
  isUnpackagedOrg?: boolean,
  toggleUnpackagedOrg?: ToggleFunction,
  showCopyLinks?: boolean,
  toggleShowCopyLinks?: ToggleFunction,
};

export {
  AppStateContextType,
};