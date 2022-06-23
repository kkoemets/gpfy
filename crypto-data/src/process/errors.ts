export const COULD_NOT_FIND_CONTRACT: () => Promise<never> = () =>
  Promise.reject(Error('Could not find contract'));

export const COULD_NOT_FIND_MARKETCAP: () => Promise<never> = () =>
  Promise.reject(Error('Could not find marketcap'));
