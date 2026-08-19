import urllib.request
import json
import os

url = os.environ.get("SUPABASE_URL", "https://owazkhgmoxtadoaytkpo.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_KEY", "")
endpoint = f"{url}/rest/v1/piccs_research?id=eq.158"
data = json.dumps({"status": "written"}).encode()
req = urllib.request.Request(endpoint, data=data, headers={
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}, method='PATCH')
try:
    with urllib.request.urlopen(req) as resp:
        print('OK', resp.status)
except Exception as e:
    print('ERROR:', e)
