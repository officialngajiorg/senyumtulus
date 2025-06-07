// Mock AI genkit module to prevent import errors
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
    describe: () => ({
      optional: () => ({})
    }),
    optional: () => ({})
  }),
  boolean: () => ({
    describe: () => ({})
  }),
  infer: <T>() => ({} as T)
};
