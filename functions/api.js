export async function onRequest(context) {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbTqsFn3OhRdYo24PJGvR5D2nL_nsmHtHazeh1DwI2cexcWbwTuEpTfuajMVkMcgbS/exec".trim();

  try {
    const request = context.request;
    const incomingUrl = new URL(request.url);

    if (request.method === "GET") {
      const queryString = incomingUrl.searchParams.toString();
      const target = queryString
        ? `${APPS_SCRIPT_URL}?${queryString}`
        : APPS_SCRIPT_URL;

      const response = await fetch(target, {
        method: "GET",
        redirect: "follow"
      });

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "POST") {
      const body = await request.json();

      const params = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const target = queryString
        ? `${APPS_SCRIPT_URL}?${queryString}`
        : APPS_SCRIPT_URL;

      const response = await fetch(target, {
        method: "GET",
        redirect: "follow"
      });

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      });
    }

    return new Response(JSON.stringify({
      ok: false,
      error: true,
      message: "Método no permitido"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: true,
      message: String(error),
      appsScriptUrl: APPS_SCRIPT_URL
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
}
