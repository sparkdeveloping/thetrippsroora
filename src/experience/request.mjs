// AbortController composition supports the same older modern browsers as Next.js.
export async function postInvitationApi(path, body, { signal, fetcher = fetch, timeout = 12000 } = {}) {
  const controller = new AbortController(), abort = () => controller.abort();
  if (signal?.aborted) controller.abort(); else signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, timeout);
  try {
    const response = await fetcher(`/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal, cache: 'no-store' });
    let result;
    try { result = await response.json(); } catch { throw Error('The service is temporarily unavailable. Please try again.'); }
    if (!response.ok) throw Error(result.error || 'Unable to complete your request.');
    return result;
  } catch (error) {
    if (error instanceof TypeError) throw Error('Unable to connect. Check your connection and try again.');
    throw error;
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
