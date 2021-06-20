import * as bcrypt from 'bcrypt';
import { sha3_256 } from 'js-sha3';
import { sha256 } from 'js-sha256';

const hash = (data: string, salt?: number) => {
    return bcrypt.hash(data, salt ?? 10);
}

const compare = (data: string, hash: string) => {
    return bcrypt.compare(data, hash)
}

const sha3 = (data:string): string => {
    const hash = sha3_256.create();
    hash.update(data)
    return hash.hex();
}

const sha_256 = (data: string): string => {
    const hash = sha256.create();
    hash.update(data);
    return hash.hex();
}

export {
    hash,
    compare,
    sha3,
    sha_256,
}