/**
 * Google Apps Script: custom function to compute a deterministic token for a group name.
 *
 * Usage in Sheets:
 * 1. Open the spreadsheet, Extensions → Apps Script
 * 2. Create a new script file and paste this code (or paste this file's content)
 * 3. Save the project. In the sheet, add a column header `Token` and in the first row
 *    with data use: =TOKEN_FOR_GROUP(<cell_with_group_name>) and drag down.
 *
 * The function returns the first 12 hex characters of SHA-256(groupName).
 */

function TOKEN_FOR_GROUP(name) {
  if (name === undefined || name === null) return '';
  var s = String(name);
  // Compute SHA-256 digest as bytes
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s);

  // Convert bytes to hex string
  var hex = digest.map(function(b) {
    var v = b;
    if (v < 0) v += 256;
    var h = v.toString(16);
    return (h.length === 1) ? ('0' + h) : h;
  }).join('');

  // Return short token (first 12 chars)
  return hex.substring(0, 12);
}

/** Optional helper to fill the Token column for the active sheet.
 * It will look for a column named "Group" or "grupo" (case-insensitive)
 * and write tokens into a column named "Token" (creating it if missing).
 * Run from the Apps Script editor: select function fillTokenColumn and click ▶️
 */
function fillTokenColumn() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var groupCol = -1;
  for (var i = 0; i < header.length; i++) {
    var h = String(header[i]).toLowerCase();
    if (h === 'group' || h === 'grupo' || h === 'family' || h === 'familia') {
      groupCol = i + 1; break;
    }
  }
  if (groupCol === -1) {
    SpreadsheetApp.getUi().alert('No se encontró columna "Group"/"Grupo" en la hoja.');
    return;
  }

  var tokenCol = -1;
  for (var j = 0; j < header.length; j++) {
    var h2 = String(header[j]).toLowerCase();
    if (h2 === 'token') { tokenCol = j + 1; break; }
  }
  if (tokenCol === -1) {
    tokenCol = header.length + 1;
    sheet.getRange(1, tokenCol).setValue('Token');
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var groupVals = sheet.getRange(2, groupCol, lastRow - 1, 1).getValues();
  var out = [];
  for (var r = 0; r < groupVals.length; r++) {
    var g = groupVals[r][0];
    if (!g) out.push(['']);
    else out.push([TOKEN_FOR_GROUP(g)]);
  }
  sheet.getRange(2, tokenCol, out.length, 1).setValues(out);
}
