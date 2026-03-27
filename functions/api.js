export async function onRequest(context) {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbTqsFn3OhRdYo24PJGvR5D2nL_nsmHtHazeh1DwI2cexcWbwTuEpTfuajMVkMcgbS/exec";

  try {
    const request = context.request;
    const url = new URL(request.url);

    if (request.method === "GET") {
      const targetUrl = new URL(APPS_SCRIPT_URL);

      // 🔴 copiar TODOS los parámetros correctamente
      url.searchParams.forEach((value, key) => {
        if (value !== undefined && value !== null && value !== "") {
          targetUrl.searchParams.set(key, value);
        }
      });

      const response = await fetch(targetUrl.toString());

      const text = await response.text();

      return new Response(text, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (request.method === "POST") {
      const body = await request.json();
      const targetUrl = new URL(APPS_SCRIPT_URL);

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          targetUrl.searchParams.set(key, String(value));
        }
      });

      const response = await fetch(targetUrl.toString());
      const text = await response.text();

      return new Response(text, {
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
