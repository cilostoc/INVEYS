#!/usr/bin/env python3
"""
INVEYS Administrator Management CLI Tool
Allows VPS administrators to create admin accounts, promote existing users,
reset passwords, and inspect registered users directly from the shell.
"""
import sys
import os
import argparse
import secrets
import time
from pathlib import Path

# Adjust path to import server modules
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / 'server'))

try:
    import serve
except ImportError:
    print("[!] Gagal mengimpor modul server/serve.py. Pastikan dijalankan dari root proyek INVEYS.")
    sys.exit(1)


def list_users():
    with serve.db() as c:
        users = c.execute('''
            SELECT id, email, name, plan, role, status, created_at
            FROM users
            ORDER BY created_at ASC
        ''').fetchall()
    
    if not users:
        print("\n[i] Belum ada pengguna yang terdaftar di database.")
        return

    print("\n" + "=" * 90)
    print(f"{'ID':<20} {'EMAIL':<28} {'NAMA':<20} {'ROLE':<8} {'PAKET':<8} {'STATUS':<8}")
    print("=" * 90)
    for u in users:
        u_id, email, name, plan, role, status, created_at = u
        print(f"{u_id:<20} {email:<28} {(name or ''):<20} {(role or 'user'):<8} {(plan or 'plus'):<8} {(status or 'active'):<8}")
    print("=" * 90)
    print(f"Total: {len(users)} pengguna terdaftar.\n")


def create_or_promote_admin(email, password=None, name=None, plan='ultra'):
    email_clean = email.strip().lower()
    if not email_clean or '@' not in email_clean:
        print("[!] Format email tidak valid.")
        return False

    with serve.db() as c:
        existing = c.execute('SELECT id, name, plan, role, status FROM users WHERE email = ?', (email_clean,)).fetchone()
        now = int(time.time())

        if existing:
            # Promote existing user
            u_id, cur_name, cur_plan, cur_role, cur_status = existing
            updates = []
            params = []
            
            updates.append("role = 'admin'")
            if plan:
                updates.append("plan = ?")
                params.append(plan)
            if name:
                updates.append("name = ?")
                params.append(name)
            if password:
                h, salt = serve.hash_password(password)
                updates.append("password_hash = ?, salt = ?")
                params.extend([h, salt])
            
            updates.append("status = 'active'")
            updates.append("updated_at = ?")
            params.extend([now, u_id])

            c.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", tuple(params))
            print(f"✅ Berhasil! Pengguna {email_clean} ({u_id}) telah dipromosikan menjadi ADMINISTRATOR.")
            return True
        else:
            # Create new admin user
            if not password or len(password) < 6:
                print("[!] Untuk pengguna baru, password wajib diisi (minimal 6 karakter).")
                return False

            u_id = 'usr_' + secrets.token_hex(8)
            h, salt = serve.hash_password(password)
            user_name = name or email_clean.split('@')[0].capitalize()
            c.execute('''
                INSERT INTO users (id, email, password_hash, salt, name, plan, role, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, 'admin', 'active', ?, ?)
            ''', (u_id, email_clean, h, salt, user_name, plan, now, now))
            
            print(f"✅ Akun Administrator baru berhasil dibuat:")
            print(f"   - ID: {u_id}")
            print(f"   - Email: {email_clean}")
            print(f"   - Nama: {user_name}")
            print(f"   - Peran: ADMINISTRATOR")
            print(f"   - Paket: {plan.upper()}")
            return True


def demote_user(email):
    email_clean = email.strip().lower()
    with serve.db() as c:
        existing = c.execute('SELECT id, role FROM users WHERE email = ?', (email_clean,)).fetchone()
        if not existing:
            print(f"[!] Pengguna {email_clean} tidak ditemukan.")
            return False
        
        # Check if only admin
        admin_count = c.execute('SELECT COUNT(*) FROM users WHERE role = "admin"').fetchone()[0]
        if admin_count <= 1 and existing[1] == 'admin':
            print("[!] Tindakan ditolak: Akun ini adalah satu-satunya administrator di server.")
            return False

        c.execute("UPDATE users SET role = 'user', updated_at = ? WHERE id = ?", (int(time.time()), existing[0]))
        print(f"✅ Status administrator untuk {email_clean} berhasil dicabut (sekarang berstatus User biasa).")
        return True


def reset_password(email, new_password):
    email_clean = email.strip().lower()
    if len(new_password) < 6:
        print("[!] Password baru minimal 6 karakter.")
        return False

    with serve.db() as c:
        existing = c.execute('SELECT id FROM users WHERE email = ?', (email_clean,)).fetchone()
        if not existing:
            print(f"[!] Pengguna {email_clean} tidak ditemukan.")
            return False

        h, salt = serve.hash_password(new_password)
        now = int(time.time())
        c.execute('UPDATE users SET password_hash=?, salt=?, updated_at=? WHERE id=?', (h, salt, now, existing[0]))
        # Invalidate active sessions
        c.execute('DELETE FROM sessions WHERE user_id = ?', (existing[0],))
        print(f"✅ Password untuk akun {email_clean} berhasil direset.")
        return True


def main():
    parser = argparse.ArgumentParser(description="INVEYS Administrator Management CLI")
    parser.add_argument('--list', action='store_true', help="Tampilkan daftar semua pengguna")
    parser.add_argument('--email', type=str, help="Email pengguna target")
    parser.add_argument('--password', type=str, help="Password untuk akun baru atau reset")
    parser.add_argument('--name', type=str, help="Nama lengkap pengguna")
    parser.add_argument('--plan', type=str, default='ultra', choices=['plus', 'pro', 'ultra', 'lifetime'], help="Paket lisensi akun (default: ultra)")
    parser.add_argument('--promote', type=str, help="Promosikan pengguna ke Administrator berdasarkan email")
    parser.add_argument('--demote', type=str, help="Turunkan Administrator ke User biasa berdasarkan email")
    parser.add_argument('--reset-password', type=str, help="Reset password pengguna berdasarkan email")

    args = parser.parse_args()

    if args.list:
        list_users()
        return

    if args.promote:
        create_or_promote_admin(args.promote, args.password, args.name, args.plan)
        return

    if args.demote:
        demote_user(args.demote)
        return

    if args.reset_password:
        if not args.password:
            print("[!] Harap sertakan --password <password_baru>")
            return
        reset_password(args.reset_password, args.password)
        return

    if args.email:
        create_or_promote_admin(args.email, args.password, args.name, args.plan)
        return

    # If no args given, show help and list users
    parser.print_help()
    print("\n[Daftar Pengguna Saat Ini:]")
    list_users()


if __name__ == '__main__':
    main()
