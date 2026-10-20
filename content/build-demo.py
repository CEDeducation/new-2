"""Generate a no-dependency preview of the interactive Theory Atlas.
The production React TheoryAcademy uses the same chapters.json content.
"""
from pathlib import Path
root=Path(__file__).resolve().parent.parent
raw=(root/'content/chapters.json').read_text(encoding='utf-8')
(root/'demo/chapters-data.js').write_text('window.OPENLAB_LESSONS = '+raw+';\n',encoding='utf-8')
