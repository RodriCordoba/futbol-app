import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser = signal<User | null>(null);
  public isAdmin = signal<boolean>(false);

  constructor(private supabase: SupabaseService) {
    this.checkSession();
  }

  async checkSession() {
    const { data: { session } } = await this.supabase.client.auth.getSession();
    this.currentUser.set(session?.user ?? null);
    if (session?.user) {
      await this.loadRole(session.user.id);
    }
  }

  async loadRole(userId: string) {
    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('rol')
      .eq('id', userId)
      .single();

    if (!error && data?.rol === 'admin') {
      this.isAdmin.set(true);
    } else {
      this.isAdmin.set(false);
    }
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    this.currentUser.set(data.user);
    await this.loadRole(data.user.id);
    return data;
  }

  async signOut() {
    await this.supabase.client.auth.signOut();
    this.currentUser.set(null);
    this.isAdmin.set(false);
  }
}