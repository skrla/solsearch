export type MetaDataAccount = {
  id: string;
  content$schema: string;
  json_uri: string;
  files?: any[];
  metadata: NFTMetadata;
  links?: { [key: string]: any };
  authorities?: NFTAuthority[];
  compression: NFTCompression;
  grouping: NFTGroup[];
  royalty: NFTRoyalty;
  creators: NFTCreator[];
  ownership: NFTOwnership;
  supply: NFTSupply | null;
  mutable: boolean;
  burnt: boolean;
};

type NFTMetadata = {
  attributes: NFTAttribute[] | undefined;
  description: string | undefined;
  name: string;
  symbol: string;
  tokenStandard: string | undefined;
};

type NFTAttribute = {
  trait_type: string;
  value: string;
};

type NFTAuthority = {
  address: string;
  scopes: string[];
};

type NFTCompression = {
  eligible: boolean;
  compressed: boolean;
  dataHash: string;
  creatorHash: string;
  assetHash: string;
  tree: string;
  seq: number;
  leafId: number;
};

type NFTGroup = {
  groupKey: string;
  groupValue: string;
};

type NFTRoyalty = {
  royaltyModel: string;
  target: string | null;
  percent: number;
  basisPoints: number;
  primarySaleHappened: boolean;
  locked: boolean;
};

type NFTCreator = {
  address: string;
  share: number;
  verified: boolean;
};

type NFTOwnership = {
  frozen: boolean;
  delegated: boolean;
  delegate: null;
  ownershipModel: string;
  owner: string;
};

type NFTSupply = {
  printMaxSupply: number;
  printCurrentSupply: number;
  editionNonce: null;
};
