const SHEET_NAME = 'RSVP Responses';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.website) return jsonResponse({ ok: true });
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Missing sheet: ${SHEET_NAME}`);
    sheet.appendRow([
      new Date(),
      String(data.name || ''),
      Number(data.guests || 0),
      String(data.attendance || ''),
      String(data.requirements || '')
    ]);
    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
