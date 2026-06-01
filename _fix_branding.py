import os

files = [
    'database-management.html',
    'graphic-design.html',
    'system-building.html',
    'ui-ux-design.html'
]

for fname in files:
    path = os.path.join(r'd:\Projects\website', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)
    content = content.replace('CodeHub', 'Cworks')
    content = content.replace('thecodehub26', 'thecworks26')
    content = content.replace('codehub26', 'cworks26')
    content = content.replace('data-theme="dark"', '')
    content = content.replace('#5227FF', '#dc2626')
    content = content.replace('Cworks.png', 'logo-icon.svg')
    content = content.replace('type="image/png" href="logo-icon.svg"', 'type="image/svg+xml" href="logo-icon.svg"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed branding: {fname}')
