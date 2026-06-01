import os
import re

files = [
    'database-management.html',
    'graphic-design.html',
    'system-building.html',
    'ui-ux-design.html'
]

nav_logo_old = '      <a href="index.html" class="nav-logo" aria-label="Cworks home">\n        <span class="nav-logo-icon" aria-hidden="true">\n          <img src="logo-icon.svg" alt="Cworks" class="nav-logo-img"/>\n        </span>\n        Cworks\n      </a>'

nav_logo_new = '      <a href="index.html" class="nav-logo" aria-label="Cworks home">\n        <img src="logo-icon.svg" alt="Cworks" class="nav-logo-img" style="width: 32px; height: 32px; object-fit: cover;"/>\n        Cworks\n      </a>'

nav_old = '      <ul class="nav-links" role="list">\n        <li><a href="#includes" class="nav-link">What\'s Included</a></li>\n        <li><a href="#process"  class="nav-link">Process</a></li>\n        <li><a href="#pricing"  class="nav-link">Pricing</a></li>\n        <li><a href="#contact"  class="nav-link">Contact</a></li>\n      </ul>\n\n      <div class="nav-actions">\n        <button class="hamburger" id="hamburger" aria-label="Toggle mobile menu" aria-expanded="false">\n          <span></span>\n          <span></span>\n          <span></span>\n        </button>\n      </div>'

nav_new = '      <div class="nav-links-wrapper">\n        <ul class="nav-links" role="list">\n          <li><a href="#includes" class="nav-link">What\'s Included</a></li>\n          <li><a href="#process"  class="nav-link">Process</a></li>\n          <li><a href="#pricing"  class="nav-link">Pricing</a></li>\n          <li><a href="#contact"  class="nav-link">Contact</a></li>\n        </ul>\n      </div>'

footer_old = '        <div>\n          <div class="footer-logo">\n            <a href="index.html" class="footer-logo-link" aria-label="Back to Cworks home">\n              <span class="footer-logo-icon" aria-hidden="true">\n                <i class="fa-solid fa-code" style="color:#fff; font-size:0.8rem;"></i>\n              </span>\n              Cworks\n            </a>\n          </div>\n          <p class="footer-tagline">We Build. We Ship.</p>\n        </div>'

footer_new = '        <div>\n          <a href="index.html" class="footer-logo-link" aria-label="Back to Cworks home">\n            <img src="logo-icon.svg" alt="Cworks" style="width: 32px; height: 32px; object-fit: cover;"/>\n            Cworks\n          </a>\n          <p class="footer-tagline">We Build. We Ship.</p>\n          <p class="footer-origin">Proudly built in Kampala, Uganda</p>\n        </div>'

footer_copy_old = 'Built with \xb7 HTML \xb7 CSS \xb7 JavaScript &nbsp;\xb7&nbsp;\n        <a href="index.html" style="color: var(--accent); text-decoration: none;">\u2190 Back to Cworks</a>'
footer_copy_new = 'Built with \xb7 HTML \xb7 CSS \xb7 JavaScript'

for fname in files:
    path = os.path.join(r'd:\Projects\website', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace(nav_logo_old, nav_logo_new)
    content = content.replace(nav_old, nav_new)
    content = content.replace(footer_old, footer_new)
    content = content.replace(footer_copy_old, footer_copy_new)

    mobile_menu_pattern = r'\n\s*<!-- Mobile menu -->.*?</div>\n?'
    content = re.sub(mobile_menu_pattern, '\n', content, flags=re.DOTALL)

    typing_pattern = r'\n\s*<script>\s*\n\s*window\._typingOverride.*?</script>\n?'
    content = re.sub(typing_pattern, '\n', content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed structure: {fname}')
