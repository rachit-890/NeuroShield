#!/bin/bash

BASE_URL="http://localhost:8080/api"
RAND=$RANDOM
USERNAME="testuser_$RAND"

echo "=== PHASE 1: REGISTRATION ($USERNAME) ==="
REG_RES=$(curl -s -D - -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$USERNAME@example.com\",
    \"password\": \"Password123!\",
    \"confirmPassword\": \"Password123!\"
  }")
echo "$REG_RES"

TOKEN=$(echo "$REG_RES" | grep -oP '"token":"\K[^"]+')

echo -e "\n=== PHASE 2: LOGIN ($USERNAME) ==="
LOGIN_RES=$(curl -s -D - -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"Password123!\"
  }")
echo "$LOGIN_RES"

if [ -z "$TOKEN" ]; then
  TOKEN=$(echo "$LOGIN_RES" | grep -oP '"token":"\K[^"]+')
fi

if [ -z "$TOKEN" ]; then
  echo "Error: Could not retrieve token from Registration or Login"
  exit 1
fi

echo -e "\n=== PHASE 3: GENERATE API KEY ==="
KEY_RES=$(curl -s -D - -X POST "$BASE_URL/keys" \
  -H "Authorization: Bearer $TOKEN")
echo "$KEY_RES"

# Fix: field name is rawKey
API_KEY=$(echo "$KEY_RES" | grep -oP '"rawKey":"\K[^"]+')
echo "Extracted API KEY: $API_KEY"

echo -e "\n=== PHASE 4: TEST ANALYTICS (JWT) ==="
curl -s -X GET "$BASE_URL/analytics/summary" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n=== PHASE 5: TEST API LOGGING (Using API Key) ==="
# Use -v to see the exchange
curl -s -X GET "$BASE_URL/analytics/top-users" \
  -H "X-API-KEY: $API_KEY"

echo -e "\n=== PHASE 6: CHECK SUSPICIOUS ACTIVITIES ==="
curl -s -X GET "$BASE_URL/analytics/suspicious" \
  -H "Authorization: Bearer $TOKEN"
