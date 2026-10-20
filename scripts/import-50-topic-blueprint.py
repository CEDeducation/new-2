"""Regenerate the precise roadmap from the user-provided 50-topic source.

Usage: python scripts/import-50-topic-blueprint.py docs/MASTER_BLUEPRINT_USER_SOURCE.md
The source is never fetched from an external site.
"""
import re, sys, html, json
from pathlib import Path
src = Path(sys.argv[1]).read_text(encoding='utf-8')
lines = src.splitlines()
rows = []
topic = None
tier = 1
subject = 'chemistry'
for raw in lines:
    l = html.unescape(raw.strip().rstrip('\\')).strip()
    if 'PART 2: VIRTUAL BIOLOGY LAB' in l:
        subject = 'biology'; tier = 1
    m = re.search(r'Tier\s+([1-4]):', l)
    if m: tier = int(m.group(1))
    m = re.match(r'•\s*(\d+)\.\s*(.*?):\s*$', l)
    if m:
        topic={'number':int(m.group(1)), 'title':m.group(2), 'subject':subject, 'grade':8 + tier, 'tier':tier, 'experience':'', 'objective':''}
        rows.append(topic)
    elif topic and '• The Visual Animation & UI:' in l:
        topic['experience'] = l.split('• The Visual Animation & UI:',1)[1].strip()
    elif topic and '• Core Learning Objective:' in l:
        topic['objective'] = l.split('• Core Learning Objective:',1)[1].strip()
    elif topic and l and not l.startswith(('• ', '🟡', '🔴','🟢','🟠','🧪','🧬','Structured ','Focuses ','Introduces ','Teaches ','Advanced ', 'Now that', 'To begin', 'Or should','This 50-topic')):
        # A few standalone formulas belong to the preceding experience text.
        if not topic['objective'] and l.startswith(('\\(', '\\[')):
            topic['experience'] += ' '+l
assert len(rows)==50 and [r['number'] for r in rows]==list(range(1,51)), 'Expected numbered 1-50'
assert len([r for r in rows if r['subject']=='chemistry'])==25
assert all(r['experience'] and r['objective'] for r in rows)
# The source definitions remain verbatim apart from decoding HTML entities and markup line-break slashes.
head='''/**\n * THE AUTHOR'S 50-TOPIC MASTER ROADMAP (source: uploaded Pasted markdown.md).\n * Topic titles, scenario descriptions, and learning outcomes retain the source wording.\n * Catalog presence is NOT evidence of a completed simulator.\n * Regenerate with scripts/import-50-topic-blueprint.py.\n */\nexport type RoadmapSubject = "chemistry" | "biology";\nexport type RoadmapTopic = { number: number; title: string; subject: RoadmapSubject; grade: number; tier: number; experience: string; objective: string };\nexport const MASTER_ROADMAP: RoadmapTopic[] = '''
text=head+json.dumps(rows,indent=2,ensure_ascii=False)+';\n'
Path(__file__).resolve().parent.parent.joinpath('components/junior/master-roadmap.ts').write_text(text,encoding='utf-8')
print(f'Imported {len(rows)} exact topic specifications, {len(text):,} chars.')
