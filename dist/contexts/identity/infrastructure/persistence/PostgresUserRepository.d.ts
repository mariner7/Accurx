import { User } from '../../domain/services/AuthService.js';
export declare class PostgresUserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    existsByEmail(email: string): Promise<boolean>;
    private mapToUser;
}
//# sourceMappingURL=PostgresUserRepository.d.ts.map