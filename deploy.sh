#!/bin/bash
# Stamps the current month/year into content.json, then deploys to Firebase.
# Usage: ./deploy.sh

python3 - <<'EOF'
import json, datetime
with open('content.json', 'r') as f:
    data = json.load(f)
data['lastUpdated'] = datetime.datetime.now().strftime('%B %Y')
with open('content.json', 'w') as f:
    json.dump(data, f, indent=2)
print(f"lastUpdated set to: {data['lastUpdated']}")
EOF

firebase deploy
