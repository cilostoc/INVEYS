"""Build a portable HTML application without network or dependencies."""
from pathlib import Path
import hashlib
import json

def build():
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    src_dir = project_root / "src"

    html = (src_dir / "index.html").read_text()
    css = (src_dir / "styles.css").read_text()
    # A downloadable app should have no external runtime dependency.
    css = "\n".join(line for line in css.splitlines() if not line.startswith("@import"))
    html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')

    for filename in (
        "engine.js", "finance.js", "investment.js", "appearance.js",
        "plans.js", "i18n.js", "recording.js", "releases.js",
        "assistant.js", "operations.js", "app.js"
    ):
        source = (src_dir / filename).read_text()
        html = html.replace(f'<script src="{filename}"></script>', '<script>\n' + source + '\n</script>')

    destination = project_root / "inveys-app.html"
    destination.write_text(html)

    # Recalculate checksum & update manifest
    new_hash = hashlib.sha256(destination.read_bytes()).hexdigest()
    manifest_files = [
        script_dir / "build-manifest.json",
        project_root / "build-manifest.json"
    ]
    for mf in manifest_files:
        try:
            m_data = {}
            if mf.exists():
                m_data = json.loads(mf.read_text())
            m_data.setdefault('version', '0.23.0')
            m_data.setdefault('files', {})['inveys-app.html'] = new_hash
            mf.write_text(json.dumps(m_data, indent=2) + '\n')
        except Exception:
            pass

    print(destination)
    return destination

if __name__ == "__main__":
    build()
