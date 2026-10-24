#!/usr/bin/env python3
"""Export the active INVEYS SQLite workspace to a local JSON file for direct browser import."""
import json
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path.home() / ".inveys" / "inbox.sqlite3"
DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / "inveys-workspace-current.json"

def export_workspace(db_path=DB_PATH, output_file=DEFAULT_OUTPUT):
    if not db_path.exists():
        print(f"Error: Database not found at {db_path}", file=sys.stderr)
        return False

    con = sqlite3.connect(str(db_path))
    cur = con.cursor()
    row = cur.execute("SELECT data, checksum, updated_at FROM workspaces ORDER BY updated_at DESC LIMIT 1").fetchone()
    if not row:
        print("Error: No workspace record found in database.", file=sys.stderr)
        return False

    raw_json = row[0]
    ws = json.loads(raw_json)
    output_file.write_text(json.dumps(ws, indent=2))
    print(f"Workspace '{ws.get('name')}' exported successfully:")
    print(f"  Destination : {output_file}")
    print(f"  Transactions: {len(ws.get('transactions', []))}")
    print(f"  Accounts    : {len(ws.get('accounts', []))}")
    print(f"  Debts       : {len(ws.get('debts', []))}")
    print(f"  Updated at  : {row[2]}")
    return True

if __name__ == "__main__":
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    success = export_workspace(output_file=out)
    sys.exit(0 if success else 1)
