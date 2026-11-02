import sys,re
target='src/lib/interactive-practices.ts'
s=open(target,encoding='utf-8').read()
for f in sys.argv[1:]:
    t=open(f,encoding='utf-8').read()
    m=re.search(r'export const NEW_PRACTICES(?:\s*:\s*[A-Za-z\[\]]+)?\s*=\s*\[',t)
    start=m.end(); end=t.rindex('];')
    body=t[start:end].strip('\n').rstrip().rstrip(',')+','
    ids=re.findall(r'\bid: "(IP-[A-Z0-9]+-\d{3})"',body)
    for i in ids: assert f'id: "{i}"' not in s,(i)
    idx=s.index('\n];\n', s.index('export const INTERACTIVE_PRACTICES'))
    s=s[:idx]+'\n'+body+s[idx:]
    print(f.split('/')[-1], ids)
open(target,'w',encoding='utf-8',newline='').write(s)
