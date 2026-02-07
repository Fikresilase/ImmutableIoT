# 🛡️ HydroGuard: IoT Integrity Simulation

HydroGuard is a sleek, visual simulation of a **Cyber-Physical System (CPS)**. It demonstrates how modern cryptography (Asymmetric ES256) protects critical infrastructure data from **Man-in- Man-in-the-Middle (MITM)** attacks.

## 🚀 Quick Start

Ensure you have [Bun](https://bun.sh) installed on your system.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fikresilase/immutableiot.git
   cd immutableiot
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Launch the simulation**
   ```bash
   bun run dev
   ```

4. **Open the dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ The Architecture

The application is divided into three distinct zones, representing the lifecycle of an IoT data packet:

### 📡 Zone A: The Edge Node (Sensor)
- **Action**: Simulates a water quality sensor measuring **pH** and **Temperature**.
- **Security**: Uses a simulated **Secure Element** storing an **Elliptic Curve Private Key (ES256)** to sign telemetry before transmission. This ensures data origin authenticity.

### 🌐 Zone B: The Network (Interceptor)
- **Action**: A "Network Interceptor" allowing for **Intercept Mode** toggling.
- **The Attack**: Simulates a network capture where "time pauses." You can view the raw JSON packet and perform **Unauthorized Payload Tampering** (e.g., changing pH 7.0 to 14.0) before injection.

### ☁️ Zone C: The Integrity Log (Cloud Verifier)
- **Action**: The server receives the packet and verifies the signature using the **Sensor's Public Key**.
- **Defense**: If the cryptographic hash check fails (due to tampering), the system triggers a **Fail-safe Lockdown**, rejecting the data to prevent physical damage to the CPS.

---

## 🔐 Device Identity Provisioning

In real-world industrial IoT (IIoT), Private Keys are injected during manufacturing into dedicated hardware (Secure Elements). In this simulation, static ES256 keys are stored in `src/lib/keys.ts` to emulate **Factory Provisioning** and maintain a persistent, verifiable device identity.

---

## 🧨 Threat Model

### Attacks Simulated:
- **Man-in-the-Middle (MITM)**: Interception and reading of sensitive telemetry.
- **Data Tampering**: Modification of sensor values to trick command-and-control logic.

### Security Properties Demonstrated:
- **Data Integrity**: Ensuring information has not been altered in transit.
- **Authentication**: Verifying the packet truly originated from Sensor SN-8392-AX.
- **Non-repudiation**: Digital signatures prevent the sensor from denying its own transmission.
- **Availability & Safety**: The system maintains a safe state by discarding "poisoned" data.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (Glassmorphism UI)
- **Animation**: Framer Motion (Real-time packet visualization)
- **Identity**: Asymmetric ECDSA (ES256) via `jose`

---

## 🎓 Presentation Guide (The "Wow" Moment)

1.  **Baseline Security**: Adjust pH to 7.0 and click **Sign & Transmit**. 
    - *Explain*: "The sensor signs the data using its provisioned private key. The cloud verifies it with the corresponding public key—Integrity check passed."
2.  **The Interception**: Toggle **Intercept Mode** and click **Sign & Transmit**.
    - *Explain*: "The packet is captured in the network. I have now compromised the confidentiality of the transmission link."
3.  **Active Tampering**: Change `"ph_value": 7.0` to `"ph_value": 14.0`.
    - *Explain*: "I am simulating an active attack on the data's integrity. I've modified the value to represent a toxic pH level."
4.  **System Defense**: Click **Inject Malicious Payload**.
    - *Explain*: "The verification logic detects that the signature no longer matches the modified payload. The system enters a fail-safe state, discarding the compromise to protect the city's water supply."

---

## 📄 License
MIT
