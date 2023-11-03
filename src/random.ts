import crypto from "crypto";

class Random {
    /**
     * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
     * @param {number} origin the least value that can be returned
     * @param {number} bound the upper bound (inclusive) for the returned value
     *
     * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
     * @throws IllegalArgumentException - if origin is greater than or equal to bound
     */
    public nextInt(origin?: number, bound?: number): number{
        if (origin === undefined || bound === undefined){
            if (origin != undefined) {bound = origin; origin = 0;}
            else{
                const num = Math.random();
                return num > 0.5 ? 1 : 0;
            }
        }
        return Math.floor(Math.random() * (bound - origin + 1)) + origin;
    }

    public string(length?: number): string{
        const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (!length) length = 16;
        return Array.from(crypto.randomFillSync(new Uint8Array(length)))
            .map((n) => S[n % S.length])
            .join("");
    }

    public UUID(): string{
        return crypto.randomUUID();
    }

    /**
     * Random choices from given Array
     * @param {Array<T>} list
     * @returns T
     */
    public randomChoice<T>(list: T[]): T{
        return list[this.nextInt(0, list.length - 1)];
    }
}

export { Random };
