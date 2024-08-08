import type {
  FieldPacket,
  PoolConnection,
  QueryResult,
  ResultSetHeader,
} from "mysql2/promise";

import type { UserType } from "src/models/UserModel";
import type { CreateUserDTOType } from "src/dto/UserDTO";

interface IRepository {
  data: any;
  error: any;
}

interface IUserRepository {
  create(payload: CreateUserDTOType): Promise<IRepository>;
  findByEmail(email: string): Promise<IRepository>;
  findByID(id: number): Promise<IRepository>;
  updatePassword(id: number, password: string): Promise<IRepository>;
}

class UserRepository implements IUserRepository {
  private pool: PoolConnection;

  constructor(pool: PoolConnection) {
    this.pool = pool;
  }

  create = async (payload: CreateUserDTOType): Promise<IRepository> => {
    try {
      const { name, email, phone_number, password } = payload;
      const query: [QueryResult, FieldPacket[]] = await this.pool.execute(
        `INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)`,
        [name, email, phone_number, password],
      );
      const result = query[0] as ResultSetHeader;
      if (!result.insertId) {
        throw new Error("Failed to create user");
      }
      return { data: result.insertId, error: null };
    } catch (error) {
      console.error("Create User Error", error);
      return { data: null, error };
    }
  };

  findByEmail = async (email: string): Promise<IRepository> => {
    try {
      const query: [QueryResult, FieldPacket[]] = await this.pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );
      const result = query[0] as Array<UserType>;
      return { data: result, error: null };
    } catch (error) {
      console.error("Find By Email User Error", error);
      return { data: null, error };
    }
  };

  findByID = async (id: number): Promise<IRepository> => {
    try {
      const query: [QueryResult, FieldPacket[]] = await this.pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id],
      );
      const result = query[0] as Array<UserType>;
      return { data: result, error: null };
    } catch (error) {
      console.error("Find By ID User Error", error);
      return { data: null, error };
    }
  };

  updatePassword = async (
    id: number,
    password: string,
  ): Promise<IRepository> => {
    try {
      const query: [QueryResult, FieldPacket[]] = await this.pool.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [password, id],
      );
      const result = query[0] as ResultSetHeader;
      if (!result.affectedRows) {
        throw new Error("Failed to update password");
      }
      return { data: result.affectedRows, error: null };
    } catch (error) {
      console.error("Update Password User Error", error);
      return { data: null, error };
    }
  };
}

export default UserRepository;
