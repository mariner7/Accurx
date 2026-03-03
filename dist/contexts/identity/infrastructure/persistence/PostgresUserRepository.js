import { pool } from '../../../../infrastructure/database/connection.js';
export class PostgresUserRepository {
    async save(user) {
        const query = `
      INSERT INTO users (id, email, password_hash, role, patient_id, doctor_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        patient_id = EXCLUDED.patient_id,
        doctor_id = EXCLUDED.doctor_id,
        updated_at = EXCLUDED.updated_at
    `;
        const values = [
            user.id,
            user.email,
            user.passwordHash,
            user.role,
            user.patientId || null,
            user.doctorId || null,
            new Date(),
            new Date()
        ];
        await pool.query(query, values);
    }
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapToUser(result.rows[0]);
    }
    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapToUser(result.rows[0]);
    }
    async existsByEmail(email) {
        const query = 'SELECT 1 FROM users WHERE email = $1 LIMIT 1';
        const result = await pool.query(query, [email]);
        return result.rows.length > 0;
    }
    mapToUser(row) {
        return {
            id: row.id,
            email: row.email,
            passwordHash: row.password_hash,
            role: row.role,
            patientId: row.patient_id || undefined,
            doctorId: row.doctor_id || undefined
        };
    }
}
//# sourceMappingURL=PostgresUserRepository.js.map