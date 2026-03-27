export async function onRequest(context) {
  const APPS_SCRIPT_URL = "TU_URL_DE_APPS_SCRIPT";

  try {
    const request = context.request;
    const url = new URL(request.url);

    if (request.method === "GET") {
      const action = url.searchParams.get("action") || "";

      const targetUrl = new URL(APPS_SCRIPT_URL);
      targetUrl.searchParams.set("action", action);

      const response = await fetch(targetUrl.toString(), {
        method: "GET"
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      const targetUrl = new URL(APPS_SCRIPT_URL);

      // 🔴 AQUÍ ESTÁ LA CLAVE
      Object.keys(body).forEach(key => {
        targetUrl.searchParams.set(key, body[key]);
      });

      const response = await fetch(targetUrl.toString(), {
        method: "GET"
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response("Método no permitido", { status: 405 });

  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: true,
      message: String(error)
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
