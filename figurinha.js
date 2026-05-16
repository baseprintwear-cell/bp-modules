// BP Kids — Módulo Figurinha Copa 26
// Versão: 2026-05e — score simplificado, só nome obrigatório, upload silencioso

(function($){
  if(window._bpwFigModuleLoaded) return;
  window._bpwFigModuleLoaded = true;

  var BPW_GAS_URL = 'https://script.google.com/macros/s/AKfycbz--8MG4JD52jU2LFJWMD8kOFaEJTKF6Xq4778UB_387mMfo-JlAO7hlZyhB8vBYQbRUA/exec';
  window._bpwFotoOk = false;
  window._bpwFotoBase64 = null;
  window._bpwUploadFeito = false;

  $('head').append(`<style>
        #bpw-figurinha-module { margin: 16px 0; background: #f0f4ff; border: 2px solid #0038a8; border-radius: 12px; padding: 18px; font-family: Montserrat, sans-serif; }
        #bpw-figurinha-module h3 { margin: 0 0 14px 0; font-size: 15px; color: #0038a8; text-transform: uppercase; font-weight: 700; border-bottom: 2px solid #ffdc00; padding-bottom: 8px; }
        .bpw-fig-field { margin-bottom: 12px; }
        .bpw-fig-field label { display: block; font-size: 12px; font-weight: 700; color: #333; margin-bottom: 4px; text-transform: uppercase; }
        .bpw-fig-input { width: 100%; padding: 9px 12px; border: 1.5px solid #ccc; border-radius: 6px; font-size: 14px; font-family: Montserrat, sans-serif; box-sizing: border-box; }
        .bpw-fig-input:focus { border-color: #0038a8; outline: none; box-shadow: 0 0 0 3px rgba(0,56,168,0.15); }
        .bpw-fig-input.error { border-color: #c00; background: #fff5f5; }
        .bpw-fig-input.valid { border-color: #2a7a2a; background: #f0fff0; }
        #bpw-fig-upload-wrap { border: 2px dashed #0038a8; border-radius: 8px; padding: 16px; text-align: center; background: #fff; cursor: pointer; transition: background 0.2s; }
        #bpw-fig-upload-wrap:hover { background: #e8edff; }
        #bpw-fig-upload-wrap.has-photo { border-style: solid; border-color: #2a7a2a; background: #f0fff0; }
        #bpw-fig-upload-input { display: none; }
        #bpw-fig-preview { max-width: 120px; max-height: 120px; border-radius: 8px; margin: 8px auto 0; display: none; border: 2px solid #0038a8; }
        #bpw-fig-quality-bar-wrap { margin-top: 10px; display: none; }
        #bpw-fig-quality-label { font-size: 12px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
        #bpw-fig-quality-bar { height: 8px; border-radius: 4px; background: #eee; overflow: hidden; }
        #bpw-fig-quality-fill { height: 100%; width: 0%; border-radius: 4px; transition: width 0.5s, background 0.5s; }
        #bpw-fig-quality-msg { font-size: 13px; margin-top: 5px; font-weight: 600; }
        #bpw-fig-quality-nota { color: inherit; }
        #bpw-fig-quality-corte { font-size: 12px; margin-top: 4px; color: #c00; display:none; }
        #bpw-fig-upload-btn-label { display: inline-block; background: #0038a8; color: #fff; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 4px; }
        #bpw-fig-upload-instructions { font-size: 11px; color: #666; margin-top: 8px; line-height: 1.5; }
        #bpw-fig-upload-progress { display: none; font-size: 12px; color: #0038a8; margin-top: 8px; font-weight: 700; }
        #bpw-fig-aviso-geral { display: none; background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 10px 14px; font-size: 13px; color: #856404; margin-bottom: 12px; }
        .bpw-fig-campos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 400px) { .bpw-fig-campos-grid { grid-template-columns: 1fr; } }
      </style>`);

  function injetarModuloFigurinhas($after) {
      if ($('#bpw-figurinha-module').length) return; // já injetado
      var figHtml = `
        <div id="bpw-figurinha-module">
          <h3>⚽ Dados do Craque para a Figurinha</h3>
          <div id="bpw-fig-aviso-geral" style="display:none;background:#fff3cd;border:1px solid #ffc107;border-radius:6px;padding:10px 14px;font-size:13px;color:#856404;margin-bottom:12px">⚠ Preencha o nome, envie a foto e certifique-se que ela foi aprovada para continuar.</div>
          <div class="bpw-fig-campos-grid">
            <div class="bpw-fig-field">
              <label>Nome do Craque *</label>
              <input type="text" id="bpw-fig-nome" class="bpw-fig-input" maxlength="12" placeholder="Ex: ARTHUR" autocomplete="off" style="text-transform:uppercase">
            </div>
            <div class="bpw-fig-field">
              <label>Data de Nascimento</label>
              <input type="text" id="bpw-fig-nasc" class="bpw-fig-input" maxlength="10" placeholder="DD/MM/AAAA">
            </div>
            <div class="bpw-fig-field">
              <label>Altura</label>
              <input type="text" id="bpw-fig-alt" class="bpw-fig-input" maxlength="7" placeholder="1,20 m">
            </div>
            <div class="bpw-fig-field">
              <label>Peso</label>
              <input type="text" id="bpw-fig-peso" class="bpw-fig-input" maxlength="6" placeholder="25 kg">
            </div>
          </div>
          <div class="bpw-fig-field">
            <label>Time do Coração <small style="font-weight:normal;text-transform:none">(opcional)</small></label>
            <input type="text" id="bpw-fig-time" class="bpw-fig-input" maxlength="30" placeholder="SÃO PAULO (BRA)" style="text-transform:uppercase">
          </div>
          <div class="bpw-fig-field">
            <label>📸 Foto do Craque *</label>
            <div id="bpw-fig-upload-wrap">
              <p style="margin:0;font-size:13px;color:#0038a8;font-weight:700">Clique para escolher a foto</p>
              <label id="bpw-fig-upload-btn-label" for="bpw-fig-upload-input">Selecionar Foto</label>
              <input type="file" id="bpw-fig-upload-input" accept=".jpg,.jpeg,.png" capture="environment">
              
              <img id="bpw-fig-preview" src="" alt="Preview">
              <div id="bpw-fig-quality-bar-wrap">
                <div id="bpw-fig-quality-label">QUALIDADE DA IMAGEM:</div>
                <div style="display:flex;align-items:center;gap:10px">
                  <div id="bpw-fig-quality-bar" style="flex:1"><div id="bpw-fig-quality-fill"></div></div>
                  <div id="bpw-fig-quality-nota" style="font-size:15px;font-weight:700;min-width:36px;text-align:right"></div>
                </div>
                <div id="bpw-fig-quality-corte"></div>
                <div id="bpw-fig-quality-msg"></div>
              </div>
              <div id="bpw-fig-upload-progress"></div>
            </div>
          </div>
        </div>`
      $after.after(figHtml);
      bpwFigurinhaInit();
    }
    function bpwFigurinhaInit() {
      $(document).on('input','#bpw-fig-nasc',function(){
        var v=this.value.replace(/\D/g,'');
        if(v.length>=5) v=v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4,8);
        else if(v.length>=3) v=v.slice(0,2)+'/'+v.slice(2);
        this.value=v;
      });
      $(document).on('input','#bpw-fig-alt',function(){
        var v=this.value.replace(/[^\d,]/g,'');
        if(v.length>4) v=v.slice(0,4);
        this.value=v+' m';
        var pos=v.length; try{this.setSelectionRange(pos,pos);}catch(e){}
      });
      $(document).on('focus','#bpw-fig-alt',function(){
        this.value=this.value.replace(' m','').trim();
      });
      $(document).on('blur','#bpw-fig-alt',function(){
        var v=this.value.replace(/[^\d,]/g,'');
        if(v) this.value=v+' m';
      });
      $(document).on('input','#bpw-fig-peso',function(){
        var v=this.value.replace(/\D/g,'').slice(0,3);
        this.value=v+' kg';
        try{this.setSelectionRange(v.length,v.length);}catch(e){}
      });
      $(document).on('focus','#bpw-fig-peso',function(){
        this.value=this.value.replace(' kg','').trim();
      });
      $(document).on('blur','#bpw-fig-peso',function(){
        var v=this.value.replace(/\D/g,'');
        if(v) this.value=v+' kg';
      });
      $(document).on('input','#bpw-fig-nome',function(){
        var pos=this.selectionStart;
        this.value=this.value.toUpperCase();
        try{this.setSelectionRange(pos,pos);}catch(e){}
        bpwFigurinhaAtualizar();
      });
      // Time: sem valor default — placeholder já mostra o exemplo
      $(document).on('change','#bpw-fig-upload-input',function(){
        var file=this.files[0];
        if(!file) return;
        bpwValidarFoto(file);
      });
      $(document).on('click','#bpw-fig-upload-wrap',function(e){
        if($(e.target).is('input,label,img,div#bpw-fig-quality-bar,div#bpw-fig-quality-fill,div#bpw-fig-quality-bar-wrap,div#bpw-fig-quality-label,div#bpw-fig-quality-msg')) return;
        $('#bpw-fig-upload-input').trigger('click');
      });
      $(document).on('input','#bpw-fig-time',function(){
        this.value=this.value.toUpperCase();
        bpwFigurinhaAtualizar();
      });
      $(document).on('input change','#bpw-fig-nome,#bpw-fig-nasc,#bpw-fig-alt,#bpw-fig-peso,#bpw-fig-time',function(){
        bpwFigurinhaAtualizar();
      });
    }
    window._bpwFotoOk = false;
    window._bpwFotoBase64 = null;
    function bpwValidarFoto(file) {
      window._bpwFotoOk = false;
      window._bpwFotoBase64 = null;
      var $wrap = $('#bpw-fig-upload-wrap');
      var $msg = $('#bpw-fig-quality-msg');
      var $fill = $('#bpw-fig-quality-fill');
      var $barWrap = $('#bpw-fig-quality-bar-wrap');
      var $preview = $('#bpw-fig-preview');
      var $progress = $('#bpw-fig-upload-progress');
      if (file.size > 10 * 1024 * 1024) {
        $msg.text('❌ Arquivo muito grande (máx. 10MB). Escolha outra foto.').css('color','#c00');
        $fill.css({width:'100%',background:'#c00'});
        $barWrap.show(); $wrap.removeClass('has-photo');
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = e.target.result;
        window._bpwFotoBase64 = dataUrl.split(',')[1];
        $preview.attr('src', dataUrl).show();
        var img = new Image();
        img.onload = function() {
          var w = img.naturalWidth, h = img.naturalHeight;
          var fileSizeKB = file.size / 1024;
          var score = 0;
          var msgs = [];
          if (w >= 800 && h >= 800) { score += 40; }
          else if (w >= 500 && h >= 500) { score += 28; msgs.push('resolução moderada'); }
          else if (w >= 300 && h >= 300) { score += 15; msgs.push('resolução baixa'); }
          else { score += 0; msgs.push('resolução muito baixa'); }
          if (fileSizeKB >= 500) { score += 35; }
          else if (fileSizeKB >= 200) { score += 22; msgs.push('arquivo pequeno'); }
          else if (fileSizeKB >= 80) { score += 10; msgs.push('arquivo muito pequeno'); }
          else { score += 0; msgs.push('arquivo minúsculo'); }
          var ratio = w / h;
          if (ratio >= 0.6 && ratio <= 1.0) { score += 25; }
          else if (ratio >= 0.4 && ratio <= 1.4) { score += 15; }
          else { score += 5; msgs.push('proporção estranha'); }
          var pct = score;
          var nota = (pct / 10).toFixed(1);
          var ok;
          $('#bpw-fig-quality-tips').remove();
          $('#bpw-fig-quality-corte').hide().text('');
          $msg.text('').css('color','');
          if (pct > 80) {
            // Ótima — só status, sem mais nada
            ok = true;
            $fill.css({width: pct + '%', background: '#2a7a2a'});
            $('#bpw-fig-quality-nota').text(nota + '/10').css('color','#2a7a2a');
            $msg.text('✅ Aprovada! Pode continuar.').css('color','#2a7a2a');
          } else if (pct >= 50) {
            // Mediana — avança mas mostra 1 insight + foto exemplo
            ok = true;
            $fill.css({width: pct + '%', background: '#e07b00'});
            $('#bpw-fig-quality-nota').text(nota + '/10').css('color','#e07b00');
            $msg.text('⚠ Pode melhorar — mas já dá pra usar.').css('color','#e07b00');
            var dica = '';
            if (msgs.indexOf('resolução muito baixa') > -1 || msgs.indexOf('resolução baixa') > -1) {
              dica = 'Use a câmera traseira do celular, não a selfie.';
            } else if (msgs.indexOf('arquivo muito pequeno') > -1 || msgs.indexOf('arquivo minúsculo') > -1 || msgs.indexOf('arquivo pequeno') > -1) {
              dica = 'Use o arquivo original da foto, sem compressão.';
            } else if (msgs.indexOf('proporção estranha') > -1) {
              dica = 'Prefira foto vertical mostrando rosto e tronco.';
            } else if (msgs.length > 0) {
              dica = 'Uma foto com mais luz e resolução deixa a figurinha muito melhor.';
            }
            if (dica) {
              $msg.after('<div id="bpw-fig-quality-tips" style="margin:6px 0 0;font-size:12px;color:#6b4c00">'
                + '💡 ' + dica + '<br><img src="https://d1a9qnv764bsoo.cloudfront.net/stores/006/739/135/rte/14%20Tom_B.png" style="height:90px;margin-top:6px;border-radius:6px;opacity:.9" alt="Exemplo de boa foto"></div>');
            }
          } else {
            // Ruim — bloqueia + foto exemplo
            ok = false;
            $fill.css({width: pct + '%', background: '#c00'});
            $('#bpw-fig-quality-nota').text(nota + '/10').css('color','#c00');
            $msg.text('❌ Foto com qualidade baixa — a figurinha não vai ficar boa assim.').css('color','#c00');
            $('#bpw-fig-quality-corte').hide();
            $msg.after('<div id="bpw-fig-quality-tips" style="margin:8px 0 0;font-size:12px;text-align:center">'
              + '<div style="color:#555;margin-bottom:6px">Use uma foto assim como referência:</div>'
              + '<img src="https://d1a9qnv764bsoo.cloudfront.net/stores/006/739/135/rte/14%20Tom_B.png" style="height:105px;border-radius:6px;display:block;margin:0 auto 4px" alt="Exemplo de boa foto">'
              + '<span style="color:#888;font-size:11px">tronco pra cima · luz natural · de frente · câmera traseira</span></div>');
          }
          $barWrap.show();
          if (ok) {
            $wrap.addClass('has-photo');
            window._bpwFotoOk = true;
            bpwFigurinhaAtualizar();
          } else {
            $wrap.removeClass('has-photo');
            window._bpwFotoOk = false;
            bpwFigurinhaAtualizar();
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
    function bpwFigurinhaAtualizar() {
      var nome = $('#bpw-fig-nome').val().trim().toUpperCase();
      var nasc = $('#bpw-fig-nasc').val().trim();
      var alt  = $('#bpw-fig-alt').val().trim();
      var peso = $('#bpw-fig-peso').val().trim();
      var time = $('#bpw-fig-time').val().trim();
      // Feedback visual em tempo real por campo
      // Nome: obrigatório
      var $nome = $('#bpw-fig-nome');
      $nome.removeClass('error valid');
      if(nome) $nome.addClass('valid'); // verde se preenchido
      // Nasc: verde se completo, vermelho se digitou mas incompleto, azul se vazio
      var $nasc = $('#bpw-fig-nasc');
      $nasc.removeClass('error valid');
      if(nasc.length === 10) $nasc.addClass('valid');
      else if(nasc.length > 0) $nasc.addClass('error');
      // Alt, Peso, Time: opcionais — verde se preenchido, neutro se vazio
      var $alt = $('#bpw-fig-alt');
      $alt.removeClass('error valid');
      if(alt && alt !== 'm' && alt !== ' m') $alt.addClass('valid');
      var $peso = $('#bpw-fig-peso');
      $peso.removeClass('error valid');
      if(peso && peso !== 'kg' && peso !== ' kg') $peso.addClass('valid');
      var $time = $('#bpw-fig-time');
      $time.removeClass('error valid');
      if(time) $time.addClass('valid');
      var fotoOk = window._bpwFotoOk;
      var dados = 'Nome: '+nome+' | Nasc: '+nasc+' | Alt: '+alt+' | Peso: '+peso+' | Time: '+time;
      $('#bpw-h-figurinha').val(dados);
      // Upload para Drive: feito silenciosamente, sem mensagens de erro para o usuário
      if(window._bpwFotoOk && window._bpwFotoBase64 && !window._bpwUploadFeito && BPW_GAS_URL){
        window._bpwUploadFeito = true;
        var nomeArq = nome||'cliente';
        $.ajax({
          url: BPW_GAS_URL,
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({foto: window._bpwFotoBase64, nome: nomeArq, pedido: 'PENDENTE', tipo: 'image/jpeg'}),
          success: function(r){
            try{
              var res = typeof r==='string'?JSON.parse(r):r;
              if(res.ok){ $('#bpw-h-foto-drive').val(res.link); }
              else{ window._bpwUploadFeito=false; }
            }catch(ex){ window._bpwUploadFeito=false; }
          },
          error: function(){ window._bpwUploadFeito=false; }
        });
      }
    }
    function bpwFigurinhaValidarCompra() {
      // módulo só carrega em figurinha product — sem necessidade de checar
      var nome = $('#bpw-fig-nome').val().trim();
      var nasc = $('#bpw-fig-nasc').val().trim();
      var alt  = $('#bpw-fig-alt').val().trim();
      var peso = $('#bpw-fig-peso').val().trim();
      var time = $('#bpw-fig-time').val().trim();
      var fotoOk = window._bpwFotoOk;
      var erros = [];
      // Obrigatório: apenas nome e foto
      if(!nome) erros.push('#bpw-fig-nome');
      $('.bpw-fig-input').removeClass('error');
      erros.forEach(function(id){ $(id).addClass('error'); });
      if(erros.length>0||!fotoOk) {
        $('#bpw-fig-aviso-geral').show();
        $('#bpw-figurinha-module')[0].scrollIntoView({behavior:'smooth',block:'center'});
        return false;
      }
      $('#bpw-fig-aviso-geral').hide();
      return true;
    }



  // Expõe globalmente (usado pelo motor como fallback)
  window.injetarModuloFigurinhas = injetarModuloFigurinhas;
  window.bpwFigurinhaValidarCompra = bpwFigurinhaValidarCompra;

  // AUTO-INJEÇÃO: o módulo se injeta sozinho assim que o DOM estiver pronto
  // Não depende de chamada externa do motor
  var _figTentativas = 0;
  var _figInterval = setInterval(function() {
    _figTentativas++;
    if (_figTentativas > 40) { clearInterval(_figInterval); return; } // desiste após 20s

    // Verifica se estamos na página certa
    if (window.location.href.indexOf('craque-de-figurinha') === -1) {
      clearInterval(_figInterval); return;
    }

    // Aguarda o motor ter injetado o bp-container (prova que o DOM está pronto)
    if (!$('#bp-container').length) return;

    // Já injetado?
    if ($('#bpw-figurinha-module').length) { clearInterval(_figInterval); return; }

    // Encontra ponto de injeção: após o bloco de estampa ou após variation-id=1
    var $alvo = $('#bpw-bloco-estampa');
    if (!$alvo.length) $alvo = $('.js-product-variants-group[data-variation-id="1"]');
    if (!$alvo.length) return; // ainda não está no DOM

    injetarModuloFigurinhas($alvo);
    clearInterval(_figInterval);
    console.log('BP Figurinha: módulo injetado com sucesso');
    // Pré-selecionar: SIM costas + INSERIR NOME (nativo deste produto)
    setTimeout(function() {
      // Forçar SIM personalizar costas
      var $simBtn = $('.js-insta-variant[data-variation-id="1"]').filter(function() {
        return ($(this).attr('title')||'').toUpperCase().indexOf('SIM') > -1;
      });
      if ($simBtn.length && !$simBtn.hasClass('selected')) $simBtn[0].click();
      // Forçar INSERIR NOME nas costas
      $('label, .js-variant-option').each(function() {
        var t = $(this).text().toUpperCase();
        if (t.indexOf('INSERIR') > -1 && t.indexOf('NOME') > -1) {
          if (!$(this).hasClass('selected')) $(this).trigger('click');
        }
      });
    }, 400);
  }, 500);

})(jQuery);
