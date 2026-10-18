#!/usr/bin/env python3
"""Convenience root entrypoint runner for INVEYS production server."""
import sys
from pathlib import Path

server_dir = Path(__file__).resolve().parent / "server"
sys.path.insert(0, str(server_dir))

import serve

if __name__ == "__main__":
    serve.main()
