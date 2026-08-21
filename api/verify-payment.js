export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Missing payment reference" });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("PAYSTACK_SECRET_KEY is not set in this environment.");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await paystackRes.json();

    if (!data.status || !data.data) {
      console.error("Paystack verification rejected:", data.message || data);
      return res.status(200).json({ verified: false, reason: data.message || "unknown" });
    }

    if (data.data.status === "success") {
      return res.status(200).json({ verified: true, amount: data.data.amount / 100 });
    }

    return res.status(200).json({ verified: false, reason: data.data.status });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
}