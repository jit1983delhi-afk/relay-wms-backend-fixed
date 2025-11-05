#!/bin/bash
BASE="https://relay-wms-backend-fixed.onrender.com"

echo "🚀 Starting user registration process for TWBP Warehouses..."
echo "----------------------------------------------------------"

declare -a USERS=(
'{"name":"Bengaluru","email":"twbpblr@gmail.com","password":"blrtwbp@2025","role":"warehouse","whid":"BLR"}'
'{"name":"Bhiwandi","email":"bhoir.vijay@gmail.com","password":"bwdntwbp@2025","role":"warehouse","whid":"BWDN"}'
'{"name":"Chennai","email":"vdillibabu001@gmail.com","password":"chntwbp@2025","role":"warehouse","whid":"CHN"}'
'{"name":"Gurgaon","email":"hareramthakur91@gmail.com","password":"ggntwbp@2025","role":"warehouse","whid":"GGN"}'
'{"name":"Hyderabad","email":"twbp.phyderabad123@gmail.com","password":"hydtwbp@2025","role":"warehouse","whid":"HYD"}'
'{"name":"Kolkata","email":"bikashghosh2916@gmail.com","password":"koltwbp@2025","role":"warehouse","whid":"KOL"}'
'{"name":"Lucknow","email":"gauravlkohcl@gmail.com","password":"lkotwbp@2025","role":"warehouse","whid":"LKO"}'
'{"name":"Patna","email":"patna.bm@relayexpress.in","password":"pattwbp@2025","role":"warehouse","whid":"PAT"}'
'{"name":"Noida","email":"noidarelay@gmail.com","password":"noitwbp@2025","role":"warehouse","whid":"NOI"}'
'{"name":"TWBP Admin","email":"admin@twbpinternational.com","password":"admintwbp@2025","role":"admin","whid":"ADMIN"}'
)

for USER in "${USERS[@]}"; do
  echo "➡️ Registering user: $(echo $USER | jq -r .email)"
  curl -s -X POST "$BASE/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "$USER" \
    -o /tmp/response.json

  if grep -q "success" /tmp/response.json; then
    echo "✅ Successfully registered: $(echo $USER | jq -r .email)"
  else
    echo "⚠️ Warning: Could not register $(echo $USER | jq -r .email)"
    cat /tmp/response.json
  fi
  echo "----------------------------------------------------------"
done

echo "🎯 All users processed."
