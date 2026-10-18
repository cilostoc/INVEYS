#!/usr/bin/env python3
"""Convenience root entrypoint runner for INVEYS build script."""
import sys
from pathlib import Path

scripts_dir = Path(__file__).resolve().parent / "scripts"
sys.path.insert(0, str(scripts_dir))

import build

if __name__ == "__main__":
    build.build()
