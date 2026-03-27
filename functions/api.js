const RAW_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbTqsFn3OhRdYo24PJGvR5D2nL_nsmHtHazeh1DwI2cexcWbwTuEpTfuajMVkMcgbS/exec";

function getCleanUrl() {
  return RAW_APPS_SCRIPT_URL
    .replace(/[^\x21-\x7E]/g, "") // quita caracteres invisibles
    .trim();
}

export async function onRequest(context) {
  const request = context.request;
  const incomingUrl = new URL(request.url);
  const action = incomingUrl.searchParams.get("action") || "";

  try {
    const APPS_SCRIPT_URL = getCleanUrl();

    // Ruta de diagnóstico
    if (action === "debug") {
      return new Response(JSON.stringify({
        ok: true,
        raw: RAW_APPS_SCRIPT_URL,
        clean: APPS_SCRIPT_URL,
        same: RAW_APPS_SCRIPT_URL === APPS_SCRIPT_URL,
        rawLength: RAW_APPS_SCRIPT_URL.length,
        cleanLength: APPS_SCRIPT_URL.length
      }), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "GET") {
      const qs = incomingUrl.searchParams.toString();
      const target = qs ? `${APPS_SCRIPT_URL}?${qs}` : APPS_SCRIPT_URL;

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

      const qs = params.toString();
      const APPS_SCRIPT_URL = getCleanUrl();
      const target = qs ? `${APPS_SCRIPT_URL}?${qs}` : APPS_SCRIPT_URL;

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
      message: String(error)
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
}
