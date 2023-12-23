// deno-lint-ignore-file require-await no-unused-vars
export abstract class Migadu {
  constructor() {
    if (this.constructor == Migadu) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  public static async get(domain: string, localPart: string): Promise<Migadu> {
    throw new Error('Not implemented yet');
  }
  public static async list(domain: string): Promise<Migadu[]> {
    throw new Error('Not implemented yet');
  }
  public static async create(input: unknown): Promise<Migadu> {
    throw new Error('Not implemented yet');
  }
  public static async update(input: unknown): Promise<Migadu> {
    throw new Error('Not implemented yet');
  }
  public static async delete(
    domain: string,
    localPart: string,
  ): Promise<string> {
    throw new Error('Not implemented yet');
  }

  public get name(): string {
    throw new Error('Not implemented yet');
  }
  public get email(): string {
    throw new Error('Not implemented yet');
  }
}
