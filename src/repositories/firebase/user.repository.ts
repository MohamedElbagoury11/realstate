import type { CreateUserInput, UpdateUserInput, User } from '@/types';
import type { UserRepository } from '@/repositories/interfaces/user.repository';
import { COLLECTIONS } from '@/lib/constants';
import { getAdminFirestore } from '@/providers/firebase/admin';
import { mapUserDoc } from './mappers';

export class FirebaseUserRepository implements UserRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.users);
  }

  async getById(id: string): Promise<User | null> {
    const snap = await this.collection().doc(id).get();
    if (!snap.exists) return null;
    return mapUserDoc(snap.id, snap.data()!);
  }

  async getByEmail(email: string): Promise<User | null> {
    const snap = await this.collection().where('email', '==', email).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0]!;
    return mapUserDoc(doc.id, doc.data());
  }

  async getAll(): Promise<User[]> {
    const snap = await this.collection().orderBy('createdAt', 'desc').get();
    return snap.docs.map((d) => mapUserDoc(d.id, d.data()));
  }

  async getByRole(role: User['role']): Promise<User[]> {
    const snap = await this.collection().where('role', '==', role).get();
    return snap.docs.map((d) => mapUserDoc(d.id, d.data()));
  }

  async create(id: string, data: CreateUserInput): Promise<void> {
    const now = new Date().toISOString();
    await this.collection().doc(id).set({
      ...data,
      approved: data.approved ?? data.role !== 'seller',
      createdAt: now,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<void> {
    await this.collection().doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }
}
