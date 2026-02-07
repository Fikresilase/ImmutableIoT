# 🛡️ HydroGuard: Immutable IoT Integrity

HydroGuard is a sleek, visual simulation of a **Cyber-Physical System (CPS)**. It demonstrates how modern cryptography (Asymmetric ES256) protects critical infrastructure data from **Man-in-the-Middle (MITM)** attacks.

![Dashboard Preview](public/preview.png) *(Note: Add a screenshot of your beautiful dashboard here!)*

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
- **Primary Goal**: Data Origin.
- **Action**: Simulates a water quality sensor measuring **pH** and **Temperature**.
- **Security**: Uses a simulated Hardware Security Module (HSM) with an **Elliptic Curve Private Key (ES256)** to sign telemetry before it ever leaves the device.

### 🌐 Zone B: The Network (Interceptor)
- **Primary Goal**: Interception simulation.
- **Action**: A "Network Interceptor" allows you to toggle **Intercept Mode**.
- **The Attack**: In this mode, "time pauses" inside the network. You can view the raw JSON packet and tamper with it (e.g., change pH 7.0 to 14.0) before injecting it back into the stream.

### ☁️ Zone C: The Immutable Ledger (Cloud)
- **Primary Goal**: Verification & Enforcement.
- **Action**: The server receives the packet and attempts to verify the signature using the **Sensor's Public Key**.
- **Defense**: If the math fails (because the hacker changed 1 byte of data but didn't have the Private Key to re-sign it), the system triggers a **"Lockdown"** and rejects the data.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun 
- **Styling**: Tailwind CSS 4 (Glassmorphism & Radial Gradients)
- **Animation**: Framer Motion (Path-based packet travel)
- **Identity**: Asymmetric ECDSA (ES256) via `jose`

---

## 🎓 Presentation Guide (The "Wow" Moment)

1.  **Start Clean**: Adjust the pH to 7.0 and click **Sign & Transmit**. 
    - *Explain*: "The blue dot is a cryptographically signed packet traveling securely to the cloud. The signature is valid, so the gauge updates."
2.  **The Intercept**: Turn on **Intercept Mode** and click **Sign & Transmit** again.
    - *Explain*: "The packet is now caught in the network. Notice the Cloud is still waiting; it has no idea the sensor tried to talk."
3.  **The Tamper**: In the interceptor terminal, change `"ph_value": 7.0` to `"ph_value": 14.0`.
    - *Explain*: "The hacker has changed the data. But they *cannot* re-sign it because the Private Key is locked in the sensor."
4.  **The Lockdown**: Click **Inject Malicious Payload**.
    - *Explain*: "The Cloud detects the signature mismatch. The math failed. It blocks the data, refuses to update the gauge, and triggers an Integrity Alert."

---

## 📄 License
MIT
