type providers = 'pinata';
type PinataConfig = {
    provider: 'pinata';
    jwt: string;
};
export declare class IPFS {
    private provider;
    private config;
    constructor(provider: providers, config: PinataConfig);
    upload(file: string, fileName: string): Promise<string>;
    uploadJson(json: object, fileName: string): Promise<string>;
}
export {};
