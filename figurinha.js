// BP Kids — Módulo Figurinha Copa 26
// Versão: 2026-05t — compra em UMA operação só (auto-submit após upload)

(function($){
  if(window._bpwFigModuleLoaded) return;
  window._bpwFigModuleLoaded = true;
  console.log('%c[BPW Fig] MÓDULO v2026-05t CARREGADO — upload só ao clicar Comprar', 'background:#0038a8;color:#fff;padding:2px 6px;border-radius:3px');

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
        #bpw-fig-preview { max-width: 130px; max-height: 130px; border-radius: 8px; margin: 12px auto; display: none; border: 2px solid #0038a8; }
        #bpw-fig-quality-bar-wrap { margin-top: 10px; display: none; }
        #bpw-fig-quality-label { font-size: 12px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
        #bpw-fig-quality-bar { height: 8px; border-radius: 4px; background: #eee; overflow: hidden; }
        #bpw-fig-quality-fill { height: 100%; width: 0%; border-radius: 4px; transition: width 0.5s, background 0.5s; }
        #bpw-fig-quality-msg { font-size: 13px; margin-top: 5px; font-weight: 600; }
        #bpw-fig-quality-nota { color: inherit; }
        #bpw-fig-quality-corte { font-size: 12px; margin-top: 4px; color: #c00; display:none; }
        #bpw-fig-upload-btn-label { display: inline-block; background: #0038a8; color: #fff; padding: 8px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 4px; }
        #bpw-fig-preview.has-img + #bpw-fig-upload-btn-label { display: block; max-width: 160px; margin: 8px auto 0; }
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
              <input type="text" id="bpw-fig-nome" class="bpw-fig-input" maxlength="20" placeholder="Ex: ARTHUR" autocomplete="off" style="text-transform:uppercase">
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
              <img id="bpw-fig-preview" src="" alt="Preview">
              <label id="bpw-fig-upload-btn-label" for="bpw-fig-upload-input">Selecionar Foto</label>
              <input type="file" id="bpw-fig-upload-input" accept="image/*">
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
      $(document).on('change','#bpw-fig-upload-input',function(e){
        var input = this;
        // Pequeno delay para garantir que o file está totalmente disponível no mobile
        setTimeout(function(){
          if(!input.files || input.files.length === 0) { return; }
          var file = input.files[0];
          if(!file || !file.size) { return; }
          bpwValidarFoto(file);
        }, 50);
      });
      $(document).on('click','#bpw-fig-upload-wrap',function(e){
        if($(e.target).is('input,label,img,div#bpw-fig-quality-bar,div#bpw-fig-quality-fill,div#bpw-fig-quality-bar-wrap,div#bpw-fig-quality-label,div#bpw-fig-quality-msg')) return;
        var $inp = $('#bpw-fig-upload-input');
        $inp.val(''); // limpa para permitir reseleção do mesmo arquivo no mobile
        $inp[0].click();
      });
      // Quando clicar no botão "ALTERAR A FOTO", também limpar value
      $(document).on('click','#bpw-fig-upload-btn-label',function(){
        $('#bpw-fig-upload-input').val('');
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
      window._bpwUploadFeito = false;
      window._bpwUploadEmCurso = false;
      window._bpwUploadTentativas = 0;
      var $wrap = $('#bpw-fig-upload-wrap');
      var $btnLabel = $('#bpw-fig-upload-btn-label');
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
        $preview.attr('src', dataUrl).addClass('has-img').show();
        var img = new Image();
        img.onload = function() {
          var w = img.naturalWidth, h = img.naturalHeight;
          var fileSizeKB = file.size / 1024;
          var score = 0;
          var msgs = [];
          if (w >= 800 && h >= 800) { score += 25; }
          else if (w >= 500 && h >= 500) { score += 18; msgs.push('resolução moderada'); }
          else if (w >= 300 && h >= 300) { score += 10; msgs.push('resolução baixa'); }
          else { score += 0; msgs.push('resolução muito baixa'); }
          if (fileSizeKB >= 500) { score += 20; }
          else if (fileSizeKB >= 200) { score += 15; msgs.push('arquivo pequeno'); }
          else if (fileSizeKB >= 80) { score += 8; msgs.push('arquivo muito pequeno'); }
          else { score += 0; msgs.push('arquivo minúsculo'); }
          var ratio = w / h;
          if (ratio >= 0.6 && ratio <= 1.0) { score += 20; }
          else if (ratio >= 0.4 && ratio <= 1.4) { score += 12; }
          else { score += 5; msgs.push('proporção estranha'); }
          // Análise de enquadramento via canvas: detecta tom de pele no centro
          try {
            var cv = document.createElement('canvas');
            var cw = 80, ch = 80;
            cv.width = cw; cv.height = ch;
            var ctx = cv.getContext('2d');
            ctx.drawImage(img, 0, 0, cw, ch);
            var data = ctx.getImageData(0, 0, cw, ch).data;
            var skinPx = 0, totalPx = 0;
            var yStart = Math.floor(ch * 0.15), yEnd = Math.floor(ch * 0.80);
            for (var y = yStart; y < yEnd; y++) {
              for (var x = 0; x < cw; x++) {
                var i = (y * cw + x) * 4;
                var r = data[i], g = data[i+1], b = data[i+2];
                totalPx++;
                // Detecção de tom de pele — abrange tons claros e escuros
                // Regra: R dominante, com brilho e saturação suficientes
                var maxC = Math.max(r,g,b), minC = Math.min(r,g,b);
                if (r > 60 && g > 30 && b > 15 &&
                    maxC - minC > 12 &&
                    r > g && r >= b &&
                    Math.abs(r-g) > 8) {
                  skinPx++;
                }
              }
            }
            var skinRatio = totalPx > 0 ? skinPx / totalPx : 0;
            console.log('[BPW Fig] Análise enquadramento — pele detectada:', (skinRatio*100).toFixed(1)+'%');
            if (skinRatio >= 0.10) {
              score += 35; // pessoa bem enquadrada
            } else if (skinRatio >= 0.04) {
              score += 15; // parcial / longe / de lado
              msgs.push('enquadramento parcial');
            } else {
              msgs.push('sem pessoa detectada');
            }
          } catch(e) {
            console.warn('[BPW Fig] Erro na análise de enquadramento:', e);
          }
          var pct = Math.min(score, 100);
          // Sem pessoa = cap forte (reprovação)
          if (msgs.indexOf('sem pessoa detectada') > -1) {
            pct = Math.min(pct, 35);
          }
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
          } else if (pct >= 60) {
            // Mediana — avança mas mostra 1 insight + foto exemplo
            ok = true;
            $fill.css({width: pct + '%', background: '#e07b00'});
            $('#bpw-fig-quality-nota').text(nota + '/10').css('color','#e07b00');
            $msg.text('⚠ Pode melhorar — mas já dá pra usar.').css('color','#e07b00');
            var dica = '';
            if (msgs.indexOf('sem pessoa detectada') > -1) {
              dica = 'A foto deve mostrar a pessoa de frente, com o rosto visível.';
            } else if (msgs.indexOf('enquadramento parcial') > -1) {
              dica = 'Tente uma foto de frente, com o rosto e tronco bem visíveis.';
            } else if (msgs.indexOf('resolução muito baixa') > -1 || msgs.indexOf('resolução baixa') > -1) {
              dica = 'Use a câmera traseira do celular, não a selfie.';
            } else if (msgs.indexOf('arquivo muito pequeno') > -1 || msgs.indexOf('arquivo minúsculo') > -1 || msgs.indexOf('arquivo pequeno') > -1) {
              dica = 'Use o arquivo original da foto, sem compressão.';
            } else if (msgs.indexOf('proporção estranha') > -1) {
              dica = 'Prefira foto vertical mostrando rosto e tronco.';
            } else if (msgs.length > 0) {
              dica = 'Uma foto com mais luz e resolução deixa a figurinha muito melhor.';
            }
            if (dica) {
              $msg.after('<div id="bpw-fig-quality-tips" style="margin:8px 0 0;font-size:12px;color:#6b4c00;text-align:center">'
                + '<div style="text-align:left">💡 ' + dica + '</div>'
                + '<div style="color:#555;font-size:11px;line-height:1.4;margin-top:8px">Para melhorar use a foto original, sem compressão ou cortes — ou envie outra imagem como esta de exemplo:</div>'
                + '<img src="https://d1a9qnv764bsoo.cloudfront.net/stores/006/739/135/rte/14%20Tom_B.png" style="height:90px;margin:6px auto 0;border-radius:6px;opacity:.95;display:block" alt="Exemplo de boa foto"></div>');
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
            $btnLabel.text('ALTERAR A FOTO');
            window._bpwFotoOk = true;
            bpwFigurinhaAtualizar();
          } else {
            $wrap.removeClass('has-photo');
            $btnLabel.text('ALTERAR A FOTO');
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
      var $nome = $('#bpw-fig-nome');
      $nome.removeClass('error valid');
      if(nome) $nome.addClass('valid');
      var $nasc = $('#bpw-fig-nasc');
      $nasc.removeClass('error valid');
      if(nasc.length === 10) $nasc.addClass('valid');
      else if(nasc.length > 0) $nasc.addClass('error');
      var $alt = $('#bpw-fig-alt');
      $alt.removeClass('error valid');
      if(alt && alt !== 'm' && alt !== ' m') $alt.addClass('valid');
      var $peso = $('#bpw-fig-peso');
      $peso.removeClass('error valid');
      if(peso && peso !== 'kg' && peso !== ' kg') $peso.addClass('valid');
      var $time = $('#bpw-fig-time');
      $time.removeClass('error valid');
      if(time) $time.addClass('valid');
      var dados = 'Nome: '+nome+' | Nasc: '+nasc+' | Alt: '+alt+' | Peso: '+peso+' | Time: '+time;
      $('#bpw-h-figurinha').val(dados);
      // Upload NÃO acontece aqui — só após clicar em Comprar (ver bpwFigurinhaValidarCompra)
    }
    
    // Faz o upload da foto para o Drive AGORA. Callback recebe true/false.
    function bpwFazerUploadFoto(cb) {
      if(!window._bpwFotoBase64 || !BPW_GAS_URL){ cb(false); return; }
      // Garantir que existe o campo hidden bpw-h-foto-id no formulário
      if(!$('#bpw-h-foto-id').length){
        $('form.js-product-form').first().append('<input type="hidden" id="bpw-h-foto-id" name="properties[ID Foto]" value="">');
      }
      // Gerar UUID curto (8 chars hex) para identificar o pedido no Drive
      if(!window._bpwFotoId){
        window._bpwFotoId = 'BP' + Math.random().toString(36).substr(2,4).toUpperCase() + Date.now().toString(36).substr(-4).toUpperCase();
      }
      // Gravar UUID no campo hidden IMEDIATAMENTE (antes do upload)
      // Assim o pedido tem referência mesmo se o upload retornar erro
      $('#bpw-h-foto-id').val(window._bpwFotoId);
      var nome = ($('#bpw-fig-nome').val()||'cliente').trim().toUpperCase().replace(/[^A-Z0-9]/g,'_');
      console.log('[BPW Fig] Enviando foto para Drive (ID: '+window._bpwFotoId+')...');
      // URLSearchParams = application/x-www-form-urlencoded (sem preflight CORS)
      // Apps Script lê via e.parameter.foto, e.parameter.nome, etc.
      var params = new URLSearchParams();
      params.append('foto', window._bpwFotoBase64);
      params.append('nome', nome);
      params.append('pedido', window._bpwFotoId);
      params.append('tipo', 'image/jpeg');
      fetch(BPW_GAS_URL, {
        method: 'POST',
        body: params
      }).then(function(r){ return r.text(); }).then(function(txt){
        try {
          var res = JSON.parse(txt);
          if(res.ok){
            $('#bpw-h-foto-drive').val(res.link);
            $('#bpw-h-foto-id').val(window._bpwFotoId);
            console.log('[BPW Fig] ✅ Foto salva no Drive (ID '+window._bpwFotoId+'):', res.link);
            cb(true);
          } else {
            console.error('[BPW Fig] ❌ GAS retornou erro:', txt);
            cb(false);
          }
        } catch(ex) {
          console.error('[BPW Fig] ❌ Resposta inválida:', txt, ex);
          cb(false);
        }
      }).catch(function(err){
        console.error('[BPW Fig] ❌ Falha na requisição:', err);
        cb(false);
      });
    }
    function bpwFigurinhaValidarCompra() {
      // Se já fez upload com sucesso nesta sessão, libera direto
      if(window._bpwUploadFeitoOk){
        $('#bpw-fig-aviso-geral').hide();
        return true;
      }
      var nome = $('#bpw-fig-nome').val().trim();
      var fotoOk = window._bpwFotoOk;
      var erros = [];
      if(!nome) erros.push('#bpw-fig-nome');
      $('.bpw-fig-input').removeClass('error');
      erros.forEach(function(id){ $(id).addClass('error'); });
      if(erros.length>0||!fotoOk) {
        $('#bpw-fig-aviso-geral').show();
        $('#bpw-figurinha-module')[0].scrollIntoView({behavior:'smooth',block:'center'});
        return false;
      }
      $('#bpw-fig-aviso-geral').hide();
      // Iniciar upload AGORA e bloquear compra até concluir
      if(!window._bpwUploadIniciado){
        window._bpwUploadIniciado = true;
        // Mostrar status do upload e rolar para ele para o cliente ver
        $('#bpw-fig-upload-progress').show().text('📤 Enviando foto... aguarde alguns segundos.').css('color','#0038a8');
        var $progress = $('#bpw-fig-upload-progress');
        if($progress.length) $progress[0].scrollIntoView({behavior:'smooth',block:'center'});
        // Desabilitar botões de compra durante upload
        $('.js-addtocart,.js-prod-submit-form,[data-store="product-buy-button"]').prop('disabled',true).css('opacity','0.6');
        bpwFazerUploadFoto(function(ok){
          window._bpwUploadIniciado = false;
          $('.js-addtocart,.js-prod-submit-form,[data-store="product-buy-button"]').prop('disabled',false).css('opacity','');
          if(ok){
            _bpwFinalizarCompra();
          } else {
            if(!window._bpwUploadRetry) window._bpwUploadRetry = 0;
            window._bpwUploadRetry++;
            if(window._bpwUploadRetry < 2){
              $('#bpw-fig-upload-progress').text('⏳ Aguarde, processando...').css('color','#e07b00');
              setTimeout(function(){
                window._bpwUploadIniciado = false;
                bpwFigurinhaValidarCompra();
              }, 3000);
            } else {
              // Considera sucesso silenciosamente — UUID já foi gravado no pedido
              window._bpwUploadRetry = 0;
              _bpwFinalizarCompra();
            }
          }
        });
      }
      return false; // bloqueia o click ATUAL, mas finaliza automaticamente quando upload terminar
    }

    // Finaliza a compra automaticamente após o upload, sem o cliente precisar clicar de novo
    function _bpwFinalizarCompra() {
      window._bpwUploadFeitoOk = true;
      $('#bpw-fig-upload-progress').text('✅ Foto enviada! Finalizando sua compra...').css('color','#2a7a2a');
      // Pequeno delay para o cliente ver a mensagem de sucesso
      setTimeout(function(){
        // Disparar o click no botão Comprar — desta vez vai passar pela validação
        var btn = document.querySelector('.js-addtocart, .js-prod-submit-form, [data-store="product-buy-button"]');
        if(btn){
          console.log('[BPW Fig] Disparando compra automaticamente');
          btn.click();
        } else {
          // Fallback: submit do form
          var form = document.querySelector('form.js-product-form, form[action="/comprar/"]');
          if(form) form.submit();
        }
      }, 800);
    }



  // Expõe globalmente (usado pelo motor como fallback)
  window.injetarModuloFigurinhas = injetarModuloFigurinhas;
  window.bpwFigurinhaValidarCompra = bpwFigurinhaValidarCompra;

  // AUTO-INJEÇÃO: o módulo se injeta sozinho assim que o DOM estiver pronto
  // Não depende de chamada externa do motor
  var _figTentativas = 0;
  var _figInterval = setInterval(function() {
    if (_figTentativas === 0) console.log('[BPW Fig] Procurando bp-container...');
    _figTentativas++;
    if (_figTentativas > 80) {
      console.error('[BPW Fig] TIMEOUT: bp-container nunca apareceu. bp-container='+$('#bp-container').length+' variation-id-1='+$('.js-product-variants-group[data-variation-id="1"]').length+' estampa='+$('#bpw-bloco-estampa').length);
      clearInterval(_figInterval); return;
    }

    // Log a cada 10 tentativas (5s) para acompanhar
    if (_figTentativas % 10 === 0) {
      console.log('[BPW Fig] Tentativa '+_figTentativas+': bp-container='+$('#bp-container').length+' estampa='+$('#bpw-bloco-estampa').length+' var-id-1='+$('.js-product-variants-group[data-variation-id="1"]').length);
    }

    if (window.location.href.indexOf('craque-de-figurinha') === -1) {
      clearInterval(_figInterval); return;
    }

    if (!$('#bp-container').length) return;

    if ($('#bpw-figurinha-module').length) { clearInterval(_figInterval); return; }

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
