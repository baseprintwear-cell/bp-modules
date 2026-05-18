// ============================================================
//  BP Kids — Upload Figurinha Copa 26
//  Google Apps Script — Web App V3
//  Lê dados via e.parameter (URLSearchParams do browser)
// ============================================================

var PASTA_ID = '17I-ZnFIXiAYgdHjXaNhYh8rpPuQoiL60';

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'BP Figurinha GAS V3 ativo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Aceita dados de qualquer formato: e.parameter (form-urlencoded) ou e.postData.contents (JSON)
    var dados = {};
    if (e.parameter && e.parameter.foto) {
      dados = e.parameter;
    } else if (e.postData && e.postData.contents) {
      dados = JSON.parse(e.postData.contents);
    } else {
      return _resp({ ok: false, erro: 'Nenhum dado recebido' });
    }

    var base64   = dados.foto;
    var nome     = (dados.nome   || 'SEM_NOME').toString().replace(/[^a-zA-Z0-9_\-]/g, '_');
    var pedido   = (dados.pedido || 'PENDENTE').toString().replace(/[^a-zA-Z0-9_\-]/g, '_');
    var mimeType = dados.tipo    || 'image/jpeg';

    if (!base64) return _resp({ ok: false, erro: 'Foto vazia' });

    var bytes   = Utilities.base64Decode(base64);
    var blob    = Utilities.newBlob(bytes, mimeType,
                    'FIGURINHA_' + pedido + '_' + nome + '.jpg');
    var pasta   = DriveApp.getFolderById(PASTA_ID);
    var arquivo = pasta.createFile(blob);
    arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return _resp({ ok: true, link: arquivo.getUrl(), id: arquivo.getId() });
  } catch(err) {
    return _resp({ ok: false, erro: err.toString() });
  }
}

function _resp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
