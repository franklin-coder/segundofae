import re

# Read the FAQ replacement content
with open('temp_faq_replacement.txt', 'r') as f:
    new_faq_content = f.read().strip()

# Fix contact-content.tsx
with open('components/pages/contact-content.tsx', 'r') as f:
    contact_content = f.read()

# Replace the faqs array in contact-content.tsx
contact_pattern = r'const faqs = \[\s*\{[^}]*\}(?:,\s*\{[^}]*\})*\s*\];'
contact_replacement = f'const faqs = [\n    {new_faq_content}\n  ];'

contact_content = re.sub(contact_pattern, contact_replacement, contact_content, flags=re.DOTALL)

with open('components/pages/contact-content.tsx', 'w') as f:
    f.write(contact_content)

# Fix app/faq/page.tsx
with open('app/faq/page.tsx', 'r') as f:
    faq_content = f.read()

# Replace the faqs array in faq page
faq_pattern = r'const faqs = \[\s*\{[^}]*\}(?:,\s*\{[^}]*\})*\s*\]'
faq_replacement = f'const faqs = [\n    {new_faq_content}\n  ]'

faq_content = re.sub(faq_pattern, faq_replacement, faq_content, flags=re.DOTALL)

with open('app/faq/page.tsx', 'w') as f:
    f.write(faq_content)

print("FAQ files updated successfully!")
