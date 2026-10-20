"""Build typed original lesson data from a deliberately easy-to-edit content file.

Each non-comment line is one chapter and exactly five educational concepts.
The content is independently authored NCERT-aligned revision material, not copied text.
"""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
items=[]
for index, line in enumerate((root/'content/chapters.txt').read_text(encoding='utf-8').splitlines(),1):
    if not line.strip() or line.startswith('#'): continue
    parts=line.split('|')
    if len(parts)!=6: raise ValueError(f'Line {index}: expected 6 fields')
    grade,subject,title,diagram,lab,facts=parts
    if lab == "-": lab = ""
    topics=[]
    for entry in facts.split('^'):
        bit=entry.split('~')
        if len(bit)!=3: raise ValueError(f'Line {index}: concept needs name~explanation~example')
        topics.append(dict(title=bit[0],explanation=bit[1],example=bit[2]))
    if len(topics)!=5: raise ValueError(f'Line {index}: 5 concepts required')
    items.append(dict(id=f'{grade}-{subject}-{len([x for x in items if x["grade"]==grade and x["subject"]==subject])+1:02}',grade=grade,subject=subject,title=title,diagram=diagram,lab=lab,topics=topics))
if len({x['id'] for x in items})!=len(items): raise ValueError('Duplicate chapter IDs')
(root/'components/junior/theory-data.ts').write_text('''/**
 * Original student-facing revision summaries, organised by 2026 NCERT chapter topics.
 * This is independent educational content, not an official NCERT publication.
 * Edit content/chapters.txt, then run python content/build-content.py to regenerate.
 */
export type TheorySubject = "chemistry" | "biology"
export type TheoryGrade = "9" | "10" | "11" | "12"
export type TheoryTopic = { title: string; explanation: string; example: string }
export type TheoryChapter = {
  id: string
  grade: TheoryGrade
  subject: TheorySubject
  title: string
  diagram: string
  lab: string
  topics: TheoryTopic[]
}
export const chapters: TheoryChapter[] = '''+json.dumps(items,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'content/chapters.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(items)} chapters; {sum(len(x["topics"]) for x in items)} concepts; {10*len(items)} generated quiz questions')
