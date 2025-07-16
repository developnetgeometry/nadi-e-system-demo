import json
import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import CardConnectionException

load_dotenv()
allowed_origin = os.getenv("API_ORIGIN", "http://localhost:8080").strip()

print("Loaded origin:", repr(allowed_origin))  # repr() shows invisible characters if any

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": allowed_origin}})

# MyKad specific APDUs
SELECT_APDU = [0x00, 0xA4, 0x04, 0x00, 0x0A, 0xA0, 0x00, 0x00, 0x00, 0x74, 0x4A, 0x50, 0x4E, 0x00, 0x10]
GET_RESPONSE_APDU = [0x00, 0xC0, 0x00, 0x00, 0x05]
SET_LENGTH_APDU = [0xC8, 0x32, 0x00, 0x00, 0x05, 0x08, 0x00, 0x00]
SELECT_FILE_APDU = [0xCC, 0x00, 0x00, 0x00, 0x08]
GET_DATA_APDU = [0xCC, 0x06, 0x00, 0x00]
FILE_LENGTHS = [0, 459, 4011, 1227, 171, 43, 43, 0]

FIELD_OFFSETS = {
    "name": (0x03, 0x28),
    "first_name": (0x99, 30),
    "last_name": (0xB7, 20),
    "ic": (0x111, 13),
    "sex": (0x11E, 1),
    "old_ic": (0x11F, 8),
    "dob": (0x127, 4),
    "state_of_birth": (0x12B, 25),
    "validity_date": (0x144, 4),
    "nationality": (0x148, 18),
    "race": (0x15A, 25),
    "religion": (0x173, 11)
}

ADDRESS_OFFSETS = {
    "line1": (0x03, 30),
    "line2": (0x03 + 30, 30),
    "line3": (0x03 + 60, 30),
    "postcode": (0x5D, 3),
    "city": (0x60, 25),
    "state": (0x79, 30)
}

def send_apdu(connection, apdu):
    return connection.transmit(apdu)

def safe_decode(data):
    return data.decode('utf-8', errors='ignore').strip()

def date_string(data):
    return f"{data[0]:02x}{data[1]:02x}-{data[2]:02x}-{data[3]:02x}"

def postcode_string(data):
    return f"{data[0]:02x}{data[1]:02x}{data[2]:02x}"[:5]

def read_data(connection, file_no, offset, length):
    set_len_apdu = SET_LENGTH_APDU + [length & 0xFF, (length >> 8) & 0xFF]
    select_file_apdu = SELECT_FILE_APDU + [
        file_no & 0xFF, (file_no >> 8) & 0xFF, 0x01, 0x00,
        offset & 0xFF, (offset >> 8) & 0xFF,
        length & 0xFF, (length >> 8) & 0xFF
    ]
    read_info_apdu = GET_DATA_APDU + [length & 0xFF]

    send_apdu(connection, set_len_apdu)
    send_apdu(connection, select_file_apdu)
    data, _, _ = send_apdu(connection, read_info_apdu)
    return bytes(data)

def scan_mykad(debug=False):
    try:
        r = readers()
        if not r:
            return {"status": "error", "message": "No reader found", "data": {}}

        connection = r[0].createConnection()
        connection.connect()

        data, sw1, sw2 = send_apdu(connection, SELECT_APDU)
        if sw1 == 0x61:
            send_apdu(connection, GET_RESPONSE_APDU)

        if sw1 not in [0x90, 0x61]:
            return {"status": "error", "message": "Failed to select JPN application", "data": {}}

        mykad_data = {}
        for file_num in [1, 4]:
            file_data = b''
            for split_offset in range(0, FILE_LENGTHS[file_num], 252):
                chunk_len = min(252, FILE_LENGTHS[file_num] - split_offset)
                file_data += read_data(connection, file_num, split_offset, chunk_len)

            if debug:
                print(f"\nFile {file_num} Hex Dump:\n", file_data.hex(" "))

            if file_num == 1:
                for key, (start, length) in FIELD_OFFSETS.items():
                    if key in ["dob", "validity_date"]:
                        mykad_data[key] = date_string(file_data[start:start+length])
                    elif key == "postcode":
                        mykad_data[key] = postcode_string(file_data[start:start+length])
                    elif key == "sex":
                        code = file_data[start]
                        mykad_data[key] = "Female" if code == ord('P') else "Male" if code == ord('L') else chr(code)
                    else:
                        mykad_data[key] = safe_decode(file_data[start:start+length])
            elif file_num == 4:
                mykad_data["address"] = {
                    k: safe_decode(file_data[start:start+length]) if k != "postcode" else postcode_string(file_data[start:start+length])
                    for k, (start, length) in ADDRESS_OFFSETS.items()
                }

        return {
            "status": "success",
            "message": "Smart card scanned successfully.",
            "data": mykad_data
        }

    except CardConnectionException as e:
        return {"status": "error", "message": str(e), "data": {}}
    except Exception as e:
        return {"status": "error", "message": str(e), "data": {}}
    finally:
        try:
            connection.disconnect()
        except:
            pass

@app.route('/api/mykad-reader')
def mykad_reader():
    result = scan_mykad(debug=False)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
