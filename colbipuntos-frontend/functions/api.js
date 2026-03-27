export async function onRequest(context) {
  const APPS_SCRIPT_URL = "https://script.google.com/a/macros/humbertoquintero.com/s/AKfycbwbTqsFn3OhRdYo24PJGvR5D2nL_nsmHtHazeh1DwI2cexcWbwTuEpTfuajMVkMcgbS/exec";

  try {
    const request = context.request;
    const url = new URL(request.url);

    if (request.method === "GET") {
      const action = url.searchParams.get("action") || "";

      const targetUrl = new URL(APPS_SCRIPT_URL);
      targetUrl.searchParams.set("action", action);

      const response = await fetch(targetUrl.toString(), {
        method: "GET",
        redirect: "follow"
      });

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (request.method === "POST") {
      const body = await request.text();

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body,
        redirect: "follow"
      });

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
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
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }
}