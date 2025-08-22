import axios from "axios";

const baseURL = process.env.OTP_WHATSAPP_BASEURL;
const apiKey = process.env.OTP_WHATSAPP_API_KEY;
const rawMobile = process.env.ADMIN_OTP_MOBILE;
const senderMode = (process.env.OTP_SENDER || "WHATSAPP").toUpperCase(); // WHATSAPP | MOCK
const timeoutMs = parseInt(process.env.OTP_TIMEOUT_MS || "12000", 10);

function normalizeMobile(m) {
  const digits = String(m || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("91")) return digits;
  if (digits.length === 10) return "91" + digits;
  return digits;
}

export async function sendOtpWhatsapp(otp) {
  if (senderMode === "MOCK") {
    console.info(`[OTP MOCK] Would send OTP "${otp}" to ${rawMobile}`);
    return { ok: true, mock: true };
  }

  if (!baseURL || !apiKey || !rawMobile) {
    const msg = "WhatsApp OTP config missing (OTP_WHATSAPP_BASEURL, OTP_WHATSAPP_API_KEY, ADMIN_OTP_MOBILE)";
    throw Object.assign(new Error(msg), { code: "CONFIG_MISSING" });
  }

  const mobile = normalizeMobile(rawMobile);
  const msg = `Your OTP for admin login is: ${otp}`;
  const params = { apikey: apiKey, mobile, msg };

  console.info("[WA SEND] baseURL=%s mobile=%s timeout=%sms mode=%s",
    baseURL, mobile, timeoutMs, senderMode);

  async function attempt() {
    try {
      const resp = await axios.get(baseURL, {
        params,
        timeout: timeoutMs,
        validateStatus: () => true,
        proxy: false, // important on Windows/corporate proxy
      });

      if (resp.status >= 200 && resp.status < 300) {
        const data = resp.data;
        if (data?.statuscode === 200 || String(data?.status).toLowerCase() === "success") return data;
        const err = new Error("WhatsApp API response indicates failure");
        err.response = { status: resp.status, data: resp.data };
        throw err;
      }
      const err = new Error(`WhatsApp API responded HTTP ${resp.status}`);
      err.response = { status: resp.status, data: resp.data };
      throw err;

    } catch (e) {
      const info = {
        message: e.message,
        code: e.code,
        status: e.response?.status,
        body: e.response?.data
      };
      throw Object.assign(new Error("WHATSAPP_SEND_FAILED"), { details: info });
    }
  }

  let lastErr;
  for (let i = 0; i < 2; i++) {
    try { return await attempt(); }
    catch (e) { lastErr = e; await new Promise(r => setTimeout(r, 600)); }
  }
  throw lastErr;
}
