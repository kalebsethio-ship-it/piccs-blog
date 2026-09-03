import urllib.request
import json
import os

url = os.environ.get("SUPABASE_URL", "https://owazkhgmoxtadoaytkpo.supabase.co")
key = os.environ.get("SUPABASE_SERVICE_KEY", "")
endpoint = f"{url}/rest/v1/piccs_images?select=*&limit=10"
req = urllib.request.Request(endpoint, headers={
    "apikey": key,
    "Authorization": f"Bearer {key}"
})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(json.dumps(data, indent=2))
except Exception as e:
    print("ERROR:", e)
