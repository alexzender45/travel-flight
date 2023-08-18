import { config } from 'dotenv';
import { EnvironmentVariables } from './env.interface';

config();

export class EnvironmentService {
  public static getAll(): EnvironmentVariables {
    return {
      node_env: process.env.NODE_ENV,
      port: Number(process.env.PORT),
      api_key: process.env.API_KEY,
    };
  }

  public static getValue(key: string): string {
    return EnvironmentService.getAll()[key.toLocaleLowerCase()];
  }
}
