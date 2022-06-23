export interface BscscanApi {
  findHolders: ({
    bscContract,
  }: {
    bscContract: string;
  }) => Promise<{ holdersAmount: string }>;
}
