// REMOVE all real imports and initialization, only export mocks to avoid conflicts and double declaration errors

export const ai = {
  definePrompt: () => {},
  defineFlow: () => {}
};

export const z = {
  object: () => ({
    string: () => ({
      describe: () => ({})
    }),
    describe: () => ({})
  }),
  string: () => ({
    describe: () => ({})
  }),
  boolean: () => ({
    describe: () => ({})
  }),
  infer: <T>() => ({} as T)
};
