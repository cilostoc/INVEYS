"""Build a portable HTML application without network or dependencies."""
from pathlib import Path

root = Path(__file__).resolve().parent
html = (root / "index.html").read_text()
css = (root / "styles.css").read_text()
# A downloadable app should have no external runtime dependency.
css = "\n".join(line for line in css.splitlines() if not line.startswith("@import"))
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
for filename in ("engine.js", "finance.js", "investment.js", "appearance.js", "plans.js", "i18n.js", "recording.js", "releases.js", "assistant.js", "operations.js", "app.js"):
    source = (root / filename).read_text()
    html = html.replace(f'<script src="{filename}"></script>', '<script>\n' + source + '\n</script>')
destination = root / "inveys-app.html"
destination.write_text(html)
try:
    (root.parent / "inveys-app.html").write_text(html)
except Exception:
    pass
print(destination)
