export interface ClientFlags {
  isSupport: boolean;
  hasVps: boolean;
  inASH: boolean;
  inPHX: boolean;
}

export class Client {
  name: string;
  whmcsID?: number;
  dcimID?: number;
  clientSince?: Date;

  flags: ClientFlags = {
    isSupport: false,
    hasVps: false,
    inASH: false,
    inPHX: false,
  };

  constructor(name: string, flags?: ClientFlags) {
    this.name = name;
    if (flags) this.flags = flags;
  }
}
